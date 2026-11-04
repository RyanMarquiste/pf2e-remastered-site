// Generates the Foundry VTT (PF2e system) source files for the alchemical items in CorpseCap's Cauldron.
// Usage: node foundry/build.js   (then see foundry/README.md to compile the compendium pack)
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const MODULE_ID = "marquiste-additions";
const PACK = "corpsecaps-cauldron";
const CLASS_PACK = "marquiste-alchemist-class";
const IMG = `modules/${MODULE_ID}/images/mind-doubling-mutagen.png`;
const ICHTHYS_IMG = `modules/${MODULE_ID}/images/ichthys-mutagen.png`;
const PASTE_IMG = `modules/${MODULE_ID}/images/insulating-paste.png`;
const sourceDir = (pack) => path.join(__dirname, MODULE_ID, "packs", "_source", pack);

const ALPHANUM = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const makeId = (seed) => {
  const hash = crypto.createHash("sha1").update(seed).digest();
  return Array.from({ length: 16 }, (_, i) => ALPHANUM[hash[i] % ALPHANUM.length]).join("");
};
const uuidOf = (id) => `Compendium.${MODULE_ID}.${PACK}.Item.${id}`;
const classUuidOf = (id) => `Compendium.${MODULE_ID}.${CLASS_PACK}.Item.${id}`;

const publication = { license: "ORC", remaster: true, title: "Marquiste Additions" };

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
  "You @UUID[Compendium.pf2e.actionspf2e.Item.Recall Knowledge]{Recall Knowledge} with a skill in which you are at least trained.</p>";

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

// The Alchemist-only items go in their own pack, so they can be kept out of the general equipment lists.
const classItems = [];
require("./vials")({
  items: classItems,
  publication,
  makeId,
  uuidOf: classUuidOf,
  img: (name) => `modules/${MODULE_ID}/images/${name}.png`,
});

function writePack(pack, list) {
  const out = sourceDir(pack);
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
writePack(PACK, items);
writePack(CLASS_PACK, classItems);

const moduleJson = {
  id: MODULE_ID,
  title: "Marquiste Additions",
  description: "Homebrew additions for Pathfinder 2e Remastered from ryanmarquiste.github.io/pf2e-remastered-site.",
  version: "1.0.0",
  authors: [{ name: "Ryan Marquiste" }],
  compatibility: { minimum: "13", verified: "13" },
  relationships: { systems: [{ id: "pf2e", type: "system" }] },
  esmodules: [
    "scripts/insulating-paste.js",
    "scripts/volatile-vial.js",
    "scripts/quick-vial.js",
    "scripts/create-consumable.js",
    "scripts/quick-alchemy.js",
    "scripts/fleeting-trait.js",
    "scripts/compendium-browser.js",
    "scripts/toxicologist.js",
    "scripts/injury-poisons.js",
  ],
  packs: [
    {
      name: PACK,
      label: "CorpseCap's Cauldron",
      path: `packs/${PACK}`,
      type: "Item",
      system: "pf2e",
      ownership: { PLAYER: "OBSERVER", ASSISTANT: "OWNER" },
    },
    {
      name: CLASS_PACK,
      label: "Marquiste: Alchemist Class",
      path: `packs/${CLASS_PACK}`,
      type: "Item",
      system: "pf2e",
      ownership: { PLAYER: "OBSERVER", ASSISTANT: "OWNER" },
    },
  ],
};
fs.writeFileSync(path.join(__dirname, MODULE_ID, "module.json"), JSON.stringify(moduleJson, null, 4) + "\n");
