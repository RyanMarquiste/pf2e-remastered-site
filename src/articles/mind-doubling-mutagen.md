---
layout: article.njk
uuid: 3563bef0-253c-4e62-aad2-667ed2eecc71
aliases: ["mind-doubling-mutagen", "twin-mind-mutagen"]
menu: alchemist-items
title: "Mind Doubling Mutagen"
category: Equipment
class: alchemist
date: 2026-10-29
summary: "A mutagen that grows the drinker's brain into two full-sized halves, sharpening Perception, Intelligence-based skills, and saves against mental effects, at the cost of clumsy hand-offs and a weakness to mental damage."
---

<div class="stat-block" id="mind-doubling-mutagen">
  <h4 class="stat-block-title">Mind Doubling Mutagen</h4>
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
        <p>A thick pink liquid swirled with ribbons of cream that circle slowly in two separate currents. It has no smell at all, not even a faint chemical tang.</p>
      </div>
      <img class="stat-block-art" src="{{ '/images/mind-doubling-mutagen.png' | url }}" alt="A round glass flask with a cork stopper and a studded leather collar, wrapped in twisting brass coils shaped like brain folds, holding swirling pink and cream liquid, with a small metal tag stamped with a brain hanging from its neck." loading="lazy">
    </div>
  </div>
  <p><strong>Usage</strong> held in 1 hand; <strong>Bulk</strong> L<br>
  <strong>Activate</strong> {% actionIcon "one" %} Interact</p>
  <p>While under the effects of this mutagen, the top of your skull grows and expands as your brain develops into two distinct, full-sized halves. Each half can operate independently, and the two share a channel of mental communication.</p>
  <p>Others may notice a subtle shift in your personality, from analytic, logical, and pragmatic to inspired, creative, and innovative, as one brain or the other takes priority. Your body occasionally tics as the brains switch which of them controls it.</p>
  <p>The two brains cooperate to carry out tasks more efficiently, giving you an item bonus to Perception checks and Intelligence-based skill checks, and an item bonus to saving throws against mental and emotion effects, scaled by tier below.</p>
  <p>While you are under the effects of this mutagen, you can use the Co-ordinated Thinking action, described below.</p>
  <div class="stat-block drawback-block">
    <p class="drawback-label">Drawback</p>
    <p>The two brains can interact poorly when handing off control of the body, giving you a &minus;1 item penalty to Dexterity-based skill checks and a &minus;2 item penalty to Reflex saves.</p>
    <p>Mental damage hits you harder, as your increased brain capacity has more to lose, giving you weakness 5 to mental damage.</p>
  </div>

  <div class="stat-block-section"><span>Lesser</span><span>Item 1</span></div>
  <p>+1 item bonus, duration 1 minute.</p>

  <div class="stat-block-section"><span>Moderate</span><span>Item 3</span></div>
  <p>+2 item bonus, duration 10 minutes.</p>

  <div class="stat-block-section"><span>Greater</span><span>Item 11</span></div>
  <p>+3 item bonus, duration 1 hour.</p>

  <div class="stat-block-section"><span>Major</span><span>Item 17</span></div>
  <p>+4 item bonus, duration 1 hour.</p>

  <div class="stat-block feat-block">
    <p class="feat-label">Mutant Innervation</p>
    <p><strong>Prerequisite</strong> You have the Mutant Innervation feat</p>
    <p>Your brains have become adept at working together to fend off mental attacks. Whenever you attempt a saving throw against a mental effect, roll twice and take the better of the two results. This is a fortune effect.</p>
  </div>
</div>

<div class="stat-block" id="co-ordinated-thinking">
  <h4 class="stat-block-title">Co-ordinated Thinking <span class="stat-block-action">{% actionIcon "free" %}</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Concentrate</span>
  </div>
  <p><strong>Requirements</strong> You are under the effects of a Mind Doubling Mutagen<br>
  <strong>Frequency</strong> once per round</p>
  <p>On your turn, one of your brains works through a problem while the other keeps hold of the body. You Recall Knowledge with a skill in which you are at least trained.</p>
</div>
