// Toxicologist field benefit: any infused item with the poison trait that a Toxicologist creates also has the Mutable Acid trait, so its damage can
// change to acid against a creature for which acid is better. Acid items do not become Mutable Poison. The Mutable traits and the damage change
// itself are in scripts/common/mutable-trait.js. The Toxicologist Field Vials and the Toxic Coatings already have the trait.
const TRAIT = "mutable-acid";

const isToxicologist = (actor) => actor?.itemTypes.feat.some((f) => f.category === "classfeature" && f.slug === "toxicologist");

// Added as the item is created (a vial from Quick Vial, an item from Create Consumable or from PF2e's own Quick Alchemy).
Hooks.on("preCreateItem", (item) => {
  const actor = item.parent;
  if (actor?.documentName !== "Actor" || !item.isOfType?.("consumable", "weapon", "equipment")) return;
  const traits = item.system.traits.value;
  if (traits.includes(TRAIT) || !traits.includes("infused") || !traits.includes("poison")) return;
  if (isToxicologist(actor)) item.updateSource({ "system.traits.value": [...traits, TRAIT] });
});
