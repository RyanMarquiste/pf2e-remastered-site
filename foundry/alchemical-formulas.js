// Formula items for PF2e's tiered alchemical items that are not mutagens (see mutagen-formulas.js), including the common alchemical bombs and elixirs, one entry for each family. Each family
// lists its tiers in order, with the item's name, level and its id in the equipment compendium. The Alchemist pack makes a formula item for each, so one formula in an alchemy formula book
// teaches every tier at or below the character's level, and the formula is priced at the lowest tier. A family with one item (the Infiltrator's Elixir) is a formula item with one tier.
module.exports = [
  {
    name: "Acid Flask",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-bombs/acid-flask.webp",
    tiers: [
      { name: "Acid Flask (Lesser)", level: 1, id: "M1k5QQc1qQLxzyCK" },
      { name: "Acid Flask (Moderate)", level: 3, id: "SgtqZxt26BdjUmEB" },
      { name: "Acid Flask (Greater)", level: 11, id: "jC8GmH0Un6vDxdMj" },
      { name: "Acid Flask (Major)", level: 17, id: "GttLYMT2welSpwCd" },
    ],
  },
  {
    name: "Affliction Suppressant",
    rarity: "common",
    img: "icons/consumables/potions/potion-bottle-corked-stopper-ornate-yellow.webp",
    tiers: [
      { name: "Affliction Suppressant (Lesser)", level: 1, id: "2Vd9v0TvEXdVyMTP" },
      { name: "Affliction Suppressant (Moderate)", level: 6, id: "CrOj1a997n9tku6x" },
      { name: "Affliction Suppressant (Greater)", level: 10, id: "F9VX2CR9NaFmbTj4" },
      { name: "Affliction Suppressant (Major)", level: 14, id: "njXFDv63y1w0qvz0" },
    ],
  },
  {
    name: "Alchemist's Fire",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-bombs/alchemists-fire.webp",
    tiers: [
      { name: "Alchemist's Fire (Lesser)", level: 1, id: "yd3kEK21YknZLlcT" },
      { name: "Alchemist's Fire (Moderate)", level: 3, id: "gWr4q4HiyGhETA8H" },
      { name: "Alchemist's Fire (Greater)", level: 11, id: "n5yTlTs63o53n3k6" },
      { name: "Alchemist's Fire (Major)", level: 17, id: "cLZrOihPht5M7eTw" },
    ],
  },
  {
    name: "Antidote",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/antidote.webp",
    tiers: [
      { name: "Antidote (Lesser)", level: 1, id: "ktjFOp3U0wQD9t0Z" },
      { name: "Antidote (Moderate)", level: 6, id: "AJ1dC7EtTIfBey0M" },
      { name: "Antidote (Greater)", level: 10, id: "XWkeL34yJK6t5qUE" },
      { name: "Antidote (Major)", level: 14, id: "ANzB9WzlGQXDn76G" },
    ],
  },
  {
    name: "Antiplague",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/antiplague.webp",
    tiers: [
      { name: "Antiplague (Lesser)", level: 1, id: "UqinuuCWePTYGhVO" },
      { name: "Antiplague (Moderate)", level: 6, id: "biRbqKo2C97XLfQ0" },
      { name: "Antiplague (Greater)", level: 10, id: "ORDaAzMZLrf6Hn8A" },
      { name: "Antiplague (Major)", level: 14, id: "kajpTXg3oHIJStQa" },
    ],
  },
  {
    name: "Blasting Stone",
    rarity: "common",
    img: "icons/commodities/gems/pearl-rough-turquoise.webp",
    tiers: [
      { name: "Blasting Stone (Lesser)", level: 1, id: "Xnqglykl3Cif8rN9" },
      { name: "Blasting Stone (Moderate)", level: 3, id: "JOaELkzLWTywhn5Z" },
      { name: "Blasting Stone (Greater)", level: 11, id: "dsMkvuLgpOOGLWDy" },
      { name: "Blasting Stone (Major)", level: 17, id: "IuGydh0En8LbfnWo" },
    ],
  },
  {
    name: "Blight Bomb",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-bombs/blight-bomb.webp",
    tiers: [
      { name: "Blight Bomb (Lesser)", level: 1, id: "j8ajvNqyyQGBpBch" },
      { name: "Blight Bomb (Moderate)", level: 3, id: "158vwM1andv8DbRI" },
      { name: "Blight Bomb (Greater)", level: 11, id: "LhMXIGelSrFPYild" },
      { name: "Blight Bomb (Major)", level: 17, id: "sJjuv1991SZ7DWWD" },
    ],
  },
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
    name: "Bomber's Eye Elixir",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/bombers-eye-elixir.webp",
    tiers: [
      { name: "Bomber's Eye Elixir (Lesser)", level: 4, id: "T4ouD4mVFHA3EHs6" },
      { name: "Bomber's Eye Elixir (Greater)", level: 14, id: "lasqzrPVEHI5MkQd" },
    ],
  },
  {
    name: "Bottled Catharsis",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/focus-cathartic.webp",
    tiers: [
      { name: "Bottled Catharsis (Minor)", level: 2, id: "e2II4yMBFBqVivnk" },
      { name: "Bottled Catharsis (Lesser)", level: 4, id: "8KbayiwrUJtvif0a" },
      { name: "Bottled Catharsis (Moderate)", level: 8, id: "XfcSVHwMA60JxUXJ" },
      { name: "Bottled Catharsis (Greater)", level: 12, id: "vMs9n8oXlZttcJkX" },
      { name: "Bottled Catharsis (Major)", level: 18, id: "Pnw4A7fhUhTS85Te" },
    ],
  },
  {
    name: "Bottled Lightning",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-bombs/bottled-lightning.webp",
    tiers: [
      { name: "Bottled Lightning (Lesser)", level: 1, id: "AFR01HVd7DcZvkpP" },
      { name: "Bottled Lightning (Moderate)", level: 3, id: "97QyNEOAyYLdGaYc" },
      { name: "Bottled Lightning (Greater)", level: 11, id: "r2iTRbt1zpkAqHj2" },
      { name: "Bottled Lightning (Major)", level: 17, id: "rpbbfkexLhtadBDV" },
    ],
  },
  {
    name: "Bottled Sunlight",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-bombs/bottled-sunlight.webp",
    tiers: [
      { name: "Bottled Sunlight (Lesser)", level: 2, id: "iGT4UeQq3YFcNpEb" },
      { name: "Bottled Sunlight (Moderate)", level: 4, id: "wIQjJGLZOKCY1es9" },
      { name: "Bottled Sunlight (Greater)", level: 12, id: "AH0u9DDvs4napvdh" },
      { name: "Bottled Sunlight (Major)", level: 18, id: "xoucExiZTvCbjWMB" },
    ],
  },
  {
    name: "Boulder Seed",
    rarity: "common",
    img: "icons/commodities/stone/stone-chunk-moss-grey.webp",
    tiers: [
      { name: "Boulder Seed", level: 12, id: "sjOkiftTv4KbR2c0" },
      { name: "Boulder Seed (Greater)", level: 18, id: "OHwsumgfO1oyH7KL" },
    ],
  },
  {
    name: "Bravo's Brew",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/bravos-brew.webp",
    tiers: [
      { name: "Bravo's Brew (Lesser)", level: 2, id: "zM9VX3QwM81DzDUA" },
      { name: "Bravo's Brew (Moderate)", level: 10, id: "oCuwJ9IUDAuzsUwa" },
      { name: "Bravo's Brew (Greater)", level: 15, id: "sWPkbSlWAEAStBqD" },
    ],
  },
  {
    name: "Cat's Eye Elixir",
    rarity: "common",
    img: "icons/consumables/potions/potion-tube-corked-glowing-red.webp",
    tiers: [
      { name: "Cat's Eye Elixir", level: 2, id: "bQPRKEpnLakJBAAh" },
    ],
  },
  {
    name: "Cheetah's Elixir",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/cheetahs-elixir.webp",
    tiers: [
      { name: "Cheetah's Elixir (Lesser)", level: 1, id: "tyt6rFtv32MZ4DT9" },
      { name: "Cheetah's Elixir (Moderate)", level: 5, id: "AqLxu3ir4UGzdOaz" },
      { name: "Cheetah's Elixir (Greater)", level: 9, id: "t4X6GDybqLmt7UkN" },
    ],
  },
  {
    name: "Chromatic Jellyfish Oil",
    rarity: "common",
    img: "icons/consumables/potions/potion-flash-open-blue.webp",
    tiers: [
      { name: "Chromatic Jellyfish Oil (Lesser)", level: 9, id: "BFre5eREvbqQdwPC" },
      { name: "Chromatic Jellyfish Oil (Moderate)", level: 14, id: "fDLABfn3nY1R670j" },
      { name: "Chromatic Jellyfish Oil (Greater)", level: 19, id: "SeIweTBlvD1EipTQ" },
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
    name: "Contagion Metabolizer",
    rarity: "common",
    img: "systems/pf2e/icons/default-icons/consumable.svg",
    tiers: [
      { name: "Contagion Metabolizer (Lesser)", level: 5, id: "EKhROfCklhZ7Je7h" },
      { name: "Contagion Metabolizer (Moderate)", level: 11, id: "GWMrc8hZINhmDwvt" },
      { name: "Contagion Metabolizer (Greater)", level: 19, id: "ommn7wIgLyWHGL11" },
    ],
  },
  {
    name: "Cooling Elixir",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/salamander-elixir.webp",
    tiers: [
      { name: "Cooling Elixir (Lesser)", level: 4, id: "Ekk7o1gPu8RotixD" },
      { name: "Cooling Elixir (Moderate)", level: 12, id: "EEJiqzU89Ofk7dr6" },
      { name: "Cooling Elixir (Greater)", level: 16, id: "XMuLrJYL6fxv4YNA" },
    ],
  },
  {
    name: "Crystal Shards",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-bombs/crystal-shards.webp",
    tiers: [
      { name: "Crystal Shards (Moderate)", level: 4, id: "V4wgOWYmHlbSZsVG" },
      { name: "Crystal Shards (Greater)", level: 12, id: "ivaL0xt33k6QNwQK" },
      { name: "Crystal Shards (Major)", level: 18, id: "V2knI4GpdJYLupjg" },
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
    name: "Dread Ampoule",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-bombs/dread-ampoule.webp",
    tiers: [
      { name: "Dread Ampoule (Lesser)", level: 1, id: "ds0OdA989ZZw9km1" },
      { name: "Dread Ampoule (Moderate)", level: 3, id: "IvFEJqp2MUew65nQ" },
      { name: "Dread Ampoule (Greater)", level: 11, id: "kpJmjm843vaMZjIu" },
      { name: "Dread Ampoule (Major)", level: 17, id: "MCHYtxP8E7njLC3s" },
    ],
  },
  {
    name: "Eagle Eye Elixir",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/eagle-eyes-elixir.webp",
    tiers: [
      { name: "Eagle Eye Elixir (Lesser)", level: 1, id: "7Y2yOr4ltpP2tyuL" },
      { name: "Eagle Eye Elixir (Moderate)", level: 5, id: "lPcnDlBGz5QwCMYw" },
      { name: "Eagle Eye Elixir (Greater)", level: 10, id: "xWCdsGSwLLTeX6tQ" },
      { name: "Eagle Eye Elixir (Major)", level: 16, id: "kicNrnZz1KjJYRVI" },
    ],
  },
  {
    name: "Elixir of Gender Transformation",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/elixir-of-gender-transformation.webp",
    tiers: [
      { name: "Elixir of Gender Transformation (Lesser)", level: 1, id: "GfegrEtbEs9L6NOg" },
      { name: "Elixir of Gender Transformation (Moderate)", level: 3, id: "0KXqdhz2MYV0LBm2" },
      { name: "Elixir of Gender Transformation (Greater)", level: 6, id: "rDM6rxWVzKtFQOKg" },
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
    name: "Frogskin Tincture",
    rarity: "common",
    img: "icons/consumables/potions/potion-tube-corked-orange.webp",
    tiers: [
      { name: "Frogskin Tincture", level: 6, id: "oEOfOdcxkSnzSHPC" },
    ],
  },
  {
    name: "Frost Vial",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-bombs/frost-vial.webp",
    tiers: [
      { name: "Frost Vial (Lesser)", level: 1, id: "EpxmUtLpCkE8R6KJ" },
      { name: "Frost Vial (Moderate)", level: 3, id: "nVvH1ZcM7OwIVIs8" },
      { name: "Frost Vial (Greater)", level: 11, id: "intVPcEzbE9o4NQd" },
      { name: "Frost Vial (Major)", level: 17, id: "4DJQID8GIlxQ7b9C" },
    ],
  },
  {
    name: "Ghost Charge",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-bombs/ghost-charge.webp",
    tiers: [
      { name: "Ghost Charge (Lesser)", level: 1, id: "LNd5u19GqC51ngby" },
      { name: "Ghost Charge (Moderate)", level: 3, id: "Wf94e8YNhZdIvWc9" },
      { name: "Ghost Charge (Greater)", level: 11, id: "28osNZINXLWzqzUL" },
      { name: "Ghost Charge (Major)", level: 17, id: "i7bJcib5TUJKOd4Z" },
    ],
  },
  {
    name: "Glue Bomb",
    rarity: "common",
    img: "icons/containers/bags/sack-simple-leather-tan.webp",
    tiers: [
      { name: "Glue Bomb (Lesser)", level: 1, id: "T6Appwwl6nUl56Xj" },
      { name: "Glue Bomb (Moderate)", level: 3, id: "evBPzM1VsuYcoenn" },
      { name: "Glue Bomb (Greater)", level: 11, id: "5Qkz4RVJr2Kx3RL6" },
      { name: "Glue Bomb (Major)", level: 17, id: "BxJNWWvpxacDIsdt" },
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
    name: "Leaper's Elixir",
    rarity: "common",
    img: "icons/consumables/potions/potion-jar-capped-teal.webp",
    tiers: [
      { name: "Leaper's Elixir (Lesser)", level: 1, id: "uG3xtNrs26scOVgW" },
      { name: "Leaper's Elixir (Greater)", level: 7, id: "6eQvHNHf1IC2X5Rx" },
    ],
  },
  {
    name: "Lodestone Bomb",
    rarity: "common",
    img: "icons/commodities/gems/pearl-swirl-teal.webp",
    tiers: [
      { name: "Lodestone Bomb", level: 12, id: "DBQ68Evl8PdLAVmt" },
      { name: "Lodestone Bomb (Greater)", level: 18, id: "APJ0NWJ4DYUXNpNm" },
    ],
  },
  {
    name: "Mistform Elixir",
    rarity: "common",
    img: "icons/consumables/potions/bottle-conical-corked-blue.webp",
    tiers: [
      { name: "Mistform Elixir (Lesser)", level: 4, id: "GyO89RBVjAKFxsFm" },
      { name: "Mistform Elixir (Moderate)", level: 6, id: "Ax8XcBd0rRd1Z7hN" },
      { name: "Mistform Elixir (Greater)", level: 10, id: "04giYigfDL5geu5f" },
    ],
  },
  {
    name: "Necrotic Bomb",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-bombs/necrotic-bomb.webp",
    tiers: [
      { name: "Necrotic Bomb (Lesser)", level: 1, id: "8JnOYyTdatqRnAV4" },
      { name: "Necrotic Bomb (Moderate)", level: 3, id: "moBSgma1rtJqh7Rp" },
      { name: "Necrotic Bomb (Greater)", level: 11, id: "u41wQz3bgu6J1XKo" },
      { name: "Necrotic Bomb (Major)", level: 17, id: "RC8EmoFiMITFUopr" },
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
    name: "Olfactory Obfuscator",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/olefactory-obfuscator.webp",
    tiers: [
      { name: "Olfactory Obfuscator (Lesser)", level: 3, id: "R0gsYr0jD1giTzpx" },
      { name: "Olfactory Obfuscator (Greater)", level: 10, id: "MBL8rOfvokYmUvwc" },
    ],
  },
  {
    name: "Sea Touch Elixir",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/sea-touch-elixir.webp",
    tiers: [
      { name: "Sea Touch Elixir (Lesser)", level: 5, id: "zcJgT5RS8p2MEbOB" },
      { name: "Sea Touch Elixir (Moderate)", level: 12, id: "2hc1EEcb3pfr7Hac" },
      { name: "Sea Touch Elixir (Greater)", level: 15, id: "i4D4B7tpYv9vMvQY" },
    ],
  },
  {
    name: "Shatterstone",
    rarity: "common",
    img: "icons/magic/earth/projectile-boulder-dust.webp",
    tiers: [
      { name: "Shatterstone", level: 12, id: "sBtfUPTLuyRPYI7g" },
      { name: "Shatterstone (Greater)", level: 18, id: "CJesyj3lklJVujh0" },
    ],
  },
  {
    name: "Skunk Bomb",
    rarity: "common",
    img: "icons/magic/air/fog-gas-smoke-orange.webp",
    tiers: [
      { name: "Skunk Bomb (Lesser)", level: 1, id: "3Sij5RwC6Z1ZVuFp" },
      { name: "Skunk Bomb (Moderate)", level: 3, id: "m091zbWD9EoH6kWC" },
      { name: "Skunk Bomb (Greater)", level: 11, id: "7WwKI53IcXVIHbkh" },
      { name: "Skunk Bomb (Major)", level: 17, id: "Dv1bozSbR39McpWd" },
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
  {
    name: "Sticky Algae Bomb",
    rarity: "common",
    img: "icons/magic/nature/plant-undersea-seaweed-glow-green.webp",
    tiers: [
      { name: "Sticky Algae Bomb (Lesser)", level: 1, id: "S1TrEDE8JNkchMca" },
      { name: "Sticky Algae Bomb (Moderate)", level: 3, id: "h6O5uto0Ry1WDjXn" },
      { name: "Sticky Algae Bomb (Greater)", level: 11, id: "cVUhP1qWxe9USvVp" },
      { name: "Sticky Algae Bomb (Major)", level: 17, id: "AAoAQCBwAITvHJSu" },
    ],
  },
  {
    name: "Stone Fist Elixir",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/stone-fist-elixir.webp",
    tiers: [
      { name: "Stone Fist Elixir", level: 4, id: "YcvSw7Zn3oyqlJaw" },
    ],
  },
  {
    name: "Surging Serum",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/sinew-shock-serum.webp",
    tiers: [
      { name: "Surging Serum (Minor)", level: 2, id: "yE7PPagK0wsHMA8l" },
      { name: "Surging Serum (Lesser)", level: 4, id: "1TWHN8RbimPVXM0U" },
      { name: "Surging Serum (Moderate)", level: 8, id: "tslVf3qtQE7V1YvG" },
      { name: "Surging Serum (Greater)", level: 12, id: "62HxCEDwhlZaeR0Q" },
      { name: "Surging Serum (Major)", level: 18, id: "YIgIF1845n5UBFnE" },
    ],
  },
  {
    name: "Trueshape Bomb",
    rarity: "common",
    img: "icons/weapons/thrown/ball-spiked.webp",
    tiers: [
      { name: "Trueshape Bomb", level: 12, id: "PNs3SqMhJ3rTxpSI" },
      { name: "Trueshape Bomb (Greater)", level: 18, id: "wtRDteH3D3ME4FU9" },
    ],
  },
  {
    name: "Vaccine",
    rarity: "common",
    img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/vaccine.webp",
    tiers: [
      { name: "Vaccine (Minor)", level: 1, id: "yi1iL9dbLDSr4NZd" },
      { name: "Vaccine (Lesser)", level: 3, id: "nzeTcOyQmZNrurVF" },
      { name: "Vaccine (Moderate)", level: 6, id: "HilBL7oeSSXqDor7" },
      { name: "Vaccine (Greater)", level: 12, id: "9mXjEGJaESesndWh" },
      { name: "Vaccine (Major)", level: 18, id: "JZZmDY1IJmKcdR2D" },
    ],
  },
  {
    name: "Viperous Elixir",
    rarity: "common",
    img: "icons/consumables/potions/potion-flask-corked-capped-green.webp",
    tiers: [
      { name: "Viperous Elixir (Lesser)", level: 5, id: "LmNp6og59w1KhlIX" },
      { name: "Viperous Elixir (Moderate)", level: 8, id: "HwDlOobl1bsTG5mA" },
      { name: "Viperous Elixir (Greater)", level: 11, id: "avCckBXMRbzAudZG" },
    ],
  },
  {
    name: "Witchwarg Elixir",
    rarity: "common",
    img: "icons/consumables/potions/bottle-round-ring-teal.webp",
    tiers: [
      { name: "Witchwarg Elixir (Lesser)", level: 4, id: "n9VrmK9Us0viv20P" },
      { name: "Witchwarg Elixir (Moderate)", level: 12, id: "2prxM8Q0F4sdSwPx" },
      { name: "Witchwarg Elixir (Greater)", level: 16, id: "aDn5blt2iiYJpzbe" },
    ],
  },
];
