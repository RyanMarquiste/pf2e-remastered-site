// Formula items for PF2e's tiered alchemical items that are not mutagens (see mutagen-formulas.js for those), one entry for each family. Each family lists its tiers in order, with the
// item's name, level and its id in the equipment compendium. The Alchemist pack makes a formula item for each, so one formula in an alchemy formula book teaches every tier at or
// below the character's level, and the formula is priced at the lowest tier.
module.exports = [
  {
    name: "Blood Booster",
    rarity: "common",
    img: "icons/consumables/potions/vial-cork-red.webp",
    tiers: [
      { name: "Blood Booster (Lesser)", level: 3, id: "8g2U2PMC0lkPZEvq" },
      { name: "Blood Booster (Moderate)", level: 11, id: "LNzJ2WwTg58g7vam" },
      { name: "Blood Booster (Greater)", level: 18, id: "3UXsXwUbvOdpPg6b" },
    ],
  },
];
