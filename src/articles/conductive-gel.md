---
layout: article.njk
menu: alchemist-items
title: "Conductive Gel"
category: Equipment
class: alchemist
date: 2026-10-19
summary: "A thrown alchemical consumable that coats an area in a metallic gel that carries electricity to every creature standing in it."
---

<div class="stat-block" id="conductive-gel">
  <h4 class="stat-block-title">Conductive Gel</h4>
  <div class="stat-block-traits">
    <span class="trait">Alchemical</span>
    <span class="trait">Bomb</span>
    <span class="trait">Consumable</span>
  </div>
  <div class="stat-block appearance-block">
    <p class="appearance-label">Appearance</p>
    <p>A corked flask of thick, translucent gel the color of pale silver, suspended with fine flecks of metallic grit that glint when the glass is tilted. Faint static makes the surface prickle, and it carries a sharp scent of ozone and wet metal.</p>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> L<br>
  <strong>Activate</strong> {% actionIcon "one" %} Strike</p>
  <p>Throw the flask at a square within 20 feet. This Strike targets the square instead of a creature and deals no damage. Make a bomb attack roll against a DC equal to the standard DC for your level (from the level-based DC table in GM Core) minus 2. The attack can only succeed or fail; it is never a critical success or critical failure. It counts as a Strike with a bomb for abilities that key off bombs, such as Quick Bomber, and it counts toward your multiple attack penalty.</p>
  <p><strong>Success</strong> The flask coats an area with that square at its center or corner, covering the surface in conductive gel, as noted below for its tier.</p>
  <p><strong>Failure</strong> The flask lands poorly and coats a smaller area: 5 feet smaller on each side than noted below for its tier, but always including the target square.</p>
  <p>The gel doesn't hinder movement or make footing treacherous. It remains for 1 minute, after which it dries and becomes inert.</p>
  <p><strong>Special</strong> The area is conductive. Whenever an effect with the electricity trait, such as an electricity attack or area effect, is applied to Conductive Gel (including attacks or effects against the squares it covers), each creature in the area takes electricity damage, as noted below for its tier, with a basic Reflex save. The gel isn't consumed. It can deal this damage only once per round. If a creature in the area is also taking electricity damage from the effect that energized the gel, add this damage to that damage. The two are combined into a single instance of damage, sharing the creature's saving throw result against the energizing effect, with resistances applied to the total once.</p>

  <div class="stat-block-section"><span>Lesser</span><span>Item 2</span></div>
  <p>Conductive Gel coats a 10-foot square. Creatures in the area take 2d4 electricity damage when it is energized.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 8</span></div>
  <p>You gain a +1 item bonus to attack rolls. Conductive Gel coats a 15-foot square. Creatures in the area take 5d4 electricity damage when it is energized.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 15</span></div>
  <p>You gain a +2 item bonus to attack rolls. Conductive Gel coats a 20-foot square. Creatures in the area take 10d4 electricity damage when it is energized.</p>
</div>
