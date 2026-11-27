// Helpers shared by every script in the module.
export const MODULE = "marquiste-additions";

// The item (action or feat) a chat card came from, but only on the client of the user who used it, so each use is handled once.
export async function itemUsed(message) {
  if (message.author?.id !== game.user.id) return null;
  const uuid = message.flags?.pf2e?.origin?.uuid;
  if (!uuid) return null;
  const item = await fromUuid(uuid);
  return item?.actor ? item : null;
}

export function say(actor, html) {
  return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: html });
}

// Items a feature makes for a single turn (what Create Consumable and Create Food make, and the Food Projectile) are stamped when they are made, so they can be cleared away later.
// In a combat the stamp is the combat, the creator's combatant and the round; the features' own updateCombat handlers remove the item when that turn is over. Outside combat there are
// no turns, so the stamp is the world time at which a turn would be over (a round from now), and expireWithClock removes the item once the clock reaches it.
// With `seconds` the item lasts that long from now by the world clock, in or out of combat (a processed food that stays potent for its activation time).
export function lifetimeStamp(actor, seconds) {
  const combatant = seconds ? null : game.combat?.combatants.find((c) => c.actor?.id === actor.id);
  if (combatant) return { combatId: game.combat.id, combatantId: combatant.id, round: game.combat.round };
  return { combatId: null, expiresAt: game.time.worldTime + (seconds ?? CONFIG.time?.roundTime ?? 6) };
}

// How long an item takes to Activate, in seconds, when that is a length of time (10 minutes, 1 hour) and not actions; null for an item that takes actions.
export function activationSeconds(item) {
  const text = item.system?.description?.value ?? "";
  const found = text.match(/Activate(?:<[^>]*>|\s|&nbsp;)*(\d+)\s*(minute|hour|day)s?\b/i);
  if (!found) return null;
  return Number(found[1]) * { minute: 60, hour: 3600, day: 86400 }[found[2].toLowerCase()];
}

// Remove stamped items (those with any of the `flags` set) in two more cases: when the world clock moves on (the clock's +10 minutes or +1 hour buttons, or any other advance)
// to or past an item's expiry outside combat, and when a combat ends, for every item made in it. `isOn()` says whether the feature is switched on, and `text(item)` is what to say.
// Only the active GM's client does this, so each item is removed once.
export function expireWithClock({ flags, isOn, text }) {
  async function sweep(due) {
    if (!isOn() || !game.user.isGM || game.users.activeGM?.id !== game.user.id) return;
    const actors = new Set(game.actors.contents);
    for (const scene of game.scenes) for (const token of scene.tokens) if (token.actor) actors.add(token.actor);
    for (const actor of actors) {
      for (const item of [...actor.items]) {
        const flag = flags.map((name) => item.getFlag(MODULE, name)).find(Boolean);
        if (!flag || !due(flag)) continue;
        await item.delete();
        await say(actor, text(item));
      }
    }
  }
  // An item without an expiry (made before this existed) is due at the next advance of the clock.
  Hooks.on("updateWorldTime", (worldTime, delta) => (delta > 0 ? sweep((flag) => !flag.combatId && (flag.expiresAt ?? 0) <= worldTime) : undefined));
  Hooks.on("deleteCombat", (combat) => sweep((flag) => flag.combatId === combat.id));
}
