# Foundry VTT export (PF2e system)

This folder holds two Foundry modules. **Marquiste Additions** (`marquiste-additions/`) is the functional module: the scripts and the rules items they use. **CorpseCap's Cauldron** (`corpsecaps-cauldron/`) is the content module: the custom alchemical items. The content module needs the functional module, and Foundry asks you to turn it on when you enable the Cauldron. The functional module has two compendiums, and its scripts are sorted the same way:

- **Common Enhancements** (`scripts/common/`): rules that apply across the whole game. Right now that is the injury poison rules (poisoning a weapon, and using the poison up when a Strike hits or critically fails), the Fleeting trait (which removes what carries it at the end of the turn), the Mutable traits, the Formula trait with the formula books on the Crafting tab, and the Compendium Browser setup. The pack has no items yet. None of this is specific to Alchemists, so the scripts are in `scripts/common/`; the three formula items that the books use are in the CorpseCap's Cauldron module, because they describe its items.
- **Alchemist Enhancements** (`scripts/alchemist/`): features only for Alchemists: the Volatile Vial, the Field Vials, the Toxic Coatings, the Toxicologist's Mutable Acid, the Quick Vial, Create Consumable and Quick Alchemy (Marquiste) actions, and a formula item for each of PF2e's mutagen families that start at level 1 (16 of them, listed in `mutagen-formulas.js`; each covers the Lesser, Moderate, Greater and Major tiers). Built by `build.js` from `vials.js` and `mutagen-formulas.js`. The pack's id is still `marquiste-alchemist-class`, so links from existing characters keep working.

The **CorpseCap's Cauldron** module has two compendiums. The first has this site's custom alchemical items, the mutagens and Insulating Paste. The second, **Cauldron Formulas**, has one formula item for each of those families, carrying the Formula trait, so a formula can be found by trait in the Compendium Browser and put in a formula book. It has no scripts of its own: the Insulating Paste counter is in Marquiste Additions (`scripts/cauldron/`), because it is behaviour, not content.

Both modules are built by `build.js`. The Cauldron pack has two mutagens and Insulating Paste, each with 4 consumables (Lesser, Moderate, Greater, Major, priced and levelled like the other mutagens) and 4 matching `Effect:` items that apply the numbers through PF2e rule elements:

