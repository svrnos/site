# svrnos-site — repo conventions

## Insights are a single content collection (author once, everything generates)

Every insight article is ONE markdown file: `src/content/insights/<slug>.md` (French: `<slug>.fr.md`, with `lang: fr` + `translationOf:`). Frontmatter holds all structure (the meta block, supplement, sources, CTA, hero, JSON-LD inputs — see the schema in `src/content.config.ts`); the body is pure markdown prose + inline `![alt](/insights/<slug>/img.png)` images.

To publish a new insight:
1. Create `src/content/insights/<slug>.md` (copy the frontmatter shape from any existing one).
2. Drop images in `public/insights/<slug>/` and strip metadata (`exiftool -all= -overwrite_original`).
3. Commit. That's it.

The build then generates, from that one file: the page (`/insights/<slug>` via `src/pages/insights/[slug].astro` → `src/components/InsightArticle.astro`), the markdown alternate (`/insights/<slug>.md` via the `[slug].md.ts` endpoint), the index card (`src/pages/insights/index.astro`), the `llms.txt` bullet (`src/pages/llms.txt.ts`), and the /ask bot pickup (kb.ts derives URLs from llms.txt). **There is no hand-maintained `public/insights/*.md`, `public/insights/index.html`, or insights section of `public/llms.txt` anymore — those are deleted.**

**Change once, propagates everywhere:** the meta block / supplement / share / sources layout lives only in `src/components/InsightArticle.astro`; fonts in `BaseLayout.astro`; typography in `src/styles/globals.css` and `svrnos-tokens/`. Edit the renderer to add/remove a meta-block row for ALL articles.

`astro check` / the build validates every article's frontmatter against the schema, so a malformed article fails loudly instead of drifting.

### Still hand-maintained (the old sync rule applies to these)

Research pages (`/research/*`) and any raw-HTML pages in `public/` still have parallel `.md` alternates + `llms.txt` entries that must be updated together. The `llms.txt` research/products/about sections are a static template inside `src/pages/llms.txt.ts` (edit there, not a `public/` file).

**Common pitfall:** the GER (`research/governance-error-register/`) has both a root-tracked HTML copy and the `public/` copy. The `public/` copy is the served canonical. Edit `public/`, not the root.

## Post-deploy canary

After `git push origin main`, wait ~60 seconds for Vercel to deploy, then run:

```
npm run check
```

This is `scripts/post-deploy-check.sh` — a 5-second curl-based health check across the 11 critical URLs (home, insights index, research index, the four published research artifacts, the four flagship insight pieces, and /access). It verifies HTTP 200, expected title/content markers, and scans for the bug class that has burned us before: stray HTML from Astro JSX errors (`</table><code>`, `<p>{"`, ReferenceError text, etc.).

To check a Vercel preview deploy: `npm run check:preview https://<preview-url>`. Exit code 0 = healthy, non-zero = something regressed. Add new URLs to the `CHECKS` array in `scripts/post-deploy-check.sh` when shipping new pages.

## Bot knowledge bundle

The /ask bot's knowledge base is composed in `api/_lib/kb.ts`. It fetches `llms.txt`, the GER, every markdown alternate referenced in `llms.txt` (parsed automatically), and the `products` URLs. Because `llms.txt` is now generated from the insights collection, **adding an insight requires no kb.ts edit** — it flows collection → llms.txt → bot. Only add a URL to kb.ts for content that is NOT linked from llms.txt.
