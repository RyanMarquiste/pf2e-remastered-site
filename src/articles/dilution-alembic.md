---
layout: article.njk
uuid: 207e8acb-5b17-4188-936b-ad78591e4ce2
aliases: ["dilution-alembic"]
menu: general-tools
title: "Dilution Alembic"
category: Equipment
date: 2026-11-11
summary: "A distilling apparatus that separates an elixir with a long-lasting effect into two diluted elixirs with half the duration and half the price."
---

<div class="stat-block" id="dilution-alembic">
  <h4 class="stat-block-title">Dilution Alembic <span class="stat-block-action">Item 5</span></h4>
  <div class="stat-block appearance-block">
    <p class="appearance-label">Appearance</p>
    <p>A squat glass still with a long, coiled copper tube that splits in two at the end and drips into a pair of stoppered flasks hanging beneath it.</p>
  </div>
  <p><strong>Price</strong> 150 gp; <strong>Usage</strong> held in 2 hands; <strong>Bulk</strong> 1<br>
  <strong>Activate</strong> Dilute (exploration, manipulate); <strong>Duration</strong> 10 minutes<br>
  <strong>Requirements</strong> You have an item to dilute that is small enough to fit in the alembic</p>
  <p>You pour an elixir into the alembic, and the apparatus separates it into two copies of that elixir. The elixir you poured in is used up and replaced by the two copies, and each gains the <a href="{{ 'diluted' | articleUrl(collections.articles) | url }}">diluted</a> trait. What the copies do depends on the elixir:</p>
  <ul>
    <li><strong>An elixir whose effect lasts 10 minutes or longer</strong> Each copy has the same effect as the original, but the duration of that effect is half the original's. This includes mutagens, which are elixirs.</li>
    <li><strong>An elixir whose effect lasts less than 10 minutes or is instantaneous</strong> The elixir is over-diluted. Both copies are useless and have no effect.</li>
  </ul>
  <p>If you pour anything other than an elixir into the alembic, it is over-diluted in the same way: both copies are useless and have no effect.</p>
  <p>An item that already has the diluted trait can't be put into the alembic.</p>
  <p><em>Example: an elixir that lasts 1 hour becomes two elixirs that last 30 minutes each. An elixir that lasts 1 minute becomes two useless elixirs.</em></p>
</div>
