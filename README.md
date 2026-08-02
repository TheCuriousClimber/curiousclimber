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
| **Performance** | `performance.html` | A custom program builder. Takes the climber's grade, experience, strengths/weaknesses, schedule, equipment and injuries, and generates a comprehensive periodized plan — plus an **"adapt my next block"** tool, and optional nutrition & mental-training add-ons. |

### Free articles (Philosophy)
- `articles/myth-bulk.html` — flagship: "Lifting will make me bulky" myth-busting
- `articles/strength-to-weight.html` — neural adaptation & strength-to-weight ratio
- `articles/periodization.html` — periodization in plain language
- `articles/finger-anatomy.html` — pulleys, tendons & staying healthy

## Structure

```
index.html          Landing page tying the three pillars together
philosophy.html     Section 01 — the science hub
practice.html       Section 02 — program library + workout logger
performance.html    Section 03 — custom program builder
articles/           Free long-form articles
assets/css/styles.css   Shared design system
assets/js/site.js       Nav, footer year, demo purchase modal
assets/js/logger.js     Workout log (localStorage) + SVG progress charts
assets/js/generator.js  Rules-based custom-program engine
```

## Notes for going live

This is a fully working **front-end**. A few things are intentionally stubbed
so the site owner can wire them to real services:

- **Payments** — "Buy / Unlock" buttons open a demo checkout modal
  (`data-buy` in `assets/js/site.js`). Connect to Stripe, Gumroad, etc.
- **Workout logger** — data is stored in the browser via `localStorage`. Swap
  for a backend/account system to sync across devices.
- **Performance builder** — a transparent, rules-based engine grounded in
  exercise-science principles. It's a preview of the full ML-backed product;
  connect a machine-learning backend to personalise and adapt at finer grain.
- **Newsletter form** — connect to your email provider.
- **Citations** — article references point to well-established work in the
  field; confirm/expand exact sources before publishing.
- **Videos** — video cards are placeholders; embed real videos when ready.

Future consideration from the brief: a **Promotion** section selling branded
merchandise (clothing, chalk bags) can be added as a fourth top-nav item.

## Credits
David McWeeny, MSc Kinesiology · [@thecuriousclimber](https://instagram.com/thecuriousclimber)
