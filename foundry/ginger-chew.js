// The Ginger Chew: a Lozenge that settles the stomach, in two tiers for the Wandering Chef. Called from build.js, which supplies the shared helpers.
//   - Ginger Chew (Lesser): level 2, 7 gp, a weaker version that lasts 10 minutes. It is common, so the Wandering Chef can learn it at 1st or 2nd level.
//   - Ginger Chew (Moderate): a copy of PF2e's own Ginger Chew (Pathfinder Treasure Vault, level 5, 28 gp, 1 hour), named like the Lesser so the two read as tiers.
// Each carries the alchemical-food tag the chef's Quick Cooking looks for. Activating one puts it in your mouth and applies its effect, a +1 item bonus to Fortitude saves against
// being sickened. The effect also grants a Bite Ginger Chew action while it lasts, the Lozenge's secondary effect: using it (scripts/wandering-chef/ginger-chew.js) reduces your
// sickened value by 1 and removes the effect, which takes the action with it. A Formula: Ginger Chew item covers both tiers.
module.exports = function buildGingerChew({ items, publication, makeId, uuidOf, formulaItem }) {
  const IMG = "icons/consumables/vegetable/root-ginger-yellow.webp";
  const biteId = makeId("action:Bite Ginger Chew");

  items.push({
    _id: biteId,
    img: IMG,
    name: "Bite Ginger Chew",
    type: "action",
    system: {
      slug: "bite-ginger-chew",
      actionType: { value: "action" },
      actions: { value: 1 },
      category: "interaction",
      description: {
        value:
          "<p><strong>Requirements</strong> A ginger chew is in your mouth: its effect is on you</p><hr />" +
          "<p>You bite down on the ginger chew. Reduce your sickened value by 1, if any. The chew becomes inert, and its effect ends.</p>" +
          "<hr /><p><strong>Module</strong> Using this action reduces your sickened value by 1 and removes the effect that gave you this action. It can be switched off in the module " +
          "settings under Wandering Chef.</p>",
      },
      frequency: null,
      publication,
      rules: [],
      traits: { otherTags: [], rarity: "common", value: [] },
    },
  });

  const tiers = [
    {
      name: "Lesser",
      level: 2,
      gp: 7,
      duration: { unit: "minutes", value: 10, text: "10 minutes" },
      // The id seeds keep the names the Lesser had before it had tiers, so existing links keep working.
      itemSeed: "item:Ginger Chew (Lesser)",
      effectSeed: "effect:Ginger Chew (Lesser)",
      text:
        "A small, chewy lozenge of candied ginger that settles an unsettled stomach. It is a weaker, shorter-lasting version of the Ginger Chew. " +
        "A lesser ginger chew lasts for 10 minutes and grants you a +1 item bonus to Fortitude saves against being sickened.",
    },
    {
      name: "Moderate",
      level: 5,
      gp: 28,
      duration: { unit: "hours", value: 1, text: "1 hour" },
      itemSeed: "item:Ginger Chew (Moderate)",
      effectSeed: "effect:Ginger Chew (Moderate)",
      text:
        "This chewy ginger candy aids digestion and soothes unsettled stomachs. A ginger chew lasts for 1 hour and grants you a +1 item bonus to Fortitude saves against being sickened.",
    },
  ];

  const tierItems = [];
  for (const t of tiers) {
    const itemId = makeId(t.itemSeed);
    const effectId = makeId(t.effectSeed);
    const slugTier = t.name.toLowerCase();
    const name = `Ginger Chew (${t.name})`;

    items.push({
      _id: itemId,
      img: IMG,
      name,
      type: "consumable",
      system: {
        slug: `ginger-chew-${slugTier}`,
        baseItem: null,
        bulk: { value: 0.1 },
        category: "other",
        containerId: null,
        damage: null,
        description: {
          value:
            `<p><strong>Activate</strong> <span class="action-glyph">1</span> (manipulate)</p><hr />` +
            `<p>${t.text}</p>` +
            `<p>@UUID[${uuidOf(effectId)}]{Effect: ${name}}</p><hr />` +
            `<p><strong>Secondary Effect</strong> <span class="action-glyph">1</span></p>` +
            `<p><strong>Effect</strong> Reduce your sickened value by 1, if any. The chew becomes inert. While the effect lasts it gives you the ` +
            `@UUID[${uuidOf(biteId)}]{Bite Ginger Chew} action, which does this.</p>`,
        },
        hardness: 0,
        hp: { max: 0, value: 0 },
        level: { value: t.level },
        material: { grade: null, type: null },
        price: { value: { gp: t.gp } },
        publication,
        quantity: 1,
        rules: [],
        size: "med",
        traits: { otherTags: ["alchemical-food"], rarity: "common", value: ["alchemical", "consumable", "lozenge"] },
        usage: { value: "held-in-one-hand" },
        uses: { autoDestroy: true, max: 1, value: 1 },
      },
    });

    items.push({
      _id: effectId,
      img: IMG,
      name: `Effect: ${name}`,
      type: "effect",
      system: {
        slug: `effect-ginger-chew-${slugTier}`,
        description: {
          value:
            `<p>Granted by @UUID[${uuidOf(itemId)}]{${name}}</p><p>You gain a +1 item bonus to Fortitude saves against being sickened.</p>` +
            `<p>This effect also gives you @UUID[${uuidOf(biteId)}]{Bite Ginger Chew}.</p>`,
        },
        duration: { expiry: "turn-start", sustained: false, unit: t.duration.unit, value: t.duration.value },
        level: { value: t.level },
        publication,
        rules: [
          { key: "FlatModifier", predicate: ["inflicts:sickened"], selector: "fortitude", type: "item", value: 1 },
          { key: "GrantItem", allowDuplicate: false, uuid: uuidOf(biteId) },
        ],
        start: { initiative: null, value: 0 },
        tokenIcon: { show: true },
        traits: { rarity: "common", value: [] },
      },
    });

    // The Moderate is a copy of PF2e's Ginger Chew, so the cookbook list hides the original.
    tierItems.push({ name, level: t.level, uuid: uuidOf(itemId), ...(t.name === "Moderate" ? { replaces: "Compendium.pf2e.equipment-srd.Item.uPP678KODkgDy8UO" } : {}) });
  }

  items.push(
    formulaItem({
      family: "Ginger Chew",
      img: IMG,
      made: "a ginger lozenge that settles the stomach",
      pub: publication,
      tiers: tierItems,
    }),
  );
};
