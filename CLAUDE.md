# svrnos-site — repo conventions

## Page-update sync rule

When editing any published page on svrnos.com, **also update the corresponding markdown alternate and `public/llms.txt`** in the same commit. The site has three parallel surfaces that must stay aligned:

1. **HTML page** (e.g. `public/research/governance-error-register/index.html`) — what visitors see
2. **Markdown alternate** (e.g. `public/research/governance-error-register.md`) — what AI assistants and the svrnos.com/ask bot fetch
3. **`public/llms.txt`** — index that points crawlers to (1) and (2); update if the page is new, retitled, or its scope changed

A change to any one surface without the others creates drift between what visitors read and what bots quote. The /ask bot caches the markdown alternates with a 30-min TTL, so HTML-only edits silently misalign the bot's answers until the next deploy + cache flush.

**Practical checklist for a content edit:**

- [ ] Update the HTML
- [ ] Update the matching `.md` alternate (same content, plain markdown)
- [ ] If the page is new, retitled, or its scope shifted: update `public/llms.txt`
- [ ] Update any counts/totals on the page (e.g. GER code counts, paper findings counts) in **all three** surfaces
- [ ] Commit all three together so the deploy ships them atomically

**Common pitfall:** the GER (`research/governance-error-register/`) has both a root-tracked HTML copy and the `public/` copy. The `public/` copy is the served canonical (Astro serves from `public/`); the root copy is legacy and not deployed. Edit `public/`, not the root.

## Bot knowledge bundle

The /ask bot's knowledge base is composed in `api/_lib/kb.ts`. It fetches `llms.txt`, the GER, all `insights/*.md`, and any `products` URLs. New canonical pages should be added to `kb.ts` so the bot picks them up; if you add a new insight or research piece, also add it to `llms.txt`.
