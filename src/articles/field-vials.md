---
layout: article.njk
uuid: 8fb464dd-9e71-4db7-8177-698c4ba53f4d
aliases: ["field-vials"]
menu: alchemist-items
title: "Field Vials"
category: Classes
class: alchemist
date: 2026-10-17
summary: "Volatile vials adapted for each Alchemist research field: Bomber, Chirurgeon, Mutagenist, and Toxicologist."
---

<p>An Alchemist's research field changes what their volatile vials can do. A vial counts as a field vial only for an Alchemist with the matching research field, and an <strong>Advanced Vial</strong> upgrade applies from 11th level. Field vials are volatile vials created with Quick Vial. They don't expend a versatile vial, and, like all volatile vials, they are fleeting unless their entry says otherwise.</p>

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
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A corked flask holding a chaotic mixture of four thin liquids that never quite blend: corrosive green, icy blue, pale crackling gold, and glowing orange. Each swirls in its own current, and together they smell sharply of acid, frost, ozone, and hot ash.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/bomber-field-vial.png' | url }}" alt="A tilted glass flask with a cork stopper and a dark-rope-wrapped, studded leather collar, holding a swirling mixture of green, light blue, gold, and orange liquids." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> &mdash;<br>
  <strong>Activate</strong> {% actionIcon "one" %} Strike</p>
  <div class="stat-block special-block">
    <p class="special-label">Special</p>
    <p>When you Strike with this vial, you choose its damage type: acid, cold, electricity, or fire. The vial's initial and splash damage both use the chosen type, and the vial has the matching damage trait.</p>
  </div>
  <p><strong>Advanced Vial (11th level)</strong> When you create the vial, you can treat it as made of one special material of your choice: adamantine, cold iron, or dawnsilver. If you are wearing or wielding an item made of a different precious material when you create it, you can choose that material instead.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 1</span></div>
  <p>The bomb deals 1d6 (acid, cold, electricity, or fire) damage and 1 (acid, cold, electricity, or fire) splash damage.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 4</span></div>
  <p>You gain a +1 item bonus to attack rolls. The bomb deals 2d6 (acid, cold, electricity, or fire) damage and 2 (acid, cold, electricity, or fire) splash damage.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 12</span></div>
  <p>You gain a +2 item bonus to attack rolls. The bomb deals 3d6 (acid, cold, electricity, or fire) damage and 3 (acid, cold, electricity, or fire) splash damage.</p>

  <div class="stat-block-section"><span>Major</span><span>Item 18</span></div>
  <p>You gain a +3 item bonus to attack rolls. The bomb deals 4d6 (acid, cold, electricity, or fire) damage and 4 (acid, cold, electricity, or fire) splash damage.</p>

  <p class="stat-block-source">Adapted from Pathfinder Player Core 2, &copy; Paizo Inc., used under the <a href="https://paizo.com/licenses/communityuse" target="_blank" rel="noopener">Community Use Policy</a>.</p>
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
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A corked flask of thick, rust-red liquid that clings and clots at the glass when tipped, flecked with bits of green herb and smelling of iron and crushed herbs.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/chirurgeon-field-vial.png' | url }}" alt="A tilted glass flask with a cork stopper and a dark-rope-wrapped, studded leather collar, holding a thick, rust-red liquid flecked with green herbs." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> &mdash;<br>
  <strong>Activate</strong> {% actionIcon "one" %} Interact</p>
  <p>Instead of dealing damage, this vial restores Hit Points to one living creature. You can either drink the vial yourself, or throw it at a willing creature within 20 feet. The creature that drinks or is hit by the vial regains Hit Points equal to the vial's initial damage for its tier. If the vial is drunk, it also has the elixir trait. Because the vial is fleeting and becomes inert at the end of your turn, handing it to another creature to drink gains nothing, which is why it can be thrown at a willing ally instead.</p>
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

  <p class="stat-block-source">Adapted from Pathfinder Player Core 2, &copy; Paizo Inc., used under the <a href="https://paizo.com/licenses/communityuse" target="_blank" rel="noopener">Community Use Policy</a>.</p>
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
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A corked flask of pale, pearly liquid that swirls slowly on its own beneath a faint haze of vapor, smooth as cream, with a clean scent like rain on warm stone.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/mutagenist-field-vial.png' | url }}" alt="A tilted glass flask with a cork stopper and a dark-rope-wrapped, studded leather collar, holding a pale, pearly, slowly swirling liquid." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> &mdash;<br>
  <strong>Activate</strong> {% actionIcon "one" %} Interact</p>
  <p>You drink this vial to suppress the drawback of one mutagen currently affecting you for 1 minute.</p>
  <p>If you have more than one drawback from separate sources, such as from Combine Elixirs or a similar ability, you suppress one of your choice. A mutagen's Drawback entry counts as a single drawback, so suppressing it ends all of its listed penalties and weaknesses for the duration.</p>
  <p><strong>Advanced Vial (11th level)</strong> When you drink a field vial, you also gain resistance to physical damage equal to half your level for the same duration.</p>

  <p class="stat-block-source">Adapted from Pathfinder Player Core 2, &copy; Paizo Inc., used under the <a href="https://paizo.com/licenses/communityuse" target="_blank" rel="noopener">Community Use Policy</a>.</p>
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
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A corked flask of oily, black-green liquid that clings to the glass in slow, dripping strands, with a bitter, acrid smell.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/toxicologist-field-vial.png' | url }}" alt="A tilted glass flask with a cork stopper and a dark-rope-wrapped, studded leather collar, holding a dark, oily green-black liquid that drips in strands down the inside of the glass." loading="lazy">
    </div>
  </div>
  <p><strong>Field Benefit</strong> The Toxicologist research field's benefit of interchanging acid and poison damage still applies to this vial. Applying the vial to your own weapon or ammunition as a single action also uses the Toxicologist's field benefit.</p>

  <p><strong>Applied</strong> {% actionIcon "one" %} Interact. Apply the vial as an injury poison to a weapon you're holding, or to a piece of ammunition on your person or loaded in a weapon you're holding. The vial is used up, and the weapon or ammunition gains one of these effects:</p>
  <ul>
    <li><a href="#toxic-coating"><strong>Toxic Coating</strong></a> The vial's initial damage is added to the first successful Strike with the coated weapon or ammunition.</li>
    <li><a href="#advanced-toxic-coating"><strong>Advanced Toxic Coating</strong></a> (Advanced Vial, 11th level) As Toxic Coating, and the creature also takes persistent poison damage equal to the vial's splash damage.</li>
  </ul>
  <div class="stat-block special-block">
    <p class="special-label">Special</p>
    <p>If your previous action was to create this vial with Quick Alchemy, applying it to a weapon you're holding, or to ammunition on your person or loaded in a weapon you're holding, costs no action. This is a feature of the Toxicologist's Field Benefit.</p>
  </div>

  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> &mdash;<br>
  <strong>Activate</strong> {% actionIcon "one" %} Strike</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 1</span></div>
  <p>1d6 poison damage and 1 poison splash damage.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 4</span></div>
  <p>You gain a +1 item bonus to attack rolls. The bomb deals 2d6 poison damage and 2 poison splash damage.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 12</span></div>
  <p>You gain a +2 item bonus to attack rolls. The bomb deals 3d6 poison damage and 3 poison splash damage.</p>

  <div class="stat-block-section"><span>Major</span><span>Item 18</span></div>
  <p>You gain a +3 item bonus to attack rolls. The bomb deals 4d6 poison damage and 4 poison splash damage.</p>

  <p class="stat-block-source">Adapted from Pathfinder Player Core 2, &copy; Paizo Inc., used under the <a href="https://paizo.com/licenses/communityuse" target="_blank" rel="noopener">Community Use Policy</a>.</p>
