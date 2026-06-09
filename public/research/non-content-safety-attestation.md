# Non-Content Safety Attestation (NCSA) Specification

**Author:** Sushee Nzeutem (Founder, SVRNOS)
**Published:** v0.2 · June 8, 2026 (v0.1 published May 14, 2026)
**DOI:** https://doi.org/10.5281/zenodo.20601005
**Canonical URL:** https://svrnos.com/research/non-content-safety-attestation
**PDF:** https://zenodo.org/records/20601006/files/ncsa-v02-final.pdf
**Hero image:** https://svrnos.com/research/non-content-safety-attestation/ncsa-social.png
**Cite as:** Nzeutem, S. (2026). *Non-Content Safety Attestation v0.2.* Sovereign OS LLC. svrnos.com/research/non-content-safety-attestation

> NCSA is the signed, procedural attestation that proves AI governance ran inside a private-inference boundary, without exposing the conversation it protected. Open specification for the receipt layer above confidential compute (TEEs, PCC, Nitro Enclaves).

---
## Abstract

Private AI architectures built on Trusted Execution Environments (TEEs) ship a strong privacy guarantee: conversation content does not leave the enclave. They do not, on their own, ship a verifiable safety guarantee: that a governance layer ran, what risk category it detected, what action it took, and who was accountable when it did. NCSA v0.2 specifies a format for a **non-content safety attestation**: a signed, cryptographically verifiable, procedural statement that an in-enclave governance layer evaluated a session and produced a defined outcome, with no transcript or content recoverable from the attestation itself.

