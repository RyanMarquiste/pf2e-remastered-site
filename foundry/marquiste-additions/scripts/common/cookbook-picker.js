// The Add recipes list of a cookbook. PF2e's Compendium Browser can't filter by the alchemical-food tag, so a cookbook gets a list of its own: every alchemical food in the item compendiums,
// searchable, with a Common only box, and the formula items whose tiers are foods (Formula: Ginger Chew teaches every tier up to the character's level). The ones ticked go in the cookbook.
// Uncommon and rare foods are listed with their rarity, so a GM who allows one can have a character pick it.
import { MODULE } from "./shared.js";
import { entriesOf, esc, FOOD_TAG, isFood, placeEntries } from "./formula-books.js";

const COMMON_ONLY = `${MODULE}.cookbook.commonOnly`;
// The system's own item compendiums are big, and food is only in the equipment one; the other packs (modules and the world) are all looked at.
const SYSTEM_PACKS = ["equipment-srd"];

let loading = null;

// Every food and every food formula item, as rows: { uuid, name, level, rarity, formula }. Looked up once and kept.
export function loadRecipes() {
  loading ??= (async () => {
    const fields = ["system.traits.otherTags", "system.traits.value", "system.traits.rarity", "system.level.value", `flags.${MODULE}.formula`];
    const foods = [];
    const formulaItems = [];
    for (const pack of game.packs) {
      if (pack.documentName !== "Item") continue;
      if (pack.metadata.packageType === "system" && !SYSTEM_PACKS.includes(pack.metadata.name)) continue;
      const index = await pack.getIndex({ fields });
      for (const entry of index) {
        const traits = entry.system?.traits;
        if (traits?.otherTags?.includes(FOOD_TAG)) {
          foods.push({ uuid: entry.uuid, name: entry.name, level: entry.system?.level?.value ?? 0, rarity: traits.rarity ?? "common", formula: false });
        } else if (traits?.value?.includes("formula") && entry.flags?.[MODULE]?.formula?.tiers?.length) {
          formulaItems.push({ entry, tiers: entry.flags[MODULE].formula.tiers });
        }
      }
    }

    // A formula item is a food formula when the first item it teaches is a food. It stands in for the foods it teaches.
    const rows = [];
    const covered = new Set();
    for (const { entry, tiers } of formulaItems) {
      const first = await fromUuid(tiers[0].uuid).catch(() => null);
      if (!isFood(first)) continue;
      for (const tier of tiers) covered.add(tier.uuid);
      rows.push({
        uuid: entry.uuid,
        name: `${entry.name.replace(/^Formula:\s*/i, "")} (every tier)`,
        level: Math.min(...tiers.map((t) => t.level ?? 0)),
        rarity: first.system.traits.rarity ?? "common",
        formula: true,
      });
    }
    rows.push(...foods.filter((food) => !covered.has(food.uuid)));
    return rows.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  })().catch((error) => {
    loading = null;
    throw error;
  });
  return loading;
}

const remembered = () => {
  try {
    return localStorage.getItem(COMMON_ONLY) !== "0";
  } catch {
    return true;
  }
};
const remember = (value) => {
  try {
    localStorage.setItem(COMMON_ONLY, value ? "1" : "0");
  } catch {
    // not remembered; the box is simply on next time
  }
};

// Open the list for a cookbook, and put what the player ticks in it.
export async function pickRecipes(actor, book) {
  const rows = await loadRecipes();
  if (!rows.length) return ui.notifications.warn("No alchemical foods were found in the compendiums.");
  const inBook = new Set(entriesOf(book));

  const list = rows
    .map((row) => {
      const have = inBook.has(row.uuid);
      const rarity = row.rarity === "common" ? "" : `<span class="mq-rarity" style="margin-left:.5em;font-size:.85em;opacity:.8;text-transform:capitalize;">${esc(row.rarity)}</span>`;
      return (
        `<label class="mq-recipe" data-name="${esc(row.name.toLowerCase())}" data-rarity="${esc(row.rarity)}" style="display:flex;align-items:center;gap:.5em;padding:2px 6px;${have ? "opacity:.55;" : ""}">` +
        `<input type="checkbox" name="recipe" value="${esc(row.uuid)}"${have ? " checked disabled" : ""}>` +
        `<span style="flex:1;">${esc(row.name)}${rarity}</span>` +
        `<span style="opacity:.7;">${have ? "in book" : `Level ${row.level}`}</span></label>`
      );
    })
    .join("");

  const content =
    `<div class="mq-cookbook-picker" style="display:flex;flex-direction:column;gap:.5rem;">` +
    `<div style="display:flex;align-items:center;gap:.75rem;">` +
    `<input type="search" name="search" placeholder="Search recipes" autofocus style="flex:1;">` +
    `<label style="display:flex;align-items:center;gap:.3em;white-space:nowrap;"><input type="checkbox" name="common"${remembered() ? " checked" : ""}> Common only</label>` +
    `</div>` +
    `<div class="mq-recipes" style="max-height:50vh;overflow-y:auto;border:1px solid var(--color-border-light-tertiary, #888);border-radius:4px;">${list}</div>` +
    `<p class="mq-recipe-count" style="margin:0;opacity:.7;"></p>` +
    `</div>`;

  const chosen = await foundry.applications.api.DialogV2.prompt({
    window: { title: `Add recipes to ${book.name}`, icon: "fa-solid fa-utensils" },
    position: { width: 480 },
    content,
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
        count.textContent = `${shown} of ${labels.length} recipes shown`;
      };
      search.addEventListener("input", apply);
      common.addEventListener("change", () => {
        remember(common.checked);
        apply();
      });
      apply();
    },
    ok: {
      label: "Add to cookbook",
      callback: (event, button) => [...button.form.querySelectorAll('input[name="recipe"]:checked:not(:disabled)')].map((box) => box.value),
    },
    rejectClose: false,
  });
  if (Array.isArray(chosen) && chosen.length) await placeEntries(actor, chosen, book);
}
