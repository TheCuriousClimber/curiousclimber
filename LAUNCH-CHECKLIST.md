# Launch checklist

Everything the site needs to go from “ready on a branch” to “taking real
subscribers.” Items are grouped by whether **you** must do them (they need your
accounts or private facts) or are already done in the code.

## ✅ Already built (in this repo)
- Full training system: 7 periodized programs, 47-exercise library with
  progressions/regressions, four-part workouts, curated demo videos.
- Workout logger with one-tap **＋ Log** pre-fill.
- **License-key access gate** (Gumroad) with post-purchase `?license=` auto-unlock.
- **PAR-Q readiness checkpoint** + Terms / Privacy / Health Disclaimer pages.
- **GitHub Pages deploy workflow** + `.nojekyll` (see `DEPLOY.md`).

## 🚀 Deploy (see DEPLOY.md)
- [ ] Merge the branch into `main`.
- [ ] Settings → Pages → Source → **GitHub Actions** (one-time toggle).
- [ ] (Optional) Add a `CNAME` file + DNS records for your custom domain, then
      enable **Enforce HTTPS**.

## 💳 Payments — Gumroad (see GUMROAD-SETUP.md)
- [ ] Create products with these exact permalinks: `sub-essential` ($12/mo),
      `sub-complete` ($24/mo), `sub-coach` ($49/mo), `seminar-virtual` ($199),
      plus any one-off programs/merch you want to sell.
- [ ] Enable **“Generate a unique license key per sale”** on each subscription.
- [ ] Set `GUMROAD_USER` in `assets/js/site.js` to your Gumroad subdomain.
- [ ] Set `LICENSE.live = true` in `assets/js/access.js`.
- [ ] (Optional) Set each product’s post-purchase **redirect** to
      `https://YOURSITE/programs.html?license=THEIR-KEY` for one-click unlock.
- [ ] If browser license checks are CORS-blocked, deploy the Cloudflare Worker
      proxy from `README.md` and point `LICENSE.verifyEndpoint` at it.

## 📄 Legal — fill the remaining facts (legal/*.html)
Effective date, contact email, a suggested refund policy, and a default website
URL are pre-filled. **You (ideally with a lawyer) must still complete:**
- [ ] `[LEGAL BUSINESS NAME]` — the entity that operates the site.
- [ ] `[JURISDICTION]` / venue — the governing-law country/state.
- [ ] `[BUSINESS ADDRESS]`.
- [ ] Confirm the **refund policy** wording matches what you’ll actually offer.
- [ ] Confirm `[WEBSITE URL]` (currently the github.io default) and the local
      **emergency number** in the disclaimer.
- [ ] Providers to name in the Privacy Policy: `[HOSTING PROVIDER]` (GitHub Pages),
      `[EMAIL PROVIDER]` and `[analytics]` if you add them.
- [ ] For the live product, use the **official validated PAR-Q+ / ePARmed-X+**
      per its licence (see the note on `legal/par-q.html`).
- [ ] Have a qualified lawyer in your jurisdiction review Terms, Privacy and the
      Disclaimer before taking payments.

## 🌱 Nice-to-have before/after launch
- [ ] Replace exercise-demo video IDs you want to curate further (all 150 are
      pinned; deleting any `yt` reverts that one to a safe search link).
- [ ] Connect the newsletter form to your email provider.
- [ ] Add privacy-friendly analytics (Plausible/Fathom) and disclose it in Privacy.
- [ ] Real photos / an OG social-share image / favicon polish.
- [ ] Fill the education-hub (blog) for Complete & Coach tiers.
