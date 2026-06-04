# SVRNOS Supabase — GER + AIID registry database

The canonical source of truth for the SVRNOS Governance Error Register and
the AIID incident corpus we map against. The public website remains static —
this database is queried only by build-time scripts that export JSON files
into `src/data/`. No runtime DB dependency from svrnos.com.

## Tables

| Table | Purpose | Approx rows at v0.2 |
|---|---|---|
| `ger_codes` | the canonical registry | ~73 |
| `ger_distinct_from` | binary disambiguation pairs | ~150 |
| `aiid_incidents` | local AIID corpus mirror (titles only) | 1,473 |
| `ger_aiid_mappings` | codes ↔ incidents | growing from ~35 toward 1,473 |
| `contributors` | SVRNOS GER credit roster | ~25 |
| `ger_attributions` | contributors ↔ codes | ~40 |
| `tags` | flat harm/vector/jurisdiction/sector vocabulary | ~50 |
| `ger_code_tags` | codes ↔ tags | ~250 |
| `aiid_incident_tags` | incidents ↔ tags | ~3,000 |
| `glossary` | SVRNOS-coined terms only | ~30 |

Two export views (`ger_codes_export`, `aiid_incidents_export`) produce
denormalized JSON-shaped rows for the build pipeline.

## Read/write surface

- **Public read** — anyone can SELECT all canonical tables via the `anon` role
- **Write** — service-role key only (migration scripts, future admin UI,
  Sushee in Supabase Studio)
- **No public-write surface in v0.2.** Proposals go to /ask or hello@svrnos.com.

## Setup (when ready to apply)

1. Create a new Supabase project, suggested name: **svrnos-registry**.
2. Get the `DATABASE_URL` connection string from project settings → Database.
3. Run the initial migration:
   ```bash
   psql "$DATABASE_URL" -f supabase/migrations/0001_ger_schema.sql
   ```
   Or paste the file contents into the Supabase SQL Editor and run.
4. Verify tables created:
   ```sql
   SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public' ORDER BY table_name;
   ```
   Should return 10 tables plus 2 views.

## Migration order (after schema is applied)

1. **Seed contributors** — from `~/.claude/projects/.../memory/reference_v02_contributors.md` (~25 people)
2. **Seed tags** — from the starter list locked during planning
3. **Seed glossary** — initial ~30 SVRNOS-coined terms
4. **Seed ger_codes** — port v0.1 (27 codes) + v0.2 additions (~35 codes from
   `notebooklm-sources/ger-v02-*.md` drafts) — total ~73 codes
5. **Seed ger_distinct_from** — parse "Distinct From" prose from each code,
   author binary pairs (some can be auto-extracted, some need manual)
6. **Seed ger_attributions** — link codes to contributors
7. **Seed ger_code_tags** — tag each code
8. **Seed aiid_incidents** — from `aiid-snapshot/ger-working/all_incidents.jsonl`
   (1,473 records, titles + metadata only, NO descriptions per content
   strategy: we link out for narrative)
9. **Seed ger_aiid_mappings** — start with the 16 anchor pairs from the
   GER Sheet's AIID Anchors tab; grow over time toward full 1,473 coverage
10. **Seed aiid_incident_tags** — inherit from each incident's mapped GER codes

Migration scripts live in `supabase/migrations/scripts/` (one TypeScript file
per seed step, idempotent).

## Export pipeline

After data is seeded, build pipeline runs:

```bash
npm run export:ger
# → reads ger_codes_export view + aiid_incidents_export view
# → writes src/data/ger.json + src/data/aiid.json + src/data/tags.json
# → Astro/Mintlify build reads these JSON files
```

Runs in CI/CD before the site build. Manual trigger for now; Supabase webhook
to auto-trigger on edits is a v0.2.1 add.

## License notes

- **GER content** (codes, definitions, distinct-from, attributions, glossary,
  tags): CC BY 4.0 — SVRNOS owns the taxonomy
- **AIID content** (incident titles, IDs, dates, deployer, developer):
  CC BY-NC-SA 4.0 — AIID owns the corpus
- The site must carry an AIID data-source credit on every surface that
  displays incident metadata, with deep-link to incidentdatabase.ai for
  the full narrative. Title-only inclusion qualifies as citation, not
  redistribution; clearance email to Sean McGregor is courtesy not blocker.
