module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");

  eleventyConfig.addCollection("articles", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/articles/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addFilter("byCategory", (articles, category) => {
    return articles.filter((article) => article.data.category === category);
  });

  eleventyConfig.addFilter("byClass", (articles, classSlug) => {
    return articles.filter((article) => article.data.class === classSlug);
  });

  const diamond = (cx) => `<polygon points="${cx - 7},8 ${cx},1 ${cx + 7},8 ${cx},15" />`;

  const actionIcons = {
    one: {
      label: "Single Action",
      viewBox: "0 0 16 16",
      body: diamond(8),
    },
    two: {
      label: "Two Actions",
      viewBox: "0 0 28 16",
      body: diamond(8) + diamond(20),
    },
    three: {
      label: "Three Actions",
      viewBox: "0 0 40 16",
      body: diamond(8) + diamond(20) + diamond(32),
    },
    free: {
      label: "Free Action",
      viewBox: "0 0 16 16",
      body: `<polygon points="1,8 8,1 15,8 8,15" fill="none" stroke="currentColor" stroke-width="1.5" />`,
    },
    reaction: {
      label: "Reaction",
      viewBox: "0 0 16 16",
      body: `<path d="M8 2a6 6 0 1 0 5.2 3" fill="none" stroke="currentColor" stroke-width="1.5" /><polygon points="13,1.3 14.8,5.3 10.8,4.4" />`,
    },
  };

  eleventyConfig.addShortcode("actionIcon", function (type) {
    const icon = actionIcons[type];
    if (!icon) {
      throw new Error(`Unknown actionIcon type "${type}". Expected one of: ${Object.keys(actionIcons).join(", ")}`);
    }
    return `<svg class="action-icon" viewBox="${icon.viewBox}" role="img" aria-label="${icon.label}" title="${icon.label}">${icon.body}</svg>`;
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
