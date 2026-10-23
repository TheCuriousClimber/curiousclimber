# Content automation (Layer 2)

PR-based content pipeline for this site. Agents **draft**; you **approve**.
Merging a PR publishes to the live site (GitHub Pages deploys on push to `main`).

## What's wired up

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `.github/workflows/claude.yml` | You mention **`@claude`** in an issue, issue comment, PR review, or PR review comment | Claude acts on that thread — draft/edit a post, adjust copy — and opens or updates a **pull request**. |
| `.github/workflows/weekly-blog-draft.yml` | **Schedule** (Mon 14:00 UTC) or **Run workflow** button | Drafts one new free article per the `articles/README.md` convention and opens a **PR**. |

The posts convention lives in **`articles/README.md`**; the canonical list of
published posts is **`articles/index.html`** (agents append between the
`ARTICLES:START` / `ARTICLES:END` markers).

## One-time activation (owner only)

1. **Install the Claude GitHub app** on this repo — <https://github.com/apps/claude>.
2. **Add the secret** `ANTHROPIC_API_KEY`
   (repo → Settings → Secrets and variables → Actions → *Secrets*).
3. **Add the variable** `ENABLE_BLOG_DRAFTS` = `true`
   (same page → *Variables*). This is the on/off switch for the weekly cron, so
   the schedule stays dormant — no failed runs — until you're ready. The
   `@claude` workflow needs only steps 1–2.

## Using it

- **On demand:** open an issue like *"@claude draft an article on deload weeks
  for climbers"*, or comment `@claude` on any PR. Review the PR it opens, then
  merge (or ask for changes in the thread).
- **Weekly:** once `ENABLE_BLOG_DRAFTS=true`, a fresh draft PR appears every
  Monday. You can also trigger one anytime from **Actions → Weekly blog draft →
  Run workflow**, optionally typing a topic.
- **Change cadence:** edit the `cron` in `weekly-blog-draft.yml`
  (`0 14 * * 1` = Mondays 14:00 UTC).

## Guardrails (kept permanently review-gated)

Automation never commits to `main` directly and must **not** change:
pricing / product config / checkout wiring (`assets/js/site.js` `GUMROAD_*`
block), or the legal / disclaimer / PAR-Q pages. Those are owner-approved PRs
only. See the repo `GUMROAD-SETUP.md` and `LAUNCH-CHECKLIST.md` for the sales
layer.
