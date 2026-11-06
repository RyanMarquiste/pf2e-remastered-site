// Splash damage by squares, for a weapon with the Splash trait (the alchemical bombs). PF2e itself does not look at the grid. With this on:
//
//  1. When a splash weapon is thrown at a creature that takes up more than one square, the player clicks which of its squares the bomb lands in. The
//     Damage buttons on the attack roll are held back until that is done (or skipped).
//  2. The splash reaches that square and the squares around it (more rings of squares when something widens it). A creature takes the splash once for
//     every one of its squares that is in that area, so a creature on two of them takes it twice.
//  3. On a hit, the target takes its splash as part of the damage roll, so it is added to the primary damage before resistances and weaknesses. It is
//     never doubled on a critical hit. On a miss only the square the bomb landed in is splashed, so the target takes the splash once.
//
// On a hit, everyone else in the area is listed in the damage roll's own chat message, a row for each with a Splash button that applies their splash
// (it is never halved or doubled), or applied straight away when "Apply splash automatically" is on. A miss splashes no one else. Nothing here changes a bomb's damage dice; it works on the roll PF2e makes. If anything needed is missing (a
// hex or gridless scene, a target on another scene, no square chosen) the roll is left exactly as PF2e made it.
import { MODULE } from "./shared.js";
import { enabled, log } from "./settings.js";
import { esc } from "./formula-books.js";
import { area, footprint, rings, squaresIn } from "./splash-geometry.js";

const SQUARE = "splashSquare"; // on an attack roll message: the square of the target that was chosen
const SKIPPED = "splashSkipped"; // on an attack roll message: no square was chosen, so PF2e's own splash is used
const DAMAGE = "splash"; // on a damage roll message: what the rule worked out

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

// What a splash attack roll was made with and at, if the square rule applies to it: { item, target, cells }. Otherwise null, and `why` is told the
// reason (it is written to the console when Log activity is on, so a missing prompt can be explained).
function splashAttack(message, why = () => {}) {
  const no = (reason) => (why(reason), null);
  const context = message.flags?.pf2e?.context;
  if (context?.type !== "attack-roll") return null;
  if (!enabled("bombSplash")) return no("Splash by squares is off");
  if (!context.target?.token) return no("the attack has no target");
  const item = fromUuidSync(message.flags.pf2e.origin?.uuid ?? "");
  if (!item) return no(`the weapon was not found (${message.flags.pf2e.origin?.uuid})`);
  if (!isSplash(item)) return no(`${item.name} is not a weapon with the Splash trait (traits: ${traitsOf(item).join(", ")})`);
  if (!squareGrid()) return no("the scene is not on a square grid or the canvas is not ready");
  const target = fromUuidSync(context.target.token);
  if (!target) return no(`the target token was not found (${context.target.token})`);
  if (target.parent?.id !== canvas.scene?.id) return no("the target is not on the scene being viewed");
  const cells = cellsOf(target);
  if (cells.length < 2) return no(`${target.name} covers ${cells.length} square (width ${target.width}, height ${target.height})`);
  return { item, target, cells };
}

// Ask which square and keep the answer on the attack roll's chat message. Giving up is kept too, so the damage buttons are not held back for good.
const asking = new Set();
async function chooseSquare(message, { item, target, cells }) {
  if (asking.has(message.id)) return;
  asking.add(message.id);
  try {
    log(`attack: asking for a square of ${target.name} (${cells.length} squares)`);
    ui.notifications.info(`Click the square of ${target.name} that ${item.name} lands in. Right-click or Esc to skip.`);
    const cell = await pickSquare(cells);
    if (cell) await message.setFlag(MODULE, SQUARE, { token: target.uuid, i: cell.i, j: cell.j });
    else {
      await message.setFlag(MODULE, SKIPPED, true);
      ui.notifications.info("No square chosen: PF2e's own splash is used.");
    }
  } catch (error) {
    warn("choosing a square failed", error);
    ui.notifications.warn("Splash by squares could not ask for a square. See the console (F12).");
    await message.setFlag(MODULE, SKIPPED, true).catch(() => null);
  } finally {
    asking.delete(message.id);
  }
}

// When a splash weapon is thrown at a big target, ask which square.
Hooks.on("createChatMessage", async (message) => {
  if (message.flags?.pf2e?.context?.type !== "attack-roll") return;
  if (message.author?.id !== game.user.id) return log(`attack: no square prompt, rolled by ${message.author?.name ?? "someone else"}, not this user`);
  try {
    const info = splashAttack(message, (reason) => log(`attack: no square prompt, ${reason}`));
    if (info) await chooseSquare(message, info);
  } catch (error) {
    warn("choosing a square failed", error);
    ui.notifications.warn("Splash by squares could not ask for a square. See the console (F12).");
  }
});

