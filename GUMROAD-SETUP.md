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

## Alternatives
Prefer a full store with inventory and shipping labels for the merch? You can
point `custom-performance` and the programs at Gumroad (digital) while moving
the **Promotion** merch to **Shopify** or **Printful** later — the same
`data-product` hooks make that swap straightforward.
