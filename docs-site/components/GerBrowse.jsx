// ============================================================================
// GerBrowse.jsx
// ----------------------------------------------------------------------------
// Flat tier-grouped index of every GER code. No filters, no search, just a
// scannable list with links to per-code pages. For users who already know
// what they want.
// ============================================================================

import gerData from "../../src/data/ger.json";

const TIER_LABEL = {
  "0xx": "Pre-Infrastructure",
  "2xx": "Success States",
  "3xx": "Structural Moves",
  "4xx": "Operator / Platform Errors",
  "5xx": "Infrastructure Failures",
};

export default function GerBrowse() {
  const codes = gerData.codes;

  // Group by tier, preserve insertion order (already sorted by tier+code from the export view)
  const groups = {};
  for (const c of codes) {
    groups[c.tier] = groups[c.tier] ?? [];
    groups[c.tier].push(c);
  }

  return (
    <div className="ger-browse not-prose">
      {Object.entries(groups).map(([tier, list]) => (
        <section key={tier} className="mb-10">
          <h2 className="text-lg font-mono mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold">{tier}</span>
            <span className="text-neutral-500 ml-3 font-sans text-sm">— {TIER_LABEL[tier]}</span>
            <span className="text-neutral-400 ml-2 font-mono text-xs">({list.length})</span>
          </h2>
          <ul className="space-y-1">
            {list.map((c) => (
              <li key={c.code}>
                <a href={`/ger/codes/${c.code}`}
                   className="grid grid-cols-[60px_1fr_auto] gap-4 py-2 px-3 rounded hover:bg-green-50 transition-colors items-baseline">
                  <span className="font-mono text-sm text-green-900 font-semibold">{c.code}</span>
                  <span className="text-base text-neutral-900">{c.name}</span>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                    {c.type === "documented" ? "Documented" : "Illustrative"}
                    {c.is_namespace_claim ? " · Namespace" : ""}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
