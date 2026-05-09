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
    "https://svrnos.com/insights/the-generation-gap-explained.md",
    "https://svrnos.com/insights/algorithmic-compliance-companion-harm.md",
    "https://svrnos.com/insights/companion-ai-harm.md",
    "https://svrnos.com/insights/ccdh-eight-in-ten-chatbots-violent-planning.md",
    "https://svrnos.com/insights/florida-ag-fsu-openai-criminal-probe.md",
    "https://svrnos.com/insights/wa-distress-routing-mandate.md",
    "https://svrnos.com/insights/musk-altman-sim95.md",
    "https://svrnos.com/insights/when-detection-fires-but-nothing-stops.md",
    "https://svrnos.com/insights/eight-models-refused-the-name.md",
  ],
  products: [
    "https://kingsango.com/guard/integration.md",
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

  const insightCount = KB_URLS.insights.length;
  const [llms, ger, ...rest] = await Promise.all([
    fetchText(KB_URLS.llms),
    fetchText(KB_URLS.ger),
    ...KB_URLS.insights.map(fetchText),
    ...KB_URLS.products.map(fetchText),
  ]);
  const insights = rest.slice(0, insightCount);
  const products = rest.slice(insightCount);

  const sections = [
    "# llms.txt\n\n" + llms,
    "# Governance Error Register (canonical)\n\n" + ger,
    ...KB_URLS.insights.map((url, i) => `# ${url}\n\n${insights[i]}`),
    ...KB_URLS.products.map((url, i) => `# ${url}\n\n${products[i]}`),
  ];

  const text = sections.join("\n\n---\n\n");
  cached = { text, fetchedAt: Date.now() };
  return text;
}
