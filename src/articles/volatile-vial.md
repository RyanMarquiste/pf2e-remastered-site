---
layout: article.njk
menu: alchemist-items
title: "Volatile Vial"
category: Classes
class: alchemist
date: 2026-02-02
summary: "House-rule revisions to the Alchemist's Versatile Vial, with a Field Vial version for each research field."
---

## Volatile Vial (renamed from Versatile Vial)

<div class="stat-block" id="volatile-vial">
  <h4 class="stat-block-title">Volatile Vial</h4>
  <div class="stat-block-traits">
    <span class="trait">Acid</span>
    <span class="trait">Alchemical</span>
    <span class="trait">Bomb</span>
    <span class="trait">Consumable</span>
    <span class="trait">Fleeting</span>
    <span class="trait">Infused</span>
    <span class="trait">Splash</span>
  </div>
  <div class="stat-block appearance-block">
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A tiny corked glass flask, its neck bound in rope and a studded leather collar, holding layers of green, yellow, and amber chemicals that shift and roil whenever the glass is jostled, with a pale vapor curling inside and a sharp smell leaking from the cork.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/volatile-vial.png' | url }}" alt="A tilted, squat glass flask with a cork stopper and a rope-bound, studded leather collar, holding swirling green, yellow, and amber liquid with a pale vapor curling above it." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> &mdash;<br>
  <strong>Activate</strong> {% actionIcon "one" %} Strike</p>
  <p>The volatile chemicals in this flask can be used offensively in a pinch.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 1</span></div>
  <p>The bomb deals 1d6 acid damage and 1 acid splash damage.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 4</span></div>
  <p>You gain a +1 item bonus to attack rolls. The bomb deals 2d6 acid damage and 2 acid splash damage.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 12</span></div>
  <p>You gain a +2 item bonus to attack rolls. The bomb deals 3d6 acid damage and 3 acid splash damage.</p>

  <div class="stat-block-section"><span>Major</span><span>Item 18</span></div>
  <p>You gain a +3 item bonus to attack rolls. The bomb deals 4d6 acid damage and 4 acid splash damage.</p>

  <p class="stat-block-source">Adapted from Pathfinder Player Core, &copy; Paizo Inc., used under the <a href="https://paizo.com/licenses/communityuse" target="_blank" rel="noopener">Community Use Policy</a>.</p>
</div>

## Field Vials

<p>An Alchemist's research field changes what their volatile vials can do. Each field vial below uses the Volatile Vial's tier values for its item level, initial damage, splash damage, and item bonus to attack rolls, unless the entry says otherwise. A vial counts as a field vial only for an Alchemist with the matching research field, and an <strong>Advanced Vial</strong> upgrade applies from 11th level. Volatile vials and field vials are fleeting, unless their entry says otherwise.</p>

<div class="stat-block" id="bomber-field-vial">
  <h4 class="stat-block-title">Bomber Field Vial <span class="stat-block-action">Bomber</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Alchemical</span>
    <span class="trait">Bomb</span>
    <span class="trait">Consumable</span>
    <span class="trait">Fleeting</span>
    <span class="trait">Infused</span>
    <span class="trait">Splash</span>
  </div>
  <div class="stat-block appearance-block">
    <p class="appearance-label">Appearance</p>
    <p>A tiny glass flask of fuming, sharp-smelling chemicals whose color shifts with the mix: corrosive green, frost-pale blue, crackling yellow-white, or ember red.</p>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> &mdash;<br>
  <strong>Activate</strong> {% actionIcon "one" %} Strike</p>
  <p>When you Strike with this vial, you choose its damage type: acid, cold, electricity, or fire. The vial's initial and splash damage both use the chosen type, and it gains the matching trait in place of the acid trait.</p>
  <p><strong>Advanced Vial (11th level)</strong> When you create the vial, you can treat it as made of one special material of your choice: adamantine, cold iron, or dawnsilver. If you are wearing or wielding an item made of a different precious material when you create it, you can choose that material instead.</p>
</div>

<div class="stat-block" id="chirurgeon-field-vial">
  <h4 class="stat-block-title">Chirurgeon Field Vial <span class="stat-block-action">Chirurgeon</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Alchemical</span>
    <span class="trait">Bomb</span>
    <span class="trait">Coagulant</span>
    <span class="trait">Consumable</span>
    <span class="trait">Fleeting</span>
    <span class="trait">Healing</span>
    <span class="trait">Infused</span>
  </div>
  <div class="stat-block appearance-block">
    <p class="appearance-label">Appearance</p>
    <p>A tiny glass flask of a thick, rust-red liquid that clings and clots at the glass when tipped, smelling of iron and crushed herbs.</p>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> &mdash;<br>
  <strong>Activate</strong> {% actionIcon "one" %} Interact</p>
  <p>This vial restores Hit Points to a living creature instead of dealing damage. A creature can drink it, or you can throw it at a willing creature within 20 feet. The creature recovers Hit Points equal to the vial's initial damage for its tier. The vial loses the acid and splash traits, and gains the elixir trait if a creature drinks it.</p>
  <p><strong>Coagulant</strong> A creature that recovers Hit Points from a coagulant item can't recover Hit Points from another coagulant item for 10 minutes, though it still gains their other effects.</p>
  <p><strong>Advanced Vial (11th level)</strong> When the vial heals a creature with half its maximum Hit Points or fewer, the coagulant trait doesn't apply to that healing.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 1</span></div>
  <p>Heals 1d6 Hit Points.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 4</span></div>
  <p>Heals 2d6 Hit Points.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 12</span></div>
  <p>Heals 3d6 Hit Points.</p>

  <div class="stat-block-section"><span>Major</span><span>Item 18</span></div>
  <p>Heals 4d6 Hit Points.</p>
