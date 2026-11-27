// The Bite Ginger Chew action. A Ginger Chew's effect gives the character this action while it lasts (it is the Lozenge's secondary effect). Using it reduces the character's
// sickened value by 1, if they have any, and removes the effect that gave them the action, which takes the action with it: the chew becomes inert and its +1 bonus ends too.
import { itemUsed, say } from "../common/shared.js";
import { enabled, log } from "../common/settings.js";

const SLUG = "bite-ginger-chew";
const sickenedValue = (actor) => Math.max(0, ...actor.conditions.bySlug("sickened").map((c) => c.value ?? c.system?.value?.value ?? 0));

Hooks.on("createChatMessage", async (message) => {
  if (!enabled("wanderingChef")) return;
  const action = await itemUsed(message);
  if (action?.type !== "action" || action.slug !== SLUG) return;

  const actor = action.actor;
  const before = sickenedValue(actor);
  if (before > 0) await actor.decreaseCondition("sickened");
  const after = sickenedValue(actor);
  log(`Bite Ginger Chew used by ${actor.name}; sickened ${before} -> ${after}`);

  // The effect that gave the action; deleting it removes the action too. If it can't be found, look for a Ginger Chew effect on the character.
  const effect = action.grantedBy ?? actor.itemTypes.effect.find((e) => /^effect-ginger-chew-/.test(e.slug ?? ""));
  if (effect) await effect.delete();

  say(
    actor,
    before > 0
      ? `<p>${actor.name} bites the ginger chew. ${after > 0 ? `Their sickened value drops to ${after}` : "They are no longer sickened"}, and the chew becomes inert.</p>`
      : `<p>${actor.name} bites the ginger chew. They are not sickened, and the chew becomes inert.</p>`,
  );
});
