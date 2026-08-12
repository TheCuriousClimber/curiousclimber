/* =====================================================================
   THE AUTOBODY SHOP — standalone behaviour
   Nav toggle · footer year · self-guided build sheet · scroll reveal
   Checkout (Gumroad) with a safe demo fallback · legal footer links
   ---------------------------------------------------------------------
   GOING LIVE WITH PAYMENTS (Gumroad):
   1. Create a Gumroad account; your subdomain is your user, e.g.
      https://myshop.gumroad.com  ->  GUMROAD_USER = "myshop".
   2. Create one Gumroad product per item in GUMROAD_PRODUCTS below and give
      each the matching permalink (the part after /l/ in its product URL).
   3. Set GUMROAD_USER and paste each permalink. Any product left as "" stays
      in safe demo mode (a modal opens, nothing is charged), so you can switch
      products to live payments one at a time. See GUMROAD-SETUP.md.
   ===================================================================== */
(function () {
  "use strict";

  /* relative prefix to reach /legal/ from any page depth (root vs /legal/) */
  var LEGAL = /\/legal\//.test(location.pathname) ? "" : "legal/";

  // >>> THE ONLY LINE YOU MUST EDIT TO GO LIVE <<<
  // While this is "" the whole site stays in safe demo mode (nothing charged).
  var GUMROAD_USER = ""; // e.g. "theautobodyshop"

  // Permalinks are pre-filled to match each product key. Create your Gumroad
  // products with these exact permalinks and they light up automatically once
  // GUMROAD_USER is set. Set any value back to "" to keep that one in demo mode.
  var GUMROAD_PRODUCTS = {
    // --- Manual: self-guided tune-up programs ---
    "top-speed":         "top-speed",
    "engine":            "engine",
    "fuel-tank":         "fuel-tank",
    "exterior":          "exterior",
    "full-build-bundle": "full-build-bundle",
    // --- Automatic: coached ---
    "lift-kit":          "lift-kit",
    "coaching-retune":   "coaching-retune",
    // --- Gas Station: nutrition ---
    "race-fuel":         "race-fuel",
    "full-rebuild":      "full-rebuild",
    "lean-mixture":      "lean-mixture",
    "fuel-bundle":       "fuel-bundle",
    // --- Car Wash: membership ---
    "wash-pass":         "wash-pass"
  };

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

  /* ---- Legal links, injected into the footer bottom bar on every page ---- */
  var fbar = document.querySelector(".footer-bottom");
  if (fbar) {
    var legalSpan = document.createElement("span");
    legalSpan.className = "legal-links";
    legalSpan.innerHTML =
      '<a href="' + LEGAL + 'terms.html">Terms</a> · ' +
      '<a href="' + LEGAL + 'privacy.html">Privacy</a> · ' +
      '<a href="' + LEGAL + 'disclaimer.html">Health Disclaimer</a> · ' +
      '<a href="' + LEGAL + 'par-q.html">Readiness (PAR-Q)</a>';
    fbar.appendChild(legalSpan);
  }

  /* ---- Wire configured Gumroad buttons ----
     For each [data-product] whose key has a permalink AND GUMROAD_USER is set,
     turn the button into a real Gumroad checkout link (overlay when gumroad.js
     loads, otherwise the hosted checkout — either way the sale goes through).
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
      if (!permalink) continue;              // keep demo modal for this one
      el.setAttribute("href", gumroadUrl(permalink));
      el.classList.add("gumroad-button");
      el.removeAttribute("data-buy");         // opt out of the demo handler
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
  window.AUTOBODY = { wireGumroad: wireGumroad };

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
      '<p class="muted mt-2" style="font-size:.78rem">By continuing you agree to our <a href="' + LEGAL + 'terms.html">Terms</a>, <a href="' + LEGAL + 'privacy.html">Privacy Policy</a> and <a href="' + LEGAL + 'disclaimer.html">Health &amp; Fitness Disclaimer</a>.</p>' +
      '<p class="muted mt-2" style="font-size:.8rem">Demo build — no card is charged. Add your Gumroad links in <code>assets/app.js</code> to go live.</p>' +
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

  /* ---- Self-guided "Build sheet" configurator (Manual page) ---- */
  var sheet = document.getElementById("build-sheet");
  if (sheet) {
    var KEY = "autobody.buildsheet.v1";
    var chosen = load();

    function load() {
      try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
      catch (e) { return {}; }
    }
    function save() {
      try { localStorage.setItem(KEY, JSON.stringify(chosen)); } catch (e) {}
    }

    var list = sheet.querySelector("[data-sheet-list]");
    var empty = sheet.querySelector("[data-sheet-empty]");
    var count = sheet.querySelector("[data-sheet-count]");

    function render() {
      var keys = Object.keys(chosen).filter(function (k) { return chosen[k]; });
      if (count) count.textContent = keys.length;
      if (empty) empty.style.display = keys.length ? "none" : "block";
      if (list) {
        list.innerHTML = "";
        keys.forEach(function (k) {
          var li = document.createElement("li");
          li.className = "readout";
          li.innerHTML = "<span>" + chosen[k] + "</span><b>SELECTED</b>";
          list.appendChild(li);
        });
      }
      document.querySelectorAll("[data-pkg]").forEach(function (btn) {
        var k = btn.getAttribute("data-pkg");
        var on = !!chosen[k];
        btn.classList.toggle("btn-primary", on);
        btn.classList.toggle("btn-ghost", !on);
        var label = btn.getAttribute(on ? "data-on" : "data-off");
        if (label) btn.textContent = label;
      });
    }

    document.querySelectorAll("[data-pkg]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var k = btn.getAttribute("data-pkg");
        if (chosen[k]) { delete chosen[k]; }
        else { chosen[k] = btn.getAttribute("data-name") || k; }
        save();
        render();
      });
    });

    var clear = sheet.querySelector("[data-sheet-clear]");
    if (clear) clear.addEventListener("click", function () {
      chosen = {}; save(); render();
    });

    render();
  }

  /* ---- Reveal-on-scroll (progressive enhancement) ----
     Elements are hidden only by JS, so no-JS users always see everything.
     A hard fallback guarantees content is never left invisible even if the
     observer misfires — nothing stays hidden longer than 1.5s. */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length) {
    function show(el) { el.style.opacity = 1; el.style.transform = "none"; }
    reveals.forEach(function (el) {
      el.style.opacity = 0; el.style.transform = "translateY(16px)";
      el.style.transition = "opacity .5s ease,transform .5s ease";
    });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(show);
    }
    setTimeout(function () { reveals.forEach(show); }, 1500);
  }
})();