</div>

<div class="stat-block" id="mutagenist-field-vial">
  <h4 class="stat-block-title">Mutagenist Field Vial <span class="stat-block-action">Mutagenist</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Alchemical</span>
    <span class="trait">Consumable</span>
    <span class="trait">Elixir</span>
    <span class="trait">Fleeting</span>
    <span class="trait">Infused</span>
  </div>
  <div class="stat-block appearance-block">
    <p class="appearance-label">Appearance</p>
    <p>A tiny glass flask of a pale, milky liquid that swirls slowly on its own, with a faint, clean scent like rain on warm stone.</p>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> &mdash;<br>
  <strong>Activate</strong> {% actionIcon "one" %} Interact</p>
  <p>You drink this vial to suppress the drawback of one mutagen currently affecting you for 1 minute. It loses the acid, bomb, and splash traits and gains the elixir trait, and it deals no damage.</p>
  <p>If you have more than one drawback from separate sources, such as from Combine Elixirs or a similar ability, you suppress one of your choice. A mutagen's Drawback entry counts as a single drawback, so suppressing it ends all of its listed penalties and weaknesses for the duration.</p>
  <p><strong>Advanced Vial (11th level)</strong> When you drink a field vial, you also gain resistance to physical damage equal to half your level for the same duration.</p>
</div>

<div class="stat-block" id="toxicologist-field-vial">
  <h4 class="stat-block-title">Toxicologist Field Vial <span class="stat-block-action">Toxicologist</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Alchemical</span>
    <span class="trait">Bomb</span>
    <span class="trait">Consumable</span>
    <span class="trait">Fleeting</span>
    <span class="trait">Infused</span>
    <span class="trait">Poison</span>
    <span class="trait">Splash</span>
  </div>
  <div class="stat-block appearance-block">
    <p class="appearance-label">Appearance</p>
    <p>A tiny glass flask of an oily, black-green liquid that clings to the glass in slow strands and carries a bitter, acrid smell.</p>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> &mdash;<br>
  <strong>Activate</strong> {% actionIcon "one" %} Strike (thrown) or {% actionIcon "one" %} Interact (apply as an injury poison)</p>
  <p>The vial's chemicals become poison instead of acid: it has the poison trait in place of the acid trait, and its initial and splash damage are poison damage. You can use it in either of two ways.</p>
  <p><strong>Thrown</strong> Strike with the vial as a bomb, as normal for a Volatile Vial. It deals its initial poison damage and its poison splash damage.</p>
  <p><strong>Applied</strong> Apply the vial to a weapon or a piece of ammunition as an injury poison. The vial is used up, and the weapon or ammunition gains the Toxic Coating effect below.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 1</span></div>
  <p>1d6 poison damage and 1 poison splash damage.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 4</span></div>
  <p>You gain a +1 item bonus to attack rolls. The bomb deals 2d6 poison damage and 2 poison splash damage.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 12</span></div>
  <p>You gain a +2 item bonus to attack rolls. The bomb deals 3d6 poison damage and 3 poison splash damage.</p>

  <div class="stat-block-section"><span>Major</span><span>Item 18</span></div>
  <p>You gain a +3 item bonus to attack rolls. The bomb deals 4d6 poison damage and 4 poison splash damage.</p>
</div>

<div class="stat-block" id="toxic-coating">
  <h4 class="stat-block-title">Toxic Coating <span class="stat-block-action">Effect</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Fleeting</span>
    <span class="trait">Injury</span>
    <span class="trait">Poison</span>
  </div>
  <div class="stat-block appearance-block">
    <p class="appearance-label">Appearance</p>
    <p>A thin, oily black-green film clings to the weapon's edge or tip in slow, beading strands, giving off a bitter, acrid smell.</p>
  </div>
  <p>The weapon or ammunition is coated with the Toxicologist Field Vial's poison. The vial's initial damage, as noted below for its tier, is added to the first successful Strike with the coated weapon or ammunition, and the coating is then used up. This effect deals no splash damage and doesn't use the vial's item bonus to attack rolls.</p>
  <p><strong>Advanced Vial (11th level)</strong> When the coating damages a creature, the creature also takes persistent poison damage equal to the vial's splash damage, as noted below for its tier.</p>

  <div class="stat-block-section"><span>Lesser</span></div>
  <p>Adds 1d6 poison damage. Persistent poison damage 1.</p>

  <div class="stat-block-section"><span>Moderate</span></div>
  <p>Adds 2d6 poison damage. Persistent poison damage 2.</p>

  <div class="stat-block-section"><span>Greater</span></div>
  <p>Adds 3d6 poison damage. Persistent poison damage 3.</p>

  <div class="stat-block-section"><span>Major</span></div>
  <p>Adds 4d6 poison damage. Persistent poison damage 4.</p>
</div>
