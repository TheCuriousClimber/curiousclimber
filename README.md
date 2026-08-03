# The Kinesiology of Climbing

A website that sells **resistance-training programs to rock climbers for sport
performance**, built around three sections.

Live site: static HTML/CSS/JS — no build step. Open `index.html` or deploy the
repo root to GitHub Pages.

## The three sections

| Section | File | What it does |
| --- | --- | --- |
| **Philosophy** | `philosophy.html` | Informational hub. Translates peer-reviewed sport science (exercise physiology, periodization, anatomy) into plain, first-year-undergrad language. Dispels the "lifting makes you bulky" myth to justify — and sell — resistance training. Mix of **free** promotional articles/videos and **premium** members' content. |
| **Practice** | `practice.html` | Marketplace of pre-made, goal-specific, **periodized** programs (max strength, power, endurance, injury-prevention, mobility, balance…). Each program explains how its adaptations transfer to the wall and why to buy it. Includes a built-in **workout logger with progress charts**. |
| **Programs** | `programs.html` | **The training system.** A data-driven strength & conditioning engine: periodized program templates rendered into full, phone-friendly plans, where **every exercise has a regression/progression ladder** you scale in place. Four-part workouts, evidence-based justifications with citations, plain-language how-to, scalable subscription tiers, and a train-the-trainer seminar. See "The training system" below. |
| **Performance** | `performance.html` | A custom program builder. Takes the climber's grade, experience, strengths/weaknesses, schedule, equipment and injuries, and generates a comprehensive periodized plan — plus an **"adapt my next block"** tool, and optional nutrition & mental-training add-ons. |
| **Promotion** | `promotion.html` | Branded merch store — apparel, chalk bags and accessories — with category filtering and a demo checkout. |

### The training system (`programs.html`)

A general strength & conditioning engine that reads two data files and renders complete, professional, mobile-first programs — no build step. It directly implements the brief: template-driven programs, periodization, scalable difficulty, four-section workouts, full metadata + evidence, exercise demos, and tiered subscriptions.

```
assets/data/exercises.js   Exercise LIBRARY. Every exercise is a "family":
                           an ordered ladder from easiest regression →
                           hardest progression (MBSC-style scalable
                           difficulty), with cues, tempo and a demo link
                           per variation. 47 families / 150 variations.
assets/data/programs.js    PROGRAM TEMPLATES + subscription TIERS. Each
                           program has metadata (audience, length, gear,
                           level, tier), a high-school-readable description,
                           an evidence-based justification with citations, a
                           how-to glossary, and PHASES → four-section
                           WORKOUTS that reference the exercise library.
assets/js/program-engine.js  Renders the filterable library, the full
                           program viewer (overview → periodization table →
                           phase-by-phase workouts), the live ◀ Regress /
                           Progress ▶ scaler on each exercise, a "＋ Log"
                           button that pre-fills the workout logger from a
                           prescription, and the pricing-tier grid.
                           Print/save built in.
```

**Adding a program:** append an object to `TS_PROGRAMS` in `programs.js`, referencing exercise `id`s from `exercises.js`. Each workout needs `warmup`, `prehab`, a main block (`main`/`power`/`conditioning`) and `cooldown` arrays of `{ ex, level, sets, reps, tempo, rest, note }`. `level` is the starting rung of that exercise's ladder; the viewer lets users scale up/down from there.

**Adding an exercise:** append a family to `TS_EXERCISES`. Give it a `levels` array ordered easiest → hardest. Each level has a `q` search phrase (the never-rot fallback) and a pinned `yt` YouTube id for a specific demo. **All 150 current variations are pinned** to curated tutorials (IDs favour reputable sources — NASM, Squat University, OPEX, exercise libraries — where available; see the note at the top of `exercises.js`). These were sourced from web search, so spot-check and swap in your own where you prefer; deleting a level's `yt` reverts just that level to the search fallback. New levels you add can start with only a `q` (search) and get a `yt` later.

**Workout logger pre-fill:** every main/power/conditioning exercise in a rendered program shows a **＋ Log** button. It drops the exercise's current (scaled) variation name plus its prescribed sets and reps straight into the logger form (`assets/js/logger.js`) and scrolls you there — so tracking a set is one tap. The logger still stores data in `localStorage`.

**Subscription tiers** live in `TS_TIERS` and scale by how many programs a member can open (Free → Essential → Complete → Coach/Pro). Each tier's CTA is wired to Gumroad via its `product` key (`sub-essential`, `sub-complete`, `sub-coach`); the trainer seminar uses `seminar-virtual`. Fill the permalinks in `assets/js/site.js` to go live — see `GUMROAD-SETUP.md`.

### Free articles (Philosophy)
- `articles/myth-bulk.html` — flagship: "Lifting will make me bulky" myth-busting
- `articles/strength-to-weight.html` — neural adaptation & strength-to-weight ratio
- `articles/periodization.html` — periodization in plain language
- `articles/finger-anatomy.html` — pulleys, tendons & staying healthy

## Structure

```
index.html          Landing page tying the sections together
philosophy.html     Section 01 — the science hub
practice.html       Section 02 — program library + workout logger
programs.html       The training system — data-driven periodized programs
performance.html    Section 03 — custom program builder
promotion.html      Section 04 — branded merch store
articles/           Free long-form articles
assets/css/styles.css   Shared design system
assets/data/exercises.js  Exercise library w/ progression/regression ladders
assets/data/programs.js   Program templates + subscription tiers
assets/js/program-engine.js  Renders programs, the scaler, and pricing tiers
assets/js/site.js       Nav, footer year, demo purchase modal
assets/js/logger.js     Workout log (localStorage) + SVG progress charts
assets/js/generator.js  Rules-based custom-program engine
assets/js/media.js      Drop-in product photos + click-to-load YouTube
```

## Notes for going live

This is a fully working **front-end**. A few things are intentionally stubbed
so the site owner can wire them to real services:

- **Payments (Gumroad)** — Buy / Unlock / Add-to-cart buttons are wired to
  Gumroad and ship in **demo mode** (a modal opens, nothing is charged). To go
  live, fill in `GUMROAD_USER` and the product permalinks in the config block at
  the top of `assets/js/site.js` — no code changes needed. Full walkthrough and
  the product-key → price table are in **`GUMROAD-SETUP.md`**. Products you leave
  blank stay in demo mode, so you can switch to live payments one at a time.
- **Workout logger** — data is stored in the browser via `localStorage`. Swap
  for a backend/account system to sync across devices.
- **Performance builder** — a transparent, rules-based engine grounded in
  exercise-science principles. It's a preview of the full ML-backed product;
  connect a machine-learning backend to personalise and adapt at finer grain.
- **Newsletter form** — connect to your email provider.
- **Citations** — article references point to well-established work in the
  field; confirm/expand exact sources before publishing.
- **Product photos** — merch cards show gradient/emoji placeholders. Drop a
  photo into `assets/img/` named by product key (e.g. `send-it-tee.jpg`) and it
  appears automatically — no HTML editing. See `assets/img/README.md`.
- **Videos** — Philosophy video cards are click-to-load YouTube embeds. Set a
  card's `data-yt=""` to a YouTube ID to activate it; empty stays a placeholder.

The **Promotion** merch store (`promotion.html`) uses the same demo checkout as
the programs — connect a print-on-demand / e-commerce backend (Shopify,
Printful, Gumroad) and swap the placeholder product art for real photos to sell
for real.

## Credits
David McWeeny, MSc Kinesiology · [@thecuriousclimber](https://instagram.com/thecuriousclimber)
