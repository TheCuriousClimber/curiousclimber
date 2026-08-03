/* =====================================================================
   PROGRAM ENGINE — turns program templates into a professional,
   phone-friendly plan, with live progression/regression scaling.
   ---------------------------------------------------------------------
   Reads TS_PROGRAMS, TS_EXERCISES, TS_TIERS (see assets/data/*). Renders:
     1. a filterable library of program cards        → #ts-library
     2. a full program viewer on demand              → #ts-viewer
     3. a subscription-tier pricing grid             → #ts-tiers
   Each exercise in a workout can be scaled up or down its regression/
   progression ladder in place, and links to a demonstration video.
   ===================================================================== */
(function () {
  "use strict";

  var LIB = window.TS_EXERCISES || {};
  var PROGRAMS = window.TS_PROGRAMS || [];
  var TIERS = window.TS_TIERS || [];
  var TIER_RANK = window.TS_TIER_RANK || {};

  /* ---------- small helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[<>&"]/g, function (c) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c];
    });
  }
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  /* first whole number in a prescription string ("8–10" → "8", "AMRAP 40 s" → "") */
  function firstInt(s) {
    var m = /\d+/.exec(String(s == null ? "" : s));
    return m ? m[0] : "";
  }
  /* sections whose exercises are worth logging (load/reps work) */
  var LOGGABLE = { main: 1, power: 1, conditioning: 1 };

  /* default starting level of a prescription: given, else middle of ladder */
  function startLevel(fam, presc) {
    var n = fam.levels.length;
    var lv = (presc.level == null) ? Math.floor((n - 1) / 2) : presc.level;
    return clamp(lv, 0, n - 1);
  }

  /* demo link for a ladder level: pinned YouTube id, else a video search */
  function demoHref(level) {
    if (level.yt) return "https://www.youtube.com/watch?v=" + encodeURIComponent(level.yt);
    return "https://www.youtube.com/results?search_query=" +
      encodeURIComponent((level.q || level.name) + " exercise how to");
  }

  var TIER_LABEL = { free: "Free", essential: "Essential", complete: "Complete", coach: "Coach / Pro" };
  var GOAL_LABEL = {
    foundation: "Foundations", strength: "Strength", power: "Power & performance",
    conditioning: "Conditioning", endurance: "Endurance", mobility: "Mobility",
    hypertrophy: "Build muscle"
  };
  var LEVEL_LABEL = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

  var SECTION_META = {
    warmup:   { title: "Warm-up & Mobility", icon: "🔥", blurb: "Raise your temperature and prepare the joints you're about to load." },
    prehab:   { title: "Injury-Prevention & Supplemental", icon: "🛡️", blurb: "Small doses of the work that keeps you healthy and balanced." },
    main:     { title: "Main Training", icon: "🏋️", blurb: "The heart of the session — where the adaptation is driven." },
    power:    { title: "Power / Explosive", icon: "⚡", blurb: "Fast, high-quality efforts done fresh, before fatigue sets in." },
    conditioning: { title: "Conditioning", icon: "❤️", blurb: "Train the engine — heart, lungs and work capacity." },
    cooldown: { title: "Cool-down & Flexibility", icon: "🧘", blurb: "Down-regulate and lengthen what you just worked." }
  };
  var SECTION_ORDER = ["warmup", "prehab", "power", "main", "conditioning", "cooldown"];

  /* ============================================================
     1) LIBRARY
     ============================================================ */
  var libHost = document.getElementById("ts-library");
  var filterHost = document.getElementById("ts-filters");
  var activeFilter = "all";

  function progCard(p) {
    var locked = p.tier !== "free";
    var badge = p.tier === "free"
      ? '<span class="badge badge-free">Free</span>'
      : '<span class="badge badge-premium">' + esc(TIER_LABEL[p.tier] || p.tier) + '</span>';
    return '' +
      '<article class="card" data-goal="' + esc(p.goal) + '" data-level="' + esc(p.level) + '">' +
        '<div class="card-media" style="background:linear-gradient(135deg,var(--forest),var(--moss))">' +
          '<span style="position:absolute;top:1rem;left:1rem">' + badge + '</span>' +
          '<span style="font-size:2.6rem" aria-hidden="true">' + goalEmoji(p.goal) + '</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="tag-row">' +
            '<span class="tag">' + esc(GOAL_LABEL[p.goal] || p.goal) + '</span>' +
            '<span class="tag">' + esc(LEVEL_LABEL[p.level] || p.level) + '</span>' +
            '<span class="tag">' + p.weeks + ' wks · ' + p.daysPerWeek + '×/wk</span>' +
          '</div>' +
          '<h3>' + esc(p.title) + '</h3>' +
          '<p>' + esc(p.tagline) + '</p>' +
          '<div class="card-foot">' +
            '<span class="muted" style="font-size:.85rem">' + (locked ? "🔒 " + esc(TIER_LABEL[p.tier]) : "Free to start") + '</span>' +
            '<button class="btn btn-primary btn-sm" data-open="' + esc(p.id) + '">View program</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }
  function goalEmoji(g) {
    return { foundation: "🧱", strength: "🏋️", power: "⚡", conditioning: "❤️", endurance: "🏃", mobility: "🧘", hypertrophy: "💪" }[g] || "💪";
  }

  function renderLibrary() {
    if (!libHost) return;
    var list = PROGRAMS.filter(function (p) {
      return activeFilter === "all" || p.goal === activeFilter || p.level === activeFilter;
    });
    libHost.innerHTML = list.map(progCard).join("");
    var empty = document.getElementById("ts-no-results");
    if (empty) empty.style.display = list.length ? "none" : "block";
  }

  if (filterHost) {
    filterHost.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-filter]");
      if (!chip) return;
      activeFilter = chip.getAttribute("data-filter");
      Array.prototype.forEach.call(filterHost.querySelectorAll("[data-filter]"), function (c) {
        c.classList.toggle("selected", c === chip);
      });
      renderLibrary();
    });
  }

  if (libHost) {
    libHost.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-open]");
      if (!btn) return;
      openProgram(btn.getAttribute("data-open"));
    });
  }

  /* ============================================================
     2) PROGRAM VIEWER
     ============================================================ */
  var viewer = document.getElementById("ts-viewer");

  /* live state: map of unique row-id -> current level index */
  var rowState = {};
  var rowCounter = 0;

  function metaGrid(p) {
    var rows = [
      ["🎯 Goal", GOAL_LABEL[p.goal] || p.goal],
      ["📊 Level needed", LEVEL_LABEL[p.level] || p.level],
      ["🗓️ Length", p.weeks + " weeks · " + p.daysPerWeek + " days/week"],
      ["⏱️ Per session", "~" + p.sessionMinutes + " minutes"],
      ["🧰 Equipment", p.equipment],
      ["👥 Best for", p.audience]
    ];
    return '<div class="ts-meta">' + rows.map(function (r) {
      return '<div class="ts-meta-item"><span class="ts-meta-k">' + r[0] + '</span>' +
             '<span class="ts-meta-v">' + esc(r[1]) + '</span></div>';
    }).join("") + '</div>';
  }

  function justificationBlock(p) {
    if (!p.justification || !p.justification.length) return "";
    var items = p.justification.map(function (j) {
      return '<li><span class="ts-why-plain">' + esc(j.plain) + '</span>' +
             '<span class="ts-cite">' + esc(j.cite) + '</span></li>';
    }).join("");
    return '<details class="acc" open><summary>Why it\'s built this way — the evidence</summary>' +
      '<div class="acc-body"><ul class="ts-why">' + items + '</ul>' +
      '<p class="muted" style="font-size:.82rem;margin-top:.8rem">Citations point to well-established work in exercise science; confirm exact editions before republishing. Educational content — not medical advice.</p>' +
      '</div></details>';
  }

  function howtoBlock(p) {
    if (!p.howto || !p.howto.length) return "";
    var items = p.howto.map(function (h) {
      return '<li><b>' + esc(h.name) + ':</b> ' + esc(h.text) + '</li>';
    }).join("");
    return '<details class="acc"><summary>How-to — protocols &amp; terms explained</summary>' +
      '<div class="acc-body"><ul class="ts-howto">' + items + '</ul></div></details>';
  }

  function mesocycleTable(p) {
    var wkRows = p.phases.map(function (ph) {
      var s = ph.scheme || {};
      return '<tr>' +
        '<td>' + esc(ph.weeks) + '</td>' +
        '<td><strong>' + esc(ph.name) + '</strong></td>' +
        '<td>' + esc(s.intensity || "—") + '</td>' +
        '<td>' + esc(s.sets || "—") + '</td>' +
        '<td>' + esc(s.reps || "—") + '</td>' +
        '<td>' + esc(s.rest || "—") + '</td>' +
        '</tr>';
    }).join("");
    return '<h3 class="mt-4">How your training changes over time (periodization)</h3>' +
      '<p class="muted" style="font-size:.92rem">Each phase, or "block", shifts the training variables so your body keeps adapting instead of stalling — the essence of progressive overload.</p>' +
      '<div class="table-wrap mt-2"><table><thead><tr>' +
      '<th>Weeks</th><th>Phase</th><th>Intensity</th><th>Sets</th><th>Reps</th><th>Rest</th>' +
      '</tr></thead><tbody>' + wkRows + '</tbody></table></div>';
  }

  /* render one exercise prescription as a scalable card */
  function exerciseRow(presc, phase, section) {
    var fam = LIB[presc.ex];
    if (!fam) return '<div class="ts-ex"><b>' + esc(presc.ex) + '</b> <span class="muted">(exercise not found)</span></div>';
    var lv = startLevel(fam, presc);
    var id = "row" + (rowCounter++);

    var scheme = phase.scheme || {};
    var setsRaw = presc.sets ? presc.sets : (scheme.sets || "");
    var repsRaw = presc.reps ? presc.reps : (scheme.reps || "");
    var setsReps = setsRaw + " × " + repsRaw;
    var tempo = presc.tempo || fam.tempo || scheme.tempo || "—";
    var rest = presc.rest || scheme.rest || "—";
    var loggable = !!LOGGABLE[section];

    rowState[id] = { ex: presc.ex, lv: lv, sets: firstInt(setsRaw), reps: firstInt(repsRaw) };

    var cues = (fam.cues || []).join(" · ");

    return '' +
      '<div class="ts-ex" data-row="' + id + '">' +
        '<div class="ts-ex-head">' +
          '<div>' +
            '<span class="ts-ex-pattern">' + esc(fam.pattern) + '</span>' +
            '<span class="ts-ex-name" data-name>' + esc(fam.levels[lv].name) + '</span>' +
          '</div>' +
          '<div class="ts-ex-actions">' +
            (loggable ? '<button type="button" class="ts-log" data-log title="Send to workout log">＋ Log</button>' : '') +
            '<a class="ts-demo" data-demo target="_blank" rel="noopener" href="' + demoHref(fam.levels[lv]) + '">▶ Demo</a>' +
          '</div>' +
        '</div>' +
        '<div class="ts-ex-rx">' +
          '<span><b>' + esc(setsReps) + '</b><small>sets × reps</small></span>' +
          '<span><b>' + esc(tempo) + '</b><small>tempo</small></span>' +
          '<span><b>' + esc(rest) + '</b><small>rest</small></span>' +
        '</div>' +
        (presc.note ? '<p class="ts-ex-note">📌 ' + esc(presc.note) + '</p>' : '') +
        '<p class="ts-ex-cue">💡 ' + esc(cues) + '</p>' +
        '<p class="ts-ex-levelnote" data-levelnote>' + esc(fam.levels[lv].note || "") + '</p>' +
        '<div class="ts-scale">' +
          '<button type="button" class="ts-scale-btn" data-dir="-1" aria-label="Easier variation">◀ Regress</button>' +
          '<span class="ts-scale-pos" data-pos>Level ' + (lv + 1) + ' / ' + fam.levels.length + '</span>' +
          '<button type="button" class="ts-scale-btn" data-dir="1" aria-label="Harder variation">Progress ▶</button>' +
        '</div>' +
      '</div>';
  }

  function workoutBlock(w, phase) {
    var sections = SECTION_ORDER.filter(function (s) { return w[s] && w[s].length; });
    var body = sections.map(function (s) {
      var meta = SECTION_META[s];
      var rows = w[s].map(function (p) { return exerciseRow(p, phase, s); }).join("");
      return '<div class="ts-section">' +
        '<div class="ts-section-head"><span class="ts-section-icon">' + meta.icon + '</span>' +
          '<div><h5>' + esc(meta.title) + '</h5><p>' + esc(meta.blurb) + '</p></div></div>' +
        '<div class="ts-section-body">' + rows + '</div>' +
        '</div>';
    }).join("");
    return '<details class="acc ts-workout"><summary>' + esc(w.name) + '</summary>' +
      '<div class="acc-body">' + body + '</div></details>';
  }

  function phaseBlock(ph) {
    var workouts = ph.workouts.map(function (w) { return workoutBlock(w, ph); }).join("");
    return '<div class="ts-phase">' +
      '<div class="ts-phase-head">' +
        '<span class="badge badge-new">Weeks ' + esc(ph.weeks) + '</span>' +
        '<h4>' + esc(ph.name) + '</h4>' +
      '</div>' +
      '<p class="ts-phase-focus">' + esc(ph.focus) + '</p>' +
      (ph.progression ? '<p class="notice" style="font-size:.88rem"><span>📈</span><span><b>Progress it:</b> ' + esc(ph.progression) + '</span></p>' : '') +
      '<div class="ts-workouts">' + workouts + '</div>' +
      '</div>';
  }

  function subscribeCta(p) {
    if (p.tier === "free") {
      return '<div class="notice mt-3"><span>✅</span><span>This starter program is <b>free</b> — pick your levels, print it, and get training. Log your sessions below to track progress.</span></div>';
    }
    var t = TIERS.filter(function (x) { return x.id === p.tier; })[0] || {};
    return '<div class="ts-unlock mt-3">' +
      '<div><b>Unlock this program</b><p class="muted" style="font-size:.9rem;margin-top:.2rem">Included with the <b>' + esc(TIER_LABEL[p.tier]) + '</b> plan (' + esc(t.price || "") + esc(t.cadence || "") + '). This preview shows the real structure and exercises.</p></div>' +
      '<a class="btn btn-primary" href="#" data-buy="' + esc(t.name || TIER_LABEL[p.tier]) + ' subscription" data-price="' + esc((t.price || "") + (t.cadence || "")) + '" data-product="' + esc(t.product || "") + '">Subscribe · ' + esc((t.price || "") + (t.cadence || "")) + '</a>' +
      '</div>';
  }

  function openProgram(id) {
    var p = PROGRAMS.filter(function (x) { return x.id === id; })[0];
    if (!p || !viewer) return;
    rowState = {}; rowCounter = 0;

    viewer.innerHTML =
      '<div class="panel ts-program">' +
        '<button class="ts-close" type="button" aria-label="Close program">&larr; Back to library</button>' +
        '<span class="eyebrow">' + esc(GOAL_LABEL[p.goal] || p.goal) + ' program</span>' +
        '<h2>' + esc(p.title) + '</h2>' +
        '<p class="lead">' + esc(p.tagline) + '</p>' +
        metaGrid(p) +
        '<h3 class="mt-4">About this program</h3>' +
        '<p>' + esc(p.description) + '</p>' +
        justificationBlock(p) +
        howtoBlock(p) +
        mesocycleTable(p) +
        '<h3 class="mt-4">The full plan, phase by phase</h3>' +
        '<p class="muted" style="font-size:.92rem">Every session has four parts — warm-up, injury-prevention, main work and cool-down. Tap a workout to open it, then use ◀ / ▶ on any exercise to pick the difficulty that fits you.</p>' +
        '<div class="ts-phases">' + p.phases.map(phaseBlock).join("") + '</div>' +
        subscribeCta(p) +
        '<div class="mt-3 flex">' +
          '<button class="btn btn-ghost" type="button" id="ts-print">🖨️ Print / save plan</button>' +
          '<a class="btn btn-ghost" href="#ts-logger-anchor">Log a session</a>' +
        '</div>' +
      '</div>';

    viewer.classList.remove("hidden");
    if (window.KOC && window.KOC.wireGumroad) window.KOC.wireGumroad();
    viewer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* push a prescription into the workout logger form (if present on the page) */
  function prefillLogger(name, sets, reps) {
    var exSel = document.getElementById("ex");
    var customWrap = document.getElementById("custom-wrap");
    var customInput = document.getElementById("ex-custom");
    if (!exSel || !customInput) return false;         // no logger on this page

    // route through the logger's "custom exercise" path so any name works
    exSel.value = "__custom";
    exSel.dispatchEvent(new Event("change"));          // let logger.js reveal the field
    if (customWrap) customWrap.classList.remove("hidden");
    customInput.value = name;

    var setsEl = document.getElementById("sets");
    var repsEl = document.getElementById("reps");
    if (setsEl && sets) setsEl.value = sets;
    if (repsEl && reps) repsEl.value = reps;

    var anchor = document.getElementById("ts-logger-anchor") || document.getElementById("logger");
    if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    var loadEl = document.getElementById("load");
    if (loadEl) setTimeout(function () { loadEl.focus(); }, 400);
    return true;
  }

  /* viewer-level interactions: close, scale, log, print */
  if (viewer) {
    viewer.addEventListener("click", function (e) {
      var logBtn = e.target.closest(".ts-log");
      if (logBtn) {
        var lrow = logBtn.closest(".ts-ex");
        var lst = rowState[lrow.getAttribute("data-row")];
        var lfam = LIB[lst.ex];
        var moved = prefillLogger(lfam.levels[lst.lv].name, lst.sets, lst.reps);
        if (moved) {
          logBtn.textContent = "✓ Sent";
          setTimeout(function () { logBtn.textContent = "＋ Log"; }, 1600);
        }
        return;
      }
      if (e.target.closest(".ts-close")) {
        viewer.classList.add("hidden");
        viewer.innerHTML = "";
        var lib = document.getElementById("ts-library-section");
        if (lib) lib.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (e.target.id === "ts-print") { window.print(); return; }

      var sc = e.target.closest(".ts-scale-btn");
      if (sc) {
        var rowEl = sc.closest(".ts-ex");
        var rid = rowEl.getAttribute("data-row");
        var st = rowState[rid];
        var fam = LIB[st.ex];
        var next = clamp(st.lv + parseInt(sc.getAttribute("data-dir"), 10), 0, fam.levels.length - 1);
        if (next === st.lv) return;
        st.lv = next;
        var level = fam.levels[next];
        rowEl.querySelector("[data-name]").textContent = level.name;
        rowEl.querySelector("[data-levelnote]").textContent = level.note || "";
        rowEl.querySelector("[data-pos]").textContent = "Level " + (next + 1) + " / " + fam.levels.length;
        rowEl.querySelector("[data-demo]").setAttribute("href", demoHref(level));
      }
    });
  }

  /* ============================================================
     3) SUBSCRIPTION TIERS
     ============================================================ */
  var tierHost = document.getElementById("ts-tiers");
  function renderTiers() {
    if (!tierHost) return;
    tierHost.innerHTML = TIERS.map(function (t) {
      var feats = t.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join("");
      return '<div class="ts-tier' + (t.highlight ? " ts-tier-hot" : "") + '">' +
        (t.highlight ? '<span class="ts-tier-flag">Most popular</span>' : '') +
        '<h3>' + esc(t.name) + '</h3>' +
        '<div class="ts-price"><b>' + esc(t.price) + '</b><span>' + esc(t.cadence) + '</span></div>' +
        '<p class="ts-tier-programs">' + esc(t.programsIncluded) + '</p>' +
        '<p class="muted" style="font-size:.9rem">' + esc(t.blurb) + '</p>' +
        '<ul class="ts-tier-feats">' + feats + '</ul>' +
        '<a class="btn ' + (t.highlight ? "btn-primary" : "btn-ghost") + ' btn-block mt-2" href="#" ' +
          (t.id === "free"
            ? 'data-scroll="ts-library-section">Start free'
            : 'data-buy="' + esc(t.name) + ' subscription" data-price="' + esc(t.price + t.cadence) + '" data-product="' + esc(t.product) + '">Choose ' + esc(t.name)) +
        '</a>' +
        '</div>';
    }).join("");
    if (window.KOC && window.KOC.wireGumroad) window.KOC.wireGumroad();
  }
  if (tierHost) {
    tierHost.addEventListener("click", function (e) {
      var s = e.target.closest("[data-scroll]");
      if (s) {
        e.preventDefault();
        var target = document.getElementById(s.getAttribute("data-scroll"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /* ---------- boot ---------- */
  renderLibrary();
  renderTiers();

  /* deep-link: #program=<id> opens a program directly */
  function openFromHash() {
    var m = /program=([a-z0-9-]+)/i.exec(location.hash);
    if (m) openProgram(m[1]);
  }
  window.addEventListener("hashchange", openFromHash);
  openFromHash();
})();
