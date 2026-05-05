const WINDOW_MS = 60_000;
const PER_MINUTE = 10;
const HOUR_MS = 3_600_000;
const PER_HOUR = 60;

const hits = new Map<string, number[]>();

export function checkRateLimit(ip: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < HOUR_MS);

  const lastMinute = recent.filter((t) => now - t < WINDOW_MS).length;
  if (lastMinute >= PER_MINUTE) return { ok: false, retryAfterSec: 60 };
  if (recent.length >= PER_HOUR) return { ok: false, retryAfterSec: 3600 };

  recent.push(now);
  hits.set(ip, recent);
  return { ok: true };
}

export function clientIp(headers: Record<string, string | string[] | undefined>): string {
  const fwd = headers["x-forwarded-for"];
  if (typeof fwd === "string") return fwd.split(",")[0].trim();
  if (Array.isArray(fwd) && fwd.length) return String(fwd[0]).split(",")[0].trim();
  const real = headers["x-real-ip"];
  return typeof real === "string" ? real : "unknown";
}