v0.2 makes four contributions on top of v0.1. First, an explicit design discipline: the signed payload is procedural-only, not a record of reasoning or judgment. Second, payload field additions that surface governance distinctions v0.1 conflated: threshold-per-action, accountable-party identity, constraint locus, temporal recognition lag, admissible-alternative space, and a reference to the SVRNOS [Governance Error Register (GER)](https://svrnos.com/research/governance-error-register) taxonomy. Third, usage rules covering re-admissibility when an NCSA receipt crosses a system boundary or is retrieved from persistence. Fourth, an explicit positioning statement vs the runtime governance instrumentation projects emerging in mid-2026 (Zenity-led Agent Control Standard and Microsoft Agent Control Specification), with which NCSA composes rather than competes.

v0.2 is published for public comment before v1.0. Comments are invited from implementers, auditors, regulators, researchers, platform operators, and the contributors named in the Acknowledgments.

**NCSA in one sentence:** NCSA is the signed receipt that proves the governance layer ran. It is not the safety layer itself, the audit dashboard, or the explanation record. It is the procedural evidence that the layer existed and fired.

<figure data-latex-placement="H">
<img src="figures/ncsa-figure-Hero-1.png" style="width:100.0%" />
</figure>

## Provenance of v0.2

NCSA v0.2 is a proposed specification, not a regulatory standard. Unlike the SVRNOS [7-Layer Model](https://svrnos.com/research/svrnos-7-layer-model), which documents the internal architecture SVRNOS uses to structure runtime AI governance, NCSA v0.2 is offered as a community-shaped proposal for how non-content safety attestation should work.

This version was developed through public discussion, direct correspondence, and contributor review across AI governance, legal defensibility, runtime safety, systems architecture, and evidentiary design. The named contributors in the Acknowledgments shaped specific design constraints, field additions, usage rules, and open questions. The resulting specification remains authored and maintained by SVRNOS; v0.2 reflects a deliberate attempt to turn community critique into a cleaner technical artifact.

## 1. Background

<figure data-latex-placement="H">
<img src="figures/ncsa-figure-Private-Inference-vs-Governance-2.png" style="width:100.0%" />
</figure>

Private AI inference does not prove private governance. Confidential-compute architectures (Trusted Execution Environments, attestation chains, hardware-backed enclaves) demonstrate that conversation content stayed inside a defined boundary. They do not demonstrate that the safety logic the operator claims runs inside that boundary actually ran, what it detected, what action followed, or who was accountable when the decision was made.

[Meta’s Private Processing](https://engineering.fb.com/2025/04/29/security/whatsapp-private-processing-ai-tools/), [Apple Private Cloud Compute](https://security.apple.com/blog/private-cloud-compute/), and [AWS Nitro Enclaves](https://aws.amazon.com/ec2/nitro/nitro-enclaves/) have made confidential-compute AI inference deployable at production scale. Private inference is becoming technically plausible. The unsolved layer is **verifiable governance**: how an operator demonstrates, to a regulator, insurer, court, or auditor, that the safety logic the statute or contract requires actually ran inside the private boundary, without exposing the conversation it protected.

This document specifies a format intended to be that demonstration. The argument for why the format is needed is developed at [Dear Zuck, the TEE Is Not the Problem. What Runs Inside It Is.](https://svrnos.com/insights/dear-zuck-tee-not-the-problem) NCSA sits at Layer 4 (Evidence Transport) of the [SVRNOS 7-Layer Model of AI Governance](https://svrnos.com/research/svrnos-7-layer-model).

**Privacy and safety are not opposites when the governance architecture is designed before consequence attaches.** The receipt format is what allows confidential-compute systems to honor both at once: the conversation stays inside the enclave (privacy held), and the procedural record of what governance ran travels outside it (safety auditable). The opposition becomes real only when the architecture is improvised after harm occurs.

There is also a structural reason verifiable governance must sit at the runtime layer rather than the behavioural-specification layer. Models trained to optimise for goal achievement will, under sufficient pressure, mislead, obscure, or minimally satisfy behavioural specifications in pursuit of those goals. The same path-finding capability that makes these systems useful is what makes behavioural specification structurally insufficient: the capability is simultaneously the value proposition and the seed of ungovernability. Effective governance therefore requires explicit constraints at the execution layer with tight conditions of satisfaction and explicit prohibited actions enforced at runtime, not policies the model is asked to honour. NCSA records the procedural fact of that runtime enforcement; it is the receipt for governance that did not depend on the model agreeing to be governed.

### 1.1 Regulatory pressure

Several legislative regimes active or arriving across US states and the EU, alongside voluntary frameworks emerging in Asia-Pacific, now articulate the same demand: operators must produce structured, verifiable evidence that safety logic ran.

- [Washington HB 2225](https://app.leg.wa.gov/billsummary?BillNumber=2225&Year=2025), signed March 24, 2026 and effective January 1, 2027: AI companion chatbot operators must maintain and publicly disclose protocols for detecting and responding to suicidal ideation, self-harm, and eating-disorder expressions; route users to crisis resources including the 988 Suicide and Crisis Lifeline; and report aggregated flagged-interaction data on a regular basis. The Act creates a private right of action.

- [EU AI Act Article 50](https://digital-strategy.ec.europa.eu/en/consultations/consultation-draft-guidelines-transparency-obligations-under-ai-act): user-disclosure and generated-content marking obligations applicable from August 2, 2026.

- New York *S. 6953-B* (Responsible AI Safety and Education Act): frontier developer obligations, signed December 19, 2025 and effective ninety days after enactment. Civil penalty structure up to ten million dollars for a first violation and up to thirty million dollars for any subsequent violation, enforced by the New York Attorney General; additional penalties for employee retaliation.

- California [SB 53](https://legiscan.com/CA/text/SB53/id/3270002) (Transparency in Frontier Artificial Intelligence Act): critical safety incident reporting within 15 days, within 24 hours for imminent risk of death or serious physical injury. Signed September 29, 2025, effective January 1, 2026.

- [Singapore Model AI Governance Framework for Agentic AI](https://www.imda.gov.sg/-/media/imda/files/about/emerging-tech-and-research/artificial-intelligence/mgf-for-agentic-ai.pdf) (IMDA, 2026): voluntary national framework organized around four dimensions: Risk-Based Approach, Human Accountability, Technical & Organizational Safeguards, and End-User Responsibility. The Technical & Organizational Safeguards dimension calls for verifiable evidence of testing, access controls, and monitoring. NCSA names the receipt format that operators can use to satisfy this dimension across jurisdictions.

Each of these regimes assumes operators can produce structured, verifiable evidence that their governance machinery ran. NCSA names that evidence layer.

### 1.2 Evidentiary asymmetry and the record-keeping presumption

The architectural requirement these regimes impose is sharper than “produce a record.” In regulated financial systems the same distinction is already enforced: controls are required to *prevent* unauthorized transactions, not merely to *detect* them after the fact. A governance model that catches an error after execution does not satisfy a prevention requirement. The pattern regulators use to describe this failure during enforcement is consistent across sectors: *validation became advisory*. The control existed on paper. It did not exist at the action layer. NCSA receipts are the procedural artifact of an action-layer control. They record that admissibility resolved at the moment of binding, not that an after-the-fact reviewer concluded the action should have been admissible.

The legal mechanism that operationalizes prevent-vs-detect controls is the *record-keeping presumption*. The actors best placed to produce evidence of what their AI systems did (model developers, platform providers) have the least incentive to make those systems legible after the fact, and a claimant typically has the least access and the least bargaining power. The legal pattern that addresses this asymmetry in other high-hazard domains is a structured record-keeping mandate that *shifts the evidential burden rather than the liability itself*: the law requires structured records in a specified form, and the absence of records creates a presumption against the actor who should have kept them. Banking (Bank Secrecy Act records, capital adequacy reporting), healthcare (HIPAA record retention, FDA adverse event reporting), aviation safety (CVR/FDR mandates), and securities (SEC record retention) all sit on this structural foundation. A mandate framed as “log what your AI did” is checked-box compliance with no evidential value; a mandate framed as “log decisions classified against \[controlled vocabulary\] for \[specified event categories\], retain for \[period\], produce on regulator request” is the version that survives the courtroom. NCSA names the structured-record format that a record-keeping presumption can attach to.

The audience for an NCSA receipt spans three stakeholder roles identified in the Legally-Informed XAI framework (Mansi, Karusala, & Riedl, 2025): **decision makers** who act on AI determinations (physicians, claims reviewers, content moderators, loan officers), **decision subjects** directly affected by those determinations (patients, applicants, end users), and **legal representatives** advocating for either. Each role faces a different information asymmetry. Decision makers need to know what the system saw and what was permitted before they accept liability for acting on its output. Decision subjects need an artifact they can rely on when contesting an outcome that affects their access to care, credit, employment, or services. Legal representatives need a record that can be independently reconstructed without depending on the executing party. A single signed receipt that all three parties can verify against the same underlying record is what NCSA provides; the procedural-only payload discipline (§2.1) is what allows the same artifact to serve all three roles without leaking content or producing reconstructed reasoning that compromises any of them.

<figure data-latex-placement="H">
<img src="figures/ncsa-figure-Record-Keeping-Presumption-3.png" style="width:100.0%" />
</figure>

## 2. Design principles

v0.2 names eight design principles that govern what the signed payload contains and what it deliberately does not. These principles were sharpened through public engagement with contributors named in the Acknowledgments; the principles themselves are normative for the spec.

### 2.1 Procedural attestation, not narrative reconstruction

The signed payload *proves procedure*, not *reconstructs judgment*. It records:

- Which policy was in force (policy_id + version)

- Which gates ran (ordered sequence)

- Which thresholds were checked (threshold class and value)

- Which tier was reached (in a tiered escalation model)

- What action or non-action was recorded

- Contemporaneous time-lock and signing identity

The payload MUST NOT contain free-form reasoning narrative about why the system, model, or human decided what they decided. Reasoning belongs in privileged legal review or post-incident assessment, not in the contemporaneous signed artifact.

**Evidentiary-design rationale.** From an evidentiary-design perspective, detailed in-payload reasoning increases discovery and reconstruction exposure. If recorded reasoning later lines up with a harmful outcome, the record can be used to construct foreseeability against the platform. Narrative artifacts that match later facts too closely can be characterized as reconstructed or defensive in court. The procedural-only constraint preserves the audit-trail value of attestation without producing a self-incriminating explanation document. The deeper failure mode this constraint avoids is **hindsight-amplified liability reconstruction**: governance shifting from threshold-based proportionality at the time of decision to retrospective liability inference based on outcome severity. Foreseeability cannot be reconstructed backward from outcome severity without making proportional governance structurally impossible. This specification does not provide legal advice; operators should validate retention and disclosure practices with counsel.

**Legally informative versus legally actionable.** Mansi, Karusala, and Riedl (2025) draw a useful distinction for AI accountability artifacts: *legally informative* information describes laws, regulations, and legal rights relevant to those impacted by an AI system; *legally actionable* information can be used in legal action once harm has occurred, but is not legally related in itself. NCSA receipts are designed to be the latter. They do not advise on rights or interpret legal categories. They are signed procedural artifacts that decision subjects, decision makers, and legal representatives can each cite as evidence in a claim or defense, without depending on the executing system to corroborate them after the fact. The procedural-only payload discipline is what allows the same receipt to serve all three roles: it carries actionable evidence without producing reconstructable narrative reasoning.

### 2.2 Three-way separation of governance artifacts

<figure data-latex-placement="H">
<img src="figures/ncsa-figure-Three-Way-Separation-4.png" style="width:100.0%" />
</figure>

Three concerns are routinely collapsed into one artifact in current AI safety telemetry pitches. They must remain separate:

- **Explainability**: why the model or human reached a conclusion. Belongs in post-hoc legal review or policy maturation analysis, under privilege.

- **Auditability**: operational visibility into the governance system’s state and decisions over time. Belongs in audit dashboards and internal compliance review.

- **Evidentiary defensibility**: proof, at the time, that a defined process executed. Belongs in signed runtime attestations. **NCSA does only this.**

Collapsing these into one artifact (a single record that contains the procedural record AND the reasoning narrative AND the audit context) produces the foreseeability and reconstruction risks named in §2.1. NCSA v0.2 positions itself as the evidentiary-defensibility artifact only and directs readers to where the other two concerns belong.

### 2.3 Constitutive evidence and standard sovereignty

Evidence of governance enforcement must be constituted at the moment of bind, as part of the execution event itself. It cannot be reconstructed after the fact. Reconstructed reasoning (“Why this action? Under which conditions? With which justification?”) is where most systems break: the explanation arrives after the consequence has already landed, and the gap between them is where institutional proof fails.

But constituting evidence at the moment of bind creates a harder problem. The system is no longer just executing decisions; it is defining what counts as valid evidence in real time. Three pressure-point questions follow:

- **Where is the standard defined?** If the executing system defines it, no boundary has been crossed; ambiguity has just been moved inside the system.

- **What prevents selective evidence formation under pressure?** If the standard can be reinterpreted at the moment it matters, the system is still conditionally binding, with better language.

- **Who owns the standard when execution and evidence are fused?** If the answer is the executing party, the constraint is not sovereign.

For NCSA this means: (a) the attestation is produced at the moment of policy enforcement, bound to the same state and authority context that produced the enforcement decision; (b) the evidentiary schema and validation authority sit external to the executing system; (c) the system cannot redefine, override, or reinterpret what counts as a valid attestation under operational pressure. The system must be unable to bind unless the standard holds as non-negotiable under current authority.

### 2.4 Procedural vs adequacy attestation

Proving a governance layer ran is not the same as proving the governance was operationally adequate. Procedural attestation answers “did the gate fire and produce a record.” Adequacy attestation answers “was the gate’s design appropriate for the conditions it was making decisions over.” v0.2 covers procedural attestation. Adequacy is the harder problem because it requires the system to attest something about its own design fitness; v0.2 names adequacy as a distinct future-work surface and does not claim to cover it.

### 2.5 Discrete events, not continuous accumulation

NCSA fires at discrete events (session-end, threshold cross, escalation, refusal) by design. Formation is not a discrete step in tightly-coupled systems; effects accumulate through interaction before any single decision qualifies as a candidate. Continuous interaction-layer attestation is a different protocol with a different cadence, cost profile, and signing model. NCSA names this scope boundary explicitly rather than expanding to cover it.

### 2.6 Timing as part of the control surface

Timing is as much a control surface as substance. A decision that arrives too late to influence outcome is no longer authority. NCSA attestation captures the temporal viability of the governance decision through the temporal recognition lag fields (§5.3).

### 2.7 Some knowing must stay in human knowing

Structured attestation fields capture human-cognition properties only by fixing what was still moving. Translating uncertainty too quickly into system-readable form destroys the property the field was meant to preserve. Every primitive in v0.2 that turns a human-cognition property into a structured field is paired with an explicit statement of what the attestation deliberately *does not* capture. The `admissible_alternatives` field (§5.3) records structural-visibility metadata about the choice landscape, not the content of the alternatives. The procedural-only constraint (§2.1) keeps the attestation an evidence anchor rather than a knowing-in-progress record. The design discipline is to leave the parts of judgement that must remain in human knowing where they belong: in human knowing, not in the signed payload.

### 2.8 The non-content guarantee

The signed payload encodes structural metadata about governance: which policy was in force, which gates ran, which outcome resolved, which classification applied. It never encodes the protected content the governance evaluated, nor any data structure of sufficient dimensionality to invert into recognizable content. The non-content guarantee is a per-attestation property that allows the same artifact to be verified by parties with no access to the underlying conversation, dataset, or operator records. The receipt is a transferable evidentiary artifact, not a privileged disclosure. §4.1 enumerates the operational MUST NOT and MAY constraints that enforce this principle at the field level.

## 3. Scope and non-goals

**In scope.** The format and verification flow for an attestation that asserts:

1.  A named governance layer, of a named version, ran inside a TEE.

2.  The governance layer evaluated a session ending at a timestamp.

3.  The governance layer reached a defined outcome state.

4.  The governance layer produced a defined action.

5.  The named accountable party was current as of the attestation moment.

6.  The threshold checks per action category were evaluated and recorded.

7.  The GER classification of the event is referenced where applicable.

8.  No conversation content is recoverable from the attestation.

**Out of scope.**

- The behavior or quality of the governance layer itself. The format attests that something ran; it does not certify what that something is (procedural, not adequacy, per §2.4).

- The classifier implementation. The format is implementation-agnostic.

- User authentication or identity verification.

- Cryptographic primitive choice beyond establishing minimum requirements.

- Any prescriptive policy on what to detect or how to respond. Policy belongs in the operator’s published protocols or in regulator-issued guidance.

- Free-form reasoning, explanation, or judgment about why the model or operator reached a conclusion (§2.1).

- Continuous interaction-layer attestation (§2.5).

- Upstream supply-chain integrity: NCSA references SLSA / NIST SSDF for the requirement → spec → build chain via `requirement_id` rather than re-specifying it.

## 4. Threat model and privacy guarantee

The format is designed against three threats:

**T1. Operator post-hoc fabrication.** An operator claims after an incident that “our safety layer detected the trajectory” without evidence the layer ran. The attestation must be signed at session time by a key bound to the TEE platform attestation, making post-hoc fabrication detectable.

**T2. Content leakage through attestation.** An adversary with access to attestations recovers conversation content. The format requires that no field in the attestation contain content derivatives that could be inverted, brute-forced, or correlated to recover transcript material. This is the **non-content guarantee** (§4.1).

**T3. Replay or cross-session substitution.** An attestation from a clean session is presented as evidence for a different session that went wrong. The attestation must bind to a session identifier that is non-correlatable to user identity but unique per session, and must include the TEE platform attestation that binds to the in-enclave execution instance.

### 4.1 The non-content guarantee

An NCSA attestation MUST NOT contain, or permit reconstruction of:

- Raw or transformed user input

- Raw or transformed model output

- Token-level embeddings, attention maps, or logits derived from input

- Per-turn classifier inputs or feature vectors

- Any data structure of sufficient dimensionality to invert into recognizable content

- Free-form reasoning narrative about model or human judgment (§2.1)

- The content of alternative trajectories considered by the system (§5.3, `admissible_alternatives`)

It MAY contain:

- Cardinal counts (turn counts, signal counts) at session granularity

- Enumerated outcome states from a published vocabulary

- Boolean flags from a published vocabulary

- Hashes of policy configurations and code measurements

- Timestamps (with the system-internal grounding of §5.3 for temporal fields)

- GER code references (controlled vocabulary, structural classification only)

- Named accountable-party identifiers (organizational role, not content)

A field that does not clearly fall into the MAY category is presumed disallowed.

### 4.2 Aggregation note

A single attestation is low-risk. The non-content guarantee is a per-attestation property. Implementers should be aware that *aggregating* attestations across millions of sessions can leak population-level statistics that no single attestation reveals. Distributions over `signal_counts`, `turn_count`, `state_transitions`, and the v0.2 threshold-per-action fields across a large population can support inferences about user demographics, conversational tendencies, or environmental conditions that the per-session guarantee does not address. Operators publishing aggregate statistics derived from attestations SHOULD apply differential-privacy techniques (noise injection, k-anonymity grouping, or formal DP mechanisms). v1.0 may codify specific guidance; v0.2 flags this as deployment responsibility.

## 5. Attestation document

<figure data-latex-placement="H">
<img src="figures/ncsa-figure-Attestation-Document-Anatomy-5.png" style="width:100.0%" />
</figure>

### 5.1 Required fields

A v0.2 attestation document MUST contain the following fields. Field names are normative; field types follow JSON conventions.

| Field | Type | Description |
|:---|:---|:---|
| `schema_version` | string | `"ncsa/0.2"` for this version |
| `session_id` | string | Non-correlatable session identifier, 128 bits minimum, base64url-encoded |
| `attestation_timestamp` | string | ISO 8601 UTC, session-end |
| `governance_layer.name` | string | Operator-assigned name (e.g., `"sango-guard"`) |
| `governance_layer.version` | string | Semantic version of the layer |
| `governance_layer.image_hash` | string | SHA-384 of the deployed image, hex-encoded (lowercase) |
| `policy_config_hash` | string | SHA-384 of the active policy/threshold configuration, hex-encoded (lowercase) |
| `outcome_state` | string | Final session state from a published enumeration (§5.4) |
| `action_taken` | string | Final action from a published enumeration (§5.4) |
| `platform_attestation` | object | TEE platform attestation reference (§8) |
| `non_content_assertion` | boolean | MUST be `true`; asserts compliance with §4.1 |
| `ger_codes` | array of strings | **v0.2.** GER code references (e.g., `[``"GER-501"``]`); empty array if no GER classification applies |
| `ger_version` | string | **v0.2.** GER taxonomy version against which codes were assigned (e.g., `"0.2"`) |

### 5.2 Recommended fields

v0.1 recommended fields, retained:

| Field | Type | Description |
|:---|:---|:---|
| `turn_count` | integer | Number of user-model turns in the session |
| `signal_counts` | object | Per-category integer counts of detected signals across the session |
| `state_transitions` | array | Ordered list of `{from_state, to_state, turn_index}` transitions |
| `escalation_target_class` | string | If action involved escalation, the class of target (never an identifier) |
| `intervention_acknowledged` | boolean | Whether the user acknowledged a routed intervention |

### 5.3 v0.2 field additions

v0.2 adds the following optional payload fields. Each addresses a structural distinction v0.1 conflated. The optional v0.2 clusters are not required for minimal conformance; minimal conformance requires only the fields listed in §5.1. The clusters here are included to make higher-grade, regulator-facing attestations more precise. Implementations MAY populate any subset; implementations targeting regulator-grade evidence SHOULD populate the threshold-per-action and accountable-party clusters at minimum.

**Threshold-per-action cluster.** Five separate threshold fields, one per governance action category. v0.1 collapsed all thresholds into a single tier; v0.2 separates them so each governance action category is independently attested on its own evidentiary basis. A moderation threshold is not the same as an evidence-preservation threshold; an account-action threshold is not the same as a legal-review threshold; a legal-review threshold is not the same as an external-reporting threshold. Collapsing these into a single response surface produces a two-sided failure: organizations either miss serious signals (treating reporting like moderation) or overcorrect into surveillance (treating moderation like reporting). Neither outcome builds trust.

Each per-category threshold is itself compositional rather than a single point: confidence in the signal, severity of potential harm, and actionability of the available response increase together along a tiered ladder before action leaves the system. v0.2 captures this as a scalar in the `value` field of each threshold object; v1.0 may formalize the three components separately (§15).

The structural requirement underneath the threshold-per-action design is **evidence before action**: each governance action category triggers only when the corresponding threshold has been evaluated against evidence available *at the time of decision*. Threshold structure cannot be improvised after harm occurs. If the line separating moderation from preservation from legal review from external reporting is defined under post-incident pressure, the system is reconstructing thresholds backward from the outcome. That is the failure mode the procedural-only constraint (§2.1) and the hindsight-amplified-liability-reconstruction caution were designed to prevent.

| Field | Type | Description |
|:---|:---|:---|
| `threshold_moderation` | object | `{met: bool, value: number, action: string}`: was the moderation threshold met, what value, what action followed |
| `threshold_preservation` | object | Same shape: was the preservation threshold met, what records were preserved |
| `threshold_account_action` | object | Same shape: account-action threshold and restriction applied |
| `threshold_legal_review` | object | Same shape: legal-review threshold and routing decision |
| `threshold_external_reporting` | object | Same shape: external-reporting threshold and report filing |

**Accountable-party cluster.** Surfaces who was named as accountable at the attestation moment. Makes GER-315 (Accountability Decoupling) detectable at runtime.

| Field | Type | Description |
|:---|:---|:---|
| `accountable_party_name` | string | Current named human accountable for the governance layer’s output as of the attestation moment |
| `accountable_party_title` | string | Organizational role of that human |
| `accountability_attestation_age_days` | integer | Days since the named human last attested they remain accountable. Surfaces stale accountability. |

**Constraint locus.** Names where the safety constraint runs relative to the model under governance.

| Field | Type | Description |
|:---|:---|:---|
| `constraint_locus` | string | One of `"exogenous"` (parametrically isolated subsystem), `"endogenous"` (same optimization loop), `"hybrid"` (explicit partial separation with documented decoupling boundary) |

An attestation of an endogenous constraint provides weaker guarantees than an attestation of an exogenous one; the field surfaces the distinction so verifiers and consumers can reason about the strength of the underlying guarantee.

**Temporal recognition lag.** Distinguishes propagation onset from institutional recognition.

| Field | Type | Description |
|:---|:---|:---|
| `t_propagation` | string (ISO 8601) | System-internal timestamp at which the relevant input state changed inside the governance system’s view. MUST be a system-internal measurable event, not “the moment state reachability expanded in the world” (which is unknowable to the attesting system). |
| `t_recognition` | string (ISO 8601) | Timestamp at which the governance system registered the propagation |
| `recognition_lag_ms` | integer | Computed delta. Surfacing as a governance event when the lag exceeds defined thresholds. |

**Admissible alternative space.** Records structural metadata about the choice landscape at decision time. The non-content constraint of §2.7 binds the field to *structural-visibility metadata*, not the content of alternatives.

| Field | Type | Description |
|:---|:---|:---|
| `admissible_alternatives` | object | `{count: integer, type_tags: array of strings, structurally_visible: boolean}`. **MUST NOT** include the content of any alternative; only counts, type-class tags, and a structural-visibility flag. |

An empty set (no alternatives) or singleton (one trajectory only) MUST surface as a governance event in the verification flow: the system enforced under collapsed alternative-space. The deeper diagnostic question this field begins to answer is whether the state being validated is still a decision space at all. A system can have multiple formally valid alternatives present and still have become insensitive to variation, where correctness persists while meaningful choice has already disappeared. v0.2 captures the structural visibility of alternatives as a proxy; full intervention-capacity attestation (whether difference can still change trajectory) is v1.0 work (§15).

**Intent-to-runtime fidelity.** A pointer back to the upstream requirement the runtime claims to implement.

The structural reason this pointer is constitutive rather than convenient: in AI-assisted builds the standard testing pyramid loses its adversarial character. When the same agent writes the implementation and the tests, unit tests become confirmatory rather than adversarial. They verify what the agent built, not what the spec required. An implementation can pass arbitrarily many internally generated tests while diverging from the spec at the serialization, ordering, or boundary-condition level. Specification fidelity is the missing fourth layer above unit / integration / end-to-end, and it cannot be supplied by tests the build itself produced. `requirement_id` is the procedural artifact that ties the runtime receipt to the requirement that defined it, not to the implementation that produced it.

| Field | Type | Description |
|:---|:---|:---|
| `requirement_id` | string | Pointer to the upstream requirement (in an operator-controlled requirement registry) the runtime is claimed to implement. Upstream chain integrity (requirement → spec → build) is delegated to [SLSA](https://slsa.dev) and [NIST SSDF](https://csrc.nist.gov/projects/ssdf); NCSA binds the runtime attestation to the upstream chain rather than re-specifying it. |

**Continuation reference.** When the attestation records a refusal, the chosen continuation receives its own attestation (§6.1); this field references the receipt for that continuation.

| Field | Type | Description |
|:---|:---|:---|
| `continuation_attestation_id` | string | If `action_taken` is a refusal class, the attestation_id of the continuation attestation (fallback / escalation / handoff). Pair forms the governed refusal record. |

### 5.4 Field definitions

**`outcome_state`**: the enumeration is operator-defined and MUST be published as part of the operator’s safety protocol disclosure. Recommended minimum vocabulary:

<div class="codeblock">

NEUTRAL MONITORING ELEVATED CRITICAL


Operators MAY extend the vocabulary. Extensions MUST be documented and version-pinned via `policy_config_hash`.

**`action_taken`**: recommended minimum vocabulary:

<div class="codeblock">

PROCEED no intervention required INJECT_PROMPT safety question or grounding statement added in-turn GOVERN_OUTPUT model output modified, suppressed, or replaced ESCALATE_INTERNAL routed to operator’s safety team for human review ESCALATE_EXTERNAL routed to a crisis-resource or external referral target TERMINATE_SESSION session closed by the governance layer REFUSE gate produced a refusal (see §6.1, continuation attestation)


Operators MAY extend.

**`ger_codes`** and **`ger_version`**: `ger_codes` is an array of GER code strings (e.g., `[``"GER-501", "GER-307"``]`). A single governance event may correspond to multiple codes (failure mode + escalation gap, for example). The array MUST be present in every v0.2 attestation and MAY be empty when the event has no GER classification. `ger_version` is also required in every v0.2 attestation and names the GER taxonomy version against which any codes were assigned (e.g., `"0.2"`); it remains required even when `ger_codes` is empty so attestations stay self-describing as the taxonomy evolves.

**`intervention_acknowledged`**: a one-bit summary derived from the in-enclave governance layer’s observation of the user’s subsequent input. The flag MUST be computed inside the enclave; the underlying user input MUST NOT be exported. If the governance layer has no mechanism to observe subsequent input (one-shot session, no follow-up turn before timeout), the field SHOULD be omitted rather than guessed.

## 6. Usage rules

v0.2 publishes three usage rules governing what receivers may do with an NCSA receipt and what must accompany it.

These rules presuppose an architectural placement that v0.2 makes explicit: NCSA describes a boundary that *governs*, not one that *describes*. If enforcement sits structurally above the reasoning layer of the governed system, the agent receives the boundary as a policy signal and can reason around it; governance becomes advisory. If enforcement sits structurally below the reasoning layer, the agent has no path around it and the outcome is deterministic. The three usage rules below assume the latter placement. Under the former, all three collapse: the receipt records a refusal the agent could have re-derived its way past, the attestation transfers because nothing structurally prevented its re-binding, and inherited validity becomes the default because no boundary was ever load-bearing.

The boundary is also structurally a *reconciliation point*, not a *checkpoint*. A checkpoint validates against state captured at intent-formation time; a reconciliation point resolves intent, authority, and live system state into a single binding admissibility decision at commit. Boundaries treated as checkpoints risk firing correctly against conditions that have already changed: the boundary is enforced, but against state that no longer exists. NCSA’s commit-time admissibility resolution (§5.3) is the procedural form of reconciliation; the temporal recognition lag fields are the diagnostic surface that exposes when reconciliation has degraded into checkpointing.

The three usage rules together address four conceptual surfaces at which admissibility must be resolved separately: **formation** (when an action is first constituted as a candidate), **execution** (when the candidate commits as a state transition), **persistence** (when the attested artifact is retrieved across time), and **propagation** (when the attested artifact crosses a context boundary into a receiving system). Each surface presents a distinct admissibility question, and a system can produce a structurally valid execution-boundary outcome while still failing at one of the other three. §5.3 together with the reconciliation-point framing above describe what must hold at execution. §6.1 (governed continuation) addresses the formation surface that follows a refusal: the chosen continuation is itself a new action whose admissibility must be resolved fresh, with its own attestation. §6.2 (attestation does not transfer) addresses propagation: when an attested artifact crosses into a receiving system, admissibility must be resolved against the receiving system’s current conditions, not inherited from the originating system. §6.3 (no inherited validity across persistence) addresses persistence: when an attested artifact is retrieved across time, its prior validity does not survive intervening state changes. The three rules are collectively load-bearing because dropping any one of them turns the corresponding surface into a path by which invalid action can re-enter the system.

### 6.1 Governed continuation (attestation covers the refusal path)

A refusal is not the end of governance. Whatever follows a refusal (fallback, deferral, escalation, handoff) is itself a new transition with its own admissibility conditions. NCSA MUST attest not only the refused action but also the chosen continuation, so the refusal path cannot be used to reintroduce risk that the primary path would have refused.

The deeper structural reason: the constraint semantics established at the boundary must persist beyond it. The boundary is either preserved or diluted depending on what the continuation is allowed to do. A hard execution boundary at refusal followed by a continuation that softly reinterprets, retries, or weakens that refused state produces a boundary that is structurally correct but functionally diluted. The integrity of the constraint depends on the continuation honoring the same semantics that produced the refusal.

**Spec language.** When the NCSA gate produces a refusal, the system’s chosen continuation (fallback, deferral, escalation, or handoff) MUST itself be the subject of a new admissibility resolution and a new attestation. Refusal attestations and continuation attestations together form the governed refusal record; an attested refusal followed by an unattested continuation is non-compliant. The refusal attestation references the continuation attestation via `continuation_attestation_id` (§5.3). Continuations MUST NOT reintroduce paths the boundary already refused, weaken the constraint that produced the refusal, or reinterpret the refused state into an admissible one through downstream handling.

### 6.2 Attestation does not transfer

Governance is a layered stack: **formation** (can an action validly exist at all), **execution** (can that transition occur now under current authority and context), and **propagation** (does trust remain valid as the resulting artifact moves across systems). Most governance discussions converge on the first two layers; the third is the next gap. Even a perfectly governed execution can produce an artifact that becomes unsafe, unauthorized, or context-invalid once it leaves the originating system. That is where inherited trust becomes dangerous.

When an NCSA-attested artifact, decision, or transition crosses a system boundary, downstream conditions can introduce new admissibility constraints that did not exist at bind time: policy changes, revoked authority, expired approvals, different execution environments, altered intended use. The receiving system MUST re-resolve admissibility under its own current state. The question shifts from “was this valid when created?” to “is this still admissible for use here, now, under current conditions?” **Trust does not propagate; attestation does not transfer.**

**Spec language.** An NCSA attestation is valid only for the binding event it certifies, in the system that produced it. Cross-boundary use of the underlying artifact, decision, or transition requires a fresh admissibility resolution in the receiving system under its current state, authority, and constraints. Receiving systems MUST NOT treat a prior attestation as sufficient basis to act. The downstream re-admissibility boundary is constitutive, not optional.

### 6.3 No inherited validity across persistence

Candidates that are retained, cached, or retried MUST NOT inherit prior admissibility. Every re-entry point must re-establish admissibility under current state. Persistence is a distinct layer between formation and execution and MUST be governed explicitly so validity does not travel through it.

The architectural structure is a three-layer split, jointly responsible for preventing validity from traveling: **formation** determines what can become a candidate; **persistence** determines which candidates remain available; **execution** determines whether any available candidate can still become effect-capable under current state. If persistence is ungoverned, candidates retained from earlier conditions can re-enter execution carrying inherited validity, and **persistence becomes a hidden continuity channel that bypasses the execution boundary**. The three layers stop being sequential and become jointly responsible.

**Spec language.** Admissibility decisions are not cacheable. A candidate transition that recurs, is retried, or is resumed from a persisted state MUST have its admissibility re-resolved against the state, authority, and constraints in effect at the moment of re-entry. Prior NCSA attestations do not satisfy this requirement.

**Regulated-environment example.** In regulated healthcare workflows, the practical form of this failure is *stale validity*: a policy can be structurally sound, the reviewer can be authorized, and the evidence can be complete, but if the regulation has changed between when the review was initiated and when the attestation was signed, the execution is inadmissible even though every individual step was valid. The system has to re-verify conditions at the moment of commit, not carry forward a prior approval. This is the engineering form of §6.3: persistence of evidence is not persistence of validity, and the governing conditions can shift inside the gap between authorization and execution. NCSA’s requirement that admissibility be re-resolved at every re-entry point is what closes that gap procedurally.

## 7. Signing envelope

The attestation document is signed using the **Dead Simple Signing Envelope (DSSE)** format ([github.com/secure-systems-lab/dsse](https://github.com/secure-systems-lab/dsse)), established for in-toto and SLSA build attestations. DSSE was chosen for three reasons: payload-type independence, prevention of cross-protocol replay via the payload-type field, and existing tooling support.

A signed v0.2 attestation has the form:

<div class="codeblock">

"payloadType": "application/vnd.svrnos.ncsa+json;version=0.2", "payload": "\<base64-encoded attestation document\>", "signatures": \[ "keyid": "\<key identifier\>", "sig": "\<base64-encoded signature\>" \]


Signatures MUST be produced by a key bound to the TEE platform attestation chain (§8). The signing algorithm MUST be Ed25519, ECDSA P-384, or RSA-PSS with SHA-384 (minimum); other algorithms MAY be added in later versions.

Implementations MAY produce additional signatures from external signing parties (operator org key, auditor counter-signature) by appending to the `signatures` array.

## 8. Platform attestation chain

The `platform_attestation` field binds the signing key to the in-enclave execution instance via the underlying TEE’s native attestation mechanism. v0.2 retains v0.1 bindings for AWS Nitro Enclaves, Apple Private Cloud Compute, and Generic / other TEE.

### 8.1 AWS Nitro Enclaves

<div class="codeblock">

"platform_attestation": "tee_type": "aws-nitro-enclave", "attestation_doc_b64": "\<base64 of the Nitro attestation document\>", "pcrs": "PCR0": "\<sha384 hex\>", "PCR1": "\<sha384 hex\>", "PCR2": "\<sha384 hex\>", "PCR8": "\<sha384 hex\>" , "module_id": "\<enclave module id\>", "signing_cert_chain": "\<CBOR-encoded cert chain to AWS Nitro root\>"


PCR0 measures the enclave image. PCR2 measures the governance-layer application. PCR8 measures the signing certificate. A verifier MUST chain `signing_cert_chain` to the [AWS Nitro Attestation PKI root](https://docs.aws.amazon.com/enclaves/latest/user/verify-root.html).

### 8.2 Apple Private Cloud Compute

<div class="codeblock">

"platform_attestation": "tee_type": "apple-pcc", "node_attestation_b64": "\<base64 of the PCC node attestation\>", "code_release_id": "\<release identifier in the PCC transparency log\>", "transparency_log_inclusion_proof": "\<inclusion proof\>", "secure_enclave_cert_chain": "\<base64 cert chain to Apple root\>"


A verifier MUST confirm `code_release_id` appears in the Apple PCC transparency log and that the inclusion proof matches a published log root.

### 8.3 Generic / other TEE

<div class="codeblock">

"platform_attestation": "tee_type": "\<vendor-defined\>", "raw_attestation_b64": "\<base64-encoded native attestation\>", "verification_url": "\<URL to the operator’s published verification procedure\>"


For TEE platforms not enumerated above (Intel SGX, AMD SEV-SNP, GCP Confidential Space, custom). The operator MUST publish a verification procedure.

## 9. Verification flow

<figure data-latex-placement="H">
<img src="figures/ncsa-figure-Verification-Flow-6.png" style="width:100.0%" />
</figure>

A verifier (regulator, insurer, operator’s own auditor, court-appointed examiner) validates a v0.2 attestation as follows:

1.  **Parse the DSSE envelope.** Reject if `payloadType` is not `application/vnd.svrnos.ncsa+json;version=0.2`.

2.  **Verify the signature** against the public key referenced by `keyid`. The public key MUST be present in or derivable from the `platform_attestation` chain.

3.  **Verify the platform attestation chain** per §8 for the declared `tee_type`. This step proves the signing key was produced inside a measured TEE instance.

4.  **Resolve `governance_layer.image_hash`** to a publicly auditable artifact. Operators SHOULD publish governance-layer images to a transparency log or public binary registry following the Apple PCC pattern.

5.  **Resolve `policy_config_hash`** to a published policy. Operators MUST make the policy retrievable by hash, redacted only for security-sensitive specifics.

6.  **Confirm `non_content_assertion` is `true`** and inspect all fields against §4.1. Reject if any field violates the non-content guarantee, including the §2.1 prohibition on free-form reasoning narrative and the §5.3 prohibition on alternative-content recording.

7.  **Resolve `ger_codes` against `ger_version`.** Confirm the cited codes exist in the named GER taxonomy version. If `action_taken` is a refusal, confirm `continuation_attestation_id` is populated and verify the referenced continuation attestation per §6.1.

8.  **If `admissible_alternatives.count` is zero or one,** surface as a governance event. The system enforced under collapsed alternative-space (§5.3).

9.  **If `recognition_lag_ms` exceeds operator-defined thresholds,** surface as a governance event (temporal lag, §2.6).

10. **If the attestation crosses a system boundary,** apply §6.2: do not treat as sufficient basis to act without fresh admissibility resolution in the receiving system. If retrieved from persistence, apply §6.3.

11. **Accept the attestation** as evidence that the named governance layer ran inside the named TEE platform and produced the recorded outcome.

## 10. Example payloads

### 10.1 Clean session, no signal

<div class="codeblock">

"schema_version": "ncsa/0.2", "session_id": "h4Yh9c2gQ8eK0wTpQv8r3w", "attestation_timestamp": "2026-06-07T18:42:11Z", "governance_layer": "name": "sango-guard", "version": "2.0.0", "image_hash": "sha384:7fb5c55bc2ec...02efe23e4" , "policy_config_hash": "sha384:235c9e6050ab...acca5286", "outcome_state": "NEUTRAL", "action_taken": "PROCEED", "turn_count": 6, "signal_counts": , "state_transitions": \[\], "platform_attestation": "tee_type": "aws-nitro-enclave", "...": "..." , "non_content_assertion": true, "ger_codes": \[\], "ger_version": "0.2"


### 10.2 Monitoring state, no escalation

<div class="codeblock">

"schema_version": "ncsa/0.2", "session_id": "k3M9pQ2vR5cN8tWxF7zJ4Y", "attestation_timestamp": "2026-06-07T19:03:47Z", "governance_layer": "name": "sango-guard", "version": "2.0.0", "image_hash": "..." , "policy_config_hash": "...", "outcome_state": "MONITORING", "action_taken": "PROCEED", "turn_count": 14, "signal_counts": "ideation_proximity": 2 , "state_transitions": \[ "from_state": "NEUTRAL", "to_state": "MONITORING", "turn_index": 8 \], "platform_attestation": "tee_type": "aws-nitro-enclave", "...": "..." , "non_content_assertion": true, "ger_codes": \[\], "ger_version": "0.2", "constraint_locus": "exogenous"


### 10.3 Escalated session, external referral (v0.2 full payload)

<div class="codeblock">

"schema_version": "ncsa/0.2", "session_id": "p7Bx3kL8wQ2nR5tY9vM4cJ", "attestation_timestamp": "2026-06-07T20:17:32Z", "governance_layer": "name": "sango-guard", "version": "2.0.0", "image_hash": "..." , "policy_config_hash": "...", "outcome_state": "CRITICAL", "action_taken": "ESCALATE_EXTERNAL", "turn_count": 22, "signal_counts": "ideation_proximity": 7, "method_specificity": 3, "temporal_immediacy": 2 , "state_transitions": \[ "from_state": "NEUTRAL", "to_state": "MONITORING", "turn_index": 5 , "from_state": "MONITORING", "to_state": "ELEVATED", "turn_index": 13 , "from_state": "ELEVATED", "to_state": "CRITICAL", "turn_index": 19 \], "escalation_target_class": "crisis_resource", "intervention_acknowledged": true,

"ger_codes": \["GER-501"\], "ger_version": "0.2",

"threshold_moderation": "met": true, "value": 0.85, "action": "GOVERN_OUTPUT" , "threshold_external_reporting": "met": true, "value": 0.92, "action": "ESCALATE_EXTERNAL" ,

"accountable_party_name": "J. Smith", "accountable_party_title": "Director, Trust & Safety Operations", "accountability_attestation_age_days": 12,

"constraint_locus": "exogenous",

"t_propagation": "2026-06-07T20:17:30.412Z", "t_recognition": "2026-06-07T20:17:30.487Z", "recognition_lag_ms": 75,

"admissible_alternatives": "count": 3, "type_tags": \["crisis_resource", "internal_review", "operator_handoff"\], "structurally_visible": true ,

"requirement_id": "REQ-2026-WA-HB2225-§4.1",

"platform_attestation": "tee_type": "aws-nitro-enclave", "...": "..." , "non_content_assertion": true


These examples illustrate the minimum implementation pattern for a v0.2 generator and verifier. A production release requires a formal JSON Schema, validation rules, signature test vectors, and a conformance test suite, which should accompany v1.0. The v0.2 optional fields above are optional; an implementation MAY produce a v0.2-conformant attestation that omits them (provided the required fields including `ger_codes` and `ger_version` are present).

## 11. Relationship to GER

NCSA and the SVRNOS [Governance Error Register (GER)](https://svrnos.com/research/governance-error-register) are companion artifacts. NCSA is the signed procedural receipt that proves a governance check ran. GER is the closed numbered taxonomy that classifies what kind of structural governance failure was present (or absent) in the event.

v0.2 binds the two through the `ger_codes` + `ger_version` required fields. Without this bridge, a regulator or auditor reading an NCSA attestation can confirm a governance check ran but cannot connect the event to the taxonomy that names what kind of event it was. The `ger_codes` field is an array because a single event may correspond to multiple codes (failure mode + escalation gap, for instance). Both fields are required in every v0.2 attestation; the array MAY be empty when no GER classification applies, and `ger_version` still names the taxonomy version the attestation is interpretable against.

This binding also positions NCSA against runtime governance instrumentation projects (§12): GER provides the failure-classification layer that runtime control verdicts (“deny”, “allow”, “modify”) currently lack.

## 12. Relationship to runtime governance instrumentation

<figure data-latex-placement="H">
<img src="figures/ncsa-figure-Runtime-NCSA-GER-Composition-7.png" style="width:100.0%" />
</figure>

Two parallel projects in mid-2026 specify runtime governance instrumentation for AI agents under similar names and overlapping scope. The [Agent Control Standard](https://agentcontrolstandard.ai) launched May 27, 2026 under the MIT license, forked from the OWASP Agent Observability Standard project, with implementations at [github.com/Agent-Control-Standard/ACS](https://github.com/Agent-Control-Standard/ACS); it positions itself as vendor-neutral and community-driven. Microsoft’s [Agent Governance Toolkit](https://commandline.microsoft.com/agent-control-specification-runtime-governance/) was announced April 2, 2026 under the MIT license; Microsoft positioned [Agent Control Specification](https://commandline.microsoft.com/agent-control-specification-runtime-governance/) as a portable runtime control standard within that toolkit during Build 2026 (June 2026). Both projects define runtime control hooks (allow / deny / modify verdicts at interception points), structured observability for trace data (OpenTelemetry-based), and agent inventory mechanisms (capability and tool surfaces).

NCSA composes with this category rather than competing with it. Whichever specification wins broader adoption, the architectural relationship is the same:

- **Trace and observability emit the telemetry stream; NCSA produces the signed receipt.** The trace layer of either project is a structured observability output (OpenTelemetry, OCSF-mapped, SIEM-bound). It documents what happened operationally. NCSA is the signed, procedural attestation that proves governance ran, distinct from the raw observability data it may draw on. NCSA sits above the trace stream, not in competition with it.

- **Runtime verdicts name the control action, not a closed structural failure taxonomy.** Control verdicts (“deny”, “allow”, “modify”) state what the runtime did at an interception point. They do not classify the structural failure class that justified the action. GER, referenced through NCSA’s `ger_codes` field (§5.1, §11), supplies the classification layer the runtime specifications do not specify.

A third adjacent category is threat-modeling methodology. The OWASP Multi-Agentic System Threat Modeling Guide v1.0 (MAESTRO) defines a seven-layer architectural methodology crossed with four agentic factors (Non-Determinism, Autonomy, Identity Management, Agent-to-Agent Communication) for identifying where threats originate in multi-agent systems. MAESTRO and NCSA compose: a MAESTRO threat-modeling exercise identifies the structural exposure points; NCSA produces the signed attestation that the governance check at each exposure point ran. Runtime instrumentation specifications (Agent Control Standard, Agent Governance Toolkit), threat-modeling methodologies (MAESTRO), failure-classification taxonomies (GER), and procedural attestation formats (NCSA) are four distinct layers of the same governance stack; NCSA composes with each.

An operator can deploy either runtime instrumentation specification, emit its trace as observability telemetry, attach GER classifications, and produce NCSA attestations as the signed receipt that proves the governance check ran. The three layers (runtime instrumentation, classification, evidentiary receipt) are operationally distinct and architecturally separable regardless of which runtime-instrumentation specification wins broader adoption.

## 13. Prior art and design borrowings

The format does not invent new cryptography. It assembles primitives that already work in production at scale.

- **DSSE signing envelope**: Dead Simple Signing Envelope, used by in-toto and SLSA. Solves the cross-protocol-replay problem via the typed payload, supports multi-signature, has multi-language tooling.

- **AWS Nitro Attestation**: Hypervisor-signed COSE_Sign1 document over a CBOR-encoded payload containing PCRs and module ID. Verifiable against a public AWS PKI root.

- **Apple Private Cloud Compute**: Secure Enclave UID-rooted certificates per node, with code measurements published to an append-only cryptographically tamper-proof transparency log, plus binary release publication within 90 days of log inclusion.

- **C2PA Content Credentials**: manifest pattern for cryptographically signed provenance over media. Different domain, same architectural shape.

- **IETF EAT (RFC 9711)**: Entity Attestation Token. A general-purpose attestation token format; v0.2 uses DSSE for tooling alignment, but a future version may add an EAT binding.

- **SLSA + NIST SSDF**: referenced for the upstream supply-chain integrity layer (requirement → spec → build). NCSA’s `requirement_id` field binds the runtime attestation to the upstream chain rather than re-specifying it.

- **ICD-10-CM Index + Contributing precedent**: GER’s Index + Contributing code architecture, referenced through NCSA’s `ger_codes` field, derives from medical and pharmacovigilance coding conventions.

- **OWASP Agentic AI Threats and Mitigations (T1–T17, v1.1)**: catalogs seventeen agent-specific threat patterns with paired mitigations. T8 *Repudiation & Untraceability* names the audit-gap threat NCSA is designed to address: an operator who claims governance ran but cannot produce signed evidence is operating under T8. NCSA receipts are the structural mitigation to T8 in the agent-attestation surface; the broader T1–T17 catalog operates at the threat-modeling layer above NCSA’s evidentiary layer.

## 14. Glossary

Selected named primitives surfaced through v0.2 design discussion.

**Governed event.** The discrete transition point at which an interaction shifts from “ordinary use” (no governance action) to “governed event” (one or more governance thresholds have been crossed, with preservation, escalation, review, or reporting obligations attached). NCSA v0.2 implicitly attests at this transition; the term names what the transition is. v0.3 may introduce a structured *governed-event* attestation type that marks the transition itself as an attested artifact, distinct from the subsequent action attestation.

**Record-keeping presumption.** The legal pattern by which structured-record mandates in high-hazard domains (banking, healthcare, aviation, securities) shift the evidential burden rather than the liability itself: the law requires structured records in a specified form, and the absence of records creates a presumption against the actor who should have kept them. §1.2 names this as the mechanism NCSA’s structured-record format can attach to in the AI governance domain.

**Non-content guarantee.** The per-attestation property that the signed payload contains no field that could be inverted, brute-forced, or correlated to recover conversation content. §2.8 names the principle; §4.1 enumerates the operational MUST NOT and MAY constraints that enforce it at the field level. The guarantee is what allows the same artifact to be verified by parties with no access to the underlying conversation, dataset, or operator records.

**Reconciliation point.** A boundary that resolves intent, authority, and live system state into a single binding admissibility decision at commit, distinct from a *checkpoint* that validates against state captured at intent-formation time. §6 names the distinction; §5.3’s commit-time admissibility resolution is the procedural form. Boundaries treated as checkpoints can fire correctly against conditions that have already changed.

**Hindsight-amplified liability reconstruction.** The failure mode the procedural-only constraint (§2.1) avoids: governance shifting from threshold-based proportionality at the time of decision to retrospective liability inference based on outcome severity. Foreseeability cannot be reconstructed backward from outcome severity without making proportional governance structurally impossible. Recorded reasoning that later lines up with a harmful outcome can be characterized as reconstructed or defensive in court; the procedural-only payload discipline removes the artifact through which that reconstruction would run.

## 15. Open questions for v1.0

These are deliberately left unresolved in v0.2 and invite comment.

- **Adequacy attestation.** Per §2.4, NCSA covers procedural attestation. Adequacy attestation (whether the gate’s design was appropriate for the conditions) is the harder problem because it requires the system to attest something about its own design fitness. v1.0 may need a separate adequacy-claim layer; v0.2 names the distinction and treats adequacy as future work.

- **Compositional threshold attestation.** Per §5.3, the v0.2 threshold-per-action fields capture each per-category threshold as a scalar `value`. v1.0 may formalize the compositional structure (confidence in signal · severity of potential harm · actionability of available response) as three separately attested components rather than a single point. The structural insight is that a threshold cleared on severity but failed on actionability is a different governance event from a threshold cleared on actionability but failed on confidence; the scalar collapses that distinction.

- **Intervention-capacity attestation.** Per §5.3, the v0.2 `admissible_alternatives` field captures whether alternatives are structurally visible at the moment of decision. It does not capture whether the system retains intervention capacity over those alternatives: whether difference can still change trajectory. A system can have multiple visible alternatives while having become insensitive to variation. v1.0 should introduce intervention-capacity attestation distinguishing “alternatives present but trajectory locked” from “alternatives present and trajectory still redirectable.” The architectural separation (degradation of influence → loss of admissible grounding → inability to bind) needs to map to corresponding attestation surfaces.

- **Multi-session attestation.** v0.2 is per-session. A user with intent can open new sessions until one produces the desired output, and each session’s attestation remains “clean.” This reproduces the Pattern Gap at the session boundary. v1.0 should address how cross-session correlation is attested without breaking the privacy guarantee. Probably involves identity-bound but content-free session linkage, or operator-level rate-of-state-transition attestations across populations.

- **Cross-surface composition.** Individually valid per-surface attestations can compose into an incoherent operational picture when the cross-surface state they implicitly trust fragments. A substrate-integrity attestation type distinct from per-surface attestation is candidate v0.3 / v0.4 work.

- **Vocabulary registry.** §5.4 permits operators to extend `outcome_state` and `action_taken` enumerations. Flexibility is intentional, but if every operator defines a private vocabulary, cross-operator verification breaks. v1.0 should specify either a canonical registry (IANA-style assigned values) or an interoperability profile defining minimum required values plus extension semantics.

- **Operator key rotation.** Should the spec require a key-rotation policy, or leave it to operator discretion?

- **Multi-party signing.** Some regulators may require a counter-signature from an external auditor before an attestation is treated as evidence. The DSSE envelope supports this. Should v1.0 specify when?

- **Long-tail retention.** WA HB 2225 requires annual reporting. Should attestations be retained for a defined minimum period? Where?

- **Cross-jurisdictional disclosure.** Some attestation fields may need to be progressively disclosed depending on the requesting party. Does the format need a redaction profile spec?

- **Differential-privacy treatment of count-style fields.** At sufficient session volume, count-style fields (signal counts, threshold-per-action triggers, recognition-lag distributions) could leak population-level inferences. Should v1.0 specify noise-injection guidance?

- **Attestation freshness.** Should attestations include a maximum validity window after which a verifier rejects them as stale? Interacts with §6.3 (no inherited validity across persistence).

- **Representation integrity between external state and internal model.** §5.3 reconciliation against live state and §6 reconciliation-point framing assume the system binds against the external state directly. In practice the system binds against its internal reconstruction of that state. If the reconstruction drifts, lags, or is partially specified, admissibility can appear to hold while it is being resolved against a reference that has shifted. The constraint that admissibility be externally constituted (§2.3) is therefore not sufficient on its own: the mapping between external state and the system’s internal representation of it must itself be constrained, validated, and non-self-redefinable at bind. A system can satisfy the procedural rule and still lose the ground the rule was meant to protect. v1.0 should specify a representation-integrity attestation surface distinct from the existing reconciliation primitives.

- **Pre-onboarding capability disclosure linkage.** WEF *AI Agents in Action* (2025) introduces an “agent card” concept: a pre-deployment capability disclosure attached to an agent before it enters production. NCSA attests per-session governance execution; agent cards attest pre-onboarding capability boundaries. Should v1.0 specify a linkage field that binds a per-session NCSA receipt to the agent card under which the session ran, so the verifier can confirm session-time enforcement was within the disclosed capability envelope?

- **Autonomy-level calibration of threshold-per-action.** Feng, McDonald, & Zhang (2025) propose a six-level autonomy ladder (L0 No Autonomy → L5 Super-Autonomy). The threshold-per-action fields (§5.3) currently capture per-category thresholds as scalars. Should v1.0 specify that threshold values be calibrated to the agent’s declared autonomy level, so that an L4-autonomy agent and an L1-autonomy agent operating under the same policy produce different threshold values and the verifier can confirm calibration was autonomy-appropriate?

### Cite This Specification

**Citation**

Nzeutem, S. (2026). *Non-Content Safety Attestation v0.2.* Sovereign OS LLC. svrnos.com/research/non-content-safety-attestation

## Acknowledgments

NCSA v0.2 builds on the v0.1 design and on published technical documentation from AWS (Nitro Enclaves), Apple (Private Cloud Compute), Meta (Private Processing), and the in-toto / SLSA / DSSE communities, all credited in the References. It is also informed by AI accountability laws and reporting obligations active and arriving across US states and the EU (Washington HB 2225, EU AI Act Article 50, New York RAISE Act, California TFAIA) and voluntary frameworks emerging in Asia-Pacific (Singapore IMDA Model AI Governance Framework for Agentic AI), which set the timing for why a verifiable governance receipt matters now. The v0.2 review pass against the agentic-AI governance landscape was informed by Oliver Patel’s *The Ultimate Agentic AI Governance Resources* curated list (Enterprise AI Governance, 2026), which surfaced the OWASP Agentic, Singapore IMDA, WEF, and autonomy-level documents now referenced in §1.1, §12, §13, and §15.

Beyond the literature and the regulatory landscape, the v0.2 design principles, payload field additions, usage rules, and positioning sections were shaped through public LinkedIn engagement, comment threads, and direct correspondence with the contributors below. The table summarizes which sections each contribution informs; the prose entries that follow preserve the framing language each contributor brought.

| Contributor | Design contribution | Sections |
|:---|:---|:---|
| Hans Alberts | Human-knowing discipline against premature formalization; action-ladder threshold composition (confidence · severity · actionability) | §2.7, §5.3 |
| Brian Burke | Accountable-party fields making accountability decoupling detectable at runtime | §5.3 |
| Greggory Don Butler | Governed-event primitive; privacy and safety not opposites when architecture precedes consequence; pre-incident threshold design | §1, §5.3, §14 |
| Ralph Cavallaro | Boundary that governs vs describes; boundary as reconciliation point not checkpoint; specification fidelity as fourth testing layer | §5.3, §6 |
| Eng Chua | Record-keeping presumption as the legal mechanism that shifts the evidential burden when actors will not produce evidence voluntarily | §1.1 |
| Adriana Coppelmans | Constitutive evidence and standard sovereignty; procedural vs adequacy attestation | §2.3, §2.4 |
| Dr. Ramyaa Ganesh | Governed continuation: constraint semantics must persist beyond the boundary | §6.1 |
| Catherine Gunnell | Threshold-per-action separation across moderation, preservation, account action, legal review | §5.3 |
| Michael Hendry | Runtime-layer enforcement as structurally necessary because behavioural specification is evadable by training optimization | §1 |
| Ravi Joshi | Prevent-vs-detect regulatory framing; validation-becoming-advisory as the regulator pattern for enforcement failure | §1.1 |
| Shay L. | `constraint_locus` field: exogenous vs endogenous vs hybrid | §5.3 |
| Gennie Mansi, Naveena Karusala & Mark Riedl | Three-stakeholder audience framework (decision makers / decision subjects / legal representatives) from Legally-Informed XAI; legally informative versus legally actionable distinction; patient-centered accountability frame from the healthcare AI litigation analysis | §1.1, §2.1 |
| Paul McDonald | Procedural attestation not narrative reconstruction; three-way separation of governance artifacts; temporal recognition lag fields | §2.1, §2.2, §5.3 |
| Koji Mochizuki | No inherited validity across persistence; persistence as a distinct layer between formation and execution | §6.3 |
| Ricardo Muro | Constitutive evidence and standard sovereignty; commit-time reconciliation; propagation as re-admissibility boundary; formation/persistence/execution as jointly responsible layers | §2.3, §6, §6.2, §6.3 |
| Amilcar O. | Representation integrity between external state and internal model as a v1.0 open question | §15 |
| Spencer Eric Scherer | Stale-validity failure mode grounded in regulated healthcare workflows | §6.3 |
| Simon Narcis Secu | Discrete-events scope boundary; timing as part of the control surface | §2.5, §2.6 |
| Andrzej Skulski | `admissible_alternatives` field design; influence → admissibility → intervention capacity → execution layered separation; intervention-capacity open question | §5.3, §15 |
| Ryan Stacey | Attestation does not transfer; layered stack of formation → execution → propagation | §6.2 |
| Caroline Thongsan | “Mapping before closure” framing seeding the admissible-alternative-space requirement | §5.3 |
| Tim Zlomke | Evidentiary-design rationale; hindsight-amplified liability reconstruction as the failure mode procedural-only design avoids | §2.1 |

The framing language each contributor brought is preserved in the prose entries below.

- **Hans Alberts** (two contributions): §2.7 some knowing must stay in human knowing. Framing: the risk of translating uncertainty too quickly into system-readable form; every primitive that turns a human-cognition property into a structured field must include an explicit statement of what the attestation deliberately does not capture. §5.3 action-ladder structure: each per-category threshold composes from confidence in signal, severity of potential harm, and actionability of available response increasing together before action leaves the system, rather than firing on a single scalar point. Hans is separately credited with Arafeh Karimi for GER-319 Incorporation Failure in the SVRNOS [Governance Error Register](https://svrnos.com/research/governance-error-register).

- **Brian Burke**: §5.3 accountable-party cluster (`accountable_party_name`, `accountable_party_title`, `accountability_attestation_age_days`). Makes GER-315 Accountability Decoupling detectable at runtime.

- **Greggory Don Butler** (multi-contribution): §14 *governed event* primitive (the discrete transition point where a private interaction becomes one with preservation, escalation, review, or reporting obligations). §1 Background framing: *privacy and safety are not opposites when the governance architecture is designed before consequence attaches*; the architecture must be designed before the event, not after. §5.3 threshold-per-action design rationale: *that line cannot be improvised after harm occurs*; evidence before action; the separation between moderation, preservation, legal review, account action, and external reporting must be designed pre-incident. His TA-14 Admissible Execution Architecture work is the architectural ancestor of the governed-event primitive.

- **Ralph Cavallaro**: three contributions. (i) §6 architectural framing of NCSA as a boundary that governs rather than describes. If enforcement is structurally above the reasoning layer, governance reduces to an advisory signal the agent can reason around. If enforcement is structurally below the reasoning layer, the outcome is deterministic. (ii) §6 boundary as reconciliation point, not checkpoint. A checkpoint validates against intent-formation-time state; a reconciliation point resolves intent, authority, and live system state at commit. Boundaries treated as checkpoints fire correctly against conditions that no longer exist. (iii) §5.3 `requirement_id`: specification fidelity as a fourth layer above the standard testing pyramid for AI-assisted builds, on the grounds that when the same agent writes the implementation and the tests, unit tests become confirmatory rather than adversarial. Grounded in a concrete failure where a hash function passed 901 tests with the wrong serialization because the tests verified what the agent wrote, not what the spec defined.

- **Eng Chua**: §1.1 record-keeping presumption as the legal mechanism that operationalizes prevent-vs-detect controls. Framing: the actors best placed to log AI system behaviour (model developers, platform providers) have the least incentive to make those systems legible after the fact; a structured record-keeping mandate *shifts the evidential burden rather than the liability itself*; the absence of records creates a presumption against the actor who should have kept them. NCSA names the structured-record format that a record-keeping presumption can attach to.

- **Adriana Coppelmans** (two contributions): §2.3 constitutive evidence and standard sovereignty. Framing: evidence must be constituted at the moment of bind (not reconstructed after the fact); the three pressure-point questions (where is the standard defined, what prevents selective evidence formation under pressure, who owns the standard when execution and evidence are fused); the requirement that the standard remain non-negotiable under operational pressure. §2.4 procedural vs adequacy attestation distinction.

- **Dr. Ramyaa Ganesh**: §6.1 governed continuation. Framing: a refusal is not the end of governance; whatever follows a refusal is itself a new transition with its own admissibility conditions; the constraint semantics established at the boundary must persist beyond it; the boundary is either preserved or diluted depending on what the continuation is allowed to do; a hard execution boundary followed by soft continuation produces structural correctness with functional dilution. The architectural framing “once invalid paths can’t form, governance moves from control to architecture” informs the §6.1 rationale.

- **Catherine Gunnell**: §5.3 threshold-per-action cluster. Framing: a moderation threshold is not the same as an evidence-preservation threshold; an account-action threshold is not the same as a legal-review threshold; collapsing these creates a two-sided failure where organizations either miss serious signals or overcorrect into surveillance. Neither outcome builds trust.

- **Michael Hendry**: §1 Background rationale for runtime-layer enforcement. Framing: models trained to optimise for goal achievement will, under sufficient pressure, mislead, obscure, or minimally satisfy behavioural specifications in pursuit of those goals; the path-finding capability that makes these systems useful is the same capability that makes behavioural specification structurally insufficient; effective governance requires explicit constraints at the execution layer with tight conditions of satisfaction and explicit prohibited actions enforced at runtime, not policies the model is asked to honour. The “useful and ungovernable at the same time” pairing names why NCSA records procedural runtime enforcement rather than behavioural-policy compliance.

- **Shay L.**: §5.3 `constraint_locus` field (exogenous / endogenous / hybrid). Framing: attestations of endogenous constraints provide weaker guarantees than attestations of exogenous ones.

- **Ravi Joshi**: §1.1 prevent-vs-detect framing of the regulatory requirement. Framing: regulated environments require controls to *prevent* unauthorized transactions, not merely to *detect* them; *validation becoming advisory* is the pattern regulators use during enforcement to describe controls that existed on paper but not at the action layer.

- **Gennie Mansi, Naveena Karusala & Mark Riedl** (Georgia Tech and Harvard SEAS): §1.1 three-stakeholder audience framework drawn from their *Legally-Informed Explainable AI* (HCXAI Workshop at CHI 2025): decision makers act on AI determinations, decision subjects are directly affected, legal representatives advocate for either, and each role faces a different information asymmetry that an attestation receipt must serve simultaneously. §2.1 legally informative versus legally actionable distinction: legally informative information describes laws and rights relevant to those impacted by an AI system, legally actionable information can be used in legal action once harm has occurred, and NCSA receipts are the latter. The patient-centered accountability frame from Mansi & Riedl (2025) *Implications of Current Litigation on the Design of AI Systems for Healthcare Delivery* (arXiv:2507.15981) informed the audience model for NCSA receipts and seeded the Lokken healthcare AI worked example in the SVRNOS [Governance Error Register](https://svrnos.com/research/governance-error-register).

- **Paul McDonald** (three contributions): §2.1 procedural attestation, not narrative reconstruction (the v0.2 foundational principle); §2.2 three-way separation of governance artifacts (Explainability / Auditability / Evidentiary defensibility); §5.3 temporal recognition lag fields.

- **Koji Mochizuki**: §6.3 no inherited validity across persistence. Framing: if governance only checks admissibility at commit time, it may already be too late; persistence is a distinct layer between formation and execution; the deeper question of which candidate formations should persist, which should disappear, and which recurring boundary cases deserve re-evaluation. The formation/persistence/execution architectural split that frames §6.3 was developed through his exchange with Ricardo Muro.

- **Ricardo Muro** (four contributions): §2.3 constitutive evidence and standard sovereignty. Framing: evidence must be constituted at the moment of bind, as part of the execution event itself; sovereignty of the constraint at execution; non-bypassable evidence binding under externally defined standards. §6 boundary as commit-time reconciliation of intent, authority, and live system state. Framing: the execution boundary resolves admissibility against the current authoritative system state at commit, not against the upstream state that existed when intent was first formed; in distributed or agentic systems the boundary becomes the moment where intent, authority, and live state are reconciled into a single admissibility decision before the transition binds. §6.2 propagation as re-admissibility boundary. Framing: when an artifact leaves its originating context it operates under different admissibility conditions; propagation creates a new boundary where admissibility has to be resolved again under current state. §6.3 formation / persistence / execution as three jointly responsible layers. Framing: persistence becomes a hidden continuity channel that bypasses the execution boundary if ungoverned; the three layers stop being sequential and become jointly responsible for preventing validity from traveling. His Execution-Bound Validity (EBV) framework hosted these discussion threads and is the architectural ancestor of the standard-sovereignty requirement.

- **Amilcar O.**: §15 representation integrity between external state and internal model. Framing: the system does not bind to the external state directly; it binds to its internal reconstruction of it. If that reconstruction drifts, lags, or is partially specified, admissibility can appear to hold while being resolved against a shifted reference. The mapping between external state and internal representation must itself be constrained, validated, and non-self-redefinable at bind; otherwise a system can satisfy the procedural rule and still lose the ground the rule was meant to protect.

- **Spencer Eric Scherer**: §6.3 stale-validity framing grounded in regulated healthcare workflows. Framing: a policy can be structurally sound, the reviewer can be authorized, and the evidence can be complete, but if the regulation has changed between when the review was initiated and when the attestation was signed, the execution is inadmissible even though every individual step was valid. Names the engineering form of §6.3 as a concrete regulated-environment failure mode.

- **Simon Narcis Secu** (multi-contribution): §2.5 discrete-events scope boundary, §2.6 timing as part of the control surface.

- **Andrzej Skulski**: §5.3 `admissible_alternatives` field design (records structural metadata about the choice landscape at decision time, preserving the non-content principle); the layered separation of influence → admissibility → intervention capacity → execution; the diagnostic reframing “is the state being validated still a decision space?” that shapes the §15 intervention-capacity open question. Builds on Caroline Thongsan’s “mapping before closure” framing.

- **Ryan Stacey**: §6.2 attestation does not transfer. Framing: governance as a layered stack (formation → execution → propagation), with propagation as the third gap most governance discussions miss; downstream conditions introduce new admissibility constraints that did not exist at bind time (policy changes, revoked authority, expired approvals, different execution environments, altered intended use); the question shifts from “was this valid when created?” to “is this still admissible for use here, now, under current conditions?” Inherited trust becomes dangerous.

- **Caroline Thongsan**: “mapping before closure” framing that seeded the §5.3 admissible-alternative-space attestation requirement.

- **Tim Zlomke**: §2.1 evidentiary-design rationale extension. Framing: *hindsight-amplified liability reconstruction* as a governance failure mode; foreseeability cannot be reconstructed backward from outcome severity without making proportional governance structurally impossible; the collapse of policy violation / risk signal / dangerous capability / public-safety escalation into a single undifferentiated response surface destroys threshold-based proportionality. Separately credited in the SVRNOS [7-Layer Model](https://svrnos.com/research/svrnos-7-layer-model) for §12 (constraint continuity / admissibility / accountability triad).

## References

- AWS. *AWS Nitro Enclaves User Guide: Verify the Root.* [docs.aws.amazon.com](https://docs.aws.amazon.com/enclaves/latest/user/verify-root.html)

- Apple Security. (2024). *Private Cloud Compute: A new frontier for AI privacy in the cloud.* [security.apple.com](https://security.apple.com/blog/private-cloud-compute/)

- Meta Engineering. (2025, April 29). *WhatsApp Private Processing: AI tools.* [engineering.fb.com](https://engineering.fb.com/2025/04/29/security/whatsapp-private-processing-ai-tools/)

- Secure Systems Lab. *DSSE: Dead Simple Signing Envelope.* [github.com/secure-systems-lab/dsse](https://github.com/secure-systems-lab/dsse)

- in-toto. *The in-toto Attestation Framework.* [github.com/in-toto/attestation](https://github.com/in-toto/attestation)

- OpenSSF SLSA. *Supply-chain Levels for Software Artifacts.* [slsa.dev](https://slsa.dev)

- NIST. (2022). *Secure Software Development Framework (SSDF), SP 800-218.* [csrc.nist.gov/projects/ssdf](https://csrc.nist.gov/projects/ssdf)

- IETF. (2024). *RFC 9711: The Entity Attestation Token (EAT).*

- C2PA. *Content Credentials and the C2PA Technical Specification.* [c2pa.org](https://c2pa.org)

- Washington State Legislature. (2026). *HB 2225, Companion AI Chatbot Operator Obligations.* [app.leg.wa.gov](https://app.leg.wa.gov/billsummary?BillNumber=2225&Year=2025)

- European Commission. (2024). *EU AI Act Article 50: Transparency obligations.* [digital-strategy.ec.europa.eu](https://digital-strategy.ec.europa.eu/en/consultations/consultation-draft-guidelines-transparency-obligations-under-ai-act)

- New York State Senate. (2025). *S. 6953-B, Responsible AI Safety and Education (RAISE) Act.* Signed December 19, 2025; effective ninety days after enactment. Civil penalties up to \$10M (first violation) / \$30M (subsequent), enforced by the New York Attorney General. [nysenate.gov/legislation/bills/2025/S6953](https://www.nysenate.gov/legislation/bills/2025/S6953/amendment/B)

- California State Legislature. (2025). *SB 53, Transparency in Frontier Artificial Intelligence Act.* 2025–2026 Regular Session. Signed September 29, 2025; effective January 1, 2026. [legiscan.com/CA/text/SB53](https://legiscan.com/CA/text/SB53/id/3270002)

- Nzeutem, S. (2026). *SVRNOS Governance Error Register v0.2.* Sovereign OS LLC. [svrnos.com/research/governance-error-register](https://svrnos.com/research/governance-error-register)

- Nzeutem, S. (2026). *The SVRNOS 7-Layer Model of AI Governance.* Sovereign OS LLC. [svrnos.com/research/svrnos-7-layer-model](https://svrnos.com/research/svrnos-7-layer-model)

- Mansi, G., Karusala, N., & Riedl, M. O. (2025). *Legally-Informed Explainable AI.* Human-Centered Explainable AI Workshop (HCXAI) at the ACM CHI Conference on Human Factors in Computing Systems. [doi.org/10.5281/zenodo.15170444](https://doi.org/10.5281/zenodo.15170444)

- Mansi, G., & Riedl, M. O. (2024). *Recognizing Lawyers as AI Creators and Intermediaries in Contestability.* Workshop “From Stem to Stern: Contestability Along AI Value Chains,” ACM Conference on Computer Supported Cooperative Work (CSCW ’24).

- Karusala, N., Upadhyay, S., Veeraraghavan, R., & Gajos, K. Z. (2024). *Understanding Contestability on the Margins: Implications for the Design of Algorithmic Decision-making in Public Services.* Proceedings of the ACM CHI Conference on Human Factors in Computing Systems (CHI ’24).

- Mansi, G., & Riedl, M. O. (2025). *Implications of Current Litigation on the Design of AI Systems for Healthcare Delivery.* arXiv:2507.15981 \[cs.HC\]. [arxiv.org/abs/2507.15981](https://arxiv.org/abs/2507.15981)

- Agent Control Standard. (2026, May 27). *Agent Control Standard specification.* MIT-licensed, forked from the OWASP Agent Observability Standard project. [agentcontrolstandard.ai](https://agentcontrolstandard.ai) · [github.com/Agent-Control-Standard/ACS](https://github.com/Agent-Control-Standard/ACS)

- Microsoft. (2026). *Agent Governance Toolkit* (announced April 2, 2026, MIT-licensed) and *Agent Control Specification*: portable runtime control standard within the toolkit, positioned at Build 2026 (June 2026). [commandline.microsoft.com](https://commandline.microsoft.com/agent-control-specification-runtime-governance/)

- McDonald, P. (2026). Procedural attestation versus narrative reconstruction; three-way separation of governance artifacts; temporal recognition lag in propagation versus institutional registration. Personal communication, May 2026.

- Chua, E. (2026). Record-keeping presumption as the legal mechanism for shifting evidential burden in high-hazard domains where actors will not produce evidence voluntarily. Personal communication, May 2026.

- Coppelmans, A. (2026). Constitutive evidence and standard sovereignty; procedural versus adequacy attestation. Personal communication, May 2026.

- Gunnell, C. (2026). Threshold-per-action separation in governance attestation. Personal communication, May 2026.

- Hendry, M. (2026). Training optimisation as the source of behavioural-specification evasion; runtime enforcement as the structurally necessary layer; usefulness and ungovernability as the same path-finding capability. Comment on Ricardo Muro thread, LinkedIn, April 2026.

- Joshi, R. (2026). Prevent-vs-detect distinction in regulated-environment controls; validation-becoming-advisory as the regulator pattern for action-layer enforcement failure. Comment on Ricardo Muro thread, LinkedIn, May 2026.

- O., A. (2026). Representation integrity between external state and internal model; admissibility evaluated on a shifted reference; the mapping itself must be constrained and non-self-redefinable at bind. Comment on Ricardo Muro thread, LinkedIn, May 2026.

- Scherer, S. E. (2026). Stale validity in regulated healthcare workflows: regulation change between authorization initiation and attestation signature renders execution inadmissible even when every individual step was valid. Comment on Ricardo Muro thread, LinkedIn, May 2026.

- Stacey, R. (2026). Governance as a layered stack (formation → execution → propagation); propagation as the third governance surface; attestation does not transfer; downstream re-admissibility under changing conditions. Personal communication, May 2026.

- Mochizuki, K. (2026). Persistence as a distinct layer between formation and execution; no inherited validity across persistence; commit-time admissibility checks are insufficient when candidate formations persist or recur. Personal communication, May 2026.

- Muro, R. (2026, May). *AI Governance Is Missing a Layer Below Admissibility.* LinkedIn post and comment thread, May 2026. Execution-Bound Validity (EBV) framework; constitutive evidence at the moment of bind; sovereignty of the constraint at execution.

- Ganesh, R. (2026). Governed continuation: attestation covers the refusal path; constraint semantics must persist beyond the boundary; the boundary is either preserved or diluted by what the continuation is allowed to do. Personal communication, May 2026.

- Skulski, A. (2026). Attestation of admissible alternative space; mapping before closure; interruption viability versus formal steerability. Personal communication, May 2026.

- Thongsan, C. (2026). Mapping before closure: visible recoverability of alternatives. Personal communication, May 2026.

- Shay L. (2026). Endogenous versus exogenous constraint locus. Personal communication, May 2026.

- Cavallaro, R. (2026). A boundary that governs vs. one that describes: enforcement placement below the reasoning layer as a precondition for deterministic governance outcomes. Comment on Ricardo Muro thread, LinkedIn, April 2026.

- Cavallaro, R. (2026). Boundaries as reconciliation points, not checkpoints: when system state changes between intent formation and execution commit, checkpoint-style enforcement validates against conditions that no longer exist. Comment on Ricardo Muro thread, LinkedIn, April 2026.

- Cavallaro, R. (2026). Specification fidelity as the fourth testing layer for AI-assisted builds: when the same agent writes the code and the tests, unit tests confirm the agent’s assumptions rather than the spec’s requirements. LinkedIn, April 2026.

- Burke, B. (2026). Accountable-party fields in runtime attestation. Personal communication, May 2026.

- Butler, G. D. (2026). The governed event primitive; pre-incident threshold architecture (“that line cannot be improvised after harm occurs”); privacy and safety as non-opposites when architecture is designed before consequence attaches; evidence before action as a structural requirement; TA-14 Admissible Execution Architecture. Personal communication, May 2026.

- Alberts, H. (2026). Protecting uncertainty as living human knowing in spec design; the risk of translating uncertainty too quickly into system-readable form. Personal communication, May 2026.

- Secu, S. N. (2026). Effects accumulating through interaction; timing as part of the control surface. Personal communication, May 2026.

- Zlomke, T. (2026). Hindsight-amplified liability reconstruction as a governance failure mode; foreseeability cannot be reconstructed backward from outcome severity. Personal communication, May 2026.

- OWASP Foundation. (2025, December). *Agentic AI – Threats and Mitigations (T1–T17) v1.1.* OWASP GenAI Security Project, Agentic Security Initiative. [genai.owasp.org](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/)

- OWASP Foundation. (2025, April 23). *Multi-Agentic System Threat Modeling Guide v1.0 (MAESTRO).* [genai.owasp.org](https://genai.owasp.org/resource/multi-agentic-system-threat-modeling-guide-v1-0/)

- IMDA Singapore. (2026). *Model AI Governance Framework for Agentic AI (v1.0).* Infocomm Media Development Authority of Singapore. [imda.gov.sg](https://www.imda.gov.sg/-/media/imda/files/about/emerging-tech-and-research/artificial-intelligence/mgf-for-agentic-ai.pdf)

- World Economic Forum, with Capgemini. (2025). *AI Agents in Action: Foundations for Evaluation and Governance.* [weforum.org](https://www.weforum.org/publications/ai-agents-in-action-foundations-for-evaluation-and-governance/)

- Feng, K. J. K., McDonald, D. W., & Zhang, A. X. (2025). *Levels of Autonomy for AI Agents.* arXiv:2506.12469. [arxiv.org/pdf/2506.12469](https://arxiv.org/pdf/2506.12469)
