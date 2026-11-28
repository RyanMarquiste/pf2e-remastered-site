// The Mutagenist Field Vial suppresses the drawback of one mutagen. Every drawback in the module (the split mutagens' Drawback effects, the Drakeheart and Mind Doubling drawbacks and
// the Ichthys mutagens, which carry theirs) has a RollOption rule whose option ends "drawback-suppressed", and its penalties and weaknesses only apply while that option is off. When the
// vial's effect is applied to a character this picks a drawback, sets that rule's value to true, adds "(suppressed)" to the effect's name in the effects list and swaps its picture for a
// greyed one with a red slash through it (images/suppressed/, made by foundry/make-suppressed-icons.cjs), so it shows in the effects panel and on the token; the vial's effect keeps which
// one in a flag, and the drawback keeps its own picture in a flag. When the vial's effect ends, however that happens, the drawback is switched back on and its name and picture restored. One drawback is suppressed without asking; with several
// the player chooses; with none the chat says so and nothing else happens. The drawback is never removed, so nothing is dealt or applied a second time (the Quicksilver Mutagen's damage,
// taken when its drawback was applied, is not given back).
import { MODULE, say } from "../common/shared.js";
import { enabled, log } from "../common/settings.js";

const VIAL = "effect-mutagenist-field-vial";
const FLAG = "suppressed"; // on the vial's effect: { id } of the drawback effect it suppressed
const LABEL = " (suppressed)";
const ORIGINAL_IMG = "originalImg"; // on the drawback effect while it is suppressed: its own picture

const optionIndex = (effect) => effect.system.rules.findIndex((rule) => rule.key === "RollOption" && /drawback-suppressed$/.test(rule.option ?? ""));
const isDrawback = (effect) => optionIndex(effect) >= 0;
const isSuppressed = (effect) => effect.system.rules[optionIndex(effect)]?.value === true;
const plainName = (effect) => effect.name.replace(/^Effect:\s*/, "").replace(LABEL, "");

// What the drawback does, in a few words, from its description: the first paragraph that isn't the "Granted by" line.
const summary = (effect) => {
  const paragraphs = [...(effect.system.description?.value ?? "").matchAll(/<p>(.*?)<\/p>/gs)].map((m) => m[1].replace(/<[^>]+>/g, "").replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, "$1").trim());
  const text = (paragraphs.find((p) => p && !/^Granted by/i.test(p)) ?? "").replace(/^Drawback\s*/i, "");
  return text.length > 150 ? `${text.slice(0, 147)}...` : text;
};

// The suppressed version of a picture, if there is one: images/suppressed/<name of the picture>.png.
async function suppressedPicture(img) {
  const name = (img ?? "").split("/").pop().replace(/\.[^.]+$/, "");
  if (!name) return null;
  const path = `modules/${MODULE}/images/suppressed/${name}.png`;
  return (await foundry.utils.srcExists(path).catch(() => false)) ? path : null;
}

async function setSuppressed(effect, on) {
  const index = optionIndex(effect);
  if (index < 0) return;
  const rules = foundry.utils.deepClone(effect.system.rules);
  rules[index].value = on;
  const name = on ? (effect.name.endsWith(LABEL) ? effect.name : effect.name + LABEL) : effect.name.endsWith(LABEL) ? effect.name.slice(0, -LABEL.length) : effect.name;
  const update = { "system.rules": rules, name };
  if (on) {
    // Keep the drawback's own picture to put back, unless it has none to swap to or is already showing the suppressed one.
    const alt = effect.getFlag(MODULE, ORIGINAL_IMG) ? null : await suppressedPicture(effect.img);
    if (alt && alt !== effect.img) {
      update.img = alt;
      update[`flags.${MODULE}.${ORIGINAL_IMG}`] = effect.img;
    }
  } else {
    const original = effect.getFlag(MODULE, ORIGINAL_IMG);
    if (original) {
      update.img = original;
      update[`flags.${MODULE}.-=${ORIGINAL_IMG}`] = null;
    }
  }
  await effect.update(update);
}

async function choose(candidates) {
  if (candidates.length === 1) return candidates[0];
  const rows = candidates
    .map(
      (effect, i) =>
        `<label style="display:flex;align-items:center;gap:.5em;padding:3px 0;cursor:pointer;">` +
        `<input type="radio" name="drawback" value="${effect.id}"${i === 0 ? " checked" : ""}>` +
        `<img src="${effect.img}" width="28" height="28" style="flex:none;border:none;">` +
        `<span><strong>${foundry.utils.escapeHTML(plainName(effect))}</strong><br><span style="opacity:.8;font-size:.9em;">${foundry.utils.escapeHTML(summary(effect))}</span></span></label>`,
    )
    .join("");
  const id = await foundry.applications.api.DialogV2.prompt({
    window: { title: "Mutagenist Field Vial", icon: "fa-solid fa-flask" },
    position: { width: 480 },
    content: `<p>Which drawback does the field vial suppress?</p><div>${rows}</div>`,
    ok: { label: "Suppress", callback: (event, button) => button.form.elements.drawback.value },
    rejectClose: false,
  });
  return candidates.find((effect) => effect.id === id) ?? null;
}

// The vial's effect is applied: suppress a drawback. This runs on the client of the user who applied it.
Hooks.on("createItem", async (item, options, userId) => {
  if (userId !== game.user.id || !enabled("alchemistActions")) return;
  const actor = item.actor;
  if (!actor || item.type !== "effect" || item.slug !== VIAL) return;
  try {
    const candidates = actor.itemTypes.effect.filter((effect) => isDrawback(effect) && !isSuppressed(effect));
    if (!candidates.length) {
      log(`Mutagenist Field Vial on ${actor.name}: no drawback to suppress`);
      return say(actor, `<p>${actor.name} uses a Mutagenist Field Vial, but has no mutagen drawback to suppress.</p>`);
    }
    const target = await choose(candidates);
    if (!target) return say(actor, `<p>${actor.name} uses a Mutagenist Field Vial, but chooses no drawback to suppress.</p>`);
    await item.setFlag(MODULE, FLAG, { id: target.id });
    await setSuppressed(target, true);
    log(`Mutagenist Field Vial on ${actor.name}: suppressed ${target.name}`);
    await say(actor, `<p>${actor.name}'s Mutagenist Field Vial suppresses the drawback of ${plainName(target)}. It comes back when the vial's effect ends.</p>`);
  } catch (error) {
    console.error(MODULE, "Mutagenist Field Vial could not suppress a drawback", error);
  }
});

// The vial's effect ends (it runs out, or it is removed): the drawback comes back. The active GM's client does this, or, with no GM, the user who removed it.
Hooks.on("deleteItem", async (item, options, userId) => {
  if (item.type !== "effect" || item.slug !== VIAL) return;
  const gm = game.users.activeGM;
  if (gm ? gm.id !== game.user.id : userId !== game.user.id) return;
  try {
    const saved = item.getFlag(MODULE, FLAG);
    const actor = item.actor;
    const target = saved?.id ? actor?.items.get(saved.id) : null;
    if (!target || !isDrawback(target) || !isSuppressed(target)) return;
    await setSuppressed(target, false);
    log(`Mutagenist Field Vial on ${actor.name}: ${target.name} is back`);
    await say(actor, `<p>${actor.name}'s Mutagenist Field Vial wears off, and the drawback of ${plainName(target)} returns.</p>`);
  } catch (error) {
    console.error(MODULE, "Mutagenist Field Vial could not bring a drawback back", error);
  }
});
