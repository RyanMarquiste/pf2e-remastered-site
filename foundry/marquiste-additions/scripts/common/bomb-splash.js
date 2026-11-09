// Splash targets, for a weapon with the Splash trait (the alchemical bombs). PF2e leaves it to the table to work out who is close enough to be splashed
// and to apply it by hand. With this on:
//
//  1. When the damage for a splash weapon is rolled on a hit, every other creature within the splash's reach of the target is listed in the damage roll's own
//     chat message. The reach is 5 feet, and 5 feet more for each thing that widens it (Expanded Splash, the Splash 10 ft trait, and the bomb's critical
//     specialization on a critical hit), up to 15 feet. It is measured from the target, between the nearest squares, with PF2e's rule for diagonals.
//  2. Each creature gets a row with a Splash button that applies its splash (it is never halved or doubled), or it is applied straight away when
//     "Apply splash automatically" is on. A miss splashes no one else.
//  3. The attack roll decides hit or miss, because PF2e's Damage button on the attack card always rolls damage as a hit. After a miss the damage roll becomes
//     just the splash, taken once by the target. A critical failure deals no splash.
//
// Nothing here changes a bomb's damage dice or the target's damage on a hit; it works on the roll PF2e makes. If anything needed is missing (a hex or
// gridless scene, a target on another scene) the roll is left exactly as PF2e made it.
import { MODULE } from "./shared.js";
import { enabled, log } from "./settings.js";
import { block, reach, within } from "./splash-geometry.js";

const DAMAGE = "splash"; // on a damage roll message: what the rule worked out

const traitsOf = (item) => [...(item?.system?.traits?.value ?? [])];
const isSplash = (item) => !!item?.isOfType?.("weapon") && traitsOf(item).some((t) => t === "splash" || /^splash-\d+$/.test(t));
const squareGrid = () => !!canvas?.ready && canvas.grid?.type === CONST.GRID_TYPES.SQUARE;
const warn = (...args) => console.warn(`${MODULE} | splash:`, ...args);

// The squares a token covers.
function blockOf(token) {
  const size = canvas.grid.size;
  const top = canvas.grid.getOffset({ x: token.x + size / 2, y: token.y + size / 2 });
  return block(top, Math.round(token.height), Math.round(token.width));
}

Hooks.once("ready", () => log("splash targets is loaded"));

const typeLabel = (type) => {
  const label = CONFIG.PF2E?.damageTypes?.[type];
  return label ? game.i18n.localize(label) : type;
};

// ---------------------------------------------------------------------------------------------------------------------------------------------
// The damage roll

