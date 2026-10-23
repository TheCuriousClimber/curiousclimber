# Gumroad product creation checklist

Create each product in Gumroad and set its **permalink** (the part after `/l/`)
to the exact `code` value below, so the site's Buy buttons light up automatically
once you set `GUMROAD_USER`. Prices are the suggested launch prices from each
repo's `LAUNCH-CHECKLIST.md`. Tick items off as you create them.

- **Digital programs / plans / bundles:** upload the PDF as the product file.
- **Memberships** (marked 🔁): create as a Gumroad **subscription**, not one-time.
- One Gumroad account can serve both sites — permalinks are unique per account,
  which is why the Autobody "lift kit" uses `lift-kit-auto` (see note at the end).

---

## Curious Climber — 22 products
Config file: `assets/js/site.js` · set `GUMROAD_USER` to your subdomain.

### Practice programs
- [ ] `contact-strength` — Contact Strength & Finger Power — **$39**
- [ ] `anaerobic-capacity` — Anaerobic Capacity for Long Routes — **$35**
- [ ] `power-endurance` — Power-Endurance for Redpoints — **$35**
- [ ] `body-tension-core` — Body Tension & Core for Steep Rock — **$29**
- [ ] `hips-mobility` — Hips, High-steps & Mobility — **$25**
- [ ] `footwork-balance` — Footwork, Balance & Single-leg Stability — **$25**
- [ ] `complete-bundle` — The Complete Climber Bundle — **$119**

### Philosophy membership
- [ ] `members-library` — Members' Library — **$59/yr** 🔁

### Performance
- [ ] `custom-performance` — Custom Performance Program (adaptive) — **$149/yr** 🔁
- [ ] `lift-kit` — Coached Video Biomechanical Assessment — **$129**

### Promotion / merch
- [ ] `send-it-tee` — "Send It" Tee — **$32**
- [ ] `hoodie` — Kinesiology Hoodie — **$58**
- [ ] `technical-tee` — Technical Training Tee — **$38**
- [ ] `beanie` — Cuffed Beanie — **$26**
- [ ] `chalk-bag` — Signature Chalk Bag — **$34**
- [ ] `chalk-bucket` — Zip Chalk Bucket — **$42**
- [ ] `loose-chalk` — Loose Chalk (100 g) — **$9**
- [ ] `liquid-chalk` — Liquid Chalk (200 ml) — **$14**
- [ ] `bottle` — Insulated Bottle — **$28**
- [ ] `salve` — Climber's Salve Tin — **$12**
- [ ] `stickers` — Sticker Pack — **$6**
- [ ] `starter-kit` — The Starter Kit — **$59**

---

## The Autobody Shop — 12 products
Config file: `assets/app.js` · set `GUMROAD_USER` to your subdomain.

### Manual — self-guided tune-up programs
- [ ] `top-speed` — Top Speed — Horsepower (Power program) — **$39**
- [ ] `engine` — Engine — Push & Pull (Strength program) — **$39**
- [ ] `fuel-tank` — Fuel Tank — Work Capacity (Endurance program) — **$35**
- [ ] `exterior` — Exterior — Aesthetics & Protection (Prehab) — **$29**
- [ ] `full-build-bundle` — The Full Build Bundle (all 4 packages) — **$99**

### Automatic — coached
- [ ] `lift-kit-auto` — Video Assessment + Personalized Lift Kit — **$149**
- [ ] `coaching-retune` — Coaching Retune — **$79/mo** 🔁

### Gas Station — nutrition
- [ ] `race-fuel` — Race Fuel nutrition plan — **$19**
- [ ] `full-rebuild` — Full Rebuild nutrition plan — **$19**
- [ ] `lean-mixture` — Lean Mixture nutrition plan — **$19**
- [ ] `fuel-bundle` — Fuel 3-Pack (all nutrition plans) — **$39**

### Car Wash — membership
- [ ] `wash-pass` — The Wash Pass (daily workouts) — **$12/mo** 🔁

---

## After creating the products
1. In each repo's config file, set `GUMROAD_USER` to your Gumroad subdomain
   (e.g. `mcweeny`). While it's `""` the whole site stays in safe demo mode.
2. The permalinks are pre-filled to match the codes above, so buttons go live
   automatically. Leave any single product's value as `""` to keep just that one
   in demo mode.
3. Buy-test one product end to end (a 100%-off Gumroad discount code makes it $0).
4. Commit + push each config change via a pull request (pricing/checkout stays
   review-gated) — GitHub Pages redeploys in ~1 minute.

### Note on the shared `lift-kit` permalink
Both sites sell a coached video assessment. On a **single** Gumroad account a
permalink must be unique, so:
- Curious Climber keeps permalink **`lift-kit`** ($129).
- The Autobody Shop uses permalink **`lift-kit-auto`** ($149). Its button still
  uses `data-product="lift-kit"` internally; only the Gumroad permalink differs,
  already wired in `assets/app.js`.
If you instead use **two separate Gumroad accounts**, you can revert the Autobody
permalink to `lift-kit` — tell me and I'll change it back.
