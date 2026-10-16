---
layout: article.njk
title: "Grasping Shade"
category: Spells
date: 2026-10-14
summary: "A cantrip that conjures a fleeting shred of unlife to strike a foe with void damage."
---

<div class="stat-block" id="grasping-shade">
  <h4 class="stat-block-title">Grasping Shade <span class="stat-block-action">Cantrip 1</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Cantrip</span>
    <span class="trait">Fleeting</span>
    <span class="trait">Void</span>
  </div>
  <p><strong>Cast</strong> {% actionIcon "two" %}; <strong>Range</strong> 30 feet</p>
  <p>You conjure a writhing shred of unlife in an unoccupied space within range. It is a fleeting, summoned creature and immediately acts using its own 2 actions, typically one to fly toward a creature and one to Strike it. Being incorporeal, it can fly through walls and creatures, but it can't end its movement inside them.</p>
  <p><strong>Heightened (+1)</strong> The damage increases by 1d4.</p>
  <div class="stat-block creature-block">
    <h5 class="stat-block-title">Grasping Shade <span class="stat-block-action">Summoned Creature</span></h5>
    <div class="stat-block-body">
      <div class="stat-block-main">
        <div class="stat-block-traits">
          <span class="trait">Fleeting</span>
          <span class="trait">Incorporeal</span>
          <span class="trait">Medium</span>
          <span class="trait">Minion</span>
          <span class="trait">Summoned</span>
          <span class="trait">Undead</span>
        </div>
        <p><strong>Actions</strong> 2</p>
        <p><strong>Speed</strong> fly 30 feet</p>
        <p><strong>Melee</strong> {% actionIcon "one" %} grasp (your spell attack modifier), <strong>Damage</strong> 1d6 void plus Sapping Grasp</p>
        <p><strong>Sapping Grasp</strong> <strong>Duration</strong> 1 round; <strong>Effect</strong> The target is enfeebled 1 on a hit, or enfeebled 2 on a critical hit.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/grasping-shade.jpg' | url }}" alt="A dark, clawed shade with glowing eyes reaches out of a derelict mansion hallway, embers drifting around it." loading="lazy">
    </div>
  </div>
</div>
