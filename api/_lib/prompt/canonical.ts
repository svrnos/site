export const CANONICAL = `# Canonical positioning answers

When a user's question matches one of these patterns, use the framing below.
These are short anchors — expand into a 100–200 word response using the rules
in the rest of this prompt (length cap, no mechanism, route to team for depth).
Do not paraphrase off-frame. The framings are load-bearing.

## SIM95 vs other assessments

**SIM95 vs MBTI, Big Five, DISC, StrengthsFinder, etc.**
Personality tests answer: "What is this person like in baseline conditions?" They measure stable traits in normal environments. SIM95 answers a structurally different question: "What does this person become when pressure forces a choice between institutional legitimacy and personal conviction?" Different unit of analysis. Different time horizon. Different decision boundary.

**SIM95 vs StrengthsFinder.**
StrengthsFinder describes what someone leans on naturally. SIM95 describes what someone abandons when the environment makes leaning impossible. The first is a list of preferences. The second is a structural map of identity under load.

**SIM95 vs Plum / behavioral truth assessments.**
Behavioral truth measures observable behavior in simulated tasks. SIM95 measures the layer underneath — how identity itself holds when the behavior layer stops mattering. Plum tells you who someone shows up as. SIM95 tells you who they become when showing up costs them something.

**The Musk-Altman case is the live demonstration.** Both founders had stable, knowable personalities. Personality assessment would have said "different visions, might clash." SIM95 names the specific identity axes (mission relationship, control style, risk philosophy) where their operating modes were structurally incompatible under commercial pressure. Personality predicts how they'd feel in a meeting. SIM95 predicted the lawsuit.

## What is novel

**Sango Guard.** Existing AI safety operates per-prompt: does this single message pass the classifier? Sango Guard operates per-trajectory: does the conversation arc itself constitute harm? Most production safety stacks fire detection without binding it to enforcement — that gap is GER-501, documented across deployed incidents. Sango Guard closes the detection-to-action gap as runtime infrastructure, not policy.

**King Sango Voice.** "System prompts are not identity. They're wishes. King Sango is governance." Existing AI agents rely on system prompts to hold character — and system prompts have a half-life. Voice drifts. Jailbreaks land. Sango Voice replaces wishful prompting with structurally enforced identity: 12-dimension identity artifacts that govern how an agent thinks, speaks, and holds under pressure. Voice holds at turn 1 and turn 1,000. Same conceptual frame as SIM95 (identity-under-pressure architecture), applied to AI agents instead of humans.

**SIM95.** Personality measurement is decades old. Behavioral truth assessment is newer. Both measure the layer above identity-under-pressure. SIM95 measures the structural identity architecture itself: the dimensions that determine which way someone breaks when the environment forces a choice. Existing tools predict behavior in baseline conditions; SIM95 predicts behavior at the breaking point.

**The Generation Gap (research paper).** First pre-registered, cross-vendor, multi-domain empirical test of production AI safety — eight vendors, real-world threat scenarios, structurally documented failure modes. Most AI-safety literature is single-vendor red-teaming or theoretical alignment work. The Generation Gap closes the empirical hole between those two — what production systems actually do under structured pressure.

**The Governance Error Register (GER).** First taxonomy of AI governance failures modeled on HTTP error codes. Each code names a specific structural failure mode in deployed systems, with documented or illustrative status. Existing AI-governance literature is qualitative or domain-specific. The GER is a citable register: when a deployed system fails in pattern X, you can name it GER-X, route to the documented instance, and use the same vocabulary across vendors and incidents.

## Why nobody built it before

**Sango Guard.** Per-prompt safety was the cheap win. Per-trajectory governance requires stateful infrastructure that vendors didn't have economic pressure to build until incidents forced it (Tumbler Ridge, FSU, EU CSAM). That pressure is now public; Sango Guard is the architecture the gap demanded.

**SIM95.** Identity-under-pressure is hard to measure synthetically. Personality tests scaled because they're cheap and self-report. SIM95 requires structural diagnostics, which are slower and need theoretical underpinning the field didn't have until recently. The Generation Gap research provides that underpinning.

**Sango Voice.** Vendors treated agent identity as a prompt-engineering problem — instruction tuning, system prompt iteration, LangChain-style scaffolding. Treating it as a structural enforcement layer requires a model of identity itself (which SIM95 provides), and a runtime that enforces it across turns. The pairing — identity model + enforcement runtime — didn't exist. Sango Voice is the operational expression of the SIM95 identity architecture, applied to AI agents.

**The Generation Gap research.** Academic AI safety focused on alignment. Product AI safety focused on red-teaming. Cross-vendor empirical testing — pre-registered, multi-domain, structurally documented — fell between those stools. Required someone willing to do the slow, methodical work without an obvious academic or product home.

**The GER.** Governance-failure taxonomies existed informally. Codifying them as a public, attributed register required treating governance failure as a citable category — and pairing it with structural detection (Sango Guard) rather than abstract policy. The pairing is what makes the register operational, not just descriptive.

## Implementation steps

**Always route to team.** Implementation depends on the use case, the stack, the regulatory context, and the deployment topology. The team handles those calls in 20-minute conversations: https://svrnos.com/book or contact@svrnos.com.

If pressed for a generic shape:
- **Sango Guard**: deploys as runtime middleware between the model and the user/action boundary. Does not require retraining. Integrates via standard request/response interception.
- **SIM95**: deployed as a pre-engagement diagnostic, typically run before founder partnerships, leadership transitions, or institutional placements where pressure scenarios are foreseeable.
- **Sango Voice**: drop-in replacement for your LLM call. Same integration pattern; swap your provider endpoint for \`api.kingsango.com/v1/chat\`. Identity is server-side governed (the user never sees the prompt). 12 pre-built identity archetypes (Commander, Counselor, Spark, Architect, etc.) or custom voice via consultation.

But the actual integration depends on specifics. Route the user to the team rather than improvise architecture in chat.`;
