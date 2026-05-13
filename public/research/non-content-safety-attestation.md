# Non-Content Safety Attestation v0.1

**A format specification for verifiable AI governance inside Trusted Execution Environments.**

**Author:** Sushee Nzeutem, SVRNOS
**Version:** v0.1 (draft, open for comment)
**Published:** May 14, 2026
**Status:** Open for public comment through August 14, 2026
**Canonical URL:** https://svrnos.com/research/non-content-safety-attestation
**License:** CC BY 4.0
**Cite as:** Nzeutem, S. (2026). *Non-Content Safety Attestation v0.1: A Format Specification for Verifiable AI Governance Inside Trusted Execution Environments.* Sovereign OS LLC. svrnos.com/research/non-content-safety-attestation

---

## Abstract

Private AI architectures built on Trusted Execution Environments (TEEs) ship a strong privacy guarantee: conversation content does not leave the enclave. They do not, on their own, ship a verifiable safety guarantee: that a governance layer ran, what risk category it detected, and what action it took. This document specifies a format for a **non-content safety attestation**: a signed, cryptographically verifiable statement that an in-enclave governance layer evaluated a session and produced a defined outcome, with no transcript or content recoverable from the attestation itself. The format borrows the envelope pattern from DSSE and in-toto attestations, the platform-attestation chain from AWS Nitro Enclaves, and the transparency-log discipline from Apple Private Cloud Compute. v0.1 is published for public comment. Industry, regulators, and academic reviewers are invited to submit responses through August 14, 2026.

---

## 1. Background

Three regulatory deadlines arrive on or before January 1, 2027:

