// Quick Cooking: the Wandering Chef's version of Quick Alchemy. Using the Quick Cooking action asks the character to choose Create Food, Create Processed Food or Flash Cook.
//   - Create Food spends one food packet and makes one alchemical food from the character's formulas. The action item carries a CraftingAbility
//     rule, so PF2e itself shows the formula picker, spends the packet and puts the item in a hand. This script adds the checks and the end-of-turn expiry.
//   - Create Processed Food is the same for foods with the Processed trait, which take 1 minute to make. It also spends a food packet and opens the formula picker
//     (limited to the processed foods the character knows). It is removed when the world clock passes the time it stays potent: its activation time when that is a length of time
//     (10 minutes, 1 hour), or a round otherwise, since it is made outside combat.
//   - Flash Cook (the Flash Cook feat) creates a Food Projectile for free; scripts/wandering-chef/flash-cook.js does that.
// Flash Cook only appears for a character who has it. Like Quick Alchemy, neither option checks for the toolkit.
import { MODULE, itemUsed, say, lifetimeStamp, activationSeconds, expireWithClock } from "../common/shared.js";
import { enabled, log } from "../common/settings.js";

const QUICK_COOKING = "quick-cooking";
const CREATE_SLUGS = ["create-food", "create-cooking-consumable"]; // the action's slug, and its earlier one
const PROCESSED = "create-processed-food";
const FLASH_SLUGS = ["flash-cook", "overcook"]; // the action's slug, and its earlier one
const FLAG = "cookConsumable";

// A Wandering Chef's food packets are a special resource PF2e links to the quantity of their Food Packet item.
export const foodPackets = (actor) => actor.getResource?.("food-packets")?.value ?? 0;

const duration = (seconds) => (seconds % 3600 === 0 ? `${seconds / 3600} hour${seconds === 3600 ? "" : "s"}` : seconds % 60 === 0 ? `${seconds / 60} minute${seconds === 60 ? "" : "s"}` : `${seconds} seconds`);

const action = (actor, ...slugs) => actor.items.find((i) => i.type === "action" && slugs.includes(i.slug));

// Small outline icons for the chooser: a flame for Flash Cook and a cooking pot for Create Food.
const svg = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex: none; vertical-align: middle; margin-right: .5em;">${inner}</svg>`;
const PROCESSED_ICON = svg('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.8 1.8M9.5 3h5"/>');
const FLASH_ICON = svg('<path d="M12 3c.6 3.6 5 5 5 10a5 5 0 0 1-10 0c0-2 .8-3.2 2-4.2.1 1.6.8 2.6 1.8 2.9C10.2 8.4 10.6 5.4 12 3z"/>');
const CONSUMABLE_ICON = svg('<path d="M4 10h16v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM2 10h20M9 6.5c0-1.2 1-1.6 1-3M14 6.5c0-1.2 1-1.6 1-3"/>');

// Run Create Food or Create Processed Food through PF2e's own action flow, which opens the formula picker.
async function createFood(actor, slugs, name) {
  const create = action(actor, ...slugs);
  if (!create) return ui.notifications.warn(`${actor.name} needs the ${name} action from the Wandering Chef Enhancements compendium.`);
  await game.pf2e.rollItemMacro(create.uuid);
}

// Using the Quick Cooking action.
Hooks.on("createChatMessage", async (message) => {
  if (!enabled("wanderingChef")) return;
  const used = await itemUsed(message);
  if (used?.type !== "action" || used.slug !== QUICK_COOKING) return;

  const actor = used.actor;
  const packets = foodPackets(actor);
  const flash = action(actor, ...FLASH_SLUGS);
  log(`Quick Cooking used by ${actor.name}; food packets: ${packets}; Flash Cook: ${!!flash}`);

  const choice = await foundry.applications.api.DialogV2.wait({
    window: { title: "Quick Cooking" },
    content:
      `<p style="margin: 0 0 .25em; text-align: center; font-size: 1.75em; font-weight: bold;">Food packets: ${packets}</p>` +
      (packets < 1 ? `<p style="margin: 0; text-align: center; font-size: 12px; opacity: .7;">Create Food and Create Processed Food need one.</p>` : ""),
    // Flash Cook is only offered to a character who has it (the Flash Cook feat gives the action).
    buttons: [
      ...(flash ? [{ action: "flash", label: "Flash Cook" }] : []),
      { action: "consumable", label: "Create Food", default: true },
      { action: "processed", label: "Create Processed Food (takes 1 minute)" },
    ],
    render: (event, dialog) => {
      for (const [name, icon] of [["consumable", CONSUMABLE_ICON], ["processed", PROCESSED_ICON], ["flash", FLASH_ICON]]) {
        dialog.element.querySelector(`button[data-action="${name}"]`)?.insertAdjacentHTML("afterbegin", icon);
      }
      const disable = (name, reason) => {
        const button = dialog.element.querySelector(`button[data-action="${name}"]`);
        if (button) {
          button.disabled = true;
          button.dataset.tooltip = reason;
        }
      };
      if (packets < 1) {
        disable("consumable", "No food packets left");
        disable("processed", "No food packets left");
      }
    },
    rejectClose: false,
  });
  if (choice === "consumable") return createFood(actor, CREATE_SLUGS, "Create Food");
  if (choice === "processed") return createFood(actor, [PROCESSED], "Create Processed Food");
  if (choice === "flash") return game.pf2e.rollItemMacro(flash.uuid);
});

