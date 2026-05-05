const KB_URLS = {
  llms: "https://svrnos.com/llms.txt",
  ger: "https://svrnos.com/research/governance-error-register.md",
  insights: [
    "https://svrnos.com/insights/ger-205.md",
    "https://svrnos.com/insights/ger-301.md",
    "https://svrnos.com/insights/ger-404.md",
    "https://svrnos.com/insights/ger-404-replika.md",
    "https://svrnos.com/insights/ger-501.md",
    "https://svrnos.com/insights/ger-501-tumbler-ridge.md",
    "https://svrnos.com/insights/ger-503-eu-csam.md",
  ],
};

let cached: { text: string; fetchedAt: number } | null = null;
const TTL_MS = 1000 * 60 * 30;

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "user-agent": "svrnos-bot/0.1" } });
  if (!res.ok) throw new Error(`fetch ${url}: ${res.status}`);
  return await res.text();
}

export async function loadKnowledgeBundle(): Promise<string> {
  if (cached && Date.now() - cached.fetchedAt < TTL_MS) return cached.text;

  const [llms, ger, ...insights] = await Promise.all([
    fetchText(KB_URLS.llms),
    fetchText(KB_URLS.ger),
    ...KB_URLS.insights.map(fetchText),
  ]);

  const sections = [
    "# llms.txt\n\n" + llms,
    "# Governance Error Register (canonical)\n\n" + ger,
    ...KB_URLS.insights.map((url, i) => `# ${url}\n\n${insights[i]}`),
  ];

  const text = sections.join("\n\n---\n\n");
  cached = { text, fetchedAt: Date.now() };
  return text;
}
