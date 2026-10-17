---
layout: article.njk
menu: alchemist-items
title: "Voltaic Mutagen"
category: Equipment
class: alchemist
date: 2026-10-08
summary: "A mutagen that turns the drinker's body into a living bio-electric capacitor, crackling with eel-like current."
---

<div class="stat-block" id="voltaic-mutagen">
  <h4 class="stat-block-title">Voltaic Mutagen</h4>
  <div class="stat-block-traits">
    <span class="trait">Alchemical</span>
    <span class="trait">Consumable</span>
    <span class="trait">Electricity</span>
    <span class="trait">Mutagen</span>
    <span class="trait">Polymorph</span>
  </div>
  <div class="stat-block appearance-block">
    <p class="appearance-label">Appearance</p>
    <p>A vial of faintly glowing, oily fluid.</p>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> L<br>
  <strong>Activate</strong> {% actionIcon "one" %} Interact</p>
  <p>This mutagen is modeled after the bio-electric organs of certain eels. While under its effects, tiny arcs of electricity crackle out of and back into your body, and your hair stands on end as though charged with static.</p>
  <p>You gain resistance to electricity equal to half this mutagen's level (minimum 1), and while wielding a metal weapon, your attacks with it deal a small amount of additional electricity damage.</p>
  <p>At the end of each of your turns while under its effects, you gain the tier of static charge effect noted below for this mutagen's tier.</p>
  <p>You gain an item bonus to saves against effects that would leave you paralyzed or stunned, scaled by tier below, as the current running through you resists outside attempts to seize control of your nerves. You also gain a +1 item bonus to your recovery checks while dying, as your internal bio-electric currents attempt to jump start your body and organs back to life.</p>
  <p><strong>Drawback</strong> The current running through you disrupts your own precision. You take a &minus;1 item penalty to Reflex saves, Dexterity-based skill checks, and Dexterity-based attack rolls.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 1</span></div>
  <p>Resistance 1, Lesser Static Charge, metal weapons deal +1 electricity, +1 item bonus vs. paralyzed or stunned, duration 1 minute.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 4</span></div>
  <p>Resistance 2, Moderate Static Charge, metal weapons deal +2 electricity, +1 item bonus vs. paralyzed or stunned, duration 10 minutes.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 8</span></div>
  <p>Resistance 4, Greater Static Charge, metal weapons deal +3 electricity, +2 item bonus vs. paralyzed or stunned, duration 1 hour.</p>

  <div class="stat-block-section"><span>Major</span><span>Item 12</span></div>
  <p>Resistance 6, Major Static Charge, metal weapons deal +4 electricity, +2 item bonus vs. paralyzed or stunned, duration 1 hour.</p>
</div>

<div class="stat-block" id="static-charge">
  <h4 class="stat-block-title">Static Charge <span class="stat-block-action">Effect</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Electricity</span>
  </div>
  <div class="stat-block appearance-block">
    <p class="appearance-label">Appearance</p>
    <p>Bright sparks crackle across your skin and snap at the air around you.</p>
  </div>
  <p><strong>Saving Throw</strong> basic Reflex</p>
  <p>You are ready to discharge into whatever strikes you next.</p>
  <p>The first time you're hit by a melee or unarmed attack, hit a creature with a melee or unarmed Strike, or succeed at a grapple against a creature, while you have this effect, you lose it, and the other creature takes electricity damage, as noted below for your tier. For this purpose, a touch effect that targets you, friendly or not, counts as an attack.</p>
  <p>This effect doesn't stack with itself; if you would gain it again while you already have it, you instead take the stronger of the two effects.</p>
  <p><strong>Duration</strong> 1 round</p>

  <div class="stat-block-section"><span>Lesser</span></div>
  <p>1d4 electricity damage.</p>

  <div class="stat-block-section"><span>Moderate</span></div>
  <p>1d6 electricity damage.</p>

  <div class="stat-block-section"><span>Greater</span></div>
  <p>2d6 electricity damage.</p>

  <div class="stat-block-section"><span>Major</span></div>
  <p>3d6 electricity damage.</p>
</div>
