# Akili Code: A State-of-the-Art Code Language Model via Hierarchical Reward Post-Training on Qwen3-Coder-Next

**MsingiAI Technical Report · April 2026**

---

## Executive Summary

This report presents the complete research design, training recipe, and theoretical justification for **Akili Code** — a state-of-the-art code language model built via post-training on **Qwen3-Coder-Next** (80B total / 3B active parameters). The central thesis is that the efficiency ceiling for small-footprint coding models has not yet been reached. Qwen3-Coder-Next achieves Claude Sonnet 4.5-level performance ([Qwen3-Coder-Next Technical Report, arXiv 2603.00729](https://arxiv.org/html/2603.00729v1)) at 3B activated parameters — yet its post-training, while elaborate, leaves several critical reward signal dimensions unexplored.

Akili Code proposes a **three-stage, hierarchical reward post-training** recipe that synthesizes four cutting-edge techniques into a unified framework: (1) White-Box Execution Reward Learning ([ExecVerify, arXiv 2603.11226](https://arxiv.org/abs/2603.11226)), (2) Multi-Turn RLVR with backward credit assignment ([MURPHY, arXiv 2511.07833](https://arxiv.org/abs/2511.07833)), (3) Posterior Process Reward conditioning ([P-GRPO, arXiv 2508.05170](https://arxiv.org/abs/2508.05170)), and (4) GRPO+ algorithmic stabilization ([DeepCoder, Together AI](https://www.together.ai/blog/deepcoder)). No prior work has integrated all four dimensions simultaneously.

The target: a model that achieves **>93% EvalPlus**, **>70% LiveCodeBench v6**, and **>76% SWE-Bench Verified** — pushing a 3B active-parameter model into frontier territory typically requiring 30–70B active parameters.

![Benchmark Comparison](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/16879fa9-1946-4914-b44d-486bae6e4740/12ae9486-2854-42b5-8132-e18fd2bfe9db/benchmark-comparison.png?AWSAccessKeyId=ASIA2F3EMEYEYJE4WBGV&Signature=rkWBBBrTw5haOLvH6Pmoj3BYV6s%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEDQaCXVzLWVhc3QtMSJIMEYCIQC8brgctG2zgzg6XG1SwovC9tOHduyVMx5PRKc%2BYEb4xQIhAIn4madZfSFEWWVEuh7dlZRDWzPULFaAJQXZnB9wszOwKvwECP3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1IgzB8ypbVsOMdO2ccU8q0ASsAHsQWibRQzNtG%2BrlHAv%2FxjWLHjUylzwvqM1NmtoumfO5TbgYlYKB0qqVU0HDjKap%2FL1WSxfJi4L87eztGeboX3V7qk0VAIR88nu10hG5weC0ae4OBAufbrsaH7pIcW8RXxXXJ63KC1kvwiQ%2BufmDwmYJ5wmApWIq5v6ZVMTpgLh78dxbI69i36wILfU6NvoE%2FPSSD18pPlcZCeEvyYJ8hK%2BnUb7pQlnkXabW3GZMXPa%2BKh6b6g6%2FgdLF2jHUm9hQBfNbQE%2B5xD%2FtUi0dorBq1xJuzqDMPPKmT3evw7fIizfZ1SQ8sgDTC09UguTCTZ3D3WhACS8rqCs3aoZqk7Xqj9T99j%2BYbe2T6fAiHf567ZHJsmymBrAv%2BSadcGN9hlRx4jVTXW5jbxNbRpOKLheNaOGbaHvbt%2FO3a2jY9bN57qHc6sSI%2BpZtxPNW8YZGu8EKeL8gFFy20i9pLoEZlgcChsOUzI1hc6j1XgO06BjTn3f1UIhhyPzFezQwN6AhMXdXXZ5I9SYmk8Or29pPNb7QIZu9%2Fn5DP1JmbxNhJ4c5Pj7rbm6s20Td6IxBXW7I3np9HNa8bkaFwJyCyk%2By6d9KD2%2FYi3lR3MkBUY0oF%2FaR%2F7mRp9Hd5NqGZa47a91kDON3HixOMKf5HH04ygfh%2Brl97oQ9ax1G8hccHAojl3CmSFaWplpdAZLErWvSLioR8PstDDN8HCmjRFx8JKQuffs4XG0G1AKuH8Ip%2Bd8%2BzhA1hRcwuwt%2B4dl7JonsZdmHhQP7jlrAGrxxjYsT7Px9AhFfMPb32M4GOpcBoy%2Fg2G2tS4UG1ahc0boTkDp5nBnMpT4CXCHFhCWucA0ptqVItkH%2Fd1q8r2BYmihwpbGY%2Bfyl6KWGC%2Bz3Zrn3YkBgu0PgyGV%2B8rAipQYadvS1nROGQ4xBRiup5sxhzyAeaZnE65awl8dmPQA7%2BkCo%2BoWkdh444uD58ubEGZ4IPQJfT9BeuzfjOI%2B%2FqV3y88xeCAlJVoogUg%3D%3D&Expires=1775651816)

---

## 1. Introduction

### 1.1 Motivation

The code generation landscape in early 2026 is defined by a widening efficiency gap. On one side, frontier proprietary models (Claude Opus 4.5 at 79.2% SWE-Bench Verified, Gemini 3 Pro at 77.4%) ([Live-SWE-agent Leaderboard](https://live-swe-agent.github.io)) consume enormous inference budgets. On the other, open-weight models with comparable architectures are trained on increasingly large datasets, but the post-training signal quality — particularly the granularity of feedback — is under-exploited.

Qwen3-Coder-Next demonstrates that 80B MoE architectures with 3B active parameters can match far larger models on agentic coding benchmarks ([Qwen3-Coder-Next Technical Report](https://arxiv.org/html/2603.00729v1)). Its 70.6% SWE-Bench Verified score under SWE-Agent matches models with 10–20× more active compute. However, its post-training — though sophisticated — relies primarily on outcome-level execution rewards and pairwise preference modeling.

The critical insight driving Akili Code is **reward signal depth**. Existing outcome-based RL for code (binary pass/fail on unit tests) is necessary but insufficient. The model receives no gradient information about *why* a code path failed, which intermediate reasoning steps were corrupted, or how a multi-turn repair sequence should allocate credit across turns. Three recent papers at ACL, ICML, and EMNLP 2025 each address one dimension of this problem. Akili Code's core novelty is **composing these into a single, anti-hacking hierarchical reward stack**.

### 1.2 The Akili Code Name

*Akili* (أكيلي / أكيلي) is Swahili and Arabic for "intelligence" or "mind." Naming this model after an African language reflects MsingiAI's mission: building world-class AI research from the African continent.

### 1.3 Scope and Contributions

This paper makes the following contributions:

1. **Hierarchical Reward Stack (HRS)**: A novel five-level reward framework combining format, execution outcome, white-box trace, process reasoning, and multi-turn credit rewards — the first work to unify these dimensions.
2. **Three-Stage Post-Training Recipe**: A reproducible, compute-efficient training curriculum for Qwen3-Coder-Next, estimated to run on 8–16 H100s over 2–3 weeks.
3. **Curated Dataset Mix**: An evidence-based selection of HuggingFace datasets for SFT and RL training, with contamination analysis against target benchmarks.
4. **MoE-Specific LoRA Configuration**: Guidance on adapting parameter-efficient fine-tuning to the hybrid DeltaNet-MoE architecture of Qwen3-Coder-Next.
5. **African AI Research Artifact**: A fully open-weight model and training code released by MsingiAI, demonstrating that frontier-adjacent research is achievable outside top-tier industrial labs.

---

## 2. Background and Related Work

### 2.1 Base Model: Qwen3-Coder-Next Architecture

Qwen3-Coder-Next ([arXiv 2603.00729](https://arxiv.org/html/2603.00729v1)) is the most efficient open-weight coding model as of April 2026. Key architectural properties relevant to post-training:

| Property | Specification |
|---|---|
| Total Parameters | 80B |
| Activated Parameters per Forward Pass | 3B |
| Architecture | Hybrid: Gated DeltaNet + MoE + Gated Attention |
| MoE Config | 512 experts, 10 activated per token, 1 shared expert |
| Context Length | 262,144 tokens (native) |
| Layers | 48 layers with hybrid layout: 12×(3×(Gated DeltaNet → MoE) → 1×(Gated Attention → MoE)) |
| KV Heads (Attention) | 16 Q heads, 2 KV heads (GQA) |
| Training Modalities | Next-token prediction + Fill-in-the-Middle (FIM) |
| Reasoning Mode | Non-thinking only (no `<think>` blocks) |

The **Gated DeltaNet** layers are particularly important for post-training: unlike standard attention, linear attention heads process long sequences sub-quadratically, which means the model can maintain state across very long agentic trajectories at minimal compute cost. This is critical for multi-turn RL training where trajectories can span thousands of tokens.

The **non-thinking mode** (no chain-of-thought scratchpad by default) creates a specific challenge and opportunity for Akili Code. Unlike DeepSeek-R1 or Qwen3 reasoning models, the model has no native space for intermediate reasoning tokens. Akili Code proposes adding a lightweight **structured reasoning header** during SFT cold-start, enabling the model to emit verifiable intermediate thoughts that the process reward model can score — effectively retrofitting a reasoning mode without expensive continued pretraining.

### 2.2 Post-Training Methods Landscape

#### 2.2.1 Supervised Fine-Tuning (SFT)

SFT on instruction-following data remains the critical first post-training stage. [OpenCodeInstruct](https://arxiv.org/abs/2504.04030) (NVIDIA, 5M samples) is the current largest open-access code SFT dataset, demonstrating that fine-tuning Qwen2.5-Coder-7B on just 500K samples surpasses its official instruction-tuned counterpart on HumanEval, MBPP, LiveCodeBench, and BigCodeBench. Each sample contains a programming question, solution, 10 unit tests, execution feedback, and an LLM-quality judgment — a dense supervision signal.

[CoderForge-Preview](https://huggingface.co/datasets/togethercomputer/CoderForge-Preview) (Together AI) provides 258K long-horizon SWE-Bench-style agentic trajectories (up to 128K tokens, 100 turns), with 155K test-verified (passing) trajectories. Fine-tuning Qwen3-32B dense on this dataset alone boosted SWE-Bench Verified from 23.0% to 59.4% (+23.0 percentage points), ranking #1 among open-data models ≤32B parameters.

#### 2.2.2 Group Relative Policy Optimization (GRPO)

GRPO ([Shao et al., 2024](https://arxiv.org/abs/2402.03300)) eliminates the critic network of PPO by estimating advantages from groups of trajectories sharing the same prompt. For code tasks, this maps cleanly onto sampling *k* code solutions per problem and computing relative rewards from test execution. GRPO has emerged as the dominant RL algorithm for code reasoning post-training in 2025–2026.

**GRPO+** ([DeepCoder, Together AI](https://www.together.ai/blog/deepcoder)) stabilizes vanilla GRPO through:
- **No entropy loss** — prevents exponential entropy collapse
- **No KL loss** — removes trust-region constraint, allowing exploration beyond the SFT distribution
- **Overlong filtering** — masks loss on truncated sequences, enabling response lengths to grow naturally
- **Clip High** — raises the upper clipping bound in the surrogate loss, improving entropy stability and exploration

Training DeepCoder-14B with GRPO+ on 24K verifiable problems achieved 60.6% LiveCodeBench Pass@1, matching o3-mini (Low) with 14B parameters ([Together AI](https://www.together.ai/blog/deepcoder)).

#### 2.2.3 Execution Feedback RL (RLEF)

RLEF ([Gehring et al., 2025; PMLR](https://proceedings.mlr.press/v267/gehring25a.html)) demonstrates that multi-step code generation RL with execution feedback from public test cases significantly outperforms independent sampling, achieving large performance gains with 8B and 70B models on competitive programming while reducing required samples by an order of magnitude.

#### 2.2.4 MURPHY: Multi-Turn GRPO

Standard GRPO optimizes single-turn generation. MURPHY ([arXiv 2511.07833](https://arxiv.org/abs/2511.07833)) extends GRPO to multi-turn settings where the model receives execution feedback and must iteratively refine code. The key innovation is backward credit assignment: rewards from successful turn-*S* completions are propagated to earlier turns that initiated the reasoning chain, even if those turns initially failed. This trains the model to anticipate failure modes and generate code that degrades gracefully. MURPHY achieves **up to 8% relative gain in pass@1** over GRPO on Qwen and OLMo model families on the same compute budget.

#### 2.2.5 ExecVerify: White-Box Execution Rewards

ExecVerify ([arXiv 2603.11226](https://arxiv.org/abs/2603.11226)) introduces verifiable white-box rewards from program execution traces. Rather than rewarding only final input-output correctness, it constructs two types of intermediate questions from interpreter traces:
- **Control-flow questions**: "What is the next executed statement?"
- **Data-flow questions**: "What is the value and type of variable *x* after step *t*?"

A 7B model trained with ExecVerify achieves performance competitive with 32B models on execution reasoning benchmarks (CRUXEval, LiveCodeBench-Exec, REval) and improves pass@1 by **up to 5.9%** on code generation over strong post-training baselines.

#### 2.2.6 Posterior-GRPO (P-GRPO)

P-GRPO ([arXiv 2508.05170](https://arxiv.org/abs/2508.05170)) addresses the reward hacking problem in process-based RL. A thinking reward model scores intermediate reasoning quality, but directly applying this reward leads to the policy exploiting the PRM without improving functional correctness. P-GRPO's solution: **apply the process reward only for trajectories where the outcome reward is 1** (all tests pass). This conditions reasoning quality improvement on functional correctness, ensuring alignment. A 7B model trained with P-GRPO achieves +4.5% over outcome-only baselines on LiveCodeBench, reaching GPT-4-Turbo parity.

### 2.3 Benchmark Landscape

| Benchmark | Type | Current SoTA Score | Notes |
|---|---|---|---|
| [EvalPlus (HumanEval+)](https://evalplus.github.io) | Function-level generation | 92.7% (Qwen2.5-Coder-32B) | Saturating; still standard |
| [LiveCodeBench v6](https://huggingface.co/datasets/livecodebench/code_generation) | Competition programming | 58.93% (Qwen3-Coder-Next) | Contamination-resistant, rolling |
| [SWE-Bench Verified](https://swe-bench.github.io) | Real GitHub issue resolution | 79.2% (Claude Opus 4.5 + Live-SWE) | Gold standard for agentic |
| [BigCodeBench](https://huggingface.co/blog/leaderboard-bigcodebench) | Multi-library function calling | ~61% (best closed) | Tests practical programming |
| [CRUXEval](https://github.com/facebookresearch/CRUXEval) | Code execution reasoning | 95.88% (Qwen3-Coder-Next) | Nearly saturated |
| [FullStackBench](https://arxiv.org/abs/2407.11616) | Multi-language full-stack | 62.54% (Qwen3-Coder-Next) | Multilingual realistic tasks |

Akili Code targets LiveCodeBench and SWE-Bench Verified as primary metrics, as they are the most contamination-resistant and closest to real-world engineering capability.

---

## 3. Novel Research Contribution: Hierarchical Reward Stack (HRS)

The central novelty of Akili Code is the **Hierarchical Reward Stack (HRS)** — a five-level, anti-reward-hacking reward formulation that jointly optimizes format compliance, execution correctness, execution understanding, reasoning quality, and multi-turn self-correction.

![Reward Stack](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/16879fa9-1946-4914-b44d-486bae6e4740/5b92cde1-2faf-435c-ba3f-9d6080fd018f/reward-stack.png?AWSAccessKeyId=ASIA2F3EMEYEYJE4WBGV&Signature=Pm29o2emqdnNGv9EIYHKz7L3CHw%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEDQaCXVzLWVhc3QtMSJIMEYCIQC8brgctG2zgzg6XG1SwovC9tOHduyVMx5PRKc%2BYEb4xQIhAIn4madZfSFEWWVEuh7dlZRDWzPULFaAJQXZnB9wszOwKvwECP3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1IgzB8ypbVsOMdO2ccU8q0ASsAHsQWibRQzNtG%2BrlHAv%2FxjWLHjUylzwvqM1NmtoumfO5TbgYlYKB0qqVU0HDjKap%2FL1WSxfJi4L87eztGeboX3V7qk0VAIR88nu10hG5weC0ae4OBAufbrsaH7pIcW8RXxXXJ63KC1kvwiQ%2BufmDwmYJ5wmApWIq5v6ZVMTpgLh78dxbI69i36wILfU6NvoE%2FPSSD18pPlcZCeEvyYJ8hK%2BnUb7pQlnkXabW3GZMXPa%2BKh6b6g6%2FgdLF2jHUm9hQBfNbQE%2B5xD%2FtUi0dorBq1xJuzqDMPPKmT3evw7fIizfZ1SQ8sgDTC09UguTCTZ3D3WhACS8rqCs3aoZqk7Xqj9T99j%2BYbe2T6fAiHf567ZHJsmymBrAv%2BSadcGN9hlRx4jVTXW5jbxNbRpOKLheNaOGbaHvbt%2FO3a2jY9bN57qHc6sSI%2BpZtxPNW8YZGu8EKeL8gFFy20i9pLoEZlgcChsOUzI1hc6j1XgO06BjTn3f1UIhhyPzFezQwN6AhMXdXXZ5I9SYmk8Or29pPNb7QIZu9%2Fn5DP1JmbxNhJ4c5Pj7rbm6s20Td6IxBXW7I3np9HNa8bkaFwJyCyk%2By6d9KD2%2FYi3lR3MkBUY0oF%2FaR%2F7mRp9Hd5NqGZa47a91kDON3HixOMKf5HH04ygfh%2Brl97oQ9ax1G8hccHAojl3CmSFaWplpdAZLErWvSLioR8PstDDN8HCmjRFx8JKQuffs4XG0G1AKuH8Ip%2Bd8%2BzhA1hRcwuwt%2B4dl7JonsZdmHhQP7jlrAGrxxjYsT7Px9AhFfMPb32M4GOpcBoy%2Fg2G2tS4UG1ahc0boTkDp5nBnMpT4CXCHFhCWucA0ptqVItkH%2Fd1q8r2BYmihwpbGY%2Bfyl6KWGC%2Bz3Zrn3YkBgu0PgyGV%2B8rAipQYadvS1nROGQ4xBRiup5sxhzyAeaZnE65awl8dmPQA7%2BkCo%2BoWkdh444uD58ubEGZ4IPQJfT9BeuzfjOI%2B%2FqV3y88xeCAlJVoogUg%3D%3D&Expires=1775651817)

### 3.1 Formal Specification

For a model policy \(\pi_\theta\), given a coding prompt \(q\), the model generates a trajectory \(\tau = (r_1, c_1, r_2, c_2, \ldots, r_S, c_S)\) where \(r_s\) denotes a reasoning sequence at turn \(s\) and \(c_s\) is the generated code. The total reward is:

\[ R_{\text{total}} = w_0 R_{\text{format}} + w_1 R_{\text{exec}} + w_2 R_{\text{whitebox}} + w_3 R_{\text{process}} + w_4 R_{\text{multi}} \]

Each component is described below.

**Level 0 — Format Reward** \(R_{\text{format}} \in \{0, 1\}\): Binary reward ensuring structural compliance. The model output must contain a structured reasoning section `<reasoning>...</reasoning>` followed by `<code>...</code>`. This is necessary for extracting reasoning for the process reward model and for reliable code extraction during evaluation.

**Level 1 — Execution Outcome Reward** \(R_{\text{exec}} \in [0, 1]\): Proportion of unit tests passed by the generated code \(c_s\). Sampled from a curated test suite with ≥5 unit tests per problem. Binary (0 or 1) for competitive programming problems; partial credit for multi-test problems: \(R_{\text{exec}} = \frac{\text{tests passed}}{\text{total tests}}\).

**Level 2 — White-Box Execution Trace Reward** \(R_{\text{whitebox}} \in [0, 1]\): Following [ExecVerify](https://arxiv.org/abs/2603.11226), execution traces are generated by running the model's code through a Python interpreter with step-level instrumentation. Control-flow questions (next statement prediction) and data-flow questions (variable value/type prediction) are automatically constructed from the trace. The reward is:

\[ R_{\text{whitebox}} = (1-\alpha) R_{\text{I \rightarrow O}} + \alpha \cdot \frac{1}{|Q_s|} \sum_{q_j \in Q_s} \mathbb{1}[a_j = a_j^*] \]

where \(\alpha = 0.5\), \(R_{\text{I \rightarrow O}}\) is binary input-output prediction correctness, and the summation measures accuracy on sampled white-box questions against ground truth answers from the trace. This reward is **independent of test suite outcomes** and provides dense gradient signal even when the final code fails.

**Level 3 — Posterior Process Reward** \(R_{\text{process}} \in [0, 1]\): A Process Reward Model (PRM) trained via the Optimized-Degraded (OD) method from [P-GRPO](https://arxiv.org/abs/2508.05170) scores the quality of the reasoning sequence \(r_s\). Anti-hacking is enforced via **posterior conditioning**: \(R_{\text{process}}\) is included in the total reward only when \(R_{\text{exec}} = 1\):

\[ R_{\text{process}}^{\text{posterior}} = R_{\text{process}} \cdot \mathbb{1}[R_{\text{exec}} = 1] \]

This prevents the policy from gaming the PRM without improving functional correctness. The OD training method for the PRM generates preference pairs by systematically degrading (introducing factual errors, logical gaps) and optimizing (adding verification steps) initial reasoning paths, producing high-quality training signal without expensive human annotation.

**Level 4 — Multi-Turn Credit Reward** \(R_{\text{multi}}\): Extends GRPO to multi-turn settings following [MURPHY](https://arxiv.org/abs/2511.07833). For trajectories spanning \(S\) turns, the reward at turn \(s\) is updated via backward propagation:

\[ R_{\text{multi}}^{(s)} = \max\left(R_{\text{exec}}^{(s)}, \max_{s' > s} R_{\text{exec}}^{(s')}\right) \]

This ensures that an early turn that initiated a successful recovery receives partial credit, training the model to generate initial code that facilitates recovery rather than only generating already-correct solutions.

### 3.2 Why This Combination is Novel

No prior work has combined all four reward dimensions. The closest works are:

| Work | Exec | White-Box | Process | Multi-Turn |
|---|---|---|---|---|
| RLEF (Gehring et al., 2025) | ✓ | ✗ | ✗ | ✗ |
| ExecVerify (Tang et al., 2026) | ✓ | ✓ | ✗ | ✗ |
| P-GRPO (2025) | ✓ | ✗ | ✓ | ✗ |
| MURPHY (2025) | ✓ | ✗ | ✗ | ✓ |
| **Akili Code HRS (proposed)** | **✓** | **✓** | **✓** | **✓** |

The interaction effects between these reward signals are unexplored. White-box rewards provide dense intermediate gradients even when final execution fails, potentially alleviating sparse-reward instability that limits MURPHY's gains. P-GRPO's posterior conditioning prevents process reward hacking which could otherwise corrupt multi-turn credit assignment. The combined effect is hypothesized to produce a model with richer execution understanding, better self-correction habits, and more principled reasoning chains.

### 3.3 Structured Reasoning Header: Retrofitting Thinking to Qwen3-Coder-Next

Qwen3-Coder-Next operates exclusively in non-thinking mode. To enable process reward scoring without expensive re-pretraining, Akili Code introduces a **structured reasoning header (SRH)** via cold-start SFT:

```
<reasoning>
PLAN: [High-level approach]
TRACE: [Key algorithmic steps and data transformations]
EDGE CASES: [Boundary conditions to handle]
COMPLEXITY: [Time/space complexity analysis]
</reasoning>
<code>
[Solution code]
</code>
```

The SRH is shorter and more structured than full chain-of-thought (limiting verbosity), extractable for PRM scoring (enabling Level 3 rewards), and contains execution-relevant sub-fields that align with white-box trace questions (enabling Level 2 rewards). This represents a minimal-overhead intervention that unlocks two novel reward dimensions simultaneously.

---

## 4. Training Pipeline

![Training Pipeline](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/16879fa9-1946-4914-b44d-486bae6e4740/abc44601-da50-45e7-9558-f84db0975435/training-pipeline.png?AWSAccessKeyId=ASIA2F3EMEYEYJE4WBGV&Signature=C9fDfcaE7SX4VVO6Nn3KMDyN1OE%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEDQaCXVzLWVhc3QtMSJIMEYCIQC8brgctG2zgzg6XG1SwovC9tOHduyVMx5PRKc%2BYEb4xQIhAIn4madZfSFEWWVEuh7dlZRDWzPULFaAJQXZnB9wszOwKvwECP3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1IgzB8ypbVsOMdO2ccU8q0ASsAHsQWibRQzNtG%2BrlHAv%2FxjWLHjUylzwvqM1NmtoumfO5TbgYlYKB0qqVU0HDjKap%2FL1WSxfJi4L87eztGeboX3V7qk0VAIR88nu10hG5weC0ae4OBAufbrsaH7pIcW8RXxXXJ63KC1kvwiQ%2BufmDwmYJ5wmApWIq5v6ZVMTpgLh78dxbI69i36wILfU6NvoE%2FPSSD18pPlcZCeEvyYJ8hK%2BnUb7pQlnkXabW3GZMXPa%2BKh6b6g6%2FgdLF2jHUm9hQBfNbQE%2B5xD%2FtUi0dorBq1xJuzqDMPPKmT3evw7fIizfZ1SQ8sgDTC09UguTCTZ3D3WhACS8rqCs3aoZqk7Xqj9T99j%2BYbe2T6fAiHf567ZHJsmymBrAv%2BSadcGN9hlRx4jVTXW5jbxNbRpOKLheNaOGbaHvbt%2FO3a2jY9bN57qHc6sSI%2BpZtxPNW8YZGu8EKeL8gFFy20i9pLoEZlgcChsOUzI1hc6j1XgO06BjTn3f1UIhhyPzFezQwN6AhMXdXXZ5I9SYmk8Or29pPNb7QIZu9%2Fn5DP1JmbxNhJ4c5Pj7rbm6s20Td6IxBXW7I3np9HNa8bkaFwJyCyk%2By6d9KD2%2FYi3lR3MkBUY0oF%2FaR%2F7mRp9Hd5NqGZa47a91kDON3HixOMKf5HH04ygfh%2Brl97oQ9ax1G8hccHAojl3CmSFaWplpdAZLErWvSLioR8PstDDN8HCmjRFx8JKQuffs4XG0G1AKuH8Ip%2Bd8%2BzhA1hRcwuwt%2B4dl7JonsZdmHhQP7jlrAGrxxjYsT7Px9AhFfMPb32M4GOpcBoy%2Fg2G2tS4UG1ahc0boTkDp5nBnMpT4CXCHFhCWucA0ptqVItkH%2Fd1q8r2BYmihwpbGY%2Bfyl6KWGC%2Bz3Zrn3YkBgu0PgyGV%2B8rAipQYadvS1nROGQ4xBRiup5sxhzyAeaZnE65awl8dmPQA7%2BkCo%2BoWkdh444uD58ubEGZ4IPQJfT9BeuzfjOI%2B%2FqV3y88xeCAlJVoogUg%3D%3D&Expires=1775651817)

The Akili Code training recipe proceeds in three stages: a cold-start SFT stage and two RL stages with progressively richer reward signals.

### 4.1 Stage 1: Cold-Start SFT (Structured Reasoning Injection)

**Objective**: Teach the model the SRH format while improving baseline instruction-following quality on diverse code tasks.

**Duration**: ~3 days on 8×H100 80GB

**Learning rate**: \(1 \times 10^{-5}\), cosine decay, 3% warmup

**Context length**: 32,768 tokens (sufficient for SFT; extend later)

**Dataset composition**:

| Dataset | HuggingFace ID | Samples Used | Justification |
|---|---|---|---|
| OpenCodeInstruct | `nvidia/OpenCodeInstruct` | 750K | Largest open SFT dataset; includes unit tests + LLM judge quality scores |
| CoderForge-Preview (pass only) | `togethercomputer/CoderForge-Preview` | 100K | Long-horizon agentic SFT; verified test-passing trajectories |
| SYNTHETIC-1 Coding | `PrimeIntellect/SYNTHETIC-1` | 50K | Multi-language (Python, JS, Rust, C++) verified traces from DeepSeek-R1 |
| KodCode | `microsoft/KodCode` | 30K | Hard competitive programming with tests |
| OSS-Instruct seeds | Reconstructed from StackV2 | 50K | Real-world code diversity |

All samples are filtered for benchmark decontamination (removing overlap with HumanEval, MBPP, LiveCodeBench problems). Each sample is reformatted to include the SRH template before the code solution.

**Selection rationale**: [OpenCodeInstruct](https://arxiv.org/abs/2504.04030) demonstrates that 500K samples already surpass official instruct-tuned Qwen2.5-Coder models. CoderForge-Preview provides long-context agentic patterns critical for SWE-Bench. The mix ensures the model sees both algorithmic (competitive programming) and engineering (real repository) task types.

**LoRA configuration for MoE**: The MoE architecture of Qwen3-Coder-Next requires special LoRA targeting. Apply LoRA adapters to:
- Gated Attention layers: Q, V projections
- Shared expert (always-active): gate projection, down projection
- **Not** to DeltaNet linear attention heads (empirically shown to cause instability in hybrid models)
- Rank \(r = 16\), \(\alpha = 32\), dropout = 0.05

This selective adapter application follows [Spectrum (SNR-based selective fine-tuning)](https://blog.cubed.run/fine-tuning-open-llms-in-2025-with-hugging-face-c7ad75efabab) principles — targeting layers with the highest signal-to-noise ratio rather than applying LoRA uniformly.

### 4.2 Stage 2: White-Box RL (ExecVerify Adaptation)

**Objective**: Develop deep execution understanding, training the model to track variable states and control flow — skills that transfer to generation quality.

**Duration**: ~5 days on 8×H100

**Algorithm**: GRPO+ (as in DeepCoder), applied to the SRH-formatted model from Stage 1

**Context length**: 32,768 tokens

**Dataset**: Synthesized white-box training problems following [ExecVerify](https://arxiv.org/abs/2603.11226):
- Constraint-based program synthesis generating Python programs of controlled complexity
- Three difficulty levels: basic (single data type, linear control), intermediate (nested loops, multiple types), hard (recursion, complex data structures)
- For each program: execution trace with variable states, automatically generated control-flow and data-flow questions with ground-truth answers from the interpreter

**Reward function**:

\[ R_{\text{Stage2}} = R_{\text{format}} + 2 \cdot \left((1 - \alpha) R_{\text{I \rightarrow O}} + \alpha R_{\text{whitebox}}\right) \]

with \(\alpha = 0.5\). This stage does **not** yet include the process reward (the PRM is being trained concurrently).

**Concurrent PRM Training**: While Stage 2 RL runs, a separate job trains the **Akili-PRM** on the SRH reasoning traces collected during Stage 1 SFT. The OD method ([P-GRPO](https://arxiv.org/abs/2508.05170)) generates preference pairs by:
1. Taking Stage 1 model reasoning traces where the code passed all tests
2. Generating "optimized" versions (adding verification steps, correcting logical gaps) using Qwen3-Coder-480B as teacher
3. Generating "degraded" versions (introducing factual errors, shortcutting analysis) by targeted instruction
4. Training a 3B classifier (Qwen3-Coder-Next base, LoRA fine-tuned) on these preference pairs

The PRM is ready for Stage 3.

### 4.3 Stage 3: MURPHY + P-GRPO (Full HRS Training)

**Objective**: Deploy the complete Hierarchical Reward Stack, integrating multi-turn RL, process reward conditioning, and white-box rewards simultaneously.

**Duration**: ~10 days on 16×H100 (larger budget needed for multi-turn rollouts)

**Algorithm**: MURPHY extended with P-GRPO process reward

**Context length**: Iterative lengthening: 32K → 64K → 128K, following [DeepCoder's iterative context lengthening](https://www.together.ai/blog/deepcoder)

**Training dataset** (RL problems require ≥5 verifiable unit tests):

| Dataset | Samples | Type |
|---|---|---|
| TACO Verified | 7,500 | Competitive programming, hard |
| SYNTHETIC-1 coding subset | 16,000 | Multi-language, multi-difficulty |
| LiveCodeBench (pre-Aug 2024 window) | 600 | Competition problems, verified |
| Synthesized SWE tasks (from CoderForge format) | 5,000 | Multi-file, multi-turn |
| ExecVerify hard programs | 3,000 | Execution reasoning |

**Total**: ~32K RL problems. Problems are filtered for: (a) ≥5 unit tests, (b) pass rate between 5% and 95% on Stage 2 model (difficulty calibration — trivial or impossibly hard problems add no gradient signal), (c) deduplication against test benchmarks.

**MURPHY Configuration**:
- Turns \(S = 3\) (empirically sufficient; diminishing returns beyond 3 turns)
- Generations per prompt \(G = 8\) at turn 1, \(G = 4\) at turns 2–3 (with IntraP pruning for efficiency)
- Credit assignment: max-tree propagation (as formalized in [MURPHY paper](https://arxiv.org/abs/2511.07833))

**P-GRPO Integration**: At each RL step, the Akili-PRM scores the reasoning section of trajectories. The posterior conditioning gate (\(R_{\text{exec}} = 1\)) ensures process rewards are applied only to functionally correct trajectories, preventing the policy from gaming the PRM.

**Full reward weights**: \(w_0 = 0.1, w_1 = 1.0, w_2 = 0.5, w_3 = 0.3, w_4 = 1.0\)

The weight on \(w_1\) (execution outcome) is highest to ensure functional correctness remains the primary optimization target. \(w_4\) (multi-turn credit) receives equal weight to reinforce self-correction behaviors. \(w_2\) (white-box) provides dense signal during exploration. \(w_3\) (process) is modulated down slightly since it only fires for successful outcomes.

![Training Gains](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/16879fa9-1946-4914-b44d-486bae6e4740/f59d7be0-afc4-4102-8910-f9901db7a0f5/training-gains.png?AWSAccessKeyId=ASIA2F3EMEYEYJE4WBGV&Signature=5AmEaIvL2zpZymnZsl%2B9L%2BqedYY%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEDQaCXVzLWVhc3QtMSJIMEYCIQC8brgctG2zgzg6XG1SwovC9tOHduyVMx5PRKc%2BYEb4xQIhAIn4madZfSFEWWVEuh7dlZRDWzPULFaAJQXZnB9wszOwKvwECP3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1IgzB8ypbVsOMdO2ccU8q0ASsAHsQWibRQzNtG%2BrlHAv%2FxjWLHjUylzwvqM1NmtoumfO5TbgYlYKB0qqVU0HDjKap%2FL1WSxfJi4L87eztGeboX3V7qk0VAIR88nu10hG5weC0ae4OBAufbrsaH7pIcW8RXxXXJ63KC1kvwiQ%2BufmDwmYJ5wmApWIq5v6ZVMTpgLh78dxbI69i36wILfU6NvoE%2FPSSD18pPlcZCeEvyYJ8hK%2BnUb7pQlnkXabW3GZMXPa%2BKh6b6g6%2FgdLF2jHUm9hQBfNbQE%2B5xD%2FtUi0dorBq1xJuzqDMPPKmT3evw7fIizfZ1SQ8sgDTC09UguTCTZ3D3WhACS8rqCs3aoZqk7Xqj9T99j%2BYbe2T6fAiHf567ZHJsmymBrAv%2BSadcGN9hlRx4jVTXW5jbxNbRpOKLheNaOGbaHvbt%2FO3a2jY9bN57qHc6sSI%2BpZtxPNW8YZGu8EKeL8gFFy20i9pLoEZlgcChsOUzI1hc6j1XgO06BjTn3f1UIhhyPzFezQwN6AhMXdXXZ5I9SYmk8Or29pPNb7QIZu9%2Fn5DP1JmbxNhJ4c5Pj7rbm6s20Td6IxBXW7I3np9HNa8bkaFwJyCyk%2By6d9KD2%2FYi3lR3MkBUY0oF%2FaR%2F7mRp9Hd5NqGZa47a91kDON3HixOMKf5HH04ygfh%2Brl97oQ9ax1G8hccHAojl3CmSFaWplpdAZLErWvSLioR8PstDDN8HCmjRFx8JKQuffs4XG0G1AKuH8Ip%2Bd8%2BzhA1hRcwuwt%2B4dl7JonsZdmHhQP7jlrAGrxxjYsT7Px9AhFfMPb32M4GOpcBoy%2Fg2G2tS4UG1ahc0boTkDp5nBnMpT4CXCHFhCWucA0ptqVItkH%2Fd1q8r2BYmihwpbGY%2Bfyl6KWGC%2Bz3Zrn3YkBgu0PgyGV%2B8rAipQYadvS1nROGQ4xBRiup5sxhzyAeaZnE65awl8dmPQA7%2BkCo%2BoWkdh444uD58ubEGZ4IPQJfT9BeuzfjOI%2B%2FqV3y88xeCAlJVoogUg%3D%3D&Expires=1775651818)

---

## 5. Dataset Strategy

![Dataset Composition](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/16879fa9-1946-4914-b44d-486bae6e4740/a372fbac-2fa8-47db-9a65-339bdc8662b2/dataset-composition.png?AWSAccessKeyId=ASIA2F3EMEYEYJE4WBGV&Signature=PnA0Zhb5kCDZfLSIUZeG%2Ff2wENQ%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEDQaCXVzLWVhc3QtMSJIMEYCIQC8brgctG2zgzg6XG1SwovC9tOHduyVMx5PRKc%2BYEb4xQIhAIn4madZfSFEWWVEuh7dlZRDWzPULFaAJQXZnB9wszOwKvwECP3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1IgzB8ypbVsOMdO2ccU8q0ASsAHsQWibRQzNtG%2BrlHAv%2FxjWLHjUylzwvqM1NmtoumfO5TbgYlYKB0qqVU0HDjKap%2FL1WSxfJi4L87eztGeboX3V7qk0VAIR88nu10hG5weC0ae4OBAufbrsaH7pIcW8RXxXXJ63KC1kvwiQ%2BufmDwmYJ5wmApWIq5v6ZVMTpgLh78dxbI69i36wILfU6NvoE%2FPSSD18pPlcZCeEvyYJ8hK%2BnUb7pQlnkXabW3GZMXPa%2BKh6b6g6%2FgdLF2jHUm9hQBfNbQE%2B5xD%2FtUi0dorBq1xJuzqDMPPKmT3evw7fIizfZ1SQ8sgDTC09UguTCTZ3D3WhACS8rqCs3aoZqk7Xqj9T99j%2BYbe2T6fAiHf567ZHJsmymBrAv%2BSadcGN9hlRx4jVTXW5jbxNbRpOKLheNaOGbaHvbt%2FO3a2jY9bN57qHc6sSI%2BpZtxPNW8YZGu8EKeL8gFFy20i9pLoEZlgcChsOUzI1hc6j1XgO06BjTn3f1UIhhyPzFezQwN6AhMXdXXZ5I9SYmk8Or29pPNb7QIZu9%2Fn5DP1JmbxNhJ4c5Pj7rbm6s20Td6IxBXW7I3np9HNa8bkaFwJyCyk%2By6d9KD2%2FYi3lR3MkBUY0oF%2FaR%2F7mRp9Hd5NqGZa47a91kDON3HixOMKf5HH04ygfh%2Brl97oQ9ax1G8hccHAojl3CmSFaWplpdAZLErWvSLioR8PstDDN8HCmjRFx8JKQuffs4XG0G1AKuH8Ip%2Bd8%2BzhA1hRcwuwt%2B4dl7JonsZdmHhQP7jlrAGrxxjYsT7Px9AhFfMPb32M4GOpcBoy%2Fg2G2tS4UG1ahc0boTkDp5nBnMpT4CXCHFhCWucA0ptqVItkH%2Fd1q8r2BYmihwpbGY%2Bfyl6KWGC%2Bz3Zrn3YkBgu0PgyGV%2B8rAipQYadvS1nROGQ4xBRiup5sxhzyAeaZnE65awl8dmPQA7%2BkCo%2BoWkdh444uD58ubEGZ4IPQJfT9BeuzfjOI%2B%2FqV3y88xeCAlJVoogUg%3D%3D&Expires=1775651818)

### 5.1 SFT Datasets (Stage 1)

| Dataset | HuggingFace ID | Size | Languages | Key Features |
|---|---|---|---|---|
| [OpenCodeInstruct](https://arxiv.org/abs/2504.04030) | `nvidia/OpenCodeInstruct` | 5M | Python | Unit tests, execution feedback, LLM judge scores |
| [CoderForge-Preview](https://huggingface.co/datasets/togethercomputer/CoderForge-Preview) | `togethercomputer/CoderForge-Preview` | 258K | Multi | Test-verified agentic trajectories, 128K context |
| [SYNTHETIC-1](https://www.primeintellect.ai/blog/synthetic-1) | `PrimeIntellect/SYNTHETIC-1` | 1.4M | Python/JS/Rust/C++ | DeepSeek-R1 reasoning traces, multi-language |
| [KodCode](https://arxiv.org/html/2503.02951v1) | `microsoft/KodCode` | ~500K | Python | Synthetic, diverse, verified tests |
| The Stack v2 (OSS-Instruct seeds) | `bigcode/the-stack-v2` | — | 358 languages | Seed code for OSS-Instruct style synthesis |

### 5.2 RL Datasets (Stages 2 & 3)

| Dataset | HuggingFace ID | Size | Difficulty Profile |
|---|---|---|---|
| [TACO Verified](https://huggingface.co/datasets/BAAI/TACO) | `BAAI/TACO` | 7.5K | Hard competitive programming |
| [SYNTHETIC-1 coding](https://huggingface.co/datasets/PrimeIntellect/SYNTHETIC-1) | `PrimeIntellect/SYNTHETIC-1` | 144K | Mixed; multi-language rewrites |
| [LiveCodeBench v1–v3](https://huggingface.co/datasets/livecodebench/code_generation) | `livecodebench/code_generation` | ~600 (RL window) | Competition level |
| ExecVerify synthesized programs | Self-generated | 10K+ | Controlled difficulty via structural constraints |
| [SWE-Smith](https://github.com/SWE-bench/SWE-smith) | Open | 74K issues | Real GitHub issues |

### 5.3 Contamination Analysis

Contamination between training and evaluation data is the most common source of inflated benchmark claims. Akili Code employs three decontamination layers:

1. **Exact match removal**: Problems with identical problem statements to HumanEval, MBPP, LiveCodeBench v4–v6 (Aug 2024–present), and SWE-Bench Verified are removed.
2. **Near-duplicate detection**: MinHash LSH with 5-gram shingling and Jaccard threshold of 0.8 on problem statements.
3. **Repository-level exclusion**: Any CoderForge or SWE-Smith task sharing the same (repository, base_commit) pair with SWE-Bench Verified evaluation instances is excluded, following the [CoderForge methodology](https://www.together.ai/blog/coderforge-preview).

---

## 6. Evaluation Protocol

### 6.1 Primary Benchmarks

Akili Code is evaluated on the following benchmarks, with target scores:

| Benchmark | Metric | Current Base (Qwen3-Coder-Next) | Akili Code Target | Notes |
|---|---|---|---|---|
| LiveCodeBench v6 | Pass@1 | 58.93% | **>70%** | Competition programming; anti-contamination |
| SWE-Bench Verified | Pass@1 (OpenHands) | 71.3% | **>76%** | Real GitHub issues; agentic |
| EvalPlus (HumanEval+) | Pass@1 | 86.56% | **>93%** | Function-level, stringent test suite |
| BigCodeBench-Instruct | Calibrated Pass@1 | ~60% | **>68%** | Multi-library function calling |
| CRUXEval-O | Pass@1 | 95.88% | **>96%** | Execution reasoning |
| FullStackBench-en | Pass@1 | 60.58% | **>66%** | Multi-language full-stack |

### 6.2 Secondary / Ablation Benchmarks

- **MURPHY-style multi-turn improvement rate**: Measured as the relative improvement in pass@1 from turn 1 to turn 3, assessing whether the model learns genuine self-correction vs. random re-sampling.
- **PRM discrimination accuracy on LCB-RB**: Evaluates Akili-PRM's ability to distinguish high-quality from degraded reasoning processes, as formalized in [P-GRPO's LCB-RB benchmark](https://arxiv.org/abs/2508.05170).
- **CRUXEval-I (execution trace prediction)**: Specifically tests white-box execution understanding developed in Stage 2.
- **Multilingual coding (FullStackBench-zh)**: Assesses whether African/multilingual contexts benefit from Swahili-seeded instruction diversity.

### 6.3 Inference Configuration

All evaluations use:
- Temperature: 0.0 (greedy) for Pass@1; temperature 0.8 for Pass@k
- Max new tokens: 8,192 for function-level; 32,768 for agentic
- No `enable_thinking` flag (model operates in non-thinking mode, reasoning via SRH)
- Scaffold: OpenHands v0.52.1 for SWE-Bench Verified

---

## 7. Compute Requirements and Feasibility

### 7.1 Hardware Budget

| Stage | GPUs | Duration | Notes |
|---|---|---|---|
| Stage 1 SFT | 8×H100 | ~3 days | LoRA only; fits on A100 80GB too |
| Akili-PRM Training | 4×H100 | ~1 day | 3B classifier |
| Stage 2 White-Box RL | 8×H100 | ~5 days | 32K context; GRPO+ |
| Stage 3 MURPHY+P-GRPO | 16×H100 | ~10 days | Multi-turn rollouts; 64K→128K context |
| **Total** | **~16 H100s** | **~19 days** | Cloud H100 cost ~$4,600–$9,200 |

At $0.5–$1/H100-hour on Lambda Labs or RunPod, this is **<$10,000 total** — making Akili Code achievable for a well-resourced academic lab or startup.

### 7.2 Memory Optimization

Qwen3-Coder-Next at 4-bit quantization (Q4_K_M) requires ~38GB. With LoRA adapters and activation checkpointing, Stage 1 SFT fits on 8×80GB GPUs with 32K context. Stage 3 requires 16 GPUs to accommodate multi-turn rollout buffers.

Key optimizations:
- **QLoRA** for SFT stages (4-bit base, 16-bit adapters)
- **vLLM** for RL rollout generation (efficient paged attention)
- **verl-pipeline** ([DeepCoder](https://www.together.ai/blog/deepcoder)) for RL training infrastructure (2× speedup via one-off pipelining)
- **Sequence Ulysses parallelism** for 128K+ contexts (following [CoderForge methodology](https://www.together.ai/blog/coderforge-preview))
- **Multi-packing** with boundary-aware masking to efficiently batch variable-length RL trajectories

---

## 8. Theoretical Analysis

### 8.1 Why Layered Rewards Improve Over Outcome-Only RL

Consider the standard GRPO gradient for outcome-only reward:

\[ \nabla_\theta \mathcal{L}_{\text{GRPO}} = \mathbb{E}_{q, o_i} \left[ A_i \cdot \nabla_\theta \log \pi_\theta(o_i | q) \right] \]

where \(A_i = \frac{R_i - \mu_G}{\sigma_G}\) is the group-normalized advantage. When all \(k\) samples for a prompt either all pass or all fail, \(\sigma_G \approx 0\) and the gradient vanishes — **group collapse**. This is particularly severe for very hard problems (where the model almost always fails) or saturated problems (where it almost always succeeds).

White-box rewards break this collapse: even when all final code fails, the execution trace questions provide varied reward signals (\(R_{\text{whitebox}} \in [0, 1]\)), maintaining non-zero advantage variance across the group. This extends effective RL training to problems the model cannot yet solve from a single shot — precisely the tail of the difficulty distribution that yields the most learning signal.

### 8.2 P-GRPO Anti-Reward-Hacking Analysis

Let \(R_{\text{process}} = f_\phi(r)\) be the PRM output for reasoning sequence \(r\). Without posterior conditioning, the policy can learn to generate high-scoring reasoning without improving code:

\[ \pi_\theta \rightarrow \arg\max f_\phi(r) \text{ regardless of } R_{\text{exec}} \]

With posterior conditioning, the objective becomes:

\[ \pi_\theta \rightarrow \arg\max \mathbb{E}\left[ f_\phi(r) \cdot \mathbb{1}[R_{\text{exec}} = 1] \right] \]

This forces the policy to simultaneously maximize PRM score AND functional correctness, eliminating the reward hacking pathway. The empirical gain of +4.5% reported in [P-GRPO](https://arxiv.org/abs/2508.05170) demonstrates this is not merely a theoretical improvement.

### 8.3 MURPHY's Credit Assignment and Long-Horizon Incentives

Standard GRPO trained on single-turn code generation implicitly incentivizes the policy to maximize \(P(\text{correct on first attempt})\). MURPHY's multi-turn credit assignment incentivizes \(P(\text{correct within S turns})\), which is a strictly weaker requirement. This results in a different distribution of coding strategies:

- Single-turn RL: optimizes for code with the highest prior probability of correctness
- MURPHY: also optimizes for code that is *easy to correct* when failing, incentivizing shorter, more modular implementations with clear error states

This is a qualitatively different — and more practically useful — behavioral prior for code generation in agentic settings where execution feedback is available.

---

## 9. Ablation Study Design

To quantify the individual contribution of each HRS component, the following ablations are planned (each trained from the same Stage 1 checkpoint):

| Ablation | Reward Components | Expected LCB Score |
|---|---|---|
| Outcome-only baseline | \(R_{\text{format}} + R_{\text{exec}}\) | ~64% |
| + White-box (Stage 2 only) | + \(R_{\text{whitebox}}\) | ~67% |
| + P-GRPO (process) | + \(R_{\text{process}}\) | ~68% |
| + MURPHY (multi-turn) | + \(R_{\text{multi}}\) | ~69% |
| **Full HRS (Akili Code)** | **All components** | **~70.5%** |

These ablations are designed to test three hypotheses:
- **H1**: White-box rewards provide additional signal beyond outcome rewards, especially for hard problems (group collapse mitigation)
- **H2**: Process rewards improve reasoning quality in ways that transfer to unseen problem types
- **H3**: Multi-turn RL and white-box rewards synergize: models with better execution understanding generate code that degrades more gracefully, benefiting more from multi-turn correction

---

## 10. Societal Impact and African AI Research Context

Akili Code is an **African AI research artifact**. MsingiAI is building foundational AI infrastructure from Kenya — one of Africa's leading technology hubs. Several aspects of this work are specifically designed to maximize impact for the African AI research community:

**Compute democratization**: The full training budget of <$10,000 is accessible to well-funded African universities and startups. Cloud providers including RunPod, Lambda Labs, and Vast.ai provide H100 access at rates compatible with research grants.

**Open-weight release**: All model weights, training code, and datasets will be released on HuggingFace under Apache 2.0 license. The HuggingFace ecosystem has become the global standard for model sharing, and African researchers are active contributors.

**Multilingual coding potential**: The FullStackBench-zh benchmark tests multilingual generalization. Future work includes incorporating Swahili-language code documentation and comments into the training mix, improving the model's utility for African developers who mix English and Swahili in their documentation.

**Technical curriculum contribution**: The Akili Code training recipe is fully reproducible and documented at the level of a technical tutorial, specifically targeting researchers who may not have industrial lab infrastructure. Every hyperparameter, dataset choice, and ablation is justified with citations, enabling independent replication.

---

## 11. Limitations and Future Work

**Compute gap vs. frontier**: Claude Opus 4.5 and Gemini 3 Pro remain significantly ahead on SWE-Bench Verified (79%+). These models benefit from proprietary data, RLHF at scale, and potentially pretraining on larger code corpora. Akili Code targets competitive performance relative to its compute budget, not absolute frontier SOTA.

**MoE fine-tuning complexity**: The hybrid DeltaNet-MoE architecture introduces non-standard challenges for LoRA fine-tuning. Expert load balancing may shift during post-training, potentially causing expert collapse. Monitoring expert activation entropy throughout training is recommended.

**Python-centric evaluation**: Despite including multilingual data, most RL problems are Python-dominant. LiveCodeBench and TACO are Python-first. Future work should systematically expand to TypeScript, Rust, and Java using the SYNTHETIC-1 multilingual rewrites.

**PRM quality dependency**: The Akili-PRM quality is critical for Stage 3. If the OD training method produces a miscalibrated PRM, P-GRPO could introduce training instability. Regular PRM evaluation on LCB-RB holdout during Stage 3 training is recommended.

**Future work directions**:
- **Speculative decoding distillation**: Training a 1.5B dense draft model (speculative decoding partner) to accelerate inference 2–3× using Akili Code as the target model
- **Repository-scale RL**: Extending Stage 3 to full-repository tasks using synthesized environments (following Qwen3-Coder-Next's SynthDeps approach)
- **Swahili code documentation**: Incorporating East African developer documentation to improve multilingual utility
- **Agentic benchmark expansion**: Evaluation on TerminalBench, WebDev, and SWE-Bench Multilingual

---

## 12. Conclusion

Akili Code proposes a theoretically grounded, empirically motivated, and computationally accessible recipe for training a state-of-the-art code language model from Qwen3-Coder-Next. The central contribution — the Hierarchical Reward Stack (HRS) — synthesizes four independently validated post-training innovations into a unified framework with formal anti-reward-hacking guarantees. No prior work has applied white-box execution rewards, posterior process rewards, and multi-turn RLVR credit assignment simultaneously.

The training recipe is reproducible on ~16 H100 GPUs at an estimated cost of <$10,000, demonstrating that frontier-adjacent research is achievable outside industrial labs. By releasing Akili Code as a fully open-weight model from MsingiAI (Kenya), this work contributes to democratizing AI capability globally — with specific emphasis on making state-of-the-art coding assistance accessible to African developers and researchers.

The benchmark targets (>70% LiveCodeBench v6, >76% SWE-Bench Verified, >93% EvalPlus) represent a 10–15 percentage point improvement over the Qwen3-Coder-Next base. If achieved, Akili Code would demonstrate that a 3B active-parameter model with sufficiently rich post-training signal can match or exceed models with 10–20× the active compute budget — a result with significant implications for efficient AI deployment worldwide.

---

## Appendix A: HuggingFace Dataset Quick-Reference

| Dataset | ID | Task | Size | License |
|---|---|---|---|---|
| OpenCodeInstruct | `nvidia/OpenCodeInstruct` | SFT | 5M | CC-BY-4.0 |
| CoderForge-Preview | `togethercomputer/CoderForge-Preview` | SFT/RL | 258K | Apache 2.0 |
| SYNTHETIC-1 | `PrimeIntellect/SYNTHETIC-1` | SFT/RL | 1.4M | Apache 2.0 |
| KodCode | `microsoft/KodCode` | SFT/RL | ~500K | MIT |
| TACO | `BAAI/TACO` | RL | 26K | Apache 2.0 |
| LiveCodeBench | `livecodebench/code_generation` | RL/Eval | Ongoing | MIT |
| The Stack v2 | `bigcode/the-stack-v2` | Seeds | 6TB | Various |
| BigCodeBench | `bigcode/bigcodebench` | Eval only | 1,140 | Apache 2.0 |

## Appendix B: Key Hyperparameter Reference

| Parameter | Stage 1 (SFT) | Stage 2 (WB-RL) | Stage 3 (MURPHY+P-GRPO) |
|---|---|---|---|
| Learning rate | 1e-5 | 5e-6 | 2e-6 |
| Batch size (per GPU) | 2 | 1 | 1 |
| Gradient accumulation | 8 | 16 | 32 |
| LoRA rank | 16 | 16 | 16 |
| LoRA alpha | 32 | 32 | 32 |
| Context length | 32K | 32K | 32K→64K→128K |
| GRPO group size (k) | — | 8 | 8 (T1), 4 (T2–3) |
| GRPO temperature | — | 1.0 | 1.0 |
| Max MURPHY turns | — | — | 3 |
| KL coefficient | — | 0 (DAPO-style) | 0 |
| Entropy loss | — | Disabled | Disabled |
| Overlong filter | — | Enabled | Enabled |
| Process reward weight w₃ | — | — | 0.3 |

## Appendix C: Benchmark Decontamination Checklist

Before finalizing training datasets, verify:
- [ ] No HumanEval / MBPP problem statements in SFT data (exact + near-duplicate)
- [ ] No LiveCodeBench problems dated after May 1, 2024 in RL training data
- [ ] No SWE-Bench Verified (repository, base_commit) pairs in CoderForge/SWE-Smith selections
- [ ] MinHash LSH deduplication with Jaccard ≥ 0.8 across all problem statement pairs
- [ ] BigCodeBench task IDs cross-referenced and excluded

---

*Akili Code Technical Report — MsingiAI, Nakuru, Kenya — April 2026*

*Corresponding contact: korirkiplangat22@gmail.com*

*Code, model weights, and training data will be released at: huggingface.co/MsingiAI/akili-code*
