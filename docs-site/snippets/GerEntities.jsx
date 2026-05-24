export const GerEntities = () => {
  const CDN = "https://cdn.jsdelivr.net/gh/svrnos/site@main/docs-site/data"

  const [incidents, setIncidents] = useState([])
  const [codeNames, setCodeNames] = useState({})
  const [role, setRole] = useState("deployer")
  const [search, setSearch] = useState("")
  const [openEntity, setOpenEntity] = useState(null)

  useEffect(() => {
    fetch(`${CDN}/aiid.json`).then((r) => r.json()).then((d) => setIncidents(d.incidents || []))
    fetch(`${CDN}/ger.json`).then((r) => r.json()).then((d) => {
      const m = {}
      for (const c of (d.codes || [])) m[c.code] = c.name
      setCodeNames(m)
    })
  }, [])

  const isUnknown = (name) => !name || /^unknown(-|$)/.test(name)

  const entities = useMemo(() => {
    const byEntity = new Map()
    for (const i of incidents) {
      const raw = i[role]
      if (!raw) continue
      const names = String(raw).split(",").map((s) => s.trim()).filter(Boolean)
      for (const name of names) {
        if (isUnknown(name)) continue
        if (!byEntity.has(name)) byEntity.set(name, { name, count: 0, codes: new Map(), incidents: [] })
        const e = byEntity.get(name)
        e.count += 1
        e.incidents.push(i)
        for (const g of (i.ger_codes || [])) {
          const k = g.code
          if (!e.codes.has(k)) e.codes.set(k, 0)
          e.codes.set(k, e.codes.get(k) + 1)
        }
      }
    }
    return Array.from(byEntity.values()).sort((a, b) => b.count - a.count)
  }, [incidents, role])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return entities
    return entities.filter((e) => e.name.toLowerCase().includes(q))
  }, [entities, search])

  const formatEntity = (n) =>
    n.split("-").map((w) => w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  return (
    <div className="ger-entities not-prose">
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
        <div className="flex gap-1">
          {[
            { slug: "deployer", label: "By Deployer" },
            { slug: "developer", label: "By Developer" },
          ].map((r) => (
            <button
              key={r.slug}
              onClick={() => { setRole(r.slug); setOpenEntity(null) }}
              className={`text-sm px-3 py-1.5 rounded font-mono transition-colors ${
                role === r.slug ? "bg-green-700 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter entities…"
          className="px-3 py-1.5 border border-neutral-300 rounded text-sm w-64"
        />
      </div>

      {incidents.length === 0 ? (
        <div className="py-12 text-center text-neutral-500">
          <p className="text-sm font-mono">Loading entity data…</p>
        </div>
      ) : (
        <>
          <p className="text-xs font-mono text-neutral-500 mb-4">
            {filtered.length} entities · {filtered.reduce((s, e) => s + e.count, 0)} error attributions
            {" "}(unknown-attributed entities excluded)
          </p>
          <ul className="space-y-2">
            {filtered.slice(0, 100).map((e) => {
              const sortedCodes = Array.from(e.codes.entries()).sort((a, b) => b[1] - a[1])
              const isOpen = openEntity === e.name
              return (
                <li key={e.name} className="border border-neutral-200 rounded-md overflow-hidden">
                  <button
                    onClick={() => setOpenEntity(isOpen ? null : e.name)}
                    className="w-full flex items-baseline gap-4 p-3 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="font-mono text-xs text-neutral-400 w-6 text-right">{isOpen ? "▾" : "▸"}</span>
                    <span className="text-base font-medium text-neutral-900 flex-1">{formatEntity(e.name)}</span>
                    <span className="text-sm font-mono text-neutral-600">{e.count} errors</span>
                    <span className="text-xs font-mono text-neutral-500">{sortedCodes.length} GER codes</span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-neutral-200 bg-neutral-50/50 p-4">
                      {sortedCodes.length > 0 ? (
                        <ul className="flex flex-wrap gap-1.5">
                          {sortedCodes.map(([code, n]) => (
                            <li key={code}>
                              <a
                                href={`/ger/codes/${code}`}
                                className="inline-flex items-baseline gap-1 text-xs font-mono px-2 py-1 rounded bg-green-50 text-green-900 hover:bg-green-100"
                              >
                                <span className="font-semibold">GER-{code}</span>
                                <span className="text-green-700/70">{codeNames[code] || ""}</span>
                                <span className="text-green-700/50 ml-1">×{n}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-neutral-500 italic">No GER codes mapped to this entity's events yet.</p>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
          {filtered.length > 100 && (
            <p className="text-xs text-neutral-500 italic mt-4">
              Showing top 100 of {filtered.length}. Use the filter to narrow.
            </p>
          )}
        </>
      )}
    </div>
  )
}
