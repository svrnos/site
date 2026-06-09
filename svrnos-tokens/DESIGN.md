# SVRNOS Design System

Single source of truth for visual design across **svrnos.com**, **sim95.com**, and **kingsango.com**. This package (`@svrnos/tokens`) is the canonical home for color, typography, spacing, radius, and motion tokens.

## The brand-family triangle

Three sites, one family:

|  | Surface | Type register | Voice |
|---|---|---|---|
| **svrnos.com** (parent / research) | Light paper | Inter body + **Instrument Serif** editorial accent | Archival, calm, scholarly |
| **sim95.com** (clinical product) | Light minimal | Inter only on the report system; Instrument Serif on the homepage (already in the brand) | Clinical, sparse, authoritative |
| **kingsango.com** (technical product) | Dark | Inter body + Instrument Serif sparing display accent + **Geist Mono** for technical readouts | Sharp, dense, current |

**Inter + Instrument Serif.** Inter is the body face on all three sites (sim95 anchor). Instrument Serif is the editorial accent — already in the brand on sim95.com's homepage — used sparingly for paper heros, article pull-quotes, and the rare product display moment. Geist Mono for code, tabular numerals, and the kingsango Replay debugger.

sim95 is the **anchor**. Its existing token system in `sim95/app/globals.css:51+` is the reference. This package lifts those values into the canonical `--svrnos-*` namespace and adds a dark ramp for kingsango.

## Token reference

### Brand
| Token | Value |
|---|---|
| `--svrnos-brand-primary` | `#2f5d50` |
| `--svrnos-brand-hover` | `#284f44` |
| `--svrnos-brand-active` | `#22443a` |
| `--svrnos-brand-ring` | `rgba(47, 93, 80, 0.25)` |
| `--svrnos-brand-disabled` | `#779b91` |
| `--svrnos-brand-diagnostic` | `#2f6a4e` |

The green is identical to sim95's existing `--sim95-brand-primary` and kingsango's existing accent — no change for either site, just a new namespace.

### Surface ramp
**Light** (svrnos, sim95): `bg-page #fafaf9` → `bg-card #ffffff` → `bg-hover #f2f5f4` → `bg-selected #eef3f1` → `bg-muted #f2f2ee`.

**Dark** (kingsango): `bg-page #0e1110` → `bg-card #15191a` → `bg-hover #1c2122` → `bg-selected #1f2a26` → `bg-muted #161a1a`.

Same hue family on both ends. Dark ramp applies when `class="dark"` or `data-theme="dark"` is set on a parent.

### Text ramp
**Light**: `heading #1a1a1a` → `body-primary #2c3943` → `body-secondary #61707c` → `label #64748b` → `label-alt #8a949b`.

**Dark**: `heading #f2f4f3` → `body-primary #cfd5d3` → `body-secondary #8a948f` → `label #6f7873` → `label-alt #555c58`.

Five steps, mirror structure on both surfaces.

### Borders
`default #e6e9ec`, `soft #e6eaed`, `subtle rgba(0,0,0,0.12)`, `hairline rgba(0,0,0,0.05)`, `vertical #d4d4d4`. Five levels of "almost invisible" — sim95's pattern, preserved.

### Radius
`button 8px`, `input 8px`, `card 6px`, `pill 999px`, `none 0`. **Cards are intentionally less rounded than buttons** — system rule lifted from sim95.

### Spacing scale
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 60 / 72 / 120.

### Typography

**Families:**
- `--svrnos-font-sans`: **Inter** — body face on all three sites.
- `--svrnos-font-serif`: **Instrument Serif** — editorial accent on svrnos (article hero, pull quotes), sparing display moment on kingsango (case-study hero, BottomCTA). Already loaded on sim95.com homepage; promoted to a system-level token here.
- `--svrnos-font-mono`: **Geist Mono** — technical readouts on kingsango (Replay debugger badges, voice metrics, code blocks, tabular numerals).

The sim95 **report page** is the canonical design system (pure Inter, token-driven). The sim95 **homepage** uses Instrument Serif as an editorial accent. We promote both into the shared system: Inter as the workhorse, Instrument Serif as the accent. Slight per-site landing variations layer on top.

**Scale** (sim95-report-aligned):

