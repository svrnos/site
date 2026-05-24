export const GerLookup = () => {
  const CDN = "https://cdn.jsdelivr.net/gh/svrnos/site@main/docs-site/data"

  const SYMPTOMS = [
    { label: "I was charged / paid / dosed / sentenced the wrong amount", codes: ["305","318","334","503","309"] },
    { label: "AI confidently told me false information", codes: ["512","422","428"] },
    { label: "An AI agent did something I didn't authorize", codes: ["426","332","420","336"] },
    { label: "AI wouldn't stop / kept running / kept retrying", codes: ["427","345","503"] },
    { label: "AI treated me differently than someone with similar circumstances", codes: ["342","326","323"] },
    { label: "AI used or revealed private information about me", codes: ["324","326","329"] },
    { label: "A deepfake / voice clone of me circulated", codes: ["322","425"] },
    { label: "AI was tricked into producing harmful output", codes: ["421","420","306"] },
    { label: "AI applied an outdated, expired, or wrong-jurisdiction rule", codes: ["334","310","333"] },
    { label: "AI didn't perform as the vendor claimed it would", codes: ["422","309"] },
    { label: "A human was supposed to review but didn't", codes: ["429","502","321"] },
    { label: "I was punished or denied by AI with no human appeal", codes: ["424","501","502"] },
    { label: "The same problem keeps recurring after being reported", codes: ["319","309"] },
    { label: "AI-fabricated content was published as fact", codes: ["512","325","428"] },
    { label: "AI destroyed my data or system", codes: ["426","332","330"] },
    { label: "Identity verification was defeated by AI impersonation", codes: ["425","322"] },
    { label: "AI-generated content appeared without disclosure", codes: ["322","327"] },
  ]

  const TIERS = [
    { slug: "0xx", label: "0xx — Pre-Infrastructure" },
    { slug: "2xx", label: "2xx — Success States" },
    { slug: "3xx", label: "3xx — Structural Moves" },
    { slug: "4xx", label: "4xx — Operator / Platform Errors" },
    { slug: "5xx", label: "5xx — Infrastructure Failures" },
  ]

  const FILTER_TAGS = [
    "agentic","multi-agent","companion-ai","clinical","legal","educational",
    "financial","health-triage","hr-employment","generative-media","autonomous-vehicle",
    "minors","psychiatric-vulnerability","elderly",
    "suicide","self-harm","violence","deepfake-impersonation","fraud","doxxing",
    "privacy-violation","discrimination","prompt-injection",
  ]

  const [codes, setCodes] = useState([])
  const [aiidIncidents, setAiidIncidents] = useState([])
  const [aiidLoading, setAiidLoading] = useState(false)
  const [aiidReady, setAiidReady] = useState(false)
  const [selectedSymptoms, setSelectedSymptoms] = useState(new Set())
  const [selectedTiers, setSelectedTiers] = useState(new Set())
  const [selectedTags, setSelectedTags] = useState(new Set())
  const [search, setSearch] = useState("")
  const [aiidQuery, setAiidQuery] = useState("")

  useEffect(() => {
    fetch(`${CDN}/ger.json`).then((r) => r.json()).then((d) => setCodes(d.codes || []))
  }, [])

  useEffect(() => {
    if (aiidQuery.length >= 1 && !aiidReady && !aiidLoading) {
      setAiidLoading(true)
      fetch(`${CDN}/aiid.json`)
        .then((r) => r.json())
        .then((d) => {
          setAiidIncidents(d.incidents || [])
          setAiidReady(true)
          setAiidLoading(false)
        })
        .catch(() => setAiidLoading(false))
    }
  }, [aiidQuery, aiidReady, aiidLoading])

  const aiidCodeMap = useMemo(() => {
    const m = new Map()
    for (const i of aiidIncidents) m.set(i.aiid_id, i.ger_codes || [])
    return m
  }, [aiidIncidents])

  const aiidHits = useMemo(() => {
    const q = aiidQuery.trim().toLowerCase()
    if (q.length < 2 || !aiidReady) return []
    const hits = []
    for (const i of aiidIncidents) {
      if (
        i.title.toLowerCase().includes(q) ||
        (i.deployer && i.deployer.toLowerCase().includes(q)) ||
        (i.developer && i.developer.toLowerCase().includes(q))
      ) {
        hits.push(i)
        if (hits.length >= 12) break
      }
    }
    return hits
  }, [aiidQuery, aiidReady, aiidIncidents])

  const filtered = useMemo(() => {
    let pool = codes
    if (selectedSymptoms.size > 0) {
      const cand = new Set()
      for (const idx of selectedSymptoms) for (const code of SYMPTOMS[idx].codes) cand.add(code)
      pool = pool.filter((c) => cand.has(c.code))
    }
    if (selectedTiers.size > 0) pool = pool.filter((c) => selectedTiers.has(c.tier))
    if (selectedTags.size > 0)
      pool = pool.filter((c) => Array.from(selectedTags).every((t) => (c.tags || []).includes(t)))
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      pool = pool.filter(
        (c) => c.code.includes(q) || c.name.toLowerCase().includes(q) || c.definition.toLowerCase().includes(q)
      )
    }
    return pool
  }, [codes, selectedSymptoms, selectedTiers, selectedTags, search])

  const toggle = (set, setSet, value) => {
    const next = new Set(set)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    setSet(next)
  }

  const resetAll = () => {
    setSelectedSymptoms(new Set())
    setSelectedTiers(new Set())
    setSelectedTags(new Set())
    setSearch("")
    setAiidQuery("")
  }

  const hasAnyFilter =
    selectedSymptoms.size > 0 || selectedTiers.size > 0 || selectedTags.size > 0 || search.trim().length > 0

  return (
    <div className="ger-lookup not-prose">
      <div className="mb-8">
        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-2">
          Does your case resemble one you've heard about?
        </label>
        <input
          type="text"
          value={aiidQuery}
          onChange={(e) => setAiidQuery(e.target.value)}
          placeholder="Type a case name — MrBeast, Tumbler Ridge, Air Canada…"
          className="w-full px-4 py-3 border border-neutral-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-700"
        />
        {aiidQuery.length >= 2 && aiidLoading && (
          <p className="mt-2 text-xs font-mono text-neutral-500">Loading incident database…</p>
        )}
        {aiidHits.length > 0 && (
          <ul className="mt-2 border border-neutral-200 rounded-md max-h-80 overflow-y-auto bg-white shadow-sm">
            {aiidHits.map((h) => {
              const matchedCodes = aiidCodeMap.get(h.aiid_id) || []
              return (
                <li key={h.aiid_id} className="px-4 py-3 border-b border-neutral-100 last:border-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm">{h.title}</span>
                    <a
                      href={`https://incidentdatabase.ai/cite/${h.aiid_id}`}
                      target="_blank"
                      rel="noopener"
                      className="text-xs font-mono text-neutral-500 hover:text-neutral-900 whitespace-nowrap"
                    >
                      AIID #{h.aiid_id} ↗
                    </a>
                  </div>
                  {matchedCodes.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {matchedCodes.map((m) => (
                        <a
                          key={`${h.aiid_id}-${m.code}`}
                          href={`/ger/codes/${m.code}`}
                          className="text-xs font-mono px-2 py-0.5 rounded bg-green-50 text-green-900 hover:bg-green-100"
                        >
                          → GER-{m.code} ({m.role})
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-neutral-500 italic">
                      No GER mapping yet.{" "}
                      <a href="/introduction/how-to-contribute" className="underline">
                        Help us map this case →
                      </a>
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside className="lookup-filters space-y-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-600 mb-3">Something happened?</p>
            <div className="space-y-1.5">
              {SYMPTOMS.map((s, idx) => (
                <label key={idx} className="flex items-start gap-2 text-sm cursor-pointer hover:text-green-900">
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.has(idx)}
                    onChange={() => toggle(selectedSymptoms, setSelectedSymptoms, idx)}
                    className="mt-1 flex-shrink-0"
                  />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-600 mb-3">Tier</p>
            <div className="space-y-1.5">
              {TIERS.map((t) => (
                <label key={t.slug} className="flex items-center gap-2 text-sm cursor-pointer hover:text-green-900">
                  <input
                    type="checkbox"
                    checked={selectedTiers.has(t.slug)}
                    onChange={() => toggle(selectedTiers, setSelectedTiers, t.slug)}
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-600 mb-3">Tag</p>
            <div className="flex flex-wrap gap-1.5">
              {FILTER_TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggle(selectedTags, setSelectedTags, t)}
                  className={`text-xs font-mono px-2 py-1 rounded-full transition-colors ${
                    selectedTags.has(t)
                      ? "bg-green-700 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {hasAnyFilter && (
            <button onClick={resetAll} className="text-xs text-neutral-500 hover:text-neutral-900 underline">
              Reset all filters
            </button>
          )}
        </aside>

        <div className="lookup-results">
          <div className="flex items-baseline justify-between mb-4">
            <p className="text-sm text-neutral-600">
              {codes.length === 0
                ? "Loading codes…"
                : filtered.length === codes.length
                ? `Showing all ${filtered.length} codes`
                : `${filtered.length} of ${codes.length} codes match`}
            </p>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Keyword in name or definition…"
              className="px-3 py-1.5 border border-neutral-300 rounded text-sm w-64"
            />
          </div>

          {filtered.length === 0 && codes.length > 0 ? (
            <div className="py-12 text-center text-neutral-500">
              <p className="mb-2">No codes match these filters.</p>
              <p className="text-sm">
                <a href="/introduction/how-to-contribute" className="underline">
                  Propose a new code →
                </a>
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filtered.map((c) => (
                <li key={c.code}>
                  <a
                    href={`/ger/codes/${c.code}`}
                    className="block border border-neutral-200 rounded-md p-4 hover:border-green-700 hover:bg-green-50/30 transition-colors"
                  >
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-mono text-sm font-semibold text-green-900">GER-{c.code}</span>
                      <span className="text-base text-neutral-900">{c.name}</span>
                      <span className="ml-auto text-xs font-mono uppercase tracking-wider text-neutral-500">
                        {c.tier}
                        {c.type === "documented" ? " · Documented" : ""}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 line-clamp-2">{c.definition}</p>
                    {c.tags && c.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.tags.slice(0, 5).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
