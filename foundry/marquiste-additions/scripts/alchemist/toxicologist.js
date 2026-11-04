// Toxicologist field benefit, carried by a trait. An infused item a Toxicologist creates that deals acid or poison damage has the Toxinfused trait,
// and so does an effect it puts on a weapon (the Toxic Coatings). When damage is rolled from such an item, or from a weapon with such an effect
// on it, the roll is told that poison may become acid and acid may become poison. PF2e then works out, for each target the damage is applied to,
// whether the target's immunities and resistances make the other type the better choice.
const TRAIT = "toxinfused";
const LABEL = "Toxinfused";
const DESCRIPTION =
  "An item with this trait was infused by a Toxicologist, and so is an effect it creates. Acid or poison damage from it can become the other type " +
  "for each creature it affects: a creature immune to one takes the other, and one that resists one of them takes whichever it resists less. " +
  "The Toxicologist's field benefit gives an item this trait when they create it, so nothing else needs to be switched on.";
const PAIRS = [
  { from: "poison", to: "acid" },
  { from: "acid", to: "poison" },
];

Hooks.once("init", () => {
  for (const key of ["consumableTraits", "effectTraits", "equipmentTraits", "weaponTraits"]) {
    if (CONFIG.PF2E[key]) CONFIG.PF2E[key][TRAIT] = LABEL;
  }
  CONFIG.PF2E.traitsDescriptions ??= {};
  CONFIG.PF2E.traitsDescriptions[TRAIT] = DESCRIPTION;
});

const isToxicologist = (actor) => actor?.itemTypes.feat.some((f) => f.category === "classfeature" && f.slug === "toxicologist");

// An infused item that deals acid or poison damage, made by a Toxicologist, gets the trait as it is created (a vial from Quick Vial, an item
// from Create Consumable or from PF2e's own Quick Alchemy). The Toxicologist's own vials and coatings already have it.
Hooks.on("preCreateItem", (item) => {
  const actor = item.parent;
  if (actor?.documentName !== "Actor" || !item.isOfType?.("consumable", "weapon", "equipment")) return;
  const traits = item.system.traits.value;
  if (traits.includes(TRAIT) || !traits.includes("infused") || !(traits.includes("acid") || traits.includes("poison"))) return;
  if (isToxicologist(actor)) item.updateSource({ "system.traits.value": [...traits, TRAIT] });
});

// Is this damage roll from a Toxinfused item, or from a weapon with a Toxinfused effect on it?
function toxinfused(actor, context, origin) {
  if ((context.options ?? []).includes(`item:trait:${TRAIT}`)) return true;
  const weaponId = origin?.uuid?.split(".Item.").at(1) ?? null;
  return actor.itemTypes.effect.some((e) => {
    if (e.isExpired || !e.system.traits.value.includes(TRAIT)) return false;
    const chosen = e.flags.pf2e?.rulesSelections?.weapon;
    return !chosen || chosen === weaponId;
  });
}

Hooks.on("preCreateChatMessage", (message) => {
  const context = message.flags?.pf2e?.context;
  if (context?.type !== "damage-roll") return;
  const actor = ChatMessage.getSpeakerActor(message.speaker);
  if (!actor || !toxinfused(actor, context, message.flags.pf2e.origin)) return;

  const rolls = message.toObject().rolls.map((json) => {
    const data = typeof json === "string" ? JSON.parse(json) : foundry.utils.deepClone(json);
    data.options ??= {};
    const bypass = (data.options.bypass ??= {
      immunity: { ignore: [], downgrade: [], redirect: [] },
      resistance: { ignore: [], redirect: [] },
    });
    bypass.immunity.redirect ??= [];
    bypass.resistance.redirect ??= [];
    for (const list of [bypass.immunity.redirect, bypass.resistance.redirect]) {
      for (const pair of PAIRS) {
        if (!list.some((r) => r.from === pair.from && r.to === pair.to)) list.push({ ...pair });
      }
    }
    return typeof json === "string" ? JSON.stringify(data) : data;
  });
  message.updateSource({ rolls });
});
