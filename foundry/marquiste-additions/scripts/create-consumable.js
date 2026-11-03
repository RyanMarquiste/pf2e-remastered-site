// Create Consumable: expend a versatile vial (an infused reagent) to create one alchemical consumable from the Alchemist's formulas,
// the way PF2e's Quick Alchemy does.
import { MODULE, itemUsed, versatileVials, say } from "./common.js";

export async function createConsumable(actor) {
  const vials = versatileVials(actor);
  if (vials < 1) {
    say(actor, `<p>${actor.name} has no versatile vials left, so Create Consumable creates nothing.</p>`);
    return ui.notifications.warn(`${actor.name} has no versatile vials.`);
  }

  // Alchemical consumables in the formula book at the character's level or lower.
  const formulas = (await actor.crafting.getFormulas())
    .filter((f) => f.item.traits.has("alchemical") && f.item.traits.has("consumable") && f.item.level <= actor.level)
    .sort((a, b) => a.item.level - b.item.level || a.item.name.localeCompare(b.item.name));
  if (!formulas.length) {
    return ui.notifications.warn(`${actor.name} has no alchemical consumable formulas of their level or lower.`);
  }

  const options = formulas.map((f) => `<option value="${f.item.uuid}">${f.item.name} (level ${f.item.level})</option>`).join("");
  const uuid = await foundry.applications.api.DialogV2.prompt({
    window: { title: "Create Consumable" },
    content:
      `<p>${actor.name} expends one versatile vial (${vials} left) to create an item.</p>` +
      `<div class="form-group"><label>Formula</label><div class="form-fields"><select name="formula">${options}</select></div></div>`,
    ok: { label: "Create", callback: (event, button) => button.form.elements.formula.value },
    rejectClose: false,
  });
  if (!uuid) return;

  const formula = formulas.find((f) => f.item.uuid === uuid);
  const source = formula.item.toObject();
  source.system.quantity = 1;
  source.system.size = actor.size === "tiny" ? "tiny" : "med";
  source.system.traits.value.push("infused");
  source.system.temporary = true;
  const combatant = game.combat?.combatants.find((c) => c.actor?.id === actor.id);
  source.flags = {
    ...source.flags,
    [MODULE]: { createConsumable: combatant ? { combatId: game.combat.id, combatantId: combatant.id, round: game.combat.round } : { combatId: null } },
  };

  if (!(await actor.addToInventory(source))) return ui.notifications.warn("Marquiste Additions: couldn't add the item to the inventory.");
  await actor.updateResource("infused-reagents", vials - 1);

  say(
    actor,
    `<p>${actor.name} expends a versatile vial to create ${formula.item.name}. It must be activated before the start of their next turn or it becomes inert.</p>`,
  );
}

// Using the Create Consumable action on its own.
Hooks.on("createChatMessage", async (message) => {
  const action = await itemUsed(message);
  if (action?.type === "action" && action.slug === "create-consumable") await createConsumable(action.actor);
});

// An item made in combat is removed when its creator's next turn begins.
Hooks.on("updateCombat", async (combat, changed) => {
  if (!("turn" in changed || "round" in changed)) return;
  if (game.users.activeGM?.id !== game.user.id) return;

  const actors = new Set(game.actors.contents);
  for (const scene of game.scenes) for (const token of scene.tokens) if (token.actor) actors.add(token.actor);

  for (const actor of actors) {
    for (const item of actor.items) {
      const flag = item.getFlag(MODULE, "createConsumable");
      if (!flag?.combatId || flag.combatId !== combat.id) continue;
      const nextTurn = combat.round > flag.round && combat.combatant?.id === flag.combatantId;
      if (!nextTurn && combat.round <= flag.round + 1) continue;
      await item.delete();
      say(actor, `<p>${item.name} becomes inert and is gone.</p>`);
    }
  }
});
