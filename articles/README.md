# Articles — posts convention

This folder holds the site's free articles. Each article is a **standalone HTML
page** in this folder, and every published article is listed as a card in
**`articles/index.html`**. Automation (the weekly blog-draft GitHub Action, or an
on-demand `@claude` request) follows the rules below and opens a **pull request** —
nothing publishes until you merge it.

## How to add a new article

1. **Create the page** `articles/<slug>.html`, where `<slug>` is short and
   hyphenated (e.g. `antagonist-training.html`). Copy an existing article
   (`strength-to-weight.html` is the cleanest template) and keep its structure:
   - Same `<head>` (stylesheet at `../assets/css/styles.css`, the SVG favicon).
   - Same `.site-header` nav and `.site-footer` blocks — do not restyle them.
   - `<title>` ends with `| The Kinesiology of Climbing`.
   - A `<meta name="description">` of ~150 characters.
   - `.article-head` with a `← Back to Philosophy` link, a `.tag-row`
     (`<span class="badge badge-free">Free</span>` + one or two `.tag` topics),
     an `<h1>`, and `.article-meta` (byline + `N min read`).
   - Body copy inside `<article class="prose">`.
   - Close with the `.cta-strip` and the standard footer.
   - Script tag `../assets/js/site.js` at the end.

2. **Add one card to the index.** In `articles/index.html`, insert a single
   `<article class="card">…</article>` block **immediately after the
   `<!-- ARTICLES:START -->` marker** (newest first). Match the existing cards:
   a `.card-media` gradient, a `.tag-row`, `<h3>` title, one-sentence `<p>`, and a
   `.card-foot` with `N min read` + a `Read →` link to the new page. Do **not**
   remove or reorder the `ARTICLES:START` / `ARTICLES:END` markers.

3. **Open a PR** — never commit article changes straight to `main`. Title it
   `Article: <human title>` and summarize the topic and sources.

## Voice & content rules (non-negotiable)

- **Educational, not medical advice.** No diagnosis, no prescriptions, no
  “cure” claims. Keep the footer disclaimer intact.
- **Evidence-based.** Ground claims in established exercise science and include a
  `Sources & further reading` list (`.refs`) at the end. Don't invent citations —
  reference well-known, real work; if unsure, say the summary is simplified.
- **Audience:** climbers with no sports-science background. Plain language,
  first-year-student level, like the existing articles.
- **Free articles only here.** These are promotional/free (`badge-free`).
  Paywalled programs live in `practice.html` / `performance.html`, not here.
- **No pricing, product, or checkout changes** from a blog PR. Those are
  separate, review-gated changes (see repo `GUMROAD-SETUP.md`).
- Keep it self-contained: no external scripts, fonts, or trackers; images (if
  any) go in `assets/img/` and are referenced relatively.

## Topic ideas (safe wheelhouse)

Antagonist training for elbow health · deload weeks · grip types and pulley load ·
hangboard basics · warming up the fingers · sleep and recovery · training age vs.
chronological age · why max hangs beat endless pull-ups · nutrition basics for
strength-to-weight · mobility for high-steps. Prefer topics that connect to an
existing program so the CTA is natural.
