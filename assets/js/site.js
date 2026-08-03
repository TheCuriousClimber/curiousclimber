/* =====================================================================
   Site-wide behaviour: mobile nav, footer year, Gumroad checkout
   ---------------------------------------------------------------------
   GOING LIVE WITH PAYMENTS (Gumroad):
   1. Create a Gumroad account and note your subdomain, e.g. if your page is
      https://thecuriousclimber.gumroad.com then your user is "thecuriousclimber".
   2. Create one Gumroad product per item below and copy its permalink
      (the bit after /l/ in the product URL, e.g. gumroad.com/l/contact-strength
      → "contact-strength").
   3. Fill in GUMROAD_USER and the permalinks in GUMROAD_PRODUCTS.
   Any product left as "" keeps the demo checkout modal (nothing is charged),
   so you can go live one product at a time. See GUMROAD-SETUP.md for details.
   ===================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /*  >>> EDIT THIS BLOCK TO GO LIVE <<<                                  */
  /* ------------------------------------------------------------------ */
  var GUMROAD_USER = ""; // e.g. "thecuriousclimber" — leave "" for demo mode
  var GUMROAD_PRODUCTS = {
    // product key (data-product on the button) : Gumroad permalink
    // --- Practice programs ---
    "contact-strength":  "",
    "anaerobic-capacity":"",
    "power-endurance":   "",
    "body-tension-core": "",
    "hips-mobility":     "",
    "footwork-balance":  "",
    "complete-bundle":   "",
    // --- Philosophy membership ---
    "members-library":   "",
    // --- Performance ---
    "custom-performance":"",
    // --- Promotion / merch ---
    "send-it-tee":  "",
    "hoodie":       "",
    "technical-tee":"",
    "beanie":       "",
    "chalk-bag":    "",
    "chalk-bucket": "",
    "loose-chalk":  "",
    "liquid-chalk": "",
    "bottle":       "",
    "salve":        "",
    "stickers":     "",
    "starter-kit":  ""
  };
  /* ------------------------------------------------------------------ */

  function gumroadUrl(permalink) {
    return "https://" + GUMROAD_USER + ".gumroad.com/l/" + permalink + "?wanted=true";
  }

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () { links.classList.toggle("open"); });
  }

  /* ---- Footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Wire up configured Gumroad buttons ----
     For each [data-product] whose key has a permalink AND GUMROAD_USER is set,
     turn the button into a real Gumroad checkout link (overlay when gumroad.js
     loads, otherwise a normal link to the hosted checkout — either way it works).
     Buttons left unconfigured fall through to the demo modal below. */
  var gumroadScriptAdded = false;
  function wireGumroad() {
    if (!GUMROAD_USER) return false;
    var any = false;
    var btns = document.querySelectorAll("[data-product]:not(.gumroad-button)");
    for (var i = 0; i < btns.length; i++) {
      var el = btns[i];
      var key = el.getAttribute("data-product");
      var permalink = GUMROAD_PRODUCTS[key];
      if (!permalink) continue;               // keep demo modal for this one
      el.setAttribute("href", gumroadUrl(permalink));
      el.classList.add("gumroad-button");
      el.removeAttribute("data-buy");          // opt out of the demo handler
      any = true;
    }
    if (any && !gumroadScriptAdded) {
      gumroadScriptAdded = true;
      var s = document.createElement("script");
      s.src = "https://gumroad.com/js/gumroad.js";
      s.async = true;
      document.body.appendChild(s);           // enhances .gumroad-button links
    }
    return any;
  }
  wireGumroad();
  /* expose so dynamically-rendered buttons (e.g. the Performance builder) can
     be wired after they're inserted */
  window.KOC = { wireGumroad: wireGumroad };

  /* ---- Demo checkout modal (fallback when Gumroad isn't configured) ---- */
  function buildModal() {
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true">' +
      '<button class="close" aria-label="Close">&times;</button>' +
      '<h3 id="modal-title">Checkout</h3>' +
      '<p id="modal-body" class="muted"></p>' +
      '<div class="mt-3"><button class="btn btn-primary btn-block" id="modal-confirm">Continue to secure checkout</button></div>' +
      '<p class="muted mt-2" style="font-size:.8rem">Demo build — no card is charged. Add your Gumroad links in <code>assets/js/site.js</code> to go live.</p>' +
      "</div>";
    document.body.appendChild(overlay);
    function close() { overlay.classList.remove("open"); }
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.classList.contains("close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    return overlay;
  }

  var modal = null;
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-buy]");
    if (!el) return;
    e.preventDefault();
    if (!modal) modal = buildModal();
    var name = el.getAttribute("data-buy") || "this item";
    var price = el.getAttribute("data-price") || "";
    modal.querySelector("#modal-title").textContent = name;
    modal.querySelector("#modal-body").textContent =
      "You're purchasing “" + name + "”" + (price ? " for " + price : "") +
      ". After payment you'll get instant access / confirmation by email.";
    var confirm = modal.querySelector("#modal-confirm");
    confirm.textContent = price ? "Pay " + price + " securely" : "Continue to secure checkout";
    modal.classList.add("open");
  });
})();
