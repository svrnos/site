-- 0003_contributor_url_in_export.sql
-- Surface each contributor's profile/source URL (contributors.url) in the export,
-- so per-code contributor names can render as links (LinkedIn for practitioners,
-- Medium / arXiv / paper for writers and academics).

CREATE OR REPLACE VIEW ger_codes_export AS
SELECT
  c.code, c.name, c.definition, c.tier, c.layer, c.article_url, c.type, c.is_namespace_claim, c.version_added,
  COALESCE((SELECT json_agg(tag_slug ORDER BY tag_slug) FROM ger_code_tags WHERE code = c.code), '[]'::json) AS tags,
  COALESCE((SELECT json_agg(json_build_object(
      'contrasted_with', contrasted_with, 'this_condition', this_condition, 'other_condition', other_condition
   ) ORDER BY contrasted_with) FROM ger_distinct_from WHERE code = c.code), '[]'::json) AS distinct_from,
  (SELECT json_build_object(
      'source_type', s.source_type, 'external_ref', s.external_ref, 'url', s.url, 'title', s.title
   ) FROM incident_sources s WHERE s.id = c.documented_source_id) AS documented_source,
  COALESCE((SELECT json_agg(json_build_object(
      'name', co.name, 'affiliation', co.affiliation, 'url', co.url, 'attribution_type', a.attribution_type
   ) ORDER BY co.name) FROM ger_attributions a JOIN contributors co ON co.id = a.contributor_id WHERE a.code = c.code), '[]'::json) AS contributors
FROM ger_codes c
ORDER BY tier, code;

GRANT SELECT ON ger_codes_export TO anon, authenticated;
