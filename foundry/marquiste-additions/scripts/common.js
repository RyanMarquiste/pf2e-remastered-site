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

// Small outline icons for the Quick Alchemy chooser: a flask with a lightning bolt (Quick Vial) and a flask with bubbles (Create Consumable).
const FLASK = '<path d="M9.5 3h5M10.5 3v6.5L5.5 18.2a1.6 1.6 0 0 0 1.4 2.3h10.2a1.6 1.6 0 0 0 1.4-2.3L13.5 9.5V3"/>';
const svg = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="flex: none; vertical-align: middle; margin-right: .4em;">${inner}</svg>`;
export const QUICK_VIAL_ICON = svg(`${FLASK}<path d="M13 11.5 10.2 15.6h2L11 19l3.2-4.4h-2z" fill="currentColor" stroke="none"/>`);
export const CONSUMABLE_ICON = svg(`${FLASK}<g stroke-width="1.2"><circle cx="10.4" cy="16.6" r="1.2"/><circle cx="14" cy="14.9" r="1"/><circle cx="13.6" cy="18.6" r=".7"/></g>`);
