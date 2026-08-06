# The Kinesiology of Climbing

A website that sells **resistance-training programs to rock climbers for sport
performance**, built around three core sections plus a self-directed training
garage.

Live site: static HTML/CSS/JS — no build step. Open `index.html` or deploy the
repo root to GitHub Pages.

## The three sections

| Section | File | What it does |
| --- | --- | --- |
| **Philosophy** | `philosophy.html` | Informational hub. Translates peer-reviewed sport science (exercise physiology, periodization, anatomy) into plain, first-year-undergrad language. Dispels the "lifting makes you bulky" myth to justify — and sell — resistance training. Mix of **free** promotional articles/videos and **premium** members' content. |
| **Practice** | `practice.html` | Marketplace of pre-made, goal-specific, **periodized** programs (max strength, power, endurance, injury-prevention, mobility, balance…). Each program explains how its adaptations transfer to the wall and why to buy it. Includes a built-in **workout logger with progress charts**. |
| **Performance** | `performance.html` | A custom program builder. Takes the climber's grade, experience, strengths/weaknesses, schedule, equipment and injuries, and generates a comprehensive periodized plan — plus an **"adapt my next block"** tool, and optional nutrition & mental-training add-ons. |
| **The Garage** | `autobody-shop.html` | *The Autobody Shop* — a self-directed, car-metaphor fitness hub. Two "drives": **Manual** (pick your own **tune-up packages** — Horsepower/power, Engine/strength, Fuel Tank/endurance, Turbo/power-endurance, Exterior/prehab — and get an instant, personalised **build sheet**) and **Automatic** (order a trainer-fitted **lift kit** from a video assessment). Includes **the dyno bench**, a localStorage benchmark tracker that flags personal bests, plus service-bay teasers for the WOD (car wash), nutrition (gas station) and blog (oil change). |
| **Promotion** | `promotion.html` | Branded merch store — apparel, chalk bags and accessories — with category filtering and a demo checkout. |

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
performance.html    Section 03 — custom program builder
autobody-shop.html  The Garage — self-directed "autobody shop" (manual builds + dyno bench)
promotion.html      Section 04 — branded merch store
articles/           Free long-form articles
assets/css/styles.css   Shared design system (incl. the autobody-shop skin)
assets/js/site.js       Nav, footer year, demo purchase modal
assets/js/logger.js     Workout log (localStorage) + SVG progress charts
assets/js/generator.js  Rules-based custom-program engine
assets/js/autobody.js   The Garage: manual build-sheet engine + dyno benchmark tracker (localStorage)
```

## Notes for going live

This is a fully working **front-end**. A few things are intentionally stubbed
so the site owner can wire them to real services:

- **Legal & safety** — `legal/terms.html`, `legal/privacy.html`,
  `legal/disclaimer.html` and `legal/par-q.html` (health-readiness screening)
  ship as **templates**. They're linked in every footer, in the checkout
  agreement line, and from a health notice by the workout logger. **Fill in the
  `[JURISDICTION]`/emergency-number placeholders and have a lawyer in your
  jurisdiction review them before taking any payment.**
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
