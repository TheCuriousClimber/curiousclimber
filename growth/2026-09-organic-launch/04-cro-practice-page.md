# CRO — `practice.html` (the money page)

**Caveat, read first.** The live page could not be fetched from the planning environment (egress blocked for `thecuriousclimber.github.io` and `gumroad.com`). The two drop-off points below are the highest-probability failure points for a static sales page with a Gumroad overlay button, chosen from the venture spec. Before editing, the site-edit agent runs the 5-minute verification in each section. If a verification fails (the page already has the element), skip that modification and log it; do not add it twice.

**Test method.** Traffic is too low for a true A/B split to reach significance in 30 days. Run sequential tests: one week baseline (Week 1–3 combined serves as baseline), ship Drop-off 1 on Week 4 Monday, ship Drop-off 2 on Week 4 Thursday only if the Monday change did not reduce checkout starts. Decision metric for both: **checkout starts ÷ practice-page views** (from Gumroad "product views" and Cloudflare page views). Sales count is the goal, but at n≈10 it is too noisy to steer by.

**Measurement hooks to add first (10 min):** ensure the Gumroad link on the page carries `?ref=site-practice`; ensure Cloudflare Web Analytics is loaded; take a full-page screenshot on desktop and mobile and save it as `tracking/practice-before.png`.

---

## Drop-off 1 — Above the fold: the page does not qualify the reader or de-risk the click

**Where readers leave:** the first screen. Cold community and search visitors arrive with two questions: "is this for someone like me?" and "what happens if I click?" A hero with a product name, a price, and a "Buy" button answers neither. On mobile this is worse: the CTA is often below the fold entirely.

**Verification (5 min).** Open `practice.html` on a 390-px-wide viewport. Check: (1) is a CTA visible without scrolling? (2) does the first screen state who the guide is for and who it is not for? (3) does the button say what the reader gets and the price? (4) is there a line under the button about format/delivery? If all four are present, log "D1 present" and skip.

**Hypothesis:** stating audience, exclusions, and delivery on the first screen raises checkout starts among qualified readers and lowers refunds among unqualified ones.

**Replace the hero with this block** (adapt class names to the existing stylesheet; keep the existing H1 element type for SEO):

```html
<section class="hero">
  <p class="eyebrow">Evidence-based finger training · MSc Kinesiology, CSEP-CPT</p>
  <h1>Contact Strength &amp; Finger Power</h1>
  <p class="subhead">An 8-week periodized hangboard block with the safety gates between phases — for climbers who have plateaued on repeaters and want to add load without guessing.</p>

  <ul class="proof">
    <li>Accumulation → intensification → realization → deload, written session by session</li>
    <li>Pulley safety gates (A2/A4) and a pain-monitoring rule before every load increase</li>
    <li>Load tables by bodyweight, session logs, warm-up and antagonist work</li>
  </ul>

  <a class="gumroad-button cta-primary"
     href="https://thecuriousclimber.gumroad.com/l/contact-strength?ref=site-practice"
     data-gumroad-overlay-checkout="true">
    Get the guide — $39 CAD
  </a>
  <p class="cta-micro">25-page PDF · instant download · secure checkout via Gumroad</p>

  <aside class="fit-box">
    <p><strong>This guide is for you if:</strong> you have climbed consistently for ~2+ years, can crimp pain-free, and want a structured block rather than another protocol.</p>
    <p><strong>It is not for you if:</strong> you are under 16, currently have finger pain, or have been climbing under a year. Start with the <a href="/curiousclimber/articles/8-week-finger-strength-block.html">free 8-week template</a> and the free readiness self-screen instead.</p>
  </aside>
</section>
```

**Layout rules:** on viewports ≥ 768 px, hero text left, a static image of the guide's cover plus one interior spread right (two real page screenshots, not a mockup). On mobile, stack; the CTA must sit within the first 100 vh. The fit-box sits directly under the microcopy, before any long-form section.

**Copy rules:** the exclusion box is deliberate and stays even if it costs clicks; it is the First-Law control on this page and it reduces refunds. No outcome numbers anywhere in the hero.

**Success rule:** checkout starts per practice-page view rises versus the baseline week, with refunds ≤ baseline. If starts fall by more than 30%, revert the fit-box wording to a single line ("Designed for climbers with ~2+ years of experience and pain-free fingers") and keep everything else.

---

## Drop-off 2 — The overlay click itself: unanswered objections and a fragile checkout path

