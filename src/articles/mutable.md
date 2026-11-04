---
layout: article.njk
uuid: c6bf0500-667a-472b-b6ac-3383133e52ae
aliases: ["mutable"]
menu: general-traits
title: "Mutable"
category: Traits
date: 2026-11-04
summary: "New trait: Mutable [damage type], for damage that changes to a different type against a creature that would take it better."
---

<div class="stat-block" id="mutable">
  <h4 class="stat-block-title">Mutable [damage type]</h4>
  <p>Damage from an item, effect, or ability with this trait can change to the damage type named in the trait. <strong>Mutable Acid</strong> means the damage can become acid damage, <strong>Mutable Fire</strong> means it can become fire damage, and so on. There is a Mutable trait for every damage type.</p>
  <p>Mutable is a counterpart to the versatile trait. With versatile you choose the damage type when you make the Strike. With mutable, nobody chooses: the damage changes on its own, separately for each creature it affects, based on that creature's immunities and resistances.</p>

  <div class="stat-block-section"><span>Which damage can change</span></div>
  <p>Only damage of the item's own type can change, or damage of the type an effect with the trait adds. A weapon with a poison coating that has Mutable Acid changes the coating's poison damage to acid, but the weapon's own piercing damage never changes. Splash damage that comes with the same damage roll changes along with the rest of it.</p>

  <div class="stat-block-section"><span>When it changes</span></div>
  <p>Work this out for each creature the damage affects. The damage changes to the mutable type if either of these is true, and otherwise it stays its original type:</p>
  <ul>
    <li><strong>Immunity</strong> The creature is immune to the original damage type and is not immune to the mutable type.</li>
    <li><strong>Resistance</strong> The creature has resistance to the original damage type, has a lower resistance to the mutable type or none, and is not immune to the mutable type.</li>
  </ul>
  <p>A creature's weaknesses do not change the damage type. If an item has more than one Mutable trait, the damage changes to whichever of those types the creature resists least.</p>
  <p>The damage is never both types. Once it changes, it is the mutable damage type for everything that follows, including the creature's resistances and weaknesses.</p>

  <div class="stat-block-section"><span>Examples</span></div>
  <ul>
    <li>A dagger coated with a poison that has Mutable Acid strikes a construct that is immune to poison. The coating's poison damage becomes acid damage against the construct.</li>
    <li>The same dagger hits a creature with resistance 10 to poison and resistance 5 to acid. The coating's damage becomes acid damage, because the creature resists acid less.</li>
    <li>The same dagger hits a creature with resistance 5 to poison and resistance 10 to acid. The coating's damage stays poison damage.</li>
  </ul>
</div>
<p class="trait-note"><strong>Special</strong> The Mutable trait exists to let an effect deal whichever damage type works against each target, without the player having to pick it. The <a href="{{ 'field-vials' | articleUrl(collections.articles) | url }}">Toxicologist</a>'s field benefit uses it: any infused item with the poison trait that a Toxicologist creates also has the Mutable Acid trait, as do the Toxicologist Field Vials and their Toxic Coatings. An item with the acid trait does not gain Mutable Poison.</p>
