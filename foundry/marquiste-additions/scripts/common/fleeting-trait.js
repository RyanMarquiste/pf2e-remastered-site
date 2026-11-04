// Adds the site's Fleeting trait to PF2e's trait lists so items, effects, actions and spells can carry it.
const TRAIT = "fleeting";
const LABEL = "Fleeting";
const DESCRIPTION =
  "This item, spell, effect, or creature lasts only until the end of the turn on which it was created or summoned. After that time it vanishes, " +
  "is destroyed, disappears, becomes inert, or otherwise is no longer usable for its current purpose. This is equivalent to having a duration until " +
  "the end of the current turn, and it can't be extended unless the extension specifically says it extends Fleeting.";

// The lists PF2e's own homebrew traits are added to, including the ones they propagate to.
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

Hooks.once("init", () => {
  for (const key of LISTS) {
    if (CONFIG.PF2E[key]) CONFIG.PF2E[key][TRAIT] = LABEL;
  }
  // The Toxic Coating effects carry the Infused trait, which PF2e only lists for items.
  if (CONFIG.PF2E.effectTraits) CONFIG.PF2E.effectTraits.infused ??= CONFIG.PF2E.equipmentTraits?.infused ?? "PF2E.TraitInfused";
  CONFIG.PF2E.traitsDescriptions ??= {};
  CONFIG.PF2E.traitsDescriptions[TRAIT] = DESCRIPTION;
});
