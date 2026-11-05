// Formula books. A formula book is PF2e's own Formula Book item. It holds a list of entries in a flag, and the character learns what the entries
// describe. An entry is one of two things:
//   - a formula item (an item with the Formula trait whose flags list the tiers of one family of items): it teaches every tier at or below
//     the character's level, so the character gains the next tier on levelling up;
//   - a plain item (any physical item): it teaches that one item.
// The character's real formula list (system.crafting.formulas, which PF2e's Craft button reads) is kept in step with the books. The formulas this
// script adds are remembered in an actor flag, so a formula a player added by hand is never taken away. The Crafting tab shows the groups (crafting-tab.js).
import { MODULE } from "./shared.js";

export const BOOK_SOURCE = "Compendium.pf2e.equipment-srd.Item.qCEOZ6109Yo34tRx"; // PF2e's Formula Book (Blank)
const ENTRIES = "entries"; // flag on a book: the entries it holds, in order
const OURS = "bookFormulas"; // flag on the actor: the formulas this script added to its list

export const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const isBook = (item) =>
  item?.type === "equipment" && ((item.sourceId ?? item._stats?.compendiumSource) === BOOK_SOURCE || /^formula-book/.test(item.slug ?? ""));

export const booksOf = (actor) => actor.items.filter(isBook).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0) || a.name.localeCompare(b.name));
export const entriesOf = (book) => [...(book.getFlag(MODULE, ENTRIES) ?? [])];

// What an entry is, looked up once per entry. A formula item is a Formula-trait item that lists its tiers.
const cache = new Map();
export function describe(uuid) {
  if (!cache.has(uuid)) {
    const lookup = (async () => {
      const doc = await fromUuid(uuid);
      if (!doc) return { ok: false };
      const traits = doc.system?.traits?.value ?? [];
      const tiers = doc.getFlag?.(MODULE, "formula")?.tiers;
      const isFormulaItem = doc.type === "equipment" && traits.includes("formula");
      return {
        ok: true,
        name: doc.name,
        isFormulaItem,
        tiers: isFormulaItem && Array.isArray(tiers) ? tiers : null,
        physical: !!doc.isOfType?.("physical"),
      };
    })().catch(() => ({ ok: false }));
    cache.set(uuid, lookup);
    lookup.then((d) => d.ok || cache.delete(uuid));
  }
  return cache.get(uuid);
}

// The items an entry teaches a character: a formula item gives its tiers up to the character's level; a plain item gives itself.
async function expand(actor, entry) {
  const d = await describe(entry);
  if (!d.ok) return { ok: false, uuids: [] };
  if (d.isFormulaItem && !d.tiers) return { ok: false, uuids: [] };
  const level = actor.system.details?.level?.value ?? 1;
  return { ok: true, uuids: d.tiers ? d.tiers.filter((t) => t.level <= level).map((t) => t.uuid) : [entry] };
}

// Every formula the books give, as a map from the formula's item uuid to the books and entries that give it. ok is false if some entry could
// not be read (such as an item from a module that is turned off), so nothing is taken away on incomplete information.
export async function supply(actor) {
  const map = new Map();
  let ok = true;
  for (const book of booksOf(actor)) {
    for (const entry of entriesOf(book)) {
      const result = await expand(actor, entry);
      if (!result.ok) {
        ok = false;
        continue;
      }
      for (const uuid of result.uuids) {
        if (!map.has(uuid)) map.set(uuid, []);
        map.get(uuid).push({ book, entry });
      }
    }
  }
  return { ok, map };
}

// Keep the character's formula list in step with the books. Runs one at a time for each actor.
const queues = new Map();
export function sync(actor) {
  const run = (queues.get(actor.id) ?? Promise.resolve()).then(() => doSync(actor)).catch((error) => console.error(MODULE, error));
  queues.set(actor.id, run);
  return run;
}

async function doSync(actor) {
  if (actor.type !== "character" || !actor.isOwner) return;
  const { ok, map } = await supply(actor);
  const desired = new Set(map.keys());
  const formulas = actor.toObject().system.crafting?.formulas ?? [];
  const current = new Set(formulas.map((f) => f.uuid));
  const previous = actor.getFlag(MODULE, OURS) ?? [];

  const removed = ok ? previous.filter((uuid) => !desired.has(uuid)) : [];
  const added = [...desired].filter((uuid) => !current.has(uuid));
  const ours = [...new Set([...previous.filter((uuid) => !removed.includes(uuid) && (current.has(uuid) || desired.has(uuid))), ...added])];

  const listChanged = removed.some((uuid) => current.has(uuid)) || added.length > 0;
  const oursChanged = JSON.stringify(ours) !== JSON.stringify(previous);
  if (!listChanged && !oursChanged) return;
  const update = {};
  if (listChanged) update["system.crafting.formulas"] = formulas.filter((f) => !removed.includes(f.uuid)).concat(added.map((uuid) => ({ uuid })));
  if (oursChanged) update[`flags.${MODULE}.${OURS}`] = ours;
  await actor.update(update);
}

// Put entries in a book, taking them out of any other. With no book, they leave their books but the formulas stay known.
export async function placeEntries(actor, entries, target) {
  if (!target) {
    const { map } = await supply(actor);
    const keep = new Set();
    for (const [uuid, givers] of map) if (givers.some((g) => entries.includes(g.entry))) keep.add(uuid);
    const ours = (actor.getFlag(MODULE, OURS) ?? []).filter((uuid) => !keep.has(uuid));
    await actor.update({ [`flags.${MODULE}.${OURS}`]: ours });
  }
  const updates = [];
  for (const book of booksOf(actor)) {
    const before = entriesOf(book);
    let list = before.filter((entry) => !entries.includes(entry));
    if (target && book.id === target.id) list = [...list, ...entries];
    if (JSON.stringify(list) !== JSON.stringify(before)) updates.push({ _id: book.id, [`flags.${MODULE}.${ENTRIES}`]: list });
  }
  if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
  await sync(actor);
}

