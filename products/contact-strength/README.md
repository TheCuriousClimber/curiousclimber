# Fulfillment note — Contact Strength & Finger Power

**Internal only. Not customer-facing.**

## What this is

The complete, self-contained digital training program that a customer receives when they
buy **Contact Strength & Finger Power** — our first genuine fulfillment asset. The
deliverable is [`PROGRAM.md`](./PROGRAM.md), written to export cleanly to PDF (heading
hierarchy, prescription tables, and `page-break-after` markers between major sections).

- **Product name:** Contact Strength & Finger Power
- **Type:** 8-week periodized finger-strength block (Practice program)
- **Format shipped to customer:** PDF exported from `PROGRAM.md`
- **Intended price:** **$39 CAD** (shown on `practice.html` as `$49` struck through → `$39`)

## How it maps to the store

The buy buttons on `practice.html` carry `data-product="contact-strength"`. In
`assets/js/site.js`, `GUMROAD_PRODUCTS["contact-strength"]` is pre-set to the permalink
`contact-strength`, so once a Gumroad product exists at that permalink and `GUMROAD_USER`
is set, checkout lights up automatically. **This asset is the file to upload as that
Gumroad product's download.**

> No pricing, product config, or Gumroad wiring was created or changed by this draft. Price
> and product creation are human-approved steps (see TODOs).

## Human review checklist — before this is fulfillment-ready

- [ ] **Verify the references (Section 15).** All citations are given by author/year/topic
      and marked ⚠. Confirm exact titles/journals/years against originals, or soften to
      "see the finger-anatomy / periodization articles," **before selling.** Do not present
      any citation as exact until confirmed.
- [ ] **Review all safety and scope language** (Sections 2, 3, 14, and the closing
      disclaimer) — especially the pulley-injury warning signs, the pain/stop rules, and the
      adolescent/open-physis (growth-plate) caution. Confirm it matches
      `legal/disclaimer.html` and `legal/par-q.html` and makes no medical/rehab claim.
- [ ] **Confirm the 8-week structure and phase table** are consistent with the public
      breakdown in `practice.html` (`#detail-power`). They were written to match; re-check
      after any edits.
- [ ] **Export to PDF** and proof the tables/page breaks. Add branding/footer to match site.
- [ ] **Cover image / thumbnail** for the Gumroad listing — TODO (not created here).
- [ ] **Decide on video demos.** `practice.html` markets "video demos" with this program.
      Either produce/link them or adjust the marketing copy so the offer matches delivery.
- [ ] **Human: create the Gumroad product** at permalink `contact-strength`, set the
      **$39 CAD** price, upload the exported PDF, then set `GUMROAD_USER` to go live.
- [ ] Consider bundling the relevant free articles (finger-anatomy, periodization,
      strength-to-weight) or the workout-logger link as included extras.

## Notes

- Content voice, terminology, and claims were matched to `practice.html`, `philosophy.html`,
  `articles/finger-anatomy.html`, and `articles/periodization.html`.
- The program deliberately errs toward caution (open-hand bias, full-crimp warning, 2×/week
  finger cap, conservative progression, explicit deload) consistent with the site's
  safety-first stance.
