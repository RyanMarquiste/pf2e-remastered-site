// Makes the icons a suppressed drawback shows (see marquiste-additions/scripts/alchemist/mutagenist-field-vial.js): each drawback's own picture greyed out and dimmed, with one long thin red
// slash from the bottom left to the top right over the top, saved as marquiste-additions/images/suppressed/<name of the picture>.png. Run it again whenever a mutagen drawback gets a new picture:
//   node foundry/make-suppressed-icons.cjs
// It needs the `sharp` package (npm install sharp in a scratch folder, then run it with NODE_PATH set to that folder's node_modules) and a Foundry install to find the core and PF2e pictures.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = __dirname;
const FOUNDRY_PUBLIC = process.env.FOUNDRY_PUBLIC ?? "C:/Program Files/Foundry Virtual Tabletop/resources/app/public";
const FOUNDRY_DATA = process.env.FOUNDRY_DATA ?? "C:/Users/valar/AppData/Local/FoundryVTT/Data";
const OUT = path.join(ROOT, "marquiste-additions", "images", "suppressed");
const SIZE = 256;
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

// The pictures of every effect that has a "drawback-suppressed" rule.
const sourceDirs = ["marquiste-additions/packs/_source/marquiste-common-enhancements", "corpsecaps-cauldron/packs/_source/corpsecaps-cauldron"];
const pictures = new Set();
for (const dir of sourceDirs) {
  for (const file of fs.readdirSync(path.join(ROOT, dir))) {
    if (!file.startsWith("effect-")) continue;
    const effect = JSON.parse(fs.readFileSync(path.join(ROOT, dir, file), "utf8"));
    if (effect.system.rules.some((rule) => rule.key === "RollOption" && /drawback-suppressed$/.test(rule.option ?? ""))) pictures.add(effect.img);
  }
}

// Where a picture's file is: a core icon, a PF2e system icon, or an image in one of the two modules.
const locate = (img) => {
  if (img.startsWith("icons/")) return path.join(FOUNDRY_PUBLIC, img);
  if (img.startsWith("systems/")) return path.join(FOUNDRY_DATA, img);
  if (img.startsWith("modules/")) return path.join(ROOT, img.replace(/^modules\//, ""));
  throw new Error(`Don't know where ${img} is`);
};

// One long slash from the bottom left to the top right, with a thin dark outline so the red reads against both light and dark parts of a picture.
const slash = (inset, width) => {
  const a = SIZE * inset;
  const b = SIZE * (1 - inset);
  const line = (color, w) => `<line x1="${a}" y1="${b}" x2="${b}" y2="${a}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">${line("#000", width * 1.7)}${line("#e03a2c", width)}</svg>`);
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const img of pictures) {
    const base = await sharp(locate(img)).resize(SIZE, SIZE, { fit: "contain", background: CLEAR }).ensureAlpha().toBuffer();
    const grey = await sharp(base).modulate({ saturation: 0.1, brightness: 0.7 }).toBuffer();
    const name = path.basename(img).replace(/\.[^.]+$/, "");
    await sharp(grey).composite([{ input: slash(0.06, SIZE * 0.04) }]).png().toFile(path.join(OUT, `${name}.png`));
    console.log(`${name}.png  (from ${img})`);
  }
})();
