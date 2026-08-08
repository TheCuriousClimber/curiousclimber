# The Autobody Shop — self-directed fitness enhancement

A **self-contained, independent** website built around one idea: *your body is a
high-performance vehicle, and you pick the upgrades.* It reframes climbing
strength & conditioning as a performance-car tune-up — a distinct brand with its
own industrial "garage" design system, separate from the climbing site.

- **Independent:** its own `assets/styles.css` and `assets/app.js`. Nothing here
  depends on or links back to the climbing site.
- **No build step:** plain static HTML/CSS/JS. Open `index.html` or deploy the
  `autobody-shop/` folder to any static host / GitHub Pages.

## The metaphor

| Shop concept | What it really is |
| --- | --- |
| **Manual drive** | Self-guided training — *you* pick the upgrade packages |
| **Automatic drive** | Coached training — an online trainer builds a "lift kit" from a video assessment |
| **Tune-up packages** | Top Speed (horsepower), Engine (push/pull), Fuel Tank (work capacity), Exterior (aesthetics & protection) |
| **Performance qualities** | Power, Strength, Endurance, Power-Endurance — each with climbing benchmarks |
| **Under the Hood** | Program requirements, recommendations, and workout specs (sets/reps/load/rest) |
| **The Car Wash** | Your daily sweat — the workout of the day / group sessions |
| **The Gas Station** | Premium fuel — nutrition plans |
| **The Oil Change** | The shop blog |

## Pages

```
index.html            Landing — the shop, three standards, manual vs automatic, packages, services
manual.html           Self-guided: 4 tune-up packages (interactive build sheet) + 4 quality deep-dives
automatic.html        Coached: personalized lift kit, video assessment, service process
under-the-hood.html   Requirements, recommendations, the tuning spec table, periodization, FAQ
car-wash.html         Workout of the day — weekly wash rotation
gas-station.html      Nutrition — fuel grades, timing, plans
oil-change.html       Blog index
assets/styles.css     Standalone "performance garage" design system
assets/app.js         Nav toggle, footer year, self-guided build-sheet configurator, scroll reveal
```

## The three build standards

Every plan is judged against: **Durable** (hard to injure), **Functional**
(transfers to the wall), **Purposeful** (matched to your own goals and weak links).

## Interactive build sheet

On **manual.html**, each tune-up package has an *Add to build sheet* button. The
sheet (`#build-sheet`, driven by `assets/app.js`) tracks your chosen packages and
saves them to `localStorage` — a private worksheet for the self-directed athlete.
Nothing is sent anywhere.

## To finish before launching as a product

- Pick a domain and finalize the brand name.
- Connect checkout / booking for the Automatic assessment and nutrition plans
  (e.g. Gumroad / Calendly).
- Add legal pages (Terms / Privacy / Health Disclaimer / PAR-Q) — the climbing
  site's `legal/` templates can be re-localized and lawyer-reviewed.
- Wire a real daily-wash feed (Car Wash) and publish full blog articles (Oil Change).
- Swap the emoji package art for photography/illustration if desired.

## Note

Climbing-specific and educational — not medical advice. Training guidance is for
apparently healthy adults; individual programming (especially the Automatic
builds) should account for injury history and screening.
