import Anthropic from "@anthropic-ai/sdk";
import { loadKnowledgeBundle } from "./_lib/kb";
import { buildSystemPrompt } from "./_lib/prompt";

const client = new Anthropic();

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

async function writeToNotion(_args: Record<string, unknown>): Promise<{ ok: true; id: string }> {
  // TODO: wire up Notion API call once NOTION_TOKEN + NOTION_DB_ID are set
  // For now, log to Vercel function logs so submissions are still captured during scaffold phase.
  console.log("[contribute]", JSON.stringify(_args));
  return { ok: true, id: `pending-${Date.now()}` };
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  const body = (await req.json()) as { messages: Msg[]; product?: "svrnos" | "kingsango" | "sim95" };
  const product = body.product ?? "svrnos";
  const messages = body.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), { status: 400 });
  }

  const kb = await loadKnowledgeBundle();
  const system = [
    {
      type: "text" as const,
      text: buildSystemPrompt(kb, product),
      cache_control: { type: "ephemeral" as const },
    },
  ];

  let turnMessages = [...messages];
  let safety = 0;

  while (safety++ < 4) {
    const resp = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system,
      tools: [SUBMIT_TOOL],
      messages: turnMessages,
    });

    const toolUse = resp.content.find((b) => b.type === "tool_use");
    if (!toolUse) {
      const text = resp.content.filter((b) => b.type === "text").map((b: any) => b.text).join("");
      return Response.json({ message: text, stop_reason: resp.stop_reason });
    }

    const result = await writeToNotion((toolUse as any).input);

    turnMessages = [
      ...turnMessages,
      { role: "assistant", content: resp.content as any },
      {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: (toolUse as any).id,
            content: JSON.stringify(result),
          },
        ] as any,
      },
    ];
  }

  return new Response(JSON.stringify({ error: "tool loop exceeded" }), { status: 500 });
}
