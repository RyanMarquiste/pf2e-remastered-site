---
layout: article.njk
uuid: d8657a73-d624-4e45-8042-4eb238519488
aliases: ["evidence"]
menu: investigator-feats
title: "Evidence"
category: Classes
class: investigator
date: 2026-10-19
summary: "An Investigator feat that lets you collect evidence for an investigation and spend it to sharpen your Recall Knowledge checks about the case."
---

<div class="stat-block" id="evidence">
  <h4 class="stat-block-title">Evidence <span class="stat-block-action">Feat 1</span></h4>
  <div class="stat-block-traits">
    <span class="trait">Fortune</span>
    <span class="trait">Investigator</span>
  </div>
  <p>You gather clues, records, and testimony into a case file, and you draw on it when your knowledge is put to the test. Each piece of Evidence is tied to one of your investigations and helps you recall what it means.</p>
  <p><strong>Evidence limit</strong> You can hold a number of pieces of Evidence equal to your investigation bonus + 1, so 2 at 1st level and 3 from 9th level. If you would exceed this limit, you must discard a piece of Evidence. Evidence is tied to the investigation it was collected for, and you lose it when you close that investigation or give it up.</p>

  <div class="stat-block-section"><span>Collect Evidence</span><span>Exploration</span></div>
  <p><strong>Requirements</strong> You have an active investigation, and a clue, object, record, or witness account that bears on its question</p>
  <p>You examine the clue and record what it shows. The GM confirms that it is relevant to the investigation and names the check to attempt, such as Perception, Society, Crafting, Medicine, or a Lore skill.</p>
  <p><strong>Success</strong> You gain one piece of Evidence for that investigation. Note it in a few words, describing what it is and what it points to, such as "muddy bootprint, matches the stable hand."</p>
  <p><strong>Failure</strong> You gain nothing from that source until you learn something new about it.</p>

  <div class="stat-block-section"><span>Consult Evidence {% actionIcon "free" %}</span><span>Free Action</span></div>
  <p><strong>Trigger</strong> You are about to attempt a Recall Knowledge check; <strong>Frequency</strong> once per Recall Knowledge check</p>
  <p>You declare that you are spending one piece of Evidence before the check is rolled. The GM then decides whether the check relates to that Evidence's investigation, meaning its question or the subject the Evidence points to.</p>
  <p><strong>Unrelated</strong> The GM hands the Evidence back with a note that it is unrelated to the investigation, and you attempt the check normally.</p>
  <p><strong>Related</strong> The Evidence is spent and can't be withdrawn. Roll the check twice and use the higher result (the GM rolls twice in secret if the check is secret). The check's outcome is as follows, in place of the normal results of Recall Knowledge.</p>
  <div class="stat-block results-block">
    <p><strong>Critical Success</strong> You learn the information, including any extra detail a critical success normally gives. The knowledge points to a new clue, which the GM describes, and you regain the Evidence you spent. You can regain Evidence this way at most once per investigation per 10 minutes.</p>
    <p><strong>Success</strong> You learn the information.</p>
    <p><strong>Failure</strong> You learn nothing new. Any information you receive is trivial or something you have already discovered.</p>
    <p><strong>Critical Failure</strong> Treat this as a failure.</p>
  </div>
  <p><strong>Special</strong> The GM should rule once, before the roll, on whether the check is about the investigation's question or the subject its Evidence points to. A neutral note such as "your Evidence doesn't help here" is enough for an unrelated check.</p>
</div>
