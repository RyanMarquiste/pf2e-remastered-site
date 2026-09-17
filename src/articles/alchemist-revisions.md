---
layout: article.njk
title: "Alchemist Revisions"
category: Classes
class: alchemist
date: 2026-02-02
summary: "A set of house-rule tweaks to the Alchemist: renaming the Versatile Vial, smoothing reagent scaling, and unlocking advanced vials earlier."
---

The Alchemist asks a lot of its players — tracking formulas, reagents, and a tight action economy — often for less payoff than a full caster or martial gets from a single action. These revisions target the rough edges without rewriting the class.

## Volatile Vial (renamed from Versatile Vial)

<div class="stat-block">
  <h4 class="stat-block-title">Volatile Vial</h4>
  <div class="stat-block-traits">
    <span class="trait">Acid</span>
    <span class="trait">Alchemical</span>
    <span class="trait">Bomb</span>
    <span class="trait">Consumable</span>
    <span class="trait">Infused</span>
    <span class="trait">Splash</span>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> &mdash;<br>
  <strong>Activate</strong> {% actionIcon "one" %} Strike</p>
  <p>This tiny glass flask contains volatile chemicals that can be used offensively in a pinch.</p>

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

**Change:** Renamed to the **Volatile Vial**. No mechanical changes yet — all four tiers and their damage/bonus progression stay identical to the text above.

"Volatile" reads better against the class's identity as something dangerous and unstable in your hands, rather than merely flexible. Further mechanical revisions to this item may follow.

## Quick Alchemy

<div class="stat-block">
  <h4 class="stat-block-title">Quick Alchemy <span class="stat-block-action">{% actionIcon "one" %}</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Alchemist</span>
    <span class="trait">Manipulate</span>
  </div>
  <p><strong>Source</strong> Player Core 2 pg. 59</p>
  <p><strong>Requirements</strong> You're either holding or wearing an alchemist's toolkit and you have a free hand</p>
  <p>You can either use up a versatile vial to make another alchemical consumable at a moment's notice or create an especially short-lived versatile vial. Any effect created by an item made with Quick Alchemy that would have a duration longer than 10 minutes lasts for 10 minutes instead.</p>

  <div class="stat-block-section"><span>Create Consumable</span></div>
  <p>You expend one of your versatile vials to create a single alchemical consumable item of your level or lower that's in your formula book. You don't have to spend the normal monetary cost in alchemical raw materials or need to attempt a Crafting check. This item has the infused trait, but it remains potent only until the start of your next turn. (As normal, you need only one formula for an item to create any level of that item.)</p>

  <div class="stat-block-section"><span>Quick Vial</span></div>
  <p>You create a versatile vial that can be used only as a bomb or for the versatile vial option from your research field (it can't be used to create a consumable, for example). This item has the infused trait, but it remains potent only until the end of your current turn.</p>

  <p class="stat-block-source">Pathfinder Player Core 2, &copy; Paizo Inc., reproduced under the <a href="https://paizo.com/licenses/communityuse" target="_blank" rel="noopener">Community Use Policy</a>.</p>
</div>

**Change:** The Quick Vial option explicitly creates a **Volatile Vial**, matching the rename above — every "versatile vial" reference in the text above is the same renamed item, not a separate consumable.

## Infused Reagents Scale Smoother

**Change:** At 5th level and every 4 levels after (9th, 13th, 17th), gain **+1 additional daily infused reagent**, on top of the normal progression.

Reagent scarcity is fine at low levels but becomes a bottleneck once an Alchemist wants to keep several different item types on hand. This adds a small buffer without doubling resources outright.

## Advanced Vials Come Online Earlier

**Change:** Advanced Alchemy (or the equivalent class feature that unlocks higher-level formulas for daily prep) becomes available **2 levels earlier** than its listed level.

Alchemists often feel like they're playing catch-up to their own level because their best options unlock later than comparable class features for other classes. This closes that gap slightly.

## Table Notes

None of these changes touch the Alchemist's core research fields or class feats — they're meant to be dropped into any existing Alchemist build.
