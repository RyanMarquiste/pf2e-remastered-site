// The Add recipes list of a cookbook, and the Add formulas list of an alchemy formula book (the same screen for both). PF2e's Compendium Browser can't filter by the alchemical-food tag, so a cookbook gets
// a list of its own: every alchemical food in the item compendiums, searchable, with a Common only box, and the formula items whose tiers are foods (Formula: Ginger Chew teaches every tier up to the
// character's level). The alchemy formula book's list is every other alchemical item (elixirs, bombs, poisons, tools and so on) and the formula items whose tiers are those (such as the mutagens).
// The ones ticked go in the book. Uncommon and rare items are listed with their rarity, so a GM who allows one can have a character pick it.
import { MODULE, say } from "./shared.js";
import { entriesOf, esc, FOOD_TAG, isAlchemical, isAlchemyBook, isFood, placeEntries } from "./formula-books.js";

// What each kind of book lists. `item` says whether a compendium entry is one of its items, `made` whether an item a formula item teaches is.
const PHYSICAL = new Set(["consumable", "equipment", "weapon", "armor", "shield", "backpack", "treasure", "kit"]);
// The Alchemist pack's own items (the vials) come from Quick Vial and Create Consumable, not from formulas, so only its formula items are listed.
const ALCHEMIST_PACK = `${MODULE}.marquiste-alchemist-class`;
const KINDS = {
  food: {
    item: (entry) => entry.system?.traits?.otherTags?.includes(FOOD_TAG),
    made: (doc) => isFood(doc),
    storage: `${MODULE}.cookbook.commonOnly`,
    title: (book) => `Add recipes to ${book.name}`,
    icon: "fa-solid fa-utensils",
    search: "Search recipes",
    none: "No alchemical foods were found in the compendiums.",
    noun: "recipes",
  },
  alchemy: {
    item: (entry, pack) =>
      pack.collection !== ALCHEMIST_PACK && PHYSICAL.has(entry.type) && entry.system?.traits?.value?.includes("alchemical") && !entry.system?.traits?.otherTags?.includes(FOOD_TAG),
    made: (doc) => isAlchemical(doc) && !isFood(doc),
    storage: `${MODULE}.alchemy.commonOnly`,
    title: (book) => `Add formulas to ${book.name}`,
    icon: "fa-solid fa-flask",
    search: "Search formulas",
    none: "No alchemical items were found in the compendiums.",
    noun: "formulas",
  },
};
const kindOf = (book) => (isAlchemyBook(book) ? "alchemy" : "food");

// The system's own item compendiums are big, and food is only in the equipment one; the other packs (modules and the world) are all looked at.
const SYSTEM_PACKS = ["equipment-srd"];

// What buying a formula costs by level: PF2e's Formula Price table, in copper. A formula item that teaches several tiers costs only what its lowest tier does.
const FORMULA_GP = [0.5, 1, 2, 3, 5, 8, 13, 18, 25, 35, 50, 70, 100, 150, 225, 325, 500, 750, 1200, 2000, 3500];
export const formulaCost = (level) => Math.round(FORMULA_GP[Math.max(0, Math.min(20, level))] * 100);
const COIN_YELLOW = "#e6b422";
const COIN_ORANGE = "#e8731a";
const coinColor = (affordable) => (affordable ? COIN_YELLOW : COIN_ORANGE);
const price = (cp) => {
  const parts = [[Math.floor(cp / 100), "gp"], [Math.floor((cp % 100) / 10), "sp"], [cp % 10, "cp"]].filter(([n]) => n);
  return parts.length ? parts.map(([n, unit]) => `${n.toLocaleString()} ${unit}`).join(" ") : "0 gp";
};
const coinsOf = (actor) => actor.inventory?.coins?.copperValue ?? 0;

const loading = {};

