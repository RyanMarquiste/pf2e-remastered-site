// Toxicologist Field Benefit: with the "Effect: Toxicologist Field Benefit" on a character, damage from their infused attacks and infused effects
// can switch between acid and poison depending on the target. It does this through PF2e's own damage redirect: when the damage roll is made,
// the roll is told that poison may become acid and acid may become poison, and PF2e then works out, for each target it is applied to, whether
// the target's immunities and resistances make the other type the better choice.
const OPTION = "toxicologist-field-benefit-auto";
const PAIRS = [
  { from: "poison", to: "acid" },
  { from: "acid", to: "poison" },
];

Hooks.on("preCreateChatMessage", (message) => {
  const context = message.flags?.pf2e?.context;
  if (context?.type !== "damage-roll") return;
  const actor = ChatMessage.getSpeakerActor(message.speaker);
  if (!actor?.rollOptions?.all?.[OPTION]) return;

  // An infused attack, or any infused effect (such as a Toxic Coating) on the character.
  const infusedAttack = (context.options ?? []).includes("item:trait:infused");
  const infusedEffect = actor.itemTypes.effect.some((e) => !e.isExpired && e.system.traits.value.includes("infused"));
  if (!infusedAttack && !infusedEffect) return;

  const rolls = message.toObject().rolls.map((json) => {
    const data = typeof json === "string" ? JSON.parse(json) : foundry.utils.deepClone(json);
    data.options ??= {};
    const bypass = (data.options.bypass ??= {
      immunity: { ignore: [], downgrade: [], redirect: [] },
      resistance: { ignore: [], redirect: [] },
    });
    bypass.immunity.redirect ??= [];
    bypass.resistance.redirect ??= [];
    for (const list of [bypass.immunity.redirect, bypass.resistance.redirect]) {
      for (const pair of PAIRS) {
        if (!list.some((r) => r.from === pair.from && r.to === pair.to)) list.push({ ...pair });
      }
    }
    return typeof json === "string" ? JSON.stringify(data) : data;
  });
  message.updateSource({ rolls });
});

// Toxic Coatings follow the Injury trait. On a weapon that doesn't use ammunition, the first successful Strike uses the coating up (a damage roll
// is only made on a hit, so rolling the coated weapon's damage means it hit), and so does a critical failure; a miss leaves it on. On a weapon that
// fires ammunition the poison is really on the ammunition, so firing uses it up: a miss spends it at once, and a hit spends it once that shot's
// damage has been rolled. (It also ends on its own at the end of the turn.)
const MODULE = "marquiste-additions";

async function coatedWeapon(message) {
  if (message.author?.id !== game.user.id) return null;
  const weaponUuid = message.flags?.pf2e?.origin?.uuid;
  if (!weaponUuid) return null;
  const weapon = await fromUuid(weaponUuid);
  const actor = weapon?.actor;
  if (!actor) return null;
  const coatings = actor.itemTypes.effect.filter(
    (e) => /^Effect: (Advanced )?Toxic Coating/.test(e.name) && e.flags.pf2e?.rulesSelections?.weapon === weapon.id,
  );
  return coatings.length ? { actor, weapon, coatings } : null;
}

async function spend({ actor, weapon, coatings }, reason) {
  await actor.deleteEmbeddedDocuments("Item", coatings.map((e) => e.id));
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<p>The Toxic Coating on ${weapon.name} is used up ${reason}.</p>`,
  });
}

Hooks.on("createChatMessage", async (message) => {
  const context = message.flags?.pf2e?.context;
  if (context?.type !== "damage-roll" && context?.type !== "attack-roll") return;
  const found = await coatedWeapon(message);
  if (!found) return;

  if (context.type === "damage-roll") return spend(found, "by the hit");

  // An attack roll. A coating left over from an earlier shot of an ammunition weapon is already spent.
  const stale = found.coatings.filter((e) => e.getFlag(MODULE, "fired"));
  if (stale.length) await spend({ ...found, coatings: stale }, "with the ammunition it was on");
  const coatings = found.coatings.filter((e) => !e.getFlag(MODULE, "fired"));
  if (!coatings.length) return;

  if (found.weapon.system.ammo) {
    if (["failure", "criticalFailure"].includes(context.outcome)) return spend({ ...found, coatings }, "with the ammunition it was on, which missed");
    for (const coating of coatings) await coating.setFlag(MODULE, "fired", true); // spent once this shot's damage is rolled
  } else if (context.outcome === "criticalFailure") {
    return spend({ ...found, coatings }, "by the critical failure");
  }
});
