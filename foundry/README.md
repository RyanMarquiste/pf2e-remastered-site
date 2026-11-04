# Foundry VTT export (PF2e system)

`marquiste-additions/` is a Foundry module with three compendiums, and its scripts are sorted the same way:

- **Common Enhancements** (`scripts/common/`): rules that apply across the whole game. Right now that is the injury poison rules (poisoning a weapon, and using the poison up when a Strike hits or critically fails), the Fleeting trait, and the Compendium Browser setup. The pack has no items yet.
- **Alchemist Enhancements** (`scripts/alchemist/`): features only for Alchemists: the Volatile Vial, the Field Vials, the Toxic Coatings, the Toxinfused trait, and the Quick Vial, Create Consumable and Quick Alchemy (House Rule) actions. Built by `build.js` from `vials.js`. The pack's id is still `marquiste-alchemist-class`, so links from existing characters keep working.
- **CorpseCap's Cauldron** (`scripts/cauldron/`): this site's custom alchemical items, the mutagens and Insulating Paste.

All three are built by `build.js`. The Cauldron pack has two mutagens and Insulating Paste, each with 4 consumables (Lesser, Moderate, Greater, Major, priced and levelled like the other mutagens) and 4 matching `Effect:` items that apply the numbers through PF2e rule elements:

