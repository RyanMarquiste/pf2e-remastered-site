// Optional house rule: swap PF2e's Versatile Vial for the Volatile Vial from CorpseCap's Cauldron.
const MODULE = "marquiste-additions";
const PACK = `${MODULE}.corpsecaps-cauldron`;
const SETTING = "volatileVialRules";

Hooks.once("init", () => {
  game.settings.register(MODULE, SETTING, {
    name: "Use the Volatile Vial house rules",
    hint:
      "When a Versatile Vial is added to a character, replace it with the matching tier of Volatile Vial from CorpseCap's Cauldron, keeping the quantity. " +
      "Switching this off does not change vials already swapped. The revised Quick Alchemy is the Quick Alchemy (House Rule) feat in the same compendium.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });
});

// The tier follows the old vial's item level (1, 4, 12 or 18), the levels the Volatile Vial tiers use.
const tierFor = (level) => (level >= 18 ? "Major" : level >= 12 ? "Greater" : level >= 4 ? "Moderate" : "Lesser");

Hooks.on("createItem", async (item) => {
  if (!game.settings.get(MODULE, SETTING)) return;
  if (game.users.activeGM?.id !== game.user.id) return; // only one client does the swap
  const actor = item.actor;
  if (!actor || item.type !== "weapon" || item.slug !== "versatile-vial") return;

  const pack = game.packs.get(PACK);
  if (!pack) return ui.notifications.warn("Marquiste Additions: the CorpseCap's Cauldron compendium wasn't found.");
  const name = `Volatile Vial (${tierFor(item.level)})`;
  const entry = (await pack.getIndex()).find((e) => e.name === name);
  if (!entry) return ui.notifications.warn(`Marquiste Additions: couldn't find ${name} in the compendium.`);

  const data = (await pack.getDocument(entry._id)).toObject();
  delete data._id;
  data.system.quantity = item.quantity;
  if (item.system.equipped) data.system.equipped = foundry.utils.deepClone(item.system.equipped);

  await actor.createEmbeddedDocuments("Item", [data]);
  await item.delete();
});
