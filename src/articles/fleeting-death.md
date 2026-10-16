---
layout: article.njk
title: "Fleeting Death"
category: Spells
date: 2026-10-16
summary: "A cantrip that conjures a fleeting undead creature, a charnel rat, grasping shade, or grave zombie, to strike a foe."
---

<div class="stat-block" id="fleeting-death">
  <h4 class="stat-block-title">Fleeting Death <span class="stat-block-action">Cantrip 1</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Arcane</span>
    <span class="trait">Cantrip</span>
    <span class="trait">Divine</span>
    <span class="trait">Fleeting</span>
    <span class="trait">Occult</span>
    <span class="trait">Void</span>
  </div>
  <p><strong>Cast</strong> {% actionIcon "two" %}; <strong>Range</strong> 30 feet</p>
  <p>You conjure a fleeting, summoned undead creature of your choice in an unoccupied space within range: a charnel rat, a grasping shade, or a grave zombie. The creature immediately acts using its own 2 actions.</p>
  <p><strong>Heightened (+1)</strong> The damage of the creature's attack increases by 1d4 of its damage type: piercing for the charnel rat, void for the grasping shade, and bludgeoning for the grave zombie.</p>
  <div class="stat-block creature-block" id="charnel-rat">
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
        <p><strong>Melee</strong> {% actionIcon "one" %} (attack) bite (your spell attack modifier), <strong>Damage</strong> 1d4 piercing plus the target is sickened 1 if they fail a Fortitude save against your spell DC (the sickened condition is a disease effect)</p>
        <p><strong>Scurry</strong> {% actionIcon "two" %} (move) The rat moves up to twice its Speed, climbing as needed, squeezing through any gap a real rat could fit through &mdash; under a door, through bars, into a narrow crevice. It can carry an unattended object of L bulk or less along with it during this movement.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/charnel-rat.jpg' | url }}" alt="A skeletal rat with a glowing green eye and venomous green slime dripping from its fangs stalks across a dungeon floor." loading="lazy">
    </div>
  </div>
  <div class="stat-block creature-block" id="grasping-shade">
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
        <p><strong>Speed</strong> fly 30 feet</p>
        <p><strong>Incorporeal</strong> The shade can fly through walls and creatures, but it can't end its movement inside them.</p>
        <p><strong>Melee</strong> {% actionIcon "one" %} (attack) grasp (your spell attack modifier), <strong>Damage</strong> 1d6 void plus the target is enfeebled 1 (enfeebled 2 on crit) for 1 round</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/grasping-shade.jpg' | url }}" alt="A dark, clawed shade with glowing eyes reaches out of a derelict mansion hallway, embers drifting around it." loading="lazy">
    </div>
  </div>
  <div class="stat-block creature-block" id="grave-zombie">
    <h5 class="stat-block-title">Grave Zombie <span class="stat-block-action">Summoned Creature</span></h5>
    <div class="stat-block-body">
      <div class="stat-block-main">
        <div class="stat-block-traits">
          <span class="trait">Fleeting</span>
          <span class="trait">Medium</span>
          <span class="trait">Minion</span>
          <span class="trait">Summoned</span>
          <span class="trait">Undead</span>
        </div>
        <p><strong>Slow</strong> The zombie is permanently slowed 1 and can't use reactions.</p>
        <p><strong>Melee</strong> {% actionIcon "one" %} (attack) fist (your spell attack modifier), <strong>Damage</strong> 1d8 bludgeoning plus on a critical hit the target is knocked prone</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/grave-zombie.jpg' | url }}" alt="A snarling zombie with glowing eyes claws its way out of churned earth in a moonlit graveyard, embers and rubble flying." loading="lazy">
    </div>
  </div>
</div>
