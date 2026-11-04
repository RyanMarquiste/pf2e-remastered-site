// What poison is on a weapon, and the rule that a weapon carries only one at a time. Used by the injury poisons and by the Alchemist's Toxic Coatings.
import { MODULE } from "./shared.js";

// The poisons on a weapon: an injury poison applied by this module, or any effect with the Injury and Poison traits whose weapon choice is this
// weapon (the Alchemist's Toxic Coatings are like that).
export function poisonsOn(actor, weapon) {
  return actor.itemTypes.effect.filter((e) => {
    if (e.getFlag(MODULE, "injuryPoison")?.weapon === weapon.id) return true;
    const traits = e.system.traits.value;
    return traits.includes("injury") && traits.includes("poison") && e.flags.pf2e?.rulesSelections?.weapon === weapon.id;
  });
}

export const poisonName = (effect) => (effect.getFlag(MODULE, "injuryPoison") ? effect.name.replace("Poisoned Weapon: ", "") : effect.name.replace("Effect: ", ""));

// Call before putting a new poison on a weapon. If the weapon already carries one, warn and ask whether to overwrite it. Returns true when the weapon
// is free to take the new poison (nothing was on it, or the old one was removed), and false when the player keeps the old one.
export async function claimWeapon(actor, weapon, incomingName) {
  const all = poisonsOn(actor, weapon);
  // A poison on an ammunition weapon that has already been fired is spent; it just hasn't been cleaned up yet.
  const spent = all.filter((e) => e.getFlag(MODULE, "fired"));
  const existing = all.filter((e) => !e.getFlag(MODULE, "fired"));
  if (spent.length) await actor.deleteEmbeddedDocuments("Item", spent.map((e) => e.id));
  if (!existing.length) return true;

  const names = existing.map(poisonName).join(", ");
  const overwrite = await foundry.applications.api.DialogV2.confirm({
    window: { title: "Weapon Already Poisoned", icon: "fa-solid fa-triangle-exclamation" },
    content:
      `<p><strong>${weapon.name}</strong> is already poisoned with <strong>${names}</strong>. A weapon can carry only one poison at a time.</p>` +
      `<p>Overwrite it with <strong>${incomingName}</strong>? The ${names} will be lost.</p>`,
    yes: { label: "Overwrite", icon: "fa-solid fa-check" },
    no: { label: "Keep Current Poison", icon: "fa-solid fa-xmark", default: true },
    rejectClose: false,
  });
  if (!overwrite) return false;
  await actor.deleteEmbeddedDocuments("Item", existing.map((e) => e.id));
  return true;
}
