// Splash damage by squares, for a weapon with the Splash trait (the alchemical bombs). PF2e itself does not look at the grid. With this on:
//
//  1. When a splash weapon is thrown at a creature that takes up more than one square, the player clicks which of its squares the bomb lands in.
//  2. The splash reaches that square and the squares around it (more rings of squares when something widens it). A creature takes the splash once for
//     every one of its squares that is in that area, so a creature on two of them takes it twice.
//  3. On a hit, the target takes its splash as part of the damage roll, so it is added to the primary damage before resistances and weaknesses. It is
//     never doubled on a critical hit. On a miss only the square the bomb landed in is splashed, so the target takes the splash once.
//
// Everyone else in the area is listed on a chat card, with a button for each that applies their splash, or applied straight away when
// "Apply splash automatically" is on. Nothing here changes a bomb's damage dice; it works on the roll PF2e makes. If anything needed is missing (a
// hex or gridless scene, a target on another scene, no square chosen) the roll is left exactly as PF2e made it.
import { MODULE } from "./shared.js";
import { enabled, log } from "./settings.js";
import { esc } from "./formula-books.js";
import { area, footprint, rings, squaresIn } from "./splash-geometry.js";

const SQUARE = "splashSquare"; // on an attack roll message: the square of the target that was chosen
const DAMAGE = "splash"; // on a damage roll message: what the rule worked out
const APPLY = "splashApply"; // on the card for the other creatures

const traitsOf = (item) => [...(item?.system?.traits?.value ?? [])];
const isSplash = (item) => !!item?.isOfType?.("weapon") && traitsOf(item).some((t) => t === "splash" || /^splash-\d+$/.test(t));
const squareGrid = () => !!canvas?.ready && canvas.grid?.type === CONST.GRID_TYPES.SQUARE;
const warn = (...args) => console.warn(`${MODULE} | splash:`, ...args);

// The squares a token covers. A creature smaller than a square still covers one.
function cellsOf(token) {
  const size = canvas.grid.size;
  const top = canvas.grid.getOffset({ x: token.x + size / 2, y: token.y + size / 2 });
  return footprint(top, Math.round(token.height), Math.round(token.width));
}

// ---------------------------------------------------------------------------------------------------------------------------------------------
// 1. Choosing the square

// The player clicks one of the highlighted squares. Right-click or Esc gives up. Resolves with the square, or null.
function pickOnCanvas(cells) {
  return new Promise((resolve) => {
    const view = canvas.app.view;
    const layer = new PIXI.Graphics();
    canvas.interface.addChild(layer);
    const size = canvas.grid.size;
    let hover = null;
    const same = (a, b) => !!a && !!b && a.i === b.i && a.j === b.j;
    const at = (event) => cells.find((cell) => same(cell, canvas.grid.getOffset(canvas.canvasCoordinatesFromClient({ x: event.clientX, y: event.clientY })))) ?? null;
    const draw = () => {
      layer.clear();
      for (const cell of cells) {
        const { x, y } = canvas.grid.getTopLeftPoint(cell);
        layer.lineStyle(2, 0xff9900, 1).beginFill(0xff9900, same(cell, hover) ? 0.55 : 0.25).drawRect(x, y, size, size).endFill();
      }
    };
    const stop = (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const onMove = (event) => {
      hover = at(event);
      draw();
    };
    const onDown = (event) => {
      if (event.button === 2) return finish(null, event);
      if (event.button !== 0) return;
      const cell = at(event);
      stop(event);
      if (cell) finish(cell);
    };
    const onKey = (event) => {
      if (event.key === "Escape") finish(null, event);
    };
    const blocked = ["pointerup", "mouseup", "mousedown", "click", "contextmenu"];
    function finish(value, event) {
      if (event) stop(event);
      view.removeEventListener("pointerdown", onDown, true);
      view.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey, true);
      layer.destroy();
      setTimeout(() => blocked.forEach((type) => view.removeEventListener(type, stop, true)), 300); // the rest of the click must not select a token
      resolve(value);
    }
    view.addEventListener("pointerdown", onDown, true);
    view.addEventListener("pointermove", onMove);
    window.addEventListener("keydown", onKey, true);
    blocked.forEach((type) => view.addEventListener(type, stop, true));
    draw();
  });
}

