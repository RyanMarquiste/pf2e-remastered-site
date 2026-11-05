// The Crafting tab of a character sheet, with the formula books on it. Each formula book the character carries gets a group above Known Formulas.
// The formulas a book teaches are PF2e's own rows, moved into the group, so the Craft button, the quantity box and the chat link keep working.
// A row has a book icon to move it to another book, a formula can be dragged from one group to another, and an item or a formula item dropped on a group
// goes in that book. Formulas that no book gives stay in Known Formulas. Books with nothing in them are shown, with a note.
import { MODULE } from "./shared.js";
import { booksOf, chooseBook, dropOnBook, forgetFormula, moveFormula, supply, sync } from "./formula-books.js";

const STYLE_ID = `${MODULE}-formula-books`;

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .mq-formula-books .mq-book { margin-bottom: 0.4rem; border-radius: 3px; }
    .mq-formula-books .mq-book.mq-over { outline: 2px dashed var(--color-border-highlight, #999); }
    .mq-formula-books .mq-book-header { display: flex; align-items: center; gap: 0.4rem; padding: 0.15rem 0.3rem; cursor: pointer; font-weight: bold; }
    .mq-formula-books .mq-book-header img { width: 1.5rem; height: 1.5rem; border: none; flex: none; }
    .mq-formula-books .mq-book-name { flex: 1; }
    .mq-formula-books .mq-book-count { opacity: 0.7; font-weight: normal; }
    .mq-formula-books .mq-chevron { transition: transform 0.15s; }
    .mq-formula-books .mq-book.mq-collapsed .mq-chevron { transform: rotate(-90deg); }
    .mq-formula-books .mq-book.mq-collapsed .formula-list { display: none; }
  `;
  document.head.append(style);
}

const collapsedKey = (book) => `${MODULE}.formulaBook.collapsed.${book.id}`;
const isCollapsed = (book) => {
  try {
    return localStorage.getItem(collapsedKey(book)) === "1";
  } catch {
    return false;
  }
};
const setCollapsed = (book, value) => {
  try {
    value ? localStorage.setItem(collapsedKey(book), "1") : localStorage.removeItem(collapsedKey(book));
  } catch {
    // The state is only a convenience.
  }
};

const make = (tag, className = "", text = null) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== null) node.textContent = text;
  return node;
};

const control = (icon, tooltip) => {
  const link = make("a", "mq-control");
  link.dataset.tooltip = tooltip;
  const glyph = make("i", `fa-solid fa-fw ${icon}`);
  link.append(glyph);
  return link;
};

const dragData = (event) => {
  try {
    return (foundry.applications.ux?.TextEditor?.implementation ?? TextEditor).getDragEventData(event);
  } catch {
    return null;
  }
};

const rowName = (row) => row.querySelector("h4.name a, .item-name h4")?.textContent.trim() ?? "this formula";
const rowLevel = (row) => Number(row.dataset.formulaLvl ?? 0);

async function decorate(app, root) {
  const actor = app.actor;
  if (actor?.type !== "character") return;
  const tab = root.querySelector(".tab.crafting");
  const known = tab?.querySelector("section.known-formulas");
  if (!known) return;
  const books = booksOf(actor);
  if (!books.length) return;
  const editable = !!app.isEditable && actor.isOwner;
  if (editable) sync(actor);

  const { map } = await supply(actor);
  if (!known.isConnected || tab.querySelector(".mq-formula-books")) return; // the sheet was drawn again while we were looking things up

  injectStyle();
  const rows = new Map([...known.querySelectorAll("li.formula-item[data-item-uuid]")].map((li) => [li.dataset.itemUuid, li]));
  const levelHeaders = new Map([...known.querySelectorAll("li.formula-level-header")].map((li) => [Number(li.dataset.level), li]));

  const section = make("section", "major mq-formula-books");
  section.append(make("header", "", "Formula Books"));

  for (const book of books) {
    const mine = [...rows].filter(([uuid]) => map.get(uuid)?.[0]?.book.id === book.id).map(([, li]) => li);
    mine.sort((a, b) => rowLevel(a) - rowLevel(b) || rowName(a).localeCompare(rowName(b)));

    const group = make("div", "mq-book");
    group.dataset.bookId = book.id;
    if (isCollapsed(book)) group.classList.add("mq-collapsed");

    const header = make("div", "mq-book-header");
    header.append(make("i", "fa-solid fa-chevron-down mq-chevron"));
    const icon = make("img");
    icon.src = book.img;
    icon.alt = "";
    header.append(icon);
    const name = make("a", "mq-book-name", book.name);
    name.dataset.tooltip = "Open the book";
    name.addEventListener("click", (event) => {
      event.stopPropagation();
      book.sheet.render(true);
    });
    header.append(name, make("span", "mq-book-count", `${mine.length} ${mine.length === 1 ? "formula" : "formulas"}`));
    header.addEventListener("click", () => {
      const collapsed = group.classList.toggle("mq-collapsed");
      setCollapsed(book, collapsed);
    });

    const list = make("ol", "directory-list item-list formula-list");
    let level = null;
    for (const row of mine) {
      if (rowLevel(row) !== level) {
        level = rowLevel(row);
        const original = levelHeaders.get(level);
        if (original) {
          const copy = original.cloneNode(true);
          copy.querySelector(".item-controls")?.remove();
          list.append(copy);
        }
      }
      list.append(row);
      if (!editable) continue;

      const controls = row.querySelector(".item-controls");
      if (!controls) continue;
      controls.querySelector('[data-action="delete-formula"]')?.remove(); // PF2e's delete would be undone by the book, so use our own
      const forget = control("fa-trash", "Remove this formula from the book");
      forget.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const uuid = row.dataset.itemUuid;
        const confirmed =
          event.shiftKey ||
          (await foundry.applications.api.DialogV2.confirm({
            window: { title: "Remove formula", icon: "fa-solid fa-trash" },
            content: `<p>Remove ${foundry.utils.escapeHTML?.(rowName(row)) ?? rowName(row)} from ${foundry.utils.escapeHTML?.(book.name) ?? book.name}? The character will forget it, and any other tier of the same formula in the book.</p>`,
          }));
        if (confirmed) await forgetFormula(actor, uuid);
      });
      controls.append(forget);
    }
    if (!mine.length) {
      const empty = make("li", "formula-header empty");
      empty.append(make("h4", "", "Empty (drag a formula here)"));
      list.append(empty);
    }
    group.append(header, list);

    if (editable) {
      group.addEventListener("dragover", (event) => {
        event.preventDefault();
        group.classList.add("mq-over");
      });
      group.addEventListener("dragleave", (event) => {
        if (!group.contains(event.relatedTarget)) group.classList.remove("mq-over");
      });
      group.addEventListener("drop", async (event) => {
        event.preventDefault();
        event.stopPropagation(); // PF2e would add the dropped item as a formula for itself
        group.classList.remove("mq-over");
        const data = dragData(event);
        if (data) await dropOnBook(actor, book, data).catch((error) => console.error(MODULE, error));
      });
    }
    section.append(group);
  }

  // A book icon on every row, to choose a book.
  if (editable) {
    for (const [uuid, row] of rows) {
      const controls = row.querySelector(".item-controls");
      if (!controls) continue;
      const currentId = map.get(uuid)?.[0]?.book.id ?? null;
      const move = control("fa-book", "Move to a formula book");
      move.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const target = await chooseBook(books, { current: currentId, title: `Move ${rowName(row)}` });
        if (target !== undefined) await moveFormula(actor, uuid, target);
      });
      controls.prepend(move);
    }
  }

  known.before(section);

  // A level heading with no formulas left under it is hidden.
  for (const header of known.querySelectorAll("li.formula-level-header")) {
    let next = header.nextElementSibling;
    let has = false;
    while (next && !next.classList.contains("formula-level-header")) {
      if (next.classList.contains("formula-item")) has = true;
      next = next.nextElementSibling;
    }
    if (!has) header.style.display = "none";
  }
}

Hooks.on("renderCharacterSheetPF2e", (app, html) => {
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (root) decorate(app, root).catch((error) => console.error(MODULE, error));
});
