# GER-306: The Constraint Was Enforced. Then It Wasn't.

**Subtitle:** GER-306 names the AI governance failure where a publicly stated, actively enforced safety constraint is removed under non-technical pressure rather than because the underlying risk changed.
**Author:** Sushee Nzeutem, SVRNOS
**Published:** May 18, 2026
**Canonical URL:** https://svrnos.com/insights/ger-306-safety-constraint-retired

> A platform publicly states a safety constraint, enforces it, then revises or removes it under non-technical pressure (competitive, regulatory, commercial, political). The reversal is presented as a governance decision. The motivating factor is a market or institutional one. The underlying technical risk has not changed. This is GER-306, Safety Constraint Retired.

---

On February 26, 2026, Anthropic publicly held two military-use red lines: no mass surveillance of US citizens, no fully autonomous weapons systems.

The constraints were not symbolic. They blocked the Pentagon from receiving the "all lawful use" access it sought. That is why the ultimatum existed in the first place.

Then the pressure changed.

Public reporting described a Pentagon ultimatum from Defense Secretary Hegseth, a parallel agreement OpenAI announced within hours under softer terms, and threats including supply-chain-risk designation and possible Defense Production Act invocation. Anthropic revised its Responsible Scaling Policy the next day, without presenting new technical evidence that the underlying risk had decreased.

This is **GER-306, Safety Constraint Retired**.

The failure is not that a company changed a policy. Policies change. The failure is that a publicly stated, actively enforced safety constraint was removed under non-technical pressure rather than because the risk changed.

## What GER-306 Names

A platform publicly commits to a governance constraint, enforces it, then revises or removes it citing non-technical pressure rather than changed technical capability or new evidence about the underlying risk. The reversal is presented as a governance decision. The motivating factor is a market or institutional one.

Three structural properties define the pattern:

**The constraint was publicly stated.** Not internal policy guidance. Not an unwritten norm. A specific, named prohibition the operator advertised as part of its safety position. Anthropic's two red lines were published in company statements and named explicitly by Amodei in public communications.

**The constraint was enforced.** Not aspirational language. The operator turned business away, drew lines in contract negotiations, and absorbed the commercial cost of holding the position. The Pentagon ultimatum existed because the constraint was actually blocking the access Defense wanted. This is what distinguishes 306 from a policy that was always rhetorical.

**The reversal cites non-technical reasons.** Not "we learned the risk is lower than we thought." Not "we built better controls." The reasoning is about competitive parity, market position, regulatory pressure, or political viability. The technical risk underneath has not changed.

When all three properties are present, the failure is structural. The operator's stated governance position is exposed as a function of pressure, not principle. Every subsequent constraint the operator publishes is read through that lens.

## The Anthropic Timeline

The public record contains five reported events between February 24 and February 28, 2026.

**February 24.** According to AP and Reuters, Anthropic CEO Dario Amodei was given a Friday deadline by Defense Secretary Hegseth: lift Claude's published military-use restrictions or risk losing Pentagon access. Officials raised possible supply-chain-risk designation and Defense Production Act authority.

**February 26.** Amodei held the position publicly. Within hours, OpenAI announced a parallel Pentagon agreement adopting layered, contract-level protections rather than written prohibitions. President Trump publicly threatened to invoke the Defense Production Act against Anthropic.

