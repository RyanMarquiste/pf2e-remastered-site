// The Broken trait: an item that has it can no longer be used for its intended purpose. It is a trait on the item (not a state worked out from Hit Points, as PF2e's own broken is), so
// it works for an item that has no Hit Points at all, such as a makeshift weapon.
//   - A broken weapon can't Strike. The Strike is cancelled before it is rolled and the weapon stays in the hand.
//   - A broken shield is treated as broken by PF2e itself (no AC bonus, can't be raised), because the item reports isBroken while it has the trait.
//   - A broken item's rule elements are switched off, so a broken tool, worn item or anything else that gives a bonus through rules gives none.
//   - A broken wand or scroll (a consumable with a spell in it) can't be cast.
// Mending it:
//   - An item with Hit Points loses the trait when its Hit Points are raised above its Broken Threshold (Repair, healing, or editing them).
//   - An item with no Hit Points loses it when a Repair check on it succeeds (PF2e's Repair action, against the item's level DC; the DC is PF2e's, not this module's). So does an item
//     with Hit Points that are already above its Broken Threshold (Makeshift breaks an item without lowering them), since there is nothing to raise.
// breakItem and mendItem are what other scripts (Makeshift) use to add and remove it. Armor is not automated beyond switching its rules off: PF2e does not apply broken armor's AC penalty
// itself, so a broken suit of armor still counts its AC until the GM applies the penalty.
import { MODULE } from "./shared.js";
import { enabled, log } from "./settings.js";

export const TRAIT = "broken";
const LABEL = "Broken";
const DESCRIPTION =
  "A broken item can no longer be used for its intended purpose. A broken weapon can't be used to Strike, a broken shield gives no bonus and can't be raised, a broken wand or scroll can't be " +
  "cast, and a broken tool or other item that gives a bonus gives none. It still imposes the penalties and limitations of carrying, holding, or wearing it. An item with Hit Points stops " +
  "being broken when its Hit Points are raised above its Broken Threshold. An item with no Hit Points stops being broken when a Repair check on it succeeds.";

const LISTS = ["armorTraits", "consumableTraits", "equipmentTraits", "shieldTraits", "weaponTraits"];

function registerTrait() {
  for (const list of LISTS) if (CONFIG.PF2E[list]) CONFIG.PF2E[list][TRAIT] = LABEL;
  CONFIG.PF2E.traitsDescriptions ??= {};
  CONFIG.PF2E.traitsDescriptions[TRAIT] = DESCRIPTION;
}
Hooks.once("init", registerTrait);
Hooks.once("i18nInit", registerTrait);

export const hasBroken = (item) => !!item?.system?.traits?.value?.includes(TRAIT);
// The setting is read when it is used; before the settings exist the feature counts as on.
const isOn = () => {
  try {
    return enabled("brokenTrait");
  } catch {
    return true;
  }
};

// The class that defines a property: PF2e's methods and getters live on its base classes, so patching the weapon class would only patch a copy.
const definer = (proto, name) => {
  while (proto && !Object.getOwnPropertyDescriptor(proto, name)) proto = Object.getPrototypeOf(proto);
  return proto;
};

let patched = false;
// PF2e reports an item as broken from its Hit Points. While it has the Broken trait it is broken whatever its Hit Points are, and its rule elements are not applied.
function patchItems() {
  const classes = CONFIG.PF2E?.Item?.documentClasses;
  if (patched || !classes?.weapon?.prototype) return;
  patched = true;

  const physical = definer(classes.weapon.prototype, "isBroken");
  const descriptor = physical && Object.getOwnPropertyDescriptor(physical, "isBroken");
  if (descriptor?.get) {
    Object.defineProperty(physical, "isBroken", {
      configurable: true,
      get() {
        return descriptor.get.call(this) || (isOn() && hasBroken(this));
      },
    });
  }

  const base = definer(classes.weapon.prototype, "prepareRuleElements");
  const prepare = base?.prepareRuleElements;
  if (typeof prepare === "function") {
    base.prepareRuleElements = function (...args) {
      return isOn() && hasBroken(this) ? [] : prepare.apply(this, args);
    };
  }

  // A wand or scroll is a consumable with a spell in it, and it is cast through castEmbeddedSpell.
  const consumable = classes.consumable?.prototype;
  const cast = consumable && definer(consumable, "castEmbeddedSpell");
  const castOriginal = cast?.castEmbeddedSpell;
  if (typeof castOriginal === "function") {
    cast.castEmbeddedSpell = function (...args) {
      if (isOn() && hasBroken(this)) {
        ui.notifications.warn(`${this.name} is broken and can't be cast from until it is repaired.`);
        return undefined;
      }
      return castOriginal.apply(this, args);
    };
  }
}
Hooks.once("init", patchItems);
Hooks.once("setup", patchItems);

