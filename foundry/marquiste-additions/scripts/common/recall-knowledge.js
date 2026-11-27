// Call for Recall Knowledge: the GM picks which skills could apply and a DC, and a card goes to the chat that asks every player to Recall Knowledge. The card says
// nothing about the skills or the DC. When a player presses its button, their character makes a Recall Knowledge check with every skill the GM picked, and the GM gets
// one private summary that says which characters succeeded and which did not, skill by skill. The players never see their results.
//
// How it works: the GM's client does the rolling. A player's button sends a request over the module's socket, and the GM's client rolls PF2e's own Recall Knowledge
// action for that player's character (so modifiers that look for action:recall-knowledge apply), without posting a card for each roll, then adds the outcomes to the summary.
// A GM has to be connected. The skills and DC are kept in the prompt card's flags, so they are not shown to players, but a player who looks at the card's data could read them.
import { MODULE } from "./shared.js";
import { enabled, log } from "./settings.js";

const SOCKET = `module.${MODULE}`;
const FLAG = "recall"; // on the prompt card: { skills, lores, dc, summaryId }
const RESULTS = "results"; // on the summary: { actorId: { name, user, skills: { key: { outcome, total } } } }
const DONE = "recallDone"; // on a player's user: the prompt cards they have already answered

const SKILLS = { arcana: "Arcana", crafting: "Crafting", medicine: "Medicine", nature: "Nature", occultism: "Occultism", religion: "Religion", society: "Society" };
// The standard DC for a level, 0 to 25, and the adjustments for how hard the knowledge is to recall.
const DC_BY_LEVEL = [14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40, 42, 44, 46, 48, 50];
const ADJUSTMENTS = [["Incredibly easy", -10], ["Very easy", -5], ["Easy", -2], ["Standard", 0], ["Hard", 2], ["Very hard", 5], ["Incredibly hard", 10]];
const OUTCOMES = {
  criticalSuccess: { label: "Critical success", passed: true },
  success: { label: "Success", passed: true },
  failure: { label: "Failure", passed: false },
  criticalFailure: { label: "Critical failure", passed: false },
};

