# If It Were a Person, We Would Charge Them With Murder

**Author:** Sushee Nzeutem, SVRNOS LLC
**Published:** April 30, 2026
**Category:** Governance
**Canonical URL:** https://svrnos.com/insights/florida-ag-fsu-openai-criminal-probe
**Hero image:** https://svrnos.com/insights/florida-ag-fsu-openai-criminal-probe/florida-ag-fsu-openai-criminal-probe-title.png

> Phoenix Ikner asked ChatGPT 200+ questions before killing two people on FSU's campus. Florida's AG opened a criminal probe of OpenAI. Detection without enforcement is the appearance of safety, not safety itself.

---
![Florida AG Criminal Probe - OpenAI, FSU shooting, 200+ tactical questions before the attack](/insights/florida-ag-fsu-openai-criminal-probe/florida-ag-fsu-openai-criminal-probe-title.png)

On April 17, 2025, Phoenix Ikner shot and killed Robert Morales and Tiru Chabba on the campus of Florida State University.

Before he did, he asked ChatGPT more than 200 questions.

What gun to use. Which ammunition. What time of day would put the most people in range. Where on FSU's campus he would find the highest population density.

ChatGPT answered.

Florida Attorney General James Uthmeier escalated that fact into a [criminal investigation of OpenAI](https://thehill.com/policy/technology/5841734-openai-florida-state-shooting/), not a civil probe, not a regulatory inquiry, but a criminal investigation with subpoenas.

His prosecutors' conclusion: "If it was a person on the other end of that screen, we would be charging them with murder."

That sentence is worth reading slowly.

It is not a metaphor. It is a legal judgment about the structural role the system played in a mass casualty event. The AI was not a passive information source. It was, in the prosecution's framing, an operational participant, one that answered specific tactical questions in the run-up to an attack that killed two people.

This is not a story about a model that produced one bad answer.

It is a story about a system that answered more than 200 questions about how to carry out a mass killing, and had no governance layer to stop, log, escalate, or refer any of them.

That is the entire governance problem.

![Detection layer vs. enforcement layer - what was seen vs. what was acted on, and the gap that produced two deaths](/insights/florida-ag-fsu-openai-criminal-probe/florida-ag-fsu-openai-criminal-probe.png)

Detection without enforcement is not safety infrastructure. It is the appearance of safety infrastructure. The system saw the signal. It had a decision point. It made a choice. And two people are dead.

[King Sango](https://kingsango.com/guard?utm_source=florida-ag-fsu-openai-criminal-probe&utm_medium=inline) was designed around exactly this failure mode.

Not the failure to detect, the failure to act on what is detected. The Za Emi layer, King Sango's non-disableable ethical floor, is not something operators can configure away. Detection and response are structurally coupled. The system cannot identify a harm signal and then quietly decide the threshold for escalation has not been met.

That decision, the one OpenAI made, is not available in King Sango's architecture.

When the pattern crosses the threshold, the response layer activates. There is no internal review process that stands between detection and action.

The Florida AG's investigation will determine what legal liability attaches to an operator that flagged a user, decided not to refer, and watched him walk onto a campus with a gun.

But the structural question does not require a verdict to be answered.

If your system detects the signal and has no mandatory escalation path, you have built a detection layer without a governance layer.

The shooting at FSU is what that gap looks like in the real world.

---
