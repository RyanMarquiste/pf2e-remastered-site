# PF2E Remastered — Supplemental Articles

A small Eleventy site for homebrew and supplemental material for Pathfinder Second Edition Remastered: new options, house rules, and GM tools meant to slot alongside the core rules.

This is unofficial fan content, published under the [Paizo Community Use Policy](https://paizo.com/community/communityuse).

## Working locally

```bash
npm install
npm run serve   # http://localhost:8080, rebuilds on save
npm run build   # writes the static site to _site/
```

## Writing an article

Add a Markdown file to `src/articles/`, following the existing files for front matter:

```markdown
---
layout: article.njk
title: "Article Title"
category: House Rules   # must match one of the categories in src/_data/site.json
date: 2026-01-01
summary: "One sentence shown on listing pages."
---

Article content here.
```

The homepage and `/articles/` page pick it up automatically, grouped by category.

## Deployment

- **Preview** — pushing to `main` builds the site and publishes it to GitHub Pages automatically (`.github/workflows/deploy-pages.yml`). Enable Pages once in the repo under Settings > Pages > Source > GitHub Actions.
- **Production (AWS)** — `.github/workflows/deploy-aws.yml` is a manual (`workflow_dispatch`) workflow that syncs the build to an S3 bucket and invalidates a CloudFront distribution. It needs these repo secrets set first: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_CLOUDFRONT_DIST_ID`.
