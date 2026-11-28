// The Bestial Mutagen from PF2e (Player Core 2), with its text, numbers and art unchanged, but with the benefit and the drawback as separate effects (see split-mutagen.js).
//
// The claw and jaws are PF2e's own Strike rules, and the benefit effect adds PF2e's own bestial-mutagen-strike tag to them. PF2e's Mutant Physique feat finds that tag to raise the
// damage die size and give the deadly d10 trait, so the copy gets those from the feat without any rule of its own. PF2e's feat gives the Intimidation bonus by matching its own
// effects' names, which the copy's do not have, so the copy gives that itself.
//
// One fix to PF2e's data: its Moderate claw has no slug, as the Lesser, Greater and Major claws do, so here it has one.
const buildSplitMutagen = require("./split-mutagen");

module.exports = function buildBestialMutagen(context) {
  const STRIKING = "@UUID[Compendium.pf2e.equipment-srd.Item.DxCuJKynlnMQZHgp]{Striking}";
  // The claw (slashing) and jaws (piercing) damage dice of each tier.
  const dice = {
    Lesser: { claw: [1, "d4"], jaws: [1, "d6"] },
    Moderate: { claw: [2, "d6"], jaws: [2, "d8"] },
    Greater: { claw: [3, "d8"], jaws: [3, "d10"] },
    Major: { claw: [4, "d8"], jaws: [4, "d10"] },
  };
  const text = (pair) => pair.join("");
  const specialization =
    " You gain weapon specialization with the claw and jaws, or greater weapon specialization if you already have weapon specialization with these unarmed attacks.";

  return buildSplitMutagen(
    {
      name: "Bestial Mutagen",
      idKey: "Bestial",
      slugBase: "bestial-mutagen",
      img: "icons/consumables/potions/bottle-round-flask-fumes-purple.webp",
      intro: "Your features transform into something bestial and lumbering.",
      benefit: (t) =>
        `<strong>Benefit</strong> You gain a +${t.bonus} item bonus to Athletics checks and unarmed attack rolls. You gain a claw unarmed attack (${text(dice[t.name].claw)} slashing damage) ` +
        `with the agile trait and a jaws unarmed attack (${text(dice[t.name].jaws)} piercing damage). ${STRIKING} runes don't modify the damage caused by these attacks.` +
        `${t.name === "Major" ? specialization : ""}`,
      drawback: "<strong>Drawback</strong> You take a -2 penalty to Reflex saves, Acrobatics checks, and Stealth Checks.",
      benefitRules: (t) => [
        { key: "FlatModifier", selector: ["athletics", "unarmed-attack-roll"], type: "item", value: t.bonus },
        {
          baseType: "jaws",
          category: "unarmed",
          damage: { base: { damageType: "piercing", dice: dice[t.name].jaws[0], die: dice[t.name].jaws[1] } },
          group: "brawling",
          img: "icons/creatures/abilities/mouth-teeth-long-red.webp",
          key: "Strike",
          label: "PF2E.Weapon.Base.jaws",
          range: null,
          slug: "jaws",
          traits: ["unarmed"],
        },
        {
          baseType: "claw",
          category: "unarmed",
          damage: { base: { damageType: "slashing", dice: dice[t.name].claw[0], die: dice[t.name].claw[1] } },
          group: "brawling",
          img: "icons/commodities/claws/claw-bear-brown-grey.webp",
          key: "Strike",
          label: "PF2E.Weapon.Base.claw",
          range: null,
          slug: "claw",
          traits: ["unarmed", "agile"],
        },
        { itemType: "weapon", key: "ItemAlteration", mode: "add", predicate: ["item:id:{item|id}"], property: "other-tags", value: "bestial-mutagen-strike" },
        ...(t.name === "Major"
          ? [
              {
                hideIfDisabled: true,
                key: "FlatModifier",
                label: "PF2E.WeaponSpecialization",
                predicate: [{ gte: ["item:proficiency:rank", 2] }],
                selector: "{item|id}-damage",
                slug: "weapon-specialization",
                value: 2,
              },
              { key: "AdjustModifier", mode: "upgrade", predicate: ["item:proficiency:rank:3"], priority: 0, selector: "{item|id}-damage", slug: "weapon-specialization", value: 3 },
              { key: "AdjustModifier", mode: "upgrade", predicate: ["item:proficiency:rank:4"], priority: 0, selector: "{item|id}-damage", slug: "weapon-specialization", value: 4 },
              {
                key: "AdjustModifier",
                mode: "multiply",
                predicate: ["feature:weapon-specialization", { not: "feature:greater-weapon-specialization" }],
                relabel: "PF2E.GreaterWeaponSpecialization",
                selector: "{item|id}-damage",
                slug: "weapon-specialization",
                value: 2,
              },
            ]
          : []),
      ],
      featBenefit: {
        feat: "Mutant Physique",
        text:
          "you gain the mutagen's item bonus to your Intimidation checks. In addition, you increase the damage die size of your claws and jaws by one step, and they gain the deadly d10 trait.",
        // Only the Intimidation bonus needs a rule here: the die size and the deadly trait come from PF2e's feat, through the tag the claw and jaws carry.
        rules: (t) => [{ key: "FlatModifier", selector: "intimidation", slug: "bestial-mutagen-mutant-physique-bonus", type: "item", value: t.bonus }],
      },
      drawbackRules: [{ key: "FlatModifier", selector: ["reflex", "acrobatics", "stealth"], slug: "bestial-mutagen-drawback", value: -2 }],
    },
    context,
  );
};