// Until the square is chosen (or given up), the Damage buttons on the attack roll are held back, so the damage cannot be rolled without it. Whoever can
// edit the message gets buttons to choose the square again or to skip it. An attack from before the last hour is left alone.
Hooks.on("renderChatMessageHTML", (message, html) => {
  try {
    const flags = message.flags?.[MODULE] ?? {};
    if (message.flags?.pf2e?.context?.type !== "attack-roll" || flags[SQUARE] || flags[SKIPPED]) return;
    if (Date.now() - (message.timestamp ?? 0) > 60 * 60 * 1000) return;
    const info = splashAttack(message);
    if (!info) return;
    for (const button of html.querySelectorAll('button[data-action="strike-damage"]')) button.disabled = true;

    const note = document.createElement("div");
    note.className = "marquiste-splash-wait";
    const text = document.createElement("p");
    text.innerHTML = `<em>Choose the square of ${esc(info.target.name)} it lands in, then roll damage.</em>`;
    note.append(text);
    if (message.canUserModify?.(game.user, "update")) {
      const add = (label, action) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.addEventListener("click", action);
        note.append(button);
      };
      add("Choose square", () => chooseSquare(message, info));
      add("Skip", () => message.setFlag(MODULE, SKIPPED, true));
    }
    (html.querySelector(".message-content") ?? html).append(note);
  } catch (error) {
    warn("could not hold back the damage buttons", error);
  }
});

