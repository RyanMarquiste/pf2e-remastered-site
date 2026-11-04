// Volatile Vial, the four Field Vials, the Toxic Coating effects, and the house-rule Quick Alchemy feat.
// Called from build.js, which supplies the shared helpers.
module.exports = function buildVials({ items, publication, makeId, uuidOf, img }) {
  const tiers = [
    { name: "Lesser", level: 1, dice: 1 },
    { name: "Moderate", level: 4, dice: 2 },
    { name: "Greater", level: 12, dice: 3 },
    { name: "Major", level: 18, dice: 4 },
  ];

    const activate = (glyph, text) => `<p><strong>Activate</strong> <span class="action-glyph">${glyph}</span> ${text}</p><hr />`;

  // The same level-based scaling PF2e's own Versatile Vial uses: attack bonus from level 4 and the dice, with the splash matching.
  const scaling = () => [
    {
      hideIfDisabled: true,
      key: "FlatModifier",
      predicate: [{ gte: ["parent:level", 4] }],
      selector: "{item|id}-attack",
      type: "item",
      value: "ternary(gte(@item.level,18),3,ternary(gte(@item.level,12),2,1))",
    },
    {
      key: "DamageAlteration",
      mode: "upgrade",
      property: "dice-number",
      selectors: ["{item|id}-damage"],
      slug: "base",
      value: "ternary(gte(@item.level,18),4,ternary(gte(@item.level,12),3,ternary(gte(@item.level,4),2,1)))",
    },
    {
      key: "AdjustModifier",
      mode: "upgrade",
      selector: "{item|id}-damage",
      slug: "splash",
      value: "ternary(gte(@item.level,18),4,ternary(gte(@item.level,12),3,ternary(gte(@item.level,4),2,1)))",
    },
  ];

  const bomb = ({ name, level, damageType, traits, description, rules, image }) => ({
    _id: makeId(`item:${name}`),
    img: image,
    name,
    type: "weapon",
    system: {
      ammo: null,
      baseItem: "alchemical-bomb",
      bonus: { value: 0 },
      bonusDamage: { value: 0 },
      bulk: { value: 0 },
      category: "martial",
      containerId: null,
      damage: { damageType, dice: 1, die: "d6" },
      description: { value: description },
      expend: 1,
      grade: null,
      group: "bomb",
      hardness: 0,
      hp: { max: 0, value: 0 },
      level: { value: level },
      material: { grade: null, type: null },
      price: { value: {} },
      publication,
      quantity: 1,
      range: 20,
      reload: { value: "-" },
      rules,
      runes: { potency: 0, property: [], striking: 0 },
      size: "med",
      splashDamage: { value: 1 },
      traits: { rarity: "common", value: traits },
      usage: { canBeAmmo: false, value: "held-in-one-hand" },
    },
  });

  // Volatile Vial: the Versatile Vial renamed. One item per tier; the house-rule setting swaps these in for Versatile Vials.
  for (const t of tiers) {
    const item = bomb({
      name: `Volatile Vial (${t.name})`,
      level: t.level,
      damageType: "acid",
      image: img("volatile-vial"),
      traits: ["acid", "alchemical", "bomb", "consumable", "fleeting", "infused", "splash"],
      description:
        activate("A", "Strike") +
        "<p><em>A corked flask holding layers of green, yellow, and amber liquid that never quite mix. The thin, watery chemicals shift " +
        "and roil whenever the glass is jostled, with a pale vapor curling above them and a sharp, stinging smell leaking from the cork.</em></p>" +
        "<p>The volatile chemicals in this flask can be used offensively in a pinch.</p>" +
        `<p>The bomb deals ${t.dice}d6 acid damage and ${t.dice} acid splash damage.${t.level >= 4 ? ` You gain a +${t.level >= 18 ? 3 : t.level >= 12 ? 2 : 1} item bonus to attack rolls.` : ""}</p>`,
      rules: scaling(),
    });
    item.system.slug = "volatile-vial";
    items.push(item);
  }

  // Bomber Field Vial: the damage type is chosen on the Strike, through PF2e's Versatile trait (acid is the default).
  for (const t of tiers) {
    const item = bomb({
      name: `Bomber Field Vial (${t.name})`,
      level: t.level,
      damageType: "acid",
      image: img("bomber-field-vial"),
      traits: ["alchemical", "bomb", "consumable", "fleeting", "infused", "splash", "versatile-cold", "versatile-electricity", "versatile-fire"],
      description:
        activate("A", "Strike") +
        "<p><em>A corked flask holding a chaotic mixture of four thin liquids that never quite blend: corrosive green, icy blue, pale " +
        "crackling gold, and glowing orange.</em></p>" +
        "<p>When you Strike with this vial, you choose its damage type: acid, cold, electricity, or fire. The vial's initial and splash " +
        "damage both use the chosen type.</p>" +
        `<p>The bomb deals ${t.dice}d6 damage of the chosen type and ${t.dice} splash damage of that type.</p>` +
        "<p><strong>Advanced Vial (11th level)</strong> When you create the vial, you can treat it as made of one special material of your " +
        "choice: adamantine, cold iron, or dawnsilver.</p>",
      rules: scaling(),
    });
    item.system.slug = "bomber-field-vial";
    items.push(item);
  }

  // Toxicologist Field Vial: a poison bomb that can instead be applied to a weapon, which uses the coating effects below.
  const coatingIds = {};
  for (const t of tiers) {
    coatingIds[t.name] = {
      plain: makeId(`effect:Toxic Coating:${t.name}`),
      advanced: makeId(`effect:Advanced Toxic Coating:${t.name}`),
    };
  }
  for (const t of tiers) {
    const item = bomb({
      name: `Toxicologist Field Vial (${t.name})`,
      level: t.level,
      damageType: "poison",
      image: img("toxicologist-field-vial"),
      traits: ["alchemical", "bomb", "consumable", "fleeting", "infused", "poison", "splash", "mutable-acid"],
      description:
        activate("A", "Strike") +
        "<p><em>A corked flask of oily, black-green liquid that clings to the glass in slow, dripping strands, with a bitter, acrid smell.</em></p>" +
        `<p>The bomb deals ${t.dice}d6 poison damage and ${t.dice} poison splash damage.</p>` +
        "<p><strong>Field Benefit</strong> The Toxicologist research field's benefit of interchanging acid and poison damage still applies to this vial. " +
        "Applying the vial to your own weapon or ammunition as a single action also uses the Toxicologist's field benefit.</p>" +
        "<p><strong>Applied</strong> <span class=\"action-glyph\">A</span> Interact. Apply the vial as an injury poison to a weapon you're holding, or to a piece of " +
        "ammunition on your person or loaded in a weapon you're holding. The vial is used up, and the weapon or ammunition gains one of these effects:</p>" +
        `<ul><li>@UUID[${uuidOf(coatingIds[t.name].plain)}]{Toxic Coating} The vial's initial damage is added to the first successful Strike with the coated weapon or ammunition.</li>` +
        `<li>@UUID[${uuidOf(coatingIds[t.name].advanced)}]{Advanced Toxic Coating} (Advanced Vial, 11th level) As Toxic Coating, and the creature also takes persistent poison damage equal to the vial's splash damage.</li></ul>` +
        "<p><strong>Special</strong> If your previous action was to create this vial with Quick Alchemy, applying it to a weapon you're holding, or to ammunition on your " +
        "person or loaded in a weapon you're holding, costs no action. This is a feature of the Toxicologist's Field Benefit.</p>",
      rules: scaling(),
    });
    item.system.slug = "toxicologist-field-vial";
    items.push(item);

    // The coating effects last until the end of the current turn. Each asks which weapon is coated and adds its poison damage to that weapon only.
    for (const [kind, id, label] of [
      ["plain", coatingIds[t.name].plain, "Toxic Coating"],
      ["advanced", coatingIds[t.name].advanced, "Advanced Toxic Coating"],
    ]) {
      const weapon = "{item|flags.pf2e.rulesSelections.weapon}";
      const note = `Coated with a Toxicologist's poison until the end of the turn, the first successful Strike or a critical failure (or, if the weapon fires ammunition, until it is fired): ${t.dice}d6 poison damage` + (kind === "advanced" ? ` and ${t.dice} persistent poison damage.` : ".");
      const tag = (value) => ({ key: "ItemAlteration", itemType: "weapon", mode: "add", predicate: [`item:id:${weapon}`], property: "other-tags", value });
      const rules = [
        {
          key: "ChoiceSet",
          adjustName: false,
          choices: { ownedItems: true, types: ["weapon"], predicate: [{ or: ["item:damage:type:piercing", "item:damage:type:slashing"] }] },
          flag: "weapon",
          prompt: "Weapon to coat",
        },
        { key: "DamageDice", selector: `${weapon}-damage`, diceNumber: t.dice, dieSize: "d6", damageType: "poison" },
        tag("poisoned"),
        tag("toxic-coating"),
        {
          key: "ItemAlteration",
          itemType: "weapon",
          // PF2e always draws the rule's label as a large heading above the note; a space keeps it empty, since the note has its own bold title.
          label: " ",
          mode: "add",
          predicate: [`item:id:${weapon}`],
          property: "description",
          value: [{ title: label, text: note }],
        },
      ];
      if (kind === "advanced") {
        rules.push({ key: "FlatModifier", selector: `${weapon}-damage`, damageCategory: "persistent", damageType: "poison", value: t.dice });
      }
      items.push({
        _id: id,
        img: img(kind === "plain" ? "toxic-coating" : "advanced-toxic-coating"),
        name: `Effect: ${label} (${t.name})`,
        type: "effect",
        system: {
          description: {
            value:
              `<p>Granted by @UUID[${uuidOf(item._id)}]</p>` +
              "<p><strong>Fleeting</strong> Unlike most injury poisons, this effect is Fleeting and will expire at the end of the current turn, whether or not the weapon has hit. It is also used up, like any injury poison, by the first successful Strike with the coated weapon or by a critical failure on the Strike. On a weapon that fires ammunition it is used up as soon as the weapon is fired.</p>" +
              `<p>Choose a weapon you are holding or wearing that deals piercing or slashing damage. It is tagged as poisoned and, on a successful Strike with it, adds ${t.dice}d6 poison damage` +
              (kind === "advanced" ? ` and ${t.dice} persistent poison damage` : "") +
              " until the effect ends. If the weapon fires ammunition, the poison is on the ammunition instead: it is spent when the weapon is fired, hit or miss.</p>",
          },
          duration: { expiry: "turn-end", sustained: false, unit: "rounds", value: 0 },
          level: { value: t.level },
          publication,
          rules,
          start: { initiative: null, value: 0 },
          tokenIcon: { show: true },
          traits: { rarity: "common", value: ["fleeting", "infused", "injury", "poison", "mutable-acid"] },
        },
      });
    }
  }

  // Chirurgeon Field Vial: heals instead of damaging.
  for (const t of tiers) {
    items.push({
      _id: makeId(`item:Chirurgeon Field Vial:${t.name}`),
      img: img("chirurgeon-field-vial"),
      name: `Chirurgeon Field Vial (${t.name})`,
      type: "consumable",
      system: {
        baseItem: null,
        bulk: { value: 0 },
        category: "other",
        containerId: null,
        damage: { formula: `${t.dice}d6`, kind: "healing", type: "untyped" },
        description: {
          value:
            activate("A", "Interact") +
            "<p><em>A corked flask of thick, rust-red liquid that clings and clots at the glass when tipped, flecked with bits of green herb and smelling of " +
            "iron and crushed herbs.</em></p>" +
            "<p>Instead of dealing damage, this vial restores Hit Points to one living creature. You can either drink the vial yourself, or throw it at a willing " +
            `creature within 20 feet. The creature that drinks or is hit by the vial regains @Damage[${t.dice}d6[healing]] Hit Points. If the vial is drunk, it also has the elixir trait.</p>` +
            "<p><strong>Coagulant</strong> A creature that recovers Hit Points from a coagulant item can't recover Hit Points from another coagulant item for 10 minutes, " +
            "though it still gains their other effects.</p>" +
            "<p><strong>Advanced Vial (11th level)</strong> When the vial heals a creature with half its maximum Hit Points or fewer, the coagulant trait doesn't apply to that healing.</p>",
        },
        hardness: 0,
        hp: { max: 0, value: 0 },
        level: { value: t.level },
        material: { grade: null, type: null },
        price: { value: {} },
        publication,
        quantity: 1,
        rules: [],
        size: "med",
        slug: "chirurgeon-field-vial",
        traits: { rarity: "common", value: ["alchemical", "bomb", "coagulant", "consumable", "fleeting", "healing", "infused"] },
        usage: { value: "held-in-one-hand" },
        uses: { autoDestroy: true, max: 1, value: 1 },
      },
    });
  }

  // Mutagenist Field Vial: one item (it has no tiers) and an effect that carries the Advanced Vial resistance.
  const mutagenistEffectId = makeId("effect:Mutagenist Field Vial");
  const mutagenistId = makeId("item:Mutagenist Field Vial");
  items.push({
    _id: mutagenistId,
    img: img("mutagenist-field-vial"),
    name: "Mutagenist Field Vial",
    type: "consumable",
    system: {
      baseItem: null,
      bulk: { value: 0 },
      category: "elixir",
      containerId: null,
      damage: null,
      description: {
        value:
          activate("A", "Interact") +
          "<p><em>A corked flask of pale, pearly liquid that swirls slowly on its own beneath a faint haze of vapor, smooth as cream, with a clean scent like rain " +
          "on warm stone.</em></p>" +
          "<p>You drink this vial to suppress the drawback of one mutagen currently affecting you for 1 minute.</p>" +
          "<p>If you have more than one drawback from separate sources, such as from Combine Elixirs or a similar ability, you suppress one of your choice. A mutagen's " +
          "Drawback entry counts as a single drawback, so suppressing it ends all of its listed penalties and weaknesses for the duration.</p>" +
          "<p><strong>Advanced Vial (11th level)</strong> When you drink a field vial, you also gain resistance to physical damage equal to half your level for the same duration.</p>" +
          `<p>@UUID[${uuidOf(mutagenistEffectId)}]</p>`,
      },
      hardness: 0,
      hp: { max: 0, value: 0 },
      level: { value: 1 },
      material: { grade: null, type: null },
      price: { value: {} },
      publication,
      quantity: 1,
      rules: [],
      size: "med",
      slug: "mutagenist-field-vial",
      traits: { rarity: "common", value: ["alchemical", "consumable", "elixir", "fleeting", "infused"] },
      usage: { value: "held-in-one-hand" },
      uses: { autoDestroy: true, max: 1, value: 1 },
    },
  });
  items.push({
    _id: mutagenistEffectId,
    img: img("mutagenist-field-vial"),
    name: "Effect: Mutagenist Field Vial",
    type: "effect",
    system: {
      description: {
        value:
          `<p>Granted by @UUID[${uuidOf(mutagenistId)}]</p>` +
          "<p>The drawback of one mutagen affecting you is suppressed for the duration. Switch on the **Drawback suppressed** toggle on that mutagen's effect while this lasts, and switch it off again when it ends.</p>" +
          "<p><strong>Advanced Vial (11th level)</strong> You also have resistance to physical damage equal to half your level.</p>",
      },
      duration: { expiry: "turn-start", sustained: false, unit: "minutes", value: 1 },
      level: { value: 1 },
      publication,
      rules: [{ key: "Resistance", type: "physical", value: "floor(@actor.level/2)", predicate: [{ gte: ["self:level", 11] }] }],
      start: { initiative: null, value: 0 },
      tokenIcon: { show: true },
      traits: { rarity: "common", value: [] },
    },
  });

  // Quick Vial as its own action. The module script (scripts/quick-vial.js) creates the vial when the action is used.
  items.push({
    _id: makeId("action:Quick Vial"),
    img: "systems/pf2e/icons/actions/OneAction.webp",
    name: "Quick Vial",
    type: "action",
    system: {
      actionType: { value: "action" },
      actions: { value: 1 },
      category: "interaction",
      description: {
        value:
          "<p><strong>Requirements</strong> You're either holding or wearing an alchemist's toolkit and you have a free hand</p><hr />" +
          "<p>This is the Quick Vial option of Quick Alchemy. Create either a volatile vial or the field vial for your research field. The vial can be used only as a bomb or " +
          "for the volatile vial option from your research field. It has the infused trait and must be activated by the end of your current turn or else it becomes inert.</p>" +
          "<p>Using Quick Vial does not expend a versatile vial. The vial's tier matches your level: Lesser at 1st, Moderate at 4th, Greater at 12th, and Major at 18th.</p>",
      },
      frequency: null,
      publication,
      rules: [],
      slug: "quick-vial",
      traits: { otherTags: [], rarity: "common", value: ["alchemist", "manipulate"] },
    },
  });

  // Create Consumable as its own action. The module script (scripts/create-consumable.js) does the work when it is used.
  items.push({
    _id: makeId("action:Create Consumable"),
    img: "systems/pf2e/icons/actions/OneAction.webp",
    name: "Create Consumable",
    type: "action",
    system: {
      actionType: { value: "action" },
      actions: { value: 1 },
      category: "interaction",
      description: {
        value:
          "<p><strong>Requirements</strong> You're either holding or wearing an alchemist's toolkit, you have a free hand, and you have at least one versatile vial</p><hr />" +
          "<p>This is the Create Consumable option of Quick Alchemy. Expend one versatile vial to create a single alchemical consumable item of your level or lower that's " +
          "in your formula book. Skip the normal monetary cost in alchemical raw materials and the Crafting check. This item has the infused trait and must be activated " +
          "before the start of your next turn or else it becomes inert.</p>",
      },
      frequency: null,
      publication,
      rules: [
        {
          key: "CraftingAbility",
          craftableItems: ["item:trait:alchemical", "item:trait:consumable"],
          priority: 15,
          resource: "versatile-vials",
          slug: "create-consumable",
        },
      ],
      slug: "create-consumable",
      traits: { otherTags: [], rarity: "common", value: ["alchemist", "manipulate"] },
    },
  });

  // Quick Alchemy as the house rules revise it, as an action so it sits with Quick Vial and Create Consumable. It does not change PF2e's built-in
  // Quick Alchemy; swap it onto an Alchemist by hand. The module script (scripts/quick-alchemy.js) makes it ask for Quick Vial or Create Consumable.
  items.push({
    _id: makeId("action:Quick Alchemy (House Rule)"),
    img: "systems/pf2e/icons/actions/OneAction.webp",
    name: "Quick Alchemy (House Rule)",
    type: "action",
    system: {
      slug: "quick-alchemy-house-rule",
      actionType: { value: "action" },
      actions: { value: 1 },
      category: "interaction",
      description: {
        value:
          "<p><strong>Requirements</strong> You're either holding or wearing an alchemist's toolkit and you have a free hand</p><hr />" +
          "<p>You create alchemical items quickly using an alchemist's toolkit. Choose either Create Consumable or Quick Vial as your action for Quick Alchemy.</p>" +
          "<p>Any effect created by an item made with Quick Alchemy that would have a duration longer than 10 minutes lasts for 10 minutes instead. This excludes afflictions " +
          "such as slow acting poisons (as described in the infused trait).</p>" +
          "<h2>Create Consumable</h2>" +
          "<p><strong>Requirements</strong> You have at least one versatile vial</p>" +
          "<p>Expend one versatile vial to create a single alchemical consumable item of your level or lower that's in your formula book. Skip the normal monetary cost in " +
          "alchemical raw materials and the Crafting check. This item has the infused trait and must be activated before the start of your next turn or else it becomes inert.</p>" +
          "<h2>Quick Vial</h2>" +
          "<p>Create a volatile vial that can be used only as a bomb or for the volatile vial option from your research field. This item has the infused trait and must be " +
          "activated by the end of your current turn or else it becomes inert.</p>" +
          "<p>Using Quick Vial does not expend a versatile vial.</p>" +
          "<hr /><p><strong>Module</strong> With the Volatile Vial house rules switched on in the Marquiste Additions settings, using this action asks you to choose Quick Vial or Create Consumable. Adding this action to a character also adds the Quick Vial and Create Consumable actions. " +
          "Create Consumable is only offered while you have a versatile vial left.</p>",
      },
      frequency: null,
      publication,
      // Adding this action also gives the character the two actions it chooses between.
      rules: [
        { key: "GrantItem", allowDuplicate: false, uuid: uuidOf(makeId("action:Quick Vial")) },
        { key: "GrantItem", allowDuplicate: false, uuid: uuidOf(makeId("action:Create Consumable")) },
      ],
      traits: { otherTags: [], rarity: "common", value: ["alchemist", "manipulate"] },
    },
  });
};
