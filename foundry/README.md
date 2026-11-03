# Foundry VTT export (PF2e system)

`marquiste-additions/` is a Foundry module that holds a compendium of this site's alchemical items, named **CorpseCap's Cauldron**. New alchemical items are added to this same pack. Right now it contains two mutagens and Insulating Paste, each with 4 consumables (Lesser, Moderate, Greater, Major, priced and levelled like the other mutagens) and 4 matching `Effect:` items that apply the numbers through PF2e rule elements:

- **Mind Doubling Mutagen**: per tier, a main `Effect: Mind Doubling Mutagen` and a `... Mutant Innervation` effect, plus one shared `Effect: Mind Doubling Mutagen Drawback` that doesn't change with tier. The main effect carries the benefits (item bonuses) and grants the **Co-ordinated Thinking** free action, the shared Drawback (the penalties and weakness 5 to mental) and, only for characters with the Mutant Innervation feat, the Mutant Innervation effect (the saving throw re-roll)
- **Insulating Paste**: a choice of acid, cold, electricity or fire when the effect is applied (the same way PF2e's Energy Mutagen does it), resistance 5/10/15/20 to that type, and a badge counter of 5 instances of protection
- **Volatile Vial** (Lesser, Moderate, Greater, Major; levels 1/4/12/18): a bomb built from PF2e's own Versatile Vial data, so the attack bonus and dice scale the same way
- **Field Vials**: **Bomber** (4 tiers; asks for acid, cold, electricity or fire when added to a character), **Toxicologist** (4 poison bombs, each with a **Toxic Coating** and an **Advanced Toxic Coating** effect), **Chirurgeon** (4 healing tiers) and **Mutagenist** (a single item and effect, with the Advanced Vial physical resistance)
- **Quick Vial**: an action for Alchemists. Using it asks whether to create the Volatile Vial or the Field Vial for the character's research field (tier from the character's level) and puts it in a free hand (nothing is created if no hand is free). In combat the vial is removed when the creator's turn ends
- **Quick Alchemy (House Rule)**: a feat with the revised Quick Alchemy text (Quick Vial doesn't expend a versatile vial, and items last at most 10 minutes)
- **Ichthys Mutagen**: swim Speed equal to land Speed, an item bonus to unarmed attacks, a slashing "Razor Claw" unarmed Strike, a toggleable "Underwater" option for the Perception and Wisdom-skill bonus, the Athletics penalty, and weakness 5 to electricity

The files were written against the PF2e system's own mutagen data (Cognitive Mutagen) but have **not been loaded into a running Foundry yet**, so expect to check them once (see "Check it" below).

## Layout

| Path | What it is |
| --- | --- |
| `build.js` | Generates the item JSON and `module.json`. Edit this when the item changes, then run `node foundry/build.js`. |
| `marquiste-additions/module.json` | Module manifest. |
| `marquiste-additions/packs/_source/corpsecaps-cauldron/*.json` | One JSON file per item (the editable source). |
| `marquiste-additions/images/` | Item art (square, black background), referenced as `modules/marquiste-additions/images/...`. Regenerate from the site art with `foundry/make-icons.ps1`. |
| `vials.js` | The Volatile Vial, Field Vials, coatings and Quick Alchemy feat; `build.js` calls it. |
| `marquiste-additions/scripts/` | Small scripts the module loads: the Insulating Paste counter, the Volatile Vial setting, the Quick Vial action and the Fleeting trait. |
| `marquiste-additions/packs/corpsecaps-cauldron/` | The compiled compendium. **Not in the repo**: you build it in step 1. |

## Install

Foundry v11+ only reads compendiums stored as LevelDB folders, so the JSON has to be compiled once.

1. **Compile the pack.** From the repo root, with Node installed:

   ```bash
   npx @foundryvtt/foundryvtt-cli package pack -n corpsecaps-cauldron --type Module --in foundry/marquiste-additions/packs/_source/corpsecaps-cauldron --out foundry/marquiste-additions/packs
   ```

   This creates `foundry/marquiste-additions/packs/corpsecaps-cauldron/`.

2. **Copy the module** folder `foundry/marquiste-additions` into your Foundry data folder, so you end up with `Data/modules/marquiste-additions/module.json`. (Foundry's data folder is shown under Configuration in the setup screen. On Windows it's usually `%localappdata%\FoundryVTT\Data`.)

3. In your world, go to **Settings → Manage Modules**, enable **Marquiste Additions**, and save.

4. Open the **Compendium Packs** tab. The **CorpseCap's Cauldron** pack appears under Marquiste Additions. Drag a mutagen onto a character sheet.

`module.json` asks for Foundry v13 as the minimum. If yours is a different version, change `compatibility` in `build.js` and rebuild.

## Check it

When you first use the item:

1. Drag **Mind Doubling Mutagen (Lesser)** onto a character and use it. The linked **Effect** should apply and show on the character.
2. While the effect is active, the sheet should list **Co-ordinated Thinking**, and it should go away when the effect ends.
3. Check the numbers on the sheet: +1 to Perception and Intelligence-based skills, +1 to Will saves against mental effects, −1 to Acrobatics, Stealth and Thievery, −2 to Reflex, and weakness 5 to mental damage.
4. If the character has the Mutant Innervation feat, Will saves against mental effects should roll twice and keep the higher result.

## Module setting: Volatile Vial house rules

Open **Settings → Configure Settings → Marquiste Additions** and tick **Use the Volatile Vial house rules** (off by default). While it's on, whenever a PF2e **Versatile Vial** is added to a character, the module replaces it with the **Volatile Vial** tier that matches the old vial's item level (1, 4, 12 or 18), keeping the quantity. It runs from the GM's client, so a GM has to be connected. Turning the setting off does not change vials already swapped, and it never touches Quick Alchemy itself: put the **Quick Alchemy (House Rule)** feat on an Alchemist by hand if you use the revised rules.

## Notes on how the rules are built

- **Suppressing a drawback:** the Mind Doubling Mutagen Drawback effect and each Ichthys Mutagen effect have a **Drawback suppressed** toggle on the character sheet. Switching it on turns off that mutagen's penalties and weakness without removing the effect; the Mutagenist Field Vial's effect reminds you to do this. Nothing flips the toggle automatically.

- **Quick Vial:** it finds the research field from the character's Bomber, Chirurgeon, Mutagenist or Toxicologist class feature. It checks that the character has a free hand (using PF2e's own hands-free count) and creates nothing if they don't; the new vial goes into that hand. It doesn't check for the alchemist's toolkit. Outside combat nothing removes the vial, so delete it yourself.

