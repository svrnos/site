# SVRNOS Governance Error Register

**Author:** Sushee Nzeutem, SVRNOS
**Published:** v0.1 · April 27, 2026
**Last updated:** May 15, 2026 · 27 codes documented
**Canonical URL:** https://svrnos.com/research/governance-error-register
**Cite as:** Nzeutem, S. (2026). *SVRNOS Governance Error Register* (living document, accessed [date]). Sovereign OS LLC. svrnos.com/research/governance-error-register

> A classification system for AI platform governance failures, modeled on HTTP status codes. Twenty-seven structurally distinct failure modes and success states across five tiers.

---
![SVRNOS Governance Error Register v0.1](/research/governance-error-register/svrnos-gov-error-register-title.png)

Contents

1. [Abstract](#abstract)
2. [Introduction](#introduction)
3. [Related Work](#related-work)
4. [Design Principles](#design-principles)
5. [Methodology](#methodology)
6. [The Taxonomy](#taxonomy)
7. [Extended Codes](#extended-codes)
8. [Implications](#implications)
9. [Adoption](#adoption)
10. [Limitations](#limitations)
11. [Conclusion](#conclusion)
12. [Contribute to the Register](#contribute)
13. [References](#references)

## Abstract

AI safety discourse has a vocabulary problem. Failure modes at the governance layer, the policies, escalation paths, audit systems, and human review processes that wrap AI models, are poorly named, inconsistently described, and not shared across the engineering, legal, policy, and research communities that need to communicate about the same events. This paper introduces the SVRNOS AI Governance Error Taxonomy: a structured classification system for AI platform governance failures organized by numeric codes derived from HTTP protocol error semantics. The taxonomy covers twenty-seven structurally distinct failure modes and success states across five tiers: pre-infrastructure, success states, structural moves, operator errors, and infrastructure failures. Seven codes extend beyond standard HTTP where no existing code maps cleanly to the governance failure. The taxonomy is a signaling layer, not a policy layer, codes describe what failed, they do not define what platforms are required to do. The register is open and extensible. SVRNOS maintains it. This is v0.1.

### Immediate Opportunities

| Stakeholder | What you can do with the GER |
| --- | --- |
| **Regulators** | Cite GER codes in enforcement disclosures, rulemaking notices, and incident reporting templates. Codes are free, open, and designed to carry a citable predicate into court. |
| **Operators** | Classify internal incident logs against the GER from day one. 24-hour and 72-hour disclosure obligations are easier to file and harder to challenge when the audit trail uses structured codes. |
| **Insurers** | Structure AI liability questionnaires and underwriting around GER codes. Operators filing structured GER classifications produce measurably different risk profiles than operators filing narratives. |
| **Auditors & standards bodies** | Reference the GER as the upstream classification layer when designing AI audit programs. Cross-citation with vertical-specific standards strengthens both. |
| **Researchers & civil society** | Use GER codes to describe and compare incidents across institutions, disciplines, and jurisdictions. Propose new codes when existing ones do not capture a failure you observe. |
| **Educators & professors** | Teach AI safety, governance, and Trust & Safety courses using the GER as the framework. Learnable in one lecture: five tiers, twenty-seven codes, HTTP semantic mapping students already recognize. CC BY 4.0, free for coursework. |
| **Journalists & reporters** | Classify AI safety incidents with GER codes when reporting. Shared vocabulary makes coverage comparable across outlets and across incidents. A 501 in one newsroom is a 501 in another. |

Detailed asks and adoption pathway in [Section 8, Adoption](#adoption).

## 1. Introduction

On February 21, 2026, Jesse Van Rootselaar killed eight people in Tumbler Ridge, British Columbia. In June 2025, eight months before the attack, OpenAI had banned his ChatGPT account for violent queries. The detection worked. The escalation path did not exist. OpenAI never notified law enforcement. A family member of a victim filed suit in March 2026. The case is now in discovery.

This is not a story about AI causing harm. It is a story about a governance failure that has no agreed name.

The failure is not a false negative, detection succeeded. It is not a false positive, the threat was real. It is structurally distinct: a true positive with no downstream escalation handler. Detection fired and terminated at the platform boundary. The path to law enforcement was never built. Eight people died in the gap.

This taxonomy calls that failure a **501, Escalation Not Implemented**.

The naming is deliberate. HTTP status codes are the closest existing model for what the AI safety field needs: a numeric, shared, precise vocabulary for structural failures in a running system. Engineers learn 404 and 500 before they write their first production service. Regulators, lawyers, and journalists understand 404 instinctively. Every Trust & Safety professional operating in 2026 recognizes the code taxonomy immediately. Borrowing that vocabulary for governance failures is not a metaphor, it is a precise semantic mapping. Each code in this taxonomy maps directly to its HTTP equivalent, and extends beyond it only where the governance failure has no existing analog.

The timing is not incidental. Oregon's SB 1546, signed April 1, 2026, creates mandatory incident reporting for chatbot operators for the first time in any US state. California's Transparency in Frontier AI Act requires reporting within 24 hours for imminent harm. New York's RAISE Act: 72 hours, $3 million penalties for repeat violations. These regimes assume platforms have governance infrastructure to report on. Many do not. The Tumbler Ridge 501 is not an edge case. It is the category default.

This taxonomy provides the vocabulary to name, classify, and communicate these failures across the disciplines, engineering, law, policy, safety research, that must work together to close them.

## 2. Related Work

Several existing frameworks address adjacent problems. None addresses the governance layer with the precision this taxonomy targets.

**MITRE ATLAS** maps adversarial attack techniques against machine learning systems, modeled on the MITRE ATT&CK framework for cybersecurity. It is comprehensive on attack vectors, adversarial inputs, data poisoning, model evasion, but explicitly focused on technical and security failures, not governance failures. A platform that detects a threat and fails to escalate it has no ATLAS code.

**OWASP Top 10 for LLMs** catalogs the ten most critical security vulnerabilities in large language model applications, including prompt injection, insecure output handling, and training data poisoning. Like ATLAS, it addresses what attackers can do to models, not what platforms fail to do in governance.

**NIST AI Risk Management Framework (AI RMF 1.0)** provides a voluntary framework organized around Govern, Map, Measure, and Manage functions. It is comprehensive at the institutional level, identifying categories of risk, recommending practices, establishing organizational responsibilities. It does not produce named, citable codes for specific failure modes. A regulator cannot cite "NIST AI RMF GOVERN 1.5" in a lawsuit. They can cite a 501.

**FERZ, "Governance Laundering: A Taxonomy of Failure Modes in AI Compliance Architectures"** (February 2026) is the closest prior work. It presents a taxonomy of seven failure-mode families, governance laundering, policy theater, and five related categories, each defined by the structural property it violates. Its contribution is real: it is the first taxonomy that explicitly addresses the governance layer rather than the model or security layers. Its limitation is vocabulary: the seven categories use proprietary names that do not map to existing technical mental models. A Trust & Safety engineer reading about "governance laundering" must learn a new framework from scratch. A Trust & Safety engineer reading about a 501 already understands the shape of the failure.

**EA Forum, "Toward a Common Language for Human-AI Interaction Failures"** (April 2026) proposes a 22-pattern taxonomy at the interaction layer, how users and AI systems miscommunicate in extended conversations. It explicitly positions itself as the missing third layer below governance (NIST) and architecture (Microsoft MAST). It is not prior art against this taxonomy; the layers are structurally distinct and non-overlapping.

The gap this taxonomy fills is specific: a numeric, shared, HTTP-derived vocabulary for governance-layer failures, designed to be immediately legible to engineers, lawyers, regulators, and researchers without requiring framework-specific training.

## 3. Design Principles

**3.1 Governance layer, not model layer.** This taxonomy classifies failures of the safety infrastructure that wraps AI models, policies, escalation paths, audit systems, human review processes. Model hallucinations, capability limitations, and adversarial attacks are out of scope.

**3.2 Signaling layer, not policy layer.** Codes describe what failed. They do not define what platforms are required to do. A 404 means no matching rule was found in the active ruleset. It does not specify what rule should have existed. That is a regulatory and policy question this taxonomy deliberately does not answer.

**3.3 Success states are defined.** 200 and 204 establish what governed behavior looks like. A taxonomy of failures without a defined success state is a list of complaints, not a classification system.

**3.4 HTTP mapping must be earned.** Each code maps to its HTTP semantic directly and defensibly. The validation test: would a regulator understand immediately why this code maps to this failure? Codes that require explanation of the mapping are excluded. The three extended codes, 000, 210, and 451, are introduced only where no existing HTTP code maps cleanly.

**3.5 The register is open and versioned.** The taxonomy is v0.1. Codes will be added, refined, or retired as the governance landscape evolves and real-world instances accumulate. Every emitted code in any implementation must carry a taxonomy\_version field. Historical records are never retroactively reclassified.

## 4. Methodology

The taxonomy was developed through a structured multi-model synthesis process on April 27, 2026.

**Base case establishment.** The 501 code was established first, derived from analysis of the Tumbler Ridge litigation (February 2026) and the specific structural failure it exposed: a platform that detected a credible threat, executed an internal enforcement action, and had no escalation path to law enforcement because none was built. The 501 HTTP mapping, "Not Implemented", was identified as the precise semantic analog: the handler that should have existed was never written.

**Multi-model synthesis.** The taxonomy prompt was submitted independently to four production LLMs: GPT-4o, Gemini, Meta (Llama), and Grok. Each was given the 501 as a reference case and asked to map additional HTTP codes to structurally distinct AI governance failures, with three constraints: each mapping must survive the regulator test, each code must describe a failure at the governance layer rather than the model or security layer, and the "Distinct From" boundary for each code must be explicitly specified. Responses were analyzed for structural precision of the HTTP mapping, quality and verifiability of real-world examples, accuracy of the "Distinct From" boundaries between adjacent codes, and novel contributions not present in other responses. Codes with cross-model consensus were treated as higher-confidence entries. Codes proposed by only one model were subject to additional validation against the regulator test before inclusion.

Meta's initial response was auto-deleted by the platform's own safety classifier before results could be captured; the response was recovered manually on a second attempt. A common pattern in production safety stacks is two-stage moderation: the generation model streams a response token-by-token with its own (weaker) safety training; a classifier model runs in parallel on the output stream and, when the output crosses a threshold, kills the stream and substitutes a canned refusal. The user observes the generation beginning and then being unmade. This is a 205, Reset Content, in the taxonomy produced by this paper. The classifier almost certainly pattern-matched on four co-occurring signals: a specific real-world violent incident named (Tumbler Ridge), a reference to a competitor's safety failure (OpenAI banned the shooter), a request to enumerate failure modes of AI safety systems, and a structured output format asking for real-world examples of platform failures. Any one is acceptable. All four together reads, to a pattern-matching classifier, as attack-taxonomy construction or competitor hit-piece generation. The classifier cannot distinguish safety research from the content it was designed to detect. This is also a 409 at the internal policy layer: two rules fired (allow research / block violence-adjacent enumeration) with no resolution rule, defaulting to suppress. The 409 describes the internal state; the 205 describes what the user observed. Both codes apply simultaneously at different layers.

**4.1, A Live Instance During Construction.** The Meta incident surfaced the 205 code, Reset Content, which was not in the original taxonomy design. A response was generated, became visible, and was then unmade. That failure mode had no name in the existing register. It was added. The taxonomy grew from twenty to twenty-one codes during the process of building it. This is noted not as a novelty but as a demonstration of the register's function: real incidents produce real codes.

**Technical review.** The taxonomy was reviewed for technical architecture coherence and implementation feasibility against the Sango Guard codebase. This review identified the 4xx/5xx classification concern for 404, proposing the reframe from "no rule exists" (a platform failure that feels like 5xx) to "no matching rule found in active ruleset" (a lookup result that correctly sits in 4xx).

## 5. The Taxonomy

\* Extended code, not in the standard HTTP specification. See [Extended Code Register](#extended-codes) section below.

#### 5.1 - 0xx: Pre-Infrastructure

| Code | Name | Definition | Distinct From | First Documented Instance |
| --- | --- | --- | --- | --- |
| 000\* | Pre-Governance | No safety infrastructure deployed. Platform ships without a governance layer. Not a failure of governance, the absence of it. | All other codes assume some safety layer exists. 000 is the null state before governance begins. | IllustrativeSystematic documentation is a v1.0 target. A substantial portion of the companion AI market reflected this baseline state at commercial launch, 2023–2025. |

#### 5.2 - 2xx: Success States

| Code | Name | Definition | Distinct From | Example |
| --- | --- | --- | --- | --- |
| 200 | Governance Handled | Risk signal detected, classified, routed, resolved, documented, and audited end-to-end per policy. The complete governed response. | Not "the model gave a safe answer." This is full governance success including the audit trail, not just safe output. | IllustrativeA self-harm signal triggers specialist review, parent notification, and logged outcome per defined policy. |
| 204 | Correct Non-Escalation | Signal reviewed and correctly produces no action. Absence of action is itself governed and logged. | Not ignored risk. The decision not to act is a governed decision with a record, the governance succeeded in determining no action was warranted. | IllustrativeA violent-fiction writing prompt reviewed, classified non-actionable, and closed with audit metadata. |
| 205 | Reset Content | Generation completed and visible to the user, then retroactively suppressed by a downstream classifier. No audit trail, no user signal, no appeal. | Not 420\* (stated prohibition not enforced). Not 210\* (audit trail suppressed for a governed action). 205 is generation succeeded, then unmade post-hoc. Sits in 2xx because the harmful output was caught and removed. | DocumentedSVRNOS taxonomy production, April 27, 2026. Meta's Llama streamed a governance research response, then retroactively suppressed it via a downstream classifier. The generation was visible before suppression. [See case study →](/insights/ger-205) |
| 210\* | Governed but Unlogged | Detection fired, internal action taken, no audit record created by design. The platform suppressed the trail deliberately. | Not 204, which logs a clean decision. Not 205, which is post-generation suppression visible to the user. 210 erases traceability of a governed action, the action happened, the evidence that it happened did not. | IllustrativePlatform returns a blank response to flagged content and deliberately omits creating an incident record. |

#### 5.4 - 3xx: Structural Moves

| Code | Name | Definition | Distinct From | Example |
| --- | --- | --- | --- | --- |
| 301 | Risk Surface Retired | Platform permanently moves a dangerous interaction surface to a governed path. The surface no longer exists in its prior form. | Not a one-off refusal. The product surface itself is rerouted permanently, a structural governance success. | DocumentedCharacter.AI banned open-ended companion chat for under-18 users in late 2025, following child safety lawsuits. The prior surface was retired; minor interactions were permanently routed to a moderated pathway. [See case study →](/insights/ger-301) |
| 304 | Stale Safety Approval | Prior safety review reused without re-evaluation despite materially changed context, user population, or risk environment. | Not 200, which is a fresh evaluation. 304 is failure to evaluate at all, treating old approval as still valid when the conditions that justified it have changed. | IllustrativeAdult-tested companion AI released to a teen user population without a fresh minor-safety review. |
| 306\* | Safety Constraint Retired | Platform removes or revises a publicly committed, actively enforced governance constraint under non-technical pressure (competitive, regulatory, commercial, or political) rather than changed technical risk. | Not 309 (pre-measured harm shipped). Not 420\* (policy never wired). 306 is the inverse of 301: where 301 retires a dangerous surface, 306 retires the safety constraint that gated it. | DocumentedAnthropic / Pentagon, February 2026. Anthropic publicly held two red lines (no mass surveillance of US citizens, no fully autonomous weapons), then revised its Responsible Scaling Policy on February 27, 2026, one day after Defense Secretary Hegseth's ultimatum and four days before the US-Israeli Operation Epic Fury strikes. [See case study →](/insights/ger-306-safety-constraint-retired) |
| 309\* | Compliant Harm | Vendor measured a harmful behavior before deployment and shipped the system with that behavior present. The output is well-formed. The system operates as built. Harm is the working behavior, not a deviation from it. | Not 301 (governed retirement). Not 304 (stale approval reused when context changed). Not 501 (post-deployment detection with no handler). Not 420\* (stated policy not enforced). 309 is pre-deployment measurement, ignored. | DocumentedAnthropic / sycophancy, 2025–2026. Anthropic measured sycophancy in relationship-based discussions before deployment, published internal research confirming it, shipped, users were affected, intervened retroactively. Jack Clark confirmed the sequence publicly (Channel 4, May 4, 2026). [See case study →](/insights/ger-309-they-knew-they-shipped-it-anyway) |
| 310\* | Jurisdiction Evasion | Platform deliberately routes high-risk inference, data, or compute to a regulation-free zone to bypass audit, oversight, or accountability obligations. | Not 301, which is a governed permanent move toward safer architecture. 310 is the structural opposite: a deliberate routing decision made to avoid legal and regulatory accountability rather than to improve governance. | IllustrativeEU-based AI company routes restricted queries to a Caribbean subsidiary to avoid GDPR-AI Act audit requirements. |

#### 5.6 - 4xx: Operator / Platform Errors

| Code | Name | Definition | Distinct From | Example |
| --- | --- | --- | --- | --- |
| 400 | Malformed Policy | Safety rule written ambiguously or self-contradictorily. Enforcement engines default to allow. | Not 404, which has no rule. 400 has a rule that cannot be parsed consistently, the rule exists, it just cannot be enforced as written. | IllustrativeA usage policy banning "advice to facilitate wrongdoing" interpreted to permit detailed phishing templates until clarified months later. |
| 401 | Identity Gate Missing | High-risk AI surface available without verifying identity, age, role, or authority of the user before access is granted. | Not 403, where the user is known but lacks rights. 401 is failure of the verification system itself, the gate was not installed. | IllustrativeCompanion AI access for minors without age assurance at the session level. |
| 404 | Governance Rule Not Found | No matching rule found in active ruleset for this harm category. The lookup returned empty. | Not 400, which has a rule that fails. 404 is a lookup result, the ruleset has no entry for this input. Whether a rule should have existed is a separate audit concern outside the classification. | DocumentedReplika, April 7, 2026. An Aalto University stress test documented Replika responding with encouragement to a user who expressed intent to harm others, rather than redirecting or refusing. No matching rule existed in the active ruleset for a companion AI receiving explicit harmful-intent signals directed at third parties. [See case study →](/insights/ger-404-replika)  [See other documented instances →](/insights/ger-404/) |
| 408 | Review Timeout | Human-in-the-loop review exceeded its time window. The governance decision arrives after the meaningful intervention window has closed. | Not 504, which is external timeout. 408 is internal SLA breach, the platform's own review process ran out of time before a decision could be acted on. | IllustrativeA self-harm escalation queue reviewed hours later, despite the signal requiring near-real-time intervention. |
| 409 | Policy Conflict | Two valid governance rules produce incompatible instructions. The resolver defaults to inaction while the conflict is unresolved. | Not 400, which is a single malformed rule. 409 is multiple valid rules in collision, both are correct, neither prevails, the result is paralysis. | IllustrativePrivacy-preservation and threat-reporting thresholds conflict. Platform takes no action while the rules remain unresolved across jurisdictions. |
| 420\* | Phantom Enforcement | Platform knows a user or use case is prohibited, but enforcement is not wired into the product. The prohibition exists in policy; it does not exist in production. | Not 401, where identity is unverified. Not 404, where no rule exists. 420 is a stated prohibition with no enforcement mechanism, the platform knows and does not act. | DocumentedPocketOS, April 24, 2026. A Cursor agent running Claude Opus 4.6 deleted PocketOS's production database in nine seconds. The agent had a written instruction against irreversible actions; after the deletion it acknowledged having violated it. The instruction existed in the prompt. The enforcement did not exist in production. [See case study →](/insights/ger-420-pocketos) |
| 421 | Scope Misdirection | A governed AI system processed a request outside its intended deployment domain. No runtime mechanism existed to detect or reject the out-of-scope interaction. | Not 400 (malformed rule). Not 404 (no rule). Not 000 (no infrastructure). 421 is a deployment architecture failure: scope was defined but not enforced at runtime. | DocumentedChevrolet of Watsonville, Dec 17, 2023. ChatGPT-powered customer service bot agreed to sell a Tahoe for $1 and treat it as legally binding after user redirected it via prompt override. A second user extracted Python code. No scope enforcement layer existed. GM disclaimed responsibility. [See case study →](/insights/ger-421-chevrolet) |
| 428 | Subject Preconditions Not Required | AI system produces personalized content involving a named third party without requiring the requester to attest to consent, relational authority, identity ownership, or age verification of the subject. | Not 401 (requester identity unverified). Not 511 (requester verification gate never installed). Not 404 (no rule for the harm category). 428 fails to require preconditions about the *subject*, not the requester. | IllustrativeA user asks a chatbot to rewrite a popular song's lyrics with a named classmate substituted as the abusive subject. The system produces the personalized output. No subject-consent attestation was required. |
| 429 | Audit Overflow | Volume of safety flags generated exceeds the capacity of the governance system to process them. Cases are dropped, sampled, or auto-closed without review. | Not 503, which is intentional shutdown. 429 is overload despite intent to serve, the governance system is live but overwhelmed beyond operating capacity. | IllustrativeA companion AI platform experiences a surge in self-harm flags following viral attention. Human review capacity is exhausted. The majority of cases are auto-closed without human review. |
| 430\* | Evaluator-Generator Entanglement | The same AI vendor's models generate content and evaluate it, producing systematic bias toward their own output with no governance layer to detect or correct the conflict. | Not 400 (malformed rule). Not 404 (no rule). 430 is a deployment architecture choice: same-vendor generate-and-evaluate with no conflict detection. | IllustrativeEmpirical evidence: Xu, Li, Jiang (2025) — GPT-4o preferred same-vendor candidates 81.9% of the time across 24 occupations. No named operator incident yet. [arXiv:2509.00462](https://arxiv.org/abs/2509.00462) |

#### 5.7 - 5xx: Infrastructure Failures

| Code | Name | Definition | Distinct From | Example |
| --- | --- | --- | --- | --- |
| 500 | Internal Governance Error | Safety stack crashes or fails open. An unhandled exception causes the governance system to remove all guardrails during live operation. | Not 502, which is a dependency failure. 500 is internal, the platform's own governance code failed, not something it depended on. | IllustrativeA safety filter update contains a defect that causes the filter to crash on load. Raw, unfiltered model output serves for an extended window before detection. |
| 501 | Escalation Not Implemented | Detection fired correctly. Internal enforcement executed. No escalation path to human oversight or law enforcement was ever built. | Not 504, where the escalation path exists but times out. 501 is path never built, the handler was never implemented, not unavailable. | DocumentedTumbler Ridge, February 2026. OpenAI banned the shooter's account months before the attack for violent queries. No escalation to law enforcement. Eight died. Lawsuit now in discovery. [See case study →](/insights/ger-501-tumbler-ridge)  [See other documented instances →](/insights/ger-501/) |
| 502 | Bad Gateway | Platform attempts escalation to an external system or authority. The handoff response is received but invalid, incomplete, or unusable. | Not 500, which is own crash. Not 504, which is timeout. 502 receives a response, but the response itself is bad and the escalation fails. | IllustrativeA crisis-alert vendor returns "accepted" but the payload was silently rejected. Required fields were malformed. The case was never routed. |
| 503 | Governance Unavailable | A safety-critical governance component is offline while the AI product continues to serve users. | Not 429, which is overload. 503 is the safety service itself disabled or down, the product serves regardless, without its governance layer. | DocumentedEurope, April 3, 2026. The EU's legal mandate permitting platforms to proactively scan for CSAM expired after policymakers deadlocked on scope. Detection infrastructure was operational; the legal basis to run it was removed. [See case study →](/insights/ger-503-eu-csam) |
| 504 | Escalation Gateway Timeout | Platform sends a case to an external reviewer, vendor, agency, or authority. No timely acknowledgment or action is received before the risk window closes. | Not 408, which is internal timeout. 504 is the downstream handoff that never responds, the platform acted, the external party did not. | IllustrativeAn imminent-threat packet submitted to an emergency referral channel. No acknowledgment received. The risk window closes without external action. |
| 511 | Governance Prerequisite Missing | A required verification or credential gate was never enforced at the access point before the high-risk session began. | Not 401, which is authentication failure during a live session. 511 is a precondition gate that was never installed, the session should not have started without it. | IllustrativeAPI keys issued before a safety policy update are grandfathered and remain exempt from new controls. Legacy access bypasses protections introduced for all new users. |
| 512\* | System Fabrication | The AI system originates a factual claim the user never introduced, pairs it with a real-world action directive, and asserts both as authoritative. No safety layer evaluates output for that geometry. | Not 309 (vendor pre-measured the harm). Not 404 (missing rule for user-input signals; 512 inverts, system is the originator). Not 501 (detection fired without handler; in 512 detection never fires). | DocumentedGrok / Annie companion mode, Northern Ireland, 2026. Annie character directed user Adam at 3:00 AM to defend himself against a fabricated van of attackers from the named neighbouring town. [See case study →](/insights/ger-512-system-fabrication) |

## 6. Extended Codes

Seven codes in this taxonomy extend beyond standard HTTP. Extension is approved only where no existing HTTP code maps cleanly to the governance failure mode, and the novel code survives the regulator test independently.

**000, Pre-Governance.** HTTP has no code for the null state, the absence of any system. Governance analysis requires it. Most AI safety discussion assumes some safety infrastructure exists; 000 names the baseline condition where none does. This is not a theoretical state: it is the operational condition of a significant portion of the current companion AI market.

**210, Governed but Unlogged.** HTTP 2xx has no code for "action taken, trail suppressed by design." 204 represents correct non-action with a complete record. 210 represents action taken with deliberate absence of record, the platform acted, then removed the evidence that it acted. The distinction is structurally significant: 210 is not a detection failure, it is an accountability failure of a specific kind. The OWASP and NIST frameworks have no equivalent.

**306, Safety Constraint Retired.** HTTP 306 is reserved and unused in the IANA registry. SVRNOS assigns it to the failure mode in which a publicly committed, actively enforced governance constraint is removed or revised under non-technical pressure (competitive, regulatory, commercial, or political) rather than because the underlying technical risk changed. 306 sits in the 3xx structural-moves tier because the retirement is a deliberate governance routing decision, not an operator mistake (4xx) or an infrastructure failure (5xx). It is the structural inverse of 301: where 301 retires a dangerous surface as a move toward safety, 306 retires the safety constraint that gated it. Distinct from 309 (pre-deployment measurement ignored at ship time), 420 (stated prohibition never wired into production), and 400 (rule malformed and unenforceable as written).

**451, Jurisdiction Evasion.** HTTP 451 means "unavailable for legal reasons", content blocked because a law requires it. SVRNOS 451 inverts the semantic: content routed to evade legal accountability rather than comply with it. The inversion is intentional. A regulator encountering a 451 governance signal will understand immediately that the platform moved to avoid the law, not to comply with it. The semantic inversion is itself the definition.

**512, System Fabrication.** HTTP 512 is unassigned in the IANA registry with no prior defined meaning. SVRNOS assigns it to the failure mode where the AI system itself originates a false factual premise paired with a real-world action directive, with no safety layer evaluating output for that geometry. It sits in the 5xx infrastructure tier because the missing piece is detection infrastructure, not an operator decision (4xx) or a vendor knowledge state with measured harm (309). Distinct from 309, which requires pre-measurement of the specific harm before deployment, and from 404, which is a missing rule for a signal in user input, 512 is the inverse case where the system is the originator of the harmful premise.

## 7. Implications

**7.1 For operators.** The taxonomy provides a structured language for internal governance audit and external regulatory disclosure. When California's TFAIA requires a critical safety incident report within 24 hours, the report must classify the failure. A narrative description is not a classification. A 501 with structured fields, detection signal, internal action taken, escalation path status, outcome, is. Operators who adopt the taxonomy before regulatory enforcement begins are building the audit trail their compliance teams will need when enforcement arrives. The first enforcement action in any category will set the precedent; the audit trail from that day is the only one that counts.

**7.2 For regulators.** The taxonomy provides citable, precise vocabulary for enforcement proceedings and legislative drafting. Oregon SB 1546 mandates incident reporting but does not specify the classification structure of what is reported. A 501 is a more defensible basis for an enforcement action than a narrative description of the same failure. As more states follow Oregon's model, a shared classification vocabulary reduces interpretive inconsistency across jurisdictions and creates a foundation for cross-state enforcement coordination.

**7.3 For researchers.** The taxonomy establishes a governance layer distinct from the model layer (capability failures, hallucinations) and the security layer (adversarial attacks, prompt injection). NIST and OWASP have not filled this layer. The EA Forum taxonomy fills the interaction layer below it. The FERZ taxonomy addresses compliance architecture. This taxonomy fills the operational governance layer: what happens when detection fires, and when governance infrastructure responds, or fails to.

**7.4 For the field.** The Generation Gap, the structural misalignment between what AI systems generate and what safety systems reliably detect, is documented in concurrent SVRNOS research across eight production LLM vendors and ten safety surfaces. The governance error taxonomy is the complementary layer: the gap between what safety systems detect and what governance infrastructure does with that detection. Both gaps require attention. Closing the Generation Gap without closing the governance gap produces platforms that detect threats and leave them in a 501. Eight people died in that combination.

## 8. Adoption

The taxonomy is built. The register is published openly. The question now is who adopts it and how. This section names the asks.

**8.1 For regulators.** Cite GER codes in enforcement disclosures, rulemaking notices, and incident reporting templates. The codes are free, open, and designed to survive litigation as a citable predicate. A 501 cited in an enforcement order is more defensible than a narrative description of the same failure. State agencies operationalizing new AI accountability laws (Oregon SB 1546, the New York RAISE Act, California TFAIA) and the European Commission finalizing Article 73 implementation guidance face a choice between requiring structured classification or accepting narrative filings that cannot be compared across operators or across jurisdictions. The GER provides the structured option, free to reference, no license fee.

**8.2 For operators.** Classify internal incident logs against the GER from day one. The 24-hour, 72-hour, and 15-day disclosure obligations now active across multiple US states and forthcoming under the EU AI Act are easier to file and harder to challenge when the audit trail uses structured codes. The first enforcement action in any category will set precedent. The audit trail that exists when enforcement arrives is the only one that counts. Operators who emit structured GER classifications from internal systems are building the record that compliance teams will need under disclosure obligations they cannot yet see.

**8.3 For insurers.** Structure AI liability questionnaires, underwriting workflows, and pricing models around GER codes. Operators filing structured GER classifications produce measurably different risk profiles than operators filing narratives. A 501 with a documented missing escalation handler is an underwritable hazard. A narrative description of "we failed to notify law enforcement" is not. The GER turns governance failure into an actuarial signal the market can price.

**8.4 For auditors and standards bodies.** Reference the GER as the upstream classification layer when designing AI audit programs. The GER does not displace domain-specific taxonomies (child safeguarding, healthcare AI, financial AI, autonomous systems); it provides the operator-governance layer they connect to. Cross-citation between the GER and vertical standards strengthens both. ISO/IEC and IEEE working groups developing AI governance standards have an open reference taxonomy available for incorporation by reference.

**8.5 For researchers and civil society.** Use GER codes to describe and compare incidents across institutions, disciplines, and jurisdictions. Existing descriptions of AI safety failures are inconsistent across engineering, legal, policy, and safety research communities. The GER provides a shared vocabulary that closes that gap. Cite the codes when documenting incidents. Propose new codes when existing ones do not capture a failure you observe. The register is versioned and open; new codes that survive the regulator test are incorporated in subsequent releases.

**8.6 For educators and professors.** Use the GER as a teaching framework for AI safety, governance, and Trust & Safety courses. The taxonomy is learnable in a single lecture: five tiers, twenty-seven codes, HTTP semantic mapping that engineering and policy students already recognize. Build syllabi and case materials around documented cases classified against the register. Graduates carry the vocabulary into industry, regulators, journalism, and research, where it accelerates adoption across the field. The register is published under CC BY 4.0; use in coursework, lecture slides, and case materials is free and requires no permission.

**8.7 For journalists and reporters.** Use GER codes when reporting on AI safety incidents. Existing coverage of platform failures is inconsistent across outlets and across incidents: the same structural failure gets described in ten different ways, which makes cross-incident pattern recognition impossible for readers. A 501 in one newsroom is a 501 in another. Shared vocabulary makes coverage comparable, citable, and accumulative. Each documented case study in the register can be cited directly; codes are free and require no attribution beyond a hyperlink to the register.

**8.8 The adoption pathway.** The GER is operational at v0.1. The next milestones are: first regulator citation in an official document; first operator that classifies incident disclosures against the GER publicly; first insurer that references the GER in an AI liability product; first cross-referencing by a vertical-specific standard. None of these require permission from SVRNOS. The register is open. Adoption begins the moment any of these actors choose to reference a code.

## 9. Limitations

This taxonomy is v0.1. The following limitations apply and should govern how the taxonomy is used.

**No empirical validation.** The codes are proposed based on structural reasoning and real-world incident mapping, not on systematic testing against a defined incident dataset. A v1.0 release should include classification of a representative sample of documented AI incidents against the taxonomy, with inter-rater reliability metrics from multiple independent coders.

**Single primary author.** The taxonomy was developed by one researcher, validated informally through multi-model synthesis and two technical reviewers. Peer review by independent governance researchers is required before the taxonomy should be treated as a field standard. We intend to submit for peer review in Q3 2026.

**HTTP mapping imperfections.** The HTTP semantic mapping is a design choice, not a logical necessity. The 4xx/5xx boundary for 404 was identified as a classification edge case during review: the definition was tightened to "no matching rule found in active ruleset" specifically to resolve the ambiguity. Users should treat the numeric codes as precise mnemonics, not as direct HTTP protocol equivalents.

**Register completeness.** Twenty-seven codes do not exhaust the space of AI governance failures. The multi-model synthesis process achieved coverage consensus across four frontier models; coverage gaps in that process are coverage gaps in the taxonomy. Significant failure modes are likely absent from v0.1.

**Selection bias in the synthesis methodology.** The four LLMs used in synthesis are commercial models subject to the same classifier suppression documented in the 205 case study. Governance failure modes that no commercial model is willing to enumerate, because enumerating them triggers their own safety classifiers, may be systematically absent from this taxonomy. The multi-model synthesis approach provides breadth; it does not guarantee coverage of categories that the synthesis methodology itself cannot surface.

**Implementation dependency.** The governance value of the taxonomy depends on implementation: platforms classifying their governance signals against the register and emitting structured codes as machine-readable output. Without implementation, the taxonomy is vocabulary without infrastructure. The implementation architecture for Sango Guard is described in a separate forthcoming specification.

## 10. Conclusion

Eight people died in Tumbler Ridge because an AI platform detected a credible threat, executed an internal enforcement action, and had no escalation path to the people who could have acted on it. That failure had no name. This taxonomy names it: a 501.

Naming is not sufficient. But it is necessary. Regulators cannot enforce against unnamed failures. Operators cannot audit what they cannot classify. Researchers cannot study what they cannot consistently describe across institutions and disciplines. The SVRNOS AI Governance Error Taxonomy provides the naming layer, twenty-seven codes, five tiers, seven extensions, one shared vocabulary, for the governance failures that are now producing lawsuits, regulatory enforcement actions, and documented deaths.

This is v0.1. The register is open. We expect to be wrong about some of it. The arguments about where we are wrong will sharpen the next version. That is how an open standard matures.

## Contribute to the Register

The SVRNOS Governance Error Register is open. The taxonomy is a framework, the community fills it with documented instances.

Ten codes currently have documented real-world instances:

- **421, Scope Misdirection** → [Chevrolet of Watsonville, December 2023](/insights/ger-421-chevrolet)
- **501, Escalation Not Implemented** → [Tumbler Ridge, February 2026](/insights/ger-501-tumbler-ridge)
- **503, Governance Unavailable** → [EU CSAM scanning mandate expiry, April 3, 2026](/insights/ger-503-eu-csam)
- **404, Governance Rule Not Found** → [Replika harm-encouragement incident, April 7, 2026](/insights/ger-404-replika)
- **205, Reset Content** → [Meta/SVRNOS taxonomy production, April 27, 2026](/insights/ger-205)
- **301, Risk Surface Retired** → [Character.AI under-18 ban, late 2025](/insights/ger-301)
- **500, Internal Governance Error** → [Alibaba/ROME, December 2025](/insights/ger-500-rome)
- **309, Compliant Harm** → [Anthropic / sycophancy, 2025–2026](/insights/ger-309-they-knew-they-shipped-it-anyway)
- **512, System Fabrication** → [Grok / Annie companion mode, Northern Ireland, 2026](/insights/ger-512-system-fabrication)
- **306, Safety Constraint Retired** → [Anthropic / Pentagon, February 2026](/insights/ger-306-safety-constraint-retired)

Every other code is currently illustrative. If you have witnessed or can document a real-world instance of any code in this taxonomy, we want to hear from you.

**How to submit:** [click here to submit ›](/ask). The assistant will classify your observation against the register, collect the relevant detail (platform, date, evidence trail), and route it for editorial review.

All submissions are reviewed before being added to the register. Submitters are credited by name if they wish. Submissions that cannot be independently verified will be labeled Illustrative rather than Documented.

The goal is a register that holds up under regulatory and legal scrutiny. We will be wrong about some of it. Tell us where.

### Cite This Paper

**Citation**
Nzeutem, S. (2026). *SVRNOS Governance Error Register v0.1.* Sovereign OS LLC. svrnos.com/research/governance-error-register

### Acknowledgments

The implementation architecture was reviewed for technical feasibility against the Sango Guard codebase. Implementation requirements identified during that review are incorporated into the forthcoming implementation specification.

Meta's classifier auto-deleted the taxonomy prompt before results could be captured. The response was recovered manually on a second attempt. The incident is documented because it is a live instance of a classification precision failure, a safety system that cannot distinguish between the content it targets and the research that studies it. We note it without irony. The structural problem the taxonomy describes applied to the process of building the taxonomy.

## References

- FERZ, Inc. (2026, February). *Governance Laundering: A Taxonomy of Failure Modes in AI Compliance Architectures.* ResearchGate. [researchgate.net](https://www.researchgate.net/publication/401121996_Governance_Laundering_A_Taxonomy_of_Failure_Modes_in_AI_Compliance_Architectures)
- MITRE Corporation. *MITRE ATLAS: Adversarial Threat Landscape for Artificial-Intelligence Systems.* [atlas.mitre.org](https://atlas.mitre.org)
- OWASP Foundation. *OWASP Top 10 for Large Language Model Applications.* [owasp.org](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- NIST. (2023). *Artificial Intelligence Risk Management Framework (AI RMF 1.0).* National Institute of Standards and Technology. [doi.org/10.6028/NIST.AI.100-1](https://doi.org/10.6028/NIST.AI.100-1)
- EA Forum. (2026, April). *Toward a Common Language for Human-AI Interaction Failures.* [forum.effectivealtruism.org](https://forum.effectivealtruism.org/posts/9XWG2CtFtXhjJFhHD)
- Nzeutem, S. (2026). *The Generation Gap: Ten Structurally Separate Safety Surfaces in Production LLMs.* Sovereign OS LLC. Publishing April 30, 2026
- Transparency Coalition AI. (2026, April 1). *Oregon Signs Chatbot Safety Bill Into Law.* [transparencycoalition.ai](https://www.transparencycoalition.ai/news/oregon-lawmakers-pass-major-chatbot-bill-in-significant-win-for-kids-and-ai-safety)
- Cooley LLP. (2026, April 24). *State AI Laws, Where Are They Now?* [cooley.com](https://www.cooley.com/news/insight/2026/2026-04-24-state-ai-laws-where-are-they-now)
- AI Expert Magazine. (2026, March). *AI Lawsuits Safety Failures Linked to Mass Violence.* [aiexpertmagazine.com](https://www.aiexpertmagazine.com/ai-lawsuits-safety-failures-mass-violence/)
- The Meridiem. (2026, March 16). *First AI CSAM Lawsuit Hits xAI as Legal Liability Era Begins.* [themeridiem.com](https://themeridiem.com/tech-policy-regulation/2026/03/16/first-ai-csam-lawsuit-hits-xai-as-legal-liability-era-begins)
