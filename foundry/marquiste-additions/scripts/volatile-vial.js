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

// PF2e takes one off a consumable weapon's quantity each time a Strike is made with it. A vial that reaches 0 is used up, so remove it
// instead of leaving an empty entry behind. Only the user who made the Strike runs this.
const BOMB_VIALS = new Set(["volatile-vial", "bomber-field-vial", "toxicologist-field-vial"]);

Hooks.on("updateItem", async (item, changes, options, userId) => {
  if (userId !== game.user.id) return;
  if (!item.actor || item.type !== "weapon" || !BOMB_VIALS.has(item.slug)) return;
  if (foundry.utils.getProperty(changes, "system.quantity") !== 0) return;
  await item.delete();
});
