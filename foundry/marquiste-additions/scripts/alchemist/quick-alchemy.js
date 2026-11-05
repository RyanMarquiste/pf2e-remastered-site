// Quick Alchemy (Marquiste): with the Quick Alchemy setting switched on, using the Quick Alchemy (Marquiste) action asks the character to choose
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
    return ui.notifications.info("Quick Alchemy is switched off in the module settings (Alchemist), so Quick Alchemy (Marquiste) does nothing.");
  }
  const actor = feat.actor;
  const vials = versatileVials(actor);
  log(`Quick Alchemy (Marquiste) used by ${actor.name}; versatile vials: ${vials}`);

  const choice = await foundry.applications.api.DialogV2.wait({
    window: { title: "Quick Alchemy" },
    content:
      `<p>What does ${actor.name} do with Quick Alchemy?</p>` +
      `<p style="margin: 0; font-size: 12px; opacity: .6;">Versatile vials: ${vials}${vials < 1 ? ". Create Consumable needs one." : ""}</p>`,
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
