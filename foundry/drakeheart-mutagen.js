// The Drakeheart Mutagen from PF2e (Player Core 2), with its text, numbers and art unchanged, but with the benefit and the drawback as separate effects (like the Cognitive and
// Juggernaut Mutagens), so the drawback can be suppressed on its own. It is written out in full, not built by split-mutagen.js, because it also grants PF2e's Final Surge action.
// The levels, prices and durations are the same as the other mutagens' tiers, which build.js passes in. It has the same name as PF2e's mutagen: the source trait and the Source
// line tell them apart, and the slugs keep a "marquiste" so they never clash with PF2e's.
module.exports = function buildDrakeheartMutagen({ items, publication, makeId, uuidOf, tiers }) {
  const DRAKE = "Drakeheart Mutagen";
  const DRAKE_IMG = "systems/pf2e/icons/equipment/alchemical-items/alchemical-elixirs/drakeheart-mutagen.webp";
  const FINAL_SURGE = "Compendium.pf2e.actionspf2e.Item.EHa0owz6mccnmSBf";
  const RECALL_KNOWLEDGE = "@UUID[Compendium.pf2e.actionspf2e.Item.1OagaWtBpVXExToo]{Recall Knowledge}";
  // PF2e's flavour text; its Moderate item has a different line from the other three tiers, and it is kept as written.
  const drakeBody = "Your skin grows scales like a drake, and your eyesight become sharp and your pupils slitted, but your mind and reflexes slow.";
  const drakeModerateBody =
    "Your skin grows tough scales like a drake, your eyesight become sharp and your pupils slitted, and your limbs grow wiry and quick, but your mind and reflexes become slow.";
  const drakeDrawbackText = `<p><strong>Drawback</strong> You take a -1 penalty to Will saves, Reflex saves, and all skill checks to ${RECALL_KNOWLEDGE}.</p>`;

  // The drawback doesn't change with the mutagen's tier either, so one effect serves them all. It is granted by the benefits effect and removed with it.
  const drakeDrawbackId = makeId("effect:Drakeheart:drawback");
  items.push({
    _id: drakeDrawbackId,
    img: DRAKE_IMG,
    name: `Effect: ${DRAKE} Drawback`,
    type: "effect",
    system: {
      slug: "effect-drakeheart-mutagen-marquiste-drawback",
      description: { value: `<p>Granted by the ${DRAKE} effect, and removed with it.</p>` + drakeDrawbackText },
      duration: { expiry: null, sustained: false, unit: "unlimited", value: -1 },
      level: { value: 1 },
      publication,
      rules: [
        // Set to true by the Mutagenist Field Vial's script (scripts/alchemist/mutagenist-field-vial.js) while the vial lasts.
        { key: "RollOption", domain: "all", option: "drakeheart-drawback-suppressed", value: false },
        {
          key: "FlatModifier",
          selector: ["reflex", "will"],
          slug: "drakeheart-mutagen-drawback-saves",
          value: -1,
          predicate: [{ not: "drakeheart-drawback-suppressed" }],
        },
        {
          key: "FlatModifier",
          selector: "skill-check",
          slug: "drakeheart-mutagen-drawback-recall-knowledge",
          value: -1,
          predicate: ["action:recall-knowledge", { not: "drakeheart-drawback-suppressed" }],
        },
      ],
      start: { initiative: null, value: 0 },
      tokenIcon: { show: true },
      traits: { rarity: "common", value: [] },
    },
  });

  for (const t of tiers) {
    const effectId = makeId(`effect:Drakeheart:${t.name}`);
    const itemId = makeId(`item:Drakeheart:${t.name}`);
    const dur = t.duration;
    const ac = t.bonus + 3; // +4, +5, +6, +7
    const perception = t.bonus; // +1, +2, +3, +4

    const benefitShort = `<p><strong>Benefit</strong> You gain +${ac} item bonus to AC, a Dexterity cap of +2, and a +${perception} item bonus to Perception checks.</p>`;
    const benefit =
      `<p><strong>Benefit</strong> You gain +${ac} item bonus to AC, a Dexterity cap of +2 (as usual, use your lowest Dexterity cap if you have more than one), ` +
      `and a +${perception} item bonus to Perception checks. If you're wearing armor, you still calculate your proficiency bonus to AC based on your ` +
      `proficiency in the armor you're wearing, even if the drakeheart mutagen has a higher item bonus. You also gain the @UUID[${FINAL_SURGE}]{Final Surge} action.</p>`;

    items.push({
      _id: itemId,
      img: DRAKE_IMG,
      name: `${DRAKE} (${t.name})`,
      type: "consumable",
      system: {
        slug: `drakeheart-mutagen-marquiste-${t.name.toLowerCase()}`,
        baseItem: null,
        bulk: { value: 0.1 },
        category: "mutagen",
        containerId: null,
        damage: null,
        description: {
          value:
            `<p><strong>Activate</strong> <span class="action-glyph">A</span> (manipulate)</p><hr />` +
            `<p>${t.name === "Moderate" ? drakeModerateBody : drakeBody}</p>` +
            benefit +
            drakeDrawbackText +
            `<p><strong>Duration</strong> ${dur.text} or until you use Final Surge, whichever comes first.</p>` +
            `<p>@UUID[${uuidOf(effectId)}]</p>`,
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

    // Benefits: the main effect, which also grants Final Surge and the drawback effect.
    items.push({
      _id: effectId,
      img: DRAKE_IMG,
      name: `Effect: ${DRAKE} (${t.name})`,
      type: "effect",
      system: {
        slug: `effect-drakeheart-mutagen-marquiste-${t.name.toLowerCase()}`,
        description: {
          value: `<p>Granted by @UUID[${uuidOf(itemId)}]</p>` + benefitShort + `<p>This effect also applies @UUID[${uuidOf(drakeDrawbackId)}].</p>`,
        },
        duration: { expiry: "turn-start", sustained: false, unit: dur.unit, value: dur.value },
        level: { value: t.level },
        publication,
        rules: [
          { key: "DexterityModifierCap", value: 2 },
          { key: "FlatModifier", selector: "ac", slug: "drakeheart-mutagen-ac", type: "item", value: ac },
          { key: "FlatModifier", selector: "perception", slug: "drakeheart-mutagen-perception", type: "item", value: perception },
          { key: "GrantItem", uuid: FINAL_SURGE },
          { key: "GrantItem", uuid: uuidOf(drakeDrawbackId) },
        ],
        start: { initiative: null, value: 0 },
        tokenIcon: { show: true },
        traits: { rarity: "common", value: [] },
      },
    });
  }
  return { name: DRAKE, img: DRAKE_IMG };
};
