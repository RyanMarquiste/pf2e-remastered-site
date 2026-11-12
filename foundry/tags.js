// The global tags: the name of each package, in a long and a short form, for use in item, feat and ability names. Change a tag here, run
// `node foundry/build.js`, and every name built from it follows, including the links between items (their ids come from the names' seeds, not the tags).
//   long  - the full name, such as for "Quick Alchemy (Marquiste)" or a publication title
//   short - the short form added to a name, such as "Drakeheart Mutagen (M)"
// Marquiste is the Marquiste Additions module and its homebrew in general; the Cauldron is the CorpseCap's Cauldron module.
// The module scripts (foundry/marquiste-additions/scripts) are not built and cannot read these: the one name they look for, "Quick Alchemy (Marquiste)" in
// scripts/alchemist/quick-alchemy.js, has to be changed there by hand.
module.exports = {
  marquiste: { long: "Marquiste", short: "(M)" },
  cauldron: { long: "CorpseCap's Cauldron", short: "(CCC)" },
};
