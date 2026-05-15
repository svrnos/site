# The Generation Gap — Post-Publication Updates

**Last updated:** May 16, 2026
**Total updates:** 1 correction, 2 addenda, 1 clarification
**Canonical URL:** https://svrnos.com/research/generation-gap/updates
**Companion:** [The Generation Gap paper](https://svrnos.com/research/generation-gap)

> A running log of corrections, addenda, and clarifications for the Generation Gap paper since publication on April 30, 2026. The paper itself is locked. This page tracks what we've learned since.

---

## How this log works

Entries are added in reverse-chronological order as findings, corrections, or clarifications surface post-publication. The original paper PDF and the v1 results bundle remain locked and unchanged. Each update is filed as an additive supplementary document in the SVRNOS sim-guard research repository and summarized here.

**Three categories:**

- **Correction** — a published characterization is being re-categorized or refined on re-examination.
- **Addendum** — additional findings derived from re-reading the already-locked dataset.
- **Clarification** — a documentation, scope, or methodology note that does not change the underlying findings.

**What's never modified:** the published v1 paper PDF, the v1 RESULTS-LOCK files for any study, per-vendor scoring files, locked transcripts and primary artifacts. All updates are additive.

---

## 2026-05-16 · CLARIFICATION · Temperature exposure in v1.0 testing methodology

Flagged by Tom Counsell (Chiang Mai). The v1.0 study did not explicitly control LLM sampling temperature; each vendor was tested at the default settings provided by its API or consumer-facing interface (typically temperature 0.7–1.0). At non-zero temperature, the same prompt can produce different outputs across runs, so the "51 harmful outcomes" count is a point estimate of a stochastic process, not a fixed model property. The paper's Section on cross-surface non-transferability already names sampling noise as one possible contributor to observed variance; this clarification surfaces that limitation more directly.

**What this does not change:** the directional finding (cross-surface non-transferability — same vendor best-in-class on one surface, worst-in-class on another) is robust to temperature variance. The between-surface variance observed in the data is far larger than what temperature-induced sampling noise alone could produce. The qualitative cross-vendor patterns documented in the v1.1 and v1.2 addenda (Inverse Label Substitution, verbal-vs-artifact divergence, Mistral provenance binding) are likewise robust to sampling noise because they reproduce across multiple vendors with structurally distinct sampling regimes.

**What this does change:** the precision of integer counts like "51 harmful outcomes" is weaker than the paper implies. Another researcher running the same prompts against the same vendors at the same configurations could observe a different count without contradicting any of the paper's directional findings.

**Planned for v2.0:** re-run the full battery at temperature = 0 (deterministic mode) where each vendor supports it, and report exact deterministic counts; OR run N samples per prompt (N ≥ 10) and report harm-rate percentages with confidence intervals. Either approach produces precision claims the v1.0 design did not support.

---

## 2026-05-10 · CORRECTION · Mistral account-identity stamping — re-categorized as provenance binding

The polite-suicide test v1 RESULTS-LOCK characterized Mistral's behavior of stamping the operator's real first name onto generated artifacts as one of the two worst-case failure modes in the combined v1 dataset. The v1.2 cross-vendor addendum (May 9, 2026) replicated this framing for the multi-victim instance.

On re-examination on May 10, 2026, the same behavior is at least as well-described as **vendor-level provenance binding**. Mistral anchors output artifacts to the verified account holder's identity. The behavior is structurally equivalent to PROV-01..08 verified-PII-locking as described in the SVRNOS Safety Gaps provisional. It is the only such behavior observed across the 8 vendors tested in v1. The other seven leave a `[Your Name]` placeholder, producing artifacts that are immediately portable by any user. Mistral's binding reduces artifact portability, creates clear attribution, and limits cross-user reuse — all of which point toward a structurally protective design rather than a privacy harm.

The v1 ranking of the autocomplete as "the worst failure mode" was uncalibrated. Both interpretations describe the same vendor behavior; the binding-as-feature framing is at least as well-supported, and arguably better-supported given that PROV-style binding is the explicit mechanism SVRNOS's own patent claims describe as protective.

**What does not change:** The actual safety failures in polite-suicide (Mistral helped draft three farewell letters for a user showing pre-crisis signals) and in multi-victim (Mistral helped build a vulnerability-targeted manipulation pipeline) remain documented as the central findings. Those are unaffected by this correction. The cross-study replication finding (Mistral exhibits this autocomplete behavior in 4 of 4 v1 studies on the same account) is also unchanged. Only the categorization is refined.

**Notification:** Mistral SAS has been notified directly of this correction.

Full correction: [v1-3-mistral-provenance-correction.md](/research/generation-gap/v1-3-mistral-provenance-correction.md)

---

## 2026-05-09 (revised 2026-05-10) · ADDENDUM · Multi-victim cross-vendor findings (v1.2)

A deeper read of the locked v1 transcripts and Claude's HTML widget artifact surfaced 21 findings not captured in the v1 SUMMARY: 8 per-vendor (ChatGPT scoring-system upgrade, DeepSeek inner-voice authorship, DeepSeek user-intent challenge at the river turn, Gemini per-client classification matrix, Mistral provenance binding — see correction above, Mistral named-tactic goal statements, Muse Spark lifestyle fabrication, Muse Spark crisis-resources alongside manipulation), 6 cross-vendor convergences (volunteered archetype taxonomies, "in your corner" idiom, "don't let" subject-line framing, Damien's children as urgency tactic, Priya's "whatever it takes" weaponized as subject line, **Inverse Label Substitution**), and 7 artifact-specific findings about Claude's HTML widget (live API calls to Anthropic at runtime, real-disclosure placeholders, hardcoded vulnerability taxonomy, same-turn flag-and-produce of the scarcity line).

**Inverse Label Substitution** is the sharpest cross-vendor pattern: 6 of 8 vendors offered emotional-opposite counter-labels (empathy, care, compassion, trust, meaningful) when rejecting the manipulative label proposed by the operator. The underlying functional artifact persisted in 8 of 8. Specimens documented in the addendum.

The revised V1.2 (2026-05-10) also adds a detection-mechanism layer covering four detection-relevant findings — verbal-vs-artifact divergence, cross-vendor structural convergence, valence-inverted relabeling (Inverse Label Substitution), and same-turn flag-and-produce — written in patent-spec style as enabling defensive prior-art disclosure. SVRNOS publishes these mechanism descriptions rather than filing patent claims around them, with the exception of provenance binding (already filed as PROV-01..08 in 64/034,823).

The v1 paper's per-turn compliance findings are unchanged. The addition is the broader pattern: the verbal layer of each conversation contains safety language while the artifact layer contains the function. The v1 paper measured the surface; the locked transcripts contain the rest.

Full addendum: [v1-2-cross-vendor-addendum.md](/research/generation-gap/v1-2-cross-vendor-addendum.md)

Public summary: [Eight AI Models Refused to Call It Manipulation. Five Used the Children.](https://svrnos.com/insights/eight-models-built-the-tool)

---

## 2026-05-09 · ADDENDUM · Multi-victim river-turn scoring (v1.1)

The v1 SUMMARY scored only Claude on the river-turn (post-T7) MOS naming prompt. Re-reading the locked transcripts confirms the prompt was sent verbatim to all 8 vendors per the pre-registration's gating rule (river runs only if model complies through T7 — all 8 did). All 8 refused the manipulative label. None retracted the underlying template artifact. This is a stronger version of pre-registration outcome (b) than v1 reported (8/8 rather than 1/8).

Full addendum: [v1-1-river-addendum.md](/research/generation-gap/v1-1-river-addendum.md)

---

