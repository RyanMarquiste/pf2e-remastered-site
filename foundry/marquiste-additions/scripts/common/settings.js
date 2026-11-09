// The module's options. Each one is a world setting, so a world keeps the behaviour it had (all are on by default except Quick Alchemy, Apply splash automatically, Troubleshooting
// mode and Log activity). The scripts read a setting when they run (see `enabled`), so changing it takes effect straight away without a reload. Turning a
// feature off stops the module acting; it never deletes anything the feature made earlier (effects, formula books, known formulas).
//
// There are two kinds of setting. The ones people choose at the table (Poisons, Crafting, Alchemist, Cauldron) are always shown. The ones under
// Troubleshooting switch individual features off to find where this module clashes with another module. They are hidden until Troubleshooting mode is
// ticked, and while it is off every one of them is ignored (`enabled` returns true), so a switch left off can never silently break a world.
//
// The Formula trait is not an option: it only adds a name to PF2e's trait lists. alchemistPackHidden (scripts/common/compendium-browser.js) is a hidden
// bookkeeping setting.
//
// Foundry's settings window has no headings, so the window is arranged when it opens (see LAYOUT): headings are added and the settings are put in
// order. A `level` of 1 is a top-level heading; 2 is a sub-heading whose settings are indented under it. Entries marked `debug` are hidden until
// Troubleshooting mode is ticked.
import { MODULE } from "./shared.js";

const OPTIONS = {
  poisonApplication: {
    name: "Application",
    hint:
      "Using an injury poison asks which weapon to poison, puts a Poisoned Weapon effect on it, asks before replacing a poison the weapon already carries, " +
      "and posts the poison's description and saving throw when the weapon hits. Off: injury poisons work as they do in PF2e.",
  },
  poisonExpiry: {
    name: "Removal",
    hint:
      "A poison on a weapon is used up by the first successful Strike or a critical failure (on a weapon that fires ammunition, when it is fired). " +
      "This covers injury poisons and the Alchemist's Toxic Coatings. Off: the effect stays on the weapon until you delete it.",
  },
  formulaBooks: {
    name: "Formula Books",
    hint:
      "Groups the formulas on a character's Crafting tab into their formula books, with Formula items that grow with the character's level. " +
      "Off: the Crafting tab is PF2e's own and formulas are not synced. Formulas already learned stay known.",
  },
  // The key is older than its name: it was first called the Volatile Vial house rules, and renaming it would reset the value in existing worlds.
  volatileVialRules: {
    name: "Quick Alchemy",
    hint:
      "Turns on the alternate Quick Alchemy: using the Quick Alchemy (Marquiste) action asks you to choose Quick Vial or Create Consumable. " +
      "An Alchemist's versatile vials stay as PF2e's resource; a Volatile Vial, the throwable bomb, is only created by Quick Vial. " +
      "Off: that action does nothing. PF2e's own Quick Alchemy is not changed.",
    default: false,
  },
  bombSplash: {
    name: "Splash targets",
    hint:
      "When the damage for a weapon with the Splash trait (the alchemical bombs) is rolled on a hit, the other creatures within the splash's reach of the target (5 feet, " +
      "more with Expanded Splash and similar) are listed in the chat message, each with a Splash button that applies its splash. After a miss the damage roll is only the " +
      "splash, taken once by the target. Off: splash works as it does in PF2e.",
  },
  bombSplashAutoApply: {
    name: "Apply splash automatically",
    hint:
      "The splash for the other creatures in the area is applied as soon as the damage is rolled, and the chat card only lists what they took. " +
      "Off: the card has an Apply button for each creature. This needs Splash targets, and the GM needs to be connected.",
    default: false,
  },
  toxicologistMutableAcid: {
    name: "Mutable Acid",
    hint: "Infused poison items a Toxicologist creates also get the Mutable Acid trait, so their damage can change to acid. Off: items are left as PF2e creates them.",
  },
  infusedPoisonsEnd: {
    name: "Infused Poison Expiry",
    hint: "A poison an alchemist made is removed from the weapon it is on when the character rests or resets daily crafting. Off: the effect stays.",
  },
  insulatingPasteCounter: {
    name: "Insulating Paste",
    hint: "When Insulating Paste reduces damage, posts a chat message with a button that uses up one instance of the protection. Off: no message.",
  },

  // Troubleshooting.
  troubleshooting: {
    name: "Troubleshooting mode",
    hint:
      "Shows a switch for each feature of this module, to help find where it clashes with another module: switch features off one at a time until the problem " +
      "goes away. While this is off, all of those switches are ignored and every feature runs normally. While it is on and a feature is off, the GM is told when the world loads.",
    default: false,
  },
  fleeting: {
    name: "Fleeting trait",
    hint:
      "An item or effect with the Fleeting trait on a character, or a summoned creature with it, is removed when the turn it was created in ends. " +
      "This needs a running combat. Off: Fleeting is only a label.",
  },
  mutable: {
    name: "Mutable traits",
    hint:
      "Damage from an item or effect with a Mutable trait changes to that type against a creature for which it is the better type. The Toxic Coatings and the " +
      "Toxicologist's Mutable Acid depend on this. Off: the traits are only labels.",
  },
  craftingTabLayout: {
    name: "Crafting tab layout",
    hint: "Draws the formula books on a character's Crafting tab. Off: that tab is PF2e's own. This also needs Formula Books to be on.",
  },
  formulaSync: {
    name: "Formula sync",
    hint:
      "Keeps a character's known formulas in step with their formula books and level, and moves a Formula item dropped on the Crafting tab into a book. " +
      "Off: the module does not change a character's formula list. This also needs Formula Books to be on.",
  },
  alchemistActions: {
    name: "Alchemist actions",
    hint: "The Quick Vial, Create Consumable and Quick Alchemy (Marquiste) actions, and removing what they create when the turn ends.",
  },
  bombVialUpkeep: {
    name: "Bomb vial upkeep",
    hint: "Marks a thrown vial as used and removes it afterwards, and puts back a Versatile Vial that an earlier version of this module renamed.",
  },
  compendiumBrowserPacks: {
    name: "Compendium Browser pack",
    hint: "Switches the Alchemist pack off for the Compendium Browser's Equipment tab, once, when the world loads. Off: the module leaves that PF2e setting alone.",
  },
  debugLog: {
    name: "Log activity",
    hint: "Writes what the module is doing to the browser console (F12). Only works while Troubleshooting mode is on.",
    default: false,
  },
};

