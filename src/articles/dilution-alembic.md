---
layout: article.njk
uuid: 207e8acb-5b17-4188-936b-ad78591e4ce2
aliases: ["dilution-alembic"]
menu: general-tools
title: "Dilution Alembic"
category: Equipment
date: 2026-11-11
summary: "A distilling apparatus that separates one alchemical elixir into two diluted elixirs with half the duration."
---

<div class="stat-block" id="dilution-alembic">
  <h4 class="stat-block-title">Dilution Alembic <span class="stat-block-action">Item 5</span></h4>
  <div class="stat-block appearance-block">
    <p class="appearance-label">Appearance</p>
    <p>A squat glass still with a long, coiled copper tube that splits in two at the end and drips into a pair of stoppered flasks hanging beneath it.</p>
  </div>
  <p><strong>Price</strong> 150 gp; <strong>Usage</strong> held in 2 hands; <strong>Bulk</strong> 2<br>
  <strong>Activate</strong> Dilute (exploration, manipulate); <strong>Duration</strong> 10 minutes<br>
  <strong>Requirements</strong> You have an alchemical elixir to dilute, which can be a mutagen or any other elixir</p>
  <p>You pour an alchemical elixir into the alembic, and the apparatus separates it into two elixirs of the same kind. The elixir you poured in is used up and replaced by the two diluted elixirs. Each has the same effect as the original and gains the <a href="{{ 'diluted' | articleUrl(collections.articles) | url }}">diluted</a> trait, but the duration of that effect depends on the duration of the original elixir's effect:</p>
  <ul>
    <li><strong>Less than 10 minutes</strong> The elixir is over-diluted. Both resulting elixirs have no effect when consumed. An elixir with an instantaneous effect counts as less than 10 minutes.</li>
    <li><strong>10 minutes or longer</strong> The duration of the effect on each resulting elixir is half the original's.</li>
  </ul>
  <p>An elixir that already has the diluted trait can't be put into the alembic.</p>
  <p><em>Example: an elixir that lasts 1 hour becomes two elixirs that last 30 minutes each. An elixir that lasts 1 minute becomes two elixirs that have no effect.</em></p>
</div>
