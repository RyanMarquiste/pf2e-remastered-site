// The house-rule Quick Alchemy: with the Volatile Vial house rules switched on, using the Quick Alchemy (House Rule) action asks the
// character to choose Quick Vial or Create Consumable. Create Consumable is only offered while they have a versatile vial left.
import { MODULE, itemUsed } from "../common/shared.js";
import { SETTING, QUICK_VIAL_ICON, CONSUMABLE_ICON, versatileVials } from "./alchemist.js";
import { createQuickVial } from "./quick-vial.js";
import { createConsumable } from "./create-consumable.js";

Hooks.on("createChatMessage", async (message) => {
  const feat = await itemUsed(message);
  if (!feat || (feat.slug !== "quick-alchemy-house-rule" && feat.name !== "Quick Alchemy (House Rule)")) return;
  if (!game.settings.get(MODULE, SETTING)) {
    return ui.notifications.info("The Volatile Vial house rules are switched off in the module settings, so Quick Alchemy (House Rule) does nothing.");
  }
  const actor = feat.actor;
  console.debug(`${MODULE} | Quick Alchemy (House Rule) used by ${actor.name}; versatile vials: ${versatileVials(actor)}`);

  // With no versatile vial left there is nothing to choose: Quick Vial is the only option.
  if (versatileVials(actor) < 1) return createQuickVial(actor);

  const choice = await foundry.applications.api.DialogV2.wait({
    window: { title: "Quick Alchemy" },
    content: `<p>What does ${actor.name} do with Quick Alchemy?</p>`,
    buttons: [
      { action: "vial", label: "Quick Vial", default: true },
      { action: "consumable", label: "Create Consumable" },
    ],
    render: (event, dialog) => {
      // Put the small icons in front of the button labels.
      for (const [action, icon] of [["vial", QUICK_VIAL_ICON], ["consumable", CONSUMABLE_ICON]]) {
        dialog.element.querySelector(`button[data-action="${action}"]`)?.insertAdjacentHTML("afterbegin", icon);
      }
    },
    rejectClose: false,
  });
  if (choice === "vial") return createQuickVial(actor);
  if (choice === "consumable") return createConsumable(actor);
});
