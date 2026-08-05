/* =====================================================================
   MEMBERSHIP / LICENSE-KEY ACCESS GATE
   ---------------------------------------------------------------------
   Turns the cosmetic paywall into a real one: premium programs show a free
   preview (overview, evidence, periodization table) but the actual
   phase-by-phase workouts stay LOCKED until the member enters a valid
   license key. Entitlement is cached in localStorage so they stay unlocked.

   HOW IT WORKS
   - Each paid Gumroad subscription can issue a unique **license key**
     (turn on "Generate a unique license key per sale" on the product).
   - When a member pastes their key, we verify it against Gumroad's public
     license API and, if it belongs to one of your products and the
     subscription is still active, grant that product's tier.

   GOING LIVE (three steps)
   1. On each subscription product in Gumroad, enable license keys.
   2. Fill each product's `product_id` (Gumroad → Product → Advanced →
      "Product ID") and/or `permalink` in LICENSE.products below.
   3. Set LICENSE.live = true.
   Until then the gate runs in **demo mode**: keys like DEMO-ESSENTIAL,
   DEMO-COMPLETE or DEMO-COACH unlock the matching tier locally so you can
   test the flow. (Demo keys stop working once LICENSE.live is true.)

   SECURITY NOTE — read me
   This is a client-side gate: a good deterrent and the standard approach
   for small creator sites, but NOT bulletproof, because the browser can be
   inspected and the program data ships in JS. For hard enforcement, serve
   premium program data from a backend only after verifying the key there.
   If direct browser calls to Gumroad are blocked by CORS, point
   LICENSE.verifyEndpoint at a tiny proxy — a ~15-line Cloudflare Worker /
   Netlify function that forwards to Gumroad works (template in README).
   ===================================================================== */
