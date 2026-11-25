// Overcook (the Overcooked feat's option for Quick Alchemy): a Wandering Chef with a free hand creates a Food Projectile, held in that hand and removed when their
// turn is over. Like Quick Vial, it does not check for the alchemist's toolkit.
import { MODULE, itemUsed, say } from "../common/shared.js";
import { enabled } from "../common/settings.js";
import { tierFor } from "../alchemist/alchemist.js";

const PACK = `${MODULE}.marquiste-wandering-chef`;
const FLAG = "overcook";

export async function overcook(actor) {
  const pack = game.packs.get(PACK);
  if (!pack) return ui.notifications.warn("Marquiste Additions: the Wandering Chef Enhancements compendium wasn't found.");

  // The projectile is created in a hand, so one has to be free.
  if (!(actor.handsFree > 0)) {
    say(actor, `<p>${actor.name} has no free hand, so Overcook creates nothing.</p>`);
    return ui.notifications.warn(`${actor.name} needs a free hand to use Overcook.`);
  }

  const name = `Food Projectile (${tierFor(actor.level)})`;
  const entry = (await pack.getIndex()).find((e) => e.name === name);
  if (!entry) return ui.notifications.warn(`Marquiste Additions: couldn't find ${name} in the compendium.`);

  const data = (await pack.getDocument(entry._id)).toObject();
  delete data._id;
  data.system.equipped = { carryType: "held", handsHeld: 1 };
  const combatant = game.combat?.combatants.find((c) => c.actor?.id === actor.id);
  data.flags = {
    ...data.flags,
    [MODULE]: { [FLAG]: combatant ? { combatId: game.combat.id, combatantId: combatant.id, round: game.combat.round } : { combatId: null } },
  };
  const [projectile] = await actor.createEmbeddedDocuments("Item", [data]);
  if (!projectile) return;

  say(
    actor,
    combatant
      ? `<p>${actor.name} overcooks a spare bit of food into ${projectile.name}, held in a free hand. It falls apart at the end of this turn.</p>`
      : `<p>${actor.name} overcooks a spare bit of food into ${projectile.name}, held in a free hand. It falls apart at the end of the turn, so remove it yourself, as there is no combat running.</p>`,
  );
}

// Using the Overcook action.
Hooks.on("createChatMessage", async (message) => {
  if (!enabled("wanderingChef")) return;
  const action = await itemUsed(message);
  if (action?.type === "action" && action.slug === "overcook") await overcook(action.actor);
});

// A Food Projectile made in combat is removed once its creator's turn is over.
Hooks.on("updateCombat", async (combat, changed) => {
  if (!("turn" in changed || "round" in changed) || !enabled("wanderingChef")) return;
  if (game.users.activeGM?.id !== game.user.id) return; // only one client cleans up

  const actors = new Set(game.actors.contents);
  for (const scene of game.scenes) for (const token of scene.tokens) if (token.actor) actors.add(token.actor);

  for (const actor of actors) {
    for (const item of actor.items) {
      const flag = item.getFlag(MODULE, FLAG);
      if (!flag?.combatId || flag.combatId !== combat.id) continue;
      if (combat.round === flag.round && combat.combatant?.id === flag.combatantId) continue;
      await item.delete();
      say(actor, `<p>${item.name} falls apart and is gone.</p>`);
    }
  }
});
