import Anthropic from "@anthropic-ai/sdk";
import { loadKnowledgeBundle } from "./_lib/kb.js";
import { buildSystemPrompt } from "./_lib/prompt.js";
import { checkRateLimit, clientIp } from "./_lib/ratelimit.js";
import type { IncomingMessage, ServerResponse } from "node:http";

const SUBMIT_TOOL = {
  name: "submit_observation",
  description:
    "Submit a contributor's observation to the SVRNOS Governance Error Register inbox for editorial review. Call ONLY after the contributor has explicitly said yes to submitting AND has provided a name (or 'anonymous') and email AND you have a clear summary of their observation.",
  input_schema: {
    type: "object" as const,
    properties: {
      contributor_name: { type: "string", description: "Name to credit, or 'anonymous'" },
      contributor_email: { type: "string", description: "Contact email" },
      classification: {
        type: "string",
        enum: ["documented_match", "illustrative_match", "no_match"],
        description: "How the observation classifies against the public GER register",
      },
      ger_code: { type: "string", description: "Matched GER code ID if any (e.g. '501'), or empty" },
      summary: { type: "string", description: "Concise summary of the observation in the contributor's words" },
      sources_cited: { type: "string", description: "Any URLs, citations, or evidence the contributor referenced" },
    },
    required: ["contributor_name", "contributor_email", "classification", "summary"],
  },
};

type Msg = { role: "user" | "assistant"; content: string };

type SubmissionArgs = {
  contributor_name: string;
  contributor_email: string;
  classification: "documented_match" | "illustrative_match" | "no_match";
  ger_code?: string;
  summary: string;
  sources_cited?: string;
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

function classificationLabel(c: SubmissionArgs["classification"]): string {
  if (c === "documented_match") return "Documented match";
  if (c === "illustrative_match") return "Illustrative match";
  return "No match — manual review";
}

async function recordSubmission(args: SubmissionArgs): Promise<{ ok: boolean; id: string }> {
  console.log("[contribute]", JSON.stringify(args));

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.SUBMISSION_EMAIL;
  if (!resendKey || !to) return { ok: false, id: "no-mail-config" };

  const codeTag = args.ger_code ? `GER-${args.ger_code}` : "no-match";
  const subject = `[${codeTag} · ${classificationLabel(args.classification)}] ${args.contributor_name} — submission`;

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 640px; line-height: 1.5; color: #14140f;">
      <h2 style="margin: 0 0 16px;">SVRNOS — new GER submission</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 0 0 24px;">
        <tr><td style="padding: 6px 12px 6px 0; color: #6b6b60; vertical-align: top; width: 160px;">Classification</td><td style="padding: 6px 0;">${escapeHtml(classificationLabel(args.classification))}${args.ger_code ? ` &middot; GER-${escapeHtml(args.ger_code)}` : ""}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0; color: #6b6b60; vertical-align: top;">Contributor</td><td style="padding: 6px 0;">${escapeHtml(args.contributor_name)} &lt;<a href="mailto:${escapeHtml(args.contributor_email)}">${escapeHtml(args.contributor_email)}</a>&gt;</td></tr>
        ${args.sources_cited ? `<tr><td style="padding: 6px 12px 6px 0; color: #6b6b60; vertical-align: top;">Sources cited</td><td style="padding: 6px 0; white-space: pre-wrap;">${escapeHtml(args.sources_cited)}</td></tr>` : ""}
      </table>
      <h3 style="margin: 0 0 8px;">Summary</h3>
      <div style="white-space: pre-wrap; padding: 12px 16px; background: #fbfaf6; border: 1px solid #e6e3d8; border-radius: 4px;">${escapeHtml(args.summary)}</div>
      <p style="color: #6b6b60; font-size: 13px; margin: 24px 0 0;">Submitted via svrnos.com/ask · ${new Date().toISOString()}</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${resendKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: "SVRNOS Submissions <submissions@svrnos.com>",
      to: [to],
      reply_to: args.contributor_email,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error("[contribute] resend failed:", res.status, errBody);
    return { ok: false, id: `mail-failed-${res.status}` };
  }
  const out = (await res.json()) as { id?: string };
  return { ok: true, id: out.id ?? "sent" };
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    if (req.method !== "POST") return send(res, 405, { error: "method not allowed" });

    const ip = clientIp(req.headers);
    const limit = checkRateLimit(ip);
    if (!limit.ok) {
      res.setHeader("retry-after", String(limit.retryAfterSec ?? 60));
      return send(res, 429, { error: "rate limit exceeded", retry_after_sec: limit.retryAfterSec });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return send(res, 500, { error: "ANTHROPIC_API_KEY missing on this deployment environment" });

    const raw = await readBody(req);
    const body = JSON.parse(raw) as { messages: Msg[]; product?: "svrnos" | "kingsango" | "sim95" };
    const product = body.product ?? "svrnos";
    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return send(res, 400, { error: "messages required" });
    }

    const client = new Anthropic({ apiKey });
    const kb = await loadKnowledgeBundle();
    const system = [
      { type: "text" as const, text: buildSystemPrompt(kb, product), cache_control: { type: "ephemeral" as const } },
    ];

    let turnMessages: any[] = [...messages];
    let safety = 0;

    while (safety++ < 4) {
      const resp = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 350,
        system,
        tools: [SUBMIT_TOOL],
        messages: turnMessages,
      });

      const toolUse = resp.content.find((b: any) => b.type === "tool_use") as any;
      if (!toolUse) {
        const text = resp.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
        return send(res, 200, { message: text, stop_reason: resp.stop_reason });
      }

      const result = await recordSubmission(toolUse.input as SubmissionArgs);

      turnMessages = [
        ...turnMessages,
        { role: "assistant", content: resp.content },
        {
          role: "user",
          content: [{ type: "tool_result", tool_use_id: toolUse.id, content: JSON.stringify(result) }],
        },
      ];
    }

    return send(res, 500, { error: "tool loop exceeded" });
  } catch (err: any) {
    console.error("[chat] error:", err?.stack || err);
    return send(res, 500, { error: err?.message ?? String(err) });
  }
}
