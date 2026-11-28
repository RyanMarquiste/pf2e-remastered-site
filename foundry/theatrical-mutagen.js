// The Theatrical Mutagen from PF2e (Player Core 2), with its text, numbers and art unchanged, but with the benefit and the drawback as separate effects (see split-mutagen.js).
//
// PF2e's Theatrical Mutagen does not follow the shared tiers: the Lesser costs 3 gp, not 4, and the durations are 1 minute, 1 minute, 10 minutes and 1 hour, with the duration in the item's
// flavor line rather than a Duration line. The Speed bonus is +5 feet on the Lesser and Moderate and +10 feet on the Greater and Major. All of that is kept. The part of the drawback that
// makes a character Off-Guard after a round without an Interact, Perform, Step or Stride is text only, as in PF2e.
const buildSplitMutagen = require("./split-mutagen");

module.exports = function buildTheatricalMutagen(context) {
  const PERFORM = "@UUID[Compendium.pf2e.actionspf2e.Item.EEDElIyin4z60PXx]{Perform}";
  const OFF_GUARD = "@UUID[Compendium.pf2e.conditionitems.Item.AJh5ex99aV6VTggg]{Off-Guard}";
  const own = {
    Lesser: { gp: 3, speed: 5, duration: { unit: "minutes", value: 1, text: "1 minute" } },
    Moderate: { gp: 12, speed: 5, duration: { unit: "minutes", value: 1, text: "1 minute" } },
    Greater: { gp: 300, speed: 10, duration: { unit: "minutes", value: 10, text: "10 minutes" } },
    Major: { gp: 3000, speed: 10, duration: { unit: "hours", value: 1, text: "1 hour" } },
  };

  return buildSplitMutagen(
    {
      name: "Theatrical Mutagen",
      idKey: "Theatrical",
      slugBase: "theatrical-mutagen",
      img: "icons/consumables/potions/potion-flask-corked-labeled-pink.webp",
      activate: "1",
      durationLine: false,
      tier: (t) => ({ gp: own[t.name].gp, duration: own[t.name].duration }),
      intro: (t) =>
        "Developed and widely used by students at the Kitharodian Academy in Oppara, the theatrical mutagen stimulates the creative centers of your brain. This causes your movements to become " +
        "exaggerated and your voice to become clear. However, the erratic surges of inspiration overload your senses, making it difficult to focus on mundane tasks. " +
        `This lasts for ${t.duration.text}.`,
      benefit: (t) =>
        `<strong>Benefit</strong> You gain a +${t.bonus} item bonus to Acrobatics checks, Crafting checks, and Performance checks. If you're untrained in any of these skills, your proficiency bonus ` +
        `is equal to your level instead of +0. You also gain a +${own[t.name].speed} feet status bonus to your Speed.`,
      drawback:
        `<strong>Drawback</strong> You take a –1 penalty to Perception checks and Will saves. After any round where you don't spend at least 1 action to Interact with an object, ${PERFORM}, ` +
        `Step, or Stride, you're ${OFF_GUARD} until the start of your next turn.`,
      benefitRules: (t) => [
        { key: "FlatModifier", selector: ["acrobatics", "crafting", "performance"], type: "item", value: t.bonus },
        { key: "FlatModifier", selector: ["acrobatics", "crafting", "performance"], slug: "theatrical-mutagen-proficiency", type: "proficiency", value: "@actor.level" },
        { key: "FlatModifier", selector: "land-speed", type: "status", value: own[t.name].speed },
      ],
      drawbackRules: [{ key: "FlatModifier", selector: ["perception", "will"], slug: "theatrical-mutagen-drawback", value: -1 }],
    },
    context,
  );
};
