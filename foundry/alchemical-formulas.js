// Formula items for PF2e's tiered alchemical items that are not mutagens (see mutagen-formulas.js), one entry for each family. Each family lists its tiers in order, with the
// item's name, level and its id in the equipment compendium. The Alchemist pack makes a formula item for each, so one formula in an alchemy formula book teaches every tier at or
// below the character's level, and the formula is priced at the lowest tier. A family with one item (the Infiltrator's Elixir) is a formula item with one tier.
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
  {
    name: "Comprehension Elixir",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/comprehension-elixir.webp",
    tiers: [
      { name: "Comprehension Elixir (Lesser)", level: 2, id: "3Klm2gPmzOw6ntVb" },
      { name: "Comprehension Elixir (Greater)", level: 7, id: "OcBPjVplvy2GbQ8P" },
    ],
  },
  {
    name: "Darkvision Elixir",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/darkvision-elixir.webp",
    tiers: [
      { name: "Darkvision Elixir (Lesser)", level: 2, id: "88pGCHV0uKMskTVO" },
      { name: "Darkvision Elixir (Moderate)", level: 4, id: "Y8115p3cmQJBqk5d" },
      { name: "Darkvision Elixir (Greater)", level: 8, id: "bz8Y8bVUe7QfBk9g" },
    ],
  },
  {
    name: "Elixir of Life",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/elixir-of-life.webp",
    tiers: [
      { name: "Elixir of Life (Minor)", level: 1, id: "hDLbR56Id2OtU318" },
      { name: "Elixir of Life (Lesser)", level: 5, id: "TZUskLT7yvP7N2co" },
      { name: "Elixir of Life (Moderate)", level: 9, id: "c21stU5rhN4F2fZl" },
      { name: "Elixir of Life (Greater)", level: 13, id: "mYozcVg9fQY6zO7C" },
      { name: "Elixir of Life (Major)", level: 15, id: "AmxSqEoFhRLMYd1W" },
      { name: "Elixir of Life (True)", level: 19, id: "qK964kZz1ALcysOa" },
    ],
  },
  {
    name: "Infiltrator's Elixir",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/infiltrators-elixir.webp",
    tiers: [
      { name: "Infiltrator's Elixir", level: 2, id: "cuomhpenkqGM5lLG" },
    ],
  },
  {
    name: "Numbing Tonic",
    rarity: "common",
    img: "icons/consumables/potions/bottle-round-label-cork-yellow.webp",
    tiers: [
      { name: "Numbing Tonic (Minor)", level: 1, id: "V35j3JEJMUbuJZNX" },
      { name: "Numbing Tonic (Lesser)", level: 5, id: "7D6ENmL3mRfUOMwf" },
      { name: "Numbing Tonic (Moderate)", level: 9, id: "WnJwPbObxmTNvYJy" },
      { name: "Numbing Tonic (Greater)", level: 13, id: "wuVD3kolQaFAEeBK" },
      { name: "Numbing Tonic (Major)", level: 16, id: "EAgWYY1C4mDRfwqo" },
      { name: "Numbing Tonic (True)", level: 19, id: "7VDf5tQKh01XV6HQ" },
    ],
  },
  {
    name: "Soothing Tonic",
    rarity: "common",
    img: "icons/consumables/potions/bottle-round-corked-yellow.webp",
    tiers: [
      { name: "Soothing Tonic (Lesser)", level: 2, id: "zA2UPGE9RYwlLPZJ" },
      { name: "Soothing Tonic (Moderate)", level: 5, id: "RM7WoJYfd2edlNZ8" },
      { name: "Soothing Tonic (Greater)", level: 10, id: "HIPkTfJLlLu4bWE3" },
      { name: "Soothing Tonic (Major)", level: 17, id: "UeUPNFw600HEdDgF" },
    ],
  },
  {
    name: "Spiderfoot Brew",
    rarity: "common",
    img: "icons/creatures/invertebrates/spider-striped-web-red.webp",
    tiers: [
      { name: "Spiderfoot Brew (Lesser)", level: 3, id: "HuyWiPnkDZoAVhW9" },
      { name: "Spiderfoot Brew (Moderate)", level: 9, id: "L4Db3CncPcZFPzGN" },
      { name: "Spiderfoot Brew (Greater)", level: 17, id: "ETLSXa4Po518z9Qx" },
    ],
  },
];
