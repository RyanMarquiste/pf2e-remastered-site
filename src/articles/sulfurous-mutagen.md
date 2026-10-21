---
layout: article.njk
uuid: 07ce2264-905b-4e85-b173-a93738b90f43
aliases: ["sulfurous-mutagen", "sulphurous-mutagen"]
menu: alchemist-items
title: "Sulfurous Mutagen"
category: Equipment
class: alchemist
date: 2026-10-15
summary: "A mutagen that lets the drinker exhale volatile sulfur clouds that flash-ignite when fire touches them."
---

<div class="stat-block" id="sulfurous-mutagen">
  <h4 class="stat-block-title">Sulfurous Mutagen</h4>
  <div class="stat-block-traits">
    <span class="trait">Alchemical</span>
    <span class="trait">Consumable</span>
    <span class="trait">Fire</span>
    <span class="trait">Mutagen</span>
    <span class="trait">Polymorph</span>
  </div>
  <div class="stat-block appearance-block">
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A vial of pungent, sulfur-yellow slurry that bubbles and sloshes like thick amber. It reeks of struck matches and rotten eggs, with a tear-inducing sting.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/sulfurous-mutagen.png' | url }}" alt="A round glass flask with a cork stopper and a studded leather collar, holding bubbling amber-yellow liquid, wrapped in a net of dark roots and crusted with yellow sulfur crystals, with a small metal tag marked with a flame hanging from its neck." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> L<br>
  <strong>Activate</strong> {% actionIcon "one" %} Interact</p>
  <p>While under the effects of this mutagen, several pore-like structures form in your skin, emitting wisps of sulfur vapor. You can use them to expel a cloud of ignitable sulfur gas.</p>
  <p>The mutagen also alters your body in ways that make it fire-resistant, giving you resistance to fire, scaled by tier below, as the compounds in your blood soak up heat.</p>
  <p><strong>Activate</strong> {% actionIcon "one" %} Sulfur Cloud</p>
  <p>You expel a cloud of sulfur gas that fills a 5-foot emanation around you (10 feet at Greater and Major). The cloud stays where it forms, so you can move out of it, and it disperses at the start of your next turn. Only one cloud can exist at a time; creating a new one disperses the previous one. The cloud has no effect on its own.</p>
  <p><strong>Ignition</strong> If a creature or object in the cloud takes fire or electricity damage, or an attack or effect with the fire or electricity trait is made into or through the cloud, the cloud ignites, as sparks and flame both set sulfur off. Any source of fire or electricity counts, including your enemies', and readying a fire or electricity attack for when a creature enters the cloud is a classic way to spring the trap. When the cloud ignites, each creature in it takes fire damage as noted below for this mutagen's tier, and the cloud disperses. Creatures other than you attempt a basic Reflex save against the item's DC; you attempt none, as your fire resistance from this mutagen always covers the damage. It affects allies and enemies alike.</p>
  <p><strong>Drawback</strong> The compounds building up in your body are easily overpowered by caustic and toxic substances, giving you weakness 3 to acid and weakness 3 to poison. Sulfur also tarnishes and corrodes metal, giving you a &minus;1 item penalty to attack and damage rolls with metal weapons and a &minus;1 item penalty to AC while you wear metal armor or wield a metal shield (this doesn't strip special material properties, such as silver). The odorous, tear-inducing vapors that cling to you make social graces difficult, giving you a &minus;2 item penalty to Charisma-based skill checks. The reek is also easy to follow: creatures attempting to track you by scent gain a +2 circumstance bonus to Survival checks to Track you and to Perception checks to notice you by smell.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 1</span></div>
  <p>Resistance 5, ignition damage 1d4, cloud 5 feet, duration 1 minute.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 3</span></div>
  <p>Resistance 10, ignition damage 2d4, cloud 5 feet, duration 10 minutes.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 11</span></div>
  <p>Resistance 15, ignition damage 3d4, cloud 10 feet, duration 1 hour.</p>

  <div class="stat-block-section"><span>Major</span><span>Item 17</span></div>
  <p>Resistance 20, ignition damage 4d4, cloud 10 feet, duration 1 hour.</p>
</div>
