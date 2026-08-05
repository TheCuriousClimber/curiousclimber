# Deploying the site

The site is plain static HTML/CSS/JS — no build step. A GitHub Actions workflow
(`.github/workflows/deploy-pages.yml`) publishes it to **GitHub Pages** on every
push to `main`.

## Go live (three steps)

1. **Merge the work to `main`.** Merge PR #5 (or your working branch) into `main`.
   The deploy workflow only runs from `main`.
2. **Turn on Pages once.** In the repo: **Settings → Pages → Build and deployment
   → Source → “GitHub Actions.”** (This toggle has no API — it’s a one-time click.)
   The next push to `main`, or a manual run from the **Actions** tab
   (“Deploy to GitHub Pages” → *Run workflow*), publishes the site.
3. **Visit your site.** With no custom domain it’s served at:
   `https://thecuriousclimber.github.io/curiousclimber/`

`/.nojekyll` is included so Pages serves every file as-is (it skips Jekyll, which
otherwise ignores files/folders — important for `legal/`, `articles/`, `assets/`).

## Custom domain (optional)

1. **Add a `CNAME` file** at the repo root containing only your domain, e.g.:
   ```
   www.thecuriousclimber.com
   ```
   (or the apex `thecuriousclimber.com`). Commit it to `main`.
2. **Set DNS** with your domain registrar:
   - **Apex domain** (`example.com`): four `A` records to GitHub’s IPs —
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (and optionally the matching `AAAA` records for IPv6).
   - **`www` subdomain**: one `CNAME` record pointing to
     `thecuriousclimber.github.io`.
3. In **Settings → Pages → Custom domain**, enter the domain and save; once DNS
   verifies, tick **Enforce HTTPS**. Certificates are issued automatically.

## Notes

- Nothing here is server-side, so Pages is a perfect fit and free.
- The workflow uploads the whole repo root as the site. That includes `README.md`
  etc., which is harmless (they just aren’t linked). If you’d rather ship a clean
  subset, move the site into a `docs/` or `public/` folder and set the workflow’s
  `path:` to it.
- After going live, remember the two runtime switches: `GUMROAD_USER`
  (`assets/js/site.js`) and `LICENSE.live` (`assets/js/access.js`) — see
  `GUMROAD-SETUP.md` — plus completing the legal placeholders (see
  `LAUNCH-CHECKLIST.md`).
