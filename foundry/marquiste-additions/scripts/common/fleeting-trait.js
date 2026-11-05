// The site's Fleeting trait. It is added to PF2e's trait lists so items, effects, actions, spells and creatures can carry it, and it does what it says:
// an item or effect with the trait that lands on a character, or a creature with the trait that is put on the scene, is removed when the turn it
// was created in ends. That needs a running combat; outside combat nothing expires, so the GM removes it. Items that already exist when the module
// is installed are not touched, because only the moment of creation starts the clock.
import { MODULE, say } from "./shared.js";
import { enabled, log } from "./settings.js";

const TRAIT = "fleeting";
const FLAG = "fleeting";
const LABEL = "Fleeting";
const DESCRIPTION =
  "This item, spell, effect, or creature lasts only until the end of the turn on which it was created or summoned. After that time it vanishes, " +
  "is destroyed, disappears, becomes inert, or otherwise is no longer usable for its current purpose. This is equivalent to having a duration until " +
  "the end of the current turn, and it can't be extended unless the extension specifically says it extends Fleeting.";

// The lists PF2e's own homebrew traits are added to, including the ones they propagate to.
const LISTS = [
  "actionTraits",
  "armorTraits",
  "consumableTraits",
  "creatureTraits",
  "effectTraits",
  "equipmentTraits",
  "featTraits",
  "npcAttackTraits",
  "shieldTraits",
  "spellTraits",
  "weaponTraits",
];

Hooks.once("init", () => {
  for (const key of LISTS) {
    if (CONFIG.PF2E[key]) CONFIG.PF2E[key][TRAIT] = LABEL;
  }
  // The Toxic Coating effects carry the Infused trait, which PF2e only lists for items.
  if (CONFIG.PF2E.effectTraits) CONFIG.PF2E.effectTraits.infused ??= CONFIG.PF2E.equipmentTraits?.infused ?? "PF2E.TraitInfused";
  CONFIG.PF2E.traitsDescriptions ??= {};
  CONFIG.PF2E.traitsDescriptions[TRAIT] = DESCRIPTION;
});

// The turn that is running now, or null when there is no running combat.
function currentTurn() {
  const combat = game.combat;
  if (!combat?.started || !combat.combatant) return null;
  return { combatId: combat.id, combatantId: combat.combatant.id, round: combat.round };
}

const hasTrait = (traits) => Array.isArray(traits) && traits.includes(TRAIT);

// Start the clock as the item or token is created, by writing the turn into it before it is saved. Only the client that creates it does this.
Hooks.on("preCreateItem", (item) => {
  if (!enabled("fleeting") || item.parent?.documentName !== "Actor" || !hasTrait(item.system?.traits?.value)) return;
  // The Quick Vial action keeps its own record of the turn, and ends the vial itself.
  if (item.getFlag(MODULE, "quickVial")) return;
  const turn = currentTurn();
  if (turn) item.updateSource({ [`flags.${MODULE}.${FLAG}`]: turn });
});

Hooks.on("preCreateToken", (token) => {
  if (!enabled("fleeting")) return;
  const actor = token.actor ?? game.actors.get(token.actorId);
  if (!hasTrait(actor?.system?.traits?.value)) return;
  const turn = currentTurn();
  if (turn) token.updateSource({ [`flags.${MODULE}.${FLAG}`]: turn });
});

// Still within the turn it was created in?
const current = (flag, combat) => flag.round === combat.round && flag.combatantId === combat.combatant?.id;

// Remove what has outlived its turn. `ended` is true when the whole combat is over, which ends every turn in it.
async function expire(combat, ended) {
  const over = (flag) => flag?.combatId === combat.id && (ended || !current(flag, combat));
  const gone = async (document, actor, name) => {
    try {
      await document.delete();
    } catch (error) {
      return log("Fleeting: could not remove", name, error); // something else (such as the effect's own duration) already removed it
    }
    const note = `<p>${name} is Fleeting and is gone at the end of the turn.</p>`;
    if (actor) say(actor, note);
    else ChatMessage.create({ content: note });
  };

  const actors = new Set(game.actors.contents);
  for (const scene of game.scenes) for (const token of scene.tokens) if (token.actor) actors.add(token.actor);
  for (const actor of actors) {
    for (const item of [...actor.items]) {
      if (!over(item.getFlag(MODULE, FLAG))) continue;
      // The Alchemist actions end what they create on their own terms.
      if (item.getFlag(MODULE, "quickVial") || item.getFlag(MODULE, "createConsumable")) continue;
      log("Fleeting: removing", item.name, "from", actor.name);
      await gone(item, actor, item.name);
    }
  }
  for (const scene of game.scenes) {
    for (const token of [...scene.tokens]) {
      if (!over(token.getFlag(MODULE, FLAG))) continue;
      log("Fleeting: removing token", token.name);
      await gone(token, token.actor ?? null, token.name);
    }
  }
}

Hooks.on("updateCombat", (combat, changed) => {
  if (!("turn" in changed || "round" in changed) || !enabled("fleeting") || game.users.activeGM?.id !== game.user.id) return;
  expire(combat, false).catch((error) => console.error(MODULE, error));
});

Hooks.on("deleteCombat", (combat) => {
  if (!enabled("fleeting") || game.users.activeGM?.id !== game.user.id) return;
  expire(combat, true).catch((error) => console.error(MODULE, error));
});
