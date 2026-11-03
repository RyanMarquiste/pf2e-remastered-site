// Insulating Paste: when its resistance reduces damage, post a chat message with a button that lowers the effect's counter.
// PF2e doesn't track this itself, so this reads the "damage taken" chat message PF2e posts when damage is applied.
const MODULE = "marquiste-additions";
const SLUG = "insulating-paste";

Hooks.on("createChatMessage", async (message) => {
  if (message.flags?.pf2e?.context?.type !== "damage-taken") return;
  if (game.users.activeGM?.id !== game.user.id) return; // only one client posts the prompt

  const actor = message.speakerActor;
  if (!actor) return;

  const effects = actor.itemTypes.effect.filter((e) => e.slug === SLUG);
  if (!effects.length) return;

  const holder = document.createElement("div");
  holder.innerHTML = message.content;
  let applications;
  try {
    applications = JSON.parse(holder.querySelector(".iwr")?.dataset.applications ?? "[]");
  } catch {
    return;
  }

  for (const effect of effects) {
    const type = effect.flags.pf2e?.rulesSelections?.damageType;
    const label = actor.attributes.resistances.find((r) => r.type === type)?.label;
    if (!label) continue;

    const reduced = applications.some((a) => a.category === "resistance" && !a.ignored && a.adjustment < 0 && a.type === label);
    if (!reduced) continue;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content:
        `<p>The Insulating Paste on ${actor.name} blocked some ${type} damage.</p>` +
        `<button type="button" data-action="marquiste-use-paste">Use up one instance of protection</button>`,
      flags: { [MODULE]: { paste: { actorUuid: actor.uuid, effectId: effect.id } } },
    });
  }
});

Hooks.on("renderChatMessageHTML", async (message, html) => {
  const data = message.flags?.[MODULE]?.paste;
  const button = html.querySelector("button[data-action=marquiste-use-paste]");
  if (!data || !button) return;

  const actor = await fromUuid(data.actorUuid);
  const effect = actor?.items.get(data.effectId);
  if (!effect) {
    button.disabled = true;
    button.textContent = "The paste has worn away";
    return;
  }
  if (effect.getFlag(MODULE, "used")?.includes(message.id)) {
    button.disabled = true;
    button.textContent = "Counted";
    return;
  }
  if (!actor.isOwner) {
    button.disabled = true;
    return;
  }

  button.addEventListener("click", async () => {
    const counted = effect.getFlag(MODULE, "used") ?? [];
    if (counted.includes(message.id)) return;
    button.disabled = true;

    const remaining = (effect.system.badge?.value ?? 1) - 1;
    if (remaining <= 0) {
      await effect.delete();
      button.textContent = "The paste has worn away";
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `<p>The Insulating Paste on ${actor.name} has worn away completely.</p>`,
      });
    } else {
      await effect.update({ "system.badge.value": remaining, [`flags.${MODULE}.used`]: [...counted, message.id] });
      button.textContent = `Counted (${remaining} left)`;
    }
  });
});
