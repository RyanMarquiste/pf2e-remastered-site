---
layout: article.njk
uuid: 911548d5-fe2a-40af-83d8-4dab66762b7a
aliases: ["flash-cook", "overcooked"]
menu: wandering-chef-feats
title: "Flash Cook"
category: Archetypes
date: 2026-11-25
summary: "A Wandering Chef feat that adds a Flash Cook option to Quick Cooking, turning a spare scrap of food into a Food Projectile you can fling at enemies."
---

<div class="stat-block" id="flash-cook">
  <h4 class="stat-block-title">Flash Cook <span class="stat-block-action">Feat 4</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Archetype</span>
  </div>
  <p><strong>Prerequisites</strong> Wandering Chef Dedication</p>
  <p>You use alchemical ingredients to flash-cook a spare bit of food until it hardens into a scorched, throwable lump. <a href="{{ 'quick-cooking' | articleUrl(collections.articles) | url }}">Quick Cooking</a> gains a new option for you, Flash Cook, in addition to Create Food.</p>

  <div class="stat-block-section"><span>Flash Cook</span></div>
  <p><strong>Requirements</strong> You're either holding or wearing a <a href="{{ 'cooking-toolkit' | articleUrl(collections.articles) | url }}">cooking toolkit</a> and you have a free hand</p>
  <p>Choose Flash Cook as your action for Quick Cooking. You flash-cook a spare bit of food into a Food Projectile that you can fling at an enemy. The Food Projectile has the fleeting trait, so it must be used by the end of your current turn or else it falls apart.</p>
  <p>Using Flash Cook does not expend a food packet and does not consume any food or other food resources.</p>
  <p>The flash cooking leaves the food inedible. The Food Projectile has no nutritional value and none of the other properties the food would otherwise have.</p>
  <p><strong>Flambé</strong> When you Strike with a Food Projectile you can flambé it, setting it on fire, so that it deals fire damage instead of bludgeoning damage. This costs no action and uses nothing up.</p>

  <div class="stat-block-section"><span>Food Projectile</span><span>Weapon</span></div>
  <p>The Food Projectile is a <a href="{{ 'food-projectile' | articleUrl(collections.articles) | url }}">Food Projectile</a> item. Its statistics, and how it grows more potent as you gain levels, are given there. It improves at the same levels and by the same amounts as a <a href="{{ 'volatile-vial' | articleUrl(collections.articles) | url }}">volatile vial</a>.</p>

  <div class="stat-block special-block">
    <p class="special-label">Special</p>
    <p>The Food Projectile is a simple weapon, so Strikes with it use your proficiency with simple weapons. Unlike a volatile vial it is not a bomb and has no splash, so abilities that apply to bombs or to splash damage don't apply to it. It is a Propulsive ranged weapon and not a thrown one, so it adds half your Strength modifier to damage if that is positive.</p>
  </div>
</div>
