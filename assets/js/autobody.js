/* =====================================================================
   The Autobody Shop — self-directed training garage
   ---------------------------------------------------------------------
   Two self-contained, browser-only tools (no backend, no data leaves
   the page):
     1. Manual "build your rig" — pick tune-up packages, get a
        personalised build sheet, tuned by level / days / equipment.
     2. The dyno bench — a benchmark tracker that saves dated read-outs
        to localStorage and surfaces a live personal-best spec sheet.
   ===================================================================== */
(function () {
  "use strict";

  var EQ = { gym: 2, hangboard: 1, minimal: 0 };

  /* ------------------------------------------------------------------ */
  /*  Package library — what each tune-up actually prescribes           */
  /*  mv items: { n: name, eq: min equipment tier }                     */
  /* ------------------------------------------------------------------ */
  var PACKAGES = {
    power: {
      icon: "🏁", name: "Horsepower", sub: "Top speed · power",
      targets: "Explosive, instantaneous output for cruxes under 10 seconds.",
      benchmarks: "Max dyno height · max campus height · fastest speed-climb time",
      mv: [
        { n: "Limit boulder / max-move sessions (fresh, low volume)", eq: 0 },
        { n: "Campus ladders — controlled, explosive (skip if fingers are sore)", eq: 1 },
        { n: "Explosive pull-ups & lock-off pop-ups", eq: 0 },
        { n: "Weighted box jumps / broad jumps for leg drive", eq: 0 },
        { n: "Med-ball slams & throws for whole-body rate of force", eq: 2 }
      ],
      cue: "Move as fast as you can when fresh; quality over quantity. Full recovery between efforts (2–3 min)."
    },
    strength: {
      icon: "🔧", name: "The Engine", sub: "Push & pull force",
      targets: "Maximal force into the wall — lock-offs, mantles, heel-hook torque.",
      benchmarks: "Grip & contact strength · core · pull-up 1RM · single-leg squat 1RM",
      mv: [
        { n: "Hangboard max hangs (half-crimp, 20 mm edge)", eq: 1 },
        { n: "Weighted pull-ups & lock-off holds (90°/120°)", eq: 1 },
        { n: "Front-lever / tension-board core progressions", eq: 0 },
        { n: "Single-leg squats / step-ups for pushing legs", eq: 0 },
        { n: "Barbell or ring rows for pulling volume", eq: 1 }
      ],
      cue: "Heavy, low reps (3–5), long rest (3 min). Leave 1 rep in reserve early, chase the ceiling later."
    },
    endurance: {
      icon: "⛽", name: "The Fuel Tank", sub: "Work capacity",
      targets: "Maintain force & tension for longer before fatigue pulls you off.",
      benchmarks: "Max deadhang · max bent-arm hang · max laps before failure",
      mv: [
        { n: "ARC / continuous easy climbing (long, unbroken)", eq: 0 },
        { n: "Hangboard endurance repeaters (long durations)", eq: 1 },
        { n: "Bent-arm & deadhang time-under-tension holds", eq: 1 },
        { n: "High-rep row intervals", eq: 1 },
        { n: "Up-down laps on easy terrain to failure", eq: 0 }
      ],
      cue: "Longer efforts, shorter rest. Build total time-on-wall week to week before adding intensity."
    },
    "power-endurance": {
      icon: "🚀", name: "The Turbo", sub: "Repeatable power",
      targets: "Fire hard, explosive moves back-to-back across multiple cruxes.",
      benchmarks: "Max dyno repeats · max campus reps · max speed-climb repeats",
      mv: [
        { n: "Boulder 4×4s (four problems, four rounds)", eq: 0 },
        { n: "Linked limit moves / repeaters on the board", eq: 1 },
        { n: "Interval circuits 2:1 work:rest at high intensity", eq: 0 },
        { n: "Repeated dyno / campus efforts to near-failure", eq: 1 },
        { n: "On-the-minute pull-up or lock-off clusters", eq: 0 }
      ],
      cue: "Repeat hard efforts with incomplete rest. Stop the set when quality drops — you're training resistance to fatigue, not sloppiness."
    },
    exterior: {
      icon: "🛡️", name: "The Exterior", sub: "Look & last",
      targets: "Antagonist balance, mobility and prehab — protection and clean bodywork.",
      benchmarks: "Antagonist balance · shoulder & hip mobility · joint resilience",
      mv: [
        { n: "Band external rotations (rotator cuff)", eq: 0 },
        { n: "Wrist extension / reverse curls (elbow health)", eq: 0 },
        { n: "Overhead & floor press for pushing balance", eq: 1 },
        { n: "Face pulls / scapular retractions", eq: 1 },
        { n: "Hip openers, thoracic rotations & shoulder CARs", eq: 0 }
      ],
      cue: "Little and often. Weave 10–15 minutes into every session — this is the clear-coat that protects everything else."
    }
  };

  /* level → sets guidance */
  var SETS = { beginner: "2–3 sets", intermediate: "3–4 sets", advanced: "4–5 sets" };
  var LEVEL_WORD = { beginner: "daily-driver", intermediate: "sport-model", advanced: "track-build" };

  function esc(s) {
    return String(s).replace(/[<>&"]/g, function (c) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c];
    });
  }

  /* ================================================================== */
  /*  1. MANUAL — build your rig                                        */
  /* ================================================================== */
  var form = document.getElementById("build-form");
  var grid = document.getElementById("package-grid");
  var SEL_KEY = "koc-garage-build-v1";

  if (form && grid) {
    var daysInput = document.getElementById("b-days");
    var daysOut = document.getElementById("b-days-out");
    var levelInput = document.getElementById("b-level");
    var equipInput = document.getElementById("b-equip");
    var sheetHost = document.getElementById("build-sheet");

    if (daysInput && daysOut) {
      daysInput.addEventListener("input", function () { daysOut.textContent = daysInput.value; persist(); });
    }

    /* ---- restore any saved selection ---- */
    (function restore() {
      var saved;
      try { saved = JSON.parse(localStorage.getItem(SEL_KEY)); } catch (e) { saved = null; }
      if (!saved) return;
      (saved.pkgs || []).forEach(function (id) {
        var el = grid.querySelector('.pkg[data-pkg="' + id + '"]');
        if (el) el.setAttribute("aria-pressed", "true");
      });
      if (saved.level && levelInput) levelInput.value = saved.level;
      if (saved.days && daysInput) { daysInput.value = saved.days; daysOut.textContent = saved.days; }
      if (saved.equip && equipInput) equipInput.value = saved.equip;
      if ((saved.pkgs || []).length) render(collect());
    })();

    function selectedPkgs() {
      return Array.prototype.slice
        .call(grid.querySelectorAll('.pkg[aria-pressed="true"]'))
        .map(function (el) { return el.getAttribute("data-pkg"); });
    }
    function collect() {
      return {
        pkgs: selectedPkgs(),
        level: levelInput ? levelInput.value : "intermediate",
        days: daysInput ? parseInt(daysInput.value, 10) : 4,
        equip: equipInput ? equipInput.value : "hangboard"
      };
    }
    function persist() {
      try { localStorage.setItem(SEL_KEY, JSON.stringify(collect())); } catch (e) {}
    }

    /* ---- toggle a package (click + keyboard) ---- */
    function toggle(el) {
      var on = el.getAttribute("aria-pressed") === "true";
      el.setAttribute("aria-pressed", on ? "false" : "true");
      persist();
    }
    grid.addEventListener("click", function (e) {
      var el = e.target.closest(".pkg");
      if (el) toggle(el);
    });
    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var el = e.target.closest(".pkg");
      if (!el) return;
      e.preventDefault();
      toggle(el);
    });

    /* ---- submit → build sheet ---- */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var cfg = collect();
      if (!cfg.pkgs.length) {
        sheetHost.innerHTML =
          '<div class="notice"><span>👉</span><span>Pick at least one tune-up package above, then assemble your build sheet.</span></div>';
        sheetHost.classList.remove("hidden");
        sheetHost.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      persist();
      render(cfg);
      sheetHost.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    form.addEventListener("reset", function () {
      grid.querySelectorAll('.pkg[aria-pressed="true"]').forEach(function (el) {
        el.setAttribute("aria-pressed", "false");
      });
      sheetHost.classList.add("hidden");
      sheetHost.innerHTML = "";
      try { localStorage.removeItem(SEL_KEY); } catch (e) {}
    });

    function render(cfg) {
      var tier = EQ[cfg.equip];
      var setGuide = SETS[cfg.level];

      var lines = cfg.pkgs.map(function (id) {
        var p = PACKAGES[id];
        if (!p) return "";
        /* filter movements to available equipment; keep at least two */
        var mv = p.mv.filter(function (m) { return m.eq <= tier; });
        if (mv.length < 2) mv = p.mv.slice(0, 2);
        else mv = mv.slice(0, 4);
        return (
          '<div class="build-line">' +
            "<h4>" + p.icon + " " + esc(p.name) +
              '<span class="lbl">' + esc(p.sub) + "</span></h4>" +
            '<p class="muted" style="font-size:.92rem;margin-top:.4rem">' + esc(p.targets) + "</p>" +
            "<ul>" +
              mv.map(function (m) { return "<li>" + esc(m.n) + "</li>"; }).join("") +
            "</ul>" +
            '<p class="muted" style="font-size:.88rem;margin-top:.6rem">' +
              "<strong>Dose:</strong> " + setGuide + " per movement · <strong>Cue:</strong> " + esc(p.cue) + "</p>" +
            '<p class="muted" style="font-size:.86rem;margin-top:.35rem">' +
              "<strong>Benchmark on the dyno:</strong> " + esc(p.benchmarks) + "</p>" +
          "</div>"
        );
      }).join("");

      /* weekly framing */
      var n = cfg.pkgs.length;
      var perWeek = cfg.days;
      var split;
      if (n === 1) {
        split = "All " + perWeek + " shop days point at one package — expect fast, focused gains, but rotate in a rest day and don't neglect the Exterior for joint health.";
      } else {
        split = "Spread across " + perWeek + " days/week, lead each session with your most demanding package (power or strength) while fresh, and finish with prehab/mobility.";
      }
      var exteriorNudge = cfg.pkgs.indexOf("exterior") === -1
        ? '<div class="notice mt-3"><span>🛡️</span><span><b>No Exterior package selected.</b> Even a hard-charging build needs a clear-coat — bolt on 10 minutes of antagonist &amp; prehab work to stay durable.</span></div>'
        : "";

      sheetHost.innerHTML =
        '<div class="build-sheet">' +
          '<div class="bs-head">' +
            '<span class="badge badge-new">Your build sheet</span>' +
            "<h3>" + n + "-package " + esc(LEVEL_WORD[cfg.level]) + " build</h3>" +
            "<p>Self-directed spec for " + perWeek + " shop days/week with " + equipLabel(cfg.equip) + ". " + split + "</p>" +
          "</div>" +
          '<div class="bs-body">' +
            lines +
            exteriorNudge +
            '<div class="mt-3 flex">' +
              '<a class="btn btn-primary" href="#dyno-bench">Benchmark these on the dyno →</a>' +
              '<button class="btn btn-ghost" id="print-build" type="button">Print / save this sheet</button>' +
              '<a class="btn btn-ghost" href="#lift-kit">Want a pro to fit it? Go Automatic</a>' +
            "</div>" +
            '<p class="muted mt-3" style="font-size:.85rem">A self-directed starting spec, not medical advice. Progress finger and joint loading conservatively, and stop on sharp pain.</p>' +
          "</div>" +
        "</div>";
      sheetHost.classList.remove("hidden");

      var pb = document.getElementById("print-build");
      if (pb) pb.addEventListener("click", function () { window.print(); });
    }

    function equipLabel(e) {
      return { gym: "full gym access", hangboard: "a hangboard & some weights", minimal: "minimal home kit" }[e] || e;
    }
  }

  /* ================================================================== */
  /*  2. THE DYNO BENCH — benchmark tracker                             */
  /* ================================================================== */
  var bench = document.getElementById("bench-form");
  if (bench) {
    var BENCH_KEY = "koc-garage-bench-v1";

    /* metric metadata (keyed by data-metric) */
    var META = {
      dyno:      { label: "Max dyno",      unit: "cm", dir: "up" },
      campus:    { label: "Max campus",    unit: "cm", dir: "up" },
      speed:     { label: "Speed climb",   unit: "s",  dir: "down" },
      grip:      { label: "Grip strength", unit: "kg", dir: "up" },
      pullup:    { label: "Pull-up 1RM",   unit: "kg", dir: "up" },
      slsquat:   { label: "SL squat 1RM",  unit: "kg", dir: "up" },
      core:      { label: "Core hold",     unit: "s",  dir: "up" },
      deadhang:  { label: "Deadhang",      unit: "s",  dir: "up" },
      bentarm:   { label: "Bent-arm hang", unit: "s",  dir: "up" },
      laps:      { label: "Laps",          unit: "",   dir: "up" },
      dynoreps:  { label: "Dyno repeats",  unit: "",   dir: "up" },
      campusreps:{ label: "Campus reps",   unit: "",   dir: "up" },
      speedreps: { label: "Speed repeats", unit: "",   dir: "up" }
    };
    /* stable display order */
    var ORDER = ["dyno","campus","speed","grip","pullup","slsquat","core","deadhang","bentarm","laps","dynoreps","campusreps","speedreps"];

    var dateInput = document.getElementById("bm-date");
    var specHost = document.getElementById("spec-sheet");
    var countEl = document.getElementById("bench-count");
    var clearBtn = document.getElementById("bench-clear");

    if (dateInput && !dateInput.value) dateInput.value = new Date().toISOString().slice(0, 10);

    function loadSessions() {
      try { return JSON.parse(localStorage.getItem(BENCH_KEY)) || []; }
      catch (e) { return []; }
    }
    function saveSessions(list) {
      try { localStorage.setItem(BENCH_KEY, JSON.stringify(list)); } catch (e) {}
    }

    /* best value + which session set it, per metric, respecting direction */
    function computeBests(sessions) {
      var best = {};
      sessions.forEach(function (s, idx) {
        Object.keys(s.values || {}).forEach(function (m) {
          var v = s.values[m];
          if (typeof v !== "number" || isNaN(v)) return;
          var meta = META[m];
          if (!meta) return;
          if (!(m in best)) { best[m] = { v: v, idx: idx, date: s.date }; return; }
          var better = meta.dir === "down" ? v < best[m].v : v > best[m].v;
          if (better) best[m] = { v: v, idx: idx, date: s.date };
        });
      });
      return best;
    }

    function fmt(v) {
      /* trim trailing .0 */
      return (Math.round(v * 100) / 100).toString();
    }

    function renderSpec() {
      var sessions = loadSessions();
      if (countEl) {
        countEl.textContent = sessions.length
          ? sessions.length + (sessions.length === 1 ? " session logged" : " sessions logged")
          : "No sessions yet";
      }
      if (!sessions.length) {
        specHost.innerHTML =
          '<p class="muted">Save a read-out and your best numbers appear here as a live spec sheet — personal bests get the yellow plate.</p>';
        return;
      }
      var best = computeBests(sessions);
      var lastIdx = sessions.length - 1;

      var cells = ORDER.filter(function (m) { return m in best; }).map(function (m) {
        var meta = META[m];
        var b = best[m];
        var isPB = b.idx === lastIdx; /* most recent session set this best */
        var unit = meta.unit ? " <small>" + meta.unit + "</small>" : "";
        return (
          '<div class="spec-cell' + (isPB ? " pb" : "") + '">' +
            '<div class="k">' + esc(meta.label) + "</div>" +
            '<div class="v">' + fmt(b.v) + unit + "</div>" +
            (isPB ? '<span class="pb-tag">New PB</span>' : "") +
          "</div>"
        );
      }).join("");

      specHost.innerHTML =
        '<div class="spec-sheet">' + cells + "</div>" +
        '<p class="muted mt-3" style="font-size:.82rem">Best-ever value per metric shown. ' +
          "Latest session: " + esc(sessions[lastIdx].date || "—") + ".</p>";
    }

    bench.addEventListener("submit", function (e) {
      e.preventDefault();
      var values = {};
      var inputs = bench.querySelectorAll("input[data-metric]");
      var any = false;
      Array.prototype.forEach.call(inputs, function (inp) {
        var raw = inp.value.trim();
        if (raw === "") return;
        var num = parseFloat(raw);
        if (isNaN(num)) return;
        values[inp.getAttribute("data-metric")] = num;
        any = true;
      });
      if (!any) {
        specHost.innerHTML =
          '<div class="notice"><span>👉</span><span>Enter at least one number you tested, then save the read-out.</span></div>';
        return;
      }
      var sessions = loadSessions();
      sessions.push({ date: (dateInput && dateInput.value) || new Date().toISOString().slice(0, 10), values: values });
      saveSessions(sessions);

      /* clear the number inputs, keep the date */
      Array.prototype.forEach.call(inputs, function (inp) { inp.value = ""; });
      renderSpec();
      specHost.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    if (clearBtn) clearBtn.addEventListener("click", function () {
      if (!confirm("Clear all saved dyno read-outs? This can't be undone.")) return;
      try { localStorage.removeItem(BENCH_KEY); } catch (e) {}
      renderSpec();
    });

    renderSpec();
  }
})();
