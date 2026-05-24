# docs-site — Mintlify project for docs.svrnos.com

This directory is the **Mintlify documentation site** that will be deployed at `docs.svrnos.com`. It holds the GER registry, the 7-Layer Model section, the NCSA section, the changelog, and the attributions roster.

Distinct from `svrnos-site/docs/`, which holds **internal planning notes** (research drafts, strategy docs, revision notes). Do not confuse the two.

## What's in here

```
docs-site/
├── docs.json                        ← Mintlify config (top nav, theme, fonts, footer)
├── introduction/
│   ├── welcome.mdx
│   ├── how-to-contribute.mdx
│   └── glossary.mdx                 ← generated from src/data/glossary.json
├── ger/
│   ├── index.mdx                    ← GER section landing
│   ├── find.mdx                     ← lookup tool (embeds <GerLookup />)
│   ├── browse.mdx                   ← flat code index (embeds <GerBrowse />)
│   ├── paper.mdx                    ← link to svrnos.com paper
│   ├── cite.mdx                     ← citation formats, DOI, license
│   ├── changelog.mdx                ← GER version history
│   └── codes/
│       └── [code].mdx               ← 71 files, generated from src/data/ger.json
├── seven-layer-model/
│   └── index.mdx
├── ncsa/
│   └── index.mdx
├── changelog/
│   └── index.mdx                    ← cross-artifact changelog feed
├── attributions/
│   └── index.mdx                    ← generated from src/data/contributors.json
├── components/
│   ├── GerLookup.jsx                ← React: three-entry lookup tool
│   └── GerBrowse.jsx                ← React: flat tier-grouped index
└── snippets/
    └── Badge.mdx                    ← reusable badge component
```

## Build pipeline

```
Supabase (canonical data)
   ↓ npm run export:ger
src/data/*.json
   ↓ npm run generate:code-pages
docs-site/ger/codes/*.mdx
   ↓ Mintlify build
docs.svrnos.com
```

The shortcut `npm run refresh:docs` runs both `export:ger` and `generate:code-pages` in sequence.

## What Sushee needs to do to ship this

1. **Create the Mintlify project** at https://mintlify.com (free Hobby tier)
2. **Connect the GitHub repo** to Mintlify (Mintlify auto-deploys on push to `main`)
3. **Tell Mintlify the docs root** — set the project's `Repository` root to `docs-site/` (so it doesn't try to render the entire monorepo)
4. **Add the custom domain** `docs.svrnos.com` in Mintlify project settings
5. **Add the DNS record** in your domain registrar pointing `docs.svrnos.com` at the Mintlify-provided target
6. **Verify the build** — Mintlify will preview and report any rendering errors

Once steps 1–5 are done, every push that touches `docs-site/` rebuilds and ships automatically.

## What needs the React components to actually render

Mintlify supports custom React components inside MDX via the `components/` directory. Two important behaviors to verify on first deploy:

1. **JSON imports** — the components import from `../../src/data/*.json`. Mintlify needs to be able to resolve that path during build. If it doesn't, we either symlink or copy the JSON files into `docs-site/data/`.
2. **Tailwind utility classes** — the components use Tailwind classes. Mintlify's themes provide a Tailwind runtime; verify the classes render correctly. If they don't, switch to inline `style={{}}` or rewrite as scoped CSS.

The data files are 660KB combined uncompressed; over the wire after Mintlify gzips them, ~150KB. Fine for client-side loading.

## Theme notes

Current theme: `linden` (Mintlify's vintage-minimalism theme). Custom color palette set to SVRNOS green:
- `primary: #2D5F3F` (used for buttons, headings)
- `light:   #5BAE7B` (dark-mode accent)
- `dark:    #1A3D28` (button hover)

Fonts: Source Serif 4 (headings) + Inter (body). Both Google Fonts, free, load automatically.

If the Linden theme renders too tightly or doesn't carry the SVRNOS aesthetic, the fallback options in order:
- Switch to `willow` (stripped-down)
- Switch to `quill` (minimalist)
- Customize via `docs.json` colors + `customCss` field (Hobby tier supports this)

## License

- **GER content** (codes, definitions, attributions, glossary, tags): CC BY 4.0
- **AIID incident titles**: sourced from incidentdatabase.ai, CC BY-NC-SA 4.0. SVRNOS displays titles and links out for full narratives.
