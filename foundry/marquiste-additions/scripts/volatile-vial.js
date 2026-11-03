// Optional house rule: PF2e's Versatile Vial becomes the Volatile Vial.
const MODULE = "marquiste-additions";
const SETTING = "volatileVialRules";

Hooks.once("init", () => {
  game.settings.register(MODULE, SETTING, {
    name: "Use the Volatile Vial house rules",
    hint:
      "Renames each character's Versatile Vial to Volatile Vial and gives it the Fleeting trait, and lets Quick Alchemy (House Rule) offer Quick Vial or Create Consumable. " +
      "The vial stays the same item, so the character's versatile vial count keeps working. Switching this off does not rename vials already changed.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: () => convertAll(),
  });
});

// The vial is updated in place rather than replaced: PF2e counts an Alchemist's versatile vials from the quantity of the item it created,
// so a replacement item would stop being counted. Its slug stays versatile-vial so the research field rules still apply to it.
async function convert(item) {
  if (!game.settings.get(MODULE, SETTING)) return;
  if (game.users.activeGM?.id !== game.user.id) return; // only one client does the renaming
  if (!item.actor || item.type !== "weapon" || item.slug !== "versatile-vial" || item.name === "Volatile Vial") return;

  const traits = new Set(item.system.traits.value);
  traits.add("fleeting");
  await item.update({
    name: "Volatile Vial",
    img: `modules/${MODULE}/images/volatile-vial.png`,
    "system.traits.value": [...traits],
  });
}

async function convertAll() {
  const actors = new Set(game.actors.contents);
  for (const scene of game.scenes) for (const token of scene.tokens) if (token.actor) actors.add(token.actor);
  for (const actor of actors) for (const item of actor.items) await convert(item);
}

Hooks.on("createItem", (item) => convert(item));
Hooks.once("ready", () => convertAll());

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