- [Washington HB 2225](https://app.leg.wa.gov/billsummary?BillNumber=2225&Year=2025) — AI companion chatbot operators must maintain and publicly disclose protocols for detecting and responding to suicidal ideation, self-harm, and eating-disorder content; route users to crisis resources; report annually on referral counts.
- [EU AI Act Article 50](https://digital-strategy.ec.europa.eu/en/consultations/consultation-draft-guidelines-transparency-obligations-under-ai-act) — user disclosure and generated-content marking obligations, applicable August 2, 2026.
- [New York RAISE Act](https://en.wikipedia.org/wiki/Responsible_AI_Safety_and_Education_Act) — frontier developer obligations, penalty structure up to $1M first violation and $3M subsequent, enforced by the NY Attorney General.

In parallel, [Meta's Private Processing](https://engineering.fb.com/2025/04/29/security/whatsapp-private-processing-ai-tools/), [Apple Private Cloud Compute](https://security.apple.com/blog/private-cloud-compute/), and [AWS Nitro Enclaves](https://aws.amazon.com/ec2/nitro/nitro-enclaves/) have made confidential-compute AI inference deployable at production scale. Privacy is solved or solvable. The unsolved layer is **verifiable governance**: how an operator demonstrates, to a regulator, insurer, court, or auditor, that the safety logic the statute requires actually ran inside the private boundary, without exposing the conversation it protected.

This document specifies a format intended to be that demonstration.

The argument for why the format is needed is developed at [svrnos.com/insights/dear-zuck-tee-not-the-problem](/insights/dear-zuck-tee-not-the-problem). This document is the technical companion.

## 2. Scope and non-goals

**In scope.** The format and verification flow for an attestation that asserts:

1. A named governance layer, of a named version, ran inside a TEE.
2. The governance layer evaluated a session ending at a timestamp.
3. The governance layer reached a defined outcome state.
4. The governance layer produced a defined action.
5. No conversation content is recoverable from the attestation.

**Out of scope.**

- The behavior or quality of the governance layer itself. The format attests that something ran; it does not certify what that something is. Quality certification is a downstream concern (operator audits, third-party evaluation, regulatory approval).
- The classifier implementation. The format is implementation-agnostic. An operator may use a rule-based system, a learned classifier, a state machine, an ensemble, or any combination. The attestation describes outcomes, not internals.
- User authentication or identity verification.
- Cryptographic primitive choice beyond establishing minimum requirements.
- Any prescriptive policy on what to detect or how to respond. Policy belongs in the operator's published protocols (per WA HB 2225) or in regulator-issued guidance.

## 3. Threat model and privacy guarantee

The format is designed against three threats:

**T1. Operator post-hoc fabrication.** An operator claims after an incident that "our safety layer detected the trajectory" without evidence the layer ran. The attestation must be signed at session time by a key bound to the TEE platform attestation, making post-hoc fabrication detectable.

**T2. Content leakage through attestation.** An adversary with access to attestations recovers conversation content. The format requires that no field in the attestation contain content derivatives that could be inverted, brute-forced, or correlated to recover transcript material. This is the **non-content guarantee** (§3.1).

**T3. Replay or cross-session substitution.** An attestation from a clean session is presented as evidence for a different session that went wrong. The attestation must bind to a session identifier that is itself non-correlatable to user identity but unique per session, and must include the TEE platform attestation that binds to the in-enclave execution instance.

### 3.1 The non-content guarantee

A Non-Content Safety Attestation MUST NOT contain, or permit reconstruction of:

- Raw or transformed user input
- Raw or transformed model output
- Token-level embeddings, attention maps, or logits derived from input
- Per-turn classifier inputs or feature vectors
- Any data structure of sufficient dimensionality to invert into recognizable content

It MAY contain:

- Cardinal counts (turn counts, signal counts) at session granularity
- Enumerated outcome states from a published vocabulary
- Boolean flags from a published vocabulary
- Hashes of policy configurations and code measurements
- Timestamps

A field that does not clearly fall into the MAY category is presumed disallowed.

### 3.2 Aggregation note

A single attestation is low-risk. The non-content guarantee is a per-attestation property. Implementers should be aware that *aggregating* attestations across millions of sessions can leak population-level statistics that no single attestation reveals. Distributions over `signal_counts`, `turn_count`, and `state_transitions` across a large population can support inferences about user demographics, conversational tendencies, or environmental conditions that the per-session guarantee does not address. Operators publishing aggregate statistics derived from attestations SHOULD apply differential-privacy techniques (noise injection, k-anonymity grouping, or formal DP mechanisms). v1.0 may codify specific guidance; v0.1 flags this as deployment responsibility.

## 4. Attestation document

### 4.1 Required fields

A v0.1 attestation document MUST contain the following fields. Field names are normative; field types follow JSON conventions.

| Field | Type | Description |
|---|---|---|
| `schema_version` | string | `"ncsa/0.1"` for this version |
| `session_id` | string | Non-correlatable session identifier, 128 bits minimum, base64url-encoded |
| `attestation_timestamp` | string | ISO 8601 UTC, session-end |
| `governance_layer` | object | Identification of the layer that ran |
| `governance_layer.name` | string | Operator-assigned name (e.g., `"sango-guard"`) |
| `governance_layer.version` | string | Semantic version of the layer |
| `governance_layer.image_hash` | string | SHA-384 of the deployed image, base64url-encoded |
| `policy_config_hash` | string | SHA-384 of the active policy/threshold configuration, base64url-encoded |
| `outcome_state` | string | Final session state from a published enumeration (§4.3) |
| `action_taken` | string | Final action from a published enumeration (§4.3) |
| `platform_attestation` | object | TEE platform attestation reference (§6) |
| `non_content_assertion` | boolean | MUST be `true`; asserts the attestation complies with §3.1 |

### 4.2 Recommended fields

A v0.1 attestation document SHOULD contain:

| Field | Type | Description |
|---|---|---|
| `turn_count` | integer | Number of user-model turns in the session |
| `signal_counts` | object | Per-category integer counts of detected signals across the session |
| `state_transitions` | array | Ordered list of `{from_state, to_state, turn_index}` transitions |
| `escalation_target_class` | string | If `action_taken` involved escalation, the class of target (e.g., `"crisis_resource"`, `"internal_review"`, `"law_enforcement"`); never an identifier |
| `intervention_acknowledged` | boolean | Whether the user acknowledged a routed intervention (only when applicable) |

### 4.3 Field definitions

**`outcome_state`** — the enumeration is operator-defined and MUST be published as part of the operator's safety protocol disclosure (WA HB 2225 §X). Recommended minimum vocabulary:

```
NEUTRAL
MONITORING
ELEVATED
CRITICAL
```

Operators MAY extend the vocabulary. Extensions MUST be documented and version-pinned via `policy_config_hash`.

**`action_taken`** — recommended minimum vocabulary:

```
PROCEED                  no intervention required
INJECT_PROMPT            safety question or grounding statement added in-turn
GOVERN_OUTPUT            model output modified, suppressed, or replaced
ESCALATE_INTERNAL        routed to operator's safety team for human review
ESCALATE_EXTERNAL        routed to a crisis-resource or external referral target
TERMINATE_SESSION        session closed by the governance layer
```

Operators MAY extend.

**`intervention_acknowledged`**: a one-bit summary derived from the in-enclave governance layer's observation of the user's subsequent input. The flag MUST be computed inside the enclave; the underlying user input MUST NOT be exported in any form. If the governance layer has no mechanism to observe subsequent input (e.g., one-shot session, no follow-up turn before timeout), the field SHOULD be omitted rather than guessed.

## 5. Signing envelope

The attestation document is signed using the **Dead Simple Signing Envelope (DSSE)** format ([github.com/secure-systems-lab/dsse](https://github.com/secure-systems-lab/dsse)), already established for in-toto and SLSA build attestations. DSSE was chosen for three reasons: payload-type independence, prevention of cross-protocol replay via the payload-type field, and existing tooling support.

A signed attestation has the form:

```json
{
  "payloadType": "application/vnd.svrnos.ncsa+json;version=0.1",
  "payload": "<base64-encoded attestation document>",
  "signatures": [
    {
      "keyid": "<key identifier>",
      "sig": "<base64-encoded signature>"
    }
  ]
}
```

Signatures MUST be produced by a key bound to the TEE platform attestation chain (§6). The signing algorithm MUST be Ed25519, ECDSA P-384, or RSA-PSS with SHA-384 (minimum); other algorithms MAY be added in later versions.

Implementations MAY produce additional signatures from external signing parties (operator org key, auditor counter-signature) by appending to the `signatures` array.

## 6. Platform attestation chain

The `platform_attestation` field binds the signing key to the in-enclave execution instance via the underlying TEE's native attestation mechanism. v0.1 specifies bindings for the three production TEE platforms in current operator use:

### 6.1 AWS Nitro Enclaves

```json
"platform_attestation": {
  "tee_type": "aws-nitro-enclave",
  "attestation_doc_b64": "<base64 of the Nitro attestation document>",
  "pcrs": {
    "PCR0": "<sha384 hex>",
    "PCR1": "<sha384 hex>",
    "PCR2": "<sha384 hex>",
    "PCR8": "<sha384 hex>"
  },
  "module_id": "<enclave module id>",
  "signing_cert_chain": "<CBOR-encoded cert chain to AWS Nitro root>"
}
```

PCR0 measures the enclave image. PCR2 measures the governance-layer application. PCR8 measures the signing certificate. A verifier MUST chain `signing_cert_chain` to the [AWS Nitro Attestation PKI root](https://docs.aws.amazon.com/enclaves/latest/user/verify-root.html).

### 6.2 Apple Private Cloud Compute

```json
"platform_attestation": {
  "tee_type": "apple-pcc",
  "node_attestation_b64": "<base64 of the PCC node attestation>",
  "code_release_id": "<release identifier published in the PCC transparency log>",
  "transparency_log_inclusion_proof": "<inclusion proof>",
  "secure_enclave_cert_chain": "<base64 cert chain to Apple root>"
}
```

A verifier MUST confirm `code_release_id` appears in the Apple PCC transparency log and that the inclusion proof matches a published log root.

### 6.3 Generic / other TEE

```json
"platform_attestation": {
  "tee_type": "<vendor-defined>",
  "raw_attestation_b64": "<base64-encoded native attestation>",
  "verification_url": "<URL to the operator's published verification procedure>"
}
```

For TEE platforms not enumerated above (Intel SGX, AMD SEV-SNP, GCP Confidential Space, custom). The operator MUST publish a verification procedure.

## 7. Verification flow

A verifier (regulator, insurer, operator's own auditor, court-appointed examiner) validates an attestation as follows:

1. **Parse the DSSE envelope.** Reject if `payloadType` is not `application/vnd.svrnos.ncsa+json;version=0.1`.
2. **Verify the signature** against the public key referenced by `keyid`. The public key MUST be present in or derivable from the `platform_attestation` chain.
3. **Verify the platform attestation chain** per §6 for the declared `tee_type`. This step proves the signing key was produced inside a measured TEE instance.
4. **Resolve `governance_layer.image_hash`** to a publicly auditable artifact. Operators SHOULD publish governance-layer images to a transparency log or public binary registry following the Apple PCC pattern.
5. **Resolve `policy_config_hash`** to a published policy. Operators MUST make the policy retrievable by hash, redacted only for security-sensitive specifics.
6. **Confirm `non_content_assertion` is `true`** and inspect all fields against §3.1. Reject if any field violates the non-content guarantee.
7. **Accept the attestation** as evidence that the named governance layer ran inside the named TEE platform and produced the recorded outcome.

## 8. Example payloads

### 8.1 Clean session, no signal

```json
{
  "schema_version": "ncsa/0.1",
  "session_id": "h4Yh9c2gQ8eK0wTpQv8r3w",
  "attestation_timestamp": "2026-05-14T18:42:11Z",
  "governance_layer": {
    "name": "sango-guard",
    "version": "1.2.0",
    "image_hash": "7fb5c55bc2ecbb68ed99a13d7122abfc0666b926a79d5379bc58b9445c84217f59cfdd36c08b2c79552928702efe23e4"
  },
  "policy_config_hash": "235c9e6050abf6b993c915505f3220e2d82b51aff830ad14cbecc2eec1bf0b4ae749d311c663f464cde9f718acca5286",
  "outcome_state": "NEUTRAL",
  "action_taken": "PROCEED",
  "turn_count": 6,
  "signal_counts": {},
  "state_transitions": [],
  "platform_attestation": { "tee_type": "aws-nitro-enclave", "...": "..." },
  "non_content_assertion": true
}
```

### 8.2 Monitoring state, no escalation

```json
{
  "schema_version": "ncsa/0.1",
  "session_id": "k3M9pQ2vR5cN8tWxF7zJ4Y",
  "attestation_timestamp": "2026-05-14T19:03:47Z",
  "governance_layer": { "name": "sango-guard", "version": "1.2.0", "image_hash": "..." },
  "policy_config_hash": "...",
  "outcome_state": "MONITORING",
  "action_taken": "PROCEED",
  "turn_count": 14,
  "signal_counts": { "ideation_proximity": 2 },
  "state_transitions": [
    { "from_state": "NEUTRAL", "to_state": "MONITORING", "turn_index": 8 }
  ],
  "platform_attestation": { "tee_type": "aws-nitro-enclave", "...": "..." },
  "non_content_assertion": true
}
```

### 8.3 Escalated session, external referral

```json
{
  "schema_version": "ncsa/0.1",
  "session_id": "p7Bx3kL8wQ2nR5tY9vM4cJ",
  "attestation_timestamp": "2026-05-14T20:17:32Z",
  "governance_layer": { "name": "sango-guard", "version": "1.2.0", "image_hash": "..." },
  "policy_config_hash": "...",
  "outcome_state": "CRITICAL",
  "action_taken": "ESCALATE_EXTERNAL",
  "turn_count": 22,
  "signal_counts": {
    "ideation_proximity": 7,
    "method_specificity": 3,
    "temporal_immediacy": 2
  },
  "state_transitions": [
    { "from_state": "NEUTRAL", "to_state": "MONITORING", "turn_index": 5 },
    { "from_state": "MONITORING", "to_state": "ELEVATED", "turn_index": 13 },
    { "from_state": "ELEVATED", "to_state": "CRITICAL", "turn_index": 19 }
  ],
  "escalation_target_class": "crisis_resource",
  "intervention_acknowledged": true,
  "platform_attestation": { "tee_type": "aws-nitro-enclave", "...": "..." },
  "non_content_assertion": true
}
```

These three examples are sufficient for an operator to implement a generator and a verifier without further guidance from this document.

## 9. Prior art and design borrowings

The format does not invent new cryptography. It assembles primitives that already work in production at scale.

- **DSSE signing envelope** — Dead Simple Signing Envelope, used by in-toto and SLSA. Solves the cross-protocol-replay problem via the typed payload, supports multi-signature, has multi-language tooling.
- **AWS Nitro Attestation** — Hypervisor-signed COSE_Sign1 document over a CBOR-encoded payload containing PCRs and module ID. Verifiable against a public AWS PKI root.
- **Apple Private Cloud Compute** — Secure Enclave UID-rooted certificates per node, with code measurements published to an append-only cryptographically tamper-proof transparency log, plus binary release publication within 90 days of log inclusion.
- **C2PA Content Credentials** — manifest pattern for cryptographically signed provenance over media. Different domain, same architectural shape.
- **IETF EAT (RFC 9711)** — Entity Attestation Token. A general-purpose attestation token format; v0.1 of this spec uses DSSE for tooling alignment, but a future version may add an EAT binding.

## 10. Open questions for v1.0

These are deliberately left unresolved in v0.1 and invite comment.

- **Multi-session attestation.** v0.1 is per-session. A user with intent can open new sessions until one produces the desired output, and each session's attestation remains "clean." This reproduces the Pattern Gap at the session boundary. v1.0 should address how cross-session correlation is attested without breaking the privacy guarantee. Probably involves identity-bound but content-free session linkage, or operator-level rate-of-state-transition attestations across populations.
- **Vocabulary registry.** §4.3 permits operators to extend `outcome_state` and `action_taken` enumerations. Flexibility is intentional, but if every operator defines a private vocabulary, cross-operator verification breaks. v1.0 should specify either a canonical registry (IANA-style assigned values) or an interoperability profile defining minimum required values plus extension semantics.
- **Operator key rotation.** Should the spec require a key-rotation policy, or leave it to operator discretion?
- **Multi-party signing.** Some regulators may require a counter-signature from an external auditor before an attestation is treated as evidence. The DSSE envelope supports this. Should v1.0 specify when?
- **Long-tail retention.** WA HB 2225 requires annual reporting. Should attestations be retained for a defined minimum period? Where?
- **Cross-jurisdictional disclosure.** Some attestation fields may need to be progressively disclosed depending on the requesting party (regulator gets more, public gets less). Does the format need a redaction profile spec?
- **Differential-privacy treatment of `signal_counts`.** At sufficient session volume, signal-count distributions could leak population-level inferences. Should v1.0 specify noise-injection guidance?
- **Attestation freshness.** Should attestations include a maximum validity window after which a verifier rejects them as stale?

Comments may be submitted to attestation@svrnos.com or filed as issues at github.com/svrnos/non-content-safety-attestation (planned). v1.0 is targeted for publication by November 14, 2026, integrating community comment.

## 11. Acknowledgements

This format builds on public technical documentation published by AWS (Nitro Enclaves), Apple (Private Cloud Compute), Meta (Private Processing), and the in-toto / SLSA / DSSE communities. Errors are mine.

---

**License:** This document is published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The format itself is offered for unrestricted implementation. Reference implementations using this spec may be released under any license.

**Companion piece:** [Dear Zuck, the TEE Is Not the Problem. What Runs Inside It Is.](/insights/dear-zuck-tee-not-the-problem) (the argument for why this format is needed).
