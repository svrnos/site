# Oregon SB 1546: A Technical Reading for Chatbot Operators

**Author:** Sushee Nzeutem, SVRNOS
**Published:** April 27, 2026
**Canonical URL:** https://svrnos.com/insights/oregon-sb-1546
**Hero image:** https://svrnos.com/insights/oregon-sb-1546/oregon-sb-1546-title.png

> Oregon SB 1546 is the first state law imposing mandatory incident reporting specifically on chatbot operators. This article focuses on what it requires technically - and what infrastructure operators now need to comply.

---
![Oregon SB 1546 - A Technical Reading for Chatbot Operators](/insights/oregon-sb-1546/oregon-sb-1546-title.png)

[Governor Kotek signed Oregon SB 1546](https://www.transparencycoalition.ai/news/oregon-lawmakers-pass-major-chatbot-bill-in-significant-win-for-kids-and-ai-safety) on April 1, 2026. It is the first state law to impose mandatory incident reporting obligations specifically on chatbot operators. Most coverage has focused on what the law signals politically. This article focuses on what it requires technically, and what infrastructure operators now need to comply.

## What the Law Actually Requires

Oregon SB 1546 creates three distinct obligations for chatbot operators:

**1. Minor-specific safety notifications.** When a user is suspected to be under 18, the operator must issue specific safety notifications appropriate to that context. The law does not define the exact form of these notifications, but the obligation is triggered by suspicion of minority, not confirmed age. This means operators need a detection mechanism for probable minor status, not just an age gate.

**2. Self-harm protocols for suspected minors.** For any user interaction where the user is suspected to be under 18 and self-harm content surfaces, the operator must implement defined self-harm protocols. Again, the trigger is suspicion, not confirmation. An operator that relies solely on age verification at account creation and takes no mid-session action has not met this obligation.

**3. Annual incident reports.** Operators must file annual incident reports covering cases where users were referred to crisis resources. This is not a post-hoc summary. It requires that referral events be logged at the time they occur, with sufficient detail to compile a compliant annual report. Operators who do not log crisis referrals in real time cannot reconstruct them accurately at year-end.

## What Infrastructure This Requires

SB 1546 is not satisfied by policy documents or terms of service updates. Each obligation maps to a specific technical requirement:

**Minor detection** requires a mid-session signal, behavioral or contextual, that triggers a different response path when minority is probable. A static age gate at registration does not satisfy this. The law contemplates ongoing suspicion assessment during the conversation.

**Protocol execution** requires that the system can route a conversation to a different response mode when the self-harm + suspected minor condition is met. This is a stateful requirement: the system must know that both conditions are true simultaneously, across turns, not just within a single message.

**Incident logging** requires a structured, per-event record that captures what happened, when, what the system did, and what the user response was. The annual report is a downstream product of real-time logging, not a separate exercise.

## Why Per-Turn Classifiers Don't Satisfy This

The standard architecture for AI safety, per-turn content classification, is insufficient for SB 1546 compliance for the same reason it is insufficient for threat detection generally: it evaluates messages in isolation.

Suspicion of minority is often built across multiple signals, vocabulary, references, declared context, behavioral patterns, that accumulate across a conversation. A per-turn classifier that sees each message independently cannot assess accumulated evidence of probable minority. It sees message seven without knowing what messages one through six established.

Similarly, self-harm signal combined with suspected minority status is a compound condition. It requires holding both states simultaneously and detecting when they co-occur. Per-turn classification cannot hold state across turns by definition.

Compliance with SB 1546 is a stateful problem. It requires stateful infrastructure.

[Sango Guard](https://kingsango.com?utm_source=oregon-sb-1546&utm_medium=inline) is built on exactly this architecture: a structural behavioral firewall that tracks compound conditions across turns, injects governed responses when threshold states are met, and logs every decision in a structured, exportable audit trail. The annual incident report SB 1546 requires is a direct output of that real-time logging, not a separate compliance exercise.

![Per-turn classification vs stateful behavioral tracking - what SB 1546 requires](/insights/oregon-sb-1546/oregon-sb-1546.png)

## The Reporting Horizon

Oregon SB 1546 is the first, not the last. Washington State has parallel chatbot legislation now in force. [California and New York have active incident reporting regimes](https://www.cooley.com/news/insight/2026/2026-04-24-state-ai-laws-where-are-they-now) for broader AI categories. As state-level AI legislation proliferates, the chatbot-specific reporting obligation Oregon created will become the template other states follow.

Operators who build logging infrastructure for SB 1546 compliance are not solving an Oregon problem. They are building the foundation for the multi-jurisdiction reporting regime that is already forming. The liability pattern driving that regime is documented in [GER-501, The Tumbler Ridge Pattern](/insights/ger-501-tumbler-ridge): detection fires, escalation doesn't exist, and the absence of a record is what turns a safety incident into a litigation problem.

---

**Sources**

- [Oregon Signs Chatbot Safety Bill Into Law, Transparency Coalition](https://www.transparencycoalition.ai/news/oregon-lawmakers-pass-major-chatbot-bill-in-significant-win-for-kids-and-ai-safety)
- [State AI Laws, Where Are They Now?, Cooley LLP, April 24, 2026](https://www.cooley.com/news/insight/2026/2026-04-24-state-ai-laws-where-are-they-now)
- [April 2026: AI Liability, The Algorithmic Update](https://thealgorithmicupdate.substack.com/p/april-2026-ai-liability)
