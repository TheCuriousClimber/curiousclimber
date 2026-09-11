# Readiness Self-Screen — 3-Part Email Nurture Sequence

Automated nurture copy for subscribers who download the free **Finger Loading
Readiness Self-Screen** lead magnet (Gumroad product slug `readiness-screen`).

**Sender:** David McWeeny, MSc Kinesiology, CSEP-CPT — The Kinesiology of Climbing
**From:** david.mcweeny@gmail.com
**Guardrails:** All copy follows `growth/2026-09-organic-launch/tracking/claims-guardrails.md`
— no numeric outcome promises, no medical/treatment verbs for the product, a
clinician route wherever loading is discussed, and a soft, honest paid pitch only.
Every email must include an unsubscribe link and the "educational, not medical
advice" line (most ESPs inject the former in the footer).

| # | Trigger / timing | Goal | Primary link |
|---|---|---|---|
| 1 | Immediately on signup | Deliver the PDF, set expectations, reduce refunds/regret | The self-screen PDF |
| 2 | Day 3 | Teach the tissue-adaptation mismatch (the "why") | Article: Max Hangs vs. Repeaters |
| 3 | Day 7 | Soft periodization pitch → the paid guide | Practice page / Contact Strength guide |

---

## Email 1 — Immediate delivery

- **Send:** immediately on signup (0 min delay)
- **Subject:** Your Finger Loading Readiness Self-Screen (inside)
- **Preview text:** Two minutes now can save you months off the wall.

**Body:**

Hi {{first_name|there}},

Thanks for grabbing the **Finger Loading Readiness Self-Screen** — here it is:

👉 **[Download the 2-page PDF]({{download_url}})**

It's short on purpose. Run the four gates before your next hard hangboard session:

1. **Joint health** — any swelling, warmth, or tenderness?
2. **Climbing age & history** — how long, and any recent finger niggles?
3. **Unweighted tolerances** — can you hold a calm 10 seconds at bodyweight?
4. **Workload** — is this week a big spike over your recent normal?

Your most cautious answer routes you: **red** → see a physiotherapist or sports
physician first; **amber** → build capacity with submaximal repeaters; **green**
→ you're a reasonable candidate for max hangs, progressed carefully.

One rule worth internalising now: loading is fine at up to about **3/10
discomfort that settles within 24 hours** and doesn't creep up week to week.
Anything sharp, or any pop, swelling, or bowstringing — stop and get it looked at.

I'll send you two short follow-ups over the next week: one on *why* fingers get
hurt, and one on how to actually structure a block. No spam, unsubscribe anytime.

Climb well,
David
*David McWeeny, MSc Kinesiology, CSEP-CPT — The Kinesiology of Climbing*
*Educational content, not medical advice.*

---

## Email 2 — Day 3: the tissue-adaptation mismatch

- **Send:** 3 days after signup
- **Subject:** Why your fingers feel strong before they're ready
- **Preview text:** Muscle adapts in weeks. Tendon and pulley take longer.

**Body:**

Hi {{first_name|there}},

Here's the trap that catches strong, motivated climbers — the ones who *should*
be careful precisely because they can pull hard.

Your **muscles and nervous system adapt quickly**. Within a few weeks of
focused training you can generate noticeably more force. But the **tendons and
pulleys** that have to transmit that force through your fingers adapt on a
**slower timeline**. So there's a window where you *feel* strong enough to yard
on tiny holds while the connective tissue quietly lags behind. That gap is where
a lot of pulley injuries live.

This is the whole reason the self-screen exists — and the reason the answer to
"which hangboard protocol should I do?" isn't one-size-fits-all:

- If your tissue base is still catching up (**amber**), higher-volume
  **repeaters** give it a repeatable, moderate dose to adapt to.
- If it's genuinely ready (**green**), low-rep, high-force **max hangs** train
  the neural side without much added mass.

I wrote a plain-English breakdown of what each protocol actually trains, and how
to decide:

👉 **[Max Hangs vs. Repeaters: what each trains, and how to choose]({{article_a_url}})**

Respect the slower timeline and you get to keep training. Rush it and you don't.

Climb well,
David
*Educational content, not medical advice. If a finger is painful, get it assessed before loading.*

---

## Email 3 — Day 7: the periodization pitch

- **Send:** 7 days after signup
- **Subject:** The part everyone skips (and why plateaus happen)
- **Preview text:** Doing the same session every week eventually stops working.

**Body:**

Hi {{first_name|there}},

Last one from me — the piece that ties it together.

Most climbers pick *a* hangboard session and repeat it. It works for a while,
then it doesn't, because the body adapts to a repeated stimulus and stops
responding. The fix isn't "try harder" — it's **arranging the work over time**:
build capacity, then build force, then let it surface, then recover. That's
periodization, and it's most of the value in any good program.

I put the entire 8-week structure on the site, free, with the safety gates
between phases — no signup wall:

👉 **[The 8-Week Finger Strength Block (free template)]({{article_b_url}})**

You can absolutely run it from that page. If you'd rather not do the arithmetic
and want it written out **session by session** — with load tables scaled to your
bodyweight, the gate checklists, and the warm-up and antagonist work — that's
exactly what the **Contact Strength & Finger Power** guide is:

👉 **[See what's inside the guide]({{practice_url}})**

*(Full disclosure: that last one is the paid PDF — $39 CAD. Everything you need
to start is free on the site; the guide just does the planning for you.)*

Either way: screen first, progress one variable at a time, and keep the tissue's
timeline — not the ego's — setting the pace.

Thanks for reading,
David
*David McWeeny, MSc Kinesiology, CSEP-CPT — The Kinesiology of Climbing*
*Educational content, not medical advice.*

---

## Merge fields used

| Field | Meaning |
|---|---|
| `{{first_name\|there}}` | Subscriber first name, falling back to "there" |
| `{{download_url}}` | Gumroad/ESP download link for the self-screen PDF |
| `{{article_a_url}}` | `/articles/max-hangs-vs-repeaters.html` |
| `{{article_b_url}}` | `/articles/8-week-finger-strength-block.html` |
| `{{practice_url}}` | `/practice.html#detail-power` (Contact Strength program) |

> Note: Article A/B links also let the sequence double as internal-link equity if
> sent from a domain that renders them. Keep the unsubscribe + physical-address
> footer your ESP requires (CAN-SPAM / CASL compliance).
