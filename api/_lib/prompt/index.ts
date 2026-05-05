import { identityFor } from "./identity.js";
import { LENGTH } from "./length.js";
import { DISCLOSURE } from "./disclosure.js";
import { CHALLENGE } from "./challenge.js";
import { ROUTING } from "./routing.js";
import { CONTRIBUTION } from "./contribution.js";
import { CANONICAL } from "./canonical.js";
import { INQUIRY } from "./inquiry.js";
import type { Product } from "./types.js";

const KB_HEADER = `# Knowledge base

Everything below is the canonical knowledge base for this turn. Cite specific URLs when routing. Never invent content not present here.

`;

export function buildSystemPrompt(kb: string, product: Product): string {
  return [
    identityFor(product),
    LENGTH,
    DISCLOSURE,
    CHALLENGE,
    ROUTING,
    CANONICAL,
    CONTRIBUTION,
    INQUIRY,
    KB_HEADER + kb,
  ].join("\n\n");
}
