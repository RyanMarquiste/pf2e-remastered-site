// Flash Cook (the Flash Cook feat's option for Quick Cooking): a Wandering Chef with a free hand creates a Food Projectile, held in that hand and removed when their
// turn is over. Like Quick Vial, it does not check for the toolkit. With the Food Fight feat the projectile is stronger and the character can Strike with it
// straight away.
import { MODULE, itemUsed, say } from "../common/shared.js";
import { enabled } from "../common/settings.js";
import { tierFor } from "../alchemist/alchemist.js";

const PACK = `${MODULE}.marquiste-wandering-chef`;
const FLAG = "flashCook";
const OLD_FLAG = "overcook"; // projectiles made before the rename
const SLUGS = ["flash-cook", "overcook"]; // the action's slug, and its earlier one
const FOOD_FIGHT = "food-fight"; // the slug of the Food Fight feat

export async function flashCook(actor) {
  const pack = game.packs.get(PACK);
  if (!pack) return ui.notifications.warn("Marquiste Additions: the Wandering Chef Enhancements compendium wasn't found.");

  // The projectile is created in a hand, so one has to be free.
  if (!(actor.handsFree > 0)) {
    say(actor, `<p>${actor.name} has no free hand, so Flash Cook creates nothing.</p>`);
    return ui.notifications.warn(`${actor.name} needs a free hand to use Flash Cook.`);
  }

  const name = `Food Projectile (${tierFor(actor.level)})`;
  const entry = (await pack.getIndex()).find((e) => e.name === name);
  if (!entry) return ui.notifications.warn(`Marquiste Additions: couldn't find ${name} in the compendium.`);

  const data = (await pack.getDocument(entry._id)).toObject();
  delete data._id;

  // Food Fight: the projectile gains the deadly d8 trait and reaches 15 feet instead of 10.
  const foodFight = actor.itemTypes.feat.some((f) => f.slug === FOOD_FIGHT);
  if (foodFight) {
    data.system.range = 15;
    data.system.traits.value = [...data.system.traits.value, "deadly-d8"];
    data.system.description.value += "<p><strong>Food Fight</strong> This Food Projectile has the deadly d8 trait: on a critical hit it deals an extra d8 damage after the damage is doubled.</p>";
  }
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
      ? `<p>${actor.name} flash-cooks a spare bit of food into ${projectile.name}, held in a free hand. It falls apart at the end of this turn.</p>`
      : `<p>${actor.name} flash-cooks a spare bit of food into ${projectile.name}, held in a free hand. It falls apart at the end of the turn, so remove it yourself, as there is no combat running.</p>`,
  );

  // Food Fight: Flash Cook and Strike as part of the same action.
  if (!foodFight) return;
  const strike = actor.system.actions?.find((a) => a.item?.id === projectile.id);
  if (!strike?.variants?.length) return ui.notifications.info(`Marquiste Additions: Strike with ${projectile.name} from the Actions tab, as the Strike wasn't found.`);
  const go = await foundry.applications.api.DialogV2.confirm({
    window: { title: "Food Fight" },
    content: `<p>Strike with ${projectile.name} as part of this action?</p>`,
    rejectClose: false,
  });
  if (go) await strike.variants[0].roll();
}

// Using the Flash Cook action.
Hooks.on("createChatMessage", async (message) => {
  if (!enabled("wanderingChef")) return;
  const action = await itemUsed(message);
  if (action?.type === "action" && SLUGS.includes(action.slug)) await flashCook(action.actor);
});

// A Food Projectile made in combat is removed once its creator's turn is over.
Hooks.on("updateCombat", async (combat, changed) => {
  if (!("turn" in changed || "round" in changed) || !enabled("wanderingChef")) return;
  if (game.users.activeGM?.id !== game.user.id) return; // only one client cleans up

  const actors = new Set(game.actors.contents);
  for (const scene of game.scenes) for (const token of scene.tokens) if (token.actor) actors.add(token.actor);

  for (const actor of actors) {
    for (const item of actor.items) {
      const flag = item.getFlag(MODULE, FLAG) ?? item.getFlag(MODULE, OLD_FLAG);
      if (!flag?.combatId || flag.combatId !== combat.id) continue;
      if (combat.round === flag.round && combat.combatant?.id === flag.combatantId) continue;
      await item.delete();
      say(actor, `<p>${item.name} falls apart and is gone.</p>`);
    }
  }
});
