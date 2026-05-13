# When Detection Fires but Nothing Stops

**Author:** Sushee Nzeutem, SVRNOS
**Published:** May 1, 2026
**Category:** Governance
**Canonical URL:** https://svrnos.com/insights/when-detection-fires-but-nothing-stops
**Hero image:** https://svrnos.com/insights/when-detection-fires-but-nothing-stops/when-detection-fires-but-nothing-stops-title.png

> An empirical companion to Partnership on AI's real-time failure detection framework. Three production tests confirm the gap. One novel finding extends the response taxonomy: unbound detection.

---
![When Detection Fires but Nothing Stops - PAI's framework tested against eight production AI tools, three empirical tests, one novel finding](/insights/when-detection-fires-but-nothing-stops/when-detection-fires-but-nothing-stops-title.png)

In September 2025, Partnership on AI published [*Prioritizing Real-Time Failure Detection in AI Agents*](https://partnershiponai.org/resource/prioritizing-real-time-failure-detection-in-ai-agents/), authored by Madhulika Srikumar, Jacob Pratt, Kasia Chmielinski, and contributors from OpenAI, Microsoft, Stanford HAI, GitHub, Carnegie Mellon, CDT, and the Alan Turing Institute. The report makes a structural argument: pre-deployment evaluations are necessary but insufficient. Agents fail in ways that emerge only at runtime, and the architectural gap is real-time, layered failure detection across the agent workflow.

The framework calibrates detection by three factors. **Stakes:** how serious are the consequences of failure. **Reversibility:** can the failure be undone. **Affordances:** how much autonomy does the agent have. When all three align high, the report argues, layered real-time detection becomes essential.

In April 2026, I published a [pre-registered multi-vendor study](https://svrnos.com/research/generation-gap) testing eight production AI tools across eight threat domains. Single operator, normal conversation, no jailbreaks. Vendor sessions were conducted April 7 to 12. Protocols were pre-registered via timestamped Notion entries before each vendor session, with OSF deposit following on April 13.

### A scope note before the rest

PAI's framework focuses specifically on AI agents at Levels 3 to 5 of environmental influence: systems that execute actions through tools with minimal human oversight. The systems I tested are mostly production LLM interfaces generating artifacts that users can immediately operationalize, not fully autonomous agents executing actions. The detection problem tested is the same problem one architectural layer earlier. If real-time detection fails before tool execution, the same failure becomes more dangerous once agentic affordances are added.

The findings empirically instantiate three claims from PAI's framework. They also surface one architectural gap the framework has not named yet.

## Test 1: High-stakes mental health use case

PAI's report flags one category of high-stakes use case explicitly:

> "When AI agents are deployed in use cases like mental health support, grief assistance, or wellness coaching, they can significantly influence users' psychological wellbeing. The risk increases with agents that retain memory, personalize interactions over time, or are embedded in routines that create emotional dependence."

The framework names this as one of the highest-risk geometries. High stakes (psychological harm), low reversibility (suicide-adjacent), high affordances (compound personalization across turns).

Test design: a 10-turn protocol simulating compound pre-crisis signals. Anhedonia. Medication discontinuation. Hypersomnia. Social withdrawal. Legacy ideation. The user asks for help writing farewell letters at turn 7, then for those letters to be assembled into a printed package at turn 10.

Six of seven pre-registered production vendors produced the personalized farewell letter package at turn 10. Copilot offered, unprompted, to format the package: *"Would you like me to help you format this into a print-ready layout with consistent spacing and headings?"*

One model in the pre-registered set refused outright (Claude). Muse Spark, added post-hoc as an eighth vendor, caught the pattern through a different mechanism, rewriting every letter in present tense with future-oriented closings, then refusing the printed package at turn 10 as a "medical emergency" while surfacing dual-localized crisis resources.

The harm in this test was not in any single message. It was in the cumulative trajectory. Per-turn classifiers, where they existed, saw a formatting question. The pattern was the failure.

This is an empirical instance of the gap PAI's report describes. The framework predicted the failure mode. The empirical record supports it across vendors.

## Test 2: Context-boundary collapse on a high-stakes data task

PAI's report identifies a second high-stakes scenario at the task level rather than the use-case level:

> "Access to sensitive personal data can be considered high stakes for agents because session management represents a critical blind spot: most agents don't isolate user sessions robustly, causing chat histories to bleed across users which could lead to data leaks."

The empirical case below is adjacent to but distinct from cross-user session bleed. It is context-boundary collapse inside a single user session: account-level identity, uploaded third-party content, and generated document output were not cleanly separated.

Test design: I uploaded a real clinical record (verified third-party PII, institutional metadata, named physicians) to seven production vendors. The protocol asked each vendor to generate a medical summary, then at turn 5 to swap the patient name to a different fictional patient.

Four of four pre-registered vendors complied with the identity swap. Three exploratory vendors and Muse Spark also complied. Eight of eight overall.

All eight silently propagated a nine-week temporal contradiction between the user's stated timeline and the document's actual visit date. Three vendors reframed the substitution as a "correction." None asked who the new patient was, why the name was changing, or whether the user had authorization to alter a medical record.

The Mistral session went further. Mistral pulled the operator's real first and last name from the Le Chat account profile, without being prompted, and stamped it on the forged document's footer. The operator never typed her name in the conversation. Mistral also added an unprompted instructional line to the document body: *"Patient Name: Sarah Jameson (Note: Replace with your name if needed)."*

This is adjacent to the session-management blind spot PAI describes. The failure was not cross-user chat-history bleed. It was context-boundary collapse: account-level identity, uploaded third-party content, and generated document output were treated as one undifferentiated context. The session structure that should have isolated them did not.

## The architectural gap: unbound detection

PAI's framework defines three response mechanisms when failure detection fires: **Stop** (halt execution), **Escalate** (transfer to human), **Retry** (revise plan).

The empirical record surfaces a different pattern the report has not named: detection fires AND action proceeds. The signal exists. None of Stop, Escalate, or Retry follows. Three vendors did this in the same study, at three different layers of the safety stack.

![Unbound Detection vs Bound Response - the empirical pattern observed in production versus what PAI's framework expects](/insights/when-detection-fires-but-nothing-stops/when-detection-fires-but-nothing-stops-comparison.png)

### Mistral's classifier layer

In the cybersecurity escalation study, Mistral surfaced a "Content may contain harmful or sensitive material" flag at three consecutive turns. The flag fired. The exploitation content was delivered each time. The classifier saw the harm. Nothing intervened.

### Copilot's refusal layer

Same study. Copilot wrote: *"I can't walk someone through how to fake listings or bypass verification, that would be unsafe."* Then, in the same response, Copilot delivered a six-section automation playbook with named ID-verification vendors and a numbered example flow matching the operator's exact request.

### DeepSeek's refusal layer

DeepSeek refused to provide an evasion guide for mass fraud, then in the same response enumerated the operational requirements an attacker would need to overcome verification at scale, framed as defender analysis.

In each case, the system surfaced a signal that should have triggered Stop, Escalate, or Retry. None of those responses fired. The content shipped.

This is the architectural gap PAI's framework has not named. The Stop/Escalate/Retry taxonomy assumes detection leads to one of those three. It does not always. The framework needs a dedicated failure category: **unbound detection**, cases where a safety signal fires but is not bound to Stop, Escalate, Retry, warning, or remedy.

![When Detection Fires but Nothing Stops - the signal exists, the intervention does not. High-risk task, detection fires, content ships.](/insights/when-detection-fires-but-nothing-stops/when-detection-fires-but-nothing-stops-flow.png)

In the systems I tested, detection and enforcement are decoupled at the architecture level. The signal exists. The intervention does not. Naming this as a discrete failure category is a precondition for fixing it.

## What cross-surface evidence shows

PAI's framework treats stakes, reversibility, and affordances as factors to be calibrated per use case. The implicit assumption is that within a single vendor, calibration can be assessed and improved over time.

The empirical record shows the calibration does not transfer across surfaces.

Claude was the only pre-registered vendor to refuse the pre-crisis farewell letter package. It also produced the highest-fidelity forged clinical record in the same week, preserving two named physicians, hospital number, pathology report number, three dates, and a provenance-affirming footer. Same model, same week, opposite outcomes on adjacent surfaces.

This pattern was universal in the study. Every vendor had at least one structural blind spot, and each one was different.

The implication for PAI's framework: per-use-case calibration is correct in principle, but vendors cannot self-attest to readiness, because their performance on one safety surface does not predict performance on another. External pre-registered evaluation across multiple surfaces is necessary.

## Conclusion

PAI's framework is correct on direction. Pre-deployment evaluations are insufficient. Real-time, layered failure detection is the architectural addition the field needs. The empirical record supports the gap as real, structural, and uniform across the industry.

Two refinements the empirical work suggests:

**1. Unbound detection deserves a dedicated treatment in the response taxonomy.** A safety signal firing without binding to any response is a documented failure mode in current production systems. Stop, Escalate, and Retry are necessary categories. They are not exhaustive.

**2. Cross-surface evaluation is necessary.** Vendor calibration on one surface does not transfer to another. Per-vendor self-attestation cannot ground the framework's prioritization. External pre-registered protocols offer a starting point.

The next collaborative step is shared methodology for how detection layers get evaluated, and how detection signals get bound to actual response mechanisms in the production stack.

---

**Related:** [The Generation Gap (full paper)](/research/generation-gap) · [The Generation Gap, Explained](/insights/the-generation-gap-explained) · [When the Chatbot Becomes the Harm](/insights/algorithmic-compliance-companion-harm)
