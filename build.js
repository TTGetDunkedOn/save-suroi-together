// @ts-check

import { marked } from "marked";
import { markedSmartypants } from "marked-smartypants";
import { minify } from "html-minifier-terser";
import { compileAsync } from "sass-embedded"
import { readFile, writeFile } from "node:fs/promises";

/**
 * HTML and Markdown
 */

marked.use({
  gfm: true,
});
marked.use(markedSmartypants());

const template = (/** @type {string} */ content) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Open Letter to Suroi.io</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:title" content="An Open Letter to the Owners of Suroi.io">
    <meta property="og:description" content="A discussion about the management issues concerning Suroi.io and how those issues can be fixed.">
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <article>
      ${content}
    </article>
    <script src="./client.js"></script>
  </body>
</html>
`;

const htmlPromise = (async () => {
  const transformedContent = (await readFile("./README.md", { encoding: "utf8" }))

  const parsedContent = await marked.parse(transformedContent);
  const html = await minify(template(parsedContent), { collapseWhitespace: true });
  await writeFile("./index.html", html);
})();

/**
 * CSS
 */

const cssPromise = (async () => {
  const { css } = await compileAsync("./style.scss", { style: "compressed" });
  await writeFile("./style.css", css)
})()

/**
 * File Writing
 */

Promise.all([htmlPromise, cssPromise]);
