// Cinnamon Seers: a Lozenge that sharpens recall, in two tiers for the Wandering Chef. Called from build.js, which supplies the shared helpers.
//   - Cinnamon Seers (Lesser): level 2, 7 gp, a weaker version that lasts 10 minutes. It is common, so the Wandering Chef can learn it at 1st or 2nd level.
//   - Cinnamon Seers (Moderate): a copy of PF2e's own Cinnamon Seers (Pathfinder Treasure Vault, level 4, 14 gp, 1 hour), named like the Lesser so the two read as tiers.
// Each carries the alchemical-food tag the chef's Quick Cooking looks for. Activating one puts it in your mouth and applies its effect, a +1 item bonus to checks to Recall Knowledge.
// The effect also grants a Bite Cinnamon Seers action while it lasts, the Lozenge's secondary effect (a reaction): using it (scripts/wandering-chef/cinnamon-seers.js) rerolls your
// latest Recall Knowledge check, removes the effect (which takes the action with it) and gives you an immunity effect that lasts until your next daily preparations. While that
// effect is on you the seers' bonus and the Bite action are switched off by their predicates. A Formula: Cinnamon Seers item covers both tiers.
module.exports = function buildCinnamonSeers({ items, publication, makeId, uuidOf, formulaItem }) {
  const IMG = "icons/consumables/potions/bottle-corked-empty.webp";
  const biteId = makeId("action:Bite Cinnamon Seers");
  const immuneId = makeId("effect:Cinnamon Seers Immunity");
  const IMMUNE_SLUG = "effect-cinnamon-seers-immunity";
  const notImmune = { not: `self:effect:${IMMUNE_SLUG}` };

  items.push({
    _id: biteId,
    img: IMG,
    name: "Bite Cinnamon Seers",
    type: "action",
    system: {
      slug: "bite-cinnamon-seers",
      actionType: { value: "reaction" },
      actions: { value: null },
      category: "interaction",
      description: {
        value:
          "<p><strong>Trigger</strong> You gain no information from a Recall Knowledge check</p>" +
          "<p><strong>Requirements</strong> A cinnamon seer is in your mouth: its effect is on you</p><hr />" +
          "<p>You bite down on the cinnamon seer. Reroll the triggering check. If this was a secret check, the GM rerolls rather than you; the candy doesn't give you any insight " +
          "into what the GM rolled, so in that case you're rerolling based only on guesswork. The seer becomes inert, and its effect ends. You become temporarily immune to " +
          "cinnamon seers until the next time you make your daily preparations.</p>" +
          "<hr /><p><strong>Module</strong> Using this action rerolls your latest Recall Knowledge check, removes the effect that gave you this action and gives you " +
          `@UUID[${uuidOf(immuneId)}]{Effect: Cinnamon Seers Immunity}, which ends when you rest for the night. It can be switched off in the module settings under Wandering Chef.</p>`,
      },
      frequency: null,
      publication,
      rules: [],
      traits: { otherTags: [], rarity: "common", value: ["fortune"] },
    },
  });

  items.push({
    _id: immuneId,
    img: IMG,
    name: "Effect: Cinnamon Seers Immunity",
    type: "effect",
    system: {
      slug: IMMUNE_SLUG,
      description: {
        value:
          "<p>You bit a cinnamon seer to reroll a Recall Knowledge check, so you are temporarily immune to cinnamon seers until the next time you make your daily preparations. " +
          "While this effect is on you, a cinnamon seer gives you neither its bonus nor its Bite action.</p>",
      },
      duration: { expiry: null, sustained: false, unit: "unlimited", value: -1 },
      level: { value: 1 },
      publication,
      rules: [],
      start: { initiative: null, value: 0 },
      tokenIcon: { show: true },
      traits: { rarity: "common", value: [] },
    },
  });

  const tiers = [
    {
      name: "Lesser",
      level: 2,
      gp: 7,
      duration: { unit: "minutes", value: 10, text: "10 minutes" },
      itemSeed: "item:Cinnamon Seers (Lesser)",
      effectSeed: "effect:Cinnamon Seers (Lesser)",
      text:
        "Zippy, alchemically treated cinnamon suffuses cinnamon seers, a rock candy with a lively taste that provides a mental boost. This is a weaker, shorter-lasting version of the cinnamon seer. " +
        "A lesser cinnamon seer remains in your mouth for 10 minutes, its stimulating flavor granting you a +1 item bonus to checks to Recall Knowledge.",
    },
    {
      name: "Moderate",
      level: 4,
      gp: 14,
      duration: { unit: "hours", value: 1, text: "1 hour" },
      itemSeed: "item:Cinnamon Seers (Moderate)",
      effectSeed: "effect:Cinnamon Seers (Moderate)",
      text:
        "Zippy, alchemically treated cinnamon suffuses cinnamon seers, a rock candy with a lively taste that provides a mental boost. A cinnamon seer remains in your mouth for 1 hour, " +
        "its stimulating flavor granting you a +1 item bonus to checks to Recall Knowledge.",
    },
  ];

  const tierItems = [];
  for (const t of tiers) {
    const itemId = makeId(t.itemSeed);
    const effectId = makeId(t.effectSeed);
    const slugTier = t.name.toLowerCase();
    const name = `Cinnamon Seers (${t.name})`;

    items.push({
      _id: itemId,
      img: IMG,
      name,
      type: "consumable",
      system: {
        slug: `cinnamon-seers-${slugTier}`,
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
            `<p><strong>Secondary Effect</strong> <span class="action-glyph">r</span> (fortune)</p>` +
            `<p><strong>Trigger</strong> You gain no information from a Recall Knowledge check</p><hr />` +
            `<p><strong>Effect</strong> Reroll the triggering check. If this was a secret check, the GM rerolls rather than you; the candy doesn't give you any insight into what the GM ` +
            `rolled, so in that case you're rerolling based only on guesswork. The seer becomes inert. You become temporarily immune to cinnamon seers until the next time you make ` +
            `your daily preparations. While the effect lasts it gives you the @UUID[${uuidOf(biteId)}]{Bite Cinnamon Seers} action, which does this.</p>`,
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
        slug: `effect-cinnamon-seers-${slugTier}`,
        description: {
          value:
            `<p>Granted by @UUID[${uuidOf(itemId)}]{${name}}</p><p>You gain a +1 item bonus to checks to Recall Knowledge.</p>` +
            `<p>This effect also gives you @UUID[${uuidOf(biteId)}]{Bite Cinnamon Seers}.</p>`,
        },
        duration: { expiry: "turn-start", sustained: false, unit: t.duration.unit, value: t.duration.value },
        level: { value: t.level },
        publication,
        rules: [
          { key: "FlatModifier", predicate: ["action:recall-knowledge", notImmune], selector: ["arcana", "occultism", "nature", "religion", "lore"], type: "item", value: 1 },
          { key: "GrantItem", allowDuplicate: false, predicate: [notImmune], uuid: uuidOf(biteId) },
        ],
        start: { initiative: null, value: 0 },
        tokenIcon: { show: true },
        traits: { rarity: "common", value: [] },
      },
    });

    tierItems.push({ name, level: t.level, uuid: uuidOf(itemId) });
  }

  items.push(
    formulaItem({
      family: "Cinnamon Seers",
      img: IMG,
      made: "a cinnamon lozenge that sharpens recall",
      pub: publication,
      tiers: tierItems,
    }),
  );
};
