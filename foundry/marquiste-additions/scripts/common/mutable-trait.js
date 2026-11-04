// The Mutable traits: "Mutable Acid", "Mutable Poison", "Mutable Fire" and so on, one for each damage type, like PF2e's Versatile traits. Versatile lets
// you pick the damage type on the Strike; Mutable lets each target decide. Damage of the item's own type, or of the type an effect on a weapon adds,
// can change to the named type against any creature for which that type is better. It does this through PF2e's own damage redirect: when the damage
// roll is made, the roll is told that the item's type may become the mutable type, and PF2e then works out, for each target the damage is applied to,
// whether the target's immunities and resistances make the other type the better choice.
const PREFIX = "mutable-";

// Every list a trait can be shown from: items, effects, actions, and the list a Strike row reads (npcAttackTraits).
const LISTS = [
  "actionTraits",
  "armorTraits",
  "consumableTraits",
  "creatureTraits",
  "effectTraits",
  "equipmentTraits",
  "featTraits",
  "npcAttackTraits",
  "shieldTraits",
  "spellTraits",
  "weaponTraits",
];

// "Mutable Acid" and so on. PF2e's damage type names are translation keys that may not be loaded yet when the module starts, so fall back to the
// capitalised type, and set the labels again once the translations are ready.
function registerTraits() {
  CONFIG.PF2E.traitsDescriptions ??= {};
  for (const [type, key] of Object.entries(CONFIG.PF2E.damageTypes ?? {})) {
    const localized = game.i18n.localize(key);
    const name = localized && localized !== key ? localized : type.charAt(0).toUpperCase() + type.slice(1);
    const slug = `${PREFIX}${type}`;
    for (const list of LISTS) {
      if (CONFIG.PF2E[list]) CONFIG.PF2E[list][slug] = `Mutable ${name}`;
    }
    CONFIG.PF2E.traitsDescriptions[slug] =
      `Damage from this item, or from an effect it creates, can change to ${type} damage against a creature for which that is the better type. ` +
      `A creature immune to the original damage type takes ${type} damage instead, and one that resists the original type more than ${type} takes ${type} damage.`;
  }
}

Hooks.once("init", registerTraits);
Hooks.once("i18nInit", registerTraits);

const mutableTypes = (traits) => traits.filter((t) => t.startsWith(PREFIX)).map((t) => t.slice(PREFIX.length));

// The damage types a Mutable trait on this item or effect can change, paired with the type it changes to.
function mutations(actor, origin) {
  const pairs = [];
  const add = (from, to) => {
    if (from && to && from !== to && !pairs.some((p) => p.from === from && p.to === to)) pairs.push({ from, to });
  };
  const weaponId = origin?.uuid?.split(".Item.").at(1) ?? null;
  const weapon = weaponId ? actor.items.get(weaponId) : null;

  // The attacking item: its own damage type.
  if (weapon?.type === "weapon") {
    for (const to of mutableTypes(weapon.system.traits.value)) add(weapon.system.damage?.damageType, to);
  }

  // An effect on the weapon (a Toxic Coating): the damage types its rules add. An effect not tied to a weapon counts for any weapon.
  for (const effect of actor.itemTypes.effect) {
    if (effect.isExpired) continue;
    const targets = mutableTypes(effect.system.traits.value);
    if (!targets.length) continue;
    const chosen = effect.flags.pf2e?.rulesSelections?.weapon;
    if (chosen && chosen !== weaponId) continue;
    const added = effect.system.rules.filter((r) => ["DamageDice", "FlatModifier"].includes(r.key) && typeof r.damageType === "string").map((r) => r.damageType);
    for (const from of added) for (const to of targets) add(from, to);
  }
  return pairs;
}

Hooks.on("preCreateChatMessage", (message) => {
  const context = message.flags?.pf2e?.context;
  if (context?.type !== "damage-roll") return;
  const actor = ChatMessage.getSpeakerActor(message.speaker);
  if (!actor) return;
  const pairs = mutations(actor, message.flags.pf2e.origin);
  if (!pairs.length) return;

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
      for (const pair of pairs) {
        if (!list.some((r) => r.from === pair.from && r.to === pair.to)) list.push({ ...pair });
      }
    }
    return typeof json === "string" ? JSON.stringify(data) : data;
  });
  message.updateSource({ rolls });
});
