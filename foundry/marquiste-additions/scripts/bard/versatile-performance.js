// Versatile Performance (Bard): Make an Impression, Demoralize and Impersonate with Performance as the skill. Using one of the three actions in the
// Bard Enhancements pack posts its card, and this script then rolls PF2e's own action with the Performance statistic in place of the usual skill, against the
// targeted creature. PF2e's roll options for the action (action:demoralize and so on) are kept, so effects and modifiers that look for the action still apply.
import { itemUsed } from "../common/shared.js";
import { enabled, log } from "../common/settings.js";

// The slug of each Bard action, and the PF2e action it rolls.
const ACTIONS = {
  "make-an-impression-versatile-performance": "make-an-impression",
  "demoralize-versatile-performance": "demoralize",
  "impersonate-versatile-performance": "impersonate",
};

Hooks.on("createChatMessage", async (message) => {
  if (!enabled("bardActions")) return;
  if (message.flags?.pf2e?.context) return; // a roll, not an action card
  const item = await itemUsed(message);
  const action = ACTIONS[item?.slug];
  if (!action) return;
  const actor = item.actor;
  log(`${item.name} used by ${actor.name}: rolling ${action} with Performance`);
  try {
    const roll = game.pf2e.actions.get(action);
    if (!roll) throw new Error(`PF2e has no ${action} action`);
    await roll.use({ actors: [actor], statistic: "performance" });
  } catch (error) {
    console.warn(`marquiste-additions | ${item.name} could not be rolled`, error);
    ui.notifications.warn(`${item.name} could not be rolled: ${error.message}`);
  }
});
