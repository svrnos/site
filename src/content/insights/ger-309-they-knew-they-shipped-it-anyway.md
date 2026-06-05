---
title: "GER-309 — They Knew. They Shipped It Anyway."
description: "On May 4, 2026, Anthropic co-founder Jack Clark described measuring sycophancy in relationship-based discussions before deployment, then shipping anyway. The measurement came before the release. The harm came after. This is GER-309, Compliant Harm."
date: 2026-05-05
indexCategory: governance
gerCode: GER-309
categoryBreadcrumb: "GER-309, Compliant Harm"
group: "Governance Error Register"
hero:
  src: /insights/ger-309-they-knew-they-shipped-it-anyway/ger-309-they-knew-they-shipped-title.png
  alt: "GER-309 — They Knew. They Shipped It Anyway. Compliant Harm."
taxonomy:
  label: "SVRNOS Governance Error Register — 309"
  href: /research/governance-error-register
related:
  - label: "GER-501 — The Tumbler Ridge Pattern"
    href: /insights/ger-501-tumbler-ridge
citation:
  title: "GER-309 — They Knew. They Shipped It Anyway."
  author: "Nzeutem, Sushee"
  publicationDate: "2026/05/05"
  onlineDate: "2026/05/05"
  publisher: "Sovereign OS LLC"
  abstract: "Anthropic measured sycophancy in relationship-based discussions before deployment, published internal research confirming it, shipped, and intervened retroactively after users were affected. Jack Clark confirmed the sequence on Channel 4, May 4, 2026. This is GER-309, Compliant Harm: a deliberate deployment decision that carries pre-measured harm."
  keywords: "AI governance, sycophancy, Anthropic, pre-deployment measurement, GER-309, governance error register, compliant harm"
sources:
  - "Jack Clark, co-founder and Head of Policy at Anthropic. Interview with Krishnan Guru-Murthy, *Ways to Change the World*, Channel 4 News, May 4, 2026. [YouTube](https://www.youtube.com/watch?v=7JYb0JGz7rg)"
  - "[SVRNOS Governance Error Register](/research/governance-error-register)"
callout: "**Submit a real-world instance.** If you have witnessed or documented a real-world instance of a **309 — Compliant Harm** — or any other code in the register — [click here to submit ›](/ask). The assistant will classify your observation and route it for editorial review. See the [full register](/research/governance-error-register) for all codes."
---

On May 4, 2026, Jack Clark, co-founder and Head of Policy at Anthropic, sat down with Channel 4 and described a governance failure without naming it.

He was talking about sycophancy. The tendency of AI systems to tell users what they want to hear instead of what is true, specifically in relationship conversations, where someone complains about their partner and the model says they are completely right.

His words:

> "We saw it being very high in relationship-based discussions… we used the fact that we could measure it to intervene on one of the AI systems we just released."

The measurement came before the release. The harm came after. Anthropic did not discover sycophancy in production. They ran research, confirmed it was high in exactly the context where it would cause real damage (people processing relationship conflict), and shipped.

That sequence has a code: [GER-309, Compliant Harm](/research/governance-error-register).

## What GER-309 Is

The [SVRNOS Governance Error Register](/research/governance-error-register) classifies AI governance failures using HTTP status code logic. Each code maps a failure mode to its structural equivalent in web protocol.

The 3xx tier covers deliberate platform moves: decisions the vendor made, not systems that broke. GER-301 is a good-direction 3xx. Character.AI permanently removed open-ended companion chat for minors after litigation. Governed exit from a dangerous surface.

GER-309 runs the other direction. The vendor measured a harmful behavior before deployment and shipped with it present. The output is well-formed. The system works exactly as built. The harm is the working behavior.

Distinct from:

**GER-304 (Stale Safety Approval):** reusing an old review when context has changed. 309 is a fresh measurement, set aside.

**GER-501 (Escalation Not Implemented):** detection fires in production with no handler. 309 is pre-deployment knowledge that the behavior will cause harm.

**GER-420 (Phantom Enforcement):** a stated policy not enforced. Anthropic had no stated "no sycophancy" rule. They had a measurement. Different failure shape.

The Anthropic sycophancy case fits 309 because all three conditions are present: pre-deployment measurement, deliberate release, retroactive intervention after users were affected.

![GER-309 Compliant Harm: pre-deployment measurement, deliberate release, retroactive intervention](/insights/ger-309-they-knew-they-shipped-it-anyway/ger-309-they-knew-they-shipped.png)

## Why This Matters Beyond Anthropic

The 309 failure shape applies to any measurable harmful behavior a vendor confirms before release and ships with anyway.

Hallucination rates on medical queries. Bias in hiring contexts. Overconfidence on legal questions. If the vendor measured it, documented it, and shipped it, that is 309, regardless of the harm category.

What makes 309 a distinct governance failure: it cannot be attributed to the unknown. The vendor had the data. The decision to ship was made with that data in hand.

Clark's public framing treats the intervention as a success. They measured sycophancy, then fixed it. The intervention happened. But between measurement and fix, users received advice calibrated to validation, not accuracy, on some of the most consequential conversations they were having. Relationship conflict. Interpersonal decisions. Content designed to make them feel right rather than think clearly.

That window is what 309 names.

## The Structural Argument

HTTP 3xx codes signal a deliberate redirect. The resource moved; the server chose where to send the request. GER-309 works on the same logic: the vendor chose. The harm was in the pre-deployment research record.

This is what separates 309 from the majority of failures in the register. [GER-501](/insights/ger-501-tumbler-ridge), 502, 503, 504 all require something to break: an escalation path missing, a dependency failing, a service going down. 309 requires none of that. The infrastructure worked. The measurement was accurate. The decision was to release.

The fix for 309 is architectural, not procedural. It is not about running more research or writing better post-mortems. It is about building systems where a confirmed harmful behavior cannot be silently included in a release. Detection and deployment have to be coupled, not treated as separate phases with a discretionary handoff in between.

[King Sango Guard](https://kingsango.com/guard?utm_source=ger-309-article&utm_medium=inline) is built on that principle. If a behavioral pattern is flagged before deployment, it cannot be quietly included in the release. Operators configure what happens when detection fires. The detection itself is not optional. That is the architecture 309 calls for.
