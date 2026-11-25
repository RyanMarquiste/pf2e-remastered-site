---
layout: article.njk
uuid: 911548d5-fe2a-40af-83d8-4dab66762b7a
aliases: ["overcooked"]
menu: wandering-chef-feats
title: "Overcooked"
category: Archetypes
date: 2026-11-25
summary: "A Wandering Chef feat that adds an Overcook option to Quick Alchemy, turning a spare scrap of food into a Food Projectile you can fling at enemies."
---

<div class="stat-block" id="overcooked">
  <h4 class="stat-block-title">Overcooked <span class="stat-block-action">Feat 4</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Archetype</span>
  </div>
  <p><strong>Prerequisites</strong> Wandering Chef Dedication</p>
  <p>You use alchemical ingredients to overcook a spare bit of food until it hardens into a scorched, throwable lump. <a href="{{ 'quick-alchemy' | articleUrl(collections.articles) | url }}">Quick Alchemy</a> gains a new option for you, Overcook, in addition to Create Consumable.</p>

  <div class="stat-block-section"><span>Overcook</span></div>
  <p><strong>Requirements</strong> You're either holding or wearing an alchemist's toolkit and you have a free hand</p>
  <p>Choose Overcook as your action for Quick Alchemy. You overcook a spare bit of food into a Food Projectile that you can fling at an enemy. The Food Projectile has the fleeting trait, so it must be used by the end of your current turn or else it falls apart. It is also used up when you throw it.</p>
  <p>Using Overcook does not expend a versatile vial and does not consume any food or other food resources.</p>
  <p>The overcooking leaves the food inedible. The Food Projectile has no nutritional value and none of the other properties the food would otherwise have.</p>
  <p><strong>Flambé</strong> When you Strike with a Food Projectile you can flambé it, setting it on fire, so that it deals fire damage instead of bludgeoning damage. This costs no action and uses nothing up.</p>

  <div class="stat-block-section"><span>Food Projectile</span><span>Weapon</span></div>
  <p>See <a href="{{ 'food-projectile' | articleUrl(collections.articles) | url }}">Food Projectile</a> for the item.</p>
  <p><strong>Category</strong> Simple; <strong>Group</strong> Club; <strong>Range</strong> 10 feet<br>
  <strong>Damage</strong> 1d6 bludgeoning<br>
  <strong>Traits</strong> <span class="trait">Consumable</span> <span class="trait">Fleeting</span> <span class="trait">Nonlethal</span> <span class="trait">Thrown 10 ft.</span> <span class="trait">Versatile F</span></p>
  <p>The Food Projectile grows more potent as you gain levels, at the same levels and by the same amounts as a <a href="{{ 'volatile-vial' | articleUrl(collections.articles) | url }}">volatile vial</a>.</p>
  <ul>
    <li><strong>4th level</strong> You gain a +1 item bonus to attack rolls with it, and it deals 2d6 damage.</li>
    <li><strong>12th level</strong> You gain a +2 item bonus to attack rolls with it, and it deals 3d6 damage.</li>
    <li><strong>18th level</strong> You gain a +3 item bonus to attack rolls with it, and it deals 4d6 damage.</li>
  </ul>

  <div class="stat-block special-block">
    <p class="special-label">Special</p>
    <p>The Food Projectile is a simple weapon, so Strikes with it use your proficiency with simple weapons. Unlike a volatile vial it is not a bomb and has no splash, so abilities that apply to bombs or to splash damage don't apply to it.</p>
  </div>
</div>
