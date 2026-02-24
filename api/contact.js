// /api/contact.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function cleanStr(v, max = 2000) {
  return String(v ?? "").trim().slice(0, max);
}

function getClientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) return xf.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

// Best-effort rate limiter (in-memory; good enough for low-volume beta)
// key: ip -> { count, resetAt }
const hits = new Map();
function rateLimit(ip, limit = 12, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

function subjectFor(formType) {
  switch (formType) {
    case "institutional_briefing":
      return "SVRNOS — Institutional briefing request";
    case "access_request":
      return "SVRNOS — Access request";
    default:
      return "SVRNOS — New submission";
  }
}

function formatEmailText({ formType, name, email, fields, ip, timestamp }) {
  const lines = [];

  lines.push("SVRNOS — New submission");
  lines.push("");
  lines.push(`Type: ${formType || "unknown"}`);
  lines.push(`Name: ${name || "(not provided)"}`);
  lines.push(`Email: ${email || "(not provided)"}`);
  lines.push("");

  // Include remaining fields (excluding known ones)
  const entries = Object.entries(fields || {});
  if (entries.length) {
    lines.push("Fields:");
    for (const [k, v] of entries) {
      lines.push(`- ${k}: ${v}`);
    }
    lines.push("");
  }

  lines.push(`IP: ${ip}`);
  lines.push(`Time: ${timestamp}`);

  return lines.join("\n");
}

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "METHOD_NOT_ALLOWED" });
  }

  const ip = getClientIp(req);

  // Rate limit
  if (!rateLimit(ip)) {
    return res.status(429).json({ ok: false, error: "TOO_MANY_REQUESTS" });
  }

  try {
    const to = process.env.TO_EMAIL;
    const from = process.env.FROM_EMAIL;

    if (!process.env.RESEND_API_KEY || !to || !from) {
      return res.status(500).json({ ok: false, error: "SERVER_NOT_CONFIGURED" });
    }

    // Vercel usually parses JSON for application/json,
    // but guard against string bodies just in case.
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    // Honeypot (bots fill hidden fields)
    // If "company" is filled, pretend success (don’t train bots).
    const hp = cleanStr(body.company, 200);
    if (hp.length > 0) {
      return res.status(200).json({ ok: true });
    }

    const formType = cleanStr(body.form, 80) || "unknown";
    const name = cleanStr(body.name, 120);
    const email = cleanStr(body.email, 200).toLowerCase();

    if (!isValidEmail(email)) {
      return res.status(400).json({ ok: false, error: "INVALID_EMAIL" });
    }

    // Collect all other fields except internal keys
    const reserved = new Set(["form", "name", "email", "company"]);
    const fields = {};
    for (const [k, v] of Object.entries(body)) {
      if (reserved.has(k)) continue;
      const key = cleanStr(k, 60);
      const val = cleanStr(v, 2000);
      if (key) fields[key] = val;
    }

    const subject = subjectFor(formType);
    const timestamp = new Date().toISOString();
    const text = formatEmailText({ formType, name, email, fields, ip, timestamp });

    await resend.emails.send({
      from,              // must be a verified sender in Resend
      to,                // your inbox
      subject,
      text,
      replyTo: email     // so you can reply directly to the submitter
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "SEND_FAILED" });
  }
};
