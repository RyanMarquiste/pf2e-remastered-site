// Injury poisons: using any injury poison asks which weapon to poison, tags that weapon and adds a note, and the poison is used up the way
// the Injury trait says: by the first successful Strike (when the hit's damage is rolled) or by a critical failure, while a miss leaves it on.
// On a weapon that fires ammunition the poison is really on the ammunition, so firing the weapon uses it up. The same rules spend the
// Toxicologist's Toxic Coatings. A hit by a poisoned weapon posts the poison's description and saving throw, which the GM resolves.
import { MODULE } from "./common.js";
import { coatableWeapons, pickWeapon } from "./quick-vial.js";

const enrich = (html) => (foundry.applications.ux?.TextEditor?.implementation ?? TextEditor).enrichHTML(html);

// A chat card for the use of an injury poison from the inventory: PF2e posts it as the poison is used up.
Hooks.on("createChatMessage", async (message) => {
  if (message.author?.id !== game.user.id) return;
  const origin = message.flags?.pf2e?.origin;
  if (origin?.type !== "consumable" || message.flags.pf2e.context) return;
  if (/chat-card|item-card|data-item-id/.test(message.content)) return; // an item sent to chat, not used

  const poison = (origin.sourceId && (await fromUuid(origin.sourceId))) || (await fromUuid(origin.uuid));
  if (poison?.type !== "consumable" || poison.system.category !== "poison" || !poison.system.traits.value.includes("injury")) return;
  const actor = ChatMessage.getSpeakerActor(message.speaker);
  if (!actor) return;

  const weapons = coatableWeapons(actor);
  if (!weapons.length) {
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: `<p>${actor.name} has no weapon they are holding or wearing that deals piercing or slashing damage, so the ${poison.name} is wasted.</p>`,
    });
    return ui.notifications.warn(`${actor.name} has no held or worn weapon that deals piercing or slashing damage.`);
  }
  const weapon = await pickWeapon(actor, weapons);
  if (!weapon) return;

  // A weapon carries one poison at a time: a new one replaces any older one.
  const old = actor.itemTypes.effect.filter((e) => e.getFlag(MODULE, "injuryPoison")?.weapon === weapon.id);
  if (old.length) await actor.deleteEmbeddedDocuments("Item", old.map((e) => e.id));

  const spent = weapon.system.ammo
    ? "It is on the ammunition, so it is used up when the weapon is fired."
    : "It is used up by the first successful Strike or a critical failure.";
  const note = `Poisoned with ${poison.name}. ${spent}`;
  const tag = (value) => ({ key: "ItemAlteration", itemType: "weapon", mode: "add", predicate: [`item:id:${weapon.id}`], property: "other-tags", value });
  await actor.createEmbeddedDocuments("Item", [
    {
      name: `Poisoned Weapon: ${poison.name}`,
      type: "effect",
      img: poison.img,
      flags: { [MODULE]: { injuryPoison: { weapon: weapon.id, poison: poison.uuid } } },
      system: {
        description: { value: `<p>${weapon.name} is poisoned with @UUID[${poison.uuid}]{${poison.name}}. ${spent}</p>` },
        duration: { expiry: null, sustained: false, unit: "unlimited", value: -1 },
        level: { value: poison.system.level?.value ?? 1 },
        rules: [
          tag("poisoned"),
          tag("injury-poison"),
          { key: "ItemAlteration", itemType: "weapon", label: " ", mode: "add", predicate: [`item:id:${weapon.id}`], property: "description", value: [{ title: poison.name, text: note }] },
        ],
        start: { initiative: null, value: 0 },
        tokenIcon: { show: true },
        traits: { rarity: "common", value: ["injury", "poison"] },
      },
    },
  ]);
  ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<p>${actor.name} poisons ${weapon.name} with ${poison.name}. ${spent}</p>` });
});

// What is on a weapon: its Toxic Coatings and any injury poison applied to it.
function poisonsOn(actor, weapon) {
  return actor.itemTypes.effect.filter(
    (e) => (/^Effect: (Advanced )?Toxic Coating/.test(e.name) && e.flags.pf2e?.rulesSelections?.weapon === weapon.id) || e.getFlag(MODULE, "injuryPoison")?.weapon === weapon.id,
  );
}

async function spend(actor, weapon, effects, reason, hit = null) {
  await actor.deleteEmbeddedDocuments("Item", effects.map((e) => e.id));
  for (const effect of effects) {
    const flag = effect.getFlag(MODULE, "injuryPoison");
    const name = flag ? effect.name.replace("Poisoned Weapon: ", "") : effect.name.replace("Effect: ", "");
    let card = "";
    if (flag && hit) {
      const poison = await fromUuid(flag.poison);
      const target = hit.target?.token ? (await fromUuid(hit.target.token))?.name : null;
      card = `<hr><p><strong>${target ?? "The target"}</strong> is exposed to the poison. The GM resolves it.</p>${poison ? await enrich(poison.system.description.value) : ""}`;
    }
    ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<p>The ${name} on ${weapon.name} is used up ${reason}.</p>${card}` });
  }
}

Hooks.on("createChatMessage", async (message) => {
  const context = message.flags?.pf2e?.context;
  if (context?.type !== "damage-roll" && context?.type !== "attack-roll") return;
  if (message.author?.id !== game.user.id) return;
  const weaponUuid = message.flags.pf2e.origin?.uuid;
  const weapon = weaponUuid ? await fromUuid(weaponUuid) : null;
  const actor = weapon?.actor;
  if (!actor || weapon.type !== "weapon") return;
  const all = poisonsOn(actor, weapon);
  if (!all.length) return;

  if (context.type === "damage-roll") return spend(actor, weapon, all, "by the hit", context);

  // An attack roll. A poison left over from an earlier shot of an ammunition weapon is already spent.
  const stale = all.filter((e) => e.getFlag(MODULE, "fired"));
  if (stale.length) await spend(actor, weapon, stale, "with the ammunition it was on");
  const poisons = all.filter((e) => !e.getFlag(MODULE, "fired"));
  if (!poisons.length) return;

  if (weapon.system.ammo) {
    if (["failure", "criticalFailure"].includes(context.outcome)) return spend(actor, weapon, poisons, "with the ammunition it was on, which missed");
    for (const effect of poisons) await effect.setFlag(MODULE, "fired", true); // spent once this shot's damage is rolled
  } else if (context.outcome === "criticalFailure") {
    return spend(actor, weapon, poisons, "by the critical failure");
  }
});