(function () {
  "use strict";

  var LICENSE = {
    live: false,                                   // flip to true once products below are filled
    verifyEndpoint: "https://api.gumroad.com/v2/licenses/verify",
    // Highest tier first. Fill product_id and/or permalink for each.
    products: [
      { tier: "coach",     product_id: "", permalink: "sub-coach" },
      { tier: "complete",  product_id: "", permalink: "sub-complete" },
      { tier: "essential", product_id: "", permalink: "sub-essential" }
    ]
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[<>&"]/g, function (c) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c];
    });
  }

  var KEY = "ts-access-v1";
  var RANK = window.TS_TIER_RANK || { free: 0, essential: 1, complete: 2, coach: 3 };
  var TIER_LABEL = { free: "Free", essential: "Essential", complete: "Complete", coach: "Coach / Pro" };
  var listeners = [];

  /* ---------- state ---------- */
  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; }
  }
  function write(state) {
    try { state ? localStorage.setItem(KEY, JSON.stringify(state)) : localStorage.removeItem(KEY); } catch (e) {}
    listeners.forEach(function (cb) { try { cb(state); } catch (e) {} });
    paintStatus();
  }
  function rank(t) { return RANK[t] != null ? RANK[t] : 0; }

  var API = {
    state: read,
    tier: function () { var s = read(); return s ? s.tier : "free"; },
    hasAccess: function (required) {
      if (!required || required === "free") return true;
      var s = read();
      return !!s && rank(s.tier) >= rank(required);
    },
    signOut: function () { write(null); },
    onChange: function (cb) { if (typeof cb === "function") listeners.push(cb); },
    verify: verify,
    label: function (t) { return TIER_LABEL[t] || t; }
  };
  window.TS_ACCESS = API;

  /* ---------- verification ---------- */
  var DEMO_RE = /^DEMO-(FREE|ESSENTIAL|COMPLETE|COACH)$/i;

  function verify(rawKey) {
    var key = String(rawKey || "").trim();
    if (!key) return Promise.resolve({ ok: false, message: "Please enter your license key." });

    if (!LICENSE.live) {
      var m = DEMO_RE.exec(key);
      if (m) {
        var tier = m[1].toLowerCase();
        write({ tier: tier, email: "", key: key, demo: true, ts: Date.now() });
        return Promise.resolve({ ok: true, tier: tier, demo: true });
      }
      return Promise.resolve({
        ok: false,
        message: "Live verification isn't switched on yet. Try a demo key — DEMO-ESSENTIAL, DEMO-COMPLETE or DEMO-COACH — to preview unlocking."
      });
    }

    // live: try each product until one accepts the key
    var products = LICENSE.products.filter(function (p) { return p.product_id || p.permalink; });
    if (!products.length) {
      return Promise.resolve({ ok: false, message: "No license products are configured yet (see assets/js/access.js)." });
    }
    var netErr = false;
    return products.reduce(function (chain, product) {
      return chain.then(function (done) {
        if (done) return done;
        return gumroadVerify(product, key).then(function (res) {
          if (res && res.ok) { return { product: product, purchase: res.purchase }; }
          if (res && res.neterr) netErr = true;
          return null;
        });
      });
    }, Promise.resolve(null)).then(function (hit) {
      if (hit) {
        write({ tier: hit.product.tier, email: (hit.purchase && hit.purchase.email) || "", key: key, demo: false, ts: Date.now() });
        return { ok: true, tier: hit.product.tier };
      }
      if (netErr) {
        return { ok: false, message: "Couldn't reach the license server. On a static site this is usually a CORS block — point LICENSE.verifyEndpoint at a small proxy (see README)." };
      }
      return { ok: false, message: "That key isn't valid for an active subscription. Check for typos, or that your subscription is still active." };
    });
  }

  function gumroadVerify(product, key) {
    var body = [];
    if (product.product_id) body.push("product_id=" + encodeURIComponent(product.product_id));
    else if (product.permalink) body.push("product_permalink=" + encodeURIComponent(product.permalink));
    body.push("license_key=" + encodeURIComponent(key));
    body.push("increment_uses_count=false");
    return fetch(LICENSE.verifyEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.join("&")
    }).then(function (r) {
      return r.json().catch(function () { return { success: false }; });
    }).then(function (j) {
      if (!j || !j.success) return { ok: false };
      var p = j.purchase || {};
      var dead = p.refunded || p.chargebacked || p.disputed ||
        p.subscription_ended_at || p.subscription_failed_at || p.subscription_cancelled_at;
      if (dead) return { ok: false };
      return { ok: true, purchase: p };
    }).catch(function () {
      return { ok: false, neterr: true };
    });
  }

  /* ---------- unlock modal ---------- */
  var overlay = null;
  function buildModal() {
    overlay = document.createElement("div");
    overlay.className = "modal-overlay ts-access-modal";
    overlay.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="ts-acc-title" style="text-align:left">' +
        '<button class="close" aria-label="Close">&times;</button>' +
        '<h3 id="ts-acc-title">Members access</h3>' +
        '<div id="ts-acc-body"></div>' +
      "</div>";
    document.body.appendChild(overlay);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.classList.contains("close")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
    });
    return overlay;
  }
  function closeModal() { if (overlay) overlay.classList.remove("open"); }

  function openModal(context) {
    if (!overlay) buildModal();
    paintModal(context);
    overlay.classList.add("open");
    var inp = overlay.querySelector("#ts-acc-key");
    if (inp) setTimeout(function () { inp.focus(); }, 50);
  }

  function paintModal(context) {
    var body = overlay.querySelector("#ts-acc-body");
    var s = read();
    if (s) {
      body.innerHTML =
        '<p class="muted">You\'re unlocked at the <b>' + esc(API.label(s.tier)) + '</b> tier' +
        (s.email ? " (" + esc(s.email) + ")" : "") + (s.demo ? " · demo" : "") + ".</p>" +
        '<p class="muted" style="font-size:.86rem;margin-top:.4rem">This unlocks every program at ' +
        esc(API.label(s.tier)) + " and below.</p>" +
        '<div class="mt-3 flex"><button class="btn btn-ghost btn-sm" id="ts-acc-signout" type="button">Sign out</button>' +
        '<button class="btn btn-primary btn-sm" id="ts-acc-done" type="button">Done</button></div>';
      body.querySelector("#ts-acc-signout").addEventListener("click", function () { API.signOut(); paintModal(); });
      body.querySelector("#ts-acc-done").addEventListener("click", closeModal);
      return;
    }
    var intro = context && context.tier
      ? "Enter the license key for your <b>" + esc(API.label(context.tier)) + "</b> (or higher) subscription to unlock this program."
      : "Enter the license key from your subscription confirmation email to unlock your programs.";
    body.innerHTML =
      '<p class="muted">' + intro + "</p>" +
      '<div class="field mt-2"><label for="ts-acc-key">License key</label>' +
      '<input id="ts-acc-key" placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX" autocomplete="off" spellcheck="false"></div>' +
      '<button class="btn btn-primary btn-block" id="ts-acc-verify" type="button">Unlock</button>' +
      '<p id="ts-acc-msg" class="ts-acc-msg" role="status"></p>' +
      (LICENSE.live ? "" : '<p class="muted" style="font-size:.82rem;margin-top:.6rem">Demo mode: try <code>DEMO-COMPLETE</code> to preview unlocking. See <code>assets/js/access.js</code> to go live.</p>') +
      '<p class="muted" style="font-size:.82rem;margin-top:.6rem">No key yet? <a href="#ts-tiers-section" id="ts-acc-plans">See membership plans →</a></p>';

    var input = body.querySelector("#ts-acc-key");
    var btn = body.querySelector("#ts-acc-verify");
    var msg = body.querySelector("#ts-acc-msg");
    function submit() {
      btn.disabled = true; btn.textContent = "Checking…"; msg.textContent = ""; msg.className = "ts-acc-msg";
      API.verify(input.value).then(function (res) {
        btn.disabled = false; btn.textContent = "Unlock";
        if (res.ok) { paintModal(); }
        else { msg.textContent = res.message || "That didn't work."; msg.className = "ts-acc-msg err"; }
      });
    }
    btn.addEventListener("click", submit);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); });
    var plans = body.querySelector("#ts-acc-plans");
    if (plans) plans.addEventListener("click", closeModal);
    // post-purchase: a key handed in via URL is pre-filled and checked automatically
    if (context && context.prefill) { input.value = context.prefill; submit(); }
  }

  /* ---------- header status button ---------- */
  function paintStatus() {
    var btn = document.getElementById("ts-members-btn");
    if (!btn) return;
    var s = read();
    btn.textContent = s ? "✓ " + API.label(s.tier) : "Members";
    btn.setAttribute("aria-label", s ? "Members: " + API.label(s.tier) : "Members access");
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("#ts-members-btn, [data-unlock]");
    if (!b) return;
    e.preventDefault();
    var tier = b.getAttribute("data-unlock-tier");
    openModal(tier ? { tier: tier } : null);
  });

  API.openModal = openModal;

  /* ---------- post-purchase auto-unlock ----------
     After checkout you can send buyers to e.g. programs.html?license=THEIR-KEY
     (set the product's redirect/receipt in Gumroad). If a license param is
     present and no one is signed in yet, we open the modal and verify it
     automatically, then remove it from the address bar. */
  function licenseFromUrl() {
    var m = /[?#&]license=([^&#]+)/.exec(location.href);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  }
  function stripLicenseParam() {
    try {
      var u = new URL(location.href);
      u.searchParams.delete("license");
      if (/[?&#]license=/.test(u.hash)) {
        u.hash = u.hash.replace(/([?&#])license=[^&#]*/g, "$1").replace(/[?&#]+$/, "");
      }
      history.replaceState(null, "", u.toString());
    } catch (e) {}
  }
  var urlKey = licenseFromUrl();
  if (urlKey && !read()) {
    stripLicenseParam();
    openModal({ prefill: urlKey });
  }

  paintStatus();
})();
