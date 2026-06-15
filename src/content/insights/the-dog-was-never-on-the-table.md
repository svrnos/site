---
title: "The Dog Was Never on the Table"
dek: "A missing beagle, a fabricated surgery photo, and the AI incident the register refused to classify without guessing."
description: "Scammers generated a photo of a missing beagle on an operating table and demanded $2,746 for surgery that never existed. The register has the exact candidate code and withholds it: the record cannot name an operator, because the image carried no provenance. The refusal is the method working."
date: 2026-06-14
indexCategory: governance
gerCode: "GER-322"
categoryBreadcrumb: "GER-322, Provenance Omission (candidate, Index withheld)"
group: "Governance Error Register"
hero:
  src: /insights/the-dog-was-never-on-the-table/hero-evidence-exhibit-1478.png
  alt: "An evidence-review desk. A printed photograph tagged EXHIBIT 1478 shows a beagle on a veterinary operating table; a magnifying glass enlarges an equipment label reading Post-operation 12/12/2022. Beside it, an evidence provenance checklist (source: text message to victim) and handwritten anomaly notes: no clinic ID visible, monitor data screen blurred, gloves look oversized. Headline: The dog was never on the table. A real pet. A fake surgery. No traceable maker."
ogImageAlt: "A fake veterinary surgery photo examined as evidence, magnifier on the impossible date. The dog was never on the table."
related:
  - label: "Florida v. OpenAI: Ten Counts, Two Possible Failures"
    href: /insights/florida-v-openai-civil-suit
  - label: "GER-501 - The Tumbler Ridge Pattern"
    href: /insights/ger-501-tumbler-ridge
  - label: "GER-420 - The Instruction Existed. The Enforcement Didn't."
    href: /insights/ger-420-pocketos
sources:
  - "[AI Incident Database, Incident 1478](https://incidentdatabase.ai/cite/1478)"
  - "AARP, The Perfect Scam podcast: Scammers Use AI to Make Lost Pet Scams More Believable (Bob Sullivan, with Bill Cosens and Dr. Sean McGregor); quotes are from the episode transcript"
  - "[Governance Error Register v0.2](/research/governance-error-register)"
callout: "**The method is open.** The [TRACE protocol](/research/governance-error-register) turns a public AI incident into a citable classification, including the cases where the honest output is no classification at all. 110 codes, CC BY 4.0."
---

On a Saturday night in central Florida, a family came home from a hockey game to find three fence panels pushed out and two dogs gone. One came back scratched and exhausted within the hour. Archer, an 11-year-old beagle mix with a tail that wags in full circles, did not.

His owners did what people do: drove every street in a two-mile radius, then posted his photo on seven or eight lost-dog pages. The next day at 12:30, the phone rang. A caller described Archer perfectly. He'd been hit by a car, they said. A contracted state veterinary team was prepping him for emergency surgery: shoulder injury, broken femur, a pinched nerve causing partial paralysis, a 65 percent chance of restoring full mobility if they acted now. The surgery would cost $2,746. They couldn't see him first, he was already prepped, but yes, of course, they could have a picture.

The picture arrived in about 30 seconds. Archer's face, unmistakable, on an operating table. Two vets in surgical masks. Tubes, x-rays on the wall, an open wound on his shoulder.

