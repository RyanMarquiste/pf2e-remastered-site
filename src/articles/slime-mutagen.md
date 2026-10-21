---
layout: article.njk
uuid: 266ae9a5-cab8-467b-b159-7613542357f3
aliases: ["slime-mutagen", "acidic-blob-mutagen"]
menu: alchemist-items
title: "Acidic Slime Mutagen"
category: Equipment
class: alchemist
date: 2026-10-13
summary: "A mutagen that dissolves the drinker's body into an unstable, acidic ooze, able to detonate caustic bursts at will."
---

<div class="stat-block" id="slime-mutagen">
  <h4 class="stat-block-title">Acidic Slime Mutagen</h4>
  <div class="stat-block-traits">
    <span class="trait">Alchemical</span>
    <span class="trait">Acid</span>
    <span class="trait">Consumable</span>
    <span class="trait">Mutagen</span>
    <span class="trait">Polymorph</span>
  </div>
  <div class="stat-block appearance-block">
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A vial of viscous, faintly bubbling green fluid that gives off an acrid, nose-burning smell.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/slime-mutagen.png' | url }}" alt="A round glass flask with a cork stopper and a studded leather collar, holding bubbling green liquid, wrapped in a net of dripping golden slime, with a small metal tag hanging from its neck." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> L<br>
  <strong>Activate</strong> {% actionIcon "one" %} Interact</p>
  <p>While under the effects of this mutagen, your body loses its definition, limbs and features sloughing into a more undefined, amoeba-like green mass, similar to an ooze or slime.</p>
  <p>You gain resistance to acid and a separate resistance to precision damage, each scaled by tier below, as your body no longer has fixed vital points to target and now shares the same acidic properties as acid itself, making acid less effective against it.</p>
  <p>While you are under the effects of this mutagen, you can use the Acidic Body Burst action, described below.</p>
  <div class="stat-block drawback-block">
    <p class="drawback-label">Drawback</p>
    <p>Your blob-like form is unusually vulnerable to extreme temperatures, giving you weakness 5 to fire and weakness 5 to cold.</p>
    <p>Without a rigid skeleton or defined musculature to generate leverage, you take a &minus;1 item penalty to Strength-based skill checks and Strength-based attack rolls.</p>
  </div>

  <div class="stat-block feat-block">
    <p class="feat-label">Mutant Physique</p>
    <p><strong>Prerequisite</strong> You have the Mutant Physique feat</p>
    <p>Your Acidic Body Burst splashes every creature within 10 feet of you, and its splash damage equals your Intelligence modifier when that is higher than this mutagen's acid splash damage.</p>
    <p>You shift and hide your vital organs within your slime-like body, so your precision resistance from this mutagen equals its acid resistance instead: 5 at Lesser and Moderate, 10 at Greater, and 15 at Major.</p>
  </div>

  <div class="stat-block-section"><span>Lesser</span><span>Item 1</span></div>
  <p>Acid resistance 5, precision resistance 2, acid splash damage 1, duration 1 minute.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 3</span></div>
  <p>Acid resistance 5, precision resistance 3, acid splash damage 2, duration 10 minutes.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 11</span></div>
  <p>Acid resistance 10, precision resistance 5, acid splash damage 3, duration 1 hour.</p>

  <div class="stat-block-section"><span>Major</span><span>Item 17</span></div>
  <p>Acid resistance 15, precision resistance 7, acid splash damage 4, duration 1 hour.</p>
</div>

<div class="stat-block" id="acidic-body-burst">
  <h4 class="stat-block-title">Acidic Body Burst <span class="stat-block-action">{% actionIcon "one" %}</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Acid</span>
    <span class="trait">Attack</span>
    <span class="trait">Splash</span>
  </div>
  <div class="stat-block appearance-block">
    <p class="appearance-label">Appearance</p>
    <p>A globule of caustic green acid forms within your body, then bursts, splashing outwards.</p>
  </div>
  <p><strong>Requirements</strong> You are under the effects of an Acidic Slime Mutagen<br>
  <strong>Frequency</strong> once per round</p>
  <p>You generate a glob of acid from within your own body and detonate it. This is an attack with the splash trait, triggering anything that keys off splash attacks, and it's affected by your multiple attack penalty as normal. Because the attack can only ever target you, it automatically succeeds, even if the result would normally be a failure. You and each creature adjacent to you when it detonates take the acid splash damage listed for your Acidic Slime Mutagen's tier, though your resistance to acid from that mutagen normally negates your own share of it.</p>
  <p><strong>Special</strong> A Bomber's research field benefits that affect splash damage and splash area apply to this attack as though it were a bomb: the field discovery that sets splash damage equal to your Intelligence modifier, and the greater field discovery that widens the splash to 10 feet. Other abilities and feats that key off bombs, including Calculated Splash, Expanded Splash, and Directional Bombs, don't apply, so the splash reaches no farther than 10 feet.</p>
</div>