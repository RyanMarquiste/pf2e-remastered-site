---
layout: article.njk
menu: alchemist-items
title: "Slick"
category: Equipment
class: alchemist
date: 2026-10-04
summary: "A thrown alchemical consumable that coats an area in a slick, slippery substance, scaling across three tiers."
---

<div class="stat-block" id="slick">
  <h4 class="stat-block-title">Slick</h4>
  <div class="stat-block-traits">
    <span class="trait">Alchemical</span>
    <span class="trait">Bomb</span>
    <span class="trait">Consumable</span>
  </div>
  <div class="stat-block appearance-block">
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A corked flask of thick, dark, oily liquid that swirls slowly, its surface shimmering with a rainbow sheen and dotted with small bubbles. It carries a strong scent of oil and petroleum.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/slick.png' | url }}" alt="A round glass flask with a cork stopper and a rope-wrapped leather neck banded in brass, holding dark, iridescent oil with a rainbow sheen and a few small bubbles." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> L<br>
  <strong>Activate</strong> {% actionIcon "one" %} Strike</p>
  <p>Throw the flask at a square, with a range increment of 20 feet. This Strike targets the square instead of a creature and deals no damage. Make a bomb attack roll against a DC equal to the standard DC for your level (from the level-based DC table in GM Core) minus 2. It counts as a Strike with a bomb for abilities that key off bombs, such as Quick Bomber, and it counts toward your multiple attack penalty.</p>
  <div class="stat-block results-block">
    <p><strong>Critical Success</strong> The flask coats a wider area, turning the surface slick and slippery: the radius is 5 feet greater than noted below for its tier.</p>
    <p><strong>Success</strong> The flask coats the target square and the squares around it, turning the surface slick and slippery, out to the radius noted below for its tier. A radius of 0 is the target square alone.</p>
    <p><strong>Failure</strong> The flask lands poorly and coats a smaller area: the radius is 5 feet less than noted below for its tier, to a minimum of 0.</p>
    <p><strong>Critical Failure</strong> The flask shatters badly and coats an even smaller area: the radius is 10 feet less than noted below for its tier, to a minimum of 0.</p>
  </div>
  <p>Any creature entering the area must succeed at an Acrobatics or Athletics check against the item's DC or fall prone, ending its movement for the turn. Creatures may crawl through the area normally without attempting this check.</p>
  <p>If Slick is applied to a wall or ceiling, a creature that fails the check loses its purchase and falls.</p>
  <p><strong>Special</strong> The effect or area is flammable. Any fire damage applied to Slick (such as area attacks or attacks against the squares that Slick is in) will ignite the Slick. This consumes the Slick effect, ending it immediately, but creatures in the area take fire damage, as noted below for its tier, with a basic Reflex save. If a creature in the area is also taking fire damage from the effect that ignited Slick, add this damage to that damage. The two are combined into a single instance of damage, sharing the creature's saving throw result against the igniting effect, with resistances applied to the total once.</p>

  <p><strong>Item DC</strong> Saves and checks against this item use the item's DC, which is the standard DC for the item's level (from the level-based DC table in GM Core), as noted below for each tier. Effects that change an item's save DC, such as an alchemist's Powerful Alchemy, apply to it as normal. The DC of the bomb attack roll is fixed and can't be changed this way.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 2</span></div>
  <p>DC 16. Slick coats only the target square. If ignited, creatures in the area take 2d6 fire damage.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 8</span></div>
  <p>DC 24. You gain a +1 item bonus to attack rolls. Slick coats a 5-foot radius around the target square. If ignited, creatures in the area take 5d6 fire damage.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 15</span></div>
  <p>DC 34. You gain a +2 item bonus to attack rolls. Slick coats a 10-foot radius around the target square. If ignited, creatures in the area take 10d6 fire damage.</p>

  <div class="stat-block-notes">
    <p><strong>Special</strong> A powerful enough water or cleansing effect that covers the area can wash Slick away. Treat Slick as an effect with a counteract rank equal to half this item's level, rounded up, and a counteract DC equal to the item's DC. A water or cleansing effect that successfully counteracts it removes Slick from the area it covers.</p>
  </div>
</div>