</div>

<div class="stat-block" id="toxic-coating">
  <h4 class="stat-block-title">Toxic Coating <span class="stat-block-action">Effect</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Fleeting</span>
    <span class="trait">Injury</span>
    <span class="trait">Poison</span>
  </div>
  <div class="stat-block appearance-block">
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>A thin, oily black-green film clings to the weapon's edge or tip in slow, beading strands, giving off a bitter, acrid smell.</p>
      </div>
      <img class="stat-block-art stat-block-art-landscape" src="{{ '/images/toxic-coating.png' | url }}" alt="A steel dagger with a leather-wrapped grip, its blade coated in a thick, dark green-black film that drips in glossy strands from the edge and tip." loading="lazy">
    </div>
  </div>
  <p><strong>Duration</strong> Unlike most injury poisons, this effect is Fleeting and will expire at the end of the current turn.</p>
  <p>The weapon or ammunition is coated with the Toxicologist Field Vial's poison. On a successful Strike with the weapon or ammunition, add the below listed poison damage to the damage of the weapon (based on the tier of the Toxicologist's Field Vial that created this effect).</p>

  <div class="stat-block-section"><span>Lesser</span></div>
  <p>Adds 1d6 poison damage.</p>

  <div class="stat-block-section"><span>Moderate</span></div>
  <p>Adds 2d6 poison damage.</p>

  <div class="stat-block-section"><span>Greater</span></div>
  <p>Adds 3d6 poison damage.</p>

  <div class="stat-block-section"><span>Major</span></div>
  <p>Adds 4d6 poison damage.</p>

  <p class="stat-block-source">Adapted from Pathfinder Player Core 2, &copy; Paizo Inc., used under the <a href="https://paizo.com/licenses/communityuse" target="_blank" rel="noopener">Community Use Policy</a>.</p>