- **Mind Doubling Mutagen**: per tier, a main `Effect: Mind Doubling Mutagen` and a `... Mutant Innervation` effect, plus one shared `Effect: Mind Doubling Mutagen Drawback` that doesn't change with tier. The main effect carries the benefits (item bonuses) and grants the **Co-ordinated Thinking** free action, the shared Drawback (the penalties and weakness 5 to mental) and, only for characters with the Mutant Innervation feat, the Mutant Innervation effect (the saving throw re-roll)
- **Insulating Paste**: a choice of acid, cold, electricity or fire when the effect is applied (the same way PF2e's Energy Mutagen does it), resistance 5/10/15/20 to that type, and a badge counter of 5 instances of protection
- **Volatile Vial** (Lesser, Moderate, Greater, Major; levels 1/4/12/18): the throwable bomb, built from PF2e's own Versatile Vial data so the attack bonus and dice scale the same way. It is created by Quick Vial and is separate from the versatile vial resource
- **Field Vials**: **Bomber** (4 tiers; acid by default, and the Strike can switch to cold, electricity or fire through the Versatile Cold, Electricity and Fire traits, which also changes the splash damage), **Toxicologist** (4 poison bombs, each with a **Toxic Coating** and an **Advanced Toxic Coating** effect), **Chirurgeon** (4 healing tiers) and **Mutagenist** (a single item and effect, with the Advanced Vial physical resistance)
- **Quick Vial**: an action for Alchemists. Using it opens a picker (styled like PF2e's formula picker, with each vial's icon, traits and a check button) showing the best tier the character can make of each Volatile Vial and research-field Field Vial, with a **Show all tiers** button at the bottom that lists the lower tiers too. A Toxicologist also gets **Toxic Coating** (and **Advanced Toxic Coating** from 11th level) for each tier: picking one asks which weapon to coat and applies that effect to the character instead of creating a vial and puts it in a free hand (nothing is created if no hand is free). In combat the vial is removed when the creator's turn ends
- **Create Consumable**: an action for Alchemists. Using it expends one versatile vial, asks which alchemical consumable formula (your level or lower) to create, and adds the infused item to the character; in combat it is removed when the creator's next turn starts
- **Toxinfused trait**: the Toxicologist Field Vials, the Toxic Coatings, and any infused acid or poison item a Toxicologist creates carry the Toxinfused trait. Damage rolled from such an item, or from a weapon with such a coating, can switch between acid and poison for each target
- **Quick Alchemy (House Rule)**: an action (adding it to a character also adds the Quick Vial and Create Consumable actions, and they are removed with it) with the revised Quick Alchemy text (Quick Vial doesn't expend a versatile vial, and items last at most 10 minutes). With the Volatile Vial setting on, using it asks you to choose **Quick Vial** or **Create Consumable** (only offered while you have a versatile vial left); with the setting off it does nothing
- **Ichthys Mutagen**: swim Speed equal to land Speed, an item bonus to unarmed attacks, a slashing "Razor Claw" unarmed Strike, a toggleable "Underwater" option for the Perception and Wisdom-skill bonus, the Athletics penalty, and weakness 5 to electricity

The files were written against the PF2e system's own mutagen data (Cognitive Mutagen) but have **not been loaded into a running Foundry yet**, so expect to check them once (see "Check it" below).

## Layout

| Path | What it is |
| --- | --- |
| `build.js` | Generates the item JSON and `module.json`. Edit this when the item changes, then run `node foundry/build.js`. |
| `marquiste-additions/module.json` | Module manifest. |
| `marquiste-additions/packs/_source/<pack>/*.json` | One JSON file per item, for each pack (the editable source). |
| `marquiste-additions/images/` | Item art (square, black background), referenced as `modules/marquiste-additions/images/...`. Regenerate from the site art with `foundry/make-icons.ps1`. |
| `vials.js` | The Alchemist Enhancements items: the Volatile Vial, Field Vials, coatings and the actions; `build.js` calls it. |
| `marquiste-additions/scripts/common/` | Scripts for every character: injury poisons (`injury-poisons.js`), the Fleeting trait, the Compendium Browser setup, and helpers (`shared.js`, and `weapon-picker.js` for the picker windows). |
| `marquiste-additions/scripts/alchemist/` | Alchemist scripts: the Volatile Vial setting, the Quick Vial and Create Consumable actions, the Quick Alchemy chooser and the Toxinfused trait. `alchemist.js` holds the helpers they share. |
| `marquiste-additions/scripts/cauldron/` | The Insulating Paste counter. |
| `marquiste-additions/packs/<pack>/` | The compiled compendiums. **Not in the repo**: you build them in step 1. |

## Install

Foundry v11+ only reads compendiums stored as LevelDB folders, so the JSON has to be compiled once.

1. **Compile the packs.** From the repo root, with Node installed, run all three commands:

   ```bash
   npx @foundryvtt/foundryvtt-cli package pack -n marquiste-common-enhancements --type Module --in foundry/marquiste-additions/packs/_source/marquiste-common-enhancements --out foundry/marquiste-additions/packs
   ```

   ```bash
   npx @foundryvtt/foundryvtt-cli package pack -n corpsecaps-cauldron --type Module --in foundry/marquiste-additions/packs/_source/corpsecaps-cauldron --out foundry/marquiste-additions/packs
   ```

   ```bash
   npx @foundryvtt/foundryvtt-cli package pack -n marquiste-alchemist-class --type Module --in foundry/marquiste-additions/packs/_source/marquiste-alchemist-class --out foundry/marquiste-additions/packs
   ```

   This creates `foundry/marquiste-additions/packs/marquiste-common-enhancements/`, `.../corpsecaps-cauldron/` and `.../marquiste-alchemist-class/`. The Common Enhancements pack is empty for now, so Foundry would also create it for itself if you skip that command.

2. **Copy the module** folder `foundry/marquiste-additions` into your Foundry data folder, so you end up with `Data/modules/marquiste-additions/module.json`. (Foundry's data folder is shown under Configuration in the setup screen. On Windows it's usually `%localappdata%\FoundryVTT\Data`.)

3. In your world, go to **Settings → Manage Modules**, enable **Marquiste Additions**, and save.

4. Open the **Compendium Packs** tab. The **Common Enhancements**, **Alchemist Enhancements** and **CorpseCap's Cauldron** packs appear under Marquiste Additions. Drag a mutagen onto a character sheet.

`module.json` asks for Foundry v13 as the minimum. If yours is a different version, change `compatibility` in `build.js` and rebuild.

## Check it

When you first use the item:

1. Drag **Mind Doubling Mutagen (Lesser)** onto a character and use it. The linked **Effect** should apply and show on the character.
2. While the effect is active, the sheet should list **Co-ordinated Thinking**, and it should go away when the effect ends.
3. Check the numbers on the sheet: +1 to Perception and Intelligence-based skills, +1 to Will saves against mental effects, −1 to Acrobatics, Stealth and Thievery, −2 to Reflex, and weakness 5 to mental damage.
4. If the character has the Mutant Innervation feat, Will saves against mental effects should roll twice and keep the higher result.

## Keeping the Alchemist items out of the equipment list

PF2e can't hide single items; its Compendium Browser lists whole packs per tab. So the Alchemist-only items are in their own pack, and `scripts/common/compendium-browser.js` switches that pack off for the Compendium Browser's **Equipment** tab the first time the module runs (it stays on for the Actions tab). To change it, open the Compendium Browser's settings and tick the pack for the Equipment tab. The module only sets this once, so your choice sticks. The pack is still in the Compendium sidebar.

## Module setting: Volatile Vial house rules

Open **Settings → Configure Settings → Marquiste Additions** and tick **Use the Volatile Vial house rules** (off by default). While it's on, using the **Quick Alchemy (House Rule)** action asks you to choose **Quick Vial** or **Create Consumable** (Create Consumable only while the character has a versatile vial left). The setting does not touch PF2e's own Quick Alchemy.

An Alchemist's **versatile vials** stay exactly as PF2e has them: a resource tied to the Versatile Vial item. The **Volatile Vial** is the separate, throwable bomb version, and it only exists when **Quick Vial** creates one (placed in a free hand). Nothing renames or replaces the Versatile Vial. If a character still has a Versatile Vial that an earlier version of this module renamed to Volatile Vial, it is put back when the world loads.

## Notes on how the rules are built

- **Toxic Coating:** each coating effect asks which weapon is coated (any owned weapon dealing piercing or slashing damage; the Quick Vial picker also requires that it is held or worn, which PF2e's own prompt can't test), adds its poison damage to that weapon's damage only, tags the weapon "poisoned" and "toxic-coating", and adds a note to the weapon's description. The effect follows the Injury trait: it is used up by the first successful Strike and by a critical failure, a miss leaves it on, and it otherwise ends at the end of the turn. `scripts/common/injury-poisons.js` removes it when the coated weapon's damage is rolled (which only happens on a hit), or when its attack roll is a critical failure (this needs PF2e to know the degree of success, so it only works when the Strike has a target to compare against). Ammunition itself can't be chosen, because PF2e gives a damage roll no way to tell which loaded ammunition was fired. Instead you coat the weapon the ammunition is loaded in (it must still deal piercing or slashing damage). On such a weapon the poison is really on the ammunition, so firing it uses the coating up: a miss spends it at once, and a hit spends it after that shot's damage is rolled.
- **Injury poisons:** `scripts/common/injury-poisons.js` handles every injury poison from PF2e's equipment (any consumable in the poison category with the Injury trait). When a character uses one, the module asks which held or worn piercing or slashing weapon to poison (the same picker as the Toxic Coatings), adds a **Poisoned Weapon** effect to the character, tags the weapon "poisoned" and "injury-poison", and adds a note to its description. The effect has no time limit. It is used up by the first successful Strike (its damage roll) or a critical failure, a miss leaves it on, and on a weapon that fires ammunition it is used up when the weapon is fired. A hit posts the poison's description and saving throw in the chat for the GM to resolve; Foundry does not apply poison afflictions itself. A weapon holds one poison at a time, so a new one replaces the old. PF2e has already used the poison up by the time the module sees it, so if there is no eligible weapon the poison is wasted. It also spends the Alchemist's Toxic Coatings, or any other effect with the Injury and Poison traits that has chosen a weapon.
- **Toxinfused (Toxicologist field benefit):** the benefit belongs to the item, not the character. `scripts/alchemist/toxicologist.js` registers the **Toxinfused** trait. The Toxicologist Field Vials and the Toxic Coating effects have it already, and any other infused item with the acid or poison trait that a Toxicologist creates (Quick Vial, Create Consumable, PF2e's own Quick Alchemy) gets it as it is created. When damage is rolled from an item with the trait, or from a weapon that has a Toxinfused effect on it, the script adds acid-to-poison and poison-to-acid redirects to the roll, then PF2e's own redirect logic does the work for each target: a target immune to one type takes the other, and a target that resists one takes whichever it resists less. Weaknesses are not compared. PF2e's built-in **Toxicologist field benefit** toggle forces everything to acid, so leave it off. It works on damage rolled through PF2e's own damage rolls. Effects made by using a consumable (rather than by Quick Vial) do not inherit the trait yet, and the trait is visible, not hidden.

- **Create Consumable:** the action carries the same kind of crafting rule as PF2e's own Quick Alchemy, so using it opens PF2e's formula picker (the same window as Quick Alchemy: search box, formulas grouped by level), spends one versatile vial, and puts the infused item in a free hand. `scripts/alchemist/create-consumable.js` adds the checks around that: it refuses to continue with no versatile vials or no free hand, and in combat it removes the item at the start of the creator's next turn. The vial count is PF2e's versatile vials resource, tied to the quantity of the Versatile Vial item.
- **Quick Alchemy chooser:** it works on the **Quick Alchemy (House Rule)** action. PF2e's own Quick Alchemy button on the Crafting tab is left alone.

- **Using up bomb vials:** the Volatile Vial, Bomber and Toxicologist vials have PF2e's Consumable trait, so PF2e itself takes one off their quantity whenever you make a Strike with them. A vial that reaches 0 is marked as spent but kept, because the chat card's damage buttons still need the item. `scripts/alchemist/volatile-vial.js` then deletes it a minute after its damage is rolled, or when the combat turn changes if no damage was rolled (a miss, say). Out of combat, a spent vial that is never followed by a damage roll stays at quantity 0 until you delete it.

- **Suppressing a drawback:** the Mind Doubling Mutagen Drawback effect and each Ichthys Mutagen effect have a **Drawback suppressed** toggle on the character sheet. Switching it on turns off that mutagen's penalties and weakness without removing the effect; the Mutagenist Field Vial's effect reminds you to do this. Nothing flips the toggle automatically.

- **Quick Vial:** it finds the research field from the character's Bomber, Chirurgeon, Mutagenist or Toxicologist class feature. It checks that the character has a free hand (using PF2e's own hands-free count) before creating a vial and creates nothing if they don't; the new vial goes into that hand. Applying a coating needs no free hand. It doesn't check for the alchemist's toolkit. Outside combat nothing removes the vial, so delete it yourself.

- **Vials:** the vials, coatings and Mutagenist vial carry the **Fleeting** trait, which `scripts/common/fleeting-trait.js` adds to PF2e's trait lists, but nothing makes them expire; only a vial made with Quick Vial in combat is removed at the end of the turn. The Field Vials' "only for the matching research field" limit isn't enforced. The Toxic Coating effects add their poison damage to every Strike until the end of the turn, so remove them yourself after the first hit.

- **Insulating Paste:** the effect shows a counter badge starting at 5. PF2e doesn't track this itself, so `scripts/cauldron/insulating-paste.js` (loaded by the module) watches PF2e's "damage taken" chat messages. When the paste's resistance reduced the damage, it posts a chat message with a **Use up one instance of protection** button. Pressing it (the character's owner or a GM) lowers the badge by one and removes the effect at 0. Each message can only be counted once. The prompt is posted from the GM's client, so a GM has to be connected. The duration still runs out on its own.

- **Ichthys Mutagen:** "Breathe water" and "can't breathe air" have no rule element, so they stay as description text. The "Razor Claw" Strike is added next to the character's existing unarmed attacks rather than replacing them (the same way PF2e's Bestial Mutagen adds claws and jaws). The Perception and Wisdom-skill bonus only applies while the **Underwater** toggle on the effect is switched on. The swim Speed uses `@actor.attributes.speed.value`; if it shows 0 on a sheet, check that formula first.

- Mental and emotion saves use the predicate `item:trait:mental` or `item:trait:emotion`, the same pattern PF2e's own effects use. A save against something that isn't tagged with those traits won't get the bonus.
- "Intelligence-based skill checks" is expressed as the skills Arcana, Crafting, Lore, Occultism and Society, plus Perception.
- The re-roll needs the character to own a feat with the slug `mutant-innervation`. If the system names that feat differently, edit the `RollTwice` predicate in `build.js`.
- The item art is the site's image on a square black background. Foundry shows it as the item and effect icon.

## Changing or adding items

Edit `build.js`, run `node foundry/build.js`, then repeat step 1 (compile) and replace the module in your Foundry data folder. Item IDs are derived from the item names, so links between the items stay stable across rebuilds.
