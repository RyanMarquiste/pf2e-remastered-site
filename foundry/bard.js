// The Bard Enhancements: Make an Impression, Demoralize and Impersonate as the Versatile Performance feat lets a Bard make them, with Performance as the skill.
// Called from build.js, which supplies the shared helpers.
//
// Each is an action item for the character sheet. Make an Impression and Impersonate carry the Exploration trait, so they sit under Exploration on the Actions
// tab; Demoralize is a one-action encounter action, so it sits under Actions. Using one posts the card and the module script
// (scripts/bard/versatile-performance.js) rolls PF2e's own action with Performance in place of the usual skill.
module.exports = function buildBard({ items, publication, makeId }) {
  // PF2e's own actions, linked by id (a link by name does not resolve).
  const ids = { "Make an Impression": "OX4fy22hQgUHDr0q", Demoralize: "2u915NdUyQan6uKF", Impersonate: "AJstokjdG6iDjVjE" };
  const link = (name) => `@UUID[Compendium.pf2e.actionspf2e.Item.${ids[name]}]{${name}}`;
  const note =
    "<hr /><p><strong>Module</strong> Using this action rolls PF2e's own action with your Performance modifier in place of the usual skill. Select your token and target the creature first. " +
    "It can be switched off in the module settings under Troubleshooting.</p>";

  const actions = [
    {
      name: "Make an Impression (Versatile Performance)",
      slug: "make-an-impression-versatile-performance",
      img: "icons/skills/social/diplomacy-peace-alliance.webp",
      cost: null,
      traits: ["auditory", "bard", "concentrate", "exploration", "linguistic", "mental"],
      text:
        `<p><strong>Requirements</strong> You have the Versatile Performance feat</p><hr />` +
        `<p>You can use Performance instead of Diplomacy to ${link("Make an Impression")}. It works exactly like that exploration activity, including the Will DC and the results, ` +
        `but the check is a Performance check.</p>`,
    },
    {
      name: "Demoralize (Versatile Performance)",
      slug: "demoralize-versatile-performance",
      img: "icons/skills/social/intimidation-impressing.webp",
      cost: 1,
      traits: ["auditory", "bard", "concentrate", "emotion", "fear", "mental"],
      text:
        `<p><strong>Requirements</strong> You have the Versatile Performance feat</p><hr />` +
        `<p>You can use Performance instead of Intimidation to ${link("Demoralize")}. It works exactly like that action, including the Will DC, the results and the creature's ` +
        `temporary immunity, but the check is a Performance check.</p>`,
    },
    {
      name: "Impersonate (Versatile Performance)",
      slug: "impersonate-versatile-performance",
      img: "icons/skills/social/theft-pickpocket-bribery-brown.webp",
      cost: null,
      traits: ["bard", "concentrate", "exploration", "manipulate", "secret"],
      text:
        `<p><strong>Requirements</strong> You have the Versatile Performance feat</p><hr />` +
        `<p>You can use an acting Performance instead of Deception to ${link("Impersonate")}. It works exactly like that exploration activity, including the Perception DC and the ` +
        `results, but the check is a Performance check.</p>`,
    },
  ];

  for (const action of actions) {
    items.push({
      _id: makeId(`action:${action.name}`),
      img: action.img,
      name: action.name,
      type: "action",
      system: {
        slug: action.slug,
        actionType: { value: "action" },
        actions: { value: action.cost },
        category: "interaction",
        description: { value: action.text + note },
        frequency: null,
        publication,
        rules: [],
        traits: { otherTags: [], rarity: "common", value: action.traits },
      },
    });
  }
};
