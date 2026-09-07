# Content SEO Directives — next 3 articles for `kinesiology-writer`

## Before writing anything

1. Fetch `sitemap.xml` and list existing article slugs. If an existing article already covers a target query below, **update it** to this spec instead of creating a new page (one URL per intent; duplicates split ranking).
2. Confirm the shared template exposes: `<title>`, meta description, canonical, `Article` JSON-LD with `author`, `datePublished`, `dateModified`, and an author box. If `FAQPage` JSON-LD is not supported by the template, add it inline per article.
3. Every article ends with the same author box: name, MSc Kinesiology, CSEP-CPT, "Educational content, not medical advice", link to `practice.html`.

## Site link map (build this, then keep it)

```
index.html ──► practice.html  (money page; 1 link from every article and from index nav)
   │               ▲   ▲   ▲
   ▼               │   │   │
Article B (hub: 8-week block) ──► Article A ──► Article C
   ▲                  ▲              │
   └──────────────────┴──────────────┘   (A and C both link back to B; B links to both)
Existing articles ──► Article B (add one contextual link each in Week 3 refresh)
```

Rules: anchor text describes the destination ("how max hangs and repeaters differ", "the 8-week finger strength block"), never "click here". `practice.html` receives exactly one in-body link per article plus the end CTA. Articles link to each other in the first 40% of the body, where crawlers and readers both weight them.

## CTA system (identical across articles)

Three placements, three intensities, all routing to `practice.html?ref=site-article-<slug>`:

