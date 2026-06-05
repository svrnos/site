// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

/**
 * Wrap standalone markdown images (an image alone in a paragraph) in
 * <figure class="article-figure">, so inline article images get the same
 * figure styling + SVRNOS.COM watermark as the hero (styles live in
 * src/styles/globals.css under .article-figure).
 */
function rehypeArticleFigure() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      walk(child);
      if (child.type === "element" && child.tagName === "p") {
        const kids = child.children.filter(
          (c) => !(c.type === "text" && !c.value.trim()),
        );
        if (kids.length === 1 && kids[0].type === "element" && kids[0].tagName === "img") {
          return {
            type: "element",
            tagName: "figure",
            properties: { className: ["article-figure"] },
            children: [kids[0]],
          };
        }
      }
      return child;
    });
  };
  return (tree) => walk(tree);
}

export default defineConfig({
  site: "https://svrnos.com",
  trailingSlash: "never",
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes("/legacy/") })],
  markdown: {
    rehypePlugins: [rehypeArticleFigure],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
