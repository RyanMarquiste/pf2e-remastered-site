// Generates the Foundry VTT (PF2e system) source files for two modules:
//   - Marquiste Additions (the functional module): the scripts and the Common and Alchemist Enhancements packs.
//   - CorpseCap's Cauldron (the content module): the custom alchemical items, such as the mutagens and Insulating Paste.
// Usage: node foundry/build.js   (then see foundry/README.md to compile the compendium packs)
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const tags = require("./tags"); // the global tags: the long and short names of the Marquiste and Cauldron packages

const MODULE_ID = "marquiste-additions";
const CAULDRON_ID = "corpsecaps-cauldron"; // the content module
const CAULDRON_PACK = "corpsecaps-cauldron";
const FORMULA_PACK = "corpsecaps-formulas"; // labelled "Cauldron Formulas": one formula item for each craftable family
const CLASS_PACK = "marquiste-alchemist-class"; // labelled "Alchemist Enhancements"; the id stays so existing links keep working
const COMMON_PACK = "marquiste-common-enhancements";
const BARD_PACK = "marquiste-bard-class"; // labelled "Bard Enhancements"
const IMG = `modules/${CAULDRON_ID}/images/mind-doubling-mutagen.png`;
const ICHTHYS_IMG = `modules/${CAULDRON_ID}/images/ichthys-mutagen.png`;
const PASTE_IMG = `modules/${CAULDRON_ID}/images/insulating-paste.png`;
const sourceDir = (moduleId, pack) => path.join(__dirname, moduleId, "packs", "_source", pack);

const ALPHANUM = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const makeId = (seed) => {
  const hash = crypto.createHash("sha1").update(seed).digest();
  return Array.from({ length: 16 }, (_, i) => ALPHANUM[hash[i] % ALPHANUM.length]).join("");
};
const uuidOf = (id) => `Compendium.${CAULDRON_ID}.${CAULDRON_PACK}.Item.${id}`;
const classUuidOf = (id) => `Compendium.${MODULE_ID}.${CLASS_PACK}.Item.${id}`;

const publication = { license: "ORC", remaster: true, title: tags.cauldron.long }; // the Cauldron's items
const modulePublication = { license: "ORC", remaster: true, title: "Marquiste Additions" }; // the Alchemist items

const tiers = [
  { name: "Lesser", level: 1, bonus: 1, gp: 4, duration: { unit: "minutes", value: 1, text: "1 minute" } },
  { name: "Moderate", level: 3, bonus: 2, gp: 12, duration: { unit: "minutes", value: 10, text: "10 minutes" } },
  { name: "Greater", level: 11, bonus: 3, gp: 300, duration: { unit: "hours", value: 1, text: "1 hour" } },
  { name: "Major", level: 17, bonus: 4, gp: 3000, duration: { unit: "hours", value: 1, text: "1 hour" } },
];

const thinkingId = makeId("action:co-ordinated-thinking");

const thinkingText =
  "<p><strong>Requirements</strong> You are under the effects of a Mind Doubling Mutagen</p>" +
  "<hr />" +
  "<p>On your turn, one of your brains works through a problem while the other keeps hold of the body. " +
  "You @UUID[Compendium.pf2e.actionspf2e.Item.1OagaWtBpVXExToo]{Recall Knowledge} with a skill in which you are at least trained.</p>";

const featText =
  "<p><strong>Mutant Innervation</strong> If you have the Mutant Innervation feat, your brains have become adept at working " +
  "together to fend off mental attacks. Whenever you attempt a saving throw against a mental effect, roll twice and take " +
  "the better of the two results. This is a fortune effect.</p>";

const items = [];

items.push({
  _id: thinkingId,
  img: "systems/pf2e/icons/actions/FreeAction.webp",
  name: "Co-ordinated Thinking",
  type: "action",
  system: {
    actionType: { value: "free" },
    actions: { value: null },
    category: "interaction",
    description: { value: thinkingText },
    frequency: { max: 1, per: "round" },
    publication,
    rules: [],
    traits: { rarity: "common", value: ["concentrate"] },
  },
});

