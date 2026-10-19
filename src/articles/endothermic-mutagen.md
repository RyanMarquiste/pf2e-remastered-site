---
layout: article.njk
menu: alchemist-items
title: "Endothermic Mutagen"
category: Equipment
class: alchemist
date: 2026-10-13
summary: "A mutagen that draws ambient heat into the drinker's body, chilling the air around them and buffering them against cold."
---

<div class="stat-block" id="endothermic-mutagen">
  <h4 class="stat-block-title">Endothermic Mutagen</h4>
  <div class="stat-block-traits">
    <span class="trait">Alchemical</span>
    <span class="trait">Cold</span>
    <span class="trait">Consumable</span>
    <span class="trait">Mutagen</span>
    <span class="trait">Polymorph</span>
  </div>
  <div class="stat-block appearance-block">
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A vial of frigid, pale blue fluid that swirls slowly, flecked with drifting shards of ice. Frost clings to the outside of the glass.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/endothermic-mutagen.png' | url }}" alt="A round glass flask with a cork stopper and a studded leather collar, holding pale blue liquid flecked with ice shards, with silvery snowflake patterns wrapped around the glass, frost on its surface, and a small metal tag marked with a snowflake hanging from its neck." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> L<br>
  <strong>Activate</strong> {% actionIcon "one" %} Interact</p>
  <p>While under the effects of this mutagen, your body draws in the ambient heat of your surroundings, chilling the air around you and leaving your skin cold to the touch.</p>
  <p><strong>Aura</strong> cold 5 feet</p>
  <p>Each other creature that starts its turn in your aura takes cold damage, as noted below for your tier. If you are grappling a creature when the aura deals it this damage, it also takes additional cold damage, as noted below for your tier, as your physical contact draws out even more of its heat.</p>
  <p>You gain resistance to cold equal to half this mutagen's level (minimum 1), as the heat you've drawn in buffers you against the same cold you channel outward.</p>
  <p><strong>Drawback</strong> Fire overloads your endothermic reaction, taxing your body as it struggles to manage the excess heat. You gain weakness 5 to fire, and take a &minus;2 item penalty to Fortitude saves and Constitution-based checks.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 1</span></div>
  <p>Resistance 1, aura cold damage 1, grapple cold damage 1d4, duration 1 minute.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 4</span></div>
  <p>Resistance 2, aura cold damage 2, grapple cold damage 1d6, duration 10 minutes.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 8</span></div>
  <p>Resistance 4, aura cold damage 3, grapple cold damage 2d6, duration 1 hour.</p>

  <div class="stat-block-section"><span>Major</span><span>Item 12</span></div>
  <p>Resistance 6, aura cold damage 4, grapple cold damage 3d6, duration 1 hour.</p>
</div>