// The entries that give a formula. A formula learned without a book is its own plain entry.
async function entriesFor(actor, uuid) {
  const { map } = await supply(actor);
  const entries = [...new Set((map.get(uuid) ?? []).map((g) => g.entry))];
  return entries.length ? entries : [uuid];
}

export async function moveFormula(actor, uuid, target) {
  return placeEntries(actor, await entriesFor(actor, uuid), target);
}

// Take the formula, and everything else its entry gives, out of its book and forget it.
export async function forgetFormula(actor, uuid) {
  const entries = await entriesFor(actor, uuid);
  const { map } = await supply(actor);
  const forgotten = new Set([uuid]);
  for (const [formula, givers] of map) if (givers.some((g) => entries.includes(g.entry))) forgotten.add(formula);

  const updates = [];
  for (const book of booksOf(actor)) {
    const before = entriesOf(book);
    const list = before.filter((entry) => !entries.includes(entry));
    if (list.length !== before.length) updates.push({ _id: book.id, [`flags.${MODULE}.${ENTRIES}`]: list });
  }
  if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);

  // The formulas go too, even one the character knew before it was put in the book.
  const formulas = actor.toObject().system.crafting?.formulas ?? [];
  const ours = actor.getFlag(MODULE, OURS) ?? [];
  await actor.update({
    "system.crafting.formulas": formulas.filter((f) => !forgotten.has(f.uuid)),
    [`flags.${MODULE}.${OURS}`]: ours.filter((u) => !forgotten.has(u)),
  });
  await sync(actor);
}

// Ask which book. Resolves to a book, to null for "no book", or to undefined if the player cancelled.
export async function chooseBook(books, { current = null, allowNone = true, title = "Formula book" } = {}) {
  const options = books.map((b) => `<option value="${b.id}"${b.id === current ? " selected" : ""}>${esc(b.name)}</option>`).join("");
  const none = allowNone ? `<option value="">No book (keep it in Known Formulas)</option>` : "";
  const content = `<div class="form-group"><label>Formula book</label><div class="form-fields"><select name="book">${options}${none}</select></div></div>`;
  const value = await foundry.applications.api.DialogV2.prompt({
    window: { title },
    content,
    ok: { label: "OK", callback: (event, button) => button.form.elements.book.value },
    rejectClose: false,
  });
  if (value === null || value === undefined) return undefined;
  return value ? books.find((b) => b.id === value) ?? undefined : null;
}

// Something was dropped on a book group: a formula row dragged from the Crafting tab, or an item.
export async function dropOnBook(actor, book, data) {
  if (data.isFormula && data.uuid) return moveFormula(actor, data.uuid, book);
  if (data.type !== "Item" || !data.uuid) return;
  const doc = await fromUuid(data.uuid);
  if (!doc) return;
  // An item the character owns teaches the item it was made from.
  const uuid = doc.actor ? doc.sourceId ?? doc._stats?.compendiumSource ?? null : data.uuid;
  if (!uuid) return ui.notifications.warn(`${doc.name} was not made from a compendium item, so it has no formula to learn.`);
  const d = await describe(uuid);
  if (!d.ok) return ui.notifications.warn(`Could not find ${doc.name}.`);
  if (d.isFormulaItem && !d.tiers) return ui.notifications.warn(`${d.name} does not say which items it makes, so it cannot go in a book.`);
  if (!d.isFormulaItem && !d.physical) return ui.notifications.warn(`${d.name} is not an item that can be crafted.`);
  return placeEntries(actor, [uuid], book);
}

// PF2e treats anything dropped on the Crafting tab as a formula for that very item. A formula item is not meant to be crafted: it belongs in a
// book. So when one turns up in the formula list, take it out and ask which book it goes in.
async function redirectFormulaItems(actor) {
  const formulas = actor.toObject().system.crafting?.formulas ?? [];
  const found = [];
  for (const { uuid } of formulas) {
    const d = await describe(uuid);
    if (d.ok && d.isFormulaItem) found.push(uuid);
  }
  if (!found.length) return;
  await actor.update({ "system.crafting.formulas": formulas.filter((f) => !found.includes(f.uuid)) });

  const books = booksOf(actor);
  for (const uuid of found) {
    const d = await describe(uuid);
    if (!books.length) {
      ui.notifications.warn(`${d.name} goes in a formula book. Add a Formula Book to your inventory, then drop the formula on the book.`);
      continue;
    }
    const book = books.length === 1 ? books[0] : await chooseBook(books, { allowNone: false, title: `Which book for ${d.name}?` });
    if (book) await dropOnBook(actor, book, { type: "Item", uuid });
  }
}

const mine = (userId) => userId === game.user.id;
const onBook = (item, userId) => {
  if (mine(userId) && item.actor && isBook(item)) sync(item.actor);
};
Hooks.on("createItem", (item, options, userId) => onBook(item, userId));
Hooks.on("updateItem", (item, changes, options, userId) => onBook(item, userId));
Hooks.on("deleteItem", (item, options, userId) => onBook(item, userId));

Hooks.on("updateActor", (actor, changes, options, userId) => {
  if (!mine(userId) || actor.type !== "character") return;
  if (foundry.utils.hasProperty(changes, "system.details.level.value")) sync(actor);
  if (foundry.utils.hasProperty(changes, "system.crafting.formulas")) redirectFormulaItems(actor).catch((error) => console.error(MODULE, error));
});
