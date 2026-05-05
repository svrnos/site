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

async function writeToNotion(args: Record<string, unknown>): Promise<{ ok: true; id: string }> {
  console.log("[contribute]", JSON.stringify(args));
  return { ok: true, id: `pending-${Date.now()}` };
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
        max_tokens: 1024,
        system,
        tools: [SUBMIT_TOOL],
        messages: turnMessages,
      });

      const toolUse = resp.content.find((b: any) => b.type === "tool_use") as any;
      if (!toolUse) {
        const text = resp.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
        return send(res, 200, { message: text, stop_reason: resp.stop_reason });
      }

      const result = await writeToNotion(toolUse.input);

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
