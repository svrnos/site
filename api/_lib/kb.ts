// The /ask bot knowledge bundle. Insight + research markdown URLs are derived
// from llms.txt (itself generated from the content collection), so adding an
// article requires NO change here — it flows: collection -> llms.txt -> bot.
const KB_URLS = {
  llms: "https://svrnos.com/llms.txt",
  ger: "https://svrnos.com/research/governance-error-register.md",
  products: ["https://kingsango.com/guard/integration.md"],
};

let cached: { text: string; fetchedAt: number } | null = null;
const TTL_MS = 1000 * 60 * 30;

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "user-agent": "svrnos-bot/0.1" } });
  if (!res.ok) throw new Error(`fetch ${url}: ${res.status}`);
  return await res.text();
}

async function safeFetch(url: string): Promise<{ url: string; text: string } | null> {
  try {
    return { url, text: await fetchText(url) };
  } catch {
    return null; // a missing alternate must not break the bot
  }
}

/** Pull every svrnos.com markdown alternate referenced in llms.txt. */
function contentMdUrls(llms: string, exclude: string[]): string[] {
  const set = new Set<string>();
  for (const m of llms.matchAll(/\((https:\/\/svrnos\.com\/[^\s)]+\.md)\)/g)) {
    set.add(m[1]);
  }
  return [...set].filter((u) => !exclude.includes(u));
}

export async function loadKnowledgeBundle(): Promise<string> {
  if (cached && Date.now() - cached.fetchedAt < TTL_MS) return cached.text;

  const [llms, ger] = await Promise.all([
    fetchText(KB_URLS.llms),
    fetchText(KB_URLS.ger),
  ]);

  const urls = contentMdUrls(llms, [KB_URLS.ger]);
  const [content, products] = await Promise.all([
    Promise.all(urls.map(safeFetch)),
    Promise.all(KB_URLS.products.map(safeFetch)),
  ]);

  const sections = [
    "# llms.txt\n\n" + llms,
    "# Governance Error Register (canonical)\n\n" + ger,
    ...content.filter(Boolean).map((c) => `# ${c!.url}\n\n${c!.text}`),
    ...products.filter(Boolean).map((c) => `# ${c!.url}\n\n${c!.text}`),
  ];

  const text = sections.join("\n\n---\n\n");
  cached = { text, fetchedAt: Date.now() };
  return text;
}