// A broken weapon can't Strike. PF2e rolls every Strike through Check.roll with the weapon in the context; cancelling there means nothing is rolled or spent, and the weapon stays where it is.
// It goes through libWrapper when that is installed, so it takes its place among the other modules that wrap Check.roll, and wraps the function itself otherwise.
const blocked = (context) => {
  const item = context?.item;
  if (!isOn() || context?.type !== "attack-roll" || item?.type !== "weapon" || !hasBroken(item)) return false;
  ui.notifications.warn(`${item.name} is broken and can't be used to Strike until it is repaired. Stow it and draw another weapon.`);
  return true;
};
Hooks.once("ready", () => {
  patchItems();
  const Check = game.pf2e?.Check;
  if (!Check?.roll) return;
  if (globalThis.libWrapper?.register) {
    libWrapper.register(MODULE, "game.pf2e.Check.roll", function (wrapped, check, context = {}, ...rest) {
      return blocked(context) ? Promise.resolve(null) : wrapped(check, context, ...rest);
    }, "MIXED");
    return;
  }
  const original = Check.roll;
  Check.roll = function (check, context = {}, ...rest) {
    return blocked(context) ? Promise.resolve(null) : original.call(this, check, context, ...rest);
  };
});

const say = (item, html) => ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: item.actor }), content: `<p>${html}</p>` });
const withoutTrait = (item) => item.system.traits.value.filter((trait) => trait !== TRAIT);

// Put the trait on an item (it must be one the user can update; Makeshift runs on the GM's client). Does nothing if it already has it.
export async function breakItem(item) {
  if (hasBroken(item)) return false;
  await item.update({ "system.traits.value": [...item.system.traits.value, TRAIT] });
  return true;
}

// Take it off again.
export async function mendItem(item) {
  if (!hasBroken(item)) return false;
  await item.update({ "system.traits.value": withoutTrait(item) });
  return true;
}

// Raising an item's Hit Points above its Broken Threshold takes the trait off in the same update. Any change that raises them counts (Repair's Restore button, healing, an edit).
Hooks.on("preUpdateItem", (item, changes, options) => {
  if (!isOn() || !hasBroken(item) || !item.isOfType?.("physical")) return;
  const hp = foundry.utils.getProperty(changes, "system.hp.value");
  const { max = 0, value = 0 } = item.system.hp ?? {};
  if (typeof hp !== "number" || max <= 0 || hp <= value || hp <= Math.floor(max / 2)) return;
  foundry.utils.setProperty(changes, "system.traits.value", withoutTrait(item));
  options.mqMended = true;
});
Hooks.on("updateItem", (item, changes, options, userId) => {
  if (options?.mqMended && userId === game.user.id) say(item, `The ${item.name} is no longer broken.`);
});

// An item with no Hit Points, or Hit Points above its Broken Threshold, is mended by a successful Repair check. PF2e posts the result with a Restore button that carries the item's
// uuid; it is only posted for a success or a critical success. (An item whose Hit Points are at or below the threshold is mended by the Restore button raising them.) The GM's client does the work, since the one who repaired may not own the item.
Hooks.on("createChatMessage", async (message) => {
  if (!isOn() || !game.user.isGM || game.users.activeGM?.id !== game.user.id) return;
  const flavor = message.flavor ?? "";
  if (!/data-repair="restore"/.test(flavor)) return;
  const uuid = flavor.match(/data-item-uuid="([^"]+)"/)?.[1];
  const item = uuid ? await fromUuid(uuid) : null;
  if (!item || !hasBroken(item)) return;
  const { max = 0, value = 0 } = item.system.hp ?? {};
  if (max > 0 && value <= Math.floor(max / 2)) return;
  if (await mendItem(item)) {
    log(`Broken trait removed from ${item.name} by a Repair check`);
    await say(item, `The repair succeeds, and the ${item.name} is no longer broken.`);
  }
});
