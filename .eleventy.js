module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");

  eleventyConfig.addCollection("articles", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/articles/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addFilter("byCategory", (articles, category) => {
    return articles.filter((article) => article.data.category === category);
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