1. **Contextual (mid-article, after the "decision" section):** one sentence in the prose. Example: "If you pass the gates above, the *Contact Strength & Finger Power* guide is the same accumulation → intensification structure written out session by session."
2. **Aside box (two-thirds down):**
   > **Want the full 8-week version?** *Contact Strength & Finger Power* — a 25-page periodized PDF with load tables and the safety-gate checklists between phases. $39 CAD, instant download. [See what's inside →]
3. **End card (after author box):** "Read next" links to the two sibling articles, then the guide link with the same copy as the aside.

Forbidden in any CTA: outcome numbers, "transform", "unlock", urgency timers, or scarcity.

---

## Article A — Max Hangs vs. Repeaters

| Field | Spec |
|---|---|
| Slug | `/articles/max-hangs-vs-repeaters.html` |
| Primary query | `max hangs vs repeaters` |
| Secondary queries | `repeaters vs max hangs climbing`, `max hang protocol hangboard`, `7 3 repeaters hangboard`, `which hangboard protocol is best` |
| Intent | Informational → commercial-investigation. Reader is choosing a protocol; that is one step from buying a program. |
| SERP to beat | Forum threads, coaching-company blog posts, YouTube explainers. Win on: a decision rule, tissue-level explanation, and citations. |
| Title tag (≤60) | `Max Hangs vs Repeaters: Which Builds Finger Strength?` |
| Meta description (≤155) | `Max hangs train the nervous system; repeaters build tissue. A kinesiologist explains the difference, the evidence, and how to decide which you need now.` |
| H1 | Max Hangs vs. Repeaters: What Each Actually Trains, and How to Choose |
| Length | 1,400–1,600 words |
| Schema | `Article` + `FAQPage` (3 Qs below) |

**H2 outline**
1. The two protocols in one table (duration, intensity, rest, sets, sessions/week)
2. What max hangs change: recruitment, rate coding, rate of force development
3. What repeaters change: flexor hypertrophy, tendon stiffness, time under tension
4. What the studies compared (López-Rivera & González-Badillo 2012; Bohm et al. 2015; Levernier & Laffaye 2019 `[VERIFY]`)
5. The decision rule (training age, injury history, goal, timeline) ← contextual CTA follows this section
6. Why sequence beats choice: accumulation before intensification → link to Article B
7. Progression inside either protocol → link to Article C
8. FAQ: "Can I do both in one week?", "How long should a max hang be?", "Are repeaters safer for beginners?"

**Internal links:** in → from `index.html` featured, from Article B section 2, from Article C section 1. Out → B, C, `practice.html` (contextual + aside + end card).

---

## Article B — The 8-Week Finger Strength Block (hub page)

| Field | Spec |
|---|---|
| Slug | `/articles/8-week-finger-strength-block.html` |
| Primary query | `8 week hangboard program` |
| Secondary queries | `finger strength training program climbing`, `hangboard periodization`, `how to periodize hangboard training`, `hangboard program intermediate` |
| Intent | Commercial-investigation. Reader wants a program. This is the page most likely to convert directly; it must give a complete free template and make the paid guide the obvious "written-out" version. |
| SERP to beat | Coaching-company program pages and app landing pages. Win on: transparency (the template is on the page), gates, and no signup wall. |
| Title tag (≤60) | `8-Week Finger Strength Block: A Periodized Hangboard Plan` |
| Meta description (≤155) | `A kinesiologist's 8-week hangboard periodization: accumulation, intensification, realization, deload, with the safety gates between phases. Free template.` |
| H1 | How to Periodize Finger Strength: The 8-Week Block, With Safety Gates |
| Length | 1,800–2,000 words |
| Schema | `Article` + `FAQPage` + `HowTo` (the four blocks as steps) |

**H2 outline**
1. Why the same session every week stops working (adaptation, dose vs. load)
2. Who this block is for, and who it is not for (training age ≥ ~2 yr, pain-free crimping, no adolescents) ← this section is also the ethical qualifier
3. Block 1 Accumulation (wk 1–3): table of sessions → link to Article A for protocol detail
4. Gate 1 checklist
5. Block 2 Intensification (wk 4–6): table
6. Gate 2 checklist
7. Block 3 Realization (wk 7) and Block 4 Deload (wk 8)
8. Progression rule inside blocks → link to Article C
9. What the paid guide adds (load tables by bodyweight, session logs, gate checklists, warm-up and antagonist work) ← contextual CTA; this is the one article where a short honest "what's inside" list is appropriate
10. FAQ: "Can I climb during the block?", "What if I fail a gate?", "Do I need added weight?"

**Internal links:** in → from `index.html` nav or featured, from `practice.html` ("read the free template first"), from A and C, from every existing article (Week 3 refresh). Out → A, C, `practice.html`.

---

## Article C — Hangboard Progression and Safety Gates

| Field | Spec |
|---|---|
| Slug | `/articles/hangboard-progression-how-much-weight.html` |
| Primary query | `how much weight to add hangboard` |
| Secondary queries | `hangboard progression`, `when to add weight to hangs`, `hangboard weighted hangs progression`, `hangboard too much too soon pulley` |
| Intent | Informational with high purchase adjacency: the reader is already training and wants to progress safely. Directly showcases the product's differentiator (gates). |
| SERP to beat | Short forum answers and generic "add 5 lb" advice. Win on: a percentage rule, a one-variable rule, and the pain-monitoring criteria. |
| Title tag (≤60) | `How Much Weight to Add to Hangboard Hangs (and When)` |
| Meta description (≤155) | `A kinesiologist's progression rule for weighted hangs: how much to add, when to hold, and the pulley safety gates that tell you to stop. Evidence-based.` |
| H1 | Hangboard Progression: How Much Weight to Add, When to Hold, and When to Stop |
| Length | 1,400–1,600 words |
| Schema | `Article` + `FAQPage` |

**H2 outline**
1. Why "add 5 lb when it feels easy" injures pulleys (crimp load multipliers; Vigouroux 2006 `[VERIFY]`)
2. The rule: ≤2–5% of total system weight, smallest available increment, only after a session completed with reps in reserve
3. One variable per week: load *or* volume *or* duration
4. The pain-monitoring rule (≤3/10, settles in 24 h, no upward trend; Silbernagel 2007 `[VERIFY]`)
5. Safety gates: the green/yellow/red triage in short form (link the community Framework 2 logic; do not reproduce it fully)
6. Session log template (a 6-column table readers can copy) ← contextual CTA follows
7. When to stop progressing and deload → link to Article B
8. FAQ: "Should I use a pulley system to remove weight?", "How often should I re-test my max?", "Is a 20 mm edge the standard?"

**Internal links:** in → from A section 7, B section 8, `practice.html` FAQ ("how does the guide handle progression?"). Out → A, B, `practice.html`.

---

## Publishing checklist (per article; Sonnet marks each)

- [ ] Slug, title tag, meta, H1 exactly as specified (or existing page updated in place)
- [ ] All `[VERIFY]` citations resolved by DOI or softened per guardrails
- [ ] Claims guardrail checklist passed
- [ ] Three CTAs present with `?ref=site-article-<slug>`
- [ ] Inbound links added on the named source pages (not just outbound)
- [ ] `sitemap.xml` updated with `lastmod`
- [ ] GSC "Request indexing" submitted; URL logged in `tracking/kpi-log.csv` notes
- [ ] Mobile render checked: tables scroll horizontally inside their container, no page-level horizontal scroll