// Every item and every formula item of a kind ("food" or "alchemy"), as rows: { uuid, name, itemName, img, level, rarity, formula }. Looked up once and kept.
export function loadRecipes(kind = "food") {
  const spec = KINDS[kind];
  loading[kind] ??= (async () => {
    const fields = ["system.traits.otherTags", "system.traits.value", "system.traits.rarity", "system.level.value", `flags.${MODULE}.formula`];
    const foods = [];
    const formulaItems = [];
    for (const pack of game.packs) {
      if (pack.documentName !== "Item") continue;
      if (pack.metadata.packageType === "system" && !SYSTEM_PACKS.includes(pack.metadata.name)) continue;
      const index = await pack.getIndex({ fields });
      for (const entry of index) {
        const traits = entry.system?.traits;
        if (spec.item(entry, pack)) {
          foods.push({ uuid: entry.uuid, name: entry.name, itemName: entry.name, img: entry.img, level: entry.system?.level?.value ?? 0, rarity: traits.rarity ?? "common", formula: false });
        } else if (traits?.value?.includes("formula") && entry.flags?.[MODULE]?.formula?.tiers?.length) {
          formulaItems.push({ entry, tiers: entry.flags[MODULE].formula.tiers });
        }
      }
    }

    // A formula item is of the kind when the first item it teaches is. It stands in for the items it teaches.
    const rows = [];
    const covered = new Set();
    const mine = [];
    for (const { entry, tiers } of formulaItems) {
      const first = await fromUuid(tiers[0].uuid).catch(() => null);
      if (spec.made(first)) mine.push({ entry, tiers, first });
    }
    // Hide what a formula stands in for: its tiers, and the PF2e items its tiers are copies of (the Ginger Chew and Cinnamon Seers Moderates), so nothing is listed twice. That includes a PF2e
    // formula item whose first tier is one of those (the Alchemist pack's formula for PF2e's Cognitive Mutagen, once the Marquiste copy has its own).
    const replaced = new Set(mine.flatMap(({ tiers }) => tiers.map((t) => t.replaces).filter(Boolean)));
    for (const { entry, tiers, first } of mine) {
      if (replaced.has(tiers[0].uuid)) continue;
      for (const tier of tiers) {
        covered.add(tier.uuid);
        if (tier.replaces) covered.add(tier.replaces);
      }
      rows.push({
        uuid: entry.uuid,
        name: `${entry.name.replace(/^Formula:\s*/i, "")} (every tier)`,
        itemName: entry.name,
        img: entry.img,
        level: Math.min(...tiers.map((t) => t.level ?? 0)),
        rarity: first.system.traits.rarity ?? "common",
        formula: true,
      });
    }
    for (const uuid of replaced) covered.add(uuid);
    rows.push(...foods.filter((food) => !covered.has(food.uuid)));
    return rows.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  })().catch((error) => {
    delete loading[kind];
    throw error;
  });
  return loading[kind];
}

// Post the item or formula to the chat for everyone to see: its picture and a link that opens it.
function share(actor, doc) {
  const content =
    `<div style="display:flex;align-items:center;gap:.5em;"><img src="${esc(doc.img ?? "icons/svg/item-bag.svg")}" width="36" height="36" style="flex:none;border:none;">` +
    `<strong>@UUID[${doc.uuid}]{${doc.name.replace(/[\]}]/g, "")}}</strong></div>`;
  return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content });
}

const remembered = (storage) => {
  try {
    return localStorage.getItem(storage) !== "0";
  } catch {
    return true;
  }
};
const remember = (storage, value) => {
  try {
    localStorage.setItem(storage, value ? "1" : "0");
  } catch {
    // not remembered; the box is simply on next time
  }
};