Hooks.once("ready", () => log("splash by squares is loaded"));

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
  const pf2e = message.flags?.pf2e;
  const context = pf2e?.context;
  if (context?.type !== "damage-roll") return;
  const skip = (reason) => log(`damage: PF2e's roll left as it was, ${reason}`);
  if (userId !== game.user.id) return;
  if (!enabled("bombSplash")) return skip("Splash by squares is off");
  if (!context.target?.token) return skip("the roll has no target");
  try {
    const item = fromUuidSync(pf2e.origin?.uuid ?? "");
    if (!isSplash(item) || !squareGrid()) return skip(`${item?.name ?? "the weapon"} is not a splash weapon, or the scene is not a square grid`);
    const outcome = context.outcome ?? null;
    if (outcome === "criticalFailure") return skip("a critical failure deals no splash");
    const target = fromUuidSync(context.target.token);
    if (!target || target.parent?.id !== canvas.scene?.id) return skip("the target is not on the scene being viewed");

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
    if (!centre) return skip(`no square was chosen for ${target.name}`);

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
    if (!parts.some((part) => part.splash > 0)) return skip("the roll has no splash damage");

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
    for (const token of hit ? canvas.scene.tokens : []) {
      if (token.id === target.id || !token.actor?.isOfType?.("creature")) continue;
      const squares = squaresIn(cellsOf(token), areaKeys);
      if (!squares) continue;
      entries.push({
        token: token.uuid,
        name: token.name,
        img: token.actor.img,
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
            auto: !!game.users.activeGM && game.settings.get(MODULE, "bombSplashAutoApply"),
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
// The other creatures, in the damage roll's own chat message

const amounts = (parts) => parts.map((part) => `${part.amount} ${typeLabel(part.type)}`).join(", ");

// Apply one creature's splash, the way PF2e's own damage buttons do: a splash damage roll, run through that creature's resistances and weaknesses.
// Splash is applied as it is: never halved or doubled.
async function applyEntry(splash, index) {
  const entry = splash.entries[index];
  const token = await fromUuid(entry.token);
  const actor = token?.actor;
  if (!actor) return false;
  const item = await fromUuid(splash.item);
  const Damage = CONFIG.Dice.rolls.find((roll) => roll.name === "DamageRoll");
  const origin = splash.options.filter((option) => option.startsWith("self:")).map((option) => option.replace(/^self\b/, "origin"));
  const rest = splash.options.filter((option) => !/^(?:self|target)(?::|$)/.test(option));
  const rollOptions = new Set([...rest, ...origin, ...actor.getSelfRollOptions()]);
  for (const part of entry.parts) {
    const roll = new Damage(`(${part.amount}[splash])[${[part.type, ...part.materials].join(",")}]`);
    await roll.evaluate();
    roll.options.splashOnly = true;
    await actor.applyDamage({ damage: roll, token, item, rollOptions, outcome: splash.outcome });
  }
  return true;
}

// With automatic application on, the active GM's screen applies everything as the damage message appears.
Hooks.on("createChatMessage", async (message) => {
  const splash = message.flags?.[MODULE]?.[DAMAGE];
  if (!splash?.auto || game.users.activeGM?.id !== game.user.id) return;
  for (let index = 0; index < splash.entries.length; index++) {
    try {
      await applyEntry(splash, index);
    } catch (error) {
      warn(`could not apply splash to ${splash.entries[index].name}`, error);
    }
  }
});

// The rows themselves, added to the damage message under PF2e's own buttons: a picture and name for each creature, how many squares and how much,
// and a Splash button (or "Applied" when it was done automatically).
Hooks.on("renderChatMessageHTML", (message, html) => {
  const splash = message.flags?.[MODULE]?.[DAMAGE];
  if (!splash || (!splash.entries.length && splash.target.squares < 2) || html.querySelector(".marquiste-splash")) return;
  try {
    const make = (tag, className, text) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const label = (key, fallback) => {
      const text = game.i18n.localize(key);
      return text === key ? fallback : text;
    };
    const box = make("div", "marquiste-splash");
    box.style.cssText = "border-top: 1px solid var(--color-border-light-2, #999); margin-top: .4em; padding-top: .3em;";
    const reach = splash.rings ? `${splash.rings * 5} ft${splash.widenedBy.length ? ` (${splash.widenedBy.join(", ")})` : ""}` : "the square it landed in";
    box.append(make("h4", "", `Splash: ${reach}`));

    if (splash.target.squares > 1) {
      const counted = splash.target.parts.map((part) => ({ ...part, amount: part.splash * splash.target.squares }));
      box.append(make("p", "", `${splash.target.name} covers ${splash.target.squares} squares of it, so its splash counts ${splash.target.squares} times (${amounts(counted)}) in the roll above.`));
    }

    splash.entries.forEach((entry, index) => {
      const row = make("div", "marquiste-splash-row");
      row.style.cssText = "margin: .35em 0; display: flex; align-items: center; justify-content: space-between; gap: .5em;";
      const title = make("div");
      title.style.cssText = "display: flex; align-items: center; gap: .1em .4em; flex: 1 1 auto; flex-wrap: wrap;";
      if (entry.img) {
        const image = make("img");
        image.src = entry.img;
        image.alt = "";
        image.style.cssText = "width: 1.6em; height: 1.6em; border: none; flex: none;";
        title.append(image);
      }
      const name = make("strong", "", entry.name);
      title.append(name, make("span", "", `${entry.squares} ${entry.squares === 1 ? "square" : "squares"}: ${amounts(entry.parts)}`));
      row.append(title);

      if (splash.auto) row.append(make("em", "", "Applied automatically."));
      else {
        const bar = make("div", "marquiste-splash-buttons"); // not PF2e's damage-application class: the damage card moves those buttons into the target's row
        bar.style.cssText = "flex: none;";
        const button = make("button");
        button.type = "button";
        button.style.cssText = "width: auto; line-height: 1.6; padding: 0 .7em;";
        button.title = `Apply the splash damage to ${entry.name}`;
        button.append(make("i", "fa-solid fa-burst fa-fw"), make("span", "label", label("PF2E.TraitSplash", "Splash")));
        // Once it has been applied the button is greyed out, here at once and on every screen once the message records it (only someone who can edit
        // the message can record it; for anyone else the button is greyed out on their own screen only).
        if (splash.applied?.[index]) button.disabled = true;
        button.addEventListener("click", async () => {
          const token = await fromUuid(entry.token);
          if (!token?.actor?.canUserModify(game.user, "update")) {
            ui.notifications.warn(`You can't change ${entry.name}. Ask the GM to press the button.`);
            return;
          }
          button.disabled = true; // so it cannot be pressed twice while it is working
          try {
            await applyEntry(splash, index);
            await message.update({ [`flags.${MODULE}.${DAMAGE}.applied.${index}`]: true }).catch(() => null);
          } catch (error) {
            button.disabled = false;
            warn("apply failed", error);
            ui.notifications.error("The splash could not be applied. See the console (F12).");
          }
        });
        bar.append(button);
        row.append(bar);
      }
      box.append(row);
    });
    (html.querySelector(".message-content") ?? html).append(box);
  } catch (error) {
    warn("could not show the splash rows", error);
  }
});
