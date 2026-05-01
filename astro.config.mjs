// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://svrnos.com",
  trailingSlash: "never",
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes("/legacy/") })],
  vite: {
    plugins: [tailwindcss()],
  },
});
