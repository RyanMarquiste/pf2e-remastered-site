// Source traits. Every item from this project carries a trait that names where it came from: Marquiste for the items in Marquiste Additions, and Cauldron for
// the items in CorpseCap's Cauldron. They are labels only (they have no rules), and styles/source-traits.css gives them one look that is different from PF2e's own
// traits, so a source is easy to tell from a functional trait. The Cauldron is a separate module that requires this one, so both are registered here.
const SOURCES = {
  marquiste: {
    label: "Marquiste",
    description: "Source: Marquiste Additions. This item is homebrew from ryanmarquiste.github.io/pf2e-remastered-site, not an official PF2e rule. The trait is a label and has no effect.",
  },
  cauldron: {
    label: "Cauldron",
    description: "Source: CorpseCap's Cauldron. This item is homebrew from ryanmarquiste.github.io/pf2e-remastered-site, not an official PF2e rule. The trait is a label and has no effect.",
  },
};

// The lists PF2e reads trait labels from, and the Compendium Browser builds its trait filters from.
const LISTS = ["equipmentTraits", "consumableTraits", "armorTraits", "weaponTraits", "shieldTraits", "featTraits", "actionTraits"];

// The labels are fixed text, so there is nothing to translate; set them again once translations are ready in case PF2e rebuilds its trait lists.
function registerTraits() {
  CONFIG.PF2E.traitsDescriptions ??= {};
  for (const [slug, { label, description }] of Object.entries(SOURCES)) {
    for (const list of LISTS) if (CONFIG.PF2E[list]) CONFIG.PF2E[list][slug] = label;
    CONFIG.PF2E.traitsDescriptions[slug] = description;
  }
}

Hooks.once("init", registerTraits);
Hooks.once("i18nInit", registerTraits);
