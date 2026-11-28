// The Serene Mutagen from PF2e (Player Core 2), with its text, numbers and art unchanged, but with the benefit and the drawback as separate effects (see split-mutagen.js).
//
// Two things differ from PF2e's data, both in the effect text only: PF2e's effects drop "item" from "item bonus" and leave spell damage out of the drawback's damage penalty, so here the
// effects say the same as the items. The rules are PF2e's own; the penalty to spell damage is text only there, as it is here.
const buildSplitMutagen = require("./split-mutagen");

module.exports = function buildSereneMutagen(context) {
  const extra = {
    Greater: " When you roll a success on a Will save against a mental effect, you get a critical success instead.",
    Major: " When you roll a success on a Will save against a mental effect, you get a critical success instead, and your critical failures on Will saves against mental effects become failures instead.",
  };
  // Lesser, Moderate and Greater improve their bonus by 1 on Will saves against mental effects; the Major's bonus is already as high as that gets.
  const improves = (t) => t.name !== "Major";
  const mental = ["item:trait:mental"];

  return buildSplitMutagen(
    {
      name: "Serene Mutagen",
      idKey: "Serene",
      slugBase: "serene-mutagen",
      img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/serene-mutagen.webp",
      intro: "You gain inner serenity, but you find violence off-putting.",
      benefit: (t) =>
        `<strong>Benefit</strong> You gain a +${t.bonus} item bonus to Will saves and Perception, Medicine, Nature, Religion, and Survival checks.` +
        `${improves(t) ? ` This bonus improves to +${t.bonus + 1} when you attempt Will saves against mental effects.` : ""}${extra[t.name] ?? ""}`,
      drawback:
        "<strong>Drawback</strong> You take a -1 penalty to attack rolls and save DCs of offensive spells, and a -1 penalty per damage die to all weapon, unarmed attack, and spell damage.",
      benefitRules: (t) => [
        { key: "FlatModifier", selector: ["medicine", "nature", "perception", "religion", "survival", "will"], slug: "serene-mutagen-bonus", type: "item", value: t.bonus },
        ...(improves(t) ? [{ key: "AdjustModifier", mode: "upgrade", predicate: mental, selector: "will", slug: "serene-mutagen-bonus", value: t.bonus + 1 }] : []),
        ...(extra[t.name]
          ? [
              {
                key: "AdjustDegreeOfSuccess",
                adjustment: t.name === "Major" ? { criticalFailure: "one-degree-better", success: "one-degree-better" } : { success: "one-degree-better" },
                predicate: mental,
                selector: "will",
              },
            ]
          : []),
      ],
      // PF2e leaves the Mutant Innervation feat as text, and so does the copy: nothing in the rules detects a detection effect.
      featBenefit: {
        feat: "Mutant Innervation",
        text:
          "detection, revelation, and scrying effects of 9th rank (or 17th level) or lower detect nothing from you or your possessions and auras. For instance, detect magic would still detect " +
          "other magic in the area, but not any magic on you.",
        rules: () => [],
      },
      // The spell DC penalty is a toggle on the effect, as in PF2e, so it can be switched off for a character who has no spell DC to lower. The penalty to spell damage is text only.
      drawbackRules: [
        { key: "RollOption", label: "PF2E.Mutagens.SereneMutagen.PenaltyLabel", option: "serene-mutagen-dc-penalty", placement: "spellcasting", toggleable: true },
        { key: "FlatModifier", selector: "attack-roll", slug: "serene-mutagen-attack-penalty", value: -1 },
        { key: "FlatModifier", selector: "strike-damage", slug: "serene-mutagen-strike-damage-penalty", value: "-@weapon.system.damage.dice" },
        { key: "FlatModifier", predicate: ["serene-mutagen-dc-penalty"], selector: "spell-dc", slug: "serene-mutagen-spell-dc-penalty", value: -1 },
      ],
    },
    context,
  );
};
