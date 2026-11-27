// The Bite Cinnamon Seers action. A Cinnamon Seers effect gives the character this reaction while it lasts (it is the Lozenge's secondary effect). Using it rerolls the character's
// latest Recall Knowledge check (PF2e's own reroll, keeping the new result), removes the effect that gave them the action, which takes the action and the bonus with it, and gives
// them the Cinnamon Seers Immunity effect, which ends at their next daily preparations (resting for the night). The seer is spent whenever the reaction is used; if there is no check
// to reroll, the latest was already rerolled, or a lesser seer's chosen skill isn't the one it used, the chat card says nothing was rerolled.
import { itemUsed, MODULE, say } from "../common/shared.js";
import { enabled, log } from "../common/settings.js";

const SLUG = "bite-cinnamon-seers";
const IMMUNE_SLUG = "effect-cinnamon-seers-immunity";
const skillName = (slug) => (slug === "lore-skill-check" ? "Lore" : slug.charAt(0).toUpperCase() + slug.slice(1));
const isRecallKnowledge = (message) => {
  const context = message.flags?.pf2e?.context;
  return context?.type === "skill-check" && (context.options ?? []).includes("action:recall-knowledge");
};

// The character's most recent Recall Knowledge check, if it hasn't been rerolled already.
const latestCheck = (actor) => game.messages.contents.findLast((message) => message.actor?.id === actor.id && isRecallKnowledge(message));

Hooks.on("createChatMessage", async (message) => {
  if (!enabled("wanderingChef")) return;
  const action = await itemUsed(message);
  if (action?.type !== "action" || action.slug !== SLUG) return;

  const actor = action.actor;
  // The effect that gave the action; deleting it removes the action too. If it can't be found, look for a Cinnamon Seers effect on the character.
  const effect = action.grantedBy ?? actor.itemTypes.effect.find((e) => /^effect-cinnamon-seers-(lesser|moderate|greater)$/.test(e.slug ?? ""));

  // Using the reaction spends the seer, whether or not there is anything to reroll, so the effect, the action and the bonus go and the immunity comes. The reroll is the part that
  // depends on the check; when it can't happen the chat card says why.
  if (effect) await effect.delete().catch((error) => console.error(MODULE, "Bite Cinnamon Seers could not remove the effect", error));
  if (!actor.itemTypes.effect.some((e) => e.slug === IMMUNE_SLUG)) {
    const source = await findImmunity();
    if (source) await actor.createEmbeddedDocuments("Item", [source.toObject()]);
    else console.warn(MODULE, "The Cinnamon Seers Immunity effect was not found in the Wandering Chef pack");
  }

  // A lesser seer sharpens the skill chosen when it was activated, and rerolls only a check with that skill. The choice is a roll domain of the check: the skill's slug, or
  // lore-skill-check for any Lore skill.
  const chosen = effect?.flags?.pf2e?.rulesSelections?.skill;
  const check = latestCheck(actor);
  let result;
  if (!check) result = "there was no Recall Knowledge check to reroll";
  else if (check.flags.pf2e.context.isReroll) result = "their latest Recall Knowledge check had already been rerolled";
  else if (chosen && !(check.flags.pf2e.context.domains ?? []).includes(chosen)) result = `their seer only rerolls a ${skillName(chosen)} check, and their latest Recall Knowledge check used another skill`;
  else {
    try {
      await game.pf2e.Check.rerollFromMessage(check);
      result = "reroll";
    } catch (error) {
      console.error(MODULE, "Bite Cinnamon Seers could not reroll the check", error);
      result = "the reroll failed (the console has the error)";
    }
  }
  log(`Bite Cinnamon Seers used by ${actor.name}; ${result === "reroll" ? `rerolled ${check.id}` : result}`);

  const spent = "The seer becomes inert, and they are immune to cinnamon seers until their next daily preparations.";
  say(
    actor,
    result === "reroll"
      ? `<p>${actor.name} bites the cinnamon seer and rerolls their Recall Knowledge check. ${spent}</p>`
      : `<p>${actor.name} bites the cinnamon seer, but ${result}, so nothing is rerolled. ${spent}</p>`,
  );
});

// The immunity effect lives in the Wandering Chef pack.
async function findImmunity() {
  const pack = game.packs.get(`${MODULE}.marquiste-wandering-chef`);
  const entry = (await pack?.getIndex({ fields: ["system.slug"] }))?.find((e) => e.system?.slug === IMMUNE_SLUG);
  return entry ? pack.getDocument(entry._id) : null;
}

// Resting for the night is daily preparations: the immunity ends.
Hooks.on("pf2e.restForTheNight", async (actor) => {
  const effects = actor.itemTypes.effect.filter((e) => e.slug === IMMUNE_SLUG);
  if (effects.length) await actor.deleteEmbeddedDocuments("Item", effects.map((e) => e.id));
});
