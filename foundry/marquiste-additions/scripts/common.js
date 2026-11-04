// Shared helpers for the alchemy scripts.
export const MODULE = "marquiste-additions";
export const PACK = `${MODULE}.corpsecaps-cauldron`;
export const SETTING = "volatileVialRules";

// The item (action or feat) a chat card came from, but only on the client of the user who used it, so each use is handled once.
export async function itemUsed(message) {
  if (message.author?.id !== game.user.id) return null;
  const uuid = message.flags?.pf2e?.origin?.uuid;
  if (!uuid) return null;
  const item = await fromUuid(uuid);
  return item?.actor ? item : null;
}

// An Alchemist's versatile vials are a special resource PF2e links to the quantity of their Versatile Vial item.
export const versatileVials = (actor) => actor.getResource?.("versatile-vials")?.value ?? 0;

export const tierFor = (level) => (level >= 18 ? "Major" : level >= 12 ? "Greater" : level >= 4 ? "Moderate" : "Lesser");

export function say(actor, html) {
  return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: html });
}

// Outline icons for the Quick Alchemy chooser: a round potion bottle with a lightning bolt (Quick Vial) and one with bubbles (Create Consumable).
const BOTTLE = '<path d="M9.3 3h5.4M10.6 3v4.13A7.5 7.5 0 1 0 13.4 7.13V3"/>';
const svg = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex: none; vertical-align: middle; margin-right: .5em;">${inner}</svg>`;
export const QUICK_VIAL_ICON = svg(`${BOTTLE}<path d="M13.2 9.8 8.6 15.9h3.1l-1 4.3 5-6.4h-3.2z" fill="currentColor" stroke="none"/>`);
export const CONSUMABLE_ICON = svg(`${BOTTLE}<g stroke-width="1.3"><circle cx="9.5" cy="16.5" r="2"/><circle cx="14.6" cy="14" r="1.7"/><circle cx="13.8" cy="18.6" r="1.1"/></g>`);
