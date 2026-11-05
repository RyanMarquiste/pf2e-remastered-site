// The module's on/off options. Each one is a world setting that defaults to on, so a world keeps the behaviour it had. The scripts read a setting
// when they run (see `enabled`), so changing it takes effect straight away without a reload. Turning a feature off stops the module acting; it never
// deletes anything the feature made earlier (effects, formula books, known formulas).
//
// The traits (Fleeting, Mutable, Formula) are not options: they only add names to PF2e's trait lists and do nothing unless an item carries them.
// Older settings are registered where they are used: volatileVialRules in scripts/alchemist/volatile-vial.js and alchemistPackHidden in
// scripts/common/compendium-browser.js.
import { MODULE } from "./shared.js";

const OPTIONS = {
  poisonApplication: {
    name: "Poisons: apply injury poisons to weapons",
    hint:
      "Using an injury poison asks which weapon to poison, puts a Poisoned Weapon effect on it, asks before replacing a poison the weapon already carries, " +
      "and posts the poison's description and saving throw when the weapon hits. Off: injury poisons work as they do in PF2e.",
  },
  poisonExpiry: {
    name: "Poisons: use up a poison on a weapon",
    hint:
      "A poison on a weapon is used up by the first successful Strike or a critical failure (on a weapon that fires ammunition, when it is fired). " +
      "This covers injury poisons and the Alchemist's Toxic Coatings. Off: the effect stays on the weapon until you delete it.",
  },
  formulaBooks: {
    name: "Crafting: formula books",
    hint:
      "Groups the formulas on a character's Crafting tab into their formula books, with Formula items that grow with the character's level. " +
      "Off: the Crafting tab is PF2e's own and formulas are not synced. Formulas already learned stay known.",
  },
  toxicologistMutableAcid: {
    name: "Alchemist: Toxicologist infused poisons are Mutable Acid",
    hint: "Infused poison items a Toxicologist creates also get the Mutable Acid trait. Off: items are left as PF2e creates them.",
  },
  infusedPoisonsEnd: {
    name: "Alchemist: infused poisons end at daily preparations",
    hint: "A poison an alchemist made is removed from the weapon it is on when the character rests or resets daily crafting. Off: the effect stays.",
  },
  insulatingPasteCounter: {
    name: "Cauldron: count Insulating Paste protection",
    hint: "When Insulating Paste reduces damage, posts a chat message with a button that uses up one instance of the protection. Off: no message.",
  },
};

Hooks.once("init", () => {
  for (const [key, option] of Object.entries(OPTIONS)) {
    game.settings.register(MODULE, key, {
      ...option,
      scope: "world",
      config: true,
      type: Boolean,
      default: true,
      // Scripts that need to react to a change (the Crafting tab, for one) listen for this.
      onChange: (value) => Hooks.callAll(`${MODULE}.settingChanged`, key, value),
    });
  }
});

export const enabled = (key) => game.settings.get(MODULE, key);
