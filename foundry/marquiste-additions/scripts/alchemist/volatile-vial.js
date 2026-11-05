// The upkeep for the bomb vials. (The Quick Alchemy setting, volatileVialRules, is registered in scripts/common/settings.js.)
const MODULE = "marquiste-additions";

// An earlier version renamed each Versatile Vial to Volatile Vial. The Versatile Vial is the resource, so put any such item back.
Hooks.once("ready", async () => {
  if (game.users.activeGM?.id !== game.user.id) return;
  const actors = new Set(game.actors.contents);
  for (const scene of game.scenes) for (const token of scene.tokens) if (token.actor) actors.add(token.actor);
  for (const actor of actors) {
    for (const item of actor.items) {
      if (item.type !== "weapon" || item.slug !== "versatile-vial" || item.img !== `modules/${MODULE}/images/volatile-vial.png`) continue;
      await item.update({
        name: "Versatile Vial",
        img: "icons/consumables/potions/potion-tube-corked-green.webp",
        "system.traits.value": item.system.traits.value.filter((t) => t !== "fleeting"),
      });
    }
  }
});

// PF2e takes one off a consumable weapon's quantity each time a Strike is made with it. A vial that reaches 0 is used up, but the chat card's
// damage buttons still need the item, so it is only marked as spent here and removed later: shortly after its damage is rolled, or when the turn changes.
const BOMB_VIALS = new Set(["volatile-vial", "bomber-field-vial", "toxicologist-field-vial"]);
const SPENT = "spent";

Hooks.on("updateItem", async (item, changes, options, userId) => {
  if (userId !== game.user.id) return;
  if (!item.actor || item.type !== "weapon" || !BOMB_VIALS.has(item.slug)) return;
  const quantity = foundry.utils.getProperty(changes, "system.quantity");
  if (quantity === undefined) return;
  if (quantity === 0 && !item.getFlag(MODULE, SPENT)) await item.setFlag(MODULE, SPENT, true);
  else if (quantity > 0 && item.getFlag(MODULE, SPENT)) await item.unsetFlag(MODULE, SPENT);
});

// Once the damage for a spent vial has been rolled, remove the vial after a minute, long enough to apply the damage from the chat card.
Hooks.on("createChatMessage", async (message) => {
  if (message.author?.id !== game.user.id) return;
  if (message.flags?.pf2e?.context?.type !== "damage-roll") return;
  const uuid = message.flags.pf2e.origin?.uuid;
  if (!uuid) return;
  const item = await fromUuid(uuid);
  if (!item?.actor || !item.getFlag(MODULE, SPENT)) return;
  setTimeout(() => {
    if (item.actor?.items.has(item.id) && item.getFlag(MODULE, SPENT)) item.delete();
  }, 60000);
});

// A spent vial that was never followed by a damage roll, such as after a miss, goes when the turn changes.
Hooks.on("updateCombat", async (combat, changed) => {
  if (!("turn" in changed || "round" in changed)) return;
  if (game.users.activeGM?.id !== game.user.id) return;

  const actors = new Set(game.actors.contents);
  for (const scene of game.scenes) for (const token of scene.tokens) if (token.actor) actors.add(token.actor);
  for (const actor of actors) {
    for (const item of actor.items) {
      if (item.type === "weapon" && BOMB_VIALS.has(item.slug) && item.getFlag(MODULE, SPENT)) await item.delete();
    }
  }
});
