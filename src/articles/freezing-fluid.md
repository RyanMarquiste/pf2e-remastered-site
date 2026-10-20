---
layout: article.njk
menu: alchemist-items
title: "Freezing Fluid"
category: Equipment
class: alchemist
date: 2026-10-19
summary: "A thrown alchemical consumable that coats an area in a numbing, freezing fluid that hampers creatures' movement and sharpens cold attacks against them."
---

<div class="stat-block" id="freezing-fluid">
  <h4 class="stat-block-title">Freezing Fluid</h4>
  <div class="stat-block-traits">
    <span class="trait">Alchemical</span>
    <span class="trait">Bomb</span>
    <span class="trait">Cold</span>
    <span class="trait">Consumable</span>
  </div>
  <div class="stat-block appearance-block">
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A corked flask of thin, pale blue fluid that steams with cold vapor and grows feathery frost on the glass. Tiny ice crystals drift slowly through it, and it smells of snowmelt and cold metal.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/freezing-fluid.png' | url }}" alt="A round, slightly lopsided glass flask with a cork stopper, a rope-and-leather neck with brass bands, and two small metal tags, holding pale blue liquid, with white vapor curling above it and feathery frost patterns on the glass." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> L<br>
  <strong>Activate</strong> {% actionIcon "one" %} Strike</p>
  <p>Throw the flask at a square, with a range increment of 20 feet. This Strike targets the square instead of a creature and deals no damage. The Strike is made against the Strike DC listed below for the item's tier. It counts as a Strike with a bomb for abilities that key off bombs, such as Quick Bomber, and it counts toward your multiple attack penalty.</p>
  <div class="stat-block results-block">
    <p><strong>Critical Success</strong> The flask coats a larger area, covering the surface in freezing fluid: the square is 5 feet wider than noted below for its tier.</p>
    <p><strong>Success</strong> The flask coats a square area that includes the target square, covering the surface in freezing fluid, as noted below for its tier. The target square can be at the area's center or corner.</p>
    <p><strong>Failure</strong> The flask lands poorly and coats a smaller area: the square is 5 feet narrower than noted below for its tier, but still includes the target square.</p>
    <p><strong>Critical Failure</strong> The flask shatters badly and coats an even smaller area: the square is 10 feet narrower than noted below for its tier, but still includes the target square. If this leaves no area at all, the flask is a dud and is expended without effect.</p>
  </div>
  <p>The fluid remains for 1 minute, after which it warms and becomes inert. It needs no further activation. When the fluid coats the area, each creature in it must succeed at a Fortitude save against the item's DC or be chilled for 1 round, with the effects noted below for its tier. After that, a creature that enters the area, or starts its turn in it, must succeed at the same save or be chilled for 1 round. A creature attempts this save at most once per round.</p>
  <p><strong>Special</strong> The fluid sharpens cold. Whenever a creature in the area takes cold damage from an attack or effect, it takes additional cold damage as noted below for its tier, added to that damage as a single instance, with resistances applied to the total once. This applies only to the creature taking the cold damage and doesn't spread to other creatures in the area. A creature takes this additional damage at most once per round.</p>

  <p><strong>Item DC</strong> Saves and checks against this item use the item's DC, which is the standard DC for the item's level (from the level-based DC table in GM Core), as noted below for each tier. Effects that change an item's save DC, such as an alchemist's Powerful Alchemy, apply to it as normal. The Strike DC, which is 2 less than the item's DC, is fixed and can't be changed this way.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 2</span></div>
  <p>Strike DC 14; Item DC 16. Freezing Fluid coats a 10-foot square. A chilled creature takes a &minus;5-foot status penalty to its Speeds. Cold damage is increased by 1d6.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 8</span></div>
  <p>Strike DC 22; Item DC 24. You gain a +1 item bonus to attack rolls. Freezing Fluid coats a 15-foot square. A chilled creature takes a &minus;10-foot status penalty to its Speeds and is slowed 1. Cold damage is increased by 2d6.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 15</span></div>
  <p>Strike DC 32; Item DC 34. You gain a +2 item bonus to attack rolls. Freezing Fluid coats a 20-foot square. A chilled creature takes a &minus;15-foot status penalty to its Speeds and is slowed 1. Cold damage is increased by 4d6.</p>

  <div class="stat-block-notes">
    <p><strong>Special</strong> The fluid affects only creatures that touch it. A creature that jumps over the area, flies above it, or otherwise avoids contact with the coated surface doesn't trigger the chilling effect or the additional cold damage.</p>
    <p><strong>Special</strong> A powerful enough water or cleansing effect that covers the area can wash the fluid away. Treat the fluid as an effect with a counteract rank equal to half this item's level, rounded up, and a counteract DC equal to the item's DC. A water or cleansing effect that successfully counteracts it removes the fluid from the area it covers.</p>
  </div>
</div>
