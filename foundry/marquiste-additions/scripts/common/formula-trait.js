// The Formula trait. An item with it is a formula: a record of how to craft another item, found by trait in the Compendium Browser and put in a
// formula book. It is only a label, so it is registered in the lists PF2e shows traits from and filters the Compendium Browser by.
const SLUG = "formula";

// The label is fixed text, so there is nothing to translate; set it again once translations are ready in case PF2e rebuilds its trait lists.
function registerTrait() {
  for (const list of ["equipmentTraits", "consumableTraits", "armorTraits", "weaponTraits", "shieldTraits"]) {
    if (CONFIG.PF2E[list]) CONFIG.PF2E[list][SLUG] = "Formula";
  }
  CONFIG.PF2E.traitsDescriptions ??= {};
  CONFIG.PF2E.traitsDescriptions[SLUG] =
    "This item is a formula: a record of how to craft another item. It is not crafted or carried like equipment. Add it to a formula book on the Crafting tab to learn what it describes.";
}

Hooks.once("init", registerTrait);
Hooks.once("i18nInit", registerTrait);
