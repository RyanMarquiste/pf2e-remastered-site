---
layout: article.njk
uuid: 54fd1f01-14a4-4b8c-94fb-fc888302cf18
aliases: ["diluted"]
menu: general-traits
title: "Diluted"
category: Traits
date: 2026-11-11
summary: "New trait: Diluted, for an item that has been split by a Dilution Alembic, which halves the duration and the price of the item and can't be diluted again."
---

<div class="stat-block" id="diluted">
  <h4 class="stat-block-title">Diluted</h4>
  <p>This item has been diluted, such as by a <a href="{{ 'dilution-alembic' | articleUrl(collections.articles) | url }}">Dilution Alembic</a>. The duration of its effect is half what it would otherwise be, and it has no effect at all if it was over-diluted. It is also worth half the price of the same item without this trait.</p>
  <p>An item with this trait can't be diluted again.</p>
</div>
<p class="trait-note"><strong>Special</strong> The Diluted trait exists to mark an item that has already been through a Dilution Alembic, so that it can't be split again and again into ever weaker copies. It also gives a simple visual cue that the item's duration has been reduced, and means the lower price travels with the item.</p>
