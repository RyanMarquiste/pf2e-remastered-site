// Quick Cooking: the Wandering Chef's version of Quick Alchemy. Using the Quick Cooking action asks the character to choose Create Consumable or Overcook.
//   - Create Consumable (Cooking) spends one food packet and makes one alchemical food from the character's formulas. The action item carries a CraftingAbility
//     rule, so PF2e itself shows the formula picker, spends the packet and puts the item in a hand. This script adds the checks and the end-of-turn expiry.
//   - Overcook (the Overcooked feat) creates a Food Projectile for free; scripts/wandering-chef/overcook.js does that.
// Like Quick Alchemy, neither option checks for the toolkit.
import { MODULE, itemUsed, say } from "../common/shared.js";
import { enabled, log } from "../common/settings.js";

const QUICK_COOKING = "quick-cooking";
const CREATE = "create-cooking-consumable";
const OVERCOOK = "overcook";
const FLAG = "cookConsumable";

// A Wandering Chef's food packets are a special resource PF2e links to the quantity of their Food Packet item.
export const foodPackets = (actor) => actor.getResource?.("food-packets")?.value ?? 0;

const action = (actor, slug) => actor.items.find((i) => i.type === "action" && i.slug === slug);

// Small outline icons for the chooser: a flame for Overcook and a cooking pot for Create Consumable.
const svg = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex: none; vertical-align: middle; margin-right: .5em;">${inner}</svg>`;
const OVERCOOK_ICON = svg('<path d="M12 3c.6 3.6 5 5 5 10a5 5 0 0 1-10 0c0-2 .8-3.2 2-4.2.1 1.6.8 2.6 1.8 2.9C10.2 8.4 10.6 5.4 12 3z"/>');
const CONSUMABLE_ICON = svg('<path d="M4 10h16v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM2 10h20M9 6.5c0-1.2 1-1.6 1-3M14 6.5c0-1.2 1-1.6 1-3"/>');

// Run Create Consumable (Cooking) through PF2e's own action flow, which opens the formula picker.
async function createConsumable(actor) {
  const create = action(actor, CREATE);
  if (!create) return ui.notifications.warn(`${actor.name} needs the Create Consumable (Cooking) action from the Wandering Chef Enhancements compendium.`);
  await game.pf2e.rollItemMacro(create.uuid);
}

// Using the Quick Cooking action.
Hooks.on("createChatMessage", async (message) => {
  if (!enabled("wanderingChef")) return;
  const used = await itemUsed(message);
  if (used?.type !== "action" || used.slug !== QUICK_COOKING) return;

  const actor = used.actor;
  const packets = foodPackets(actor);
  const overcook = action(actor, OVERCOOK);
  log(`Quick Cooking used by ${actor.name}; food packets: ${packets}; Overcook: ${!!overcook}`);

  const choice = await foundry.applications.api.DialogV2.wait({
    window: { title: "Quick Cooking" },
    content:
      `<p>What does ${actor.name} do with Quick Cooking?</p>` +
      `<p style="margin: 0; font-size: 12px; opacity: .6;">Food packets: ${packets}${packets < 1 ? ". Create Consumable needs one." : ""}</p>`,
    buttons: [
      { action: "consumable", label: "Create Consumable", default: true },
      { action: "overcook", label: "Overcook" },
    ],
    render: (event, dialog) => {
      for (const [name, icon] of [["consumable", CONSUMABLE_ICON], ["overcook", OVERCOOK_ICON]]) {
        dialog.element.querySelector(`button[data-action="${name}"]`)?.insertAdjacentHTML("afterbegin", icon);
      }
      const disable = (name, reason) => {
        const button = dialog.element.querySelector(`button[data-action="${name}"]`);
        if (button) {
          button.disabled = true;
          button.dataset.tooltip = reason;
        }
      };
      if (packets < 1) disable("consumable", "No food packets left");
      if (!overcook) disable("overcook", "Needs the Overcooked feat");
    },
    rejectClose: false,
  });
  if (choice === "consumable") return createConsumable(actor);
  if (choice === "overcook") return game.pf2e.rollItemMacro(overcook.uuid);
});

// PF2e opens its formula picker for Create Consumable (Cooking). Refuse to go on without a food packet or a free hand.
Hooks.on("renderApplicationV2", (app) => {
  if (!enabled("wanderingChef") || app.constructor.name !== "FormulaPicker") return;
  const { actor, item, mode } = app.options;
  if (mode !== "craft" || item?.slug !== CREATE) return;

  if (foodPackets(actor) < 1) {
    say(actor, `<p>${actor.name} has no food packets left, so Create Consumable creates nothing.</p>`);
    ui.notifications.warn(`${actor.name} has no food packets.`);
    app.close();
  } else if (!(actor.handsFree > 0)) {
    say(actor, `<p>${actor.name} has no free hand, so Create Consumable creates nothing.</p>`);
    ui.notifications.warn(`${actor.name} needs a free hand to use Create Consumable.`);
    app.close();
  }
});

// After PF2e posts its card for Create Consumable (Cooking), mark the item it created so that it can expire.
Hooks.on("createChatMessage", async (message) => {
  if (!enabled("wanderingChef")) return;
  const create = await itemUsed(message);
  if (create?.type !== "action" || create.slug !== CREATE) return;

  const holder = document.createElement("div");
  holder.innerHTML = message.content;
  const uuid = holder.querySelector("a[data-uuid]")?.dataset.uuid;
  const created = uuid ? await fromUuid(uuid) : null;
  if (!created?.actor || !created.system.temporary) return;

  const combatant = game.combat?.combatants.find((c) => c.actor?.id === create.actor.id);
  await created.setFlag(MODULE, FLAG, combatant ? { combatId: game.combat.id, combatantId: combatant.id, round: game.combat.round } : { combatId: null });
});

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
