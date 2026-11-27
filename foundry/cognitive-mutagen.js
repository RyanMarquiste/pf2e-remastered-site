// The Cognitive Mutagen from PF2e (Player Core 2), with its text, numbers and art unchanged, but with the benefit and the drawback as separate effects (see split-mutagen.js).
//
// One correction to PF2e's data: PF2e's Major effect lowers the Bulk you can carry before becoming encumbered twice, and never lowers your maximum Bulk by 4 as the text says,
// so every tier here lowers the maximum Bulk by 4, as the text says.
const buildSplitMutagen = require("./split-mutagen");

module.exports = function buildCognitiveMutagen(context) {
  const RECALL_KNOWLEDGE = "@UUID[Compendium.pf2e.actionspf2e.Item.1OagaWtBpVXExToo]{Recall Knowledge}";

  // Extra text on the higher tiers: a skill the drinker becomes trained in (PF2e leaves this as text, so it is not automated).
  const extra = {
    Greater: " You become trained in one Intelligence-based skill [Arcana, Crafting, Lore, Occultism, Society], chosen at creation.",
    Major: " You become trained in one skill, chosen at creation.",
  };

  return buildSplitMutagen(
    {
      name: "Cognitive Mutagen",
      idKey: "Cognitive",
      slugBase: "cognitive-mutagen",
      img: "icons/consumables/potions/potion-vial-corked-purple.webp",
      intro: "Your mind becomes clear, but physical matters seem ephemeral.",
      benefit: (t) =>
        `<strong>Benefit</strong> You gain a +${t.bonus} item bonus to Arcana, Crafting, Lore, Occultism, and Society checks and all checks to ${RECALL_KNOWLEDGE}. ` +
        `Your critical failures on Recall Knowledge checks become failures instead.${extra[t.name] ?? ""}`,
      drawback:
        "<strong>Drawback</strong> You take a -2 penalty to weapon and unarmed attack rolls, Athletics checks, and acrobatics checks. You can carry 2 less Bulk than normal " +
        "before becoming encumbered, and the maximum Bulk you can carry is reduced by 4.",
      benefitRules: (t) => [
        { key: "FlatModifier", selector: ["arcana", "crafting", "lore-skill-check", "occultism", "society"], slug: "cognitive-mutagen-bonus", type: "item", value: t.bonus },
        { key: "FlatModifier", predicate: ["action:recall-knowledge"], selector: "skill-check", slug: "cognitive-mutagen-recall-knowledge-bonus", type: "item", value: t.bonus },
        {
          key: "AdjustDegreeOfSuccess",
          adjustment: { criticalFailure: "one-degree-better" },
          predicate: ["action:recall-knowledge"],
          selector: "skill-check",
          type: "skill",
        },
      ],
      // PF2e leaves the Mutant Innervation feat as text, so the copy gives the extra skill bonus itself. The telepathy is text only, as in PF2e.
      featBenefit: {
        feat: "Mutant Innervation",
        text:
          "you also gain the mutagen's item bonus to Deception, Diplomacy, Intimidation, Medicine, Nature, Performance, Religion, and Survival checks. In addition, you can communicate " +
          "telepathically with creatures within 60 feet with whom you share a language. The communication is two-way once you establish it, so a creature you contact can also communicate with you.",
        rules: (t) => [
          {
            key: "FlatModifier",
            selector: ["deception", "diplomacy", "intimidation", "medicine", "nature", "performance", "religion", "survival"],
            slug: "cognitive-mutagen-mutant-innervation-bonus",
            type: "item",
            value: t.bonus,
          },
        ],
      },
      drawbackRules: [
        { key: "FlatModifier", selector: ["acrobatics", "athletics", "strike-attack-roll"], slug: "cognitive-mutagen-drawback", value: -2 },
        { key: "ActiveEffectLike", mode: "subtract", path: "inventory.bulk.encumberedAfterAddend", value: 2 },
        { key: "ActiveEffectLike", mode: "subtract", path: "inventory.bulk.maxAddend", value: 4 },
      ],
    },
    context,
  );
};
