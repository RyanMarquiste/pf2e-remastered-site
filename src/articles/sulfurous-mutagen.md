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
    <span class="trait">Elixir</span>
    <span class="trait">Mutagen</span>
    <span class="trait">Polymorph</span>
  </div>
  <div class="stat-block appearance-block">
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A vial of pungent, sulfur-yellow slurry that bubbles and sloshes like thick amber. It reeks with a tear-inducing sting of struck matches and rotten eggs.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/sulfurous-mutagen.png' | url }}" alt="A round glass flask with a cork stopper and a studded leather collar, holding bubbling amber-yellow liquid, wrapped in a net of dark roots and crusted with yellow sulfur crystals, with a small metal tag marked with a flame hanging from its neck." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> L<br>
  <strong>Activate</strong> {% actionIcon "one" %} Interact</p>
  <p>While under the effects of this mutagen, your body transforms to develop a yellowish tone and pallor. Several pore-like structures form in your skin, emitting wisps of vapor that contain sulfur dust. You can use them to expel a cloud of ignitable sulfur dust.</p>
  <p>The mutagen also alters your body in ways that make it fire-resistant, giving you resistance to fire, scaled by tier below.</p>
  <p>While you are under the effects of this mutagen, you can use the Sulfur Cloud action, described below.</p>
  <div class="stat-block drawback-block">
    <p class="drawback-label">Drawback</p>
    <p>The compounds building up in your body are easily overpowered by caustic and toxic substances, giving you weakness 5 to acid and weakness 5 to poison.</p>
    <p>Sulfur tarnishes and corrodes metal, giving you a &minus;1 item penalty to attack and damage rolls with metal weapons and a &minus;1 item penalty to AC while you wear metal armor or wield a metal shield (this doesn't strip special material properties, such as silver).</p>
    <p>The odorous, tear-inducing vapors that cling to you make social graces difficult, giving you a &minus;2 item penalty to Charisma-based skill checks.</p>
    <p>The reek is easy to follow: creatures attempting to track you by scent gain a +2 circumstance bonus to Survival checks to Track you and to Perception checks to notice you by smell.</p>
  </div>

  <div class="stat-block feat-block">
    <p class="feat-label">Mutant Physique</p>
    <p><strong>Prerequisite</strong> You have the Mutant Physique feat</p>
    <p>The compositional changes to your body let its chemicals produce the effects of a matchstick. You gain access to the Matchstick Snap action, described below.</p>
  </div>

  <div class="stat-block-section"><span>Lesser</span><span>Item 1</span></div>
  <p>Resistance 5, duration 1 minute.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 3</span></div>
  <p>Resistance 10, duration 10 minutes.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 11</span></div>
  <p>Resistance 15, duration 1 hour.</p>

  <div class="stat-block-section"><span>Major</span><span>Item 17</span></div>
  <p>Resistance 20, duration 1 hour.</p>
</div>

<div class="stat-block" id="sulfur-cloud">
  <h4 class="stat-block-title">Sulfur Cloud <span class="stat-block-action">{% actionIcon "one" %}</span></h4>
  <p><strong>Requirements</strong> You are under the effects of a Sulfurous Mutagen<br>
  <strong>Frequency</strong> once per round<br>
  <strong>Duration</strong> 1 round</p>
  <p>You expel a cloud of sulfur dust that fills an emanation around you, of the size noted below for your Sulfurous Mutagen's tier. The cloud stays where it forms, so you can move out of it, and it disperses at the start of your next turn. The cloud is thick enough to hide shapes. Creatures within the cloud are concealed, and creatures outside it are concealed to creatures within it.</p>
  <p>The cloud ignites when it is exposed to a fire or electricity effect, triggering the Sulfur Cloud Ignition effect, described below.</p>

  <div class="stat-block-section"><span>Lesser</span></div>
  <p>Cloud 5 feet.</p>

  <div class="stat-block-section"><span>Moderate</span></div>
  <p>Cloud 5 feet.</p>

  <div class="stat-block-section"><span>Greater</span></div>
  <p>Cloud 10 feet.</p>

  <div class="stat-block-section"><span>Major</span></div>
  <p>Cloud 10 feet.</p>
</div>

<div class="stat-block" id="sulfur-cloud-ignition">
  <h4 class="stat-block-title">Sulfur Cloud Ignition <span class="stat-block-action">Effect</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Fire</span>
  </div>
  <p><strong>Trigger</strong> A creature or object in your Sulfur Cloud takes fire or electricity damage, or an attack or effect with the fire or electricity trait is made into or through the cloud<br>
  <strong>Saving Throw</strong> basic Reflex against the item's DC, noted below for your Sulfurous Mutagen's tier</p>
  <p>The cloud ignites, as sparks and flame both set sulfur off. Any source of fire or electricity counts, including your enemies', and readying a fire or electricity attack for when a creature enters the cloud is a classic way to spring the trap.</p>
  <p>Each creature in the cloud takes fire damage as noted below for your Sulfurous Mutagen's tier, and the cloud disperses, which ends the concealment it provides. It affects allies and enemies alike.</p>

  <div class="stat-block-section"><span>Lesser</span></div>
  <p>Item DC 15. 1d4 fire damage.</p>

  <div class="stat-block-section"><span>Moderate</span></div>
  <p>Item DC 18. 2d4 fire damage.</p>

  <div class="stat-block-section"><span>Greater</span></div>
  <p>Item DC 28. 3d4 fire damage.</p>

  <div class="stat-block-section"><span>Major</span></div>
  <p>Item DC 36. 4d4 fire damage.</p>
</div>

<div class="stat-block" id="matchstick-snap">
  <h4 class="stat-block-title">Matchstick Snap <span class="stat-block-action">{% actionIcon "one" %}</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Fire</span>
    <span class="trait">Manipulate</span>
  </div>
  <p><strong>Requirements</strong> You are under the effects of a Sulfurous Mutagen, and you have the Mutant Physique feat<br>
  <strong>Frequency</strong> once per round</p>
  <p>With a snap of your fingers, your body's chemicals generate the same effects as Activating a matchstick: a flame that you can touch to a flammable object, and that stays lit for 1 round. This doesn't require a matchstick, an alchemist's toolkit, or Quick Alchemy.</p>
</div>