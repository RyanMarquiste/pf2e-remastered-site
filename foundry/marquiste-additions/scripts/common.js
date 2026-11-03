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
