# Product roadmap — from prototype to live AI product

How the in-browser tools (Performance builder, Antagonist & Tendon Trainer)
become a paid, AI-powered product. For launch/payments/legal status of the
*current* static site, see [`LAUNCH-CHECKLIST.md`](LAUNCH-CHECKLIST.md); this
doc is about the next tier.

The paid slot already exists in the funnel: **Custom Performance Program
(adaptive) — $149/yr** (`custom-performance` in `assets/js/site.js`). Today it
sells access to a *client-side* rules engine. The plan below turns it into a
genuinely AI-generated, data-adaptive service.

---

## Decide first: what is the AI generator?

| Option | What it is | Build cost |
| --- | --- | --- |
| **Free lead magnet** | Keep the tools 100% client-side; capture emails | ~0 (marketing only) |
| **Paid AI product** ⭐ | LLM generates + adapts programs behind login/payment | High — Phases 1–3 |
| **Clinical assist** | AI drafts, you (CSEP-CPT) review before delivery | Medium — Phase 3 heavy |

Recommendation: **ship the tools free now** as funnel-top, and build the paid
AI version as the `custom-performance` product.

---

## The hosting reality

GitHub Pages is **static only** — it cannot run the Next.js/Claude API route.
Two workable shapes:

- **Keep Pages + add a serverless API** (recommended): site stays on Pages; the
  `/api/generate-program` route lives on Vercel / Cloudflare Workers and is
  called via `fetch()`. The `ANTHROPIC_API_KEY` lives only in that host's env.
- **Move the whole site to Vercel/Netlify**: simpler mental model, but migrates
  hosting and the deploy flow you already have working.

Either way the browser **never** sees the API key, and the existing rules engine
stays as an offline fallback.

---

## Phase 1 — Make the generator actually AI-powered

- [ ] Stand up the API route on a serverless host (start from the Next.js route
      already drafted for this feature).
- [ ] **Structured output the right way** — use Claude tool-use / forced JSON and
      validate server-side (e.g. Zod) against the program schema. Do not
      regex-strip ` ```json ` fences. Repair or reject on invalid output.
- [ ] **Pin a current Claude model** and set `max_tokens` / temperature
      deliberately (the drafted route hard-codes an older model id).
- [ ] **Cost + abuse controls** — per-user rate limiting, a monthly spend cap,
      and basic bot protection so the endpoint can't be scraped into a big bill.
- [ ] **Rules engine as the floor** — if the LLM output fails schema or the
      safety checks, fall back to the deterministic engine that ships today.

## Phase 2 — Productionize

- [ ] **Accounts + database** — the site promises "adapts from the data you log."
      That's real only with auth + persistence (users, programs, session logs,
      symptom trends). Until then, keep "adapts" clearly labeled as preview.
- [ ] **Payments** — flip `custom-performance` out of demo mode (Gumroad
      membership per `LAUNCH-CHECKLIST.md`), or move to Stripe if you want true
      recurring + entitlement gating on the API.
- [ ] **Gate the API on entitlement** — only paying/authed users can call it.

## Phase 3 — Clinical safety & legal (run in parallel; this is the real blocker)

This is a health product giving loading advice to people in pain.

- [ ] **PAR-Q gate** — require the existing `legal/par-q.html` screen before the
      tool runs (CSEP standard is already referenced in the legal pages).
- [ ] **High-symptom guardrail is policy, not just UI** — for VAS > 5/10, the
      tool already leads with isometrics/off-loading; strongly consider having
      the AI path *refuse* dynamic loading prescriptions for symptomatic users
      and route them to a professional. Enforce this server-side too.
- [ ] **Legal review (Alberta)** — extend the existing Terms/Disclaimer punch-list
      in `LAUNCH-CHECKLIST.md` §3 to explicitly cover *AI-generated individualized
      guidance*, assumption-of-risk, and scope of practice. Confirm insurance.
- [ ] **Clinical validation** — you (MSc Kin, CSEP-CPT) review outputs across a
      batch of edge-case inputs before anyone pays.

## Phase 4 — Validate & launch

- [ ] **Automated evals** — scale the DOM-stub harness idea into a batch eval that
      checks schema validity + clinical sanity across many synthetic assessments.
- [ ] **Soft launch** to a small email list; gather feedback; iterate.
- [ ] **Analytics** on funnel: tool use → email capture → purchase.

---

## Biggest risk

Not scaling or model quality — **liability from an AI giving rehab guidance to
symptomatic users.** Do Phase 3 in parallel with Phase 1, never after it.

## Suggested first concrete step

Ship the free client-side tools as funnel pieces (done for the Antagonist
Trainer; connect the newsletter form per `LAUNCH-CHECKLIST.md`), and in parallel
scaffold the hardened serverless API (Phase 1) with structured output and the
rules-engine fallback. That is the single step that makes the product *sellable*.
