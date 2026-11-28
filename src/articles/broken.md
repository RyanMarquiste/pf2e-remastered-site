---
layout: article.njk
uuid: 50c32302-007e-46c7-8038-a345bc22386f
aliases: ["broken"]
menu: general-traits
title: "Broken"
category: Traits
date: 2026-11-28
summary: "New trait: Broken, for an item that can no longer be used for its intended purpose until it is repaired."
---

<div class="stat-block" id="broken">
  <h4 class="stat-block-title">Broken</h4>
  <p>A broken item can no longer be used for its intended purpose. It still imposes the penalties and limitations of carrying, holding, or wearing it, such as a suit of armor's check penalty and Dexterity modifier cap.</p>
  <ul>
    <li><strong>Weapon</strong> A broken weapon can't be used to Strike.</li>
    <li><strong>Shield</strong> A broken shield gives no bonus to AC, and you can't raise it.</li>
    <li><strong>Wand or scroll</strong> A broken wand or scroll can't be used to cast its spell.</li>
    <li><strong>Tool or other item</strong> A broken tool or other item that gives a bonus gives none.</li>
  </ul>
  <p><strong>Mending it</strong> An item with Hit Points stops being broken when its Hit Points are raised above its Broken Threshold. An item with no Hit Points stops being broken when you succeed at a Repair check on it, against the standard DC for the item's level.</p>
</div>
<p class="trait-note"><strong>Special</strong> This is the trait version of the broken condition. An item with Hit Points at or below its Broken Threshold is broken whether or not it has the trait. The trait lets an item with no Hit Points be broken too, and lets an effect such as <a href="{{ 'makeshift' | articleUrl(collections.articles) | url }}">makeshift</a> break an item without damaging it.</p>
