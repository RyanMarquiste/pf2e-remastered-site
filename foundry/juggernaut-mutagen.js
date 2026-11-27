// The Juggernaut Mutagen from PF2e (Player Core 2), with its text, numbers and art unchanged, but with the benefit and the drawback as separate effects (see split-mutagen.js).
//
// One correction to PF2e's data: the Moderate item's text says "Duration 10 minute", and here it says 10 minutes.
const buildSplitMutagen = require("./split-mutagen");

module.exports = function buildJuggernautMutagen(context) {
  // The temporary Hit Points of each tier, and the extra text and degree-of-success rule on the higher tiers.
  const tempHp = { Lesser: 5, Moderate: 10, Greater: 30, Major: 45 };
  const extra = {
    Greater: " When you roll a success on a Fortitude save, you get a critical success instead.",
    Major: " When you roll a success on a Fortitude save you get a critical success instead, and your critical failures on Fortitude saves become failures instead.",
  };
  const adjustment = {
    Greater: { success: "one-degree-better" },
    Major: { criticalFailure: "one-degree-better", success: "one-degree-better" },
  };
  const base = (t) => `<strong>Benefit</strong> You gain a +${t.bonus} item bonus to Fortitude saves and ${tempHp[t.name]} temporary Hit Points.`;

  return buildSplitMutagen(
    {
      name: "Juggernaut Mutagen",
      idKey: "Juggernaut",
      slugBase: "juggernaut-mutagen",
      img: "icons/consumables/potions/bottle-metal-yellow-gray.webp",
      intro: "Your body becomes sturdy and ponderous.",
      // The item also says the temporary Hit Points come back; the effect doesn't (and PF2e doesn't automate it).
      benefit: (t) => `${base(t)} Whenever you are at maximum Hit Points for at least 1 full minute, you regain the temporary Hit Points.${extra[t.name] ?? ""}`,
      effectBenefit: (t) => `${base(t)}${extra[t.name] ?? ""}`,
      drawback: "<strong>Drawback</strong> You take a -2 penalty to Will saves, Perception checks and initiative rolls.",
      benefitRules: (t) => [
        { key: "FlatModifier", selector: "fortitude", type: "item", value: t.bonus },
        { key: "TempHP", value: tempHp[t.name] },
        ...(adjustment[t.name] ? [{ key: "AdjustDegreeOfSuccess", adjustment: adjustment[t.name], selector: "fortitude", type: "save" }] : []),
      ],
      drawbackRules: [
        { key: "FlatModifier", selector: ["initiative", "perception", "will"], slug: "juggernaut-mutagen-drawback", type: "untyped", value: -2 },
      ],
    },
    context,
  );
};
