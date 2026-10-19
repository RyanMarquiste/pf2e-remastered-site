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
        <p>A corked flask of thick, dark, oily liquid that clings to the glass in slow, dripping streaks. Its surface shimmers with a rainbow sheen, and it carries a strong scent of oil and petroleum.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/slick.png' | url }}" alt="A round glass flask with a cork stopper and a rope-wrapped leather neck banded in brass, holding dark, iridescent oil that drips down the inside of the glass." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> L<br>
  <strong>Activate</strong> {% actionIcon "one" %} Strike</p>
  <p>Throw the flask at a square within 20 feet. This Strike targets the square instead of a creature, makes no attack roll, and deals no damage. It counts as a Strike with a bomb for abilities that key off bombs, such as Quick Bomber, and it counts toward your multiple attack penalty. The flask coats an area with that square at its center or corner, turning the surface slick and slippery, as noted below for its tier.</p>
  <p>Any creature entering the area must succeed at an Acrobatics or Athletics check against the item's DC or fall prone, ending its movement for the turn. Creatures may crawl through the area normally without attempting this check.</p>
  <p>If Slick is applied to a wall or ceiling, a creature that fails the check loses its purchase and falls.</p>
  <p><strong>Special</strong> The effect or area is flammable. Any fire damage applied to Slick (such as area attacks or attacks against the squares that Slick is in) will ignite the Slick. This consumes the Slick effect, ending it immediately, but creatures in the area take fire damage, as noted below for its tier, with a basic Reflex save.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 2</span></div>
  <p>Slick coats a 10-foot square. If ignited, creatures in the area take 1d6 fire damage.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 8</span></div>
  <p>Slick coats a 15-foot square. If ignited, creatures in the area take 2d6 fire damage.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 15</span></div>
  <p>Slick coats a 20-foot square. If ignited, creatures in the area take 3d6 fire damage.</p>
</div>
