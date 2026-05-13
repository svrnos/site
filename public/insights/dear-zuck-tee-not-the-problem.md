# Dear Zuck, the TEE Is Not the Problem. What Runs Inside It Is.

**Author:** Sushee Nzeutem, SVRNOS LLC
**Published:** May 14, 2026
**Canonical URL:** https://svrnos.com/insights/dear-zuck-tee-not-the-problem
**Format:** Open letter

> Meta shipped Incognito Chat for WhatsApp with Trusted Execution Environment inference. The infrastructure is real. The marketing conflates two layers — privacy and governance — that need separate proofs. A TEE can run governance code alongside the model and emit signed, non-content attestations. Meta did not publicly ship that layer. WA HB 2225 and NY RAISE start enforcing on January 1, 2027.

---

Zuck,

Yesterday you announced Incognito Chat for WhatsApp and the Meta AI app. The infrastructure is real. Trusted Execution Environment inference is real. End-to-end encryption is real. I am not arguing against private AI.

I am writing because you shipped privacy without shipping verifiable governance. They are different layers, and the second one does not survive the way you described the first.

## The two layers, separated

Privacy answers one question: who can read this conversation? Your answer is nobody outside the user's device. Not Meta, not WhatsApp, not law enforcement without a court fight. That is a real claim and the architecture supports it.

Safety answers a different question: what happens inside this conversation? Whether the model helps a 14-year-old draft a farewell letter. Whether the model walks a user through synthetic identity construction across forty turns. Whether the conversation moves from curiosity to operational planning across thirteen thousand messages and nobody notices, because no two messages, taken alone, are flaggable.

The TEE addresses who can see the conversation. It does not, on its own, address what the conversation produces or how the operator proves what the system did about it.

## The enclave can run governance, not just inference

A Trusted Execution Environment is an enclave. Code runs inside it. The user's input goes in, the model's response comes out, the conversation never leaves. The TEE does not require that the code inside it ignore the conversation. The TEE requires that whatever the code does with the conversation, the result stays inside the enclave.

A governance layer can run inside the same boundary. It can read every turn, evaluate the trajectory, detect crisis, log signed metadata, and route to intervention. The conversation content never leaves. What leaves is a signed attestation: proof that governed safety logic ran, which category of risk it detected, what action it took, with no transcript attached.

Apple Private Cloud Compute already publishes verifiable attestations from inside its TEEs. AWS Nitro Enclaves do the same. Banks use this pattern for confidential computing. Healthcare uses it for HIPAA-bound inference. The infrastructure is available.

Your own Private Processing documentation describes attested encrypted communications and confidential compute hardware. Attestation is the mechanism that lets an outside party verify what workload ran without seeing the private input. The architectural primitive exists in your stack. The safety attestation built on top of it is not publicly specified.

## The verifiability gap

You have not shipped a product with no safety logic. Press reports of Incognito Chat reference safeguards that steer users toward helpful information, refuse certain topics, and at some threshold stop interacting. Your whitepaper describes in-enclave classification and the ability to emit filtered, attested logs from the confidential VM.

The gap is different. There is no publicly specified, operator-verifiable record of what the safety layer detected across the trajectory of a private session, what state it entered, and what intervention it produced. From outside the enclave, the system is asked to be trusted on behavior, not verified on it.

That distinction matters when a session goes wrong. If the model refuses correctly, you have a safety success that no operator-verifiable record can demonstrate. If the model fails, you have a Tumbler Ridge with no transcript, no audit trail, no path for the family to learn what happened, and no path for a regulator to test whether the same failure exists at scale. The model failed in private. The product remains private. The architecture removes the question.

You moved the safety floor from the operator layer to the model layer, with no publicly verifiable check on whether the model held it.

## The regulatory collision

Washington HB 2225 takes effect January 1, 2027. It requires AI companion chatbot operators to maintain and publicly disclose protocols for detecting and responding to suicidal ideation, self-harm signals, and eating-disorder content; to route users to crisis resources; and to report annually on crisis referral notifications.

If Incognito Chat is available to Washington residents on January 2, 2027, and a self-harm trajectory appears in a session Meta cannot observe, your team has three options. Run trajectory detection inside the TEE and publish the attestation format that proves it ran, which contradicts nothing about the privacy claim. Skip detection, which violates HB 2225. Argue Incognito Chat is not a companion product under the statute, which is a legal position, not a technical answer.

The EU AI Act Article 50 transparency obligations apply on August 2, 2026. They are a disclosure mandate, not a crisis-detection mandate, but they tighten the disclosure floor in parallel.

New York's RAISE Act, applicable to frontier developers from January 1, 2027, sets penalties at up to $1 million for a first violation and $3 million for subsequent violations, and points toward an incident-reporting regime that distinguishes "what was your policy" from "what did your system actually do."

The direction is consistent. Regulators are moving from policy review to system attestation. A private architecture that cannot answer "what did your safety layer detect, when, and what did it do" will collide with that direction.

## The omission and the fix

Private AI is the right direction. The mistake is calling privacy a safety story.

The fix is in the enclave. Run governance code inside the TEE alongside the model. Generate signed, non-content attestations of what the system detected and how it routed. Publish the attestation format so insurers, regulators, and operators can verify compliance without reading transcripts. That is a coherent product. It is the position that does the work the marketing already implies your TEE does.

This is the layer [Sango Guard](https://kingsango.com/guard) is built for. The governance layer runs inside the enclave. Signed, non-content attestations leave the enclave. The user's privacy is preserved. The safety floor becomes verifiable.

You have the platform reach to set the standard. The technical primitive exists in your stack. The regulatory deadlines are arriving. The next version of Incognito Chat either ships verifiable governance in the enclave, or ships another year of private inference that nobody outside the enclave can audit.

The TEE is not the problem. What runs inside it is.

— Sushee Nzeutem
Founder, SVRNOS · [Sango Guard](https://kingsango.com/guard)

---

**Sources**

- Meta, Incognito Chat announcement and Private Processing whitepaper: TEE inference, end-to-end encryption, in-enclave classification, attested encrypted communications, optional transparency reports.
- AP, Incognito Chat coverage: safeguards that refuse certain topics, steer users toward helpful information, and at threshold stop interacting.
- Washington HB 2225 (effective January 1, 2027): AI companion chatbot operator obligations for detection, crisis routing, and annual reporting.
- EU AI Act Article 50 (applicable August 2, 2026): user disclosure and generated-content marking obligations.
- New York RAISE Act (frontier developer framework, applicable January 1, 2027): penalty structure up to $1M first violation, $3M subsequent.
- Apple Private Cloud Compute (2024): published attestation pattern for TEE-resident workloads. AWS Nitro Enclaves: confidential computing pattern with attested workloads.
