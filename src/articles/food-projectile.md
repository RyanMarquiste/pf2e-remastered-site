---
layout: article.njk
uuid: 6a8bb7fd-b3b0-4376-a4d8-213e0052a062
aliases: ["food-projectile"]
menu: wandering-chef-items
title: "Food Projectile"
category: Equipment
date: 2026-11-25
summary: "A short-lived lump of overcooked food that a Wandering Chef flings at enemies, made with the Overcooked feat."
---

<div class="stat-block" id="food-projectile">
  <h4 class="stat-block-title">Food Projectile</h4>
  <div class="stat-block-traits">
    <span class="trait">Consumable</span>
    <span class="trait">Fleeting</span>
    <span class="trait">Nonlethal</span>
    <span class="trait">Thrown 10 ft.</span>
    <span class="trait">Versatile F</span>
  </div>
  <div class="stat-block appearance-block">
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A hard, blackened lump of food, scorched and charred through and smelling of smoke, with a few stubborn flecks of seasoning still clinging to it.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/food-projectile.png' | url }}" alt="A round, scorched loaf of cross-scored bread, charred dark brown and gray, wreathed in orange and blue flames with curls of smoke rising from it." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> &mdash;<br>
  <strong>Category</strong> Simple; <strong>Group</strong> Club; <strong>Range</strong> 10 feet<br>
  <strong>Activate</strong> {% actionIcon "one" %} Strike</p>
  <p>A spare bit of food, overcooked with alchemical ingredients until it is inedible and has none of the properties it had before. You can flambé it when you Strike, setting it on fire so that it deals fire damage instead of bludgeoning damage.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 1</span></div>
  <p>The weapon deals 1d6 bludgeoning damage.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 4</span></div>
  <p>You gain a +1 item bonus to attack rolls. The weapon deals 2d6 bludgeoning damage.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 12</span></div>
  <p>You gain a +2 item bonus to attack rolls. The weapon deals 3d6 bludgeoning damage.</p>

  <div class="stat-block-section"><span>Major</span><span>Item 18</span></div>
  <p>You gain a +3 item bonus to attack rolls. The weapon deals 4d6 bludgeoning damage.</p>
</div>

<p>A Wandering Chef makes a Food Projectile with the Overcook option from the <a href="{{ 'overcooked' | articleUrl(collections.articles) | url }}">Overcooked</a> feat, and the <a href="{{ 'food-fight' | articleUrl(collections.articles) | url }}">Food Fight</a> feat makes it deal d8 damage instead of d6 and have the Thrown 15 ft. trait.</p>
