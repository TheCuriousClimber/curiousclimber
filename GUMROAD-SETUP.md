# Going live with payments (Gumroad)

The Buy / Add-to-cart / Unlock buttons are wired to **Gumroad**. Until you add
your Gumroad links they stay in **demo mode** (a modal opens, nothing is
charged), so the site is safe to publish as-is and you can switch products to
live payments **one at a time**.

There is **no code to write** — you only edit one config block.

## 1. Create your Gumroad account
Sign up at <https://gumroad.com>. Your account has a subdomain, e.g.
`https://thecuriousclimber.gumroad.com`. The first part (`thecuriousclimber`)
is your **Gumroad user** — you'll need it in step 3.

## 2. Create one product per item
For each item below, create a Gumroad product and set its price. When you save a
product, its URL looks like `https://YOURNAME.gumroad.com/l/contact-strength` —
the part after `/l/` (here `contact-strength`) is the **permalink**. You can set
the permalink yourself when creating the product; use the keys in the table so
they match.

| Product key (permalink) | Item | Suggested price | Type |
| --- | --- | --- | --- |
| `contact-strength`   | Contact Strength & Finger Power | $39 | Digital program |
| `anaerobic-capacity` | Anaerobic Capacity for Long Routes | $35 | Digital program |
| `power-endurance`    | Power-Endurance for Redpoints | $35 | Digital program |
| `body-tension-core`  | Body Tension & Core for Steep Rock | $29 | Digital program |
| `hips-mobility`      | Hips, High-steps & Mobility | $25 | Digital program |
| `footwork-balance`   | Footwork, Balance & Single-leg Stability | $25 | Digital program |
| `complete-bundle`    | The Complete Climber Bundle | $119 | Digital bundle |
| `members-library`    | Members' Library | $59/yr | Membership |
| `custom-performance` | Custom Performance Program (adaptive) | $149/yr | Membership |
| `sub-essential`      | Training System — Essential (up to 3 programs) | $12/mo | Subscription |
| `sub-complete`       | Training System — Complete (all programs + hub) | $24/mo | Subscription |
| `sub-coach`          | Training System — Coach / Pro | $49/mo | Subscription |
| `seminar-virtual`    | Trainer Certification Seminar (virtual) | $199 | Event / digital |
| `send-it-tee`        | "Send It" Tee | $32 | Physical (variants: size) |
| `hoodie`             | Kinesiology Hoodie | $58 | Physical (variants: size) |
| `technical-tee`      | Technical Training Tee | $38 | Physical (variants: size) |
| `beanie`             | Cuffed Beanie | $26 | Physical |
| `chalk-bag`          | Signature Chalk Bag | $34 | Physical |
| `chalk-bucket`       | Zip Chalk Bucket | $42 | Physical |
| `loose-chalk`        | Loose Chalk (100 g) | $9 | Physical |
| `liquid-chalk`       | Liquid Chalk (200 ml) | $14 | Physical |
| `bottle`             | Insulated Bottle | $28 | Physical |
| `salve`              | Climber's Salve Tin | $12 | Physical |
| `stickers`           | Sticker Pack | $6 | Physical |
| `starter-kit`        | The Starter Kit | $59 | Physical bundle |

> **Digital programs / memberships:** upload the program PDF (or link content)
> as the product file — buyers get it instantly.
> **Apparel:** add Gumroad **variants** for sizes (S/M/L/XL). The size selector
> on the page is cosmetic; the real size choice happens on Gumroad's checkout.
> Set stock/shipping in Gumroad, or connect a print-on-demand service like
> **Printful** if you don't want to hold inventory.

## 3. Fill in the config
Open **`assets/js/site.js`** and edit the block near the top:

```js
var GUMROAD_USER = "thecuriousclimber";   // your Gumroad subdomain
var GUMROAD_PRODUCTS = {
  "contact-strength":  "contact-strength", // permalink from step 2
  "anaerobic-capacity":"anaerobic-capacity",
  // ...fill in each one you've created; leave "" to keep demo mode
};
```

- Set `GUMROAD_USER` to your subdomain.
- For every product you've created, paste its **permalink** as the value.
- Leave any product as `""` to keep it in demo mode until you're ready.

Commit and push — GitHub Pages redeploys in ~1 minute.

## 4. How it behaves once configured
- A configured button becomes a real Gumroad link. Clicking it opens Gumroad's
  **overlay checkout** (the site's `gumroad.js` loads automatically); if the
  overlay is blocked for any reason, it falls back to Gumroad's hosted checkout
  page — either way the sale goes through.
- Unconfigured buttons keep the harmless demo modal.

## Subscriptions &amp; the unlock loop (end-to-end)

The **Programs** page (`programs.html`) sells recurring memberships and gates premium programs behind a **license key**. The full loop, once configured, is: **subscribe on Gumroad → get a license key → paste it (or land back with it in the URL) → program unlocks.**

**One-time setup:**

1. **Create the three subscription products** in Gumroad as *recurring memberships*, using these exact permalinks so the buttons light up automatically:
   `sub-essential` ($12/mo) · `sub-complete` ($24/mo) · `sub-coach` ($49/mo). (The trainer seminar uses `seminar-virtual`.)
2. On **each** subscription product, turn on **“Generate a unique license key per sale.”**
3. Set `GUMROAD_USER` (this file) so the Subscribe buttons become real Gumroad checkouts.
4. In **`assets/js/access.js`**, set `LICENSE.live = true`. The tier→permalink map there already matches (`sub-essential`→essential, etc.); the permalink is enough to verify, and you can optionally add each product’s `product_id` for extra robustness.

**How the unlock works after that:**

- A member clicks **Subscribe**, pays on Gumroad, and receives a **license key**.
- They open **Members** (or “I have a license key” on any locked program) and paste it. We verify it against Gumroad’s license API and, if the subscription is active, unlock that tier (cached in the browser).
- **Smoother option:** in the product’s *“Redirect”* setting on Gumroad, send buyers to `https://YOURSITE/programs.html?license=THEIR-KEY`. The page auto-verifies the key and unlocks on arrival, then removes it from the address bar. (Confirm Gumroad’s current variable for inserting the key; otherwise members just paste it once.)

**Verification calls blocked by CORS?** Point `LICENSE.verifyEndpoint` at a tiny proxy — a copy-paste Cloudflare Worker is in the main `README.md`.

**Readiness checkpoint:** before any workouts open (free or paid), members must complete the one-time **PAR-Q readiness check** (`legal/par-q.html`). This is a safety/liability gate that sits alongside the license gate.

**Demo mode:** while `GUMROAD_USER` is empty or `LICENSE.live = false`, Subscribe buttons open the harmless demo modal and the keys `DEMO-ESSENTIAL` / `DEMO-COMPLETE` / `DEMO-COACH` unlock locally so you can test the whole flow before going live.

## Alternatives
Prefer a full store with inventory and shipping labels for the merch? You can
point `custom-performance` and the programs at Gumroad (digital) while moving
the **Promotion** merch to **Shopify** or **Printful** later — the same
`data-product` hooks make that swap straightforward.
