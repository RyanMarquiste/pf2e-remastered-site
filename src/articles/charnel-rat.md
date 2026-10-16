---
layout: article.njk
title: "Charnel Rat"
category: Spells
date: 2026-10-14
summary: "A cantrip that conjures a fleeting skeletal rat to bite a foe or scurry through a tight gap."
---

<div class="stat-block" id="charnel-rat">
  <h4 class="stat-block-title">Charnel Rat <span class="stat-block-action">Cantrip 1</span></h4>
  <div class="stat-block-body">
    <div class="stat-block-main">
      <div class="stat-block-traits">
        <span class="trait">Cantrip</span>
        <span class="trait">Fleeting</span>
        <span class="trait">Void</span>
      </div>
      <p><strong>Cast</strong> {% actionIcon "two" %}; <strong>Range</strong> 30 feet</p>
      <p>You conjure a small skeletal rat in an unoccupied space within range. It is fleeting (see the Fleeting trait) and immediately acts using its own 2 actions, each spent on a Bite or a Scurry.</p>
      <p><strong>Speed</strong> 20 feet, climb 10 feet</p>
      <p><strong>Melee</strong> {% actionIcon "one" %} bite (your spell attack modifier), <strong>Damage</strong> 1d4 piercing plus Grave Rot</p>
      <p><strong>Grave Rot</strong> (disease) <strong>Saving Throw</strong> Fortitude negates (your spell DC); <strong>Duration</strong> 1 round; <strong>Effect</strong> The target is sickened 1.</p>
      <p><strong>Scurry</strong> {% actionIcon "one" %} (move) The rat moves up to its Speed, climbing as needed, squeezing through any gap a real rat could fit through &mdash; under a door, through bars, into a narrow crevice. It can use this movement to position itself for a bite, or to retrieve an unattended object of L bulk or less.</p>
      <p><strong>Heightened (+1)</strong> The bite's damage increases by 1d4.</p>
    </div>
    <img class="stat-block-art" src="{{ '/images/charnel-rat.jpg' | url }}" alt="A skeletal rat with a glowing green eye and venomous green slime dripping from its fangs stalks across a dungeon floor." loading="lazy">
  </div>
</div>
