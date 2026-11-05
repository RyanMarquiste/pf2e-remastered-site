// Infused poisons end at daily preparations. An injury poison an alchemist made carries the infused trait onto the weapon it is applied to (see
// scripts/common/injury-poisons.js), and PF2e's Infused trait says non-permanent effects from infused items end at the next daily preparations. PF2e
// already deletes the infused items themselves then, but it knows nothing about the poison on a weapon, so this removes that effect.
import { say } from "../common/shared.js";
import { enabled } from "../common/settings.js";
import { poisonName } from "../common/weapon-poison.js";

const isInfusedPoison = (effect) => {
  const traits = effect.system.traits.value;
  return traits.includes("infused") && traits.includes("injury") && traits.includes("poison");
};

async function endInfusedPoisons(actor) {
  if (!enabled("infusedPoisonsEnd")) return;
  const effects = actor.itemTypes.effect.filter(isInfusedPoison);
  if (!effects.length) return;
  const notes = effects.map((effect) => {
    const weaponId = effect.getFlag("marquiste-additions", "injuryPoison")?.weapon ?? effect.flags.pf2e?.rulesSelections?.weapon;
    const weapon = weaponId ? actor.items.get(weaponId) : null;
    return `<p>The ${poisonName(effect)}${weapon ? ` on ${weapon.name}` : ""} becomes inert with ${actor.name}'s daily preparations.</p>`;
  });
  await actor.deleteEmbeddedDocuments("Item", effects.map((e) => e.id));
  await say(actor, notes.join(""));
}

// Resting for the night, which is when PF2e makes daily preparations (it fires this on the client that rests).
Hooks.on("pf2e.restForTheNight", (actor) => endInfusedPoisons(actor));

// The Reset Daily Crafting button on the Crafting tab. PF2e removes the infused items then and marks daily crafting as not complete.
Hooks.on("updateActor", (actor, changes, options, userId) => {
  if (userId !== game.user.id) return;
  if (foundry.utils.getProperty(changes, "flags.pf2e.dailyCraftingComplete") === false) endInfusedPoisons(actor);
});
