// Quick Vial: an Alchemist with a free hand creates a volatile vial or the field vial for their research field, held in that hand.
import { MODULE, PACK, itemUsed, tierFor, say } from "./common.js";

const FIELD_VIALS = {
  bomber: { name: "Bomber Field Vial", tiers: true },
  chirurgeon: { name: "Chirurgeon Field Vial", tiers: true },
  mutagenist: { name: "Mutagenist Field Vial", tiers: false },
  toxicologist: { name: "Toxicologist Field Vial", tiers: true },
};

export async function createQuickVial(actor) {
  // The vial is created in a hand, so one has to be free.
  if (!(actor.handsFree > 0)) {
    say(actor, `<p>${actor.name} has no free hand, so Quick Vial creates nothing.</p>`);
    return ui.notifications.warn(`${actor.name} needs a free hand to use Quick Vial.`);
  }

  const pack = game.packs.get(PACK);
  if (!pack) return ui.notifications.warn("Marquiste Additions: the CorpseCap's Cauldron compendium wasn't found.");
  const index = await pack.getIndex();

  const field = actor.itemTypes.feat.find((f) => f.category === "classfeature" && f.slug in FIELD_VIALS);
  const fieldVial = field ? FIELD_VIALS[field.slug] : null;
  const tier = tierFor(actor.level);
  const volatileName = `Volatile Vial (${tier})`;
  const fieldName = fieldVial ? (fieldVial.tiers ? `${fieldVial.name} (${tier})` : fieldVial.name) : null;

  let choice = "volatile";
  if (fieldName) {
    choice = await foundry.applications.api.DialogV2.wait({
      window: { title: "Quick Vial" },
      content: `<p>Which vial does ${actor.name} create?</p>`,
      buttons: [
        { action: "volatile", label: volatileName, default: true },
        { action: "field", label: fieldName },
      ],
      rejectClose: false,
    });
    if (!choice) return;
  }

  const name = choice === "field" ? fieldName : volatileName;
  const entry = index.find((e) => e.name === name);
  if (!entry) return ui.notifications.warn(`Marquiste Additions: couldn't find ${name} in the compendium.`);

  const data = (await pack.getDocument(entry._id)).toObject();
  delete data._id;
  data.system.equipped = { carryType: "held", handsHeld: 1 };
  const combatant = game.combat?.combatants.find((c) => c.actor?.id === actor.id);
  data.flags = {
    ...data.flags,
    [MODULE]: { quickVial: combatant ? { combatId: game.combat.id, combatantId: combatant.id, round: game.combat.round } : { combatId: null } },
  };
  const [vial] = await actor.createEmbeddedDocuments("Item", [data]);
  if (!vial) return;

  say(
    actor,
    combatant
      ? `<p>${actor.name} creates ${vial.name}, held in a free hand. It becomes inert at the end of this turn.</p>`
      : `<p>${actor.name} creates ${vial.name}, held in a free hand. It becomes inert at the end of the turn, so remove it yourself, as there is no combat running.</p>`,
  );
}

// Using the Quick Vial action on its own.
Hooks.on("createChatMessage", async (message) => {
  const action = await itemUsed(message);
  if (action?.type === "action" && action.slug === "quick-vial") await createQuickVial(action.actor);
});

// A vial made in combat is removed once its creator's turn is over.
Hooks.on("updateCombat", async (combat, changed) => {
  if (!("turn" in changed || "round" in changed)) return;
  if (game.users.activeGM?.id !== game.user.id) return; // only one client cleans up

  const actors = new Set(game.actors.contents);
  for (const scene of game.scenes) for (const token of scene.tokens) if (token.actor) actors.add(token.actor);

  for (const actor of actors) {
    for (const item of actor.items) {
      const flag = item.getFlag(MODULE, "quickVial");
      if (!flag?.combatId || flag.combatId !== combat.id) continue;
      if (combat.round === flag.round && combat.combatant?.id === flag.combatantId) continue;
      await item.delete();
      say(actor, `<p>${item.name} becomes inert and is gone.</p>`);
    }
  }
});
