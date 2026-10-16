---
layout: article.njk
title: "Grave Lurch"
category: Spells
date: 2026-10-14
summary: "A cantrip that bursts a fleeting zombie from the terrain to slam a foe."
---

<div class="stat-block" id="grave-lurch">
  <h4 class="stat-block-title">Grave Lurch <span class="stat-block-action">Cantrip 1</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Cantrip</span>
    <span class="trait">Fleeting</span>
    <span class="trait">Void</span>
  </div>
  <p><strong>Cast</strong> {% actionIcon "two" %}; <strong>Range</strong> 30 feet</p>
  <p>A zombie bursts from the terrain beneath or next to a creature of your choice within range. It is a fleeting, summoned creature, and unlike other summoned creatures it immediately acts using only 1 action, as its shambling, undead form is too slow to muster the usual two.</p>
  <p><strong>Heightened (+2)</strong> The damage increases by 1d8.</p>
  <div class="stat-block creature-block">
    <h5 class="stat-block-title">Grave Zombie <span class="stat-block-action">Summoned Creature</span></h5>
    <div class="stat-block-traits">
      <span class="trait">Fleeting</span>
      <span class="trait">Medium</span>
      <span class="trait">Minion</span>
      <span class="trait">Summoned</span>
      <span class="trait">Undead</span>
    </div>
    <p><strong>Actions</strong> 1</p>
    <p><strong>Melee</strong> {% actionIcon "one" %} fist (your spell attack modifier), <strong>Damage</strong> 1d8 bludgeoning plus Toppling Slam</p>
    <p><strong>Toppling Slam</strong> <strong>Effect</strong> On a critical hit, the target is knocked prone.</p>
  </div>
</div>
