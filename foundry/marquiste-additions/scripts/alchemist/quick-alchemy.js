// Quick Alchemy (the Marquiste action): with the Quick Alchemy setting switched on, using that action asks the character to choose
// Quick Vial or Create Consumable. Create Consumable is shown but cannot be chosen while they have no versatile vial left.
import { MODULE, itemUsed } from "../common/shared.js";
import { enabled, log } from "../common/settings.js";
import { SETTING, QUICK_VIAL_ICON, CONSUMABLE_ICON, versatileVials } from "./alchemist.js";
import { createQuickVial } from "./quick-vial.js";
import { createConsumable } from "./create-consumable.js";

// Characters who already have the action under its earlier name (Quick Alchemy (House Rule)) keep working.
const SLUGS = ["quick-alchemy-marquiste", "quick-alchemy-house-rule"];
const NAMES = ["Quick Alchemy (Marquiste)", "Quick Alchemy (House Rule)"];

Hooks.on("createChatMessage", async (message) => {
  if (!enabled("alchemistActions")) return;
  const feat = await itemUsed(message);
  if (!feat || !(SLUGS.includes(feat.slug) || NAMES.includes(feat.name))) return;
  if (!game.settings.get(MODULE, SETTING)) {
    return ui.notifications.info("Quick Alchemy is switched off in the module settings (Alchemist), so the Marquiste Quick Alchemy action does nothing.");
  }
  const actor = feat.actor;
  const vials = versatileVials(actor);
  log(`Quick Alchemy (Marquiste action) used by ${actor.name}; versatile vials: ${vials}`);

  const choice = await foundry.applications.api.DialogV2.wait({
    window: { title: "Quick Alchemy" },
    content:
      `<p style="margin: 0 0 .25em; text-align: center; font-size: 1.75em; font-weight: bold;">Versatile vials: ${vials}</p>` +
      (vials < 1 ? `<p style="margin: 0; text-align: center; font-size: 12px; opacity: .7;">Create Consumable needs one.</p>` : ""),
    buttons: [
      { action: "vial", label: "Quick Vial", default: true },
      { action: "consumable", label: "Create Consumable" },
    ],
    render: (event, dialog) => {
      // Put the small icons in front of the button labels.
      for (const [action, icon] of [["vial", QUICK_VIAL_ICON], ["consumable", CONSUMABLE_ICON]]) {
        dialog.element.querySelector(`button[data-action="${action}"]`)?.insertAdjacentHTML("afterbegin", icon);
      }
      // With no versatile vial left, Create Consumable can't be chosen.
      if (vials < 1) {
        const button = dialog.element.querySelector('button[data-action="consumable"]');
        if (button) {
          button.disabled = true;
          button.dataset.tooltip = "No versatile vials left";
        }
      }
    },
    rejectClose: false,
  });
  if (choice === "vial") return createQuickVial(actor);
  if (choice === "consumable") return createConsumable(actor);
});
