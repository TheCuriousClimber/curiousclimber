# Launch checklist — The Autobody Shop

Everything needed to take this from a working, self-contained site to a live
storefront taking real money.

## Status right now
- [x] Full multi-page site (7 pages) — static HTML/CSS/JS, no build step
- [x] Sellable product catalog with prices & Buy buttons (12 products)
- [x] Checkout engine wired to **Gumroad**, in **safe demo mode** (nothing charged)
- [x] Legal pages: Terms, Privacy, Health Disclaimer, PAR-Q (linked in every footer)
- [x] Self-guided build sheet (localStorage), mobile nav, scroll reveal

## 1. Payments (required to sell) — see `GUMROAD-SETUP.md`
- [ ] Create a Gumroad account; note your subdomain (the `GUMROAD_USER`)
- [ ] Create the 12 products with the permalinks in the setup guide, set prices
- [ ] Upload each program/plan PDF; set memberships as subscriptions
- [ ] Set `GUMROAD_USER` and permalinks in `assets/app.js`
- [ ] Buy-test one product end to end (use a Gumroad discount code for $0)

## 2. Deliverables (what buyers actually receive)
- [ ] Write the four tune-up programs (Top Speed, Engine, Fuel Tank, Exterior) as PDFs
- [ ] Write the three nutrition plans (Race Fuel, Full Rebuild, Lean Mixture)
- [ ] Define the coached "Lift Kit" intake: how buyers submit assessment video
- [ ] Stand up the Wash Pass daily-workout delivery (feed, email, or members area)

## 3. Legal & business
- [ ] Have a lawyer review Terms / Privacy / Disclaimer for your jurisdiction
- [ ] Confirm the operating name, business registration and tax handling
- [ ] Confirm refund policy wording matches how you'll actually operate
- [ ] Replace the PAR-Q with the current official PAR-Q+ if you want a validated screen

## 4. Brand & domain
- [ ] Finalize the brand name ("The Autobody Shop" — check trademark/availability)
- [ ] Register a domain and point it at the site
- [ ] Optional: swap emoji package art for photography/illustration

## 5. Publish (GitHub Pages)
- [ ] Merge the PR to `main`
- [ ] Settings → Pages → Deploy from branch → `main` → `/ (root)` → Save
- [ ] Site is live at `…/curiousclimber/autobody-shop/`
- [ ] (Later) point your custom domain at it

## 6. Nice-to-haves
- [ ] Email capture on the Oil Change (blog) — e.g. a hosted form
- [ ] Real daily-wash feed + leaderboard for the Car Wash
- [ ] Analytics if you want it (currently none — privacy-clean by default)
