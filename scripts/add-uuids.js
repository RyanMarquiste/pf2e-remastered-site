#!/usr/bin/env node
// Gives every article in src/articles a random "uuid" in its front matter if it doesn't have one.
//
//   npm run add-uuids              add missing uuids
//   npm run add-uuids -- --alias   also record each article's current file name under "aliases"
//                                  (use this once, before renaming, so old /articles/<name>/ links keep working)

const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const dir = path.join(__dirname, "..", "src", "articles");
const addAlias = process.argv.includes("--alias");

for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".md")).sort()) {
  const full = path.join(dir, file);
  const text = fs.readFileSync(full, "utf8");
  const newline = text.includes("\r\n") ? "\r\n" : "\n";
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    console.warn(`skipped ${file}: no front matter`);
    continue;
  }

  let front = match[1];
  const added = [];
  const extra = [];
  if (!/^uuid:/m.test(front)) {
    extra.push(`uuid: ${randomUUID()}`);
    added.push("uuid");
  }
  if (addAlias && !/^aliases:/m.test(front)) {
    extra.push(`aliases: ["${path.basename(file, ".md")}"]`);
    added.push("alias");
  }
  if (!extra.length) continue;

  // Keep the new keys right after the layout line (or at the top if there isn't one).
  const lines = front.split(/\r?\n/);
  const layoutAt = lines.findIndex((line) => line.startsWith("layout:"));
  lines.splice(layoutAt + 1, 0, ...extra);
  front = lines.join(newline);
  fs.writeFileSync(full, text.replace(match[1], () => front));
  console.log(`${file}: added ${added.join(", ")}`);
}
