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
    <p class="appearance-label">Appearance</p>
    <p>A corked flask of thick, sickly green slurry that bubbles sluggishly, with pale clumps of foam rising and popping on its surface. It hisses faintly against the glass and smells sharply of vinegar and singed hair.</p>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> L<br>
  <strong>Activate</strong> {% actionIcon "one" %} Strike</p>
  <p>Throw the flask at a square within 20 feet. This Strike targets the square instead of a creature and deals no damage on its own. Make a bomb attack roll against a DC equal to the standard DC for your level (from the level-based DC table in GM Core) minus 2. The attack can only succeed or fail; it is never a critical success or critical failure. It counts as a Strike with a bomb for abilities that key off bombs, such as Quick Bomber, and it counts toward your multiple attack penalty.</p>
  <p><strong>Success</strong> The flask coats an area with that square at its center or corner, covering the surface in caustic slurry, as noted below for its tier.</p>
  <p><strong>Failure</strong> The flask lands poorly and coats a smaller area: 5 feet smaller on each side than noted below for its tier, but always including the target square.</p>
  <p>The slurry remains for 1 minute, after which it neutralizes and becomes inert. It needs no further activation. A creature that enters the area, or starts its turn in it, takes acid damage as noted below for its tier, with a basic Reflex save. A creature takes this damage at most once per round, and a creature already in the area when it is coated takes the damage at the start of its next turn.</p>
  <p><strong>Special</strong> The slurry harms only creatures that touch it. A creature that jumps over the area, flies above it, or otherwise avoids contact with the coated surface doesn't trigger the acid damage.</p>
  <p><strong>Special</strong> A powerful enough water or cleansing effect that covers the area can wash the slurry away. Treat the slurry as an effect with a counteract rank equal to half this item's level, rounded up, and a counteract DC equal to the item's DC. A water or cleansing effect that successfully counteracts it removes the slurry from the area it covers.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 2</span></div>
  <p>Acidic Slurry coats a 10-foot square. Creatures take 1d6 acid damage.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 8</span></div>
  <p>You gain a +1 item bonus to attack rolls. Acidic Slurry coats a 15-foot square. Creatures take 3d6 acid damage.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 15</span></div>
  <p>You gain a +2 item bonus to attack rolls. Acidic Slurry coats a 20-foot square. Creatures take 6d6 acid damage.</p>
</div>
