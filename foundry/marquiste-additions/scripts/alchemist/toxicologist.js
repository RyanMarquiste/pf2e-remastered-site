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
