// The site's Makeshift trait: an everyday object used as a weapon, shield, or armor, which may break at the worst moment.
//   - A makeshift weapon breaks when its wielder rolls a critical failure on a Strike with it.
//   - When an attack against a character is a critical hit, the character's raised shield breaks if it is makeshift; if no shield is raised, their worn armor breaks if it is
//     makeshift. (A raised shield that is not makeshift takes the hit, and the armor is left alone.)
//   - A broken makeshift weapon can't be used to Strike (the Strike is cancelled before it is rolled), but it is not unequipped: it stays in the character's hand.
// "Broken" is PF2e's own: the item's Hit Points are set to its Broken Threshold, so PF2e's broken shield rules, the Repair action, and the item sheet all see it. The item's
// Hardness and Hit Points come from the material it is made of; for a weapon they only say when it breaks and how hard it is to repair.
// Rerolls are allowed to save the item: when a hero point or a fortune effect rerolls the attack and the new result is no longer a critical failure (or critical hit), PF2e updates
// the same chat message, and the item gets back the Hit Points it had. The GM's client does the work, since a player can't edit another player's item, so a GM has to be connected.
import { MODULE } from "./shared.js";
import { enabled, log } from "./settings.js";

const TRAIT = "makeshift";
const FLAG = "makeshift";
const LABEL = "Makeshift";
const DESCRIPTION =
  "This everyday object is being used as a weapon, shield, or armor, and it may break. A makeshift weapon breaks if you roll a critical failure on a Strike with it. " +
  "A makeshift shield you have raised breaks when an attack against you is a critical hit, and makeshift armor breaks when you are critically hit and have no shield raised. " +
  "A broken makeshift weapon can't be used to Strike but stays in your hand, so you must stow it and draw another weapon. If you reroll the attack and the new result isn't a critical failure or critical hit, the item doesn't break.";

const LISTS = ["armorTraits", "equipmentTraits", "shieldTraits", "weaponTraits"];

function registerTrait() {
  for (const list of LISTS) if (CONFIG.PF2E[list]) CONFIG.PF2E[list][TRAIT] = LABEL;
  CONFIG.PF2E.traitsDescriptions ??= {};
  CONFIG.PF2E.traitsDescriptions[TRAIT] = DESCRIPTION;
}
Hooks.once("init", registerTrait);
Hooks.once("i18nInit", registerTrait);

export const isMakeshift = (item) => !!item?.system?.traits?.value?.includes(TRAIT);
const hasHealth = (item) => (item?.system?.hp?.max ?? 0) > 0;
const brokenThreshold = (item) => Math.floor(item.system.hp.max / 2);
const alreadyBroken = (item) => item.system.hp.value <= brokenThreshold(item);

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
    if (weapon?.type === "weapon" && isMakeshift(weapon) && hasHealth(weapon)) found.push(weapon);
  }

  if (context.outcome === "criticalSuccess") {
    const target = await actorFrom(context.target?.actor);
    const shield = target?.heldShield;
    // A raised shield takes the critical hit; without one, the armor does.
    const taker = shield?.isRaised ? shield : target?.wornArmor;
    if (taker && isMakeshift(taker) && hasHealth(taker)) found.push(taker);
  }
  return found;
}

const busy = new Set();
const isTheGm = () => game.user.isGM && game.users.activeGM?.id === game.user.id;

function announce(item, html) {
  return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: item.actor }), content: `<p>${html}</p>` });
}

// Make the items match the message: break what the roll breaks, and give back what a reroll saved. It can run again on the same message without doing anything twice.
async function sync(message) {
  if (!enabled("makeshift") || !isTheGm() || busy.has(message.id)) return;
  busy.add(message.id);
  try {
    const record = message.getFlag(MODULE, FLAG);
    const hit = await itemsHit(message);

    if (record?.length) {
      if (hit.length) return;
      // The roll no longer breaks anything (it was rerolled): restore each item, unless something else has changed its Hit Points since.
      for (const { uuid, before, after } of record) {
        const item = await fromUuid(uuid);
        if (!item) continue;
        if (item.system.hp.value === after) {
          await item.update({ "system.hp.value": before });
          await announce(item, `The ${item.name} holds together after all.`);
        }
      }
      await message.unsetFlag(MODULE, FLAG);
      log("makeshift items restored for", message.id);
      return;
    }

    const toBreak = hit.filter((item) => !alreadyBroken(item));
    if (!toBreak.length) return;
    const rows = toBreak.map((item) => ({ uuid: item.uuid, before: item.system.hp.value, after: brokenThreshold(item) }));
    // The record goes down first, so the update it causes is seen as already handled.
    await message.setFlag(MODULE, FLAG, rows);
    for (const [index, item] of toBreak.entries()) {
      await item.update({ "system.hp.value": rows[index].after });
      await announce(item, `The ${item.name} breaks!`);
    }
    log("makeshift items broken for", message.id, rows);
  } finally {
    busy.delete(message.id);
  }
}

Hooks.on("createChatMessage", (message) => sync(message));
Hooks.on("updateChatMessage", (message) => sync(message));

// A broken makeshift weapon can't Strike. PF2e rolls every Strike through Check.roll with the weapon in the context; cancelling there means nothing is rolled or spent,
// and the weapon stays where it is.
Hooks.once("ready", () => {
  const Check = game.pf2e?.Check;
  if (!Check?.roll) return;
  const original = Check.roll;
  Check.roll = function (check, context = {}, ...rest) {
    const item = context?.item;
    if (enabled("makeshift") && context?.type === "attack-roll" && item?.type === "weapon" && isMakeshift(item) && hasHealth(item) && item.isBroken) {
      ui.notifications.warn(`${item.name} is broken and can't be used to Strike until it is repaired. Stow it and draw another weapon.`);
      return Promise.resolve(null);
    }
    return original.call(this, check, context, ...rest);
  };
});
