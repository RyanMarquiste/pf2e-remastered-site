// The module's on/off options. Each one is a world setting, so a world keeps the behaviour it had (all are on by default except Quick Alchemy). The
// scripts read a setting when they run (see `enabled`), so changing it takes effect straight away without a reload. Turning a feature off stops the
// module acting; it never deletes anything the feature made earlier (effects, formula books, known formulas).
//
// The traits (Fleeting, Mutable, Formula) are not options: they only add names to PF2e's trait lists and do nothing unless an item carries them.
// alchemistPackHidden (scripts/common/compendium-browser.js) is a hidden bookkeeping setting.
//
// Foundry's settings window has no headings, so the window is arranged when it opens (see LAYOUT): headings are added and the settings are
// put in order. A `level` of 1 is a top-level heading; 2 is a sub-heading whose settings are indented under it.
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
  toxicologistMutableAcid: {
    name: "Mutable Acid",
    hint: "Infused poison items a Toxicologist creates also get the Mutable Acid trait. Off: items are left as PF2e creates them.",
  },
  infusedPoisonsEnd: {
    name: "Infused Poison Expiry",
    hint: "A poison an alchemist made is removed from the weapon it is on when the character rests or resets daily crafting. Off: the effect stays.",
  },
  insulatingPasteCounter: {
    name: "Insulating Paste",
    hint: "When Insulating Paste reduces damage, posts a chat message with a button that uses up one instance of the protection. Off: no message.",
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
  { level: 1, heading: "Cauldron" },
  { key: "insulatingPasteCounter" },
];

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

// Arrange the module's part of the settings window: add the headings and put each setting under its heading.
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

  // A heading is only shown if a setting follows it.
  let indent = false;
  for (let i = 0; i < LAYOUT.length; i++) {
    const entry = LAYOUT[i];
    if (entry.heading) {
      let shown = false;
      for (let j = i + 1; j < LAYOUT.length && !LAYOUT[j].heading; j++) shown ||= groups.has(LAYOUT[j].key);
      if (!shown) continue;
      const heading = document.createElement(entry.level === 1 ? "h4" : "h5");
      heading.className = `marquiste-setting-heading${entry.level === 1 ? " divider" : ""}`;
      heading.textContent = entry.heading;
      if (entry.level === 2) heading.style.cssText = "margin: .75em 0 .25em; padding-left: 1em; opacity: .85;";
      indent = entry.level === 2;
      place(heading);
    } else if (groups.has(entry.key)) {
      const group = groups.get(entry.key);
      group.style.paddingLeft = indent ? "1em" : "";
      place(group);
    }
  }
});

export const enabled = (key) => game.settings.get(MODULE, key);
