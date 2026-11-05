// The Alchemist-only items live in their own pack. Keep that pack out of the PF2e Compendium Browser's Equipment tab, once, the first time
// the module runs, so these items stay out of the general equipment list. It stays on the other tabs (such as Actions), and the choice can
// be changed afterwards in the Compendium Browser's settings.
import { enabled } from "./settings.js";

const MODULE = "marquiste-additions";
const COLLECTION = `${MODULE}.marquiste-alchemist-class`;

Hooks.once("init", () => {
  game.settings.register(MODULE, "alchemistPackHidden", { scope: "world", config: false, type: Boolean, default: false });
});

Hooks.once("ready", async () => {
  if (game.users.activeGM?.id !== game.user.id || !enabled("compendiumBrowserPacks")) return;
  if (game.settings.get(MODULE, "alchemistPackHidden")) return;
  const pack = game.packs.get(COLLECTION);
  if (!pack) return;

  const current = foundry.utils.deepClone(game.settings.get("pf2e", "compendiumBrowserPacks") ?? {});
  current.equipment ??= {};
  current.equipment[COLLECTION] = { load: false, name: pack.metadata.label, package: MODULE };
  await game.settings.set("pf2e", "compendiumBrowserPacks", current);
  await game.settings.set(MODULE, "alchemistPackHidden", true);
});