// PF2e opens its formula picker for Create Food and Create Processed Food. Refuse to go on without a food packet or a free hand.
Hooks.on("renderApplicationV2", (app) => {
  if (!enabled("wanderingChef") || app.constructor.name !== "FormulaPicker") return;
  const { actor, item, mode } = app.options;
  if (mode !== "craft" || ![...CREATE_SLUGS, PROCESSED].includes(item?.slug)) return;
  const what = item.slug === PROCESSED ? "Create Processed Food" : "Create Food";

  if (foodPackets(actor) < 1) {
    say(actor, `<p>${actor.name} has no food packets left, so ${what} creates nothing.</p>`);
    ui.notifications.warn(`${actor.name} has no food packets.`);
    app.close();
  } else if (!(actor.handsFree > 0)) {
    say(actor, `<p>${actor.name} has no free hand, so ${what} creates nothing.</p>`);
    ui.notifications.warn(`${actor.name} needs a free hand to use ${what}.`);
    app.close();
  }
});

// After PF2e posts its card for Create Food, mark the item it created so that it can expire.
Hooks.on("createChatMessage", async (message) => {
  if (!enabled("wanderingChef")) return;
  const create = await itemUsed(message);
  if (create?.type !== "action" || ![...CREATE_SLUGS, PROCESSED].includes(create.slug)) return;

  const holder = document.createElement("div");
  holder.innerHTML = message.content;
  const uuid = holder.querySelector("a[data-uuid]")?.dataset.uuid;
  const created = uuid ? await fromUuid(uuid) : null;
  if (!created?.actor || !created.system.temporary) return;
  if (create.slug === PROCESSED) {
    // A processed food stays potent until the start of the next turn, or, if its activation takes a length of time (10 minutes, 1 hour), for that long. Either way the clock runs it out.
    const seconds = activationSeconds(created);
    await created.setFlag(MODULE, FLAG, lifetimeStamp(create.actor, seconds ?? CONFIG.time?.roundTime ?? 6));
    const potent = seconds ? ` It stays potent for ${duration(seconds)}.` : " It stays potent until the start of their next turn.";
    return say(create.actor, `<p>${create.actor.name} spends 1 minute preparing ${created.name}.${potent}</p>`);
  }

  await created.setFlag(MODULE, FLAG, lifetimeStamp(create.actor));
});

// An item made outside combat is removed when the world clock moves on, and every item made in a combat when it ends.
expireWithClock({ flags: [FLAG], isOn: () => enabled("wanderingChef"), text: (item) => `<p>${item.name} becomes inert and is gone.</p>` });

// An item made in combat is removed when its creator's next turn begins.
Hooks.on("updateCombat", async (combat, changed) => {
  if (!("turn" in changed || "round" in changed) || !enabled("wanderingChef")) return;
  if (game.users.activeGM?.id !== game.user.id) return; // only one client cleans up

  const actors = new Set(game.actors.contents);
  for (const scene of game.scenes) for (const token of scene.tokens) if (token.actor) actors.add(token.actor);

  for (const actor of actors) {
    for (const item of actor.items) {
      const flag = item.getFlag(MODULE, FLAG);
      if (!flag?.combatId || flag.combatId !== combat.id) continue;
      const nextTurn = combat.round > flag.round && combat.combatant?.id === flag.combatantId;
      if (!nextTurn && combat.round <= flag.round + 1) continue;
      await item.delete();
      say(actor, `<p>${item.name} becomes inert and is gone.</p>`);
    }
  }
});
