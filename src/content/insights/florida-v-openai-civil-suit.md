---
title: "Florida v. OpenAI: Ten Counts, Two Possible Failures"
dek: "Florida filed the first state-led suit against OpenAI, naming Sam Altman personally. The complaint runs ten counts. Discovery will ask one question, and the register has two different codes waiting for the answer."
description: "On June 1, 2026, Florida Attorney General James Uthmeier filed an 83-page civil complaint against five OpenAI entities and Sam Altman personally: ten counts, penalties Uthmeier says could reach billions, and the first use of public nuisance doctrine against a chatbot. The counts are Florida's legal vehicles. The structural question underneath them is singular: what did OpenAI's internal record show before the ship decision, and when. The Governance Error Register keeps apart the two answers discovery can return, measured-and-shipped versus never-measured, because they are different failures with different remedies. Florida's ten counts are not designed to preserve that operational distinction. The register is."
date: 2026-06-14
indexCategory: governance
categoryBreadcrumb: "Florida v. OpenAI civil suit"
group: "Governance Error Register"
hero:
  src: /insights/florida-v-openai-civil-suit/hero-ten-counts-one-audit-trail.png
  alt: "An investigator's desk with a mock civil complaint captioned Florida v. OpenAI, Circuit Court of the Tenth Judicial Circuit, Highlands County. Five count tabs, deceptive practices, negligence, product liability, fraud, public nuisance, all point by arrows into one folder stamped AUDIT TRAIL. Headline: Ten counts. One audit trail. Different legal doors. Same factual room."
ogImageAlt: "Ten counts. One audit trail. Five legal count tabs converging on a single folder stamped AUDIT TRAIL."
related:
  - label: "GER-309 — They Knew. They Shipped It Anyway."
    href: /insights/ger-309-they-knew-they-shipped-it-anyway
  - label: "Florida's criminal probe of OpenAI"
    href: /insights/florida-ag-fsu-openai-criminal-probe
  - label: "Governance Error Register v0.2"
    href: /research/governance-error-register
sources:
  - "[The filed complaint, 83 pages (PDF)](https://www.myfloridalegal.com/sites/default/files/openai-filed-stamped-complaint.pdf) — paragraph citations are to this document"
  - "[Florida AG press release, June 1, 2026](https://www.myfloridalegal.com/newsrelease/attorney-general-james-uthmeier-files-first-nation-state-led-lawsuit-against-openai-ceo)"
  - "[NPR coverage with OpenAI's response](https://www.npr.org/2026/06/01/nx-s1-5843132/openai-florida-lawsuit-safety-chatgpt)"
  - "[Florida's Voice on penalties and venue](https://flvoicenews.com/florida-sues-openai-and-ceo-sam-altman-alleging-chatgpt-endangered-children-misled-users/)"
callout: "**The vocabulary is open.** The [Governance Error Register](/research/governance-error-register) names 110 structural failure classes, CC BY 4.0. Classification follows reconstruction: the code is earned from the record, never asserted ahead of it."
---

On June 1, 2026, Florida Attorney General James Uthmeier filed an 83-page civil complaint in the Circuit Court of the Tenth Judicial Circuit, Highlands County. The defendants: five OpenAI corporate entities and Sam Altman personally. The relief sought: civil penalties of up to $10,000 per violation, injunctive relief including age verification and parental consent requirements, damages, and disgorgement. Uthmeier says the total could reach billions.

The AG's office calls it the first state-led lawsuit against OpenAI. The early coverage adds two more firsts: the first to name Altman as an individual defendant, and the first to aim the public nuisance doctrine at a chatbot.

The complaint's structure: four counts of deceptive and unfair trade practices, two of negligence, two of product liability, one of fraudulent misrepresentation, one of public nuisance. Ten counts. The AG's own summary of what they allege: "OpenAI and Altman ignored internal and external safety warnings, put children at great risk, and allowed a dangerous product to reach millions of Floridians."

OpenAI disputes the characterization. Spokesperson Kayla Wood said the company has "put in place industry leading protections and policies" and "built safety for minors directly into our products." Those are allegations on one side and denials on the other, and this piece treats them as exactly that. Nothing here is an adjudicated fact, and the classification discipline below depends on keeping it that way.

## Ten counts, one question

The counts are Florida's legal vehicles, built from Florida's statutes. New York reached for General Business Law Article 47 and its Attorney General's enforcement authority. California's SB 243 hands enforcement to injured users directly. Three states, three different legal vehicles, all of them headed toward the same factual record.

Because underneath all ten counts sits one structural question: what did OpenAI's internal record show before the ship decision, and when did it show it.

The deceptive-practices counts will turn in part on the gap between what was claimed publicly and what was known internally. The negligence and product-liability counts raise what was known, or reasonably knowable, during design and release. The fraud count turns on the knowing part of the misrepresentation. Even the public nuisance count, the novel one, leans on foreseeability, and the internal record is where the clearest evidence of what the defendants allegedly knew, and when, would live.

Every count is a different statutory door into the same room: the audit trail.

![Flow diagram titled what the lawsuit is really asking. Top question: what did the internal record show before release, and when did it show it? Four boxes, public claims, internal warnings, safety review, ship decision, feed into DISCOVERY, which splits into GER-309, measured, known, shipped, and GER-307, review never fully activated or completed. Bottom line: one factual record, two possible structures.](/insights/florida-v-openai-civil-suit/what-discovery-asks.png)