// A damage roll for a splash weapon is changed before it is posted: after a miss it becomes just the splash, the separate splash rolls PF2e attaches
// (which a player applies by hand) are dropped, and who else is splashed is kept on the message for the card.
Hooks.on("preCreateChatMessage", (message, data, options, userId) => {
  const pf2e = message.flags?.pf2e;
  const context = pf2e?.context;
  if (context?.type !== "damage-roll") return;
  const skip = (reason) => log(`damage: PF2e's roll left as it was, ${reason}`);
  if (userId !== game.user.id) return;
  if (!enabled("bombSplash")) return skip("Splash targets is off");
  if (!context.target?.token) return skip("the roll has no target");
  try {
    const item = fromUuidSync(pf2e.origin?.uuid ?? "");
    if (!isSplash(item) || !squareGrid()) return skip(`${item?.name ?? "the weapon"} is not a splash weapon, or the scene is not a square grid`);
    const target = fromUuidSync(context.target.token);
    if (!target || target.parent?.id !== canvas.scene?.id) return skip("the target is not on the scene being viewed");

    // What the attack roll was. The card's Damage button always rolls damage as a hit, even after a miss, so the attack's own result decides.
    const attack = game.messages.contents.findLast(
      (m) =>
        m.author?.id === userId &&
        m.flags?.pf2e?.context?.type === "attack-roll" &&
        m.flags.pf2e.origin?.uuid === pf2e.origin?.uuid &&
        m.flags.pf2e.context.target?.token === target.uuid
    );
    const attackOutcome = attack?.flags?.pf2e?.context?.outcome ?? null;
    const outcome = attackOutcome === "failure" || attackOutcome === "criticalFailure" ? attackOutcome : (context.outcome ?? null);
    if (outcome === "criticalFailure") return skip("a critical failure deals no splash");

    // How far it reaches. A miss splashes only the target.
    const hit = outcome !== "failure";
    const rollOptions = new Set(context.options ?? []);
    const widenedBy = [];
    if (hit) {
      if (rollOptions.has("expanded-splash")) widenedBy.push("Expanded Splash");
      if (traitsOf(item).includes("splash-10")) widenedBy.push("Splash 10 ft");
      if (outcome === "criticalSuccess" && rollOptions.has("critical-specialization")) widenedBy.push("bomb critical specialization");
    }
    const squares = hit ? reach(widenedBy) : 0;

    const sources = message._source.rolls.map((roll) => (typeof roll === "string" ? roll : JSON.stringify(roll)));
    const primaryAt = sources.findIndex((source) => !JSON.parse(source).options?.splashOnly);
    if (primaryAt < 0) return;
    const primary = Roll.fromJSON(sources[primaryAt]);
    if (!primary.instances?.length) return;
    const parts = primary.instances
      .map((instance) => ({
        type: instance.type,
        materials: [...instance.materials],
        splash: instance.persistent ? 0 : instance.componentTotal("splash"),
      }))
      .filter((part) => part.splash > 0);
    if (!parts.length) return skip("the roll has no splash damage");

    // On a miss the damage roll is only the splash, taken once: PF2e's own splash-only rolls take the place of the damage roll.
    const rolls = hit ? sources.filter((_, index) => !JSON.parse(sources[index]).options?.splashOnly) : sources.filter((source) => JSON.parse(source).options?.splashOnly);
    if (!rolls.length) return skip("PF2e made no splash roll to use");

    // Everyone else within reach of the target.
    const entries = [];
    if (hit) {
      const middle = blockOf(target);
      for (const token of canvas.scene.tokens) {
        if (token.id === target.id || !token.actor?.isOfType?.("creature")) continue;
        const other = blockOf(token);
        if (!within(middle, other, squares)) continue;
        entries.push({
          token: token.uuid,
          name: token.name,
          img: token.actor.img,
          parts: parts.map((part) => ({ type: part.type, materials: part.materials, amount: part.splash })),
        });
      }
    }

    const changes = { rolls };
    if (!hit && context.outcome !== outcome) {
      changes.flags = { pf2e: { context: { outcome } } };
      const label = (key) => `(${game.i18n.localize(`PF2E.AttackOutcome.${key}`)})`;
      if (message.flavor?.includes(label(context.outcome))) changes.flavor = message.flavor.replace(label(context.outcome), label(outcome));
    }
    message.updateSource(foundry.utils.mergeObject(changes, {
      flags: {
        [MODULE]: {
          [DAMAGE]: {
            item: item.uuid,
            outcome,
            feet: squares * 5,
            widenedBy,
            entries,
            auto: !!game.users.activeGM && game.settings.get(MODULE, "bombSplashAutoApply"),
            options: [...rollOptions],
          },
        },
      },
    }));
    log(`splash for ${item.name} on ${target.name}: ${squares * 5} ft, ${entries.length} others`);
  } catch (error) {
    warn("left PF2e's roll as it was:", error);
    ui.notifications.warn("Splash targets could not be worked out for this roll, so PF2e's own splash was used. See the console (F12).");
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

// The rows themselves, added to the damage message under PF2e's own buttons: a picture and name for each creature, how much it takes, and a Splash
// button (or "Applied" when it was done automatically).
Hooks.on("renderChatMessageHTML", (message, html) => {
  const splash = message.flags?.[MODULE]?.[DAMAGE];
  if (!splash || !splash.entries.length || html.querySelector(".marquiste-splash")) return;
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
    box.append(make("h4", "", `Splash: ${splash.feet} ft${splash.widenedBy.length ? ` (${splash.widenedBy.join(", ")})` : ""}`));

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
      title.append(make("strong", "", entry.name), make("span", "", amounts(entry.parts)));
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