// The drawback doesn't change with the mutagen's tier, so one effect serves them all. It is granted by the benefits effect
// and removed with it, so it has no duration of its own.
const drawbackId = makeId("effect:drawback");
const drawbackText =
  "<p><strong>Drawback</strong> The two brains can interact poorly when handing off control of the body, giving you a –1 item " +
  "penalty to Dexterity-based skill checks and a –2 item penalty to Reflex saves. Mental damage hits you harder, as your " +
  "increased brain capacity has more to lose, giving you weakness 5 to mental damage.</p>";
items.push({
  _id: drawbackId,
  img: IMG,
  name: "Effect: Mind Doubling Mutagen Drawback",
  type: "effect",
  system: {
    description: { value: "<p>Granted by the Mind Doubling Mutagen effect, and removed with it.</p>" + drawbackText },
    duration: { expiry: null, sustained: false, unit: "unlimited", value: -1 },
    level: { value: 1 },
    publication,
    rules: [
      {
        key: "RollOption",
        domain: "all",
        label: "Drawback suppressed",
        option: "mind-doubling-drawback-suppressed",
        toggleable: true,
        value: false,
      },
      {
        key: "FlatModifier",
        selector: ["acrobatics", "stealth", "thievery"],
        slug: "mind-doubling-mutagen-drawback-skills",
        type: "item",
        value: -1,
        predicate: [{ not: "mind-doubling-drawback-suppressed" }],
      },
      {
        key: "FlatModifier",
        selector: "reflex",
        slug: "mind-doubling-mutagen-drawback-reflex",
        type: "item",
        value: -2,
        predicate: [{ not: "mind-doubling-drawback-suppressed" }],
      },
      { key: "Weakness", type: "mental", value: 5, predicate: [{ not: "mind-doubling-drawback-suppressed" }] },
    ],
    start: { initiative: null, value: 0 },
    tokenIcon: { show: true },
    traits: { rarity: "common", value: [] },
  },
});