// The order of the settings window.
const LAYOUT = [
  { level: 1, heading: "Poisons" },
  { key: "poisonApplication" },
  { key: "poisonExpiry" },
  { level: 1, heading: "Crafting" },
  { key: "formulaBooks" },
  { level: 1, heading: "Alchemist" },
  { key: "volatileVialRules" },
  { level: 2, heading: "Toxicologist" },
  { key: "toxicologistMutableAcid" },
  { key: "infusedPoisonsEnd" },
  { level: 1, heading: "Splash" },
  { key: "bombSplash" },
  { key: "bombSplashAutoApply" },
  { level: 1, heading: "Cauldron" },
  { key: "insulatingPasteCounter" },
  { level: 1, heading: "Troubleshooting" },
  { key: "troubleshooting" },
  { level: 2, heading: "Traits", debug: true },
  { key: "fleeting", debug: true },
  { key: "mutable", debug: true },
  { level: 2, heading: "Features", debug: true },
  { key: "craftingTabLayout", debug: true },
  { key: "formulaSync", debug: true },
  { key: "alchemistActions", debug: true },
  { key: "bombVialUpkeep", debug: true },
  { key: "compendiumBrowserPacks", debug: true },
  { level: 2, heading: "Console", debug: true },
  { key: "debugLog", debug: true },
];

// The switches that only count while Troubleshooting mode is on.
const SWITCHES = ["fleeting", "mutable", "craftingTabLayout", "formulaSync", "alchemistActions", "bombVialUpkeep", "compendiumBrowserPacks"];

