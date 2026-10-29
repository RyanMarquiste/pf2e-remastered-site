// Generates the Foundry VTT (PF2e system) source files for the Mind Doubling Mutagen.
// Usage: node foundry/build.js   (then see foundry/README.md to compile the compendium pack)
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const MODULE_ID = "pf2e-remastered-additions";
const PACK = "mutagens";
const IMG = `modules/${MODULE_ID}/images/mind-doubling-mutagen.png`;
const OUT = path.join(__dirname, MODULE_ID, "packs", "_source", PACK);

const ALPHANUM = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const makeId = (seed) => {
  const hash = crypto.createHash("sha1").update(seed).digest();
  return Array.from({ length: 16 }, (_, i) => ALPHANUM[hash[i] % ALPHANUM.length]).join("");
};
const uuidOf = (id) => `Compendium.${MODULE_ID}.${PACK}.Item.${id}`;

const publication = { license: "ORC", remaster: true, title: "Remastered Additions" };

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

  items.push({
    _id: effectId,
    img: IMG,
    name: `Effect: Mind Doubling Mutagen (${t.name})`,
    type: "effect",
    system: {
      description: { value: `<p>Granted by @UUID[${uuidOf(itemId)}]</p>` + benefit + drawback + featText },
      duration: { expiry: "turn-start", sustained: false, unit: dur.unit, value: dur.value },
      level: { value: t.level },
      publication,
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
        {
          key: "FlatModifier",
          selector: ["acrobatics", "stealth", "thievery"],
          slug: "mind-doubling-mutagen-drawback-skills",
          type: "item",
          value: -1,
        },
        {
          key: "FlatModifier",
          selector: "reflex",
          slug: "mind-doubling-mutagen-drawback-reflex",
          type: "item",
          value: -2,
        },
        { key: "Weakness", type: "mental", value: 5 },
        {
          key: "RollTwice",
          keep: "higher",
          predicate: ["feat:mutant-innervation", "item:trait:mental"],
          selector: "saving-throw",
        },
        { key: "GrantItem", uuid: uuidOf(thinkingId) },
      ],
      start: { initiative: null, value: 0 },
      tokenIcon: { show: true },
      traits: { rarity: "common", value: [] },
    },
  });
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const item of items) {
  const file = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + ".json";
  fs.writeFileSync(path.join(OUT, file), JSON.stringify(item, null, 4) + "\n");
}

const moduleJson = {
  id: MODULE_ID,
  title: "Remastered Additions",
  description: "Homebrew additions for Pathfinder 2e Remastered from ryanmarquiste.github.io/pf2e-remastered-site.",
  version: "1.0.0",
  authors: [{ name: "Ryan Marquiste" }],
  compatibility: { minimum: "13", verified: "13" },
  relationships: { systems: [{ id: "pf2e", type: "system" }] },
  packs: [
    {
      name: PACK,
      label: "Mutagens",
      path: `packs/${PACK}`,
      type: "Item",
      system: "pf2e",
      ownership: { PLAYER: "OBSERVER", ASSISTANT: "OWNER" },
    },
  ],
};
fs.writeFileSync(path.join(__dirname, MODULE_ID, "module.json"), JSON.stringify(moduleJson, null, 4) + "\n");
console.log(`Wrote ${items.length} items to ${path.relative(process.cwd(), OUT)}`);
