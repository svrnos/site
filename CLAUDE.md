# svrnos-site — repo conventions

## Page-update sync rule

When editing any published page on svrnos.com, **also update the corresponding markdown alternate and `public/llms.txt`** in the same commit. The site has three parallel surfaces that must stay aligned:

1. **Page source** — either an HTML file at `public/<path>/index.html` or an Astro component at `src/pages/<path>.astro`. Most insights and research pages use `.astro`; the GER and a few legacy pages use raw HTML in `public/`. What visitors see.
2. **Markdown alternate** at `public/<path>.md` — what AI assistants and the svrnos.com/ask bot fetch.
3. **`public/llms.txt`** — index that points crawlers to (1) and (2); update if the page is new, retitled, or its scope changed.

A change to any one surface without the others creates drift between what visitors read and what bots quote. The /ask bot caches the markdown alternates with a 30-min TTL, so HTML-only edits silently misalign the bot's answers until the next deploy + cache flush.

**Practical checklist for a content edit:**

- [ ] Update the HTML
- [ ] Update the matching `.md` alternate (same content, plain markdown)
- [ ] If the page is new, retitled, or its scope shifted: update `public/llms.txt`
- [ ] Update any counts/totals on the page (e.g. GER code counts, paper findings counts) in **all three** surfaces
- [ ] Commit all three together so the deploy ships them atomically

**Common pitfall:** the GER (`research/governance-error-register/`) has both a root-tracked HTML copy and the `public/` copy. The `public/` copy is the served canonical (Astro serves from `public/`); the root copy is legacy and not deployed. Edit `public/`, not the root.

## Post-deploy canary

After `git push origin main`, wait ~60 seconds for Vercel to deploy, then run:

```
npm run check
```

This is `scripts/post-deploy-check.sh` — a 5-second curl-based health check across the 11 critical URLs (home, insights index, research index, the four published research artifacts, the four flagship insight pieces, and /access). It verifies HTTP 200, expected title/content markers, and scans for the bug class that has burned us before: stray HTML from Astro JSX errors (`</table><code>`, `<p>{"`, ReferenceError text, etc.).

To check a Vercel preview deploy: `npm run check:preview https://<preview-url>`. Exit code 0 = healthy, non-zero = something regressed. Add new URLs to the `CHECKS` array in `scripts/post-deploy-check.sh` when shipping new pages.

## Bot knowledge bundle

The /ask bot's knowledge base is composed in `api/_lib/kb.ts`. It fetches `llms.txt`, the GER, all `insights/*.md`, and any `products` URLs. New canonical pages should be added to `kb.ts` so the bot picks them up; if you add a new insight or research piece, also add it to `llms.txt`.