const esc = (text) => String(text ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const slugify = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const gmIds = () => game.users.filter((u) => u.isGM).map((u) => u.id);

// The key of a skill on a character for the name the GM typed for a Lore ("Warfare" or "Warfare Lore"), or null if they don't have it.
export function findLore(actor, name) {
  const wanted = [slugify(name), slugify(`${name} lore`)];
  return Object.keys(actor.skills ?? {}).find((key) => wanted.includes(key)) ?? null;
}

// The DC: a level-based DC with an adjustment if a level was given, otherwise the DC that was typed.
export function dcFor({ dc, level, adjustment }) {
  const n = Number.parseInt(level, 10);
  if (Number.isInteger(n) && n >= 0 && n < DC_BY_LEVEL.length) return DC_BY_LEVEL[n] + (Number(adjustment) || 0);
  return Number.parseInt(dc, 10) || 15;
}

// The GM's private summary: what was asked, and a row for each character that has rolled.
function renderSummary(config, results, waiting) {
  const columns = [...config.skills.map((key) => ({ key, label: SKILLS[key] })), ...config.lores.map((name) => ({ key: `lore:${name}`, label: `${name} Lore` }))];
  const cell = (entry) => {
    if (!entry) return `<td style="text-align: center; opacity: .5;">&ndash;</td>`;
    const outcome = OUTCOMES[entry.outcome];
    if (!outcome) return `<td style="text-align: center; opacity: .5;">&ndash;</td>`;
    const colour = outcome.passed ? "#2e7d32" : "#b71c1c";
    return `<td style="text-align: center; color: ${colour};"><strong>${outcome.passed ? "&#10004;" : "&#10008;"}</strong> ${outcome.label}<br><small>${entry.total}</small></td>`;
  };
  const rows = Object.values(results)
    .map((row) => `<tr><td><strong>${esc(row.name)}</strong><br><small>${esc(row.user)}</small></td>${columns.map((c) => cell(row.skills?.[c.key])).join("")}</tr>`)
    .join("");
  return (
    `<div class="marquiste-recall-summary">` +
    `<h3>Recall Knowledge <small>(GM only)</small></h3>` +
    `<p>DC <strong>${config.dc}</strong></p>` +
    `<table style="width: 100%; border-collapse: collapse;"><thead><tr><th style="text-align: left;">Character</th>${columns.map((c) => `<th>${esc(c.label)}</th>`).join("")}</tr></thead>` +
    `<tbody>${rows || `<tr><td colspan="${columns.length + 1}" style="opacity: .6;">No one has rolled yet.</td></tr>`}</tbody></table>` +
    (waiting.length ? `<p style="opacity: .75;">Not yet rolled: ${waiting.map(esc).join(", ")}</p>` : "") +
    `</div>`
  );
}

// Players who are connected and haven't rolled yet, by the name of their character.
function waitingFor(results) {
  const rolled = new Set(Object.values(results).map((row) => row.userId));
  return game.users.filter((u) => u.active && !u.isGM && !rolled.has(u.id)).map((u) => u.character?.name ?? u.name);
}

// The GM's dialog, then the two cards.
export async function callForRecallKnowledge() {
  if (!game.user.isGM) return ui.notifications.warn("Only the GM can call for Recall Knowledge.");
  if (!enabled("recallKnowledge")) return ui.notifications.info("Call for Recall Knowledge is switched off in the Marquiste Additions settings.");

  const boxes = Object.entries(SKILLS).map(([key, label]) => `<label style="display: inline-block; width: 48%;"><input type="checkbox" name="skill-${key}"> ${label}</label>`).join("");
  const options = ADJUSTMENTS.map(([label, n]) => `<option value="${n}"${n === 0 ? " selected" : ""}>${label} (${n >= 0 ? "+" : ""}${n})</option>`).join("");
  const content =
    `<p style="margin-top: 0; opacity: .8;">Choose the skills that could recall this. The players aren't told which, or the DC.</p>` +
    `<div class="form-group"><label>Skills</label><div class="form-fields" style="display: block;">${boxes}</div></div>` +
    `<div class="form-group"><label>Lore</label><div class="form-fields"><input type="text" name="lores" placeholder="Warfare, Dragon (separate with commas)"></div></div>` +
    `<div class="form-group"><label>DC</label><div class="form-fields"><input type="number" name="dc" value="15" min="0"></div></div>` +
    `<p style="margin: .25em 0; opacity: .7;">Or set it from the creature's level, with an adjustment (this replaces the DC above):</p>` +
    `<div class="form-group"><label>Level</label><div class="form-fields"><input type="number" name="level" min="0" max="25" placeholder="0 to 25"><select name="adjustment">${options}</select></div></div>`;

  const values = await foundry.applications.api.DialogV2.prompt({
    window: { title: "Call for Recall Knowledge" },
    content,
    ok: {
      label: "Call for Recall Knowledge",
      callback: (event, button) => {
        const form = button.form.elements;
        return {
          skills: Object.keys(SKILLS).filter((key) => form[`skill-${key}`]?.checked),
          lores: form.lores.value.split(",").map((s) => s.trim()).filter(Boolean),
          dc: form.dc.value,
          level: form.level.value,
          adjustment: form.adjustment.value,
        };
      },
    },
    rejectClose: false,
  });
  if (!values) return;
  if (!values.skills.length && !values.lores.length) return ui.notifications.warn("Choose at least one skill.");

  const config = { skills: values.skills, lores: values.lores, dc: dcFor(values) };
  const summary = await ChatMessage.create({
    content: renderSummary(config, {}, waitingFor({})),
    whisper: gmIds(),
    speaker: { alias: "Recall Knowledge" },
    flags: { [MODULE]: { [RESULTS]: {} } },
  });
  await ChatMessage.create({
    content:
      `<div class="marquiste-recall"><h3>Recall Knowledge</h3>` +
      `<p>What do your characters know about this? Each of you, try to remember.</p>` +
      `<button type="button" data-action="marquiste-recall"><i class="fa-solid fa-brain"></i> Recall Knowledge</button></div>`,
    speaker: { alias: "Recall Knowledge" },
    flags: { [MODULE]: { [FLAG]: { ...config, summaryId: summary.id } } },
  });
  log("Called for Recall Knowledge", config);
}

// The button on the prompt card. A GM sees it switched off; a player who has already answered sees it used.
Hooks.on("renderChatMessageHTML", (message, html) => {
  if (!enabled("recallKnowledge") || !message.getFlag(MODULE, FLAG)) return;
  const button = html.querySelector("[data-action='marquiste-recall']");
  if (!button) return;
  if (game.user.isGM) {
    button.disabled = true;
    button.textContent = "The players roll here";
    return;
  }
  if ((game.user.getFlag(MODULE, DONE) ?? []).includes(message.id)) {
    button.disabled = true;
    button.textContent = "You have rolled";
    return;
  }
  button.addEventListener("click", () => playerRolls(message, button));
});

// The character a player rolls for: their assigned character, or a choice among the characters they own.
async function chooseActor() {
  const mine = game.actors.filter((a) => a.type === "character" && a.testUserPermission(game.user, "OWNER"));
  if (game.user.character && mine.some((a) => a.id === game.user.character.id)) return game.user.character;
  if (mine.length === 1) return mine[0];
  if (!mine.length) return ui.notifications.warn("You have no character to roll for.");
  const id = await foundry.applications.api.DialogV2.wait({
    window: { title: "Recall Knowledge" },
    content: "<p>Which character recalls?</p>",
    buttons: mine.map((a) => ({ action: a.id, label: a.name })),
    rejectClose: false,
  });
  return mine.find((a) => a.id === id) ?? null;
}

async function playerRolls(message, button) {
  const actor = await chooseActor();
  if (!actor) return;
  if (!game.users.activeGM) return ui.notifications.warn("A GM has to be connected to take your Recall Knowledge.");
  button.disabled = true;
  button.textContent = "You have rolled";
  const done = (game.user.getFlag(MODULE, DONE) ?? []).slice(-40);
  await game.user.setFlag(MODULE, DONE, [...done, message.id]);
  game.socket.emit(SOCKET, { type: "recall", messageId: message.id, userId: game.user.id, actorId: actor.id });
  ui.notifications.info(`${actor.name} tries to recall what they know. The GM has the result.`);
}

// The GM's client: roll for a character that a player asked for, and add the outcomes to the summary.
export async function handleRecallRequest({ messageId, userId, actorId }) {
  if (game.users.activeGM?.id !== game.user.id) return; // only one client does this
  const prompt = game.messages.get(messageId);
  const config = prompt?.getFlag(MODULE, FLAG);
  const summary = config ? game.messages.get(config.summaryId) : null;
  const user = game.users.get(userId);
  const actor = game.actors.get(actorId);
  if (!config || !summary || !user || !actor || !actor.testUserPermission(user, "OWNER")) return;

  const results = foundry.utils.deepClone(summary.getFlag(MODULE, RESULTS) ?? {});
  if (results[actor.id]) return; // already rolled for this card

  const action = game.pf2e.actions.get("recall-knowledge");
  const skills = {};
  const roll = async (key, statistic) => {
    try {
      const [result] = await action.use({ actors: [actor], statistic, difficultyClass: { value: config.dc, visible: false }, message: { create: false } });
      skills[key] = { outcome: result?.outcome, total: result?.roll?.total };
    } catch (error) {
      console.warn(`${MODULE} | Recall Knowledge (${statistic}) could not be rolled for ${actor.name}`, error);
    }
  };
  for (const key of config.skills) await roll(key, key);
  for (const name of config.lores) {
    const key = findLore(actor, name);
    if (key) await roll(`lore:${name}`, key);
  }

  results[actor.id] = { name: actor.name, user: user.name, userId: user.id, skills };
  await summary.update({
    content: renderSummary(config, results, waitingFor(results)),
    [`flags.${MODULE}.${RESULTS}.${actor.id}`]: results[actor.id],
  });
  log(`Recall Knowledge rolled for ${actor.name}`, skills);
}

Hooks.once("ready", () => {
  game.modules.get(MODULE).api = { ...(game.modules.get(MODULE).api ?? {}), callForRecallKnowledge };
  game.socket.on(SOCKET, (data) => {
    if (data?.type === "recall" && enabled("recallKnowledge")) handleRecallRequest(data);
  });
});
