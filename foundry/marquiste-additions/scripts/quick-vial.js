// Quick Vial: an Alchemist with a free hand creates a volatile vial or the field vial for their research field, held in that hand.
import { MODULE, PACK, itemUsed, tierFor, say } from "./common.js";

const FIELD_VIALS = {
  bomber: { name: "Bomber Field Vial", tiers: true },
  chirurgeon: { name: "Chirurgeon Field Vial", tiers: true },
  mutagenist: { name: "Mutagenist Field Vial", tiers: false },
  toxicologist: { name: "Toxicologist Field Vial", tiers: true },
};

// A picker styled like PF2e's formula picker: an icon, the vial's name and traits, and a button to choose it.
async function pickVial(actor, pack, index, choices) {
  const groups = new Map();
  for (const choice of choices) {
    const entry = index.find((e) => e.name === choice.name);
    const doc = entry ? await pack.getDocument(entry._id) : null;
    if (!doc) continue;
    const traits = doc.system.traits.value
      .map((t) => game.i18n.localize(CONFIG.PF2E.weaponTraits?.[t] ?? CONFIG.PF2E.consumableTraits?.[t] ?? t))
      .map((label) => `<span class="tag">${label}</span>`)
      .join("");
    const row = `
      <li class="mqm-row">
        <img src="${doc.img}" alt="">
        <div class="mqm-text"><strong>${doc.name}</strong><div class="tags">${traits}</div></div>
        <button type="button" class="mqm-pick" data-choice="${choice.id}" data-tooltip="Create"><i class="fa-solid fa-check"></i></button>
      </li>`;
    const level = doc.system.level.value;
    groups.set(level, [...(groups.get(level) ?? []), row]);
  }
  const rows = [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([level, list]) => `<h3 class="mqm-level">Level ${level}</h3><ul class="mqm-list">${list.join("")}</ul>`)
    .join("");

  const content = `
    <style>
      .mqm-prompt { margin: 0 0 .5em; opacity: .8; }
      .mqm-level { margin: .4em 0 .2em; }
      .mqm-list { list-style: none; margin: 0; padding: 0; }
      .mqm-row { display: flex; align-items: center; gap: .6em; padding: .4em .2em; border-bottom: 1px solid rgba(128, 128, 128, .35); }
      .mqm-row img { width: 36px; height: 36px; object-fit: contain; border: none; flex: none; }
      .mqm-text { flex: 1; }
      .mqm-text .tags { display: flex; flex-wrap: wrap; gap: 2px; margin-top: 2px; }
      .mqm-pick { flex: none; width: 36px; height: 36px; padding: 0; line-height: 1; }
    </style>
    <p class="mqm-prompt">Select a vial for ${actor.name} to create with Quick Vial.</p>
    ${rows}`;

  let chosen = null;
  await foundry.applications.api.DialogV2.wait({
    window: { title: "Quick Vial", icon: "fa-solid fa-toolbox" },
    position: { width: 480 },
    content,
    buttons: [{ action: "cancel", label: "Cancel", icon: "fa-solid fa-xmark" }],
    render: (event, dialog) => {
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
  const tier = tierFor(actor.level);
  const volatileName = `Volatile Vial (${tier})`;
  const fieldName = fieldVial ? (fieldVial.tiers ? `${fieldVial.name} (${tier})` : fieldVial.name) : null;

  let choice = "volatile";
  if (fieldName) {
    choice = await pickVial(actor, pack, index, [
      { id: "volatile", name: volatileName },
      { id: "field", name: fieldName },
    ]);
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
