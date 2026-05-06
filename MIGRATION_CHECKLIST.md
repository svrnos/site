# Insight page migration — working checklist

For each bespoke HTML page under `public/insights/<slug>/index.html`, follow this procedure to migrate to a clean Astro page using `ArticleLayout`. **Do one page at a time. Single-page commits. Verify before each commit.**

Reference page: `src/pages/insights/ger-503-eu-csam.astro` (the locked pattern).

---

## 1. Pre-migration audit

Read the existing files and capture:

- [ ] Full content of `public/insights/<slug>/index.html`
- [ ] Full content of `public/insights/<slug>.md` (the bot-quoted alternate)
- [ ] All assets in the dir (`ls public/insights/<slug>/`)
- [ ] Title, dek/teaser (often a callout pull-quote), `datePublished`
- [ ] Existing OG metadata (verify `og:image` and dimensions)
- [ ] Existing JsonLd block (preserve fields)
- [ ] Special elements present:
  - Hero figure + watermark
  - Inline figures (with watermark)
  - GER-tag pill (uppercase code badge)
  - Meta supplement block (Author / Taxonomy / Related links)
  - Callout boxes (CTAs to /ask, etc.)
  - Sources section
  - Share button
  - Internal links to other insights (verify they still resolve)
  - External links with utm params (preserve verbatim)

## 2. Build the .astro file

Path: `src/pages/insights/<slug>.astro`

- [ ] Frontmatter:
  - `import ArticleLayout from "../../layouts/ArticleLayout.astro";`
  - `import ArticleFigure from "../../components/ArticleFigure.astro";` (if hero or inline figures)
  - `import ShareButton from "../../components/ShareButton.astro";` (if the original had it)
  - Define `jsonLd` object preserving all fields from the original (headline, author, publisher, datePublished, url, image, mainEntityOfPage, description, isPartOf)
- [ ] `<ArticleLayout>` opening tag with props:
  - `title` — the visible h1 (short, descriptive)
  - `metaTitle` — optional. If the original `<title>`/`og:title` was longer than the h1 (typical for GER pages where the GER code appears in meta but not h1), pass the full long version here. Used for `<title>`, `og:title`, `twitter:title`. Defaults to `title` if not set.
  - `dek` (skip if no subtitle), `description` (or default to dek)
  - `canonical` — relative path, e.g. `/insights/<slug>`
  - `ogImage` — full URL to title PNG
  - `ogImageAlt` — descriptive alt text
  - `category` — GER tag content if present (e.g. `"GER-503, Governance Unavailable"`), or domain category
  - `datePublished` — full ISO format `2026-04-28T00:00:00Z`
  - `author` — defaults to `"Sushee Nzeutem"`, override if needed
  - `jsonLd={jsonLd}`
  - `current="insights"`
  - `markdownAlternate="/insights/<slug>.md"`
- [ ] Body content inside the slot:
  - Per-page meta supplement (Author / Taxonomy / Related) as `<dl class="article-supplement not-prose">` with scoped styles, IF the original had one
  - Hero figure: `<ArticleFigure src="..." alt="..." hero loading="eager" />`
  - `<ShareButton />` if original had it
  - Article body — clean h2/p/strong/em/a markup, NO `class="section"` or `class="tier"`, let `.prose-svrnos` handle typography
  - Inline figures: `<ArticleFigure src="..." alt="..." />`
  - Callout boxes: `<div class="article-callout">...</div>` with scoped styles
  - Sources section: `<aside class="article-sources">...</aside>` with scoped styles
- [ ] Scoped `<style>` block ONLY for elements truly unique to this page. The recurring article elements live in `globals.css` and don't need re-declaration:
  - `.article-supplement` — Author/Taxonomy/Related dl
  - `.article-definition` + `.article-definition-label` — formal GER definition box
  - `.article-callout` — boxed CTA
  - `.article-sources` — small sources list
  Use these classes; do NOT redeclare them.

## 3. Local render verification