for (const t of tiers) {
  const effectId = makeId(`effect:${t.name}`);
  const itemId = makeId(`item:${t.name}`);
  const b = t.bonus;
  const dur = t.duration;

  const benefit =
    `<p><strong>Benefit</strong> You gain a +${b} item bonus to Perception checks and Intelligence-based skill checks ` +
    `(Arcana, Crafting, Lore, Occultism, and Society), and a +${b} item bonus to saving throws against mental and emotion effects. ` +
    `You gain access to the Co-ordinated Thinking action, described below.</p>`;
  const drawback =
    "<p><strong>Drawback</strong> The two brains can interact poorly when handing off control of the body, giving you a –1 item " +
    "penalty to Dexterity-based skill checks and a –2 item penalty to Reflex saves. Mental damage hits you harder, as your " +
    "increased brain capacity has more to lose, giving you weakness 5 to mental damage.</p>";
  const body =
    "<p>The top of your skull grows and expands as your brain develops into two distinct, full-sized halves. Each half can " +
    "operate independently, and the two share a channel of mental communication. Others may notice a subtle shift in your " +
    "personality, from analytic, logical, and pragmatic to inspired, creative, and innovative, as one brain or the other takes " +
    "priority, and your body occasionally tics as the brains switch which of them controls it.</p>";

  items.push({
    _id: itemId,
    img: IMG,
    name: `Mind Doubling Mutagen (${t.name})`,
    type: "consumable",
    system: {
      baseItem: null,
      bulk: { value: 0.1 },
      category: "mutagen",
      containerId: null,
      damage: null,
      description: {
        value:
          `<p><strong>Activate</strong> <span class="action-glyph">A</span> (manipulate)</p><hr />` +
          `<p><em>A thick pink liquid swirled with ribbons of cream that circle slowly in two separate currents. ` +
          `It has no smell at all, not even a faint chemical tang.</em></p>` +
          body +
          benefit +
          drawback +
          `<p><strong>Duration</strong> ${dur.text}.</p>` +
          `<p>@UUID[${uuidOf(effectId)}]</p>` +
          `<hr /><h2>Co-ordinated Thinking <span class="action-glyph">F</span> (concentrate)</h2>` +
          `<p><strong>Frequency</strong> once per round; <strong>Requirements</strong> You are under the effects of a Mind Doubling Mutagen</p>` +
          `<p>On your turn, one of your brains works through a problem while the other keeps hold of the body. You Recall Knowledge ` +
          `with a skill in which you are at least trained.</p>` +
          `<hr />` +
          featText,
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

  const featId = makeId(`effect:feat:${t.name}`);
  const expiry = { expiry: "turn-start", sustained: false, unit: dur.unit, value: dur.value };
  const common = {
    duration: expiry,
    level: { value: t.level },
    publication,
    start: { initiative: null, value: 0 },
    tokenIcon: { show: true },
    traits: { rarity: "common", value: [] },
  };

  // Benefits: the main effect, which also grants the drawback effect and, for characters with the feat, the feat effect.
  items.push({
    _id: effectId,
    img: IMG,
    name: `Effect: Mind Doubling Mutagen (${t.name})`,
    type: "effect",
    system: {
      ...common,
      description: {
        value:
          `<p>Granted by @UUID[${uuidOf(itemId)}]</p>` + benefit +
          `<p>This effect also applies @UUID[${uuidOf(drawbackId)}]` +
          ` and, if you have the Mutant Innervation feat, @UUID[${uuidOf(featId)}].</p>`,
      },
      rules: [
        {
          key: "FlatModifier",
          selector: ["perception", "arcana", "crafting", "lore-skill-check", "occultism", "society"],
          slug: "mind-doubling-mutagen-bonus",
          type: "item",
          value: b,
        },
        {
          key: "FlatModifier",
          selector: "saving-throw",
          predicate: [{ or: ["item:trait:mental", "item:trait:emotion"] }],
          slug: "mind-doubling-mutagen-save-bonus",
          type: "item",
          value: b,
        },
        { key: "GrantItem", uuid: uuidOf(thinkingId) },
        { key: "GrantItem", uuid: uuidOf(drawbackId) },
        { key: "GrantItem", uuid: uuidOf(featId), predicate: ["feat:mutant-innervation"] },
      ],
    },
  });

  items.push({
    _id: featId,
    img: IMG,
    name: `Effect: Mind Doubling Mutagen, Mutant Innervation (${t.name})`,
    type: "effect",
    system: {
      ...common,
      description: { value: `<p>Granted by @UUID[${uuidOf(effectId)}] to characters with the Mutant Innervation feat.</p>` + featText },
      rules: [{ key: "RollTwice", keep: "higher", predicate: ["item:trait:mental"], selector: "saving-throw" }],
    },
  });
}

// The Drakeheart Mutagen from PF2e, with its text, numbers and art unchanged, but with the benefit and the drawback as separate effects (like the Mind Doubling Mutagen),
// so the drawback can be suppressed on its own. The levels, prices and durations are the same as the other mutagens' tiers above. The Final Surge action is PF2e's own.
const DRAKE = `Drakeheart Mutagen ${tags.marquiste.short}`;
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
    description: { value: `<p>Granted by the ${DRAKE} effect, and removed with it.</p>` + drakeDrawbackText },
    duration: { expiry: null, sustained: false, unit: "unlimited", value: -1 },
    level: { value: 1 },
    publication,
    rules: [
      {
        key: "RollOption",
        domain: "all",
        label: "Drawback suppressed",
        option: "drakeheart-drawback-suppressed",
        toggleable: true,
        value: false,
      },
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

const ichthysTiers = [
  { name: "Lesser", level: 1, bonus: 1, die: 6, dice: 1, gp: 4, duration: { unit: "minutes", value: 1, text: "1 minute" } },
  { name: "Moderate", level: 3, bonus: 2, die: 6, dice: 2, gp: 12, duration: { unit: "minutes", value: 10, text: "10 minutes" } },
  { name: "Greater", level: 11, bonus: 3, die: 8, dice: 3, gp: 300, duration: { unit: "hours", value: 1, text: "1 hour" } },
  { name: "Major", level: 17, bonus: 4, die: 8, dice: 4, gp: 3000, duration: { unit: "hours", value: 1, text: "1 hour" } },
];

for (const t of ichthysTiers) {
  const effectId = makeId(`effect:Ichthys:${t.name}`);
  const itemId = makeId(`item:Ichthys:${t.name}`);
  const b = t.bonus;
  const dur = t.duration;
  const damage = `${t.dice}d${t.die}`;

  const body =
    "<p>While under the effects of this mutagen, your body slims and sleeks into a fish-like form, gills opening along your neck " +
    "and faint scales rippling across your skin.</p>";
  const benefit =
    `<p><strong>Benefit</strong> You gain a swim Speed equal to your land Speed, and you can breathe water. Your unarmed attacks grow ` +
    `razor-edged: you gain a +${b} item bonus to unarmed attack rolls, and your unarmed attacks deal ${damage} slashing damage instead of ` +
    `their normal damage, gain the agile trait, and lose the nonlethal trait. Striking runes don't modify this damage. While you are ` +
    `underwater, you also gain a +${b} item bonus to Perception checks and to Wisdom-based skill checks (Medicine, Nature, Religion, and Survival).</p>`;
  const drawback =
    "<p><strong>Drawback</strong> You can't breathe air. While you are out of water you suffocate as normal, though you can hold your " +
    "breath as usual. Your wet, conductive body gives you weakness 5 to electricity, and your lithe, less bulky frame gives you a " +
    "–1 item penalty to Strength-based skill checks, such as Athletics.</p>";

  items.push({
    _id: itemId,
    img: ICHTHYS_IMG,
    name: `Ichthys Mutagen (${t.name})`,
    type: "consumable",
    system: {
      baseItem: null,
      bulk: { value: 0.1 },
      category: "mutagen",
      containerId: null,
      damage: null,
      description: {
        value:
          `<p><strong>Activate</strong> <span class="action-glyph">A</span> (manipulate)</p><hr />` +
          `<p><em>A small vial of cloudy, brine-scented liquid, flecked with tiny pearlescent scales that drift and glitter when the glass is tilted.</em></p>` +
          body +
          benefit +
          drawback +
          `<p><strong>Duration</strong> ${dur.text}.</p>` +
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

  items.push({
    _id: effectId,
    img: ICHTHYS_IMG,
    name: `Effect: Ichthys Mutagen (${t.name})`,
    type: "effect",
    system: {
      description: { value: `<p>Granted by @UUID[${uuidOf(itemId)}]</p>` + benefit + drawback },
      duration: { expiry: "turn-start", sustained: false, unit: dur.unit, value: dur.value },
      level: { value: t.level },
      publication,
      rules: [
        { key: "BaseSpeed", selector: "swim", value: "@actor.attributes.speed.value" },
        { key: "FlatModifier", selector: "unarmed-attack-roll", slug: "ichthys-mutagen-attack", type: "item", value: b },
        {
          key: "Strike",
          baseType: "claw",
          category: "unarmed",
          damage: { base: { damageType: "slashing", dice: t.dice, die: `d${t.die}` } },
          group: "brawling",
          img: "icons/commodities/claws/claw-bear-brown-grey.webp",
          label: "Razor Claw",
          range: null,
          slug: "ichthys-razor-claw",
          traits: ["unarmed", "agile"],
        },
        {
          key: "RollOption",
          domain: "all",
          option: "ichthys-underwater",
          label: "Underwater",
          toggleable: true,
          value: false,
        },
        {
          key: "FlatModifier",
          predicate: ["ichthys-underwater"],
          selector: ["perception", "medicine", "nature", "religion", "survival"],
          slug: "ichthys-mutagen-underwater",
          type: "item",
          value: b,
        },
        {
          key: "RollOption",
          domain: "all",
          label: "Drawback suppressed",
          option: "ichthys-drawback-suppressed",
          toggleable: true,
          value: false,
        },
        {
          key: "FlatModifier",
          predicate: [{ not: "ichthys-drawback-suppressed" }],
          selector: "athletics",
          slug: "ichthys-mutagen-drawback-athletics",
          type: "item",
          value: -1,
        },
        { key: "Weakness", predicate: [{ not: "ichthys-drawback-suppressed" }], type: "electricity", value: 5 },
      ],
      start: { initiative: null, value: 0 },
      tokenIcon: { show: true },
      traits: { rarity: "common", value: [] },
    },
  });
}

const pasteTiers = [
  { name: "Lesser", level: 1, resistance: 5, gp: 4, duration: { unit: "minutes", value: 10, text: "10 minutes" } },
  { name: "Moderate", level: 3, resistance: 10, gp: 12, duration: { unit: "hours", value: 1, text: "1 hour" } },
  { name: "Greater", level: 11, resistance: 15, gp: 300, duration: { unit: "hours", value: 8, text: "8 hours" } },
  { name: "Major", level: 17, resistance: 20, gp: 3000, duration: { unit: "hours", value: 24, text: "24 hours" } },
];

for (const t of pasteTiers) {
  const effectId = makeId(`effect:Paste:${t.name}`);
  const itemId = makeId(`item:Paste:${t.name}`);
  const r = t.resistance;

  const body =
    "<p>When created, Insulating Paste is attuned to one damage type: acid, cold, electricity, or fire.</p>" +
    "<p>Slather Insulating Paste over a willing or unconscious creature's exposed skin. Once applied, it remains as a thin film on the " +
    `creature's skin, granting the creature resistance ${r} to the attuned damage type.</p>`;
  const wearing =
    "<p>Insulating Paste grants 5 instances of protection, regardless of tier. Each time this resistance reduces damage from an attack, " +
    "the paste loses one instance of protection, wearing away a little more. Once it has no instances of protection remaining, the film " +
    "wears away completely and the effect ends immediately, even mid-combat. The effect also ends if its duration runs out, whichever " +
    "happens first.</p>";

  items.push({
    _id: itemId,
    img: PASTE_IMG,
    name: `Insulating Paste (${t.name})`,
    type: "consumable",
    system: {
      baseItem: null,
      bulk: { value: 0.1 },
      category: "other",
      containerId: null,
      damage: null,
      description: {
        value:
          `<p><strong>Activate</strong> <span class="action-glyph">3</span> (manipulate)</p><hr />` +
          `<p><em>A small jar of thick, gritty paste in a dull, chalky grey, flecked with glittering mineral grains. It is smooth enough to spread and smells faintly of stone dust and metal.</em></p>` +
          body +
          wearing +
          `<p><strong>Duration</strong> ${t.duration.text}.</p>` +
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
      traits: { rarity: "common", value: ["alchemical", "consumable"] },
      usage: { value: "held-in-one-hand" },
      uses: { autoDestroy: true, max: 1, value: 1 },
    },
  });

  items.push({
    _id: effectId,
    img: PASTE_IMG,
    name: `Effect: Insulating Paste (${t.name})`,
    type: "effect",
    system: {
      slug: "insulating-paste",
      badge: { type: "counter", value: 5 },
      description: {
        value:
          `<p>Granted by @UUID[${uuidOf(itemId)}]</p>` +
          `<p>Resistance ${r} to the attuned damage type. The badge counts the instances of protection left. Each time this resistance reduces damage from an attack, lower it by one and remove the effect when it reaches 0. While the Marquiste Additions module is active and a GM is connected, a chat message with a button appears each time the paste blocks damage; press it to lower the count.</p>`,
      },
      duration: { expiry: "turn-start", sustained: false, unit: t.duration.unit, value: t.duration.value },
      level: { value: t.level },
      publication,
      rules: [
        {
          key: "ChoiceSet",
          choices: [
            { label: "PF2E.TraitAcid", value: "acid" },
            { label: "PF2E.TraitCold", value: "cold" },
            { label: "PF2E.TraitElectricity", value: "electricity" },
            { label: "PF2E.TraitFire", value: "fire" },
          ],
          flag: "damageType",
          prompt: "Attuned damage type",
        },
        { key: "Resistance", type: "{item|flags.pf2e.rulesSelections.damageType}", value: r },
      ],
      start: { initiative: null, value: 0 },
      tokenIcon: { show: true },
      traits: { rarity: "common", value: [] },
    },
  });
}

// Formulas: one blueprint-like item for each craftable family, carrying the Formula trait, so a formula can be found by trait in the Compendium
// Browser and put in a formula book. Each item lists its family's tiers in its flags; the formula book scripts turn that into the formulas a
// character knows. The field vials and coatings are not formulas: they are made only by the Quick Vial action.
function formulaItem({ family, img, made, rarity = "common", tiers, pub }) {
  const links = tiers.map((t) => `<li>@UUID[${t.uuid}]{${t.name}} (level ${t.level})</li>`).join("");
  return {
    _id: makeId(`formula:${family}`),
    img,
    name: `Formula: ${family}`,
    type: "equipment",
    flags: { [MODULE_ID]: { formula: { tiers: tiers.map((t) => ({ level: t.level, uuid: t.uuid })) } } },
    system: {
      baseItem: null,
      bulk: { value: 0 },
      description: {
        value:
          `<p>The formula for ${made}. It is not crafted or carried like other equipment: add it to a formula book on the Crafting tab, and the book teaches you the ` +
          `${family} your level allows.</p><p>It covers:</p><ul>${links}</ul>`,
      },
      hardness: 0,
      hp: { max: 0, value: 0 },
      level: { value: tiers[0].level },
      material: { grade: null, type: null },
      price: { value: { gp: 0 } },
      publication: pub,
      quantity: 1,
      rules: [],
      size: "med",
      slug: `formula-${family.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`,
      traits: { rarity, value: ["formula"] },
      usage: { value: "carried" },
    },
  };
}

// CorpseCap's Cauldron: the mutagens and Insulating Paste.
const formulaItems = [];
for (const [family, img, made] of [
  ["Mind Doubling Mutagen", IMG, "a mutagen that doubles the mind"],
  ["Ichthys Mutagen", ICHTHYS_IMG, "a mutagen that gives a fish-like form"],
  [DRAKE, DRAKE_IMG, "a mutagen that gives you a drake's scales and keen eyes"],
  ["Insulating Paste", PASTE_IMG, "a paste that insulates against energy"],
]) {
  const tierItems = tiers.map((t) => {
    const found = items.find((i) => i.name === `${family} (${t.name})`);
    if (!found) throw new Error(`No ${family} (${t.name}) item for its formula`);
    return { name: found.name, level: found.system.level.value, uuid: uuidOf(found._id) };
  });
  formulaItems.push(formulaItem({ family, img, made, tiers: tierItems, pub: publication }));
}

// The Alchemist-only items go in their own pack, so they can be kept out of the general equipment lists.
const classItems = [];
require("./vials")({
  items: classItems,
  publication: modulePublication,
  makeId,
  uuidOf: classUuidOf,
  img: (name) => `modules/${MODULE_ID}/images/${name}.png`,
});

// Formula items for PF2e's mutagens that start at level 1 (see mutagen-formulas.js), so an Alchemist's mutagen formulas can go in a formula book.
for (const family of require("./mutagen-formulas")) {
  classItems.push(
    formulaItem({
      family: family.name,
      img: family.img,
      made: family.name,
      rarity: family.rarity,
      pub: modulePublication,
      tiers: family.ids.map((id, i) => ({ name: `${family.name} (${tiers[i].name})`, level: tiers[i].level, uuid: `Compendium.pf2e.equipment-srd.Item.${id}` })),
    })
  );
}

function writePack(moduleId, pack, list) {
  const out = sourceDir(moduleId, pack);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  for (const item of list) {
    const file = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + ".json";
    // The Foundry CLI silently skips source files that have no _key, so every document needs one to be packed.
    const doc = { _key: `!items!${item._id}`, ...item };
    fs.writeFileSync(path.join(out, file), JSON.stringify(doc, null, 4) + "\n");
  }
  console.log(`Wrote ${list.length} items to ${path.relative(process.cwd(), out)}`);
}
// Bard Enhancements: the Versatile Performance actions.
const bardItems = [];
require("./bard")({ items: bardItems, publication: modulePublication, makeId });

// Common Enhancements: items that apply across the whole game. Nothing is needed yet: the injury poison rules work on PF2e's own poisons.
const commonItems = [];

writePack(MODULE_ID, COMMON_PACK, commonItems);
writePack(MODULE_ID, CLASS_PACK, classItems);
writePack(MODULE_ID, BARD_PACK, bardItems);
writePack(CAULDRON_ID, CAULDRON_PACK, items);
writePack(CAULDRON_ID, FORMULA_PACK, formulaItems);

const moduleJson = {
  id: MODULE_ID,
  title: "Marquiste Additions",
  description: "Homebrew additions for Pathfinder 2e Remastered from ryanmarquiste.github.io/pf2e-remastered-site.",
  version: "1.1.0",
  authors: [{ name: "Ryan Marquiste" }],
  compatibility: { minimum: "13", verified: "14" },
  relationships: { systems: [{ id: "pf2e", type: "system" }] },
  esmodules: [
    // Common Enhancements
    "scripts/common/settings.js",
    "scripts/common/fleeting-trait.js",
    "scripts/common/mutable-trait.js",
    "scripts/common/formula-trait.js",
    "scripts/common/formula-books.js",
    "scripts/common/crafting-tab.js",
    "scripts/common/compendium-browser.js",
    "scripts/common/injury-poisons.js",
    "scripts/common/splash-geometry.js",
    "scripts/common/bomb-splash.js",
    // Alchemist Enhancements
    "scripts/alchemist/volatile-vial.js",
    "scripts/alchemist/quick-vial.js",
    "scripts/alchemist/create-consumable.js",
    "scripts/alchemist/quick-alchemy.js",
    "scripts/alchemist/toxicologist.js",
    "scripts/alchemist/daily-preparations.js",
    // Bard Enhancements
    "scripts/bard/versatile-performance.js",
    // Behaviour for items in the CorpseCap's Cauldron module (the Insulating Paste counter)
    "scripts/cauldron/insulating-paste.js",
  ],
  packs: [
    {
      name: COMMON_PACK,
      label: "Common Enhancements",
      path: `packs/${COMMON_PACK}`,
      type: "Item",
      system: "pf2e",
      ownership: { PLAYER: "OBSERVER", ASSISTANT: "OWNER" },
    },
    {
      name: CLASS_PACK,
      label: "Alchemist Enhancements",
      path: `packs/${CLASS_PACK}`,
      type: "Item",
      system: "pf2e",
      ownership: { PLAYER: "OBSERVER", ASSISTANT: "OWNER" },
    },
    {
      name: BARD_PACK,
      label: "Bard Enhancements",
      path: `packs/${BARD_PACK}`,
      type: "Item",
      system: "pf2e",
      ownership: { PLAYER: "OBSERVER", ASSISTANT: "OWNER" },
    },
  ],
};
fs.writeFileSync(path.join(__dirname, MODULE_ID, "module.json"), JSON.stringify(moduleJson, null, 4) + "\n");

// The content module. It needs Marquiste Additions for the Insulating Paste counter and the traits its items use.
const cauldronJson = {
  id: CAULDRON_ID,
  title: tags.cauldron.long,
  description: "Custom alchemical items from ryanmarquiste.github.io/pf2e-remastered-site: the mutagens and Insulating Paste.",
  version: "1.1.0",
  authors: [{ name: "Ryan Marquiste" }],
  compatibility: { minimum: "13", verified: "14" },
  relationships: {
    systems: [{ id: "pf2e", type: "system" }],
    requires: [{ id: MODULE_ID, type: "module" }],
  },
  packs: [
    {
      name: CAULDRON_PACK,
      label: tags.cauldron.long,
      path: `packs/${CAULDRON_PACK}`,
      type: "Item",
      system: "pf2e",
      ownership: { PLAYER: "OBSERVER", ASSISTANT: "OWNER" },
    },
    {
      name: FORMULA_PACK,
      label: "Cauldron Formulas",
      path: `packs/${FORMULA_PACK}`,
      type: "Item",
      system: "pf2e",
      ownership: { PLAYER: "OBSERVER", ASSISTANT: "OWNER" },
    },
  ],
};
fs.mkdirSync(path.join(__dirname, CAULDRON_ID), { recursive: true });
fs.writeFileSync(path.join(__dirname, CAULDRON_ID, "module.json"), JSON.stringify(cauldronJson, null, 4) + "\n");