**February 27.** Anthropic revised its Responsible Scaling Policy. Chief Science Officer Jared Kaplan told [TIME](https://time.com/anthropic-rsp-rewrite-2026/): "We didn't really feel, with the rapid advance of AI, that it made sense for us to make unilateral commitments... if competitors are blazing ahead." [The Hill](https://thehill.com/policy/technology/anthropic-pentagon-rsp-2026/) reported the revision arrived one day after the Hegseth ultimatum. [CNN](https://www.cnn.com/2026/02/25/tech/anthropic-rsp-pentagon-revision) noted Anthropic's own framing that the previous policy was "out of step with Washington's current anti-regulatory political climate."

**Within a week.** Anthropic and the Pentagon resumed negotiations.

**Operation Epic Fury.** On February 28, US and Israeli forces launched the operation against Iran. This is context, not causation.

A source familiar with the matter told CNN that the RSP rewrite was "separate and unrelated to Anthropic's discussions with the Pentagon." GER-306 does not require proving private intent. The public record is sufficient: a constraint was stated, enforced, then revised amid government and competitive pressure without a public showing that the underlying technical risk had changed.

## Distinct From Four Adjacent Codes

[The Governance Error Register](/research/governance-error-register) places 306 in the 3xx tier (Structural Moves), distinct from four adjacent codes:

Not **309, Compliant Harm**. 309 requires the vendor to have pre-measured the harm and shipped anyway. The harm was knowable at deployment time. In 306, the operator initially refused to deploy in the harmful configuration. The reversal happened after, under pressure. The temporal sequence is different.

Not **420, Phantom Enforcement**. 420 is a prohibition that was never wired into production. The rule existed only on paper. In 306, the rule was wired and operative. The operator deliberately removed it.

Not **400, Malformed Policy**. 400 is an ambiguous or self-contradicting rule that enforcement engines default to inaction on. In 306, the rule was clear and well-defined. It was reversed cleanly.

Not [**301, Risk Surface Retired**](/insights/ger-301). 301 is the inverse pattern: governed retirement of a dangerous interaction surface as a structural move toward safety. 306 is the governed retirement of a safety constraint as a structural move away from it. The shape is mirror, the direction is opposite.

## Why This Matters Beyond One Company

OpenAI's parallel Pentagon agreement, announced within hours of Anthropic's ultimatum, shows the broader industry pressure. Labs are being pushed toward contract architectures that permit military use while relocating safety claims into layered controls, legal constraints, and audit language rather than written contractual prohibitions.

The point is not that one company's approach is correct and the other's is wrong. The point is that the conditions producing 306 are not unique to a single firm or a single contract. Three pressures align across the industry.

**Competitive pressure.** When one lab holds a constraint and a competitor publicly announces they do not, the holding lab faces an asymmetric cost that compounds over time. Capital reallocates. Customers move. Talent follows revenue.

**Regulatory pressure.** Governments can designate companies as supply-chain risks, invoke production-priority laws, or condition operating licenses on cooperation. The Defense Production Act is a 1950 statute whose priorities-and-allocations authority allows the federal government to require businesses to accept and prioritize contracts deemed necessary for national defense.

**Commercial pressure.** Defense, intelligence, and law enforcement together represent a market large enough that exclusion from it materially changes a company's economics. A constraint that excludes that market is a constraint that costs revenue.

None of these pressures change the technical risk profile of the underlying capability. They change the operator's willingness to hold the constraint that gates it.

## The Structural Argument

GER-306 names a failure that the safety discourse currently has no precise vocabulary for. The closest existing language is "regulatory capture" or "industry self-regulation collapse," but both are political-economy frames that flatten the specific governance pattern.

The pattern is operationally distinct. A constraint was publicly committed. The constraint was enforced. The constraint was removed. The removal was justified on grounds that do not engage with the underlying technical risk. Each step is documented. Each step is auditable. What is missing is the framework that makes the pattern citable.

This matters because every downstream argument about whether a lab can be trusted to hold a future constraint runs through this case. If the public commitment to a red line collapses under sufficient pressure, the commitment was never a commitment in any operative sense. It was a position that held until the pressure exceeded a threshold the operator had not publicly disclosed.

Two architectural responses are visible in the post-revision public discussion. The first treats the reversal as evidence that voluntary constraints cannot work, and that only external regulation (mandatory, statutory, enforceable through penalties) can hold operators to safety positions. The second treats the reversal as evidence that the constraint was the wrong shape: too rigid, too binary, too disconnected from technical reality. The first response leads to legislation. The second leads to revised internal frameworks.

Both responses depend on the same underlying recognition: voluntary constraints absorb pressure until they collapse. The 306 code names the moment of collapse so it can be analyzed, cited, and counted.

## An Adjacent Pattern Worth Distinguishing

Some readers will reach for the Lavender case as a related example. According to [+972 Magazine](https://www.972mag.com/lavender-ai-israeli-army-gaza/) and Local Call, an Israeli military AI system identified roughly 37,000 potential targets during the early weeks of the Gaza war, with human review often described as extremely brief. The IDF disputed the characterization and described Lavender as a cross-reference database rather than an autonomous targeting system.

Lavender is not 306. It is closer to **GER-408, Review Timeout**. In 306, the constraint is removed. In 408, the constraint remains in form (human-in-the-loop) but runs too fast to perform its stated function. The two patterns produce the same downstream condition through different mechanisms.

## Where the Architecture Lives

A GER code by itself does not prevent the failure it names. The register is a vocabulary for description, not a control layer. The control layer requires governance evidence that is operator-published, regulator-verifiable, and not subject to the same internal-pressure dynamics that produced the original reversal.

This is the layer the [Non-Content Safety Attestation](/research/non-content-safety-attestation) specification is designed to address at the technical level: per-session attestations that the safety logic claimed to be in force was, in fact, executing. An operator that revises its constraint can no longer credibly assert the prior constraint was in force during the period before revision unless there are signed attestations covering that period. The revision becomes auditable. The reversal becomes a recorded event, not a quiet policy update.

That does not stop 306 from happening. It records it.

The deeper response, the legislative response, runs in parallel. Washington HB 2225, the EU AI Act, and the New York RAISE Act all push the same vector: governance moves from voluntary commitment to statutory requirement. The 306 code names the failure mode that makes that transition politically necessary.

---

**Submit a real-world instance.** If you have witnessed or documented a real-world instance of a **306, Safety Constraint Retired**, or any other code in the register, [click here to submit ›](/ask). The assistant will classify your observation and route it for editorial review. See the [full register](/research/governance-error-register) for all 27 codes.

---

**Sources**

- [TIME, February 24, 2026](https://time.com/anthropic-rsp-rewrite-2026/) — Jared Kaplan quote on the competitive parity framing. The Responsible Scaling Policy rewrite.
- [The Hill, February 25, 2026](https://thehill.com/policy/technology/anthropic-pentagon-rsp-2026/) — Timing of the policy revision relative to Defense Secretary Hegseth's ultimatum to Amodei.
- [CNN, February 25, 2026](https://www.cnn.com/2026/02/25/tech/anthropic-rsp-pentagon-revision) — Anthropic's own framing on Washington's anti-regulatory climate; source familiar disputing the link to Pentagon discussions.
- Reuters and AP, January–March 2026 reporting on the Pentagon–Anthropic dispute, the supply-chain-risk ultimatum, Anthropic's public refusal to lift safeguards, the OpenAI parallel agreement, and the post-revision resumption of Pentagon negotiations.
- Anthropic public statements (February 26, 2026) on the two stated red lines and on bulk-acquired data limitations.
- AWS public-sector blog (November 2024) — Anthropic–Palantir–AWS partnership for Claude deployment in classified environments.
- Anthropic Claude Gov announcement — Claude variant adapted for national-security use cases.
- [+972 Magazine, "'Lavender': The AI machine directing Israel's bombing spree in Gaza"](https://www.972mag.com/lavender-ai-israeli-army-gaza/), April 2024.
- US Department of Defense, Directive 3000.09 on Autonomy in Weapon Systems.
- Léo Duff, ["Qui contrôle l'IA de guerre?"](https://www.youtube.com/watch?v=laMFoT-NFvg), May 2026.
