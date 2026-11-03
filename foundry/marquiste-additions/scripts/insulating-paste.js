// Counts down the Insulating Paste effect's badge each time its resistance reduces damage.
// PF2e doesn't track this itself, so this reads the "damage taken" chat message PF2e posts when damage is applied.
const SLUG = "insulating-paste";

Hooks.on("createChatMessage", async (message) => {
  if (message.flags?.pf2e?.context?.type !== "damage-taken") return;
  if (game.users.activeGM?.id !== game.user.id) return; // only one client does the counting

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

    const remaining = (effect.system.badge?.value ?? 1) - 1;
    if (remaining <= 0) {
      await effect.delete();
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `<p>The Insulating Paste on ${actor.name} has worn away completely.</p>`,
      });
    } else {
      await effect.update({ "system.badge.value": remaining });
    }
  }
});
