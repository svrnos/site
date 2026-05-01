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
