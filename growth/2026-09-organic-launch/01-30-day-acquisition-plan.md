# 30-Day Organic Acquisition Plan (8 Sep – 7 Oct 2026)

Timing note: September–October is the start of indoor training season in Canada and the US. Search volume for "hangboard program" and "finger strength" rises through autumn. The plan front-loads indexing so Week 3–4 content catches that curve.

## Funnel math (what 10 sales actually requires)

Cold traffic to a $39 PDF converts at roughly 1–2%. Warm traffic (someone who has already read an article or a community answer from the author) converts at roughly 3–5%. Targets below are the minimum plausible mix; they are the numbers `sales-reporter` compares against each Monday.

| Source | Visits to `practice.html` (30-day target) | Assumed CVR | Expected sales |
|---|---|---|---|
| Reddit (3 framework posts + weekly-thread answers) | 450 | 1.5% | 6–7 |
| MountainProject Training forum | 80 | 1.5% | 1 |
| Organic search (long-tail, new articles) | 150 | 1.5% | 2 |
| Free self-screen list → email nudges | 60 | 4% | 2 |
| Gumroad Discover (optional) | 50 | 1% | 0–1 |
| **Total** | **~790** | | **~11** |

If by the Week 2 Monday report cumulative `practice_page_views` is under 150, the orchestrator reallocates: skip article #3 and add a fourth community post instead. Community is the fast lever; search is the compounding lever.

## Instrumentation (must be live by Day 3, before anything else ships)

All free, all static-site compatible:

1. **Google Search Console** — verify the property (HTML file upload to the repo root), submit `sitemap.xml`, request indexing for every existing article URL. Repeat "request indexing" on each new article the day it is published.
2. **Bing Webmaster Tools** — import from GSC (one click). Bing also feeds DuckDuckGo.
3. **Cloudflare Web Analytics** (free, cookieless, one `<script>` tag in the shared footer). Gives referrers, top pages, and country. Do not add Google Analytics; the consent banner is not worth it at this traffic level.
4. **Gumroad dashboard** — "Analytics → Referrers" already attributes product-page views and sales by referring domain. Nothing to build.
5. **Outbound links from the site to Gumroad** — append `?ref=site-practice` on `practice.html`, `?ref=site-article` on article CTAs. Gumroad records the referrer domain either way; the param is for reading raw Cloudflare click data.
6. **Community links** point to the *site*, never straight to Gumroad. Use `.../practice.html?src=reddit-climbharder` style params so Cloudflare shows the split. Gumroad then shows the site as referrer, which is what we want: the page does the selling.

Definition of done: `sales-reporter` can fill every column of `tracking/kpi-log.csv` for the baseline week from these four dashboards without asking a human.

## The free front-end asset (built in Week 1, used in Weeks 2–4)

**"Finger Loading Readiness Self-Screen"** — a 2-page PDF listed on Gumroad at $0+ (pay-what-you-want with $0 minimum). Gumroad captures the email of every free download and lets us send product updates to those customers. This is the only email capture available without a mailing-list tool, and it costs nothing.

Contents (program-designer drafts, ≤600 words): training-age gate, injury-history gate, the ≤3/10 pain rule, a 3-question grip-position check, and "what to do if you fail a gate." The last page says, in one sentence, that the paid guide is the 8-week block for people who pass all gates, with the link. No other selling.

Why this works: it is genuinely useful on its own, it is the safest thing we can hand a stranger on Reddit, and it pre-qualifies buyers so refunds and injury risk both drop.

## Week 1 (8–14 Sep): Foundation

**Theme:** be findable, be measurable, be present.

| # | Task | Owner | Ceiling | Definition of done |
|---|---|---|---|---|
| 1.1 | Instrumentation 1–6 above | site-edit agent | 2 h | Baseline row can be filled |
| 1.2 | Crawl audit: every page has unique `<title>`, meta description ≤155 chars, canonical, one H1, `Article` schema on articles, `Product` schema on `practice.html` (name, price `39.00`, `priceCurrency: CAD`, `availability: InStock`) | site-edit agent | 1 h | GSC "Enhancements" shows no errors after 72 h |
| 1.3 | Free self-screen PDF written, exported, listed on Gumroad at $0+ | `program-designer` | 600 words | Product live; download tested on mobile |
| 1.4 | Article #1 (`03-seo-content-directives.md`, Article A) published + indexing requested | `kinesiology-writer` | 1,600 words | Live, linked from index and `practice.html`, GSC request sent |
| 1.5 | Community warm-up: the human account posts **zero** links. 8–12 substantive comments across r/climbharder, r/bouldering, and MP Training forum, each answering a training question fully. Sonnet drafts ≤200 words per reply from the reply templates in `02-community-playbook.md`; the human edits and posts. | Sonnet draft / human post | 200 words each | 10 comments posted; account age and karma sufficient for r/climbharder posting |
| 1.6 | Shortlist 5 live threads where a framework post would be on-topic (save URLs in `tracking/threads.md`) | Sonnet | 30 min | 5 URLs with one-line rationale |

Week 1 sales target: 0–1. Do not judge the plan on Week 1.

## Week 2 (15–21 Sep): Authority seeding

**Theme:** publish the two highest-value educational pieces and let them do the introducing.

