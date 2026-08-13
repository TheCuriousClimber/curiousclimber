# Product roadmap — from prototype to live AI product

How this standalone tool becomes a paid, AI-powered product. This project is
**independent** of the climbing site — its own brand, repo (eventually), host,
payments and legal.

Today `index.html` runs a client-side rules engine. The plan below turns it into
a genuinely AI-generated, data-adaptive service.

---

## Decide first: what is this?

| Option | What it is | Build cost |
| --- | --- | --- |
| **Free lead magnet** | Keep it 100% client-side; capture emails | ~0 (marketing only) |
| **Paid AI product** ⭐ | LLM generates + adapts programs behind login/payment | High — Phases 1–3 |
| **Clinical assist** | AI drafts, a qualified clinician reviews before delivery | Medium — Phase 3 heavy |

Recommendation: **ship the free tool now** to validate demand, and build the
paid AI version behind it.

---

## The hosting reality

If deployed on a static host (GitHub Pages, Netlify static), the page **cannot**
run a server-side LLM route. To add AI:

- **Static site + serverless API** (recommended): the page calls an
  `/api/generate-program` route hosted on Vercel / Cloudflare Workers via
  `fetch()`. The `ANTHROPIC_API_KEY` lives only in that host's env — the browser
  never sees it.
- **Full app host** (Vercel/Netlify functions): one deploy for page + API.

Either way, the existing rules engine stays as an offline fallback.

---

## Phase 1 — Make the generator actually AI-powered

- [ ] Stand up the API route on a serverless host (a Next.js route was drafted
      for this feature as a starting point).
- [ ] **Structured output the right way** — use Claude tool-use / forced JSON and
      validate server-side (e.g. Zod) against the program schema. Don't
      regex-strip ` ```json ` fences. Repair or reject on invalid output.
- [ ] **Pin a current Claude model** and set `max_tokens` / temperature
      deliberately.
- [ ] **Cost + abuse controls** — per-user rate limiting, a monthly spend cap,
      and basic bot protection.
- [ ] **Rules engine as the floor** — if the LLM output fails schema or safety
      checks, fall back to the deterministic engine that ships today.

## Phase 2 — Productionize

- [ ] **Accounts + database** — persistence for users, programs, session logs and
      symptom trends is what makes "adapts from your data" real.
- [ ] **Payments** — Gumroad (one-off/membership) or Stripe (recurring +
      entitlement gating on the API).
- [ ] **Gate the API on entitlement** — only paying/authed users can call it.

## Phase 3 — Clinical safety &amp; legal (run in parallel; the real blocker)

This is a health product giving loading advice to people in pain.

- [ ] **PAR-Q gate** before the tool runs.
- [ ] **High-symptom guardrail is policy, not just UI** — for VAS > 5/10 the tool
      already leads with isometrics/off-loading; strongly consider having the AI
      path *refuse* dynamic loading prescriptions for symptomatic users and route
      them to a professional. Enforce server-side too.
- [ ] **Legal review** — Terms / Disclaimer / assumption-of-risk covering
      *AI-generated individualized guidance* and scope of practice, in your
      jurisdiction. Confirm insurance.
- [ ] **Clinical validation** — a qualified clinician reviews outputs across a
      batch of edge-case inputs before anyone pays.

## Phase 4 — Validate &amp; launch

- [ ] **Automated evals** — batch-check schema validity + clinical sanity across
      many synthetic assessments (the dev harness used a DOM stub to drive the
      form; scale that idea).
- [ ] **Soft launch** to a small email list; gather feedback; iterate.
- [ ] **Analytics** on the funnel: tool use → email capture → purchase.

---

## Biggest risk

Not scaling or model quality — **liability from an AI giving rehab guidance to
symptomatic users.** Do Phase 3 in parallel with Phase 1, never after it.

## Suggested first concrete step

Ship the free client-side tool to validate demand (connect email capture), and in
parallel scaffold the hardened serverless API (Phase 1) with structured output
and the rules-engine fallback. That is the single step that makes it *sellable*.
