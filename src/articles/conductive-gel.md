---
layout: article.njk
menu: alchemist-items
title: "Conductive Gel"
category: Equipment
class: alchemist
date: 2026-10-19
summary: "A thrown alchemical consumable that coats an area in a metallic gel that carries electricity to every creature standing in it."
---

<div class="stat-block" id="conductive-gel">
  <h4 class="stat-block-title">Conductive Gel</h4>
  <div class="stat-block-traits">
    <span class="trait">Alchemical</span>
    <span class="trait">Bomb</span>
    <span class="trait">Consumable</span>
  </div>
  <div class="stat-block appearance-block">
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A corked flask of thick, translucent gel the color of pale silver, suspended with fine flecks of metallic grit that glitter when the glass is tilted. It sloshes slowly in heavy, rolling waves, its surface prickling faintly with static, and it carries a sharp scent of ozone and wet metal.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/conductive-gel.png' | url }}" alt="A round glass flask with a cork stopper and a rope-wrapped leather neck banded in brass, holding thick, translucent silver gel flecked with glittering metallic grit, sloshed into a heavy wave." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> L<br>
  <strong>Activate</strong> {% actionIcon "one" %} Strike</p>
  <p>Throw the flask at a square, with a range increment of 20 feet. This Strike targets the square instead of a creature and deals no damage. Make a bomb attack roll against a DC equal to the standard DC for your level (from the level-based DC table in GM Core) minus 2. It counts as a Strike with a bomb for abilities that key off bombs, such as Quick Bomber, and it counts toward your multiple attack penalty.</p>
  <div class="stat-block results-block">
    <p><strong>Critical Success</strong> The flask coats a larger area, covering the surface in conductive gel: the square is 5 feet wider than noted below for its tier.</p>
    <p><strong>Success</strong> The flask coats a square area that includes the target square, covering the surface in conductive gel, as noted below for its tier. The target square can be at the area's center or corner.</p>
    <p><strong>Failure</strong> The flask lands poorly and coats a smaller area: the square is 5 feet narrower than noted below for its tier, but still includes the target square.</p>
    <p><strong>Critical Failure</strong> The flask shatters badly and coats an even smaller area: the square is 10 feet narrower than noted below for its tier, but still includes the target square. If this leaves no area at all, the flask is a dud and is expended without effect.</p>
  </div>
  <p>The gel doesn't hinder movement or make footing treacherous. It remains for 1 minute, after which it dries and becomes inert.</p>
  <p><strong>Special</strong> The area is conductive. Whenever an effect with the electricity trait, such as an electricity attack or area effect, is applied to Conductive Gel (including attacks or effects against the squares it covers), each creature in the area takes electricity damage, as noted below for its tier, with a basic Reflex save. The gel isn't consumed. It can deal this damage only once per round. If a creature in the area is also taking electricity damage from the effect that energized the gel, add this damage to that damage. The two are combined into a single instance of damage, sharing the creature's saving throw result against the energizing effect, with resistances applied to the total once.</p>

  <p><strong>Item DC</strong> Saves and checks against this item use the item's DC, which is the standard DC for the item's level (from the level-based DC table in GM Core), as noted below for each tier. Effects that change an item's save DC, such as an alchemist's Powerful Alchemy, apply to it as normal. The DC of the bomb attack roll is fixed and can't be changed this way.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 2</span></div>
  <p>DC 16. Conductive Gel coats a 10-foot square. Creatures in the area take 2d4 electricity damage when it is energized.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 8</span></div>
  <p>DC 24. You gain a +1 item bonus to attack rolls. Conductive Gel coats a 15-foot square. Creatures in the area take 5d4 electricity damage when it is energized.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 15</span></div>
  <p>DC 34. You gain a +2 item bonus to attack rolls. Conductive Gel coats a 20-foot square. Creatures in the area take 10d4 electricity damage when it is energized.</p>

  <div class="stat-block-notes">
    <p><strong>Special</strong> A powerful enough water or cleansing effect that covers the area can wash the gel away. Treat the gel as an effect with a counteract rank equal to half this item's level, rounded up, and a counteract DC equal to the item's DC. A water or cleansing effect that successfully counteracts it removes the gel from the area it covers.</p>
  </div>
</div>
