---
layout: article.njk
menu: alchemist-items
title: "Acidic Slurry"
category: Equipment
class: alchemist
date: 2026-10-19
summary: "A thrown alchemical consumable that coats an area in a caustic slurry that burns creatures entering or standing in it."
---

<div class="stat-block" id="acidic-slurry">
  <h4 class="stat-block-title">Acidic Slurry</h4>
  <div class="stat-block-traits">
    <span class="trait">Acid</span>
    <span class="trait">Alchemical</span>
    <span class="trait">Bomb</span>
    <span class="trait">Consumable</span>
  </div>
  <div class="stat-block appearance-block">
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A corked flask of thick, sickly yellow-green slurry streaked with muddy brown, topped with a froth of pale foam that bubbles sluggishly and leaves ropy smears up the glass. It hisses faintly and smells sharply of vinegar and singed hair.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/acidic-slurry.png' | url }}" alt="A round glass flask with a cork stopper and a rope-wrapped leather neck banded in brass, holding thick yellow-green slurry streaked with brown and topped with pale, bubbling foam that clings in drips to the inside of the glass." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> L<br>
  <strong>Activate</strong> {% actionIcon "one" %} Strike</p>
  <p>Throw the flask at a square, with a range increment of 20 feet. This Strike targets the square instead of a creature and deals no damage on its own. Make a bomb attack roll against a DC equal to the standard DC for your level (from the level-based DC table in GM Core) minus 2. It counts as a Strike with a bomb for abilities that key off bombs, such as Quick Bomber, and it counts toward your multiple attack penalty.</p>
  <p><strong>Critical Success</strong> The flask coats an area with the same center or corner, covering the surface in caustic slurry, 5 feet wider than noted below for its tier.</p>
  <p><strong>Success</strong> The flask coats an area with that square at its center or corner, covering the surface in caustic slurry, as noted below for its tier.</p>
  <p><strong>Failure</strong> The flask lands poorly and coats a smaller area: 5 feet narrower than noted below for its tier, but never smaller than a single square and always including the target square.</p>
  <p><strong>Critical Failure</strong> The flask shatters badly and coats an even smaller area: 10 feet narrower than noted below for its tier, but always including the target square. If this would leave nothing to coat, the flask is a dud and is expended without effect.</p>
  <p>The slurry remains for 1 minute, after which it neutralizes and becomes inert. It needs no further activation. A creature that enters the area, or starts its turn in it, takes acid damage as noted below for its tier, with a basic Reflex save. A creature takes this damage at most once per round, and a creature already in the area when it is coated takes the damage at the start of its next turn.</p>
  <p><strong>Special</strong> The slurry harms only creatures that touch it. A creature that jumps over the area, flies above it, or otherwise avoids contact with the coated surface doesn't trigger the acid damage.</p>
  <p><strong>Special</strong> A powerful enough water or cleansing effect that covers the area can wash the slurry away. Treat the slurry as an effect with a counteract rank equal to half this item's level, rounded up, and a counteract DC equal to the item's DC. A water or cleansing effect that successfully counteracts it removes the slurry from the area it covers.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 2</span></div>
  <p>Acidic Slurry coats a 5-foot square. Creatures take 1d6 acid damage.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 8</span></div>
  <p>You gain a +1 item bonus to attack rolls. Acidic Slurry coats a 10-foot square. Creatures take 3d6 acid damage.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 15</span></div>
  <p>You gain a +2 item bonus to attack rolls. Acidic Slurry coats a 15-foot square. Creatures take 6d6 acid damage.</p>
</div>
