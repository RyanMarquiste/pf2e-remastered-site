// The Quicksilver Mutagen from PF2e (Player Core 2), with its text, numbers and art unchanged, but with the benefit and the drawback as separate effects (see split-mutagen.js).
//
// PF2e's rules are kept as they are, the damage included: the drawback effect, which the benefit effect grants when the mutagen is drunk, has the rule that takes damage equal to twice
// the character's level (once, when it is applied) and stops that Hit Points being recovered while it lasts. The Drawback suppressed toggle is on the drawback effect, which only exists once
// the mutagen has been drunk, so it can't skip the damage: switching it on afterwards stops the Hit Points being unrecoverable and the Fortitude penalty, but does not give back the damage taken.
const buildSplitMutagen = require("./split-mutagen");

module.exports = function buildQuicksilverMutagen(context) {
  return buildSplitMutagen(
    {
      name: "Quicksilver Mutagen",
      idKey: "Quicksilver",
      slugBase: "quicksilver-mutagen",
      img: "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/quicksilver-mutagen.webp",
      intro: "You become swifter and nimbler but also fragile.",
      benefit: (t) =>
        `<strong>Benefit</strong> You gain a +${t.bonus} item bonus to Acrobatics checks, Stealth checks, Thievery checks, Reflex saves, and Dexterity-based attack rolls, and you gain a +${t.bonus * 5} foot status bonus to your Speed.`,
      drawback:
        "<strong>Drawback</strong> You take damage equal to twice your level; you can't recover Hit Points lost this way by any means while the mutagen lasts. You take a -2 penalty to Fortitude saves.",
      benefitRules: (t) => [
        { key: "FlatModifier", selector: ["acrobatics", "dex-attack", "reflex", "stealth", "thievery"], type: "item", value: t.bonus },
        { key: "FlatModifier", selector: "land-speed", type: "status", value: t.bonus * 5 },
      ],
      // PF2e leaves the Mutant Physique feat's Quicksilver benefit as text, and so does the copy: nothing in the rules steps or squeezes a character.
      featBenefit: {
        feat: "Mutant Physique",
        text:
          "you can stretch your legs and Step up to 10 feet, and you can squish and compress your body, allowing you to make it through tight spaces as if you were one size smaller, " +
          "in addition to any effect from Squeezing.",
        rules: () => [],
      },
      drawbackRules: [
        { key: "FlatModifier", selector: "fortitude", slug: "quicksilver-mutagen-drawback", value: -2 },
        { key: "LoseHitPoints", recoverable: false, value: "2*@actor.level" },
      ],
    },
    context,
  );
};