</div>

<div class="stat-block" id="advanced-toxic-coating">
  <h4 class="stat-block-title">Advanced Toxic Coating <span class="stat-block-action">Effect</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Fleeting</span>
    <span class="trait">Injury</span>
    <span class="trait">Poison</span>
  </div>
  <div class="stat-block appearance-block">
    <div class="stat-block-body">
      <div class="stat-block-main">
        <p class="appearance-label">Appearance</p>
        <p>The oily black-green film is thicker and darker, threaded with slow-bubbling black veins that cling to the weapon's edge or tip and give off a harsher, more acrid smell.</p>
      </div>
      <img class="stat-block-art stat-block-art-landscape" src="{{ '/images/advanced-toxic-coating.png' | url }}" alt="A steel dagger with a leather-wrapped grip, its blade smothered in a thick, bubbling dark green-black sludge that hangs in heavy, glossy drips from the edge and tip." loading="lazy">
    </div>
  </div>
  <p><strong>Duration</strong> Unlike most injury poisons, this effect is Fleeting and will expire at the end of the current turn.</p>
  <p>The weapon or ammunition is coated with the Toxicologist Field Vial's poison. On a successful Strike with the weapon or ammunition, add the below listed poison damage and persistent poison damage to the damage of the weapon (based on the tier of the Toxicologist's Field Vial that created this effect).</p>
  <p><strong>Requirements</strong> Advanced Vial (11th level) from the Toxicologist research field. An Alchemist with this upgrade gains this effect in place of Toxic Coating.</p>

  <div class="stat-block-section"><span>Lesser</span></div>
  <p>Adds 1d6 poison damage. Persistent poison damage 1.</p>

  <div class="stat-block-section"><span>Moderate</span></div>
  <p>Adds 2d6 poison damage. Persistent poison damage 2.</p>

  <div class="stat-block-section"><span>Greater</span></div>
  <p>Adds 3d6 poison damage. Persistent poison damage 3.</p>

  <div class="stat-block-section"><span>Major</span></div>
  <p>Adds 4d6 poison damage. Persistent poison damage 4.</p>

  <p class="stat-block-source">Adapted from Pathfinder Player Core 2, &copy; Paizo Inc., used under the <a href="https://paizo.com/licenses/communityuse" target="_blank" rel="noopener">Community Use Policy</a>.</p>
</div>
