// The Wandering Chef Enhancements: the Wandering Chef Dedication (Marquiste) with its food packets, Quick Cooking and its two options (Create Consumable and
// Overcook), the Cooking Toolkit, and the Food Projectile Overcook makes (one item for each tier, at the same levels and with the same scaling as the Volatile
// Vial, but without splash). Called from build.js, which supplies the shared helpers.
//
// Using the Quick Cooking action asks which option to use (scripts/wandering-chef/quick-cooking.js). Using the Overcook action posts its card and the module
// script (scripts/wandering-chef/overcook.js) creates the best Food Projectile the character's level allows, held in a free hand and removed when their turn is over.
const tags = require("./tags");

module.exports = function buildWanderingChef({ items, publication, makeId, uuidOf }) {
  const SUBSIST = "Compendium.pf2e.actionspf2e.Item.49y9Ec4bDii8pcD3";

  // The foods the chef can make: the items PF2e tags alchemical-food, plus these food and drink items it leaves untagged (matched by slug). Add a slug here to
  // include another item.
  const EXTRA_FOODS = [
    "bravos-brew-lesser", "bravos-brew-moderate", "bravos-brew-greater",
    "bookthief-brew",
    "spiderfoot-brew-lesser", "spiderfoot-brew-moderate", "spiderfoot-brew-greater",
    "lastwall-soup", "lastwall-soup-improved", "lastwall-soup-greater",
    "moon-radish-soup",
    "spiced-demonade",
    "impossible-cake", "impossible-cake-greater", "impossible-cake-major",
  ];
  const isFood = { or: ["item:tag:alchemical-food", ...EXTRA_FOODS.map((slug) => `item:slug:${slug}`)] };

  const PROCESSED_TEXT =
    "Expend one food packet to create a single processed alchemical food of your level or lower that you know the formula for. This takes 1 minute instead of a single action, because processed foods are too complex to make quickly. Skip the normal monetary cost in raw materials and the Crafting check. This item has the infused trait and remains potent until the start of your next turn, or, if the item would take more than 3 actions to Activate, for a time equal to its activation time.";

  // The Cooking Toolkit: the chef's version of the alchemist's toolkit, with the same price, bulk and handling.
  items.push({
    _id: makeId("item:Cooking Toolkit"),
    img: "modules/marquiste-additions/images/cooking-toolkit.png",
    name: "Cooking Toolkit",
    type: "equipment",
    system: {
      slug: "cooking-toolkit",
      bulk: { value: 1 },
      containerId: null,
      description: {
        value:
          "<p>This mobile collection of spices, food packs, and basic cooking implements can be used for quick work in the kitchen or at a campfire. " +
          "If you wear your cooking toolkit, you can draw and replace it as part of the action that uses it.</p>",
      },
      hardness: 0,
      hp: { max: 0, value: 0 },
      level: { value: 0 },
      material: { grade: null, type: null },
      price: { value: { gp: 3 } },
      publication,
      quantity: 1,
      rules: [],
      size: "med",
      traits: { rarity: "common", value: [] },
      usage: { value: "held-in-two-hands" },
    },
  });

  // The Food Packet: the item whose quantity is the character's food packets, the way the Versatile Vial is for versatile vials.
  items.push({
    _id: makeId("item:Food Packet"),
    img: "icons/containers/bags/coinpouch-simple-leather-tan.webp",
    name: "Food Packet",
    type: "equipment",
    system: {
      slug: "food-packet",
      bulk: { value: 0 },
      containerId: null,
      description: {
        value:
          "<p>A small parcel of foraged and prepared ingredients. Its quantity is your food packets: it is set when you make your daily preparations, and one is used up each time you use " +
          "Create Consumable with Quick Cooking.</p>",
      },
      hardness: 0,
      hp: { max: 0, value: 0 },
      level: { value: 0 },
      material: { grade: null, type: null },
      price: { value: {} },
      publication,
      quantity: 1,
      rules: [],
      size: "med",
      traits: { rarity: "common", value: [] },
      usage: { value: "carried" },
    },
  });

  // Create Consumable (Cooking): the same kind of action as the Alchemist's, but it spends a food packet and can only make alchemical food. The module script
  // (scripts/wandering-chef/quick-cooking.js) does the checks and the end-of-turn expiry.
  const createId = makeId("action:Create Consumable (Cooking)");
  items.push({
    _id: createId,
    img: "systems/pf2e/icons/actions/OneAction.webp",
    name: "Create Consumable (Cooking)",
    type: "action",
    system: {
      slug: "create-cooking-consumable",
      actionType: { value: "action" },
      actions: { value: 1 },
      category: "interaction",
      description: {
        value:
          "<p><strong>Requirements</strong> You're either holding or wearing a cooking toolkit, you have a free hand, and you have at least one food packet</p><hr />" +
          "<p>This is the Create Consumable option of Quick Cooking. Expend one food packet to create a single alchemical food of your level or lower that you know the formula for. " +
          "Skip the normal monetary cost in raw materials and the Crafting check. This item has the infused trait and must be activated before the start of your next turn " +
          "or else it becomes inert. Items with the processed trait can't be created this way, because they take too long to make: use Create Processed Food for those.</p>",
      },
      frequency: null,
      publication,
      rules: [
        {
          key: "CraftingAbility",
          craftableItems: [isFood, { not: "item:trait:processed" }],
          priority: 15,
          resource: "food-packets",
          slug: "create-cooking-consumable",
        },
      ],
      traits: { otherTags: [], rarity: "common", value: ["manipulate"] },
    },
  });

  // Create Processed Food: the same, but for the processed foods, which take 1 minute to make instead of one action.
  const processedId = makeId("action:Create Processed Food");
  items.push({
    _id: processedId,
    img: "systems/pf2e/icons/actions/Passive.webp",
    name: "Create Processed Food",
    type: "action",
    system: {
      slug: "create-processed-food",
      actionType: { value: "action" },
      actions: { value: null },
      category: "interaction",
      description: {
        value:
          "<p><strong>Requirements</strong> You're either holding or wearing a cooking toolkit, you have a free hand, and you have at least one food packet</p><hr />" +
          "<p><strong>Time</strong> 1 minute</p>" +
          "<p>This is the processed food option of Quick Cooking. " + PROCESSED_TEXT + "</p>",
      },
      frequency: null,
      publication,
      rules: [
        {
          key: "CraftingAbility",
          craftableItems: [isFood, "item:trait:processed"],
          priority: 15,
          resource: "food-packets",
          slug: "create-processed-food",
        },
      ],
      traits: { otherTags: [], rarity: "common", value: ["manipulate"] },
    },
  });

  // Quick Cooking: the chef's Quick Alchemy. Adding it also gives the character Create Consumable (Cooking) and Create Processed Food; Overcook comes with the Overcooked feat.
  const quickId = makeId("action:Quick Cooking");
  items.push({
    _id: quickId,
    img: "systems/pf2e/icons/actions/OneAction.webp",
    name: "Quick Cooking",
    type: "action",
    system: {
      slug: "quick-cooking",
      actionType: { value: "action" },
      actions: { value: 1 },
      category: "interaction",
      description: {
        value:
          "<p><strong>Requirements</strong> You're either holding or wearing a cooking toolkit and you have a free hand</p><hr />" +
          "<p>You cook quickly using a cooking toolkit. Choose Create Consumable, Create Processed Food, or, if you have the Overcooked feat, Overcook as your action for Quick Cooking.</p>" +
          "<p>Any effect created by an item made with Quick Cooking that would have a duration longer than 10 minutes lasts for 10 minutes instead. This excludes afflictions " +
          "such as slow acting poisons (as described in the infused trait).</p>" +
          "<h2>Create Consumable</h2>" +
          "<p><strong>Requirements</strong> You have at least one food packet</p>" +
          "<p>Expend one food packet to create a single alchemical food of your level or lower that you know the formula for. Skip the normal monetary cost in raw materials and " +
          "the Crafting check. This item has the infused trait and must be activated before the start of your next turn or else it becomes inert. Items with the processed trait " +
          "can't be created this way, because they take too long to make.</p>" +
          "<h2>Create Processed Food</h2>" +
          "<p><strong>Requirements</strong> You have at least one food packet</p>" +
          "<p>" + PROCESSED_TEXT + "</p>" +
          "<h2>Overcook</h2>" +
          "<p>See the Overcooked feat. Using Overcook does not expend a food packet.</p>" +
          "<hr /><p><strong>Module</strong> Using this action asks you to choose Create Consumable, Create Processed Food or Overcook. It can be switched off in the module settings under Wandering Chef.</p>",
      },
      frequency: null,
      publication,
      rules: [
        { key: "GrantItem", allowDuplicate: false, uuid: uuidOf(createId) },
        { key: "GrantItem", allowDuplicate: false, uuid: uuidOf(processedId) },
      ],
      traits: { otherTags: [], rarity: "common", value: ["manipulate"] },
    },
  });

  // Alchemical Cooking: the chef's Alchemical Crafting, limited to alchemical food. The dedication gives it to the character.
  const cookingId = makeId("feat:Alchemical Cooking");
  items.push({
    _id: cookingId,
    img: "icons/sundries/books/book-red-exclamation.webp",
    name: "Alchemical Cooking",
    type: "feat",
    system: {
      slug: "alchemical-cooking",
      actionType: { value: "passive" },
      actions: { value: null },
      category: "skill",
      description: {
        value:
          "<p><strong>Prerequisites</strong> Trained in Crafting</p><hr />" +
          "<p>You can use the Craft activity to create alchemical foods, but not other alchemical items. When you select this feat, you immediately gain the formulas for four " +
          "common alchemical foods of 1st level or 2nd level.</p>",
      },
      level: { value: 1 },
      prerequisites: { value: [{ value: "trained in Crafting" }] },
      publication,
      rules: [],
      traits: { otherTags: [], rarity: "common", value: ["general", "skill"] },
    },
  });

  // The Wandering Chef Dedication (Marquiste): the dedication from the Tian Xia Character Guide with food packets and Quick Cooking in place of versatile vials
  // and Quick Alchemy. The food packets are a SpecialResource tied to the Food Packet item's quantity, which PF2e refills at daily preparations.
  const dedicationName = `Wandering Chef Dedication (${tags.marquiste.long})`;
  items.push({
    _id: makeId("feat:Wandering Chef Dedication (Marquiste)"),
    img: "icons/sundries/books/book-red-exclamation.webp",
    name: dedicationName,
    type: "feat",
    system: {
      slug: "wandering-chef-dedication-marquiste",
      actionType: { value: "passive" },
      actions: { value: null },
      category: "class",
      description: {
        value:
          "<p>Whether trained in a noble kitchen or a humble home, you know how to cook delicious dishes and source ingredients from the wilderness or urban settings. " +
          "You become trained in Crafting; if you were already trained in Crafting, you instead become trained in a skill of your choice. You can use a cooking toolkit or cookware " +
          `instead of an alchemist's toolkit to craft alchemical foods. When using the @UUID[${SUBSIST}]{Subsist} downtime activity, you can use Crafting or Cooking Lore in place of Survival, ` +
          "and if you roll a failure, you get a success instead.</p>" +
          "<p>You gain the Quick Cooking action, which works like Quick Alchemy but only makes alchemical food. You also gain the " +
          `@UUID[${uuidOf(cookingId)}]{Alchemical Cooking} skill feat, which is Alchemical Crafting limited to alchemical food, with formulas of 1st level or 2nd level.</p>` +
          "<p>You create up to 4 food packets during your daily preparations. Food packets work like versatile vials, but can only be used for Quick Cooking. " +
          "They are parcels of foraged ingredients.</p>" +
          "<hr /><p><strong>Module</strong> This replaces the Wandering Chef Dedication from the Tian Xia Character Guide. Its food packets are the quantity of the Food Packet item, " +
          "which is set again each time you make your daily preparations.</p>",
      },
      level: { value: 2 },
      prerequisites: { value: [] },
      publication,
      rules: [
        { key: "ActiveEffectLike", mode: "upgrade", path: "system.skills.crafting.rank", value: 1 },
        { key: "GrantItem", allowDuplicate: false, uuid: uuidOf(cookingId) },
        { key: "GrantItem", allowDuplicate: false, uuid: uuidOf(quickId) },
        {
          key: "SpecialResource",
          itemUUID: uuidOf(makeId("item:Food Packet")),
          label: "Food Packets",
          max: 4,
          slug: "food-packets",
        },
      ],
      traits: { otherTags: [], rarity: "common", value: ["archetype", "dedication"] },
    },
  });

  // Additional Servings (Marquiste): raises the number of food packets, up to three times.
  items.push({
    _id: makeId("feat:Additional Servings (Marquiste)"),
    img: "icons/sundries/books/book-red-exclamation.webp",
    name: `Additional Servings (${tags.marquiste.long})`,
    type: "feat",
    system: {
      slug: "additional-servings-marquiste",
      actionType: { value: "passive" },
      actions: { value: null },
      category: "class",
      description: {
        value:
          "<p><strong>Prerequisites</strong> Wandering Chef Dedication, expert in Crafting or Cooking Lore</p><hr />" +
          "<p>Your number of food packets per day increases to 5.</p>" +
          "<p><strong>Special</strong> At 12th level or higher, you can select this feat a second time to increase your number of food packets per day to 6. " +
          "At 18th level or higher, you can select this feat a third time to increase your number of food packets per day to 7.</p>",
      },
      level: { value: 6 },
      maxTakable: 3,
      prerequisites: { value: [{ value: "Wandering Chef Dedication" }, { value: "expert in Crafting or Cooking Lore" }] },
      publication,
      rules: [{ key: "ActiveEffectLike", mode: "upgrade", path: "system.resources.foodPackets.max", value: "4 + @item.timesTaken" }],
      traits: { otherTags: [], rarity: "common", value: ["archetype"] },
    },
  });
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

  const overcookId = makeId("action:Overcook");
  items.push({
    _id: overcookId,
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
          "<p><strong>Requirements</strong> You have the Overcooked feat, you're either holding or wearing a cooking toolkit, and you have a free hand</p><hr />" +
          "<p>This is the Overcook option of Quick Cooking. You use alchemical ingredients to overcook a spare bit of food into a Food Projectile that you can fling at an enemy. " +
          "The Food Projectile has the fleeting trait, so it must be used by the end of your current turn or else it falls apart.</p>" +
          "<p>Using Overcook does not expend a food packet and does not consume any food or other food resources. The overcooking leaves the food inedible: the Food Projectile " +
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

  // Overcooked: a feat item that gives the character the Overcook action, which then appears among the Quick Cooking options.
  items.push({
    _id: makeId("feat:Overcooked"),
    img: "icons/consumables/food/bread-toast-tan.webp",
    name: "Overcooked",
    type: "feat",
    system: {
      slug: "overcooked",
      actionType: { value: "passive" },
      actions: { value: null },
      category: "class",
      description: {
        value:
          "<p><strong>Prerequisites</strong> Wandering Chef Dedication</p><hr />" +
          "<p>You use alchemical ingredients to overcook a spare bit of food until it hardens into a scorched, throwable lump. Quick Cooking gains a new option for you, Overcook, " +
          "in addition to Create Consumable. Overcook creates a Food Projectile and does not expend a food packet.</p>",
      },
      level: { value: 4 },
      prerequisites: { value: [{ value: "Wandering Chef Dedication" }] },
      publication,
      rules: [{ key: "GrantItem", allowDuplicate: false, uuid: uuidOf(overcookId) }],
      traits: { otherTags: [], rarity: "common", value: ["archetype"] },
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
