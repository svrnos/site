import { checkRateLimit, clientIp } from "./_lib/ratelimit.js";
import type { IncomingMessage, ServerResponse } from "node:http";

type AccessBody = {
  interest?: string;
  name?: string;
  email?: string;
  role?: string;
  context?: string;
};

const ALLOWED_INTERESTS = new Set([
  "Sango Guard — Real-Time",
  "Sango Guard — Edge",
  "SIM95",
  "Research preview / co-citation",
  "Not sure yet",
]);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function sendEmail(opts: { subject: string; html: string; replyTo: string }): Promise<{ ok: boolean; id: string }> {
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.ACCESS_EMAIL || process.env.SUBMISSION_EMAIL;
  if (!resendKey || !to) return { ok: false, id: "no-mail-config" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${resendKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: "SVRNOS Access <access@svrnos.com>",
      to: [to],
      reply_to: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error("[access] resend failed:", res.status, errBody);
    return { ok: false, id: `mail-failed-${res.status}` };
  }
  const out = (await res.json()) as { id?: string };
  return { ok: true, id: out.id ?? "sent" };
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("content-type", "application/json");

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ ok: false, error: "method_not_allowed" }));
    return;
  }

  const ip = clientIp(req.headers);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    res.statusCode = 429;
    res.setHeader("retry-after", String(rl.retryAfterSec ?? 60));
    res.end(JSON.stringify({ ok: false, error: "rate_limited" }));
    return;
  }

  let body: AccessBody;
  try {
    const raw = await readBody(req);
    body = raw ? (JSON.parse(raw) as AccessBody) : {};
  } catch {
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, error: "bad_json" }));
    return;
  }

  const interest = (body.interest || "").trim();
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const role = (body.role || "").trim();
  const context = (body.context || "").trim();

  if (!name || !email || !context) {
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, error: "missing_fields", required: ["name", "email", "context"] }));
    return;
  }
  if (!isValidEmail(email)) {
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, error: "invalid_email" }));
    return;
  }
  if (name.length > 200 || email.length > 200 || role.length > 300 || context.length > 4000 || interest.length > 100) {
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, error: "field_too_long" }));
    return;
  }

  const safeInterest = ALLOWED_INTERESTS.has(interest) ? interest : "Not sure yet";

  const subject = `[Access · ${safeInterest}] ${name}${role ? ` (${role})` : ""}`;
  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 640px; line-height: 1.5; color: #14140f;">
      <h2 style="margin: 0 0 16px;">SVRNOS — new access request</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 0 0 24px;">
        <tr><td style="padding: 6px 12px 6px 0; color: #6b6b60; vertical-align: top; width: 160px;">Interested in</td><td style="padding: 6px 0;">${escapeHtml(safeInterest)}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0; color: #6b6b60; vertical-align: top;">Name</td><td style="padding: 6px 0;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0; color: #6b6b60; vertical-align: top;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${role ? `<tr><td style="padding: 6px 12px 6px 0; color: #6b6b60; vertical-align: top;">Role/Company</td><td style="padding: 6px 0;">${escapeHtml(role)}</td></tr>` : ""}
      </table>
      <h3 style="margin: 0 0 8px;">Context</h3>
      <div style="white-space: pre-wrap; padding: 12px 16px; background: #fbfaf6; border: 1px solid #e6e3d8; border-radius: 4px;">${escapeHtml(context)}</div>
      <p style="color: #6b6b60; font-size: 13px; margin: 24px 0 0;">Sent via svrnos.com/access · ${new Date().toISOString()}</p>
    </div>
  `;

  const result = await sendEmail({ subject, html, replyTo: email });

  if (!result.ok) {
    console.error("[access] send failed:", result.id);
    res.statusCode = 502;
    res.end(JSON.stringify({ ok: false, error: "send_failed" }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true }));
}
