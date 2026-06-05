// Markdown-alternate endpoint. Emits the canonical markdown for each English
// insight from the SAME collection source as the HTML page, so page and .md
// can never drift. Replaces the hand-maintained public/insights/*.md files.
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { urlSlug, renderInsightMarkdown } from "../../lib/insights.ts";

export const getStaticPaths: GetStaticPaths = async () => {
  const all = await getCollection("insights", (e) => !e.data.draft && e.data.lang === "en");
  return all.map((entry) => ({ params: { slug: urlSlug(entry.id) }, props: { entry } }));
};

export const GET: APIRoute = ({ props }) => {
  const { entry } = props as any;
  const md = renderInsightMarkdown(entry.data, urlSlug(entry.id), entry.body);
  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