**Where readers leave:** between scrolling past the hero and completing checkout. Two mechanisms: (a) the reader reaches the end without their specific objection answered and closes the tab; (b) the reader clicks, the Gumroad overlay script is blocked (ad blockers and privacy browsers frequently block third-party scripts), nothing visible happens, and they leave. Gumroad's own dashboard shows this as a gap between site clicks and product views.

**Verification (5 min).** (1) Load the page with a content blocker enabled and click the button: does it still navigate to Gumroad? If the button is a plain `<a href>` to the product it degrades correctly; if it is a `<button>` wired only to the overlay JS, it fails. (2) Is there a FAQ or objections block within one screen above the final CTA? (3) Is there any preview of the guide's contents (table of contents or page images)? Skip any sub-change whose element already exists.

**Hypothesis:** a "what's inside" preview and a five-question FAQ placed immediately above the final CTA, plus a checkout button that works without the overlay script, raises checkout completions relative to product views.

**Change 2a — make the checkout path degrade gracefully.** Every buy link is an anchor with the full product URL in `href`; the overlay is progressive enhancement. Load Gumroad's script with `defer` and keep only one copy on the page:

```html
<script src="https://gumroad.com/js/gumroad.js" defer></script>
```

**Change 2b — "What's inside" block (place after the long-form explanation, before the FAQ):**

```html
<section class="inside">
  <h2>What's inside the 25 pages</h2>
  <ol>
    <li>Readiness screen and the three gates (pp. 3–5)</li>
    <li>Block 1 — Accumulation: repeater sessions, weeks 1–3 (pp. 6–10)</li>
    <li>Gate 1 checklist (p. 11)</li>
    <li>Block 2 — Intensification: max-hang sessions, weeks 4–6 (pp. 12–17)</li>
    <li>Gate 2 checklist (p. 18)</li>
    <li>Block 3 — Realization and Block 4 — Deload (pp. 19–21)</li>
    <li>Load tables by bodyweight, session log, warm-up and antagonist routine (pp. 22–25)</li>
  </ol>
  <!-- two real page screenshots, alt text describing the content -->
</section>
```
(`program-designer` supplies the true page numbers; do not publish placeholders.)

**Change 2c — objections FAQ, directly above the final CTA.** Use `<details>` so the block stays compact; mirror it in `FAQPage` JSON-LD.

```html
<section class="faq">
  <h2>Before you buy</h2>
  <details><summary>Do I need a hangboard and added weight?</summary>
    <p>A hangboard with a 20 mm edge, yes. Added weight is used in the intensification block; a pulley or loop of weight belt is enough. Load tables start from bodyweight.</p></details>
  <details><summary>I've had a pulley injury. Should I buy this?</summary>
    <p>Not while it is still symptomatic. The guide's gates will tell you to stop, and you would be paying for a program you cannot start. Run the free self-screen first; if you pass, the guide is appropriate.</p></details>
  <details><summary>Is this beginner-friendly?</summary>
    <p>No. It assumes about two years of consistent climbing and pain-free crimping. The free 8-week template article explains why.</p></details>
  <details><summary>How is this different from the free article?</summary>
    <p>The article gives the structure. The guide gives every session written out, load tables by bodyweight, the gate checklists, and the session log.</p></details>
  <details><summary>What if it isn't right for me?</summary>
    <p>Email within 14 days and you'll get a refund. The goal is that nobody trains from a program that doesn't fit them.</p></details>
</section>

<a class="gumroad-button cta-primary"
   href="https://thecuriousclimber.gumroad.com/l/contact-strength?ref=site-practice-bottom"
   data-gumroad-overlay-checkout="true">
  Get the guide — $39 CAD
</a>
<p class="cta-micro">25-page PDF · instant download · 14-day refund</p>
```

The refund line is only used if the Gumroad product has refunds enabled; confirm in Gumroad settings first. If refunds are not enabled, enable them; a $39 product with no refund route is the single largest unstated objection.

**Change 2d — mobile sticky CTA.** A bottom bar with the same anchor, shown after the reader scrolls past the hero, hidden on viewports ≥ 768 px. Height ≤ 56 px, no animation.

**Success rule:** Gumroad product views ÷ site clicks rises toward 1.0 (overlay fallback working), and sales ÷ product views rises versus baseline. Refunds are reported separately and expected to fall as a share of sales because of Drop-off 1's qualifier.

---

## What not to change

- Price. Ten sales is not enough signal to test price, and the CAD price is a feature for the Canadian gym channel.
- The credentials line. It moves to the eyebrow but never leaves the first screen.
- Any wording that would violate `tracking/claims-guardrails.md`; a higher conversion rate from an outcome promise is a loss on this venture's terms.