// If the canvas can't be used for some reason, a window with the creature's squares as buttons does the same job.
async function pickInWindow(cells) {
  const top = Math.min(...cells.map((cell) => cell.i));
  const left = Math.min(...cells.map((cell) => cell.j));
  const chosen = await foundry.applications.api.DialogV2.wait({
    window: { title: "Which square does it land in?" },
    content: `<p>Choose one of the target's squares.</p>`,
    buttons: cells.map((cell) => ({
      action: `${cell.i},${cell.j}`,
      label: `Row ${cell.i - top + 1}, column ${cell.j - left + 1}`,
      callback: () => cell,
    })),
    rejectClose: false,
  });
  return chosen && typeof chosen === "object" ? chosen : null;
}

async function pickSquare(cells) {
  try {
    return await pickOnCanvas(cells);
  } catch (error) {
    warn("could not pick on the canvas, using a window", error);
    return pickInWindow(cells);
  }
}

// When a splash weapon is thrown at a big target, ask which square and keep the answer on the attack roll's chat message.
Hooks.on("createChatMessage", async (message) => {
  if (message.author?.id !== game.user.id || !enabled("bombSplash")) return;
  const context = message.flags?.pf2e?.context;
  if (context?.type !== "attack-roll" || !context.target?.token) return;
  try {
    const item = fromUuidSync(message.flags.pf2e.origin?.uuid ?? "");
    if (!isSplash(item) || !squareGrid()) return;
    const target = fromUuidSync(context.target.token);
    if (!target || target.parent?.id !== canvas.scene?.id) return;
    const cells = cellsOf(target);
    if (cells.length < 2) return; // one square needs no choosing
    ui.notifications.info(`Click the square of ${target.name} that ${item.name} lands in. Right-click or Esc to skip.`);
    const cell = await pickSquare(cells);
    if (cell) await message.setFlag(MODULE, SQUARE, { token: target.uuid, i: cell.i, j: cell.j });
    else ui.notifications.info("No square chosen: PF2e's own splash is used.");
  } catch (error) {
    warn("choosing a square failed", error);
  }
});

// ---------------------------------------------------------------------------------------------------------------------------------------------
// 2 and 3. The damage roll

// A copy of the roll with extra splash added to the instances that have an amount in `extras` (by position). The dice keep the values they rolled.
// The extra is added after the fact, so a critical hit has already done its doubling and the splash is not doubled.
function withExtraSplash(roll, extras) {
  const Arithmetic = CONFIG.Dice.termTypes?.ArithmeticExpression;
  if (typeof Arithmetic?.fromData !== "function") throw new Error("PF2e's ArithmeticExpression term is not registered");
  const instances = roll.instances.map((instance, index) => {
    const Instance = instance.constructor;
    if (!(extras[index] > 0)) return Instance.fromData(instance.toJSON());
    const head = instance.head.toJSON();
    const options = head.options ?? {};
    delete head.options;
    const sum = Arithmetic.fromData({
      operator: "+",
      operands: [
        { class: "Grouping", term: head, options },
        { class: "NumericTerm", number: extras[index], options: { flavor: "splash" } },
      ],
      evaluated: true,
    });
    return Instance.fromTerms([sum], foundry.utils.deepClone(instance.options));
  });
  return roll.constructor.fromTerms([roll.pool.constructor.fromRolls(instances)], foundry.utils.deepClone(roll.options));
}

const typeLabel = (type) => {
  const label = CONFIG.PF2E?.damageTypes?.[type];
  return label ? game.i18n.localize(label) : type;
};