| # | Task | Owner | Ceiling | Definition of done |
|---|---|---|---|---|
| 2.1 | Article #2 (Article B, the hub page) published + indexing requested | `kinesiology-writer` | 2,000 words | Live, linked from Article A, index, and `practice.html` |
| 2.2 | **Framework 1** posted on r/climbharder (text post, no links) on Tue or Wed 9–11 a.m. ET | human, Sonnet draft | 700 words | Posted; every substantive reply answered within 12 h for 72 h |
| 2.3 | Same framework, rewritten as a forum reply (not a new thread) on the most relevant MP Training thread from 1.6 | human, Sonnet draft | 350 words | Posted |
| 2.4 | Answer 5 questions in the r/climbharder weekly "Training/Hangboard questions" thread. Mention the free self-screen by name only where the question is about readiness or injury. | human, Sonnet draft | 150 words each | 5 answers |
| 2.5 | First Gumroad email to free-screen downloaders: "The 3 most common self-screen failures and what to do about each." One link to Article B; one line at the end for the guide. | Sonnet | 350 words | Sent via Gumroad "Posts" |
| 2.6 | Baseline KPI row completed; Week 2 row started | `sales-reporter` | 10 lines | Posted Monday |

Week 2 sales target: 2–3 cumulative.

## Week 3 (22–28 Sep): Amplification

**Theme:** widen reach without widening spam surface.

| # | Task | Owner | Ceiling | Definition of done |
|---|---|---|---|---|
| 3.1 | Article #3 (Article C) published + indexing requested | `kinesiology-writer` | 1,600 words | Live, interlinked per the link map |
| 3.2 | **Framework 2** posted on r/climbharder; a shorter adaptation on r/bouldering (check that sub's self-promotion rule that week; if text-only educational posts are allowed, post; if not, skip, do not test the mods) | human, Sonnet draft | 700 / 400 words | Posted |
| 3.3 | Reach out to 3 local climbing gyms (Canadian, where the CAD price is native) offering the self-screen PDF free for their member newsletter or front-desk QR, credited to the author. No payment either way. | Sonnet drafts 3 emails ≤120 words; human sends | 3 emails | Sent; replies logged |
| 3.4 | Enable Gumroad Discover on the paid product only if Week 2 checkout-start rate ≥ 5% of product views (the page is converting, so marketplace traffic is worth the fee). Otherwise leave off. | orchestrator decision | 5 min | Logged in KPI notes |
| 3.5 | Refresh the oldest existing article: add "last reviewed" date, an FAQ block with `FAQPage` schema, and a contextual link to Article B. This is the cheapest ranking lift available. | `kinesiology-writer` | 400 new words | Updated, re-indexed |
| 3.6 | Second Gumroad email to free list: "Max hangs vs repeaters in 4 sentences" linking Article A | Sonnet | 250 words | Sent |

Week 3 sales target: 5–7 cumulative.

## Week 4 (29 Sep – 7 Oct): Conversion and compounding

**Theme:** fix the page the traffic lands on; leave assets that keep working after Day 30.

| # | Task | Owner | Ceiling | Definition of done |
|---|---|---|---|---|
| 4.1 | Apply CRO Drop-off 1 changes from `04-cro-practice-page.md` (above-the-fold). Ship Monday. | site-edit agent | 1 h | Live; screenshot before/after in `tracking/` |
| 4.2 | **Framework 3** posted on r/climbharder; reply-form version on MP | human, Sonnet draft | 700 / 350 words | Posted |
| 4.3 | Apply CRO Drop-off 2 changes (pre-checkout trust block + overlay fallback). Ship Thursday only if 4.1 did not reduce checkout starts. | site-edit agent | 1 h | Live |
| 4.4 | "Ask a kinesiologist" reply session: the human announces in that week's r/climbharder questions thread that they will answer finger-training questions for 48 h. No links in the announcement. | human | 2 sessions of 45 min | ≥10 questions answered |
| 4.5 | Third Gumroad email to free list: reader question roundup from 4.4, one guide link | Sonnet | 350 words | Sent |
| 4.6 | Day-30 retrospective: `sales-reporter` produces the four-week table, CVR by source, and a one-paragraph recommendation for the next 30 days (double down on the source with the best sales-per-hour-of-human-time). | `sales-reporter` | 500 words | Committed to `tracking/retro-2026-10-07.md` |

Week 4 sales target: 10 cumulative.

## Kill / pivot rules

- **Reddit post removed by mods:** do not repost, do not message the mods to argue. Read the removal reason, adjust the next framework, and move that week's effort to MP and the weekly thread.
- **Zero sales by Day 14 with ≥150 practice-page views:** the page, not the traffic, is the problem. Pull CRO Drop-off 1 forward to Week 3 Monday.
- **≥2 refunds:** pause all community mentions of the guide, re-read refund reasons, and fix the "who this is not for" block before resuming.
- **Any reader reports pain from following free or paid content:** reply with the clinician route, log the report, and have `program-designer` review the relevant progression within 24 h.

## Human time budget

The plan assumes about 3 hours per week of the human's time, almost all of it posting and replying in communities under their own name. That is deliberate: the credibility moat only works when a real credentialed person is visibly present. Sonnet agents draft; they never post to a community under the human's identity.
