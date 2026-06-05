// Markdown-alternate endpoint for French insights (same source as the page).
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { urlSlug, renderInsightMarkdown } from "../../../lib/insights.ts";

export const getStaticPaths: GetStaticPaths = async () => {
  const all = await getCollection("insights", (e) => !e.data.draft && e.data.lang === "fr");
  return all.map((entry) => ({
    params: { slug: entry.data.translationOf ?? urlSlug(entry.id) },
    props: { entry },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { entry } = props as any;
  const slug = entry.data.translationOf ?? urlSlug(entry.id);
  const md = renderInsightMarkdown(entry.data, slug, entry.body);
  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
