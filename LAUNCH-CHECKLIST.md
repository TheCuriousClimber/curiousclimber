# Launch checklist — The Kinesiology of Climbing

Status of the three things that stand between you and taking your first payment.

---

## 1. GitHub Pages — ✅ DONE
The site is live and auto-deploys on every push to `main`
(`https://thecuriousclimber.github.io/curiousclimber/`). No action needed.

---

## 2. Gumroad products — ⛔ ACTION REQUIRED (only you can do this)

The site is live-wired to **`mcweeny.gumroad.com`**. Every "Buy" button links to
`https://mcweeny.gumroad.com/l/<permalink>`. **Those links 404 until you create
each product in Gumroad with the exact permalink below.**

> While you set these up, you have two choices:
> - **Leave it live** (buttons 404 until each product exists), or
> - **Ask me to flip `GUMROAD_USER` back to `""`** — this reverts to the safe
>   demo modal (nothing charged, no 404s) until you're ready to go live in one
>   shot. Tell me which you prefer.

### Products to create (permalink = the part after `/l/`)

| Create product with name… | Permalink (exact) | Price | Type / what to upload |
| --- | --- | --- | --- |
| Contact Strength & Finger Power | `contact-strength` | $39 | Digital — program PDF |
| Anaerobic Capacity for Long Routes | `anaerobic-capacity` | $35 | Digital — program PDF |
| Power-Endurance for Redpoints | `power-endurance` | $35 | Digital — program PDF |
| Body Tension & Core for Steep Rock | `body-tension-core` | $29 | Digital — program PDF |
| Hips, High-steps & Mobility | `hips-mobility` | $25 | Digital — program PDF |
| Footwork, Balance & Single-leg Stability | `footwork-balance` | $25 | Digital — program PDF |
| The Complete Climber Bundle | `complete-bundle` | $119 | Digital — bundle |
| Members' Library | `members-library` | $59/yr | Membership |
| Custom Performance Program (adaptive) | `custom-performance` | $149/yr | Membership |
| Coached Video Biomechanical Assessment | `lift-kit` | $129 | Service (video assessment → program) |
| "Send It" Tee | `send-it-tee` | $32 | Physical — variants: S–XXL |
| Kinesiology Hoodie | `hoodie` | $58 | Physical — variants: S–XXL |
| Technical Training Tee | `technical-tee` | $38 | Physical — variants: S–XL |
| Cuffed Beanie | `beanie` | $26 | Physical |
| Signature Chalk Bag | `chalk-bag` | $34 | Physical |
| Zip Chalk Bucket | `chalk-bucket` | $42 | Physical |
| Loose Chalk (100 g) | `loose-chalk` | $9 | Physical |
| Liquid Chalk (200 ml) | `liquid-chalk` | $14 | Physical |
| Insulated Bottle | `bottle` | $28 | Physical |
| Climber's Salve Tin | `salve` | $12 | Physical |
| Sticker Pack | `stickers` | $6 | Physical |
| The Starter Kit | `starter-kit` | $59 | Physical — bundle |

**In Gumroad:** create product → set the **URL/permalink** to the exact value
above → set price → upload the file (digital) or configure shipping/variants
(physical). You can go live one product at a time; any product that doesn't yet
exist simply 404s until you create it. No code changes needed — the site already
points at all of these.

*(For merch fulfillment without holding stock, connect a print-on-demand service
like Printful to Gumroad.)*

---

## 3. Legal — ⚠️ ACCURATE & ALBERTA-LOCALIZED, still needs a lawyer

The four pages (`legal/terms.html`, `legal/privacy.html`, `legal/disclaimer.html`,
`legal/par-q.html`) are localized for the Province of Alberta, Canada, describe
the actual site accurately (Gumroad delivery, browser-only workout log — no
license-key gate), and are linked in every footer and the checkout modal.

**They are still templates that a Canadian/Alberta lawyer should review before
you take money.** Punch-list to confirm with your lawyer / adjust to your
business:

- [ ] **Business identity** — currently "The Kinesiology of Climbing (David
      McWeeny), Alberta, Canada." If you incorporate or use a registered
      business name/address, update it in `terms.html` and `privacy.html`.
- [ ] **Refund policy** (Terms §6) — currently a 14-day first-payment refund on
      subscriptions; one-off purchases non-refundable once accessed. Change to
      match what you actually offer (and confirm it's consistent with Gumroad's).
- [ ] **Liability limitation & assumption of risk** (Terms §10–11, Disclaimer) —
      have the lawyer confirm the **waiver / assumption-of-risk** is enforceable
      in Alberta for a fitness product.
- [ ] **Minimum age** — set to 18 (Terms §1, Privacy §10). Confirm.
- [ ] **International customers** — GDPR/UK/CCPA clauses are included as a
      precaution; confirm they fit how you'll actually sell.
- [ ] **PAR-Q / health screening** — uses the CSEP pre-participation standard and
      links the official PAR-Q+/ePARmed-X+. Confirm this matches your intake
      process.
- [ ] Set a real **effective date** when the lawyer signs off (currently
      6 August 2026).

---

## Nice-to-have before or shortly after launch
- Real **product photos** — drop files into `assets/img/` named by product key
  (see `assets/img/README.md`); they appear automatically.
- Real **video IDs** — set `data-yt=""` on the Philosophy video cards to a
  YouTube ID to activate.
- Connect the **newsletter** form to an email provider.
