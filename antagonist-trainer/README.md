# Antagonist Trainer — standalone antagonist &amp; tendon-adaptation tool (seed)

A **self-contained, independent** one-page web tool that generates a
personalised 4-week antagonist and tendon-adaptation program for climbers,
overhead athletes and high-volume pulling sports.

- **Independent:** own `assets/styles.css` and `assets/app.js`; does **not**
  depend on, or link to, the climbing site in this repo.
- **Working title:** "Antagonist Trainer" — rename before launch.
- **Not linked** from the climbing site.

## What's here

- `index.html` — the landing page + assessment form (sport, joint focus,
  equipment, weekly agonist volume, peak RPE, symptom VAS + areas).
- `assets/app.js` — the transparent rules engine. Maps each under-loaded tissue
  (wrist/forearm extensors, shoulder external rotators, scapular retractors,
  non-contractile tendon) to its best-evidenced loading protocol and lays out a
  progressive 4-week block. Plus minimal standalone site behaviour (nav, year).
- `assets/styles.css` — self-contained copy of the shared design system.
- `ROADMAP.md` — plan for turning this prototype into a live AI product.

## Clinical logic encoded

- **Protocols:** isometric holds (30–45 s, ~60–70% MVIC), heavy-slow eccentrics /
  HSR (`3-0-3-0`), hypertrophy and postural endurance.
- **4-week structure:** weeks 1–3 progress volume (baseline → volume → peak
  load); week 4 deloads ~35% while holding intensity.
- **Safety guardrail:** reported symptom severity **> 5/10 (VAS)** switches to a
  symptom-led mode that leads with isometrics and off-loading instead of heavy
  dynamic eccentrics, with a physiotherapist-referral notice.

## Run it locally

It's static — open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000   # then visit http://localhost:8000/
```

## Promote it to its own website

Ready to become a standalone repo whenever you want:

```
# from a copy of this folder
git init && git add . && git commit -m "Initial antagonist-trainer site"
# create a new GitHub repo, then:
git remote add origin https://github.com/<you>/<new-repo>.git
git push -u origin main
# enable Pages: Settings → Pages → Deploy from a branch → main / root
```

## To finish before launching this as a product

- Rename the brand and pick a domain.
- Legal pages (Terms / Privacy / Health Disclaimer / PAR-Q) — reuse the climbing
  site's `legal/` templates, re-localized and lawyer-reviewed. **A health tool
  giving loading advice needs these before taking money.**
- Connect an email-capture / checkout provider.
- See `ROADMAP.md` for the path to the AI-powered, data-adaptive version.
