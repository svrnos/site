export const GerBrowse = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/gh/svrnos/site@main/docs-site/data/ger.json")
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(String(e)))
  }, [])

  const TIER_LABEL = {
    "0xx": "Pre-Infrastructure",
    "2xx": "Success States",
    "3xx": "Structural Moves",
    "4xx": "Operator / Platform Errors",
    "5xx": "Infrastructure Failures",
  }

  const codes = data ? data.codes || [] : []
  const groups = {}
  for (const c of codes) {
    if (!groups[c.tier]) groups[c.tier] = []
    groups[c.tier].push(c)
  }

  return (
    <div className="ger-browse not-prose">
      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded text-sm text-red-900">
          Couldn't load codes: {error}
        </div>
      )}
      {!data && !error && (
        <div className="py-12 text-center text-neutral-500">
          <p className="text-sm font-mono">Loading codes…</p>
        </div>
      )}
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
                <a
                  href={`/ger/codes/${c.code}`}
                  className="grid grid-cols-[60px_1fr_auto] gap-4 py-2 px-3 rounded hover:bg-green-50 transition-colors items-baseline"
                >
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
  )
}