// Open the list for a cookbook or an alchemy formula book, and put what the player ticks in it.
export async function pickRecipes(actor, book) {
  const spec = KINDS[kindOf(book)];
  const rows = await loadRecipes(kindOf(book));
  if (!rows.length) return ui.notifications.warn(spec.none);
  const inBook = new Set(entriesOf(book));
  const wealth = coinsOf(actor);

  const list = rows
    .map((row) => {
      const have = inBook.has(row.uuid);
      const rarity = row.rarity === "common" ? "" : `<span class="mq-rarity" style="margin-left:.5em;font-size:.85em;opacity:.8;text-transform:capitalize;">${esc(row.rarity)}</span>`;
      return (
        `<div class="mq-recipe" data-name="${esc(row.name.toLowerCase())}" data-rarity="${esc(row.rarity)}" style="display:flex;align-items:center;gap:.5em;padding:2px 6px;cursor:pointer;${have ? "opacity:.6;" : ""}">` +
        `<input type="checkbox" name="recipe" value="${esc(row.uuid)}"${have ? " checked disabled" : ""}>` +
        `<img class="mq-recipe-icon" src="${esc(row.img ?? "icons/svg/item-bag.svg")}" width="28" height="28" data-uuid="${esc(row.uuid)}" data-action="share" data-tooltip="Share ${esc(row.itemName)} in chat" style="flex:none;border:none;cursor:pointer;">` +
        `<span style="flex:1;"><a class="mq-recipe-name" data-uuid="${esc(row.uuid)}" data-action="open" data-tooltip="Read ${esc(row.itemName)}">${esc(row.name)}</a>${rarity}</span>` +
        `<span style="opacity:.7;white-space:nowrap;">${have ? "in book" : `Level ${row.level}`}</span>` +
        (have ? "" : `<span class="mq-price" data-cp="${formulaCost(row.level)}" style="white-space:nowrap;min-width:5.5em;text-align:right;"><i class="fa-solid fa-coins" style="color:${coinColor(formulaCost(row.level) <= wealth)};"></i> ${price(formulaCost(row.level))}</span>`) +
        `</div>`
      );
    })
    .join("");

  const content =
    `<div class="mq-cookbook-picker" style="display:flex;flex-direction:column;gap:.5rem;">` +
    `<div style="display:flex;align-items:center;gap:.75rem;">` +
    `<input type="search" name="search" placeholder="${spec.search}" autofocus style="flex:1;">` +
    `<label style="display:flex;align-items:center;gap:.3em;white-space:nowrap;"><input type="checkbox" name="common"${remembered(spec.storage) ? " checked" : ""}> Common only</label>` +
    `</div>` +
    `<div class="mq-recipes" style="max-height:50vh;overflow-y:auto;border:1px solid var(--color-border-light-tertiary, #888);border-radius:4px;">${list}</div>` +
    `<div style="display:flex;justify-content:space-between;gap:.5rem;opacity:.8;"><span class="mq-recipe-count"></span>` +
    `<span class="mq-wealth"><i class="fa-solid fa-coins" style="color:${COIN_YELLOW};"></i> ${esc(actor.name)} has ${price(wealth)}</span></div>` +
    `</div>`;

  const ticked = (button) => [...button.form.querySelectorAll('input[name="recipe"]:checked:not(:disabled)')].map((box) => box.value);
  const result = await foundry.applications.api.DialogV2.wait({
    window: { title: spec.title(book), icon: spec.icon },
    position: { width: 520 },
    content,
    buttons: [
      // Neither is the default button, so pressing Enter in the search box never buys anything.
      { action: "take", label: "Take formulas", icon: "fa-solid fa-hand", callback: (event, button) => ({ mode: "take", uuids: ticked(button) }) },
      { action: "buy", label: "Buy formulas", icon: "fa-solid fa-coins", callback: (event, button) => ({ mode: "buy", uuids: ticked(button) }) },
      { action: "cancel", label: "Cancel", icon: "fa-solid fa-xmark", callback: () => null },
    ],
    render: (event, dialog) => {
      const root = dialog.element;
      const search = root.querySelector('input[name="search"]');
      const common = root.querySelector('input[name="common"]');
      const labels = [...root.querySelectorAll(".mq-recipe")];
      const count = root.querySelector(".mq-recipe-count");
      const apply = () => {
        const text = search.value.trim().toLowerCase();
        let shown = 0;
        for (const label of labels) {
          const show = (!text || label.dataset.name.includes(text)) && (!common.checked || label.dataset.rarity === "common");
          label.style.display = show ? "flex" : "none";
          if (show) shown++;
        }
        count.textContent = `${shown} of ${labels.length} ${spec.noun} shown`;
      };
      // The name opens the item or formula to read; the picture shares it in chat; anywhere else on the row ticks it.
      root.querySelector(".mq-recipes").addEventListener("click", async (event) => {
        const target = event.target.closest("[data-action]");
        const row = event.target.closest(".mq-recipe");
        if (target) {
          event.preventDefault();
          const doc = await fromUuid(target.dataset.uuid).catch(() => null);
          if (!doc) return ui.notifications.warn("Could not find that item.");
          if (target.dataset.action === "open") doc.sheet.render(true);
          else await share(actor, doc);
        } else if (row && event.target.type !== "checkbox") {
          const box = row.querySelector('input[name="recipe"]');
          if (!box.disabled) box.checked = !box.checked;
        }
      });
      // Taking is free; buying costs the ticked formulas' prices. The Buy button shows the total, in a yellow coin when the character can pay it and an orange one when they can't, and it can't be used then.
      const update = () => {
        const picked = [...root.querySelectorAll('input[name="recipe"]:checked:not(:disabled)')];
        const total = picked.reduce((sum, box) => sum + Number(box.closest(".mq-recipe").querySelector(".mq-price")?.dataset.cp ?? 0), 0);
        const affordable = total <= wealth;
        const take = root.querySelector('button[data-action="take"]');
        const buy = root.querySelector('button[data-action="buy"]');
        take.disabled = !picked.length;
        buy.disabled = !picked.length || !affordable;
        buy.innerHTML = `<i class="fa-solid fa-coins" style="color:${coinColor(affordable)};"></i> Buy formulas${picked.length ? ` (${price(total)})` : ""}`;
        buy.dataset.tooltip = affordable ? "Pay the formula price for each ticked recipe" : `Not enough money: ${price(total)} costs more than the ${price(wealth)} ${actor.name} has`;
      };
      root.querySelector(".mq-recipes").addEventListener("click", () => setTimeout(update));
      root.querySelector(".mq-recipes").addEventListener("change", update);
      search.addEventListener("input", apply);
      common.addEventListener("change", () => {
        remember(spec.storage, common.checked);
        apply();
      });
      apply();
      update();
    },
    rejectClose: false,
  });
  if (!result?.uuids?.length) return;

  const names = new Map(rows.map((row) => [row.uuid, row.name.replace(/ \(every tier\)$/, "")]));
  const picked = result.uuids;
  if (result.mode === "buy") {
    const total = picked.reduce((sum, uuid) => sum + formulaCost(rows.find((row) => row.uuid === uuid)?.level ?? 0), 0);
    if (!(await actor.inventory.removeCoins({ cp: total }))) return ui.notifications.warn(`${actor.name} doesn't have ${price(total)}.`);
    await say(actor, `<p>${actor.name} buys ${picked.length === 1 ? "a formula" : `${picked.length} formulas`} for ${price(total)}: ${picked.map((uuid) => names.get(uuid)).join(", ")}.</p>`);
  }
  await placeEntries(actor, picked, book);
}
