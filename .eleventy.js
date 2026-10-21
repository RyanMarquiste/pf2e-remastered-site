module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");

  // Articles live at /articles/<uuid>/<title-slug>/. The UUID is the stable identity: renaming an
  // article changes only the slug, and every URL built on the UUID keeps working (see the
  // articleRedirects collection and src/404.njk).
  const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

  eleventyConfig.addFilter("articleSlug", (title) => {
    return String(title)
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  });

  eleventyConfig.addCollection("articles", function (collectionApi) {
    const articles = collectionApi.getFilteredByGlob("src/articles/*.md").sort((a, b) => b.date - a.date);
    const seen = new Map();
    for (const article of articles) {
      const { uuid } = article.data;
      const file = article.inputPath;
      if (!uuid || !UUID_PATTERN.test(uuid)) {
        throw new Error(`${file} needs a "uuid" in its front matter (a random v4 UUID). Run "npm run add-uuids" to add one.`);
      }
      if (seen.has(uuid)) {
        throw new Error(`${file} and ${seen.get(uuid)} share the uuid ${uuid}. Each article needs its own.`);
      }
      seen.set(uuid, file);
    }
    return articles;
  });

  // Every URL that should forward to an article's canonical page: /articles/<uuid>/ and any
  // earlier /articles/<name>/ addresses listed under "aliases" in the article's front matter.
  eleventyConfig.addCollection("articleRedirects", function (collectionApi) {
    const redirects = [];
    const sources = new Map();
    for (const article of collectionApi.getFilteredByGlob("src/articles/*.md")) {
      const froms = [article.data.uuid, ...(article.data.aliases || [])].map((name) => `/articles/${name}/`);
      for (const from of froms) {
        if (sources.has(from)) {
          throw new Error(`${article.inputPath} and ${sources.get(from)} both claim the address ${from}.`);
        }
        sources.set(from, article.inputPath);
        redirects.push({ from, to: article.url, title: article.data.title });
      }
    }
    return redirects;
  });

  // Look up an article's current address from its file name (without .md), for hand-written links.
  eleventyConfig.addFilter("articleUrl", (fileSlug, articles) => {
    const article = (articles || []).find((item) => item.fileSlug === fileSlug);
    if (!article) {
      throw new Error(`No article with the file name "${fileSlug}" (src/articles/${fileSlug}.md).`);
    }
    return article.url;
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
