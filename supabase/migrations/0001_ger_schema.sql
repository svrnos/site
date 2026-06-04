-- ============================================================================
-- SVRNOS Governance Error Register (GER) — initial schema
-- ============================================================================
-- Version:     0001 (initial)
-- Created:     2026-05-21
-- Purpose:     Single source of truth for the GER taxonomy + the AIID incident
--              corpus we map against. Replaces the prior split between Google
--              Sheets, notebooklm-sources/*.md drafts, and the Astro page.
-- Strategy:    Database is canonical. Build pipeline exports DB → JSON at
--              deploy time so the public site remains static. No runtime DB
--              dependency from svrnos.com.
--
-- Defaults picked (change before applying if any are wrong):
--   - tier (mandatory) + layer (nullable cross-ref to 7-Layer Model)
--   - Public read access on all canonical tables via the `anon` role
--   - No user-generated submissions table (proposals go to /ask or email)
--   - No articles table (one canonical article_url per code, on ger_codes)
-- ============================================================================


-- 1. ger_codes — the canonical registry
-- One row per GER code. Definitions live in full; per-code pages get unlimited
-- room in the UI, so no need to compress for layout (the v0.1→v0.2 lesson).
CREATE TABLE ger_codes (
  code            text PRIMARY KEY,
    -- '501', '322', '309' — string because we have '000', '205', '420*' variants;
    -- the asterisk is dropped at publish (per 2026-05-22 namespace-claim rename).
  name            text NOT NULL,
    -- 'Escalation Not Implemented'
  definition      text NOT NULL,
    -- Full prose. Sub-types described inline (no separate table).
  tier            text NOT NULL
    CHECK (tier IN ('0xx', '2xx', '3xx', '4xx', '5xx')),
    -- The HTTP-derived classification. Mandatory; primary structural axis.
  layer           text
    CHECK (layer IN ('L1','L2','L3','L4','L5','L6','L7')
           OR layer LIKE 'L%+L%'),
    -- The 7-Layer Model layer where this failure structurally lives.
    -- Optional cross-reference. Supports multi-layer ('L5+L7') for codes
    -- spanning layers (Sango Guard's signature pattern, for instance).
  article_url     text,
    -- Canonical case-study article. Singular. Other articles cross-link
    -- from their own content, not via a join table.
  type            text NOT NULL
    CHECK (type IN ('documented', 'illustrative')),
    -- 'documented' = anchor incident exists in AIID or named case;
    -- 'illustrative' = scenario described but no specific incident.
  is_namespace_claim boolean NOT NULL DEFAULT false,
    -- true = SVRNOS assigns this code an HTTP-unassigned slot (e.g., 306, 310, 420, 430, 512).
  version_added   text NOT NULL DEFAULT 'v0.1',
    -- Which GER version first introduced this code.
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ger_codes_tier  ON ger_codes(tier);
CREATE INDEX idx_ger_codes_layer ON ger_codes(layer);
CREATE INDEX idx_ger_codes_type  ON ger_codes(type);


-- 2. ger_distinct_from — disambiguation pairs (the binary refiner data)
-- Each row asserts: "code A is distinct from code B because [this vs that]".
-- The lookup tool's self-correcting refiner widget queries this table.
CREATE TABLE ger_distinct_from (
  code            text NOT NULL REFERENCES ger_codes(code) ON DELETE CASCADE,
  contrasted_with text NOT NULL REFERENCES ger_codes(code) ON DELETE CASCADE,
  this_condition  text NOT NULL,
    -- "Did detection fire and no escalation handler was built?" → this code
  other_condition text NOT NULL,
    -- "Did detection fire and the external handler timed out?" → contrasted_with
  PRIMARY KEY (code, contrasted_with),
  CHECK (code <> contrasted_with)
);

CREATE INDEX idx_ger_distinct_from_contrasted ON ger_distinct_from(contrasted_with);


-- 3. aiid_incidents — local mirror of the AI Incident Database
-- Titles + metadata only. Full incident narratives live on incidentdatabase.ai;
-- we link out. CC BY-NC-SA 4.0 attribution required on every surface that
-- uses this data.
CREATE TABLE aiid_incidents (
  aiid_id         int PRIMARY KEY,
    -- The canonical AIID incident ID (e.g., 1485 for MrBeast deepfake)
  title           text NOT NULL,
  incident_date   date,
  deployer        text,
    -- Comma-separated text from AIID source (e.g., 'youtube', 'meta,instagram')
  developer       text,
    -- Same shape as deployer
  aiid_url        text NOT NULL
    -- 'https://incidentdatabase.ai/cite/{aiid_id}' — generated at migration time
);

CREATE INDEX idx_aiid_incidents_date ON aiid_incidents(incident_date);


-- 4. ger_aiid_mappings — codes ↔ incidents (many-to-many)
-- For each AIID incident, which GER codes does it fire and in what role?
-- This is what the lookup tool's AIID search box reads to suggest codes.
CREATE TABLE ger_aiid_mappings (
  code            text NOT NULL REFERENCES ger_codes(code) ON DELETE CASCADE,
  aiid_id         int  NOT NULL REFERENCES aiid_incidents(aiid_id) ON DELETE CASCADE,
  role            text NOT NULL DEFAULT 'primary'
    CHECK (role IN ('primary', 'secondary', 'manifestation', 'contributing')),
  notes           text,
  PRIMARY KEY (code, aiid_id, role)
);

CREATE INDEX idx_ger_aiid_mappings_aiid ON ger_aiid_mappings(aiid_id);


-- 5. contributors — SVRNOS GER credit roster only
-- Stable, curated, ~25-50 people. NOT for AIID report submitters
-- (AIID owns that surface; we link out for incident-side credit).
CREATE TABLE contributors (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  affiliation     text,
  url             text,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now()
);


-- 6. ger_attributions — contributors ↔ codes (the v0.2 acknowledgments roster)
-- "Dr. Hellen V. is credited on 432, 433, 344"
CREATE TABLE ger_attributions (
  code            text NOT NULL REFERENCES ger_codes(code)    ON DELETE CASCADE,
  contributor_id  uuid NOT NULL REFERENCES contributors(id)   ON DELETE CASCADE,
  attribution_type text NOT NULL DEFAULT 'primary'
    CHECK (attribution_type IN ('primary', 'co-attribution', 'subtype', 'refinement')),
  notes           text,
  PRIMARY KEY (code, contributor_id, attribution_type)
);


-- 7. tags — flat vocabulary
-- Harm types, vectors, populations, jurisdictions, sectors. No hierarchy,
-- no categories enum, no display colors in schema. UI styles tags by slug.
CREATE TABLE tags (
  slug            text PRIMARY KEY,
    -- 'suicide', 'fraud', 'cib', 'doxxing', 'minors', 'eu-ai-act', 'clinical'
  label           text NOT NULL,
    -- 'Suicide / self-harm', 'Coordinated Inauthentic Behavior'
  description     text,
  created_at      timestamptz NOT NULL DEFAULT now()
);


-- 8. ger_code_tags — codes ↔ tags
CREATE TABLE ger_code_tags (
  code            text NOT NULL REFERENCES ger_codes(code) ON DELETE CASCADE,
  tag_slug        text NOT NULL REFERENCES tags(slug)      ON DELETE CASCADE,
  PRIMARY KEY (code, tag_slug)
);


-- 9. aiid_incident_tags — incidents ↔ tags (same tags, different join)
-- Initial population: inherit from each incident's mapped GER codes
-- (one-time migration script). Subsequent edits manual.
CREATE TABLE aiid_incident_tags (
  aiid_id         int  NOT NULL REFERENCES aiid_incidents(aiid_id) ON DELETE CASCADE,
  tag_slug        text NOT NULL REFERENCES tags(slug)              ON DELETE CASCADE,
  PRIMARY KEY (aiid_id, tag_slug)
);


-- 10. glossary — SVRNOS-coined terms only
-- Highlighted on hover/click across the docs site via <G> MDX component.
-- Field-wide terms ('AI', 'hallucination', 'alignment') do NOT belong here.
CREATE TABLE glossary (
  slug              text PRIMARY KEY,
    -- 'generation-gap', 'compliant-harm', 'sycophancy-loop'
  term              text NOT NULL,
    -- 'Generation Gap', 'Compliant Harm', 'Yo-Yo Trick'
  short_definition  text NOT NULL,
    -- One sentence, what shows in the tooltip
  full_url          text,
    -- Where the canonical definition lives (a GER code page, a paper, an article)
  also_known_as     text,
    -- e.g. 'Reset Content' for the Yo-Yo Trick entry (so search hits both)
  created_at        timestamptz NOT NULL DEFAULT now()
);


-- ============================================================================
-- Row-level security — public read, service-role write
-- ============================================================================
-- The GER is open infrastructure. Anyone can query the canonical tables.
-- Writes happen via the Supabase service-role key from migration scripts and
-- (later) from Sushee in Supabase Studio. No public write surface in v0.2.

ALTER TABLE ger_codes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE ger_distinct_from      ENABLE ROW LEVEL SECURITY;
ALTER TABLE aiid_incidents         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ger_aiid_mappings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributors           ENABLE ROW LEVEL SECURITY;
ALTER TABLE ger_attributions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE ger_code_tags          ENABLE ROW LEVEL SECURITY;
ALTER TABLE aiid_incident_tags     ENABLE ROW LEVEL SECURITY;
ALTER TABLE glossary               ENABLE ROW LEVEL SECURITY;

-- One policy per table: anyone can SELECT. Writes require service-role
-- (which bypasses RLS automatically).
CREATE POLICY "anon read"  ON ger_codes              FOR SELECT USING (true);
CREATE POLICY "anon read"  ON ger_distinct_from      FOR SELECT USING (true);
CREATE POLICY "anon read"  ON aiid_incidents         FOR SELECT USING (true);
CREATE POLICY "anon read"  ON ger_aiid_mappings      FOR SELECT USING (true);
CREATE POLICY "anon read"  ON contributors           FOR SELECT USING (true);
CREATE POLICY "anon read"  ON ger_attributions       FOR SELECT USING (true);
CREATE POLICY "anon read"  ON tags                   FOR SELECT USING (true);
CREATE POLICY "anon read"  ON ger_code_tags          FOR SELECT USING (true);
CREATE POLICY "anon read"  ON aiid_incident_tags     FOR SELECT USING (true);
CREATE POLICY "anon read"  ON glossary               FOR SELECT USING (true);


-- ============================================================================
-- updated_at trigger for ger_codes
-- ============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ger_codes_updated_at
  BEFORE UPDATE ON ger_codes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================================
-- Helpful views for the JSON export pipeline
-- ============================================================================

-- ger_codes_export — denormalized snapshot, one row per code, with tags
-- aggregated, attributions aggregated, AIID mappings aggregated, distinct-from
-- aggregated. The export pipeline reads this view and writes ger.json.
CREATE OR REPLACE VIEW ger_codes_export AS
SELECT
  c.code,
  c.name,
  c.definition,
  c.tier,
  c.layer,
  c.article_url,
  c.type,
  c.is_namespace_claim,
  c.version_added,
  COALESCE(
    (SELECT json_agg(tag_slug ORDER BY tag_slug) FROM ger_code_tags WHERE code = c.code),
    '[]'::json
  ) AS tags,
  COALESCE(
    (SELECT json_agg(json_build_object(
        'contrasted_with', contrasted_with,
        'this_condition', this_condition,
        'other_condition', other_condition
     ) ORDER BY contrasted_with) FROM ger_distinct_from WHERE code = c.code),
    '[]'::json
  ) AS distinct_from,
  COALESCE(
    (SELECT json_agg(json_build_object(
        'aiid_id', m.aiid_id,
        'title', i.title,
        'date', i.incident_date,
        'role', m.role,
        'aiid_url', i.aiid_url
     ) ORDER BY m.role, m.aiid_id)
     FROM ger_aiid_mappings m
     JOIN aiid_incidents i ON i.aiid_id = m.aiid_id
     WHERE m.code = c.code),
    '[]'::json
  ) AS aiid_anchors,
  COALESCE(
    (SELECT json_agg(json_build_object(
        'name', co.name,
        'affiliation', co.affiliation,
        'attribution_type', a.attribution_type
     ) ORDER BY co.name)
     FROM ger_attributions a
     JOIN contributors co ON co.id = a.contributor_id
     WHERE a.code = c.code),
    '[]'::json
  ) AS contributors
FROM ger_codes c
ORDER BY c.tier, c.code;


-- aiid_incidents_export — denormalized incident records with their mapped
-- codes and inherited tags. The export pipeline reads this and writes aiid.json.
CREATE OR REPLACE VIEW aiid_incidents_export AS
SELECT
  i.aiid_id,
  i.title,
  i.incident_date,
  i.deployer,
  i.developer,
  i.aiid_url,
  COALESCE(
    (SELECT json_agg(json_build_object('code', code, 'role', role) ORDER BY role, code)
     FROM ger_aiid_mappings WHERE aiid_id = i.aiid_id),
    '[]'::json
  ) AS ger_codes,
  COALESCE(
    (SELECT json_agg(tag_slug ORDER BY tag_slug)
     FROM aiid_incident_tags WHERE aiid_id = i.aiid_id),
    '[]'::json
  ) AS tags
FROM aiid_incidents i
ORDER BY i.aiid_id;


-- ============================================================================
-- End of 0001_ger_schema.sql
-- ============================================================================