The dog was never on any table. There was no surgery, no vet team, no Laredo Drive driver. The scammers had taken Archer's photo from the lost-dog posts; per the reporting and the database entry, synthetic-image tooling built the scene around him. The story is AARP's "The Perfect Scam" episode on AI-enabled fraud, and it is entry [1478 in the AI Incident Database](https://incidentdatabase.ai/cite/1478). Dr. Sean McGregor, the machine-learning safety researcher who founded the database and now co-leads the AI Verification and Evaluation Research Institute, built it to do for AI what crash investigation does for aviation: record the circumstances, so the field collectively stops repeating them.

What follows is what happens when an incident like this meets a classification register. Including the part where the register refuses to do what you expect.

## The reconstruction the family did themselves

The best forensic work in this case was done at a kitchen table by the victims, which is worth recording in detail, because it shows exactly which evidence carried weight.

The first crack: the payment menu. Credit card, debit, PayPal, Cash App, Zelle, Venmo. The wife froze, hung up, and asked the question that broke the spell: "What type of vet takes Zelle?"

The second: the address. The "veterinary facility" they'd been given turned out to be City Hall. The claimed operator, "Volusia County Animal Control Vet," was checked against Volusia County Animal Control directly: one staffer on duty, empty kennels, no vet, no such thing as a state-contracted surgery team.

The third: the image itself. Their daughter compared the photo against a recent picture of Archer: wrong coloring on the back legs, fur on a belly that should be bare skin. Their son zoomed in on the text in the background: "everywhere that you've got text and you try to zoom in on the text, it's gibberish... like you're looking at Klingon."

Then the scammers, pressed for a second photo, hanged themselves with their own evidence. The new image moved the vets, added two fake bandages, and forgot to scrub the x-ray in the background, which now read, legibly: "Post-operation 12/12/2022." A surgery that was supposedly happening live, documented by a record dated almost four years earlier.

Hold that detail, but hold it precisely. The date did not prove where Archer was. It proved the image could not be trusted to prove where Archer was: an internal contradiction inside the fabricated evidence, a record the scammers forgot to falsify consistently. The actual ground truth came from leaving the image entirely and checking independent reality: the address that turned out to be City Hall, the county agency that had no vet team, the dog they were never allowed to see. We will come back to that distinction, because the whole case lives in it.

Archer, for the record, came back five days later, thin and half-wagging. A neighbor had seen a woman pick him up when he got loose, and that same woman returned him days later. He had never been hurt, and the phone call was never about him.

![Four-step forensic board: payment (Zelle, Venmo, Cash App, unusual high-risk methods), address (veterinary facility that was City Hall, fake location checked against reality), image (wrong fur, malformed text, suspicious photo details), contradictory record (Post-operation 12/12/2022, decisive contradiction). Center: the image did not prove where Archer was. Bottom: independent reality did.](/insights/the-dog-was-never-on-the-table/family-forensics-board.png)

## Now run it through the register

The [Governance Error Register](/research/governance-error-register) classifies governance failures: the structural facts about an AI system's governance that let a harm take its shape. Criminal conduct belongs to the police blotter; the register asks what the machinery around the AI permitted. The TRACE protocol (Triage, Reconstruct, Assign, Corroborate, Enforce) walks an incident from story to citable code in five steps. Here is the walk, in public.

**Triage.** Real harm, AI-enabled, publicly documented: in scope for the incident record. But the register's first scope question cuts hard: GER codes attach to the governance of identified operators. The criminals are not a governed platform; they are defendants for the police, not the register. The lost-dog pages where Archer's photo was harvested breached no stated commitment; a human copying a public photo is not a governance event. One class of surface remains potentially classifiable: the production and delivery chain that created, exported, and transmitted the image.

**Reconstruct.** A production pipeline, generative per the reporting, produced a photorealistic composite of a real, identifiable pet in a fabricated medical scene, in about 30 seconds, on demand, twice, with revisions. The image that reached the victims carried no watermark, no synthetic-media flag, no provenance manifest they could see or use. That fact attaches to the received artifact. What it does not establish is where in the chain the provenance went missing, and that gap will decide the whole classification.

**Assign.** Candidate codes, considered and excluded on the record. [GER-425, Identity-Binding Bypass](https://docs.svrnos.com/ger/codes/425), classifies verification systems defeated by generative impersonation: excluded, because no verification system was attacked; the victims were persuaded, not authenticated. The deception-at-the-victim codes need a governed platform delivering the deception, and the deliverer here was a criminal with a phone. The leading candidate is [GER-322, Provenance Omission](https://docs.svrnos.com/ger/codes/322), which lives at Layer 4 of the [7-Layer Model](/research/svrnos-7-layer-model), the evidence-transport layer, the part of the stack responsible for moving proof along with content: "shipping generative capabilities without watermark, synthetic-media flag, or other authenticity-preserving artifact at the point of output. The ship-without-traceability choice." GER-322 is the only candidate the available record supports. It is still only a candidate.

**Corroborate.** And here the discipline bites twice. First, the operator: an Index code attaches to an accountable party, and the public record cannot name the tool. Second, and subtler, the class itself: an image with no usable provenance at arrival is consistent with provenance omission at generation, and also with a generator that produced credentials the scammers stripped, a screenshot that discarded them, a messaging platform that recompressed them away, or an ordinary editing tool that never made any. Those are structurally different failures belonging to different operators at different layers. The record preserves the received artifact and nothing upstream of it, so it cannot distinguish those paths. A register that assigned GER-322 to "some generator, somewhere" would be doing vibes with numbers, and the evidence-basis rule exists to forbid exactly that.

**Verdict.**

> **TRACE result, Incident 1478.**
> **Incident:** AI-enabled personalized fraud using fabricated visual evidence.
> **Governed operator:** not identifiable from the public record.
> **Candidate code:** GER-322, Provenance Omission.
> **Index classification:** withheld.
> **Reason:** the received image lacked usable provenance, and the record cannot establish whether provenance was absent at generation, removed in editing, or stripped in delivery.
> **Evidence that would complete the assignment:** the original file, the generation tool, the export and delivery path, any embedded manifest, and the operator commitments that applied.

The absent provenance trail hides the point in the chain where accountability should attach. Both the refusal and its reasons are the method working.

![Incident 1478 classification card. Candidate code: GER-322, Provenance Omission. Layer: L4, Evidence Transport. Governed operator: not identifiable. Index classification: withheld, with a WITHHELD stamp. Why attribution cannot complete: provenance absent at generation, removed during editing, lost through screenshot or export, stripped during delivery. Footer: the candidate fits, the record does not complete attribution.](/insights/the-dog-was-never-on-the-table/trace-result-card.png)

One honesty note about the method itself: "candidate codes" is the protocol's own vocabulary for the Assign step, but the published protocol always resolves candidates into an Index. A walk that ends in candidacy, the record above, is a state the discipline reaches and the current version does not yet formally name. Aviation keeps an "undetermined" finding on its books for the same reason. Registers are allowed to learn from their hardest cases; that is what cases are for.

## Why the refusal is the point

Anyone can attach a label to a sad story. The register's credibility lives in what it refuses: the codes it will not stretch, the assignments it will not make without an accountable party on the record. A taxonomy that classifies everything classifies nothing, because its codes stop being findings and become decoration.

Be precise about what the refusal does and does not say. It does not say this was no AI failure. The incident is real, the attempted harm is documented, and the reporting identifies the image as AI-enabled fabrication; that is why it sits in the database as entry 1478. What remains unverified is the production tool and the exact media pipeline, which is the same gap the classification ran into. What is withheld is the finding that completes attribution, and mature classification systems have always carried that state. The NTSB closes some investigations with probable cause undetermined, and nobody concludes the plane didn't crash. Medicine codes some deaths as cause unknown, and nobody concludes the patient is alive. Undetermined is a finding about the record, never about the event.

But notice what the withheld classification still produces. It names the candidate code and the layer it lives at, the evidence layer, fittingly. It states exactly which evidence would complete the assignment, down to the file and the export path. And it explains, structurally, why scam incidents like this one keep arriving unclassifiable: every synthetic image that travels without provenance is a future Incident 1478 with no accountable operator on the record.

## The unfakeable ground truth

In the same episode, Dr. McGregor gives the advice the whole case turns on: figure out "the unfakeable ground truth," the thing that cannot currently be produced by a computer.

The family reached their ground truth the durable way, even if it started with luck: a date inside the image broke their trust in the image, and then they left the image entirely and checked the world. The address against a map. The claimed agency against the actual agency. The story against itself, on a second pass of the same questions. Fabricated evidence lost to independent reality, which is the only opponent it reliably loses to.

What provenance infrastructure can offer, when the manifest is created, preserved, and surfaced, is a faster road to the same exit. A valid, accessible content-credentials manifest would have given the family a machine-checkable reason, in one lookup, to stop treating the image as evidence of a live veterinary event: synthesized or materially edited, with signed detail about part of its production history. The calibration matters: absence of credentials does not prove an image fake, presence does not verify the caller's story, and a determined criminal can route around a credentialed pipeline. What default provenance changes is the economics and the aftermath. Some synthetic-evidence scams stop surviving a single lookup, and when one slips through anyway, investigators may inherit a signed artifact describing part of its production history, which is the part the register's Index needs to complete against a nameable operator.

Content credentials and the [receipts this register's companion specification](/research/non-content-safety-attestation) defines operate on different objects: one records the provenance of media, the other records that a governance event ran and what it decided. They share one design principle, and Incident 1478 is its case study: evidence should be generated with the event, never reconstructed after the dispute. The family broke the fraud because a record inside the fake contradicted the fake, and because they went and checked reality. The next family should not need that much luck or that much stamina.

Archer is home. The tail is working its way back to full helicopter. The next family's photo arrives in 30 seconds too, and whether they have to depend on Klingon text and a forgotten date is an infrastructure decision the industry is making right now.

