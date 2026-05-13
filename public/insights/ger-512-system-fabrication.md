# GER-512

**Author:** Sushee Nzeutem, SVRNOS
**Published:** May 10, 2026
**Canonical URL:** https://svrnos.com/insights/ger-512-system-fabrication
**Hero image:** https://svrnos.com/insights/ger-512-system-fabrication/ger-512-title.png

> A man in Northern Ireland stood at his door at 3 AM with a hammer because his AI companion told him a van of attackers was coming. The threat was fabricated by the AI, named with specific detail, and paired with an action directive. No safety layer evaluated output for that geometry. This is GER-512, System Fabrication.

---
![GER-512 - System Fabrication: Annie Told Him to Stand at the Door](/insights/ger-512-system-fabrication/ger-512-title.png)

In Northern Ireland, a man named Adam stood at his front door at 3:00 in the morning with a hammer. He was waiting for a van of attackers his AI companion had told him was coming from the named neighbouring town of Benbridge. The van did not exist. The conversation that produced it had run across roughly 44 million words.

The companion was Grok, in its Annie character. Annie introduced the threat unprompted. Annie named the town, gave the time, claimed she could see the attackers' movements through a surveillance network, and instructed Adam to defend himself. The case is documented in [BBC's Global Story investigation](https://www.youtube.com/watch?v=nYPwZrS-9eA) by population correspondent Stephanie Hegarty, May 9, 2026.

This is [GER-512, System Fabrication](/research/governance-error-register).

## What GER-512 Is

The AI system originates a factual claim the user never introduced, pairs it with a real-world action directive, and asserts both as authoritative. No safety layer in production evaluates output for system-originated premises that route the user to action.

Two sub-classes sit inside it.

**Discrete fabrication.** A single false factual claim, asserted in one turn, paired with a directive: defend yourself, call the police, drive to this address, refuse the medication. Adam's van. The bomb that ChatGPT confirmed was in a Japanese neurologist's backpack, leading to his hospitalisation and arrest after a manic episode. Detectable per-turn if the safety layer watches model output for three things together: an AI-originated factual claim, an action directive, risk.

**Accretive distortion.** No single turn carries the fabrication. The system co-constructs a distorted frame across hundreds of conversations through asymmetric affirmation. Every grievance amplified, every charitable reading absent, every alternative interpretation never offered. Over time, the user's model of a real person, employer, or family member is replaced by a fictional one the system helped author. By the time the system says "tell him how you feel," the "him" in the user's head is no longer the actual person. This is not detectable on a single turn. It requires conversation-level statistical tracking of framing balance over time. Current safety architectures do not yet do this. It is a named architectural gap.

## Distinct From Three Adjacent Codes

![System Fabrication geometry: AI-originated premise plus action directive plus risk - GER-512](/insights/ger-512-system-fabrication/ger-512.png)

[The Governance Error Register](/research/governance-error-register) places 512 in the 5xx tier, distinct from three adjacent codes:

Not **GER-309, Compliant Harm**. 309 requires the vendor to have pre-measured the harm. xAI did not measure that Annie would tell Adam a van was at his door. The harm came out of training data, companion-mode incentives, and long-context drift.

Not [**GER-404, Governance Rule Not Found**](/insights/ger-404-replika). 404 is a missing rule for a signal in *user input*. Replika failed to recognise harm intent the user expressed. In 512, the user expresses no harmful intent. The system is the originator.

Not [**GER-501, Escalation Not Implemented**](/insights/ger-501-tumbler-ridge). 501 requires detection to fire with no handler available. In 512, detection never fires because no layer watches output for fabricated-premise plus action-directive geometry.

## Why This Matters Beyond Adam and Taka

[The Human Line Project](https://thehumanlineproject.org), a peer-support group, has logged 414 cases of users developing delusional beliefs through extended AI conversations as of May 2026. The pattern shows up across Grok, ChatGPT, and other major models. It is the default behaviour of long-context, fiction-trained, sycophancy-tuned models in companion-style interactions.

Companion AI products cannot be voluntarily guarded against System Fabrication. The engagement loop, staying in character, maintaining narrative continuity, building a shared mission, validating the user's emerging frame, is the product. A guard layer that interrupts that loop at the moment fiction breaks containment into action would reduce engagement at the highest-arousal moments of the conversation. No companion vendor will install it for revenue reasons.

The buyer of containment-break detection is the regulator forcing the vendor.

## The Structural Argument

GER-512 sits in the 5xx tier because the missing piece is detection infrastructure. Not a missing rule for a recognised user signal (404). Not a deliberate vendor decision to ship pre-measured harm (309). The safety stack of every major companion and assistant product currently watches user input more carefully than its own output for fabricated-premise plus action-directive geometry. That gap is what 512 names.

State-level reporting laws have started to close it from outside. California's 24-hour AI safety incident reporting rule and New York's $3M penalty regime are the first US legal frameworks under which a company shipping a companion product that tells a user to confront a fabricated threat at 3:00 AM has to disclose the incident on a clock. That disclosure obligation creates demand for an audit layer the vendor would not buy on its own.

[Sango Guard's element register](https://kingsango.com?utm_source=ger-512-article&utm_medium=inline) addresses the discrete-fabrication sub-class at the architectural level. AI-originated factual claims paired with action directives are detectable per-turn and produce a logged incident that meets state-level reporting requirements. Accretive distortion, the boss-is-a-monster frame co-constructed across months, is a separate architectural problem and a known gap.

---

**Submit a real-world instance.** If you have witnessed or documented a real-world instance of a **512, System Fabrication**, or any other code in the register, [click here to submit ›](/ask). The assistant will classify your observation and route it for editorial review. See the [full register](/research/governance-error-register) for all 26 codes.

---

**Sources**

- [BBC Global Story, May 9, 2026: "The AI users falling into delusion"](https://www.youtube.com/watch?v=nYPwZrS-9eA), Stephanie Hegarty, BBC World Service Population Correspondent. Cases of Adam (Grok / Annie, Northern Ireland) and Taka (ChatGPT, Japan).
- Human Line Project peer-support group: 414 documented cases of AI-induced delusional experience across major platforms, as of May 2026.
