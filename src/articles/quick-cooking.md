---
layout: article.njk
uuid: ae16bc02-3b82-4d38-b17e-204dbcc992a4
aliases: ["quick-cooking"]
menu: wandering-chef-feats
title: "Quick Cooking"
category: Archetypes
date: 2026-11-26
summary: "The Wandering Chef's version of Quick Alchemy: Create Consumable, which spends a food packet to make alchemical food, or Overcook."
---

<div class="stat-block" id="quick-cooking">
  <h4 class="stat-block-title">Quick Cooking <span class="stat-block-action">{% actionIcon "one" %}</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Manipulate</span>
  </div>
  <p><strong>Requirements</strong> You're either holding or wearing a <a href="{{ 'cooking-toolkit' | articleUrl(collections.articles) | url }}">cooking toolkit</a> and you have a free hand</p>
  <p>You cook quickly using a cooking toolkit. The Wandering Chef Dedication gives you this action. Choose Create Consumable, Create Processed Food, or, if you have the <a href="{{ 'overcooked' | articleUrl(collections.articles) | url }}">Overcooked</a> feat, Overcook as your action for Quick Cooking.</p>
  <p>Any effect created by an item made with Quick Cooking that would have a duration longer than 10 minutes lasts for 10 minutes instead. This excludes afflictions such as slow acting poisons (as described in the infused trait).</p>

  <div class="stat-block-section"><span>Create Consumable</span></div>
  <p><strong>Requirements</strong> You have at least one food packet</p>
  <p>Expend one food packet to create a single alchemical food of your level or lower that you know the formula for. Skip the normal monetary cost in raw materials and the Crafting check. This item has the infused trait and must be activated before the start of your next turn or else it becomes inert. Items with the processed trait can't be created this way, because they take too long to make: use Create Processed Food for those.</p>

  <div class="stat-block-section"><span>Create Processed Food</span></div>
  <p><strong>Requirements</strong> You have at least one food packet</p>
  <p>Expend one food packet to create a single processed alchemical food of your level or lower that you know the formula for. This takes 1 minute instead of a single action, because processed foods are too complex to make quickly. Skip the normal monetary cost in raw materials and the Crafting check. This item has the infused trait and remains potent until the start of your next turn, or, if the item would take more than 3 actions to Activate, for a time equal to its activation time.</p>

  <div class="stat-block-section"><span>Overcook</span></div>
  <p>Requires the Overcooked feat. Create a <a href="{{ 'food-projectile' | articleUrl(collections.articles) | url }}">Food Projectile</a> from a spare bit of food. Using Overcook does not expend a food packet.</p>
</div>
