// The Cognitive Mutagen from PF2e (Player Core 2), with its text, numbers and art unchanged, but with the benefit and the drawback as separate effects (like the Drakeheart
// and Mind Doubling Mutagens), so the drawback can be suppressed on its own. Called from build.js, which supplies the shared helpers and the four tiers (Lesser, Moderate,
// Greater and Major at levels 1, 3, 11 and 17).
//
// The benefit effect grants the drawback effect and the drawback goes with it. One drawback effect serves every tier, since the drawback is the same in all of them.
// One correction to PF2e's data: PF2e's Major effect lowers the Bulk you can carry before becoming encumbered twice, and never lowers your maximum Bulk by 4 as the text says,
// so every tier here lowers the maximum Bulk by 4, as the text says.
module.exports = function buildCognitiveMutagen({ items, publication, makeId, uuidOf, tiers }) {
  const NAME = "Cognitive Mutagen";
  const IMG = "icons/consumables/potions/potion-vial-corked-purple.webp";
  const RECALL_KNOWLEDGE = "@UUID[Compendium.pf2e.actionspf2e.Item.1OagaWtBpVXExToo]{Recall Knowledge}";
  const SUPPRESSED = "cognitive-drawback-suppressed";

  // Extra text on the higher tiers: a skill the drinker becomes trained in (PF2e leaves this as text, so it is not automated).
  const extra = {
    Greater: " You become trained in one Intelligence-based skill [Arcana, Crafting, Lore, Occultism, Society], chosen at creation.",
    Major: " You become trained in one skill, chosen at creation.",
  };
  const benefitText = (t) =>
    `<strong>Benefit</strong> You gain a +${t.bonus} item bonus to Arcana, Crafting, Lore, Occultism, and Society checks and all checks to ${RECALL_KNOWLEDGE}. ` +
    `Your critical failures on Recall Knowledge checks become failures instead.${extra[t.name] ?? ""}`;
  const drawbackText =
    "<strong>Drawback</strong> You take a -2 penalty to weapon and unarmed attack rolls, Athletics checks, and acrobatics checks. You can carry 2 less Bulk than normal " +
    "before becoming encumbered, and the maximum Bulk you can carry is reduced by 4.";

  // The drawback doesn't change with the mutagen's tier, so one effect serves them all. It is granted by the benefit effect and removed with it.
  const drawbackId = makeId("effect:Cognitive:drawback");
  items.push({
    _id: drawbackId,
    img: IMG,
    name: `Effect: ${NAME} Drawback`,
    type: "effect",
    system: {
      slug: "effect-cognitive-mutagen-ccc-drawback",
      description: { value: `<p>Granted by the ${NAME} effect, and removed with it.</p><p>${drawbackText}</p>` },
      duration: { expiry: null, sustained: false, unit: "unlimited", value: -1 },
      level: { value: 1 },
      publication,
      rules: [
        { key: "RollOption", domain: "all", label: "Drawback suppressed", option: SUPPRESSED, toggleable: true, value: false },
        {
          key: "FlatModifier",
          selector: ["acrobatics", "athletics", "strike-attack-roll"],
          slug: "cognitive-mutagen-drawback",
          value: -2,
          predicate: [{ not: SUPPRESSED }],
        },
        { key: "ActiveEffectLike", mode: "subtract", path: "inventory.bulk.encumberedAfterAddend", value: 2, predicate: [{ not: SUPPRESSED }] },
        { key: "ActiveEffectLike", mode: "subtract", path: "inventory.bulk.maxAddend", value: 4, predicate: [{ not: SUPPRESSED }] },
      ],
      start: { initiative: null, value: 0 },
      tokenIcon: { show: true },
      traits: { rarity: "common", value: [] },
    },
  });

  for (const t of tiers) {
    const itemId = makeId(`item:Cognitive:${t.name}`);
    const effectId = makeId(`effect:Cognitive:${t.name}`);
    const slugTier = t.name.toLowerCase();

    items.push({
      _id: itemId,
      img: IMG,
      name: `${NAME} (${t.name})`,
      type: "consumable",
      system: {
        slug: `cognitive-mutagen-ccc-${slugTier}`,
        baseItem: null,
        bulk: { value: 0.1 },
        category: "mutagen",
        containerId: null,
        damage: null,
        description: {
          value:
            `<p><strong>Activate</strong> <span class="action-glyph">A</span> (manipulate)</p><hr />` +
            `<p>Your mind becomes clear, but physical matters seem ephemeral.</p>` +
            `<p>${benefitText(t)}</p>` +
            `<p>${drawbackText}</p>` +
            `<p><strong>Duration</strong> ${t.duration.text}.</p>` +
            `<p>@UUID[${uuidOf(effectId)}]{Effect: ${NAME} (${t.name})}</p>`,
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
        traits: { rarity: "common", value: ["alchemical", "consumable", "elixir", "mutagen", "polymorph"] },
        usage: { value: "held-in-one-hand" },
        uses: { autoDestroy: true, max: 1, value: 1 },
      },
    });

    // Benefit: the main effect, which also grants the drawback effect.
    items.push({
      _id: effectId,
      img: IMG,
      name: `Effect: ${NAME} (${t.name})`,
      type: "effect",
      system: {
        slug: `effect-cognitive-mutagen-ccc-${slugTier}`,
        description: {
          value: `<p>Granted by @UUID[${uuidOf(itemId)}]</p><p>${benefitText(t)}</p><p>This effect also applies @UUID[${uuidOf(drawbackId)}].</p>`,
        },
        duration: { expiry: "turn-start", sustained: false, unit: t.duration.unit, value: t.duration.value },
        level: { value: t.level },
        publication,
        rules: [
          {
            key: "FlatModifier",
            selector: ["arcana", "crafting", "lore-skill-check", "occultism", "society"],
            slug: "cognitive-mutagen-bonus",
            type: "item",
            value: t.bonus,
          },
          {
            key: "FlatModifier",
            predicate: ["action:recall-knowledge"],
            selector: "skill-check",
            slug: "cognitive-mutagen-recall-knowledge-bonus",
            type: "item",
            value: t.bonus,
          },
          {
            key: "AdjustDegreeOfSuccess",
            adjustment: { criticalFailure: "one-degree-better" },
            predicate: ["action:recall-knowledge"],
            selector: "skill-check",
            type: "skill",
          },
          { key: "GrantItem", uuid: uuidOf(drawbackId) },
        ],
        start: { initiative: null, value: 0 },
        tokenIcon: { show: true },
        traits: { rarity: "common", value: [] },
      },
    });
  }

  return { img: IMG };
};