- [ ] Start preview server (`preview_start name=svrnos-site`)
- [ ] Navigate to `http://localhost:3002/insights/<slug>`
- [ ] Resize to desktop (1280x800), screenshot
- [ ] Resize to mobile (375x812), screenshot
- [ ] Compare side-by-side with production screenshot (both widths) — content must match, layout consistent with reference page
- [ ] No console errors (`preview_console_logs level=error`)
- [ ] No server errors (`preview_logs level=error`)

## 4. Metadata verification

- [ ] JsonLd present: `preview_eval document.querySelector('script[type=\"application/ld+json\"]').textContent` — verify all fields preserved
- [ ] OG metadata: confirm `og:type="article"`, `og:site_name`, `og:image`, `og:image:alt`, `article:published_time`, `article:author`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`
- [ ] Canonical URL matches expected
- [ ] Markdown alternate link present and resolves to `/insights/<slug>.md`

## 5. Content integrity

- [ ] Every paragraph from the original is in the new page
- [ ] Every link preserved (internal + external + utm params)
- [ ] Every image preserved with the same alt text (or improved)
- [ ] Stale references updated:
  - "all 21 codes" → "all 25 codes" (GER count is 25 as of 2026-05-06)
  - Any other count drift caught during migration
- [ ] `.md` alternate updated if the HTML content changed (counts, etc.) — keep .md and .astro aligned

## 6. Commit

- [ ] Single page per commit. Commit message format:

  ```
  insights/<slug>: migrate to Astro with ArticleLayout

  - Replaces public/insights/<slug>/index.html (~N lines, K lines inline CSS)
  - Uses ArticleLayout, ArticleFigure component, ShareButton component
  - Scoped styles only for page-specific elements
  - JsonLd, OG metadata, internal links preserved
  - .md alternate updated to fix [any drift]
  ```

- [ ] `git add src/pages/insights/<slug>.astro public/insights/<slug>.md` (and delete the old HTML in the same commit)
- [ ] `git push origin main`

## 7. Post-deploy verification

- [ ] After Vercel deploy lands, curl the live URL and verify OG metadata is correct
- [ ] Spot-check the page in a browser if possible

## 8. Move to next page

Repeat from step 1. Pages already migrated:

- [x] `research/governance-error-register` (the GER taxonomy itself)
- [x] `insights/ger-503-eu-csam` ← reference page
- [x] `insights/courts-pricing-the-generation-gap`
- [x] `insights/ger-205`
- [x] `insights/ger-301`
- [x] `insights/ger-421-chevrolet`
- [x] `insights/ger-500-rome`
- [x] `insights/ger-501-tumbler-ridge`
- [x] `insights/ger-309-they-knew-they-shipped-it-anyway`
- [x] `insights/ger-430-evaluator-generator-entanglement`
- [x] `insights/ger-404-replika`
- [x] `insights/ger-404` (index)
- [x] `insights/ger-501` (index)
- [ ] `insights/ger-301`
- [ ] `insights/ger-309-they-knew-they-shipped-it-anyway`
- [ ] `insights/ger-404`
- [ ] `insights/ger-404-replika`
- [ ] `insights/ger-421-chevrolet`
- [ ] `insights/ger-430-evaluator-generator-entanglement`
- [ ] `insights/ger-500-rome`
- [ ] `insights/ger-501`
- [ ] `insights/ger-501-tumbler-ridge`
- [ ] `insights/algorithmic-compliance-companion-harm`
- [ ] `insights/ai-criminal-mastermind-audit-trail`
- [ ] `insights/ccdh-eight-in-ten-chatbots-violent-planning`
- [ ] `insights/companion-ai-harm`
- [ ] `insights/florida-ag-fsu-openai-criminal-probe`
- [ ] `insights/musk-altman-sim95`
- [x] `insights/oregon-sb-1546`
- [ ] `insights/phenom-plum-behavioral-truth-stack`
- [ ] `insights/wa-distress-routing-mandate`
- [ ] `insights/when-detection-fires-but-nothing-stops`

NOT to be migrated:
- `research/generation-gap` — frozen for OSF/Zenodo citation integrity
- `ask/` — chatbot UI page, different concern
