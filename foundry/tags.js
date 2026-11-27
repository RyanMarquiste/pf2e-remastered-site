// The global tags: the name of each package, in a long and a short form, for use in item, feat and ability names. Change a tag here, run
// `node foundry/build.js`, and every name built from it follows, including the links between items (their ids come from the names' seeds, not the tags).
//   long  - the full name, such as for "Drakeheart Mutagen (CCC)" or a publication title
//   short - the short form added to a name, such as "Drakeheart Mutagen (CCC)"
// Marquiste is the Marquiste Additions module and its homebrew in general; the Cauldron is the CorpseCap's Cauldron module.
// The module scripts (foundry/marquiste-additions/scripts) are not built and cannot read these. The items that carry the Marquiste tag in their names no longer
// do (they are told apart by the source trait and the Source line), but quick-alchemy.js still accepts the old name "Quick Alchemy (Marquiste)" for characters who have it.
module.exports = {
  marquiste: { long: "Marquiste", short: "(M)" },
  cauldron: { long: "CorpseCap's Cauldron", short: "(CCC)" },
};