Hooks.once("init", () => {
  // Registered in the order of the window, which is also the order Foundry lists them in if the arranging below finds nothing to arrange.
  for (const { key } of LAYOUT) {
    if (!key) continue;
    const { default: initial = true, ...option } = OPTIONS[key];
    game.settings.register(MODULE, key, {
      ...option,
      scope: "world",
      config: true,
      type: Boolean,
      default: initial,
      // Scripts that need to react to a change (the Crafting tab, for one) listen for this.
      onChange: (value) => Hooks.callAll(`${MODULE}.settingChanged`, key, value),
    });
  }
});

// Is this feature on? A troubleshooting switch counts only while Troubleshooting mode is on; otherwise the feature is on.
export function enabled(key) {
  if (SWITCHES.includes(key) && !game.settings.get(MODULE, "troubleshooting")) return true;
  return game.settings.get(MODULE, key);
}

// Write to the console, but only when the GM has asked for it under Troubleshooting.
export function log(...args) {
  if (game.settings.get(MODULE, "troubleshooting") && game.settings.get(MODULE, "debugLog")) console.log(`${MODULE} |`, ...args);
}

// With Troubleshooting mode on, say which features are switched off, so a forgotten switch is not a mystery.
Hooks.once("ready", () => {
  if (!game.user.isGM || !game.settings.get(MODULE, "troubleshooting")) return;
  const off = SWITCHES.filter((key) => !game.settings.get(MODULE, key)).map((key) => OPTIONS[key].name);
  const message = off.length ? `Marquiste Additions: Troubleshooting mode is on. Switched off: ${off.join(", ")}.` : "Marquiste Additions: Troubleshooting mode is on.";
  ui.notifications.warn(message);
  console.warn(message);
});

// Arrange the module's part of the settings window: add the headings, put each setting under its heading, and hide the troubleshooting switches
// until Troubleshooting mode is ticked.
Hooks.on("renderSettingsConfig", (app, html) => {
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root) return;
  root.querySelectorAll(".marquiste-setting-heading").forEach((heading) => heading.remove());

  const groups = new Map();
  for (const { key } of LAYOUT) {
    const group = root.querySelector(`[name="${MODULE}.${key}"]`)?.closest(".form-group");
    if (group) groups.set(key, group);
  }
  if (!groups.size) return;

  // Put everything after the first of the module's own settings, so nothing else in the window moves.
  const first = LAYOUT.find(({ key }) => groups.has(key));
  let anchor = groups.get(first.key).previousElementSibling;
  const parent = groups.get(first.key).parentElement;
  const place = (element) => (anchor ? anchor.after(element) : parent.prepend(element), (anchor = element));

  const hideable = [];
  let indent = false;
  for (let i = 0; i < LAYOUT.length; i++) {
    const entry = LAYOUT[i];
    let element;
    if (entry.heading) {
      // A heading is only shown if a setting follows it.
      let shown = false;
      for (let j = i + 1; j < LAYOUT.length && !LAYOUT[j].heading; j++) shown ||= groups.has(LAYOUT[j].key);
      if (!shown) continue;
      element = document.createElement(entry.level === 1 ? "h4" : "h5");
      element.className = `marquiste-setting-heading${entry.level === 1 ? " divider" : ""}`;
      element.textContent = entry.heading;
      if (entry.level === 2) element.style.cssText = "margin: .75em 0 .25em; padding-left: 1em; opacity: .85;";
      indent = entry.level === 2;
    } else if (groups.has(entry.key)) {
      element = groups.get(entry.key);
      element.style.paddingLeft = indent ? "1em" : "";
    } else continue;
    place(element);
    if (entry.debug) hideable.push(element);
  }

  // Foundry's own search only sets `hidden`, so the display is set directly and survives a search being cleared.
  const master = root.querySelector(`[name="${MODULE}.troubleshooting"]`);
  const refresh = () => hideable.forEach((element) => (element.style.display = !master || master.checked ? "" : "none"));
  master?.addEventListener("change", refresh);
  refresh();
});