| Token | Size / Line / Tracking / Weight | Use |
|---|---|---|
| `editorial` | 56 / 60 / -1.4 / 400 | svrnos paper hero, kingsango product hero — Instrument Serif |
| `display` | 32 / 38 / -0.64 / 500 | section heads |
| `28` | 28 / 36 | product cards |
| `h2` | 24 / 32 / -0.24 / 600 | h2 |
| `h3` | 18 / 27 | h3 |
| `body` | 16 / 26 (tight 24) | body |
| `body-sm` | 14 / 21 | secondary body |
| `field` | 13 / 20 | inputs, table cells |
| `label` | 11 / 16 / 1.32 / 600 | uppercase eyebrows |

### Feedback
`success`, `warning`, `error`, `info` — each with a `-soft` companion for tinted backgrounds, plus dark variants. Used for all status semantics including kingsango's Replay debugger states (NEUTRAL = info, MONITORING = warning, ELEVATED = error).

### Motion
`fast 125ms`, `base 200ms`, `slow 320ms`. Default ease `cubic-bezier(0.2, 0, 0.13, 1.5)`.

## Component grammar

### Buttons (shared)
- **Primary** — filled `--svrnos-brand-primary`, white text, 44px height, 24px padding, 8px radius.
- **Secondary** — outline `--svrnos-border-default`, ink text, same dimensions.
- Hover → `--svrnos-brand-hover`. Focus ring → `--svrnos-shadow-focus-brand`.

### Cards
6px radius, `--svrnos-bg-card` surface, `--svrnos-border-default` border. No shadow by default; elevated cards may use `--svrnos-card-board`.

### Footer (shared structure, per-site content)
- **svrnos**: lists sim95 + kingsango as products with brief descriptors.
- **sim95** + **kingsango**: include `← svrnos research` link back up to parent. (sim95 footer change is queued for a future round; not in this rollout.)

### Nav variants
- **Parent (svrnos)**: research/insights/products primary; products listed.
- **Product (kingsango)**: in-product navigation; small svrnos backlink in footer.

## How to consume

### Tailwind v4 site (sim95-style, kingsango-target, svrnos-target)
```css
/* app/globals.css */
@import "tailwindcss";
@import "@svrnos/tokens/tokens.css";

@theme inline {
  --color-bg-page: var(--svrnos-bg-page);
  --color-bg-card: var(--svrnos-bg-card);
  --color-text-heading: var(--svrnos-text-heading);
  --color-brand: var(--svrnos-brand-primary);
  --font-sans: var(--svrnos-font-sans);
  --font-serif: var(--svrnos-font-serif);
  --font-mono: var(--svrnos-font-mono);
  --radius-button: var(--svrnos-radius-button);
  --radius-card: var(--svrnos-radius-card);
}
```

### JS / TS consumers
```ts
import { brand, fontScale } from "@svrnos/tokens";
const accent = brand.primary; // "#2f5d50"
```

### Dark mode
Add `class="dark"` or `data-theme="dark"` to `<html>` (kingsango opts in globally; svrnos stays light).

## Distribution

This round: **vendored as a sibling directory** at `~/Documents/my_claude_folder/svrnos-tokens/`, consumed by symlink from each site's `node_modules/@svrnos/tokens` (or via `pnpm` workspace once we set one up). No publish, no registry. Promote to a private GitHub Packages registry after the system is proven on all three sites.

## What this package does *not* contain

- Component code (each site implements its own React/Astro components).
- Page layouts.
- Content (copy, articles, marketing).
- Site-specific overrides.

Tokens only. Site-specific decisions live in each repo's own files.

## Migration notes

- **sim95**: untouched in this round. Internally still uses `--sim95-*`. A follow-up will alias `--sim95-*: var(--svrnos-*)` once parity is verified.
- **kingsango**: simultaneous Tailwind 3 → 4 upgrade so it can use `@theme inline` natively.
- **svrnos**: greenfield Astro + Tailwind v4 setup; consumes tokens from day one.

## Decisions locked in at phase-1 checkpoint

