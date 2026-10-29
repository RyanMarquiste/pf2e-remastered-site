# Foundry VTT export (PF2e system)

`pf2e-remastered-additions/` is a Foundry module that holds a compendium of this site's alchemical items, named **CorpseCap's Cauldron**. New alchemical items are added to this same pack. Right now it contains the **Mind Doubling Mutagen**:

- 4 consumables (Lesser, Moderate, Greater, Major), priced and levelled like the other mutagens
- 4 matching `Effect:` items that apply the bonuses, penalties, weakness and the Mutant Innervation re-roll through PF2e rule elements
- the **Co-ordinated Thinking** free action, which the effect grants to the character while it lasts

The files were written against the PF2e system's own mutagen data (Cognitive Mutagen) but have **not been loaded into a running Foundry yet**, so expect to check them once (see "Check it" below).

## Layout

| Path | What it is |
| --- | --- |
| `build.js` | Generates the item JSON and `module.json`. Edit this when the item changes, then run `node foundry/build.js`. |
| `pf2e-remastered-additions/module.json` | Module manifest. |
| `pf2e-remastered-additions/packs/_source/corpsecaps-cauldron/*.json` | One JSON file per item (the editable source). |
| `pf2e-remastered-additions/images/` | Item art, referenced as `modules/pf2e-remastered-additions/images/...`. |
| `pf2e-remastered-additions/packs/corpsecaps-cauldron/` | The compiled compendium. **Not in the repo**: you build it in step 1. |

## Install

Foundry v11+ only reads compendiums stored as LevelDB folders, so the JSON has to be compiled once.

1. **Compile the pack.** From the repo root, with Node installed:

   ```bash
   npx @foundryvtt/foundryvtt-cli package pack -n corpsecaps-cauldron --type Module --in foundry/pf2e-remastered-additions/packs/_source/corpsecaps-cauldron --out foundry/pf2e-remastered-additions/packs
   ```

   This creates `foundry/pf2e-remastered-additions/packs/corpsecaps-cauldron/`.

2. **Copy the module** folder `foundry/pf2e-remastered-additions` into your Foundry data folder, so you end up with `Data/modules/pf2e-remastered-additions/module.json`. (Foundry's data folder is shown under Configuration in the setup screen. On Windows it's usually `%localappdata%\FoundryVTT\Data`.)

3. In your world, go to **Settings → Manage Modules**, enable **Remastered Additions**, and save.

4. Open the **Compendium Packs** tab. The **CorpseCap's Cauldron** pack appears under Remastered Additions. Drag a Mind Doubling Mutagen onto a character sheet.

`module.json` asks for Foundry v13 as the minimum. If yours is a different version, change `compatibility` in `build.js` and rebuild.

## Check it

When you first use the item:

1. Drag **Mind Doubling Mutagen (Lesser)** onto a character and use it. The linked **Effect** should apply and show on the character.
2. While the effect is active, the sheet should list **Co-ordinated Thinking**, and it should go away when the effect ends.
3. Check the numbers on the sheet: +1 to Perception and Intelligence-based skills, +1 to Will saves against mental effects, −1 to Acrobatics, Stealth and Thievery, −2 to Reflex, and weakness 5 to mental damage.
4. If the character has the Mutant Innervation feat, Will saves against mental effects should roll twice and keep the higher result.

## Notes on how the rules are built

- Mental and emotion saves use the predicate `item:trait:mental` or `item:trait:emotion`, the same pattern PF2e's own effects use. A save against something that isn't tagged with those traits won't get the bonus.
- "Intelligence-based skill checks" is expressed as the skills Arcana, Crafting, Lore, Occultism and Society, plus Perception.
- The re-roll needs the character to own a feat with the slug `mutant-innervation`. If the system names that feat differently, edit the `RollTwice` predicate in `build.js`.
- The item art is the site's flask image. Foundry shows it as the item and effect icon.

## Changing or adding items

Edit `build.js`, run `node foundry/build.js`, then repeat step 1 (compile) and replace the module in your Foundry data folder. Item IDs are derived from the item names, so links between the items stay stable across rebuilds.
