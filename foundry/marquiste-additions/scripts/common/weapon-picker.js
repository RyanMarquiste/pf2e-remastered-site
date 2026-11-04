// A picker styled like PF2e's formula picker (an icon, a name and traits, and a button to choose each row), and the weapon choice built on it.
// Used by the injury poisons and by the Alchemist's Quick Vial.

const traitLabel = (t) => game.i18n.localize(CONFIG.PF2E.weaponTraits?.[t] ?? CONFIG.PF2E.consumableTraits?.[t] ?? CONFIG.PF2E.effectTraits?.[t] ?? t);

// Rows marked "extra" are behind a button at the bottom. Each row is { value, name, img, traits, extra }. Returns the chosen row's value.
export async function pickRow({ title, icon = "fa-solid fa-toolbox", prompt, rows }) {
  const html = (row) => {
    const tags = row.traits
      .map((t) => `<span style="display: inline-block; background: #5a0505; color: #fff; border: 1px solid #e1d4a6; padding: 0 4px; font-size: 10px; font-weight: 700; line-height: 1.5; text-transform: uppercase; letter-spacing: .02em;">${traitLabel(t)}</span>`)
      .join("");
    return `
      <li ${row.extra ? "data-extra " : ""}style="display: ${row.extra ? "none" : "flex"}; align-items: center; gap: 6px; padding: 3px 0; border-bottom: 1px solid rgba(128, 128, 128, .3);">
        <img src="${row.img}" alt="" style="width: 36px; height: 36px; max-width: 36px; flex: none; object-fit: contain; border: none; border-radius: 3px;">
        <div style="flex: 1;"><strong style="display: block; font-size: 14px; line-height: 1.25;">${row.name}</strong><div style="display: flex; flex-wrap: wrap; gap: 2px; margin-top: 1px;">${tags}</div></div>
        <button type="button" data-choice="${row.value}" data-tooltip="Choose" style="flex: none; width: 30px; height: 30px; margin: 0 2px 0 0; padding: 0; line-height: 1; border-radius: 4px;"><i class="fa-solid fa-check"></i></button>
      </li>`;
  };
  // The main rows first, then the extra ones.
  const ordered = [...rows.filter((r) => !r.extra), ...rows.filter((r) => r.extra)];
  const hasExtras = ordered.some((r) => r.extra);

  const content = `
    <p style="margin: 0 0 .6em; font-size: 12px; opacity: .6;">${prompt}</p>
    <ul style="list-style: none; margin: 0; padding: 0;">${ordered.map(html).join("")}</ul>
    ${hasExtras ? '<button type="button" data-expand style="width: 100%; margin-top: .6em;"><i class="fa-solid fa-chevron-down"></i> Show all tiers</button>' : ""}`;

  let chosen = null;
  await foundry.applications.api.DialogV2.wait({
    window: { title, icon },
    position: { width: 480 },
    content,
    buttons: [{ action: "cancel", label: "Cancel" }],
    render: (event, dialog) => {
      // The list is short and the window can be closed, so the Cancel button is not shown.
      dialog.element.querySelector(".form-footer")?.remove();
      for (const button of dialog.element.querySelectorAll("[data-choice]")) {
        button.addEventListener("click", () => {
          chosen = button.dataset.choice;
          dialog.close();
        });
      }
      const expand = dialog.element.querySelector("[data-expand]");
      expand?.addEventListener("click", () => {
        const extras = dialog.element.querySelectorAll("[data-extra]");
        const show = extras[0]?.style.display === "none";
        for (const row of extras) row.style.display = show ? "flex" : "none";
        expand.innerHTML = show ? '<i class="fa-solid fa-chevron-up"></i> Show fewer' : '<i class="fa-solid fa-chevron-down"></i> Show all tiers';
        dialog.setPosition({ height: "auto" });
      });
    },
    rejectClose: false,
  });
  return chosen;
}

// The weapons a poison or coating can go on: held or worn by the character, and dealing piercing or slashing damage.
export function coatableWeapons(actor) {
  return actor.itemTypes.weapon.filter((w) => {
    if (!["held", "worn"].includes(w.system.equipped?.carryType)) return false;
    const types = [w.system.damage?.damageType, ...w.system.traits.value.map((t) => ({ "versatile-p": "piercing", "versatile-s": "slashing" })[t])];
    return types.some((type) => type === "piercing" || type === "slashing");
  });
}

// Ask which of the weapons to use (no question if there is only one). `verb` is "poisons" or "coats"; `title` is the window title.
export async function pickWeapon(actor, weapons, { verb = "poisons", title = "Poison a Weapon" } = {}) {
  if (weapons.length === 1) return weapons[0];
  const rows = weapons.map((w) => ({ value: w.id, name: w.name, img: w.img, traits: w.system.traits.value, extra: false }));
  const id = await pickRow({ title, prompt: `Select the weapon ${actor.name} ${verb}.`, rows });
  return weapons.find((w) => w.id === id) ?? null;
}