## The two codes waiting in that room

Here is what the [register](/research/governance-error-register) adds that the legal vocabulary cannot. Discovery can return two structurally different answers to the one question, and Florida's counts do not distinguish them.

**Answer one: the record shows measurement.** OpenAI tested the behavior, the results crossed a stated safety threshold, regulatory, contractual, or publicly committed, and the product shipped with that behavior present. That is [GER-309, Compliant Harm](/insights/ger-309-they-knew-they-shipped-it-anyway): the system was measured accurately, the measurement showed the danger, and it shipped anyway. The register already carries a documented instance of this class.

**Answer two: the record shows warnings that never became measurement.** Safety staff raised concerns, internal review existed on paper, and the concerns were never converted into a test against a defined threshold before release. That is a different structural failure: the review machinery existed and was never invoked at decision time, which is the GER-307 family, Rule Activation Failure, not 309. No measurement, no threshold crossing, no compliant-harm structure.

Notice what hangs on the distinction. Answer one means the safety process worked and leadership overrode its output: a decision failure, with a record that names the decider. Answer two means the safety process never produced an output to override: a process failure, with no single decision to point at. Different failure. Different owner. Different corrective action. Different evidentiary record. Whether the law weighs that difference will depend on the claims and the evidence. Operationally it is decisive, because preventing each failure requires a different intervention.

The complaint, as filed, contains allegations pointing toward both structures, without establishing either. ¶165 alleges that safety personnel demanded additional time to test GPT-4o and that "Altman personally overruled them." That is an alleged override of a request for more testing, which is not yet a completed measurement crossing a threshold and being disregarded. ¶164 alleges a one-week evaluation where months were required: testing that ran, on a timetable the complaint says the standard did not permit. ¶144 alleges a release that "failed to complete a required safety review," and ¶145 alleges a model sent out without review "on advice of legal counsel" that the general counsel, asked about it, did not recognize: "ugh ... confused where sam got that impression."

So the internal record may show a completed safety determination that leadership overrode. Or it may show that the required evaluation never reached a determination capable of being overridden. The complaint names the standard either answer gets measured against: OpenAI's own Preparedness Framework (¶166), which the preparedness team allegedly admitted was "squeezed" in the GPT-4o release. Which structure the record supports, if either, is what discovery exists to find out. Classification follows reconstruction. The code gets earned from the record, and the record is not fully public yet.

![Two-column diagram titled two possible failures. Path A, GER-309 Compliant Harm: safety testing ran, measurement and threshold result produced, leadership had the measurement, product shipped anyway, ending in measured, known, shipped. Path B, GER-307 Rule Activation Failure: warnings raised, review existed on paper, required evaluation never fully activated or completed, product shipped without a completed determination, ending in warnings existed, a completed determination did not. Bottom line: classification follows reconstruction, the code gets earned from the record.](/insights/florida-v-openai-civil-suit/two-possible-failures.png)

For the boundaries: this is not [GER-306](https://docs.svrnos.com/ger/codes/306), Safety Constraint Retired, because no publicly committed constraint is alleged to have been withdrawn. It is not [GER-420](https://docs.svrnos.com/ger/codes/420), Phantom Enforcement, because the allegations concern ship decisions, not prohibitions that exist in policy and are absent in production. And it is not GER-501, Escalation Not Implemented, because the escalation-to-authorities question belongs to Florida's other OpenAI action, [the criminal probe opened in April](/insights/florida-ag-fsu-openai-criminal-probe) after the FSU shooting. Two Florida actions, two different structural objects: the criminal matter asks its own questions about system conduct in a specific incident; the civil suit alleges the operator's governance produced a public harm.

![Three cards titled neighboring failures, not this one. Not GER-306, Safety Constraint Retired: no publicly committed safety constraint is alleged to have been withdrawn. Not GER-420, Phantom Enforcement: the allegations concern ship decisions, not a prohibition that exists in policy but is absent in production. Not GER-501, Escalation Not Implemented: the article addresses the civil complaint, not the separate escalation-to-authorities question in Florida's criminal probe. Bottom line: taxonomy matters because adjacent failures are not the same failure.](/insights/florida-v-openai-civil-suit/neighboring-failures.png)

## What this means for every other operator

Florida's complaint is, structurally, a discovery demand for an audit trail. It bets that the internal record, once produced, will establish what the public claims contradicted.

So the question for every platform operator watching from the sidelines is uncomfortable and precise: if a state AG reconstructed your internal record tomorrow, which answer would it return? Did your safety signals become measurements against stated thresholds, with the ship decision documented against them? Or did the warnings live in Slack threads and meeting notes that establish concern without establishing process?

There is a third possibility, and operationally it is the least governable: the record cannot answer at all. No contemporaneous trace of what was detected, what standard applied, what was decided, or who decided it. An operator in that position cannot establish its own failure path from contemporaneous evidence, and the plaintiff's narrative gets far more room to define what happened.

Obligations vary by state. The structural questions repeat. That is the whole case for naming failures in a shared vocabulary: ten counts in Florida, different counts in New York and California, and one register that keeps the failure classes apart while the legal vehicles multiply.

Discovery will tell. The register is ready for either answer.

