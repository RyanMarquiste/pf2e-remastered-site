// Quick Vial: an Alchemist with a free hand creates a volatile vial or the field vial for their research field, held in that hand.
import { MODULE, PACK, itemUsed, say } from "./common.js";

const TIERS = [
  { name: "Lesser", level: 1 },
  { name: "Moderate", level: 4 },
  { name: "Greater", level: 12 },
  { name: "Major", level: 18 },
];

const FIELD_VIALS = {
  bomber: { name: "Bomber Field Vial", tiers: true },
  chirurgeon: { name: "Chirurgeon Field Vial", tiers: true },
  mutagenist: { name: "Mutagenist Field Vial", tiers: false },
  toxicologist: { name: "Toxicologist Field Vial", tiers: true },
};

// A picker styled like PF2e's formula picker: an icon, the vial's name and traits, and a button to choose it. Returns the chosen name.
async function pickVial(actor, pack, index, names) {
  const rows = [];
  for (const name of names) {
    const entry = index.find((e) => e.name === name);
    const doc = entry ? await pack.getDocument(entry._id) : null;
    if (!doc) continue;
    const traits = doc.system.traits.value
      .map((t) => game.i18n.localize(CONFIG.PF2E.weaponTraits?.[t] ?? CONFIG.PF2E.consumableTraits?.[t] ?? t))
      .map((label) => `<span class="tag">${label}</span>`)
      .join("");
    rows.push(`
      <li style="display: flex; align-items: center; gap: .6em; padding: .4em .2em; border-bottom: 1px solid rgba(128, 128, 128, .35);">
        <img src="${doc.img}" alt="" style="width: 36px; height: 36px; max-width: 36px; flex: none; object-fit: contain; border: none;">
        <div style="flex: 1;"><strong>${doc.name}</strong><div class="tags" style="display: flex; flex-wrap: wrap; gap: 2px; margin-top: 2px;">${traits}</div></div>
        <button type="button" data-choice="${doc.name}" data-tooltip="Create" style="flex: none; width: 36px; height: 36px; margin: 0; padding: 0; line-height: 1;"><i class="fa-solid fa-check"></i></button>
      </li>`);
  }

  const content = `
    <p style="margin: 0 0 .5em; opacity: .8;">Select a vial for ${actor.name} to create with Quick Vial.</p>
    <ul style="list-style: none; margin: 0; padding: 0;">${rows.join("")}</ul>`;

  let chosen = null;
  await foundry.applications.api.DialogV2.wait({
    window: { title: "Quick Vial", icon: "fa-solid fa-toolbox" },
    position: { width: 480 },
    content,
    buttons: [{ action: "cancel", label: "Cancel" }],
    render: (event, dialog) => {
      // The list is short and the window can be closed, so the Cancel button is not shown.
      dialog.element.querySelector(".form-footer")?.remove();
      for (const button of dialog.element.querySelectorAll("[data-choice]")) {
        button.addEventListener("click", () => {
          chosen = button.dataset.choice;
          dialog.close();
        });
      }
    },
    rejectClose: false,
  });
  return chosen;
}

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

  // Every vial the character can make at their level: a volatile vial, and the research field's vial, for each tier up to their own.
  const tiers = TIERS.filter((t) => t.level <= actor.level).reverse();
  const names = fieldVial?.tiers
    ? tiers.flatMap((t) => [`Volatile Vial (${t.name})`, `${fieldVial.name} (${t.name})`])
    : tiers.map((t) => `Volatile Vial (${t.name})`);
  if (fieldVial && !fieldVial.tiers) names.push(fieldVial.name);

  const name = names.length > 1 ? await pickVial(actor, pack, index, names) : names[0];
  if (!name) return;

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
