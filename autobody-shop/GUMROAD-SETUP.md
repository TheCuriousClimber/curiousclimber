# Going live with payments (Gumroad)

Every **Get / Buy / Get the package** button is wired to **Gumroad**. Until you
add your Gumroad account the buttons stay in **safe demo mode** (a modal opens,
nothing is charged), so the site is safe to publish as-is and you can switch
products to live payments **one at a time**.

There is **no code to write** — you only edit one config block in
`assets/app.js`.

## 1. Create your Gumroad account
Sign up at <https://gumroad.com>. Your account has a subdomain, e.g.
`https://theautobodyshop.gumroad.com`. The first part (`theautobodyshop`) is your
**Gumroad user** — you'll need it in step 3.

## 2. Create one product per item
For each item below, create a Gumroad product, set its price, and set its
**permalink** (the part after `/l/` in the product URL) to the **product key**
in the table so they match automatically.

| Product key (permalink) | Item | Suggested price | Type |
| --- | --- | --- | --- |
| `top-speed`          | Top Speed — Horsepower (Power program)        | $39      | Digital program |
| `engine`             | Engine — Push & Pull (Strength program)       | $39      | Digital program |
| `fuel-tank`          | Fuel Tank — Work Capacity (Endurance program) | $35      | Digital program |
| `exterior`           | Exterior — Aesthetics & Protection (Prehab)    | $29      | Digital program |
| `full-build-bundle`  | The Full Build Bundle (all 4 packages)         | $99      | Digital bundle |
| `lift-kit`           | Video Assessment + Personalized Lift Kit       | $149     | Service (coached) |
| `coaching-retune`    | Coaching Retune (monthly)                      | $79/mo   | Membership |
| `race-fuel`          | Race Fuel — nutrition plan                      | $19      | Digital plan |
| `full-rebuild`       | Full Rebuild — nutrition plan                   | $19      | Digital plan |
| `lean-mixture`       | Lean Mixture — nutrition plan                   | $19      | Digital plan |
| `fuel-bundle`        | Fuel 3-Pack (all nutrition plans)              | $39      | Digital bundle |
| `wash-pass`          | The Wash Pass (daily workouts)                 | $12/mo   | Membership |

> **Digital programs / plans / bundles:** upload the PDF (or link the content)
> as the product file — buyers get it instantly.
> **Memberships** (`coaching-retune`, `wash-pass`): set them up as Gumroad
> **memberships/subscriptions**.
> **Coached service** (`lift-kit`): sell as a digital product; on purchase,
> email the buyer instructions for submitting their assessment video. You can
> pair this with a scheduling tool (e.g. Calendly) in the delivery email.

## 3. Fill in the config
Open **`assets/app.js`** and edit the block near the top:

```js
var GUMROAD_USER = "theautobodyshop";   // your Gumroad subdomain
var GUMROAD_PRODUCTS = {
  "top-speed":         "top-speed",     // permalink from step 2
  "engine":            "engine",
  // ...fill in each one you've created; leave "" to keep demo mode
};
```

- Set `GUMROAD_USER` to your subdomain.
- For every product you've created, keep its **permalink** as the value.
- Leave any product as `""` to keep it in demo mode until you're ready.

Commit and push — GitHub Pages redeploys in ~1 minute.

## 4. How it behaves once configured
- A configured button becomes a real Gumroad link. Clicking it opens Gumroad's
  **overlay checkout** (`gumroad.js` loads automatically); if the overlay is
  blocked, it falls back to Gumroad's hosted checkout page — either way the sale
  goes through.
- Unconfigured buttons keep the harmless demo modal.

## Alternatives
Prefer a full store with inventory/subscriptions dashboards? You can point the
digital programs at Gumroad while moving memberships to a dedicated platform
later — the same `data-product` hooks make that swap straightforward.
