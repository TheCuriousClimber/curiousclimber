# The Kinesiology of Fitness — standalone general-fitness site (seed)

A **self-contained, independent** one-page site for a general-population
strength-&-conditioning brand — the "Garage" concept extracted from the climbing
site and rewritten in plain kinesiology terms (no car metaphors, no climbing).

- **Independent:** own `assets/styles.css` and `assets/app.js`; does not depend on
  or link to the climbing site.
- **Working title:** "The Kinesiology of Fitness" — rename before launch.
- **Not linked** from the climbing site.

## Promote it to its own website
This is ready to become a standalone repo whenever you want:

```
# from a copy of this folder
git init && git add . && git commit -m "Initial general-fitness site"
# create a new GitHub repo, then:
git remote add origin https://github.com/<you>/<new-repo>.git
git push -u origin main
# enable Pages: Settings → Pages → Deploy from a branch → main / root
```

## What's here vs. what's preserved
- **Here:** a complete landing page — hero, three standards, five training
  focuses (Power Output, Maximal Strength, Conditioning & Endurance,
  Power-Endurance, Mobility & Injury Prevention), self-guided vs coach-assessed,
  benchmarks, about.
- **Preserved in git history** (climbing repo, commit `49ce9c8`): the original
  interactive engine — `autobody-shop.html` + `assets/js/autobody.js` (build-sheet
  generator + benchmark tracker). Its content is climbing-specific and
  car-themed; adapt it to general-population exercises when you build out the
  interactive tool here.

## To finish before launching this as a product
- Rename the brand and pick a domain.
- Connect checkout/booking for the coach assessment (Gumroad / Calendly).
- Add a general-population exercise library if you port the interactive tool.
- Legal pages (Terms / Privacy / Health Disclaimer / PAR-Q) — reuse the
  climbing site's `legal/` templates, re-localized and lawyer-reviewed.
