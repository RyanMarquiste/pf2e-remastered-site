// The Wandering Chef Enhancements: the Overcook action from the Overcooked feat, and the Food Projectile it makes (one item for each tier, at the same levels
// and with the same scaling as the Volatile Vial, but without splash). Called from build.js, which supplies the shared helpers.
//
// Using the Overcook action posts its card and the module script (scripts/wandering-chef/overcook.js) creates the best Food Projectile the character's level
// allows, held in a free hand and removed when their turn is over.
module.exports = function buildWanderingChef({ items, publication, makeId }) {
  const tiers = [
    { name: "Lesser", level: 1, dice: 1, bonus: 0 },
    { name: "Moderate", level: 4, dice: 2, bonus: 1 },
    { name: "Greater", level: 12, dice: 3, bonus: 2 },
    { name: "Major", level: 18, dice: 4, bonus: 3 },
  ];

  const bonusText = (t) => (t.bonus ? ` You gain a +${t.bonus} item bonus to attack rolls with it.` : "");

  // The same level-based scaling as the Volatile Vial, without the splash.
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
  ];

  items.push({
    _id: makeId("action:Overcook"),
    img: "systems/pf2e/icons/actions/OneAction.webp",
    name: "Overcook",
    type: "action",
    system: {
      slug: "overcook",
      actionType: { value: "action" },
      actions: { value: 1 },
      category: "interaction",
      description: {
        value:
          "<p><strong>Requirements</strong> You have the Overcooked feat, you're either holding or wearing an alchemist's toolkit, and you have a free hand</p><hr />" +
          "<p>This is the Overcook option of Quick Alchemy. You use alchemical ingredients to overcook a spare bit of food into a Food Projectile that you can fling at an enemy. " +
          "The Food Projectile has the fleeting trait, so it must be used by the end of your current turn or else it falls apart.</p>" +
          "<p>Using Overcook does not expend a versatile vial and does not consume any food or other food resources. The overcooking leaves the food inedible: the Food Projectile " +
          "has no nutritional value and none of the other properties the food would otherwise have.</p>" +
          "<p><strong>Flambé</strong> When you Strike with a Food Projectile you can flambé it, setting it on fire, so that it deals fire damage instead of bludgeoning damage. " +
          "This costs no action and uses nothing up.</p>" +
          "<p>The Food Projectile's tier matches your level: Lesser at 1st, Moderate at 4th, Greater at 12th, and Major at 18th.</p>" +
          "<hr /><p><strong>Module</strong> Using this action creates the Food Projectile, held in a free hand, and removes it when your turn is over. It can be switched off in the module settings under Wandering Chef.</p>",
      },
      frequency: null,
      publication,
      rules: [],
      traits: { otherTags: [], rarity: "common", value: ["manipulate"] },
    },
  });

  // Food Fight: a feat item, so the script can tell that the character has it (it looks for the slug food-fight).
  items.push({
    _id: makeId("feat:Food Fight"),
    img: "icons/consumables/food/bread-toast-tan.webp",
    name: "Food Fight",
    type: "feat",
    system: {
      slug: "food-fight",
      actionType: { value: "passive" },
      actions: { value: null },
      category: "class",
      description: {
        value:
          "<p><strong>Prerequisites</strong> Wandering Chef Dedication, Overcooked</p><hr />" +
          "<p>You have learned to turn whatever is on the table into a weapon, and to throw it the moment it leaves the pan.</p>" +
          "<p><strong>Overcook and Strike</strong> When you use Overcook, you can Strike with the Food Projectile it creates as part of the same action. " +
          "This Strike counts toward your multiple attack penalty as normal.</p>" +
          "<p><strong>Deadlier and farther</strong> The Food Projectiles you create with Overcook gain the deadly d8 trait, so on a critical hit they deal an extra d8 damage after the damage is doubled. " +
          "Their range also increases from 10 feet to 15 feet, so they have the thrown 15 ft. trait instead of thrown 10 ft.</p>" +
          "<hr /><p><strong>Module</strong> With this feat on a character, the Overcook action makes the deadlier projectile and offers the Strike. " +
          "It can be switched off in the module settings under Wandering Chef.</p>",
      },
      level: { value: 6 },
      prerequisites: { value: [{ value: "Wandering Chef Dedication" }, { value: "Overcooked" }] },
      publication,
      rules: [],
      traits: { otherTags: [], rarity: "common", value: ["archetype"] },
    },
  });

  // The Kitchen Armaments weapons: simple, uncommon cookware weapons for the Wandering Chef, and the feat that trains the character in them.
  const ACCESS =
    "<p><strong>Access</strong> Characters who spend a lot of time in the kitchen, such as those with the Cook background, the Seasoned skill feat, or the Wandering Chef archetype, generally have access to this weapon.</p>";
  const kitchenWeapons = [
    {
      name: "Chef's Knife", slug: "chefs-knife", img: "icons/tools/cooking/knife-chef-steel-brown.webp",
      group: "knife", die: "d4", type: "slashing", traits: ["deadly-d6", "finesse"], price: { sp: 2 },
      text: "A broad, razor-sharp blade made for chopping and slicing. In a practiced hand it works as well on a monster as on an onion.",
    },
    {
      name: "Cleaver", slug: "cleaver", img: "icons/tools/cooking/knife-cleaver-steel-grey.webp",
      group: "axe", die: "d6", type: "slashing", traits: [], price: { sp: 5 },
      text: "A heavy, broad-bladed knife made for chopping through meat and bone. It chops through just about anything else the same way.",
    },
    {
      name: "Tenderizer", slug: "tenderizer", img: "icons/tools/hand/hammer-mallet-brown.webp",
      group: "hammer", die: "d6", type: "bludgeoning", traits: [], price: { sp: 1 },
      text: "A heavy, studded mallet for pounding tough cuts of meat until they give. It does the same to anything else you hit with it.",
    },
    {
      name: "Skewer", slug: "skewer", img: "icons/consumables/meat/kebab-skewer-vegetable-brown.webp",
      group: "spear", die: "d4", type: "piercing", traits: ["fatal-d8", "finesse"], price: { sp: 1 },
      text: "A long, thin metal spike for threading meat and vegetables over a fire, with a point sharp enough to pierce more than dinner.",
    },
    {
      name: "Rolling Pin", slug: "rolling-pin", img: "systems/pf2e/icons/equipment/weapons/club.webp",
      group: "club", die: "d4", type: "bludgeoning", traits: ["nonlethal"], price: { sp: 1 },
      text: "A smooth, heavy wooden cylinder for flattening dough. It leaves a bruise, but it is made for flattening and not for killing.",
    },
  ];
  for (const w of kitchenWeapons) {
    items.push({
      _id: makeId(`item:${w.name}`),
      img: w.img,
      name: w.name,
      type: "weapon",
      system: {
        slug: w.slug,
        ammo: null,
        baseItem: null,
        bonus: { value: 0 },
        bonusDamage: { value: 0 },
        bulk: { value: 0.1 },
        category: "simple",
        damage: { damageType: w.type, dice: 1, die: w.die },
        description: { value: `<p><em>${w.text}</em></p>${ACCESS}` },
        expend: null,
        grade: null,
        group: w.group,
        hardness: 0,
        hp: { max: 0, value: 0 },
        level: { value: 0 },
        material: { grade: null, type: null },
        price: { value: w.price },
        publication,
        quantity: 1,
        range: null,
        reload: { value: "" },
        rules: [],
        runes: { potency: 0, property: [], striking: 0 },
        size: "med",
        traits: { rarity: "uncommon", value: w.traits },
        usage: { canBeAmmo: false, value: "held-in-one-hand" },
      },
    });
  }

  // Kitchen Armaments: trains the character in the six kitchen weapons (the five above and the frying pan) and unlocks their critical specialization at expert.
  const kitchenSlugs = [...kitchenWeapons.map((w) => w.slug), "frying-pan"].map((slug) => `item:slug:${slug}`);
  items.push({
    _id: makeId("feat:Kitchen Armaments"),
    img: "icons/tools/cooking/knife-chef-steel-brown.webp",
    name: "Kitchen Armaments",
    type: "feat",
    system: {
      slug: "kitchen-armaments",
      actionType: { value: "passive" },
      actions: { value: null },
      category: "class",
      description: {
        value:
          "<p><strong>Prerequisites</strong> Wandering Chef Dedication</p><hr />" +
          "<p>You have spent enough time in a kitchen to know which tools make good weapons. You become trained in the chef's knife, cleaver, tenderizer, skewer, rolling pin, and frying pan. " +
          "Whenever you gain a class feature that grants you expert or higher proficiency in simple weapons, you also gain that rank in these weapons.</p>" +
          "<p>Once your proficiency rank in one of these weapons is expert or higher, you gain access to its critical specialization effect.</p>",
      },
      level: { value: 4 },
      prerequisites: { value: [{ value: "Wandering Chef Dedication" }] },
      publication,
      rules: [
        {
          key: "MartialProficiency",
          label: "Kitchen Armaments",
          slug: "kitchen-armaments",
          definition: [{ or: kitchenSlugs }],
          sameAs: "simple",
          value: 1,
        },
        {
          key: "CriticalSpecialization",
          predicate: [{ or: kitchenSlugs }, { gte: ["item:proficiency:rank", 2] }],
        },
      ],
      traits: { otherTags: [], rarity: "common", value: ["archetype"] },
    },
  });

  for (const t of tiers) {
    items.push({
      _id: makeId(`item:Food Projectile:${t.name}`),
      img: "icons/consumables/food/bread-toast-tan.webp",
      name: `Food Projectile (${t.name})`,
      type: "weapon",
      system: {
        slug: "food-projectile",
        ammo: null,
        baseItem: null,
        bonus: { value: 0 },
        bonusDamage: { value: 0 },
        bulk: { value: 0 },
        category: "simple",
        containerId: null,
        damage: { damageType: "bludgeoning", dice: 1, die: "d6" },
        description: {
          value:
            `<p><strong>Activate</strong> <span class="action-glyph">A</span> Strike</p><hr />` +
            "<p><em>A hard, blackened lump of food, scorched and charred through and smelling of smoke, with a few stubborn flecks of seasoning still clinging to it.</em></p>" +
            "<p>A spare bit of food, overcooked with alchemical ingredients until it is inedible and has none of the properties it had before. " +
            "You can flambé it when you Strike, setting it on fire so that it deals fire damage instead of bludgeoning damage.</p>" +
            `<p>The Food Projectile deals ${t.dice}d6 bludgeoning damage, or fire damage if flambéed.${bonusText(t)}</p>`,
        },
        expend: null,
        grade: null,
        group: "sling",
        hardness: 0,
        hp: { max: 0, value: 0 },
        level: { value: t.level },
        material: { grade: null, type: null },
        price: { value: {} },
        publication,
        quantity: 1,
        range: 10,
        reload: { value: "-" },
        rules: scaling(),
        runes: { potency: 0, property: [], striking: 0 },
        size: "med",
        traits: { rarity: "common", value: ["fleeting", "nonlethal", "thrown-10", "versatile-fire"] },
        usage: { canBeAmmo: false, value: "held-in-one-hand" },
      },
    });
  }
};
