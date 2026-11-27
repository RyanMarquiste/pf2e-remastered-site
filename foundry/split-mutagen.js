// A PF2e mutagen copied into Marquiste Additions' Common Enhancements pack with its benefit and its drawback as separate effects (like the Drakeheart Mutagen), so the drawback can be suppressed on its own.
// Each mutagen has a small spec file (such as cognitive-mutagen.js) that gives its text and rules; this builds the items from it. Called from those files, which build.js calls with
// the shared helpers and the four tiers (Lesser, Moderate, Greater and Major at levels 1, 3, 11 and 17).
//
// For each tier there is the consumable and a benefit effect that grants the drawback effect, and the drawback goes with it. One drawback effect serves every tier, since the
// drawback is the same in all of them. The names match PF2e's; the Cauldron trait and Source line tell them apart, and the slugs keep a "marquiste" so they never clash with PF2e's.
//
// The spec:
//   name, idKey, slugBase, img  - the name ("Cognitive Mutagen"), the key its ids are made from, its slug ("cognitive-mutagen") and its icon
//   intro                       - the flavor line at the top of the description
//   benefit(t), effectBenefit(t)- the Benefit text of the item for tier t, and (if it differs) of its effect; no <p> tags
//   drawback                    - the Drawback text (the same for every tier)
//   benefitRules(t)             - the rules the benefit effect has for tier t
//   drawbackRules               - the rules the drawback effect has; each is switched off by the Drawback suppressed toggle
//   featBenefit (optional)      - the extra benefit of an alchemist feat that names this mutagen (Mutant Physique or Mutant Innervation): { feat, text, rules(t) }. PF2e's Mutant
//                                 Physique only works for PF2e's own effects, and Mutant Innervation is only text, so the copy carries the benefit itself: the text goes in the item and
//                                 effect descriptions, and the rules go in the benefit effect, each applying only to a character with the feat (its slug is in the rules' predicate).
module.exports = function buildSplitMutagen(spec, { items, publication, makeId, uuidOf, tiers }) {
  const { name, idKey, slugBase, img, intro, benefit, drawback, benefitRules, drawbackRules, featBenefit } = spec;
  // The feat's paragraph, such as "Mutant Physique If you have the Mutant Physique feat, ...", and its rules, which only apply to a character with the feat.
  const featPara = featBenefit ? `<p><strong>${featBenefit.feat}</strong> If you have the ${featBenefit.feat} feat, ${featBenefit.text}</p>` : "";
  const featSlug = featBenefit ? featBenefit.feat.toLowerCase().replace(/ /g, "-") : null;
  const featRules = (t) => (featBenefit ? featBenefit.rules(t).map((rule) => ({ ...rule, predicate: [...(rule.predicate ?? []), `feat:${featSlug}`] })) : []);
  const effectBenefit = spec.effectBenefit ?? benefit;
  const SUPPRESSED = `${slugBase.replace(/-mutagen$/, "")}-drawback-suppressed`;

  const drawbackId = makeId(`effect:${idKey}:drawback`);
  items.push({
    _id: drawbackId,
    img,
    name: `Effect: ${name} Drawback`,
    type: "effect",
    system: {
      slug: `effect-${slugBase}-marquiste-drawback`,
      description: { value: `<p>Granted by the ${name} effect, and removed with it.</p><p>${drawback}</p>` },
      duration: { expiry: null, sustained: false, unit: "unlimited", value: -1 },
      level: { value: 1 },
      publication,
      rules: [
        { key: "RollOption", domain: "all", label: "Drawback suppressed", option: SUPPRESSED, toggleable: true, value: false },
        ...drawbackRules.map((rule) => ({ ...rule, predicate: [{ not: SUPPRESSED }] })),
      ],
      start: { initiative: null, value: 0 },
      tokenIcon: { show: true },
      traits: { rarity: "common", value: [] },
    },
  });

  for (const t of tiers) {
    const itemId = makeId(`item:${idKey}:${t.name}`);
    const effectId = makeId(`effect:${idKey}:${t.name}`);
    const slugTier = t.name.toLowerCase();

    items.push({
      _id: itemId,
      img,
      name: `${name} (${t.name})`,
      type: "consumable",
      system: {
        slug: `${slugBase}-marquiste-${slugTier}`,
        baseItem: null,
        bulk: { value: 0.1 },
        category: "mutagen",
        containerId: null,
        damage: null,
        description: {
          value:
            `<p><strong>Activate</strong> <span class="action-glyph">A</span> (manipulate)</p><hr />` +
            `<p>${intro}</p>` +
            `<p>${benefit(t)}</p>` +
            `<p>${drawback}</p>` +
            featPara +
            `<p><strong>Duration</strong> ${t.duration.text}.</p>` +
            `<p>@UUID[${uuidOf(effectId)}]{Effect: ${name} (${t.name})}</p>`,
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
      img,
      name: `Effect: ${name} (${t.name})`,
      type: "effect",
      system: {
        slug: `effect-${slugBase}-marquiste-${slugTier}`,
        description: {
          value: `<p>Granted by @UUID[${uuidOf(itemId)}]</p><p>${effectBenefit(t)}</p>${featPara}<p>This effect also applies @UUID[${uuidOf(drawbackId)}].</p>`,
        },
        duration: { expiry: "turn-start", sustained: false, unit: t.duration.unit, value: t.duration.value },
        level: { value: t.level },
        publication,
        rules: [...benefitRules(t), ...featRules(t), { key: "GrantItem", uuid: uuidOf(drawbackId) }],
        start: { initiative: null, value: 0 },
        tokenIcon: { show: true },
        traits: { rarity: "common", value: [] },
      },
    });
  }

  return { name, img };
};
