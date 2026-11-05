// Quick Vial: an Alchemist with a free hand creates a volatile vial or the field vial for their research field, held in that hand.
import { MODULE, itemUsed, say } from "../common/shared.js";
import { enabled } from "../common/settings.js";
import { PACK } from "./alchemist.js";
import { pickRow, coatableWeapons, pickWeapon } from "../common/weapon-picker.js";
import { claimWeapon } from "../common/weapon-poison.js";

// The Toxicologist's coatings are effects in the same pack; their names start with this.
const EFFECT_PREFIX = "Effect: ";

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

// The vials and coatings the character can make, from compendium names grouped by entry (best tier first within a group).
async function pickVial(actor, pack, index, groups) {
  const rows = [];
  for (const group of groups) {
    for (const [position, name] of group.names.entries()) {
      const entry = index.find((e) => e.name === name);
      const doc = entry ? await pack.getDocument(entry._id) : null;
      if (!doc) continue;
      rows.push({ value: doc.name, name: doc.name.replace(EFFECT_PREFIX, ""), img: doc.img, traits: doc.system.traits.value, extra: position > 0 });
    }
  }
  return pickRow({ title: "Quick Vial", prompt: `Select a vial for ${actor.name} to create with Quick Vial.`, rows });
}

export async function createQuickVial(actor) {
  const pack = game.packs.get(PACK);
  if (!pack) return ui.notifications.warn("Marquiste Additions: the Alchemist Enhancements compendium wasn't found.");
  const index = await pack.getIndex();

  const field = actor.itemTypes.feat.find((f) => f.category === "classfeature" && f.slug in FIELD_VIALS);
  const fieldVial = field ? FIELD_VIALS[field.slug] : null;

  // Every vial the character can make at their level, grouped so each group lists its tiers from the best down.
  const tiers = TIERS.filter((t) => t.level <= actor.level).reverse();
  const groups = [{ names: tiers.map((t) => `Volatile Vial (${t.name})`) }];
  if (fieldVial?.tiers) groups.push({ names: tiers.map((t) => `${fieldVial.name} (${t.name})`) });
  else if (fieldVial) groups.push({ names: [fieldVial.name] });

  // A Toxicologist can also coat a weapon instead of making a vial: Toxic Coating, and Advanced Toxic Coating from 11th level.
  if (field?.slug === "toxicologist") {
    groups.push({ names: tiers.map((t) => `${EFFECT_PREFIX}Toxic Coating (${t.name})`) });
    if (actor.level >= 11) groups.push({ names: tiers.map((t) => `${EFFECT_PREFIX}Advanced Toxic Coating (${t.name})`) });
  }
  const names = groups.flatMap((g) => g.names);

  const name = names.length > 1 ? await pickVial(actor, pack, index, groups) : names[0];
  if (!name) return;

  const entry = index.find((e) => e.name === name);
  if (!entry) return ui.notifications.warn(`Marquiste Additions: couldn't find ${name} in the compendium.`);

  const data = (await pack.getDocument(entry._id)).toObject();
  delete data._id;

  // A coating is an effect on the character, not an item to hold.
  if (name.startsWith(EFFECT_PREFIX)) {
    const weapons = coatableWeapons(actor);
    if (!weapons.length) {
      say(actor, `<p>${actor.name} has no weapon they are holding or wearing that deals piercing or slashing damage, so there is nothing to coat.</p>`);
      return ui.notifications.warn(`${actor.name} has no held or worn weapon that deals piercing or slashing damage.`);
    }
    const weapon = await pickWeapon(actor, weapons, { verb: "coats", title: "Quick Vial" });
    if (!weapon) return;
    // A weapon carries one poison at a time: if it already has one, ask before replacing it.
    if (!(await claimWeapon(actor, weapon, name.replace(EFFECT_PREFIX, "")))) return;

    // Choose the weapon in the effect's own prompt for the character, so PF2e doesn't ask again.
    const choice = data.system.rules.find((r) => r.key === "ChoiceSet");
    if (choice) choice.selection = weapon.id;
    const [coating] = await actor.createEmbeddedDocuments("Item", [data]);
    if (coating) say(actor, `<p>${actor.name} applies ${name.replace(EFFECT_PREFIX, "")} to ${weapon.name}. It lasts until the end of this turn.</p>`);
    return;
  }

  // A vial is created in a hand, so one has to be free.
  if (!(actor.handsFree > 0)) {
    say(actor, `<p>${actor.name} has no free hand, so Quick Vial creates nothing.</p>`);
    return ui.notifications.warn(`${actor.name} needs a free hand to use Quick Vial.`);
  }
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
  if (!enabled("alchemistActions")) return;
  const action = await itemUsed(message);
  if (action?.type === "action" && action.slug === "quick-vial") await createQuickVial(action.actor);
});

// A vial made in combat is removed once its creator's turn is over.
Hooks.on("updateCombat", async (combat, changed) => {
  if (!("turn" in changed || "round" in changed) || !enabled("alchemistActions")) return;
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