- **Inter + Instrument Serif.** Inter is the body face (sim95 anchor); Instrument Serif is the editorial accent (already in the brand on sim95.com homepage). Geist Mono for technical readouts.
- **Dark surface for kingsango: `#0e1110`** (engineering-dark, not Photoshop-gray). Gives contrast headroom for body text and brand accent.
- **Brand green canonical: `#2f5d50`** — value already shared between sim95 and kingsango.
- **Cross-site nav: footer-only.** Products carry a `← svrnos research` link in the footer back up to parent. No umbrella mark in product top nav.
- **sim95 namespace migration: deferred.** sim95 keeps its internal `--sim95-*` tokens for this round. Follow-up to alias `--sim95-*: var(--svrnos-*)` is on the table for after kingsango + svrnos prove the system.

## Decisions: GER page redesign (parked, target Stripe-grade)

**Status:** Parked 2026-05-18. Trigger to resume: Sushee says "let's redesign the GER" or similar.

**Why parked:** the redesign is a 4-8 hour focused build, not an auto-mode task. Sushee's taste needs to drive aesthetic choices (sidebar width, font, density, sticky behavior, color decisions). Today's session captured decisions; build deferred to a deliberate session.

### Target visual model

**Stripe API docs** — [docs.stripe.com/api](https://docs.stripe.com/api). Three-column with persistent left sidebar (grouped nav), main content, right rail "on this page" anchors. Sticky header. Generous whitespace. Modern docs typography.

### Required header features (Sushee called these out specifically)

1. **"Find anything" search** — search bar in the header. Start with client-side filter over GER codes for v1; real full-text search later.
2. **"Ask AI" button** — branded CTA in the header, links to the existing `/ask` page (already deployed, /ask bot field-validated with George Siosi 2026-05-08).
3. **"Copy for LLM" button** — clipboard button that copies the markdown alternate of the current page. The .md alternates already exist (per CLAUDE.md page-update sync rule).

### Structural model

**MITRE ATT&CK** — matrix/layer view at the front door, per-code anchors inside tier tables, eventual per-code dedicated pages when register grows past ~50 codes. ATT&CK matrix at [attack.mitre.org/matrices/enterprise/](https://attack.mitre.org/matrices/enterprise/) is the closest functional reference.

**NOT MITRE CWE visually.** CWE looks like a 1998 academic site. We're borrowing MITRE's structural pattern (registry with matrix front + per-code pages), NOT its visual design.

### Dual entry points

- **Layer View** — procurement-facing scannable section. Codes grouped by AI Governance Stack layer (L1 Compute through L7 Application). "Which failure modes apply at the layer where we deploy AI?"
- **Code View** — canonical taxonomy, ordered by code number. Engineer / citation / journalist entry point.

Same source of truth, two indexes into it. Layer View first on the page (procurement is the priority buyer surface for Sango Guard).

### Visual reference stack

Listed in priority order:

1. **Stripe API docs** (primary visual target) — [docs.stripe.com/api](https://docs.stripe.com/api)
2. **OWASP AI Exchange** — [owaspai.org](https://owaspai.org/) — closest modern-registry analog visually + functionally
3. **Tailwind docs** — [tailwindcss.com/docs](https://tailwindcss.com/docs) — sidebar pattern, typography
4. **Vercel docs** — [vercel.com/docs](https://vercel.com/docs) — sidebar grouping, dark/light toggle
5. **Kybernesis docs** — [kybernesis.ai/kyberbot/docs](https://kybernesis.ai/kyberbot/docs) — Sushee flagged as aspirational
6. **Popoto / ReadTheDocs / Sphinx** — [popoto.readthedocs.io](https://popoto.readthedocs.io/en/stable/configuration/) — open-source standard for technical reference docs
7. **KYE whitepaper** — [kye-protocol.github.io/whitepaper.html](https://kye-protocol.github.io/whitepaper.html) — single-doc typography polish (different doc type but typography lessons transfer)

### Explicitly rejected

- **MITRE CWE** — visually dated. Borrow structure only.
- **Mintlify** — $150/mo SaaS. Used by Anthropic / Cursor / Coinbase / Perplexity. Stripe-grade out of the box. **Too expensive for SVRNOS pre-revenue.** Re-evaluate when Sango Guard has paying customers and a developer-facing API docs need.
- **Slate** ([github.com/slatedocs/slate](https://github.com/slatedocs/slate)) — archived February 2026. 36.1k stars but no longer maintained. Forking would create maintenance debt.
- **Redoc / Spectacle** — OpenAPI-specific. Wrong fit for GER (not an OpenAPI spec).

### Stack decision

**Use [Starlight](https://starlight.astro.build/) — Astro team's official docs framework. Free, MIT, open source. Same stack as svrnos-site already uses.**

This is the right answer found 2026-05-18 after initially assuming "build from scratch in Astro + Tailwind." Starlight gives the three-column docs pattern out of the box and saves the foundation work. Customize the rest.

**What Starlight provides out of the box:**

- Three-column layout (left sidebar with grouped nav, main content, right rail "On this page" TOC)
- Sticky header + sticky sidebar behavior
- Mobile-responsive (sidebar collapses to hamburger)
- Built-in full-text search via [Pagefind](https://pagefind.app/) — no Algolia signup, no monthly fee. Gives Sushee the "Find anything" experience for free.
- Built-in dark mode toggle
- Markdown + MDX support
- i18n if ever needed
- Tailwind-compatible (component overrides + token-based theming)

**What Starlight does NOT give out of the box, that we add:**

- **"Ask AI" header button** — custom component, link to existing `/ask` page (already deployed, field-validated 2026-05-08 with George Siosi). ~15 min.
- **"Copy for LLM" header button** — custom component, clipboard API copies the `.md` alternate of the current page. The `.md` alternates already exist per the CLAUDE.md page-update sync rule. ~30 min.
- **SVRNOS aesthetic** — override Starlight's default theme with `@svrnos/tokens`: Inter body, Instrument Serif accent, brand green `#2f5d50`, light surface ramp. Theme override is documented in Starlight's docs. ~2 hours.

**Adopted by real companies:** Cloudflare, Tauri, Sentry API docs, Bun-related projects. Maintained by the Astro core team.

**Deployment options:**

- **Subpath of svrnos.com** (recommended): Starlight runs at `/docs/*` or eventually `/research/governance-error-register/*` as part of the existing Astro project. Single domain, single deploy.
- **Subdomain** (alternative): `docs.svrnos.com` if separation makes more sense organizationally.

### Other free options considered (rejected for SVRNOS)

| Tool | Stack | Why rejected for SVRNOS |
|---|---|---|
| [Docusaurus](https://docusaurus.io/) | React | Would require Next.js or React Router migration. Not Astro-native. Meta-maintained. |
| [Nextra](https://nextra.site/) | Next.js | Same as Docusaurus — different stack. |
| [VitePress](https://vitepress.dev/) | Vite/Vue | Different stack. |
| [Markdoc](https://github.com/markdoc/markdoc) | Markup engine only | Stripe's actual engine. Open-source under MIT. But it's just the parser — you build the visual layer. Useful reference if MDX-heavy interactive content emerges later. |
| [not-stripe](https://github.com/code-hike/not-stripe) | Next.js + MDX + Code Hike | Visual replica demo. Single page (Stripe checkout quickstart). Useful reference for component-level look. Not a base to fork. |

### Why not Starlight earlier

Honest note: this option was missed in the first research pass. The initial framing was "build from scratch in Astro + Tailwind." Starlight collapses 4-5 hours of foundation work into "install + customize theme." Updated 2026-05-18 after Sushee pushed back ("are you sure there's no tool we could use?"). Lesson: when researching tools, default to "what's the docs framework for THIS stack" before "let me design the architecture from primitives."

### Scope phasing (revised with Starlight as the foundation)

| Phase | Scope | Time | Trigger |
|---|---|---|---|
| Quick wins | Layer View section, per-code row anchors, tier intros (on existing page, BEFORE migration) | ~75 min | Can ship inside v0.2 publication |
| Starlight install + theme | Install Starlight, point at existing markdown, customize theme to `@svrnos/tokens` | ~3 hours | Dedicated session with Sushee driving aesthetic choices |
| GER content migration | Move GER taxonomy into Starlight structure with tier-grouped sidebar nav + per-code anchors | ~2 hours | After theme is approved |
| Custom header components | "Ask AI" button (link to /ask) + "Copy for LLM" button (clipboard) | ~1 hour | After migration |
| Per-code pages | Each code gets its own URL with full content + documented instances + related codes | 6-8 hours | Register grows past ~50 codes, or traffic shows per-code lookup pattern |
| Polish + mobile + dark mode | Pagefind search styling, mobile sidebar, dark mode (Starlight provides; just polish) | ~1-2 hours | After v1 lands |

**Total v1 budget revised: 5-7 hours** (down from "4-8 hours from scratch"). Starlight's defaults handle the foundation work.

### Sticky reminders for the build session

- Tokens from `@svrnos/tokens` (Inter + Instrument Serif + Geist Mono, brand green `#2f5d50`, light surface ramp). No new fonts.
- HTTP code numbering stays (305, 307, 308, 311+). Layer column added as a second classification axis, not a replacement for code number.
- Per-code anchors get `:target` highlight CSS (visual flag when arriving via anchor link).
- Mobile breakpoint: sidebar collapses into hamburger.
- The .md alternates are already maintained (CLAUDE.md sync rule). The "Copy for LLM" button just pulls the .md content for the current page.
- The /ask bot is real and field-validated. "Ask AI" header button = direct link, no new infrastructure.

### Updates from 2026-05-18 session (AIID validation + MIT paper review)

These items emerged after the original spec and should be reflected when the build resumes. Full detail in `docs/ger-v02-revision-notes.md` under "Structural improvements derived from MIT AI Risk Repository."

1. **AIID anchor data is real.** Full 1,473-incident AIID snapshot extracted at `aiid-snapshot/` (CC BY-SA 4.0). ~85% of incidents map to existing GER codes; 14 new code candidates surfaced. Two Google Sheets tabs already populated: "AIID Anchors" (one anchor per existing code) and "AIID-Derived Proposals" (14 new candidates with anchor lists). **Per-code pages must include a "Documented instances" block** with linked AIID incident IDs. The trigger threshold for per-code pages ("register grows past ~50 codes") will likely fire on v0.2 publication: 27 current + 14 proposed = 41, plus the per-code-page work itself often surfaces additional codes during structuring.

2. **MIT-paper-derived v0.2 content additions slot into Starlight Guides section.** Starlight separates Reference (per-code canonical entries) from Guides (longer narrative). The four new content blocks land in Guides:
   - **For X stakeholder section** (CISOs / Regulators / Audit / Procurement) — one page per persona.
   - **Limitations** — single page near the front of the sidebar, before the code reference.
   - **Methodology** — names the synthesis method ("regulator-test-driven taxonomy development" or similar).
   - **Coverage statistics** — quantified AIID validation results, near the abstract.

3. **Reverse cross-reference to the AI Governance Stack tutorial.** Each Stack layer (L1–L7) lists which GER codes fire there. Two options:
   - **Migrate the stack tutorial into the same Starlight site** as a Guides entry. Cleanest if Starlight site is at `/research/` root.
   - **Keep tutorial at current path** (`/insights/ai-governance-stack-tutorial`) with cross-links from each GER code page back to the relevant stack layer.

   Decision deferred to the build session. Either way, the reverse table belongs in the stack tutorial doc too — when the GER redesign ships, the stack tutorial gets a "GER codes that fire at this layer" block appended to each layer section. This must follow the page-update sync rule (HTML + .md alternate + llms.txt + post-deploy-check.sh CHECKS array + kb.ts).

4. **CC BY-SA 4.0 attribution slot in the Starlight theme.** v0.2 is switching from CC BY 4.0 to CC BY-SA 4.0 (matches AIID's license; cleanest position for derivative anchor data). Theme needs:
   - Footer attribution line: *"Anchor data draws on the AI Incident Database (incidentdatabase.ai), CC BY-SA 4.0, McGregor 2021."*
   - License footer: *"GER v0.2 is licensed under CC BY-SA 4.0."*
   - Per-page citation widget — auto-generated citation block (BibTeX + APA) for each code page so academic users can cite specific codes. Needs the Zenodo DOI to be in place first.

5. **Zenodo DOI is a prerequisite.** Item 6 of the v0.2 revision notes — assign before publication. The DOI feeds into the citation widget (item 4 above) and into the abstract. Free, ~5 min of work; do it first.

6. **Scope estimate revision.** Original ~5-7h budget covered Starlight install + theme + GER content migration. Adding the four items above: ~2-3h for stakeholder pages, ~1h for limitations + methodology + coverage stat pages, ~1h for reverse cross-reference scaffold, ~30 min for citation widget + license footers. **Revised total: ~9-12h for the full v0.2-with-MIT-additions build.** Can be phased: ship Starlight + Reference + Guides foundation in session 1 (~7h), add stakeholder pages + reverse cross-ref in session 2 (~3-4h).
