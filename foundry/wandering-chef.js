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
          "<p><strong>Heavier and farther</strong> The Food Projectiles you create with Overcook deal d8 damage instead of d6, and their range increases from 10 feet to 15 feet, " +
          "so they have the thrown 15 ft. trait instead of thrown 10 ft. They still deal one more die at 4th, 12th, and 18th level.</p>" +
          "<hr /><p><strong>Module</strong> With this feat on a character, the Overcook action makes the stronger projectile and offers the Strike. " +
          "It can be switched off in the module settings under Wandering Chef.</p>",
      },
      level: { value: 6 },
      prerequisites: { value: [{ value: "Wandering Chef Dedication" }, { value: "Overcooked" }] },
      publication,
      rules: [],
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
        expend: 1,
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
        traits: { rarity: "common", value: ["consumable", "fleeting", "nonlethal", "thrown-10", "versatile-fire"] },
        usage: { canBeAmmo: false, value: "held-in-one-hand" },
      },
    });
  }
};
