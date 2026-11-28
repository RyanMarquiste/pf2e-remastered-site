// An Alchemist's versatile vials as a resource that is not a weapon. PF2e's Versatile Vials class feature (and Alchemical Sciences Methodology) has a SpecialResource rule whose item is PF2e's
// Versatile Vial, a bomb, and the resource is the quantity of that item. Now that the Volatile Vial (made by Quick Vial) is the bomb, the resource is tracked by a copy that is not a weapon
// (the Versatile Vial in the Alchemist Enhancements pack: equipment, only a count). This points the rule at it:
//   - The SpecialResource rule element is extended (through PF2e's RuleElements.custom) so that a rule naming PF2e's Versatile Vial names ours instead. PF2e does the rest as it always has:
//     it creates the item when the class feature is added, sets its quantity at daily preparations and when a vial is spent, and reads the resource from it.
//   - A character who already has PF2e's Versatile Vial weapon gets ours in its place, with the same quantity and level, when the world loads (the active GM's client does it).
// Turning the setting off puts PF2e's own rule back after a reload. The id of our item is the one build.js makes from the seed "item:Versatile Vial (resource)".
import { MODULE } from "../common/shared.js";
import { enabled, log } from "../common/settings.js";

export const VERSATILE_VIAL_ID = "gIGK3zQMwyuj9mlC";
const PF2E_VIAL = "Compendium.pf2e.equipment-srd.Item.ljT5pe8D7rudJqus";
const OURS = `Compendium.${MODULE}.marquiste-alchemist-class.Item.${VERSATILE_VIAL_ID}`;

const isOn = () => {
  try {
    return enabled("versatileVialResource");
  } catch {
    return true;
  }
};

let registered = null; // the hook it was registered in: characters prepared before that still have PF2e's rule
function register(phase) {
  if (registered) return;
  const elements = game.pf2e?.RuleElements;
  const Base = elements?.custom?.SpecialResource ?? elements?.builtin?.SpecialResource;
  if (!elements?.custom || !Base) return;
  registered = phase;
  elements.custom.SpecialResource = class extends Base {
    constructor(source, options) {
      super(source?.itemUUID === PF2E_VIAL && isOn() ? { ...source, itemUUID: OURS } : source, options);
    }
  };
}
Hooks.once("init", () => register("init"));
Hooks.once("setup", () => register("setup"));

// The character's PF2e Versatile Vial weapon, if it has one.
const oldVial = (actor) => actor.itemTypes.weapon.find((item) => item.slug === "versatile-vial" && item.sourceId === PF2E_VIAL);

// Swap the weapon for the resource item, keeping its quantity, level and container.
export async function migrate(actor) {
  const old = oldVial(actor);
  if (!old) return false;
  if (actor.items.some((item) => item.sourceId === OURS)) {
    await old.delete();
    return true;
  }
  const source = (await fromUuid(OURS))?.toObject();
  if (!source) return false;
  source._stats = { ...(source._stats ?? {}), compendiumSource: OURS };
  source.system.quantity = old.quantity;
  source.system.level = { value: old.level };
  source.system.containerId = old.system.containerId ?? null;
  await actor.createEmbeddedDocuments("Item", [source]);
  await old.delete();
  log(`Versatile Vial weapon on ${actor.name} replaced by the resource item (quantity ${old.quantity})`);
  return true;
}

Hooks.once("ready", async () => {
  register("ready");
  // Registered after the characters were first prepared (the system's own setup came later than this module's): prepare them again so they read the resource from our item.
  if (registered && registered !== "init") for (const actor of game.actors) actor.reset?.();
  if (!isOn() || !game.user.isGM || game.users.activeGM?.id !== game.user.id) return;
  for (const actor of game.actors) {
    if (!["character", "npc"].includes(actor.type)) continue;
    try {
      await migrate(actor);
    } catch (error) {
      console.error(MODULE, `Could not replace the Versatile Vial on ${actor.name}`, error);
    }
  }
});
