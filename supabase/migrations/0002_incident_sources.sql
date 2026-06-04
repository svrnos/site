-- 0002_incident_sources.sql
-- Generalizes documented-case storage beyond AIID, and switches the export
-- to one documented exemplar per code.
--
-- Context: "documented" GER codes can be anchored by an AIID incident OR by a
-- non-AIID source (arXiv paper, vendor advisory, news, bug report, CVE). The
-- original schema only modeled AIID anchors (ger_aiid_mappings), so non-AIID
-- exemplars had no home and lived only in the exported file. This migration
-- gives them a home and makes the export reproduce exactly one exemplar/code.
--
-- ger_aiid_mappings is retained untouched as the full code<->incident dataset
-- (the one-time AIID coverage exercise for Sean McGregor); it is no longer the
-- export source.

-- 1. Generalized documented-source store. Holds ONLY GER's cited exemplars
--    (one per documented code), NOT a maintained incident corpus (that is AIID's role).
CREATE TABLE IF NOT EXISTS incident_sources (
  id           serial PRIMARY KEY,
  source_type  text NOT NULL,            -- 'aiid'|'mitre'|'arxiv'|'vendor'|'news'|'advisory'|'paper'|'bug-report'|...
  external_ref text,                       -- native id (aiid#, arxiv id, MITRE id); NULL for plain links
  url          text NOT NULL,
  title        text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE incident_sources IS 'Documented cases cited by GER codes. One exemplar per code via ger_codes.documented_source_id. Not an incident database (that is AIID''s role) — holds only cited exemplars.';

-- 2. One documented exemplar per code.
ALTER TABLE ger_codes
  ADD COLUMN IF NOT EXISTS documented_source_id int REFERENCES incident_sources(id) ON DELETE SET NULL;
COMMENT ON COLUMN ger_codes.documented_source_id IS 'The one external documented case for this code (NULL if undocumented or documented only by article_url).';

-- 3. v0.2 added 1xx (Compute Substrate) codes and the 800/900 Dimension Markers.
ALTER TABLE ger_codes DROP CONSTRAINT IF EXISTS ger_codes_tier_check;
ALTER TABLE ger_codes ADD CONSTRAINT ger_codes_tier_check
  CHECK (tier IN ('0xx','1xx','2xx','3xx','4xx','5xx','8xx','9xx'));

-- 4. Export view: emit one `documented_source` object per code (was: aiid_anchors array).
DROP VIEW IF EXISTS ger_codes_export;
CREATE VIEW ger_codes_export AS
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
  COALESCE((SELECT json_agg(tag_slug ORDER BY tag_slug) FROM ger_code_tags WHERE code = c.code), '[]'::json) AS tags,
  COALESCE((SELECT json_agg(json_build_object(
      'contrasted_with', contrasted_with,
      'this_condition', this_condition,
      'other_condition', other_condition
   ) ORDER BY contrasted_with) FROM ger_distinct_from WHERE code = c.code), '[]'::json) AS distinct_from,
  (SELECT json_build_object(
      'source_type', s.source_type,
      'external_ref', s.external_ref,
      'url', s.url,
      'title', s.title
   ) FROM incident_sources s WHERE s.id = c.documented_source_id) AS documented_source,
  COALESCE((SELECT json_agg(json_build_object(
      'name', co.name,
      'affiliation', co.affiliation,
      'attribution_type', a.attribution_type
   ) ORDER BY co.name) FROM ger_attributions a JOIN contributors co ON co.id = a.contributor_id WHERE a.code = c.code), '[]'::json) AS contributors
FROM ger_codes c
ORDER BY tier, code;

GRANT SELECT ON ger_codes_export TO anon, authenticated;
