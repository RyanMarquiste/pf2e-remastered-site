---
layout: article.njk
title: "Charnel Rat"
category: Spells
date: 2026-10-14
summary: "A cantrip that conjures a fleeting skeletal rat to bite a foe or scurry through a tight gap."
---

<div class="stat-block" id="charnel-rat">
  <h4 class="stat-block-title">Charnel Rat <span class="stat-block-action">Cantrip 1</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Cantrip</span>
    <span class="trait">Fleeting</span>
    <span class="trait">Void</span>
  </div>
  <p><strong>Cast</strong> {% actionIcon "two" %}; <strong>Range</strong> 30 feet</p>
  <p>You conjure a small skeletal rat in an unoccupied space within range. It is a fleeting, summoned creature and immediately acts using its own 2 actions, which it can spend on two Bites or a single Scurry.</p>
  <p><strong>Heightened (+1)</strong> The bite's damage increases by 1d4.</p>
  <div class="stat-block creature-block">
    <h5 class="stat-block-title">Charnel Rat <span class="stat-block-action">Summoned Creature</span></h5>
    <div class="stat-block-body">
      <div class="stat-block-main">
        <div class="stat-block-traits">
          <span class="trait">Fleeting</span>
          <span class="trait">Minion</span>
          <span class="trait">Summoned</span>
          <span class="trait">Tiny</span>
          <span class="trait">Undead</span>
        </div>
        <p><strong>Speed</strong> 20 feet, climb 10 feet</p>
        <p><strong>Melee</strong> {% actionIcon "one" %} bite (your spell attack modifier), <strong>Damage</strong> 1d4 piercing plus the target is sickened 1 if they fail a Fortitude save against your spell DC (the sickened condition is a disease effect)</p>
        <p><strong>Scurry</strong> {% actionIcon "two" %} (move) The rat moves up to twice its Speed, climbing as needed, squeezing through any gap a real rat could fit through &mdash; under a door, through bars, into a narrow crevice. It can carry an unattended object of L bulk or less along with it during this movement.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/charnel-rat.jpg' | url }}" alt="A skeletal rat with a glowing green eye and venomous green slime dripping from its fangs stalks across a dungeon floor." loading="lazy">
    </div>
  </div>
</div>
