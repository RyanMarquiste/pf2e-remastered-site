---
layout: article.njk
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
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> L<br>
  <strong>Activate</strong> {% actionIcon "one" %} Interact</p>
  <p>This vial holds a faintly glowing, oily fluid modeled after the bio-electric organs of certain eels. While under the effects of this mutagen, tiny arcs of electricity crackle out of and back into your body, and your hair stands on end as though charged with static.</p>
  <p>You gain resistance to electricity equal to half this mutagen's level (minimum 1) and a jolt of retaliatory current, scaled by the mutagen's tier below.</p>
  <p>When you first drink this mutagen, and again at the start of each of your turns while under its effects, you gain the voltaic charge effect, detailed below.</p>
  <p>While wielding a metal weapon, your attacks with it deal a small amount of additional electricity damage.</p>
  <p>You gain a status bonus to saves against effects that would leave you paralyzed or stunned, scaled by tier below, as the current running through you resists outside attempts to seize control of your nerves. You also gain a +1 status bonus to your recovery checks while dying, as the current helps jolt your heart back into rhythm.</p>
  <p><strong>Drawback</strong> The current running through you disrupts your own precision. You take a &minus;1 status penalty to Reflex saves, Dexterity-based skill checks, and Dexterity-based attack rolls. The electrical discharge doesn't distinguish friend from foe: a friendly melee, unarmed, or touch attack against you is just as likely to trigger it as a hostile one.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 1</span></div>
  <p>Resistance 1, retaliation 1d4 electricity, metal weapons deal +1 electricity, +1 status bonus vs. paralyzed or stunned, duration 1 minute.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 4</span></div>
  <p>Resistance 2, retaliation 1d6 electricity, metal weapons deal +2 electricity, +1 status bonus vs. paralyzed or stunned, duration 10 minutes.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 8</span></div>
  <p>Resistance 4, retaliation 2d6 electricity, metal weapons deal +3 electricity, +2 status bonus vs. paralyzed or stunned, duration 1 hour.</p>

  <div class="stat-block-section"><span>Major</span><span>Item 12</span></div>
  <p>Resistance 6, retaliation 3d6 electricity, metal weapons deal +4 electricity, +2 status bonus vs. paralyzed or stunned, duration 1 hour.</p>
</div>

<div class="stat-block" id="voltaic-charge">
  <h4 class="stat-block-title">Voltaic Charge <span class="stat-block-action">Effect</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Electricity</span>
  </div>
  <p>You crackle with charged current, ready to discharge into whatever strikes you next.</p>
  <p>The first time you're hit by a melee or unarmed attack while you have this effect, you lose it, and the attacker takes electricity damage with a basic Reflex save. For this purpose, a touch effect that targets you, friendly or not, counts as an attack.</p>
  <p>This effect doesn't stack with itself; gaining it again while you already have it does nothing further.</p>
  <p><strong>Special</strong> The amount of electricity damage dealt is determined by whatever granted you this effect, such as a Voltaic Mutagen.</p>
  <p><strong>Duration</strong> 1 round</p>
</div>
