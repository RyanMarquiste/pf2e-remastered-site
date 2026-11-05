// Create Consumable: expend a versatile vial to create one alchemical consumable from the Alchemist's formulas, the way PF2e's Quick Alchemy does.
// The action item carries a CraftingAbility rule, so PF2e itself shows its formula picker, spends the vial and puts the item in a hand.
// This script adds the checks and the end-of-turn expiry around that.
import { MODULE, itemUsed, say } from "../common/shared.js";
import { enabled } from "../common/settings.js";
import { versatileVials } from "./alchemist.js";

const SLUG = "create-consumable";

// Called from the Quick Alchemy chooser: run the Create Consumable action through PF2e's own action flow.
export async function createConsumable(actor) {
  const action = actor.items.find((i) => i.type === "action" && i.slug === SLUG) ?? actor.items.find((i) => i.type === "action" && i.slug === "quick-alchemy");
  if (!action) {
    return ui.notifications.warn(`${actor.name} needs the Create Consumable action from the Alchemist Enhancements compendium.`);
  }
  await game.pf2e.rollItemMacro(action.uuid);
}

// PF2e opens its formula picker for the action. Refuse to go on without a versatile vial or a free hand.
Hooks.on("renderApplicationV2", (app) => {
  if (!enabled("alchemistActions") || app.constructor.name !== "FormulaPicker") return;
  const { actor, item, mode } = app.options;
  if (mode !== "craft" || item?.slug !== SLUG) return;

  if (versatileVials(actor) < 1) {
    say(actor, `<p>${actor.name} has no versatile vials left, so Create Consumable creates nothing.</p>`);
    ui.notifications.warn(`${actor.name} has no versatile vials.`);
    app.close();
  } else if (!(actor.handsFree > 0)) {
    say(actor, `<p>${actor.name} has no free hand, so Create Consumable creates nothing.</p>`);
    ui.notifications.warn(`${actor.name} needs a free hand to use Create Consumable.`);
    app.close();
  }
});

// After PF2e posts its card for the action, mark the item it created so that it can expire.
Hooks.on("createChatMessage", async (message) => {
  if (!enabled("alchemistActions")) return;
  const action = await itemUsed(message);
  if (action?.type !== "action" || action.slug !== SLUG) return;

  const holder = document.createElement("div");
  holder.innerHTML = message.content;
  const uuid = holder.querySelector("a[data-uuid]")?.dataset.uuid;
  const created = uuid ? await fromUuid(uuid) : null;
  if (!created?.actor || !created.system.temporary) return;

  const actor = action.actor;
  const combatant = game.combat?.combatants.find((c) => c.actor?.id === actor.id);
  await created.setFlag(MODULE, "createConsumable", combatant ? { combatId: game.combat.id, combatantId: combatant.id, round: game.combat.round } : { combatId: null });
});

// An item made in combat is removed when its creator's next turn begins.
Hooks.on("updateCombat", async (combat, changed) => {
  if (!("turn" in changed || "round" in changed) || !enabled("alchemistActions")) return;
  if (game.users.activeGM?.id !== game.user.id) return;

  const actors = new Set(game.actors.contents);
  for (const scene of game.scenes) for (const token of scene.tokens) if (token.actor) actors.add(token.actor);

  for (const actor of actors) {
    for (const item of actor.items) {
      const flag = item.getFlag(MODULE, "createConsumable");
      if (!flag?.combatId || flag.combatId !== combat.id) continue;
      const nextTurn = combat.round > flag.round && combat.combatant?.id === flag.combatantId;
      if (!nextTurn && combat.round <= flag.round + 1) continue;
      await item.delete();
      say(actor, `<p>${item.name} becomes inert and is gone.</p>`);
    }
  }
});