- **Mind Doubling Mutagen**: per tier, a main `Effect: Mind Doubling Mutagen` and a `... Mutant Innervation` effect, plus one shared `Effect: Mind Doubling Mutagen Drawback` that doesn't change with tier. The main effect carries the benefits (item bonuses) and grants the **Co-ordinated Thinking** free action, the shared Drawback (the penalties and weakness 5 to mental) and, only for characters with the Mutant Innervation feat, the Mutant Innervation effect (the saving throw re-roll)
- **Insulating Paste**: a choice of acid, cold, electricity or fire when the effect is applied (the same way PF2e's Energy Mutagen does it), resistance 5/10/15/20 to that type, and a badge counter of 5 instances of protection
- **Volatile Vial** (Lesser, Moderate, Greater, Major; levels 1/4/12/18): the throwable bomb, built from PF2e's own Versatile Vial data so the attack bonus and dice scale the same way. It is created by Quick Vial and is separate from the versatile vial resource
- **Field Vials**: **Bomber** (4 tiers; acid by default, and the Strike can switch to cold, electricity or fire through the Versatile Cold, Electricity and Fire traits, which also changes the splash damage), **Toxicologist** (4 poison bombs, each with a **Toxic Coating** and an **Advanced Toxic Coating** effect), **Chirurgeon** (4 healing tiers) and **Mutagenist** (a single item and effect, with the Advanced Vial physical resistance)
- **Quick Vial**: an action for Alchemists. Using it opens a picker (styled like PF2e's formula picker, with each vial's icon, traits and a check button) showing the best tier the character can make of each Volatile Vial and research-field Field Vial, with a **Show all tiers** button at the bottom that lists the lower tiers too. A Toxicologist also gets **Toxic Coating** (and **Advanced Toxic Coating** from 11th level) for each tier: picking one asks which weapon to coat and applies that effect to the character instead of creating a vial and puts it in a free hand (nothing is created if no hand is free). In combat the vial is removed when the creator's turn ends
- **Create Consumable**: an action for Alchemists. Using it expends one versatile vial, asks which alchemical consumable formula (your level or lower) to create, and adds the infused item to the character; in combat it is removed when the creator's next turn starts
- **Formula books** (Common Enhancements; `scripts/common/formula-trait.js`, `formula-books.js`, `crafting-tab.js`): PF2e's own **Formula Book (Blank)** item holds formulas, and its groups show above Known Formulas on the Crafting tab, each with the highest level formulas at the top. Each group has two buttons that open the Compendium Browser's Equipment tab: **Items** (everything) and **Formulas** (with the Formula trait already chosen). Drag what you find onto the book. A book holds two kinds of entry: a **formula item** (an item with the **Formula** trait, one for each tiered family, in the Cauldron Formulas pack), which teaches every tier at or below the character's level, so the next tier arrives on levelling up; and any **plain item**, which teaches just that item. Drop either kind on a book's group, or use the book icon on a formula row to move it between books (or to no book). A formula's book is its only group, a formula no book gives stays in Known Formulas, and formulas a player added by hand are never taken away when a book changes. Deleting a book (or removing a formula from it with the trash icon) makes the character forget what it gave. The alchemist field vials are not formulas: only the Quick Vial action makes them.
- **Mutable traits** (Common Enhancements; Mutable Acid, Mutable Poison, Mutable Fire and so on, one per damage type): like Versatile, but the target decides. Damage of the item's own type can change to the named type against a creature for which it is better. The Toxicologist Field Vials, the Toxic Coatings and any infused poison item a Toxicologist creates have **Mutable Acid**
- **Quick Alchemy (Marquiste)**: an action (adding it to a character also adds the Quick Vial and Create Consumable actions, and they are removed with it) with the revised Quick Alchemy text (Quick Vial doesn't expend a versatile vial, and items last at most 10 minutes). With the Quick Alchemy setting on, using it asks you to choose **Quick Vial** or **Create Consumable** (shown but unavailable while you have no versatile vial left); with the setting off it does nothing
- **Ichthys Mutagen**: swim Speed equal to land Speed, an item bonus to unarmed attacks, a slashing "Razor Claw" unarmed Strike, a toggleable "Underwater" option for the Perception and Wisdom-skill bonus, the Athletics penalty, and weakness 5 to electricity

The files were written against the PF2e system's own mutagen data (Cognitive Mutagen) but have **not been loaded into a running Foundry yet**, so expect to check them once (see "Check it" below).

## Layout

| Path | What it is |
| --- | --- |
| `build.js` | Generates the item JSON and `module.json`. Edit this when the item changes, then run `node foundry/build.js`. |
| `marquiste-additions/module.json`, `corpsecaps-cauldron/module.json` | The two module manifests. |
| `<module>/packs/_source/<pack>/*.json` | One JSON file per item, for each pack (the editable source). |
| `marquiste-additions/images/` | Alchemist item art (square, black background), referenced as `modules/marquiste-additions/images/...`. Regenerate from the site art with `foundry/make-icons.ps1`. |
| `corpsecaps-cauldron/images/` | The mutagen and Insulating Paste art, referenced as `modules/corpsecaps-cauldron/images/...`. Made by the same script. |
| `vials.js` | The Alchemist Enhancements items: the Volatile Vial, Field Vials, coatings and the actions; `build.js` calls it. |
| `marquiste-additions/scripts/common/` | Scripts for every character: injury poisons (`injury-poisons.js`), splash by squares (`bomb-splash.js`, `splash-geometry.js`), the Fleeting trait, the Compendium Browser setup, and helpers (`shared.js`, and `weapon-picker.js` for the picker windows). |
| `marquiste-additions/scripts/alchemist/` | Alchemist scripts: the bomb vial upkeep, the Quick Vial and Create Consumable actions, the Quick Alchemy chooser and the Toxicologist feature that gives Mutable Acid. `common/mutable-trait.js` has the Mutable traits themselves. `alchemist.js` holds the helpers they share. |
| `marquiste-additions/scripts/cauldron/` | The Insulating Paste counter. |
| `<module>/packs/<pack>/` | The compiled compendiums. **Not in the repo**: you build them in step 1. |

## Install

Foundry v11+ only reads compendiums stored as LevelDB folders, so the JSON has to be compiled once.

1. **Compile the packs.** From the repo root, with Node installed, run all four commands (the Cauldron pack is in its own module folder):

   ```bash
   npx @foundryvtt/foundryvtt-cli package pack -n marquiste-common-enhancements --type Module --in foundry/marquiste-additions/packs/_source/marquiste-common-enhancements --out foundry/marquiste-additions/packs
   ```

   ```bash
   npx @foundryvtt/foundryvtt-cli package pack -n corpsecaps-cauldron --type Module --in foundry/corpsecaps-cauldron/packs/_source/corpsecaps-cauldron --out foundry/corpsecaps-cauldron/packs
   npx @foundryvtt/foundryvtt-cli package pack -n corpsecaps-formulas --type Module --in foundry/corpsecaps-cauldron/packs/_source/corpsecaps-formulas --out foundry/corpsecaps-cauldron/packs
   ```

   ```bash
   npx @foundryvtt/foundryvtt-cli package pack -n marquiste-alchemist-class --type Module --in foundry/marquiste-additions/packs/_source/marquiste-alchemist-class --out foundry/marquiste-additions/packs
   ```

   This creates `foundry/marquiste-additions/packs/marquiste-common-enhancements/` and `.../marquiste-alchemist-class/`, and `foundry/corpsecaps-cauldron/packs/corpsecaps-cauldron/` and `.../corpsecaps-formulas/`. The Common Enhancements pack is empty for now, so Foundry would also create it for itself if you skip that command.

2. **Copy both module folders**, `foundry/marquiste-additions` and `foundry/corpsecaps-cauldron`, into your Foundry data folder, so you end up with `Data/modules/marquiste-additions/module.json` and `Data/modules/corpsecaps-cauldron/module.json`. (Foundry's data folder is shown under Configuration in the setup screen. On Windows it's usually `%localappdata%\FoundryVTT\Data`.)

3. In your world, go to **Settings → Manage Modules**, enable **Marquiste Additions** and **CorpseCap's Cauldron**, and save. (Enabling the Cauldron on its own makes Foundry offer to turn on Marquiste Additions too.)

4. Open the **Compendium Packs** tab. The **Common Enhancements** and **Alchemist Enhancements** packs appear under Marquiste Additions, and the **CorpseCap's Cauldron** and **Cauldron Formulas** packs under CorpseCap's Cauldron. Drag a mutagen onto a character sheet.

Both `module.json` files ask for Foundry v13 as the minimum and are verified on v14 (build 370, with PF2e 8.6.1). If yours is a different version, change `compatibility` in `build.js` and rebuild.

## Check it

When you first use the item:

1. Drag **Mind Doubling Mutagen (Lesser)** onto a character and use it. The linked **Effect** should apply and show on the character.
2. While the effect is active, the sheet should list **Co-ordinated Thinking**, and it should go away when the effect ends.
3. Check the numbers on the sheet: +1 to Perception and Intelligence-based skills, +1 to Will saves against mental effects, −1 to Acrobatics, Stealth and Thievery, −2 to Reflex, and weakness 5 to mental damage.
4. If the character has the Mutant Innervation feat, Will saves against mental effects should roll twice and keep the higher result.

## Keeping the Alchemist items out of the equipment list

PF2e can't hide single items; its Compendium Browser lists whole packs per tab. So the Alchemist-only items are in their own pack, and `scripts/common/compendium-browser.js` switches that pack off for the Compendium Browser's **Equipment** tab the first time the module runs (it stays on for the Actions tab). To change it, open the Compendium Browser's settings and tick the pack for the Equipment tab. The module only sets this once, so your choice sticks. The pack is still in the Compendium sidebar. The mutagen formula items are in that pack too, so with the pack switched off they do not appear when you filter the Equipment tab by the Formula trait; open the pack from the Compendium sidebar and drag them onto a formula book from there, or tick the pack for the Equipment tab (which also lists the vials there).

## Module settings

Open **Settings → Configure Settings → Marquiste Additions**. The options are world settings, and a change takes effect straight away without a reload. Turning one off stops the module acting; it never deletes what the feature made earlier (poison effects, formula books, known formulas). The Formula trait is not an option: it only adds a name to PF2e's trait lists. The Fleeting and Mutable traits can be switched off under Troubleshooting (below).

The settings window groups them under headings:

| Heading | Setting | Default | When it is off |
|---|---|---|---|
| **Poisons** | **Application** | on | Injury poisons work as in PF2e. When on, using one asks which weapon to poison, adds a Poisoned Weapon effect, asks before replacing a poison already on that weapon, and posts the poison's description and save when the weapon hits. The Alchemist's Toxic Coatings are separate. |
| **Poisons** | **Removal** | on | The effect stays on the weapon until you delete it. When on, the first successful Strike or a critical failure uses it up (on ammunition, firing the weapon does). Covers injury poisons and Toxic Coatings. |
| **Crafting** | **Formula Books** | on | The Crafting tab is PF2e's own and nothing is synced. Formulas already learned stay known. Turning it back on brings every character with a book up to date. |
| **Alchemist** | **Quick Alchemy** | off | See below. |
| **Alchemist → Toxicologist** | **Mutable Acid** | on | Items are left as PF2e creates them. |
| **Alchemist → Toxicologist** | **Infused Poison Expiry** | on | The poison effect stays on the weapon after resting. |
| **Splash** | **Splash by squares** | on | Splash works as in PF2e. See Splash by squares below. |
| **Splash** | **Apply splash automatically** | off | The card has an Apply button for each creature. When on, the active GM's screen applies the splash as soon as the damage is rolled. |
| **Cauldron** | **Insulating Paste** | on | No chat message with the "use up one instance" button. |
| **Troubleshooting** | **Troubleshooting mode** | off | The switches below it are hidden and ignored. See Troubleshooting below. |

Foundry's settings window has no headings of its own, so `scripts/common/settings.js` adds them (and puts the settings in this order) when the window opens. If a Foundry update changes the window's markup, the settings still work and just appear in a plain list.

### Troubleshooting

When the module clashes with another module, tick **Troubleshooting mode** under **Troubleshooting**. A switch appears for each feature, all on. Switch features off one at a time until the problem goes away, and you have found which part clashes.

- **Fleeting trait** and **Mutable traits**: the two traits' behaviour. With either off, the trait is only a label.
- **Crafting tab layout**: the formula books drawn on the Crafting tab (the tab becomes PF2e's own).
- **Formula sync**: the module changing a character's formula list.
- **Alchemist actions**: Quick Vial, Create Consumable, the Quick Alchemy (Marquiste) chooser, and removing what they create at the end of the turn.
- **Bomb vial upkeep**: marking a thrown vial as used and removing it afterwards.
- **Compendium Browser pack**: the one-time change that hides the Alchemist pack from the Equipment tab.
- **Log activity**: writes what the module is doing to the browser console (F12).

These switches only count while Troubleshooting mode is on. Turn it off and every one is ignored, so everything runs normally, whatever the switches were left at. While it is on and anything is off, the GM is told when the world loads.

### Splash by squares

A weapon with the **Splash** trait (the alchemical bombs; `scripts/common/bomb-splash.js`, with the square arithmetic in `splash-geometry.js`) splashes by grid squares instead of leaving it to the table:

1. **Choosing the square.** When such a weapon is thrown at a creature that takes up more than one square, the highlighted squares of the target appear on the map and you click the one the bomb lands in (right-click or Esc to skip; a small window with the squares as buttons is used if the map can't be used). A creature of one square needs no choice.
2. **The area.** The chosen square and the squares around it, diagonals included. Each creature takes the splash once for every one of its squares in the area, so a creature on two of them takes splash 1 as 2. Everyone counts: allies, the thrower and hidden creatures.
3. **The target.** On a hit the target takes its splash as part of the damage roll, so it is added to the primary damage before resistances and weaknesses. A critical hit does not double it. On a miss only the square the bomb landed in is splashed, so the target takes the splash once and nobody else does. A critical failure deals no splash.
4. **Everyone else** is listed on a chat card with the amount each takes. Each has an Apply button (a player can only press it for creatures they can change; otherwise the GM presses it), or with **Apply splash automatically** on the active GM's screen applies it and the card only lists the totals. The separate splash roll PF2e attaches to the damage card is dropped while this is on, so the splash cannot be applied twice.

More rings of squares when something widens the splash: each of **Expanded Splash** (switched on in the character's rolls toggles), the **Splash 10 ft** trait, and the bomb's critical specialization on a critical hit adds one ring (5 ft), up to three rings. The card says what widened it.

It works on square-grid scenes where the target is on the scene being viewed. On a hex or gridless scene, or if no square was chosen for a large target, PF2e's own splash is used and the roll is left as it was. The extra splash for a large target is added into PF2e's damage roll after the dice are rolled; if the changed roll does not add up, the module leaves the roll alone and tells you.

### Fleeting

An item or effect with the **Fleeting** trait that lands on a character is removed when the turn it was created in ends, and so is a creature with the trait that is put on the scene. This needs a running combat: outside combat nothing expires, and the GM removes it. Only the moment of creation starts the clock, so items that already exist are never removed. The vials made by Quick Vial and the items made by Create Consumable end the way those actions describe and are left alone by this.

### Quick Alchemy

Tick **Quick Alchemy** under **Alchemist** (it was called "Use the Volatile Vial house rules", and keeps its saved value). While it's on, using the **Quick Alchemy (Marquiste)** action asks you to choose **Quick Vial** or **Create Consumable** (Create Consumable is shown but unavailable while the character has no versatile vial left). The setting does not touch PF2e's own Quick Alchemy.

An Alchemist's **versatile vials** stay exactly as PF2e has them: a resource tied to the Versatile Vial item. The **Volatile Vial** is the separate, throwable bomb version, and it only exists when **Quick Vial** creates one (placed in a free hand). Nothing renames or replaces the Versatile Vial. If a character still has a Versatile Vial that an earlier version of this module renamed to Volatile Vial, it is put back when the world loads.

## Notes on how the rules are built

- **Toxic Coating:** each coating effect asks which weapon is coated (any owned weapon dealing piercing or slashing damage; the Quick Vial picker also requires that it is held or worn, which PF2e's own prompt can't test), adds its poison damage to that weapon's damage only, tags the weapon "poisoned" and "toxic-coating", and adds a note to the weapon's description. The effect follows the Injury trait: it is used up by the first successful Strike and by a critical failure, a miss leaves it on, and it otherwise ends at the end of the turn. `scripts/common/injury-poisons.js` removes it when the coated weapon's damage is rolled (which only happens on a hit), or when its attack roll is a critical failure (this needs PF2e to know the degree of success, so it only works when the Strike has a target to compare against). Ammunition itself can't be chosen, because PF2e gives a damage roll no way to tell which loaded ammunition was fired. Instead you coat the weapon the ammunition is loaded in (it must still deal piercing or slashing damage). On such a weapon the poison is really on the ammunition, so firing it uses the coating up: a miss spends it at once, and a hit spends it after that shot's damage is rolled.
- **Injury poisons:** `scripts/common/injury-poisons.js` handles every injury poison from PF2e's equipment (any consumable in the poison category with the Injury trait). When a character uses one, the module asks which held or worn piercing or slashing weapon to poison (the same picker as the Toxic Coatings), adds a **Poisoned Weapon** effect to the character, tags the weapon "poisoned" and "injury-poison", and adds a note to its description. The effect has no time limit, except that a poison an alchemist made (one with the Infused trait) keeps that trait on the effect and ends at daily preparations (see **Infused poisons** below). It is used up by the first successful Strike (its damage roll) or a critical failure, a miss leaves it on, and on a weapon that fires ammunition it is used up when the weapon is fired. A hit posts the poison's description and saving throw in the chat for the GM to resolve; Foundry does not apply poison afflictions itself. A weapon holds one poison at a time: if the chosen weapon already has an injury poison or a Toxic Coating, a warning asks whether to overwrite it (the same check applies when a Toxicologist applies a Toxic Coating through Quick Vial). Declining keeps the old poison and, for an injury poison, wastes the new one, since PF2e has already used it up. Poisons that are put on a weapon some other way, such as dragging a coating effect onto a character, are not checked. PF2e has already used the poison up by the time the module sees it, so if there is no eligible weapon the poison is wasted. It also spends the Alchemist's Toxic Coatings, or any other effect with the Injury and Poison traits that has chosen a weapon.
- **Mutable traits and the Toxicologist field benefit:** `scripts/common/mutable-trait.js` registers a `Mutable <damage type>` trait for every damage type. When damage is rolled from a weapon with one, the script adds a redirect from the weapon's own damage type to the mutable type. When it is rolled from a weapon with a Mutable effect on it (the Toxic Coatings), the redirect goes from the damage types that effect adds (poison). PF2e's own redirect logic then works for each target: a target immune to the original type takes the mutable type, and a target that resists the original type more than the mutable type takes the mutable type. Weaknesses are not compared. `scripts/alchemist/toxicologist.js` is the Toxicologist feature: any infused item with the poison trait that a Toxicologist creates (Quick Vial, Create Consumable, PF2e's own Quick Alchemy) gets Mutable Acid as it is created. Acid items do not get Mutable Poison. The vials and coatings in the pack have the trait already. PF2e's built-in **Toxicologist field benefit** toggle forces everything to acid, so leave it off. It works on damage rolled through PF2e's own damage rolls. Effects made by using a consumable (rather than by Quick Vial) do not inherit the trait yet, and the traits are visible, not hidden.

- **Formula books:** a book stores its entries in the flag `flags.marquiste-additions.entries` (item uuids, in order). The character's real formula list, `system.crafting.formulas`, is kept in step by `formula-books.js` whenever a book is created, changed or deleted, or the character's level changes. The formulas the script added are remembered in the actor flag `flags.marquiste-additions.bookFormulas`, and only those are ever removed. If an entry cannot be read (for example an item from a module that is turned off) nothing is removed. PF2e adds anything dropped on the Crafting tab as a formula for that very item, so a formula item that turns up in the list is taken out and put in a book. The groups on the sheet move PF2e's own rows, so the Craft button and quantity box keep working, but they depend on PF2e's Crafting tab markup and need revisiting if PF2e redraws the character sheet.
- **Infused poisons:** PF2e's Infused trait says non-permanent effects from infused items end at the next daily preparations, but PF2e only deletes the infused items, not the poison on a weapon. `scripts/alchemist/daily-preparations.js` removes any Poisoned Weapon effect (or other effect with the Infused, Injury and Poison traits) when the character rests for the night, or when daily crafting is reset with the Reset Daily Crafting button (if daily crafting was marked complete). A poison that was not infused, such as one bought or found, keeps lasting until it is used up. A chat note says which poison went inert.

- **Create Consumable:** the action carries the same kind of crafting rule as PF2e's own Quick Alchemy, so using it opens PF2e's formula picker (the same window as Quick Alchemy: search box, formulas grouped by level), spends one versatile vial, and puts the infused item in a free hand. `scripts/alchemist/create-consumable.js` adds the checks around that: it refuses to continue with no versatile vials or no free hand, and in combat it removes the item at the start of the creator's next turn. The vial count is PF2e's versatile vials resource, tied to the quantity of the Versatile Vial item.
- **Quick Alchemy chooser:** it works on the **Quick Alchemy (Marquiste)** action. PF2e's own Quick Alchemy button on the Crafting tab is left alone.

- **Using up bomb vials:** the Volatile Vial, Bomber and Toxicologist vials have PF2e's Consumable trait, so PF2e itself takes one off their quantity whenever you make a Strike with them. A vial that reaches 0 is marked as spent but kept, because the chat card's damage buttons still need the item. `scripts/alchemist/volatile-vial.js` then deletes it a minute after its damage is rolled, or when the combat turn changes if no damage was rolled (a miss, say). Out of combat, a spent vial that is never followed by a damage roll stays at quantity 0 until you delete it.

- **Suppressing a drawback:** the Mind Doubling Mutagen Drawback effect and each Ichthys Mutagen effect have a **Drawback suppressed** toggle on the character sheet. Switching it on turns off that mutagen's penalties and weakness without removing the effect; the Mutagenist Field Vial's effect reminds you to do this. Nothing flips the toggle automatically.

- **Quick Vial:** it finds the research field from the character's Bomber, Chirurgeon, Mutagenist or Toxicologist class feature. It checks that the character has a free hand (using PF2e's own hands-free count) before creating a vial and creates nothing if they don't; the new vial goes into that hand. Applying a coating needs no free hand. It doesn't check for the alchemist's toolkit. Outside combat nothing removes the vial, so delete it yourself.

- **Vials:** the vials, coatings and Mutagenist vial carry the **Fleeting** trait, which `scripts/common/fleeting-trait.js` adds to PF2e's trait lists. In combat they are removed at the end of the turn they were created in (a vial from Quick Vial by that action's own rule); outside combat nothing removes them. The Field Vials' "only for the matching research field" limit isn't enforced. The Toxic Coating effects add their poison damage to every Strike until the end of the turn, so remove them yourself after the first hit.

- **Insulating Paste:** the effect shows a counter badge starting at 5. PF2e doesn't track this itself, so `scripts/cauldron/insulating-paste.js` (loaded by the module) watches PF2e's "damage taken" chat messages. When the paste's resistance reduced the damage, it posts a chat message with a **Use up one instance of protection** button. Pressing it (the character's owner or a GM) lowers the badge by one and removes the effect at 0. Each message can only be counted once. The prompt is posted from the GM's client, so a GM has to be connected. The duration still runs out on its own.

- **Ichthys Mutagen:** "Breathe water" and "can't breathe air" have no rule element, so they stay as description text. The "Razor Claw" Strike is added next to the character's existing unarmed attacks rather than replacing them (the same way PF2e's Bestial Mutagen adds claws and jaws). The Perception and Wisdom-skill bonus only applies while the **Underwater** toggle on the effect is switched on. The swim Speed uses `@actor.attributes.speed.value`; if it shows 0 on a sheet, check that formula first.

- Mental and emotion saves use the predicate `item:trait:mental` or `item:trait:emotion`, the same pattern PF2e's own effects use. A save against something that isn't tagged with those traits won't get the bonus.
- "Intelligence-based skill checks" is expressed as the skills Arcana, Crafting, Lore, Occultism and Society, plus Perception.
- The re-roll needs the character to own a feat with the slug `mutant-innervation`. If the system names that feat differently, edit the `RollTwice` predicate in `build.js`.
- The item art is the site's image on a square black background. Foundry shows it as the item and effect icon.

## Changing or adding items

Edit `build.js`, run `node foundry/build.js`, then repeat step 1 (compile) and replace the module in your Foundry data folder. Item IDs are derived from the item names, so links between the items stay stable across rebuilds.
