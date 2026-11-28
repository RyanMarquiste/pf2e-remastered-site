// The site's Makeshift trait: an everyday object used as a weapon, shield, or armor, which may break at the worst moment.
//   - A makeshift weapon breaks when its wielder rolls a critical failure on a Strike with it.
//   - When an attack against a character is a critical hit, the character's raised shield breaks if it is makeshift; if no shield is raised, their worn armor breaks if it is
//     makeshift. (A raised shield that is not makeshift takes the hit, and the armor is left alone.)
// "Breaking" is the Broken trait (scripts/common/broken-trait.js): the item gets the trait, whether or not it has Hit Points, and its Hit Points are not touched. What a broken item can't do
// (a weapon can't Strike, a shield gives no bonus), and how it is mended (its Hit Points raised above its Broken Threshold, or, with none, a successful Repair check), are in that script.
// Rerolls are allowed to save the item: when a hero point or a fortune effect rerolls the attack and the new result is no longer a critical failure (or critical hit), PF2e updates
// the same chat message, and the item loses the trait again. The GM's client does the work, since a player can't edit another player's item, so a GM has to be connected.
import { MODULE } from "./shared.js";
import { enabled, log } from "./settings.js";
import { breakItem, hasBroken, mendItem } from "./broken-trait.js";

const TRAIT = "makeshift";
const FLAG = "makeshift";
const LABEL = "Makeshift";
const DESCRIPTION =
  "This everyday object is being used as a weapon, shield, or armor, and it may break. A makeshift weapon breaks if you roll a critical failure on a Strike with it. " +
  "A makeshift shield you have raised breaks when an attack against you is a critical hit, and makeshift armor breaks when you are critically hit and have no shield raised. " +
  "An item that breaks gains the broken trait. A broken makeshift weapon can't be used to Strike but stays in your hand, so you must stow it and draw another weapon. " +
  "If you reroll the attack and the new result isn't a critical failure or critical hit, the item doesn't break.";

const LISTS = ["armorTraits", "equipmentTraits", "shieldTraits", "weaponTraits"];

function registerTrait() {
  for (const list of LISTS) if (CONFIG.PF2E[list]) CONFIG.PF2E[list][TRAIT] = LABEL;
  CONFIG.PF2E.traitsDescriptions ??= {};
  CONFIG.PF2E.traitsDescriptions[TRAIT] = DESCRIPTION;
}
Hooks.once("init", registerTrait);
Hooks.once("i18nInit", registerTrait);

export const isMakeshift = (item) => !!item?.system?.traits?.value?.includes(TRAIT);

// Resolve a uuid to an actor, whether it is an actor's or a token's.
async function actorFrom(uuid) {
  const doc = uuid ? await fromUuid(uuid) : null;
  return doc?.actor ?? doc ?? null;
}

// The makeshift items this attack roll breaks, whether or not they are already broken. Nothing is listed unless the roll is a critical failure or a critical hit.
async function itemsHit(message) {
  const context = message.flags?.pf2e?.context;
  if (context?.type !== "attack-roll") return [];
  const found = [];

  if (context.outcome === "criticalFailure") {
    const weapon = await fromUuid(message.flags.pf2e.origin?.uuid ?? "");
    if (weapon?.type === "weapon" && isMakeshift(weapon)) found.push(weapon);
  }

  if (context.outcome === "criticalSuccess") {
    const target = await actorFrom(context.target?.actor);
    const shield = target?.heldShield;
    // A raised shield takes the critical hit; without one, the armor does.
    const taker = shield?.isRaised ? shield : target?.wornArmor;
    if (taker && isMakeshift(taker)) found.push(taker);
  }
  return found;
}

const busy = new Set();
const isTheGm = () => game.user.isGM && game.users.activeGM?.id === game.user.id;

function announce(item, html) {
  return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: item.actor }), content: `<p>${html}</p>` });
}

// Make the items match the message: break what the roll breaks, and mend what a reroll saved. It can run again on the same message without doing anything twice.
async function sync(message) {
  if (!enabled("makeshift") || !isTheGm() || busy.has(message.id)) return;
  busy.add(message.id);
  try {
    const record = message.getFlag(MODULE, FLAG);
    const hit = await itemsHit(message);

    if (record?.length) {
      if (hit.length) return;
      // The roll no longer breaks anything (it was rerolled): mend each item this message broke.
      for (const { uuid } of record) {
        const item = await fromUuid(uuid);
        if (item && (await mendItem(item))) await announce(item, `The ${item.name} holds together after all.`);
      }
      await message.unsetFlag(MODULE, FLAG);
      log("makeshift items restored for", message.id);
      return;
    }

    const toBreak = hit.filter((item) => !hasBroken(item));
    if (!toBreak.length) return;
    // The record goes down first, so the update it causes is seen as already handled.
    await message.setFlag(MODULE, FLAG, toBreak.map((item) => ({ uuid: item.uuid })));
    for (const item of toBreak) {
      await breakItem(item);
      await announce(item, `The ${item.name} breaks!`);
    }
    log("makeshift items broken for", message.id, toBreak.map((item) => item.name));
  } finally {
    busy.delete(message.id);
  }
}

Hooks.on("createChatMessage", (message) => sync(message));
Hooks.on("updateChatMessage", (message) => sync(message));
