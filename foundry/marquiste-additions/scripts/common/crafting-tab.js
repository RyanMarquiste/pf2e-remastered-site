// The Crafting tab of a character sheet, with the formula books on it. Each formula book the character carries gets its own section above Known
// Formulas, built like PF2e's own sections: the book's name as the title, with a Rename button and a Browse button on the right.
// The formulas a book teaches are PF2e's own rows, moved into the section, so the Craft button, the quantity box and the chat link keep working.
// A row has a book icon to move it to another book, a formula can be dragged from one book to another, and an item or a formula item dropped on a
// book goes in that book. Formulas that no book gives stay in Known Formulas. Books with nothing in them are shown, with a note.
import { MODULE } from "./shared.js";
import { enabled } from "./settings.js";
import { booksOf, chooseBook, dropOnBook, esc, forgetFormula, moveFormula, supply, sync } from "./formula-books.js";

const STYLE_ID = `${MODULE}-formula-books`;

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .mq-formula-books .mq-book.mq-over { outline: 2px dashed var(--color-border-highlight, #999); }
    .mq-formula-books .mq-book > header { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; }
    .mq-formula-books .mq-book > header img { width: 1.25rem; height: 1.25rem; border: none; flex: none; }
    .mq-formula-books .mq-book > header .mq-book-count { font-size: var(--font-size-12, 12px); font-weight: normal; opacity: 0.7; }
    .mq-formula-books .mq-book > header .mq-book-name { color: inherit; font-size: inherit; }
    .mq-formula-books .mq-book > header .controls { cursor: default; }
    .mq-formula-books .mq-chevron { transition: transform 0.15s; font-size: 0.8em; }
    .mq-formula-books .mq-book.mq-collapsed .mq-chevron { transform: rotate(-90deg); }
    .mq-formula-books .mq-book.mq-collapsed > .formula-list { display: none; }
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

// A small icon link in a row's controls.
const control = (icon, tooltip) => {
  const link = make("a", "mq-control");
  link.dataset.tooltip = tooltip;
  link.append(make("i", `fa-solid fa-fw ${icon}`));
  return link;
};

// A button in a section's header, styled by PF2e like Known Formulas' Free Crafting and Browse buttons.
const headerButton = (icon, tooltip, label = "") => {
  const button = make("button");
  button.type = "button";
  if (tooltip) button.dataset.tooltip = tooltip;
  button.append(make("i", `fa-solid fa-fw ${icon}`));
  if (label) button.append(label);
  return button;
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

// Give the book a name of the player's choosing; it is the name of the item as well.
async function renameBook(book) {
  const value = await foundry.applications.api.DialogV2.prompt({
    window: { title: "Name this formula book" },
    content: `<div class="form-group"><label>Name</label><div class="form-fields"><input type="text" name="name" value="${esc(book.name)}" autofocus></div></div>`,
    ok: { label: "Rename", callback: (event, button) => button.form.elements.name.value },
    rejectClose: false,
  });
  const name = typeof value === "string" ? value.trim() : "";
  if (name && name !== book.name) await book.update({ name });
}

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
  const browseLabel = game.i18n?.localize("PF2E.BrowseLabel");

  const wrapper = make("div", "mq-formula-books");

  for (const book of books) {
    const mine = [...rows].filter(([uuid]) => map.get(uuid)?.[0]?.book.id === book.id).map(([, li]) => li);
    mine.sort((a, b) => rowLevel(a) - rowLevel(b) || rowName(a).localeCompare(rowName(b)));

    const group = make("section", "major item-container mq-book");
    group.dataset.bookId = book.id;
    if (isCollapsed(book)) group.classList.add("mq-collapsed");

    // The title bar: the book's name, and on the right the buttons.
    const header = make("header");
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

    const controls = make("div", "controls");
    if (editable) {
      const rename = headerButton("fa-pen", "Name this formula book");
      rename.addEventListener("click", (event) => {
        event.stopPropagation();
        renameBook(book).catch((error) => console.error(MODULE, error));
      });
      controls.append(rename);
    }
    // PF2e's own Browse button: it opens the Compendium Browser's equipment tab. What is found there can be dragged onto the book.
    const browse = headerButton("fa-search", "", browseLabel && browseLabel !== "PF2E.BrowseLabel" ? browseLabel : "Browse");
    browse.dataset.action = "browse-equipment";
    controls.append(browse);
    header.append(controls);
    header.addEventListener("click", (event) => {
      if (event.target.closest(".controls")) return;
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

      const rowControls = row.querySelector(".item-controls");
      if (!rowControls) continue;
      rowControls.querySelector('[data-action="delete-formula"]')?.remove(); // PF2e's delete would be undone by the book, so use our own
      const forget = control("fa-trash", "Remove this formula from the book");
      forget.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const uuid = row.dataset.itemUuid;
        const confirmed =
          event.shiftKey ||
          (await foundry.applications.api.DialogV2.confirm({
            window: { title: "Remove formula", icon: "fa-solid fa-trash" },
            content: `<p>Remove ${esc(rowName(row))} from ${esc(book.name)}? The character will forget it, and any other tier of the same formula in the book.</p>`,
          }));
        if (confirmed) await forgetFormula(actor, uuid);
      });
      rowControls.append(forget);
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
    wrapper.append(group);
  }

  // A book icon on every row, to choose a book.
  if (editable) {
    for (const [uuid, row] of rows) {
      const rowControls = row.querySelector(".item-controls");
      if (!rowControls) continue;
      const currentId = map.get(uuid)?.[0]?.book.id ?? null;
      const move = control("fa-book", "Move to a formula book");
      move.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const target = await chooseBook(books, { current: currentId, title: `Move ${rowName(row)}` });
        if (target !== undefined) await moveFormula(actor, uuid, target);
      });
      rowControls.prepend(move);
    }
  }

  known.before(wrapper);

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
  if (!enabled("formulaBooks")) return;
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (root) decorate(app, root).catch((error) => console.error(MODULE, error));
});

// Switched on or off: open character sheets draw the Crafting tab again so the change shows without closing them.
Hooks.on(`${MODULE}.settingChanged`, (key) => {
  if (key !== "formulaBooks") return;
  for (const app of Object.values(ui.windows ?? {})) if (app.actor?.type === "character") app.render();
});