// A damage roll for a splash weapon is changed before it is posted: the target's own splash is counted by squares, the separate splash rolls PF2e
// attaches (which a player applies by hand) are dropped, and what the others take is kept on the message for the card.
Hooks.on("preCreateChatMessage", (message, data, options, userId) => {
  if (userId !== game.user.id || !enabled("bombSplash")) return;
  const pf2e = message.flags?.pf2e;
  const context = pf2e?.context;
  if (context?.type !== "damage-roll" || !context.target?.token) return;
  try {
    const item = fromUuidSync(pf2e.origin?.uuid ?? "");
    if (!isSplash(item) || !squareGrid()) return;
    const outcome = context.outcome ?? null;
    if (outcome === "criticalFailure") return;
    const target = fromUuidSync(context.target.token);
    if (!target || target.parent?.id !== canvas.scene?.id) return;

    // Where it landed: the only square of a small target, or the square chosen when it was thrown.
    const cells = cellsOf(target);
    let centre = cells.length === 1 ? cells[0] : null;
    if (!centre) {
      const attack = game.messages.contents.findLast(
        (m) => m.author?.id === userId && m.flags?.pf2e?.origin?.uuid === pf2e.origin?.uuid && m.flags?.[MODULE]?.[SQUARE]?.token === target.uuid
      );
      const stored = attack?.flags?.[MODULE]?.[SQUARE];
      if (stored && cells.some((cell) => cell.i === stored.i && cell.j === stored.j)) centre = { i: stored.i, j: stored.j };
    }
    if (!centre) return;

    // How far it reaches. A miss only splashes the square it landed in.
    const hit = outcome !== "failure";
    const rollOptions = new Set(context.options ?? []);
    const widenedBy = [];
    if (hit) {
      if (rollOptions.has("expanded-splash")) widenedBy.push("Expanded Splash");
      if (traitsOf(item).includes("splash-10")) widenedBy.push("Splash 10 ft");
      if (outcome === "criticalSuccess" && rollOptions.has("critical-specialization")) widenedBy.push("bomb critical specialization");
    }
    const ringCount = hit ? rings(widenedBy) : 0;
    const areaKeys = area(centre, ringCount);

    const sources = message._source.rolls.map((roll) => (typeof roll === "string" ? roll : JSON.stringify(roll)));
    const primaryAt = sources.findIndex((source) => !JSON.parse(source).options?.splashOnly);
    if (primaryAt < 0) return;
    const primary = Roll.fromJSON(sources[primaryAt]);
    if (!primary.instances?.length) return;
    const parts = primary.instances.map((instance) => ({
      type: instance.type,
      materials: [...instance.materials],
      splash: instance.persistent ? 0 : instance.componentTotal("splash"),
    }));
    if (!parts.some((part) => part.splash > 0)) return;

    // The target's own squares count. Its extra splash goes into the roll itself, so resistances and weaknesses see it with the rest.
    const targetSquares = squaresIn(cells, areaKeys);
    const extras = parts.map((part) => (targetSquares - 1) * part.splash);
    let rolls = sources.filter((_, index) => !JSON.parse(sources[index]).options?.splashOnly);
    if (extras.some((extra) => extra > 0)) {
      const patched = withExtraSplash(primary, extras);
      const expected = primary.total + extras.reduce((sum, extra) => sum + extra, 0);
      if (patched.total !== expected) throw new Error(`the changed roll totals ${patched.total}, not ${expected}`);
      rolls[rolls.indexOf(sources[primaryAt])] = JSON.stringify(patched.toJSON());
    }

    // Everyone else under the area.
    const entries = [];
    for (const token of canvas.scene.tokens) {
      if (token.id === target.id || !token.actor?.isOfType?.("creature")) continue;
      const squares = squaresIn(cellsOf(token), areaKeys);
      if (!squares) continue;
      entries.push({
        token: token.uuid,
        name: token.name,
        squares,
        parts: parts.filter((part) => part.splash > 0).map((part) => ({ type: part.type, materials: part.materials, amount: part.splash * squares })),
      });
    }

    message.updateSource({
      rolls,
      flags: {
        [MODULE]: {
          [DAMAGE]: {
            item: item.uuid,
            outcome,
            rings: ringCount,
            widenedBy,
            target: { name: target.name, squares: targetSquares, parts: parts.filter((part) => part.splash > 0) },
            entries,
            options: [...rollOptions],
          },
        },
      },
    });
    log(`splash for ${item.name} on ${target.name}: ${targetSquares} squares, ${ringCount} rings, ${entries.length} others`);
  } catch (error) {
    warn("left PF2e's roll as it was:", error);
    ui.notifications.warn("Splash squares could not be worked out for this roll, so PF2e's own splash was used. See the console (F12).");
  }
});

// ---------------------------------------------------------------------------------------------------------------------------------------------
// The card for the other creatures

const amounts = (parts) => parts.map((part) => `${part.amount} ${typeLabel(part.type)}`).join(", ");