- **Vials:** the vials, coatings and Mutagenist vial carry the **Fleeting** trait, which `scripts/fleeting-trait.js` adds to PF2e's trait lists, but nothing makes them expire; only a vial made with Quick Vial in combat is removed at the end of the turn. The Field Vials' "only for the matching research field" limit isn't enforced. The Toxic Coating effects add their poison damage to every Strike until the end of the turn, so remove them yourself after the first hit.

- **Insulating Paste:** the effect shows a counter badge starting at 5. PF2e doesn't track this itself, so `scripts/insulating-paste.js` (loaded by the module) watches PF2e's "damage taken" chat messages. When the paste's resistance reduced the damage, it posts a chat message with a **Use up one instance of protection** button. Pressing it (the character's owner or a GM) lowers the badge by one and removes the effect at 0. Each message can only be counted once. The prompt is posted from the GM's client, so a GM has to be connected. The duration still runs out on its own.

- **Ichthys Mutagen:** "Breathe water" and "can't breathe air" have no rule element, so they stay as description text. The "Razor Claw" Strike is added next to the character's existing unarmed attacks rather than replacing them (the same way PF2e's Bestial Mutagen adds claws and jaws). The Perception and Wisdom-skill bonus only applies while the **Underwater** toggle on the effect is switched on. The swim Speed uses `@actor.attributes.speed.value`; if it shows 0 on a sheet, check that formula first.

- Mental and emotion saves use the predicate `item:trait:mental` or `item:trait:emotion`, the same pattern PF2e's own effects use. A save against something that isn't tagged with those traits won't get the bonus.
- "Intelligence-based skill checks" is expressed as the skills Arcana, Crafting, Lore, Occultism and Society, plus Perception.
- The re-roll needs the character to own a feat with the slug `mutant-innervation`. If the system names that feat differently, edit the `RollTwice` predicate in `build.js`.
- The item art is the site's image on a square black background. Foundry shows it as the item and effect icon.

## Changing or adding items

Edit `build.js`, run `node foundry/build.js`, then repeat step 1 (compile) and replace the module in your Foundry data folder. Item IDs are derived from the item names, so links between the items stay stable across rebuilds.