// Posted by the player who rolled the damage, after the damage message exists.
Hooks.on("createChatMessage", async (message) => {
  const splash = message.flags?.[MODULE]?.[DAMAGE];
  if (!splash || message.author?.id !== game.user.id) return;
  const { target, entries } = splash;
  if (!entries.length && target.squares < 2) return; // nothing but the one splash PF2e would have done anyway

  const auto = !!game.users.activeGM && game.settings.get(MODULE, "bombSplashAutoApply");
  const lines = [];
  if (target.squares > 1) {
    lines.push(`<li><strong>${esc(target.name)}</strong> (${target.squares} squares): the splash counted ${target.squares} times, ${amounts(target.parts.map((part) => ({ ...part, amount: part.splash * target.squares })))}, as part of the damage roll.</li>`);
  }
  entries.forEach((entry, index) => {
    const button = auto ? "" : ` <button type="button" data-action="marquiste-splash" data-index="${index}">Apply</button>`;
    lines.push(`<li><strong>${esc(entry.name)}</strong> (${entry.squares} ${entry.squares === 1 ? "square" : "squares"}): ${amounts(entry.parts)}${button}</li>`);
  });
  const reach = splash.rings ? `${splash.rings * 5} ft${splash.widenedBy.length ? ` (${splash.widenedBy.join(", ")})` : ""}` : "the square it landed in";
  const note = auto ? "<p><em>Applied automatically.</em></p>" : "";
  await ChatMessage.create({
    speaker: message.speaker,
    whisper: message.whisper,
    blind: message.blind,
    content: `<div class="marquiste-splash"><p><strong>Splash</strong>: ${reach}</p>${lines.length ? `<ul>${lines.join("")}</ul>` : ""}${note}</div>`,
    flags: { [MODULE]: { [APPLY]: { item: splash.item, outcome: splash.outcome, options: splash.options, entries, auto, applied: {} } } },
  });
});

// Apply one creature's splash, the way PF2e's own Splash button would: a splash damage roll, run through that creature's resistances and weaknesses.
async function applyEntry(card, index) {
  const entry = card.entries[index];
  const token = await fromUuid(entry.token);
  const actor = token?.actor;
  if (!actor) return false;
  const item = await fromUuid(card.item);
  const Damage = CONFIG.Dice.rolls.find((roll) => roll.name === "DamageRoll");
  const origin = card.options.filter((option) => option.startsWith("self:")).map((option) => option.replace(/^self\b/, "origin"));
  const rest = card.options.filter((option) => !/^(?:self|target)(?::|$)/.test(option));
  const rollOptions = new Set([...rest, ...origin, ...actor.getSelfRollOptions()]);
  for (const part of entry.parts) {
    const roll = new Damage(`(${part.amount}[splash])[${[part.type, ...part.materials].join(",")}]`);
    await roll.evaluate();
    roll.options.splashOnly = true;
    await actor.applyDamage({ damage: roll, token, item, rollOptions, outcome: card.outcome });
  }
  return true;
}

// Mark an entry as done on the card, if this user is allowed to edit it. (Otherwise the button is only disabled on this screen.)
const markApplied = (message, index) => message.update({ [`flags.${MODULE}.${APPLY}.applied.${index}`]: true }).catch(() => null);

// With automatic application on, the active GM's screen applies everything on the card as it appears.
Hooks.on("createChatMessage", async (message) => {
  const card = message.flags?.[MODULE]?.[APPLY];
  if (!card?.auto || game.users.activeGM?.id !== game.user.id) return;
  for (let index = 0; index < card.entries.length; index++) {
    try {
      if (await applyEntry(card, index)) await markApplied(message, index);
    } catch (error) {
      warn(`could not apply splash to ${card.entries[index].name}`, error);
    }
  }
});

// The Apply buttons.
Hooks.on("renderChatMessageHTML", (message, html) => {
  const card = message.flags?.[MODULE]?.[APPLY];
  if (!card) return;
  for (const button of html.querySelectorAll('button[data-action="marquiste-splash"]')) {
    const index = Number(button.dataset.index);
    if (card.applied?.[index]) {
      button.disabled = true;
      button.textContent = "Applied";
      continue;
    }
    button.addEventListener("click", async () => {
      const token = await fromUuid(card.entries[index].token);
      if (!token?.actor?.canUserModify(game.user, "update")) {
        ui.notifications.warn(`You can't change ${card.entries[index].name}. Ask the GM to press Apply.`);
        return;
      }
      button.disabled = true;
      try {
        if (await applyEntry(card, index)) {
          button.textContent = "Applied";
          await markApplied(message, index);
        } else button.disabled = false;
      } catch (error) {
        button.disabled = false;
        warn("apply failed", error);
        ui.notifications.error("The splash could not be applied. See the console (F12).");
      }
    });
  }
});
