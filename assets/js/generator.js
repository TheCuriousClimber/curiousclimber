/* =====================================================================
   Performance page: custom program builder (transparent rules engine)
   Grounded in exercise-science principles. Runs entirely in the browser;
   a preview of the full ML-backed Performance product.
   ===================================================================== */
(function () {
  "use strict";

  var form = document.getElementById("builder-form");
  if (!form) return;

  /* ---- range output ---- */
  var days = document.getElementById("b-days");
  var daysOut = document.getElementById("b-days-out");
  days.addEventListener("input", function () { daysOut.textContent = days.value; });

  /* ---- multi-select chip groups ---- */
  form.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip[data-val]");
    if (!chip) return;
    e.preventDefault();
    chip.classList.toggle("selected");
  });
  function selected(group) {
    return Array.prototype.slice
      .call(form.querySelectorAll('[data-group="' + group + '"] .chip.selected'))
      .map(function (c) { return c.getAttribute("data-val"); });
  }

  /* ---- exercise library ---- */
  /* eq: min equipment tier (0 minimal,1 hangboard,2 gym); avoid: injury areas */
  var LIB = {
    fingers: [
      { n: "Hangboard max hangs (half-crimp, 20 mm edge)", eq: 1, avoid: ["fingers"], note: "Add weight or reduce edge as you progress." },
      { n: "Hangboard repeaters (7s on / 3s off)", eq: 1, avoid: ["fingers"] },
      { n: "Bodyweight edge hangs (feet supported)", eq: 0, note: "Regression when equipment or fingers are limited." }
    ],
    pull: [
      { n: "Weighted pull-ups", eq: 1, avoid: ["elbows"] },
      { n: "Lock-off holds (90°/120°)", eq: 0, avoid: ["elbows"] },
      { n: "Barbell / ring rows", eq: 1 },
      { n: "Assisted / bodyweight pull-ups", eq: 0 }
    ],
    power: [
      { n: "Campus / limit boulder moves (controlled)", eq: 1, avoid: ["fingers", "elbows"] },
      { n: "Explosive pull-ups", eq: 0, avoid: ["elbows"] },
      { n: "Med-ball slams / throws", eq: 2 },
      { n: "Plyometric push-ups", eq: 0, avoid: ["shoulders"] }
    ],
    endurance: [
      { n: "Hangboard endurance repeaters (long)", eq: 1, avoid: ["fingers"] },
      { n: "ARC / continuous easy climbing", eq: 0 },
      { n: "High-rep row intervals", eq: 1 }
    ],
    core: [
      { n: "Front-lever progression", eq: 0, avoid: ["shoulders"] },
      { n: "Hanging leg / knee raises", eq: 0 },
      { n: "Ab-wheel roll-outs", eq: 1 },
      { n: "Tension board / steep-wall foot cutoffs", eq: 0 }
    ],
    push: [
      { n: "Overhead press", eq: 2, avoid: ["shoulders"] },
      { n: "Incline / floor press", eq: 1, avoid: ["shoulders"] },
      { n: "Push-ups", eq: 0, avoid: ["shoulders"] }
    ],
    prehab: [
      { n: "Band external rotations (rotator cuff)", eq: 0 },
      { n: "Wrist extension / reverse curls (elbow health)", eq: 0 },
      { n: "Face pulls / scapular retractions", eq: 1 },
      { n: "Scapular pull-ups", eq: 0 }
    ],
    legs: [
      { n: "Goblet / back squat", eq: 1, avoid: [] },
      { n: "Romanian deadlift", eq: 1 },
      { n: "Single-leg step-ups (balance)", eq: 0 }
    ],
    mobility: [
      { n: "Hip openers (pigeon, deep squat holds)", eq: 0 },
      { n: "Shoulder CARs &amp; thoracic rotations", eq: 0 },
      { n: "High-step &amp; hamstring mobility flow", eq: 0 }
    ]
  };

  var EQ = { gym: 2, hangboard: 1, minimal: 0 };

  /* pick n exercises from a category, respecting equipment & injuries */
  function pick(cat, equip, injuries, n) {
    var tier = EQ[equip];
    var out = LIB[cat].filter(function (x) {
      if (x.eq > tier) return false;
      if (x.avoid && x.avoid.some(function (a) { return injuries.indexOf(a) !== -1; })) return false;
      return true;
    });
    /* if injuries filtered everything out, fall back to safest (lowest eq) option */
    if (!out.length) out = LIB[cat].filter(function (x) { return x.eq <= tier; });
    return out.slice(0, n || out.length);
  }

  /* ---- phase templates per goal ---- */
  function phases(goal, exp) {
    var P = {
      strength: [
        ["Base &amp; prep", "Moderate", "6–8", "90 s", "Build work capacity, groove technique, prime tendons"],
        ["Max strength", "High", "3–5", "3 min", "Neural recruitment &amp; contact strength"],
        ["Peak force", "Very high", "1–3", "3–4 min", "Express maximal finger &amp; pull force"],
        ["Deload", "Low", "—", "—", "Recover &amp; supercompensate"]
      ],
      power: [
        ["Base &amp; prep", "Moderate", "6–8", "90 s", "Foundation &amp; tissue prep"],
        ["Strength", "High", "3–5", "3 min", "Build the force to convert into power"],
        ["Power", "High (fast)", "3–5 explosive", "3 min", "Rate of force development, explosive moves"],
        ["Deload", "Low", "—", "—", "Recover before the next block"]
      ],
      endurance: [
        ["Aerobic base", "Low", "high-rep", "short", "Capillarisation &amp; recovery capacity"],
        ["Anaerobic capacity", "Moderate–high", "intervals 1:1", "1:1", "Pump tolerance / buffering"],
        ["Power-endurance", "High", "intervals 2:1", "2:1", "Sustained hard pulling"],
        ["Taper", "Low", "—", "—", "Freshen up for performance"]
      ],
      "power-endurance": [
        ["Strength base", "High", "3–5", "3 min", "Raise the ceiling first"],
        ["Capacity", "Moderate–high", "intervals 1:1", "1:1", "Buffer fatigue"],
        ["Power-endurance", "High", "intervals 2:1", "2:1", "Repeatable hard efforts"],
        ["Peak", "Low", "—", "—", "Peak for redpoints"]
      ],
      allround: [
        ["Base", "Moderate", "8–12", "90 s", "Broad foundation &amp; balance"],
        ["Strength", "High", "4–6", "2–3 min", "General &amp; finger strength"],
        ["Mixed / specific", "Varied", "varied", "varied", "Blend strength, power &amp; endurance"],
        ["Deload", "Low", "—", "—", "Recover"]
      ]
    };
    var chosen = P[goal].map(function (row, i) {
      /* beginners spend longer building a base; advanced compress it */
      var wk = [2, 2, 2, 1];
      if (exp === "beginner") wk = [3, 2, 2, 1];
      if (exp === "advanced") wk = [1, 3, 2, 1];
      return { name: row[0], weeks: wk[i], intensity: row[1], reps: row[2], rest: row[3], focus: row[4] };
    });
    return chosen;
  }

  var GOAL_LABEL = {
    strength: "Maximum Strength &amp; Finger Power",
    power: "Explosive Power",
    endurance: "Route Endurance",
    "power-endurance": "Power-Endurance",
    allround: "Well-Rounded Base"
  };

  /* ---- build weekly split ---- */
  function weeklySplit(nDays, goal, weaknesses, injuries, equip) {
    /* Always weave in prehab. Emphasise weaknesses & goal. */
    var primaryCat = { strength: "fingers", power: "power", endurance: "endurance",
      "power-endurance": "endurance", allround: "pull" }[goal];

    var week = [];
    function ex(cat, n) {
      return pick(cat, equip, injuries, n).map(function (x) { return x.n; });
    }
    var prehab = ex("prehab", 2);

    if (nDays <= 2) {
      week.push({ day: "Day 1", focus: "Full-body strength + " + primaryCat,
        items: ex(primaryCat, 2).concat(ex("pull", 1), ex("core", 1)) });
      week.push({ day: "Day 2", focus: "Strength + prehab",
        items: ex(goal === "endurance" ? "endurance" : "push", 1).concat(ex("legs", 1), prehab) });
    } else if (nDays === 3) {
      week.push({ day: "Day 1", focus: "Climb + " + primaryCat, items: ["Climbing (skill/limit)"].concat(ex(primaryCat, 1)) });
      week.push({ day: "Day 2", focus: "Resistance — pull & core", items: ex("pull", 2).concat(ex("core", 1)) });
      week.push({ day: "Day 3", focus: "Climb + prehab", items: ["Climbing (volume)"].concat(prehab) });
    } else if (nDays === 4) {
      week.push({ day: "Day 1", focus: "Climb — limit / project", items: ["Climbing (hard)"] });
      week.push({ day: "Day 2", focus: "Resistance — " + primaryCat + " & pull", items: ex(primaryCat, 2).concat(ex("pull", 1)) });
      week.push({ day: "Day 3", focus: "Climb + core", items: ["Climbing (volume)"].concat(ex("core", 1)) });
      week.push({ day: "Day 4", focus: "Resistance — push, legs & prehab", items: ex("push", 1).concat(ex("legs", 1), prehab) });
    } else { /* 5–6 */
      week.push({ day: "Day 1", focus: "Climb — limit", items: ["Climbing (hard)"] });
      week.push({ day: "Day 2", focus: "Resistance — " + primaryCat, items: ex(primaryCat, 2).concat(ex("core", 1)) });
      week.push({ day: "Day 3", focus: "Climb — volume + prehab", items: ["Climbing (volume)"].concat(prehab) });
      week.push({ day: "Day 4", focus: "Resistance — pull & push", items: ex("pull", 1).concat(ex("push", 1), ex("legs", 1)) });
      week.push({ day: "Day 5", focus: "Climb / project or endurance", items: [goal === "endurance" ? "Route intervals" : "Climbing (project)"] });
      if (nDays === 6) week.push({ day: "Day 6", focus: "Mobility & active recovery", items: ex("mobility", 2) });
    }
    return week;
  }

  /* ---- render helpers ---- */
  function esc(s){return String(s).replace(/[<>&"]/g,function(c){return{'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});}
  function li(arr){return arr.map(function(i){return "<li>"+i+"</li>";}).join("");}

  var lastConfig = null;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var cfg = {
      goal: document.getElementById("b-goal").value,
      exp: document.getElementById("b-exp").value,
      redpoint: document.getElementById("b-redpoint").value.trim(),
      days: parseInt(days.value, 10),
      session: document.getElementById("b-session").value,
      equip: document.getElementById("b-equip").value,
      weaknesses: selected("weakness"),
      injuries: selected("injury"),
      addons: selected("addon")
    };
    lastConfig = cfg;
    render(cfg);
  });

  function render(cfg) {
    var ph = phases(cfg.goal, cfg.exp);
    var totalWeeks = ph.reduce(function (s, p) { return s + p.weeks; }, 0);
    var split = weeklySplit(cfg.days, cfg.goal, cfg.weaknesses, cfg.injuries, cfg.equip);

    var expWord = { beginner: "newer", intermediate: "intermediate", advanced: "advanced" }[cfg.exp];

    /* mesocycle table */
    var wkStart = 1, mesoRows = ph.map(function (p) {
      var span = p.weeks === 1 ? ("Wk " + wkStart) : ("Wk " + wkStart + "–" + (wkStart + p.weeks - 1));
      wkStart += p.weeks;
      return "<tr><td>" + span + "</td><td><strong>" + p.name + "</strong></td><td>" + p.intensity +
        "</td><td>" + p.reps + "</td><td>" + p.rest + "</td><td>" + p.focus + "</td></tr>";
    }).join("");

    /* weekly split table */
    var weekRows = split.map(function (d) {
      return "<tr><td><strong>" + d.day + "</strong></td><td>" + d.focus + "</td><td>" + d.items.join(", ") + "</td></tr>";
    }).join("");

    /* priority note */
    var prio = cfg.weaknesses.length
      ? "Because you flagged <strong>" + cfg.weaknesses.map(labelWeak).join(", ") +
        "</strong>, extra volume is steered toward those qualities."
      : "No specific weak links flagged, so volume is balanced across qualities.";

    /* injury note */
    var inj = cfg.injuries.length
      ? '<div class="notice mt-3"><span>⚠️</span><span><b>Working around your injury history (' +
        cfg.injuries.map(function(i){return labelWeak(i);}).join(", ") +
        '):</b> aggravating exercises have been swapped for safer variations, and finger/joint loading progresses more conservatively. Sharp pain always means stop — and please clear return-to-load with a physio.</span></div>'
      : "";

    /* first-phase prescription */
    var p1 = ph[0];
    var primaryCat = { strength: "fingers", power: "power", endurance: "endurance",
      "power-endurance": "endurance", allround: "pull" }[cfg.goal];
    var rx = pick(primaryCat, cfg.equip, cfg.injuries, 2)
      .concat(pick("pull", cfg.equip, cfg.injuries, 1))
      .concat(pick("core", cfg.equip, cfg.injuries, 1))
      .concat(pick("prehab", cfg.equip, cfg.injuries, 1));
    var setGuide = cfg.exp === "beginner" ? "2–3 sets" : cfg.exp === "advanced" ? "4–5 sets" : "3–4 sets";
    var rxRows = rx.map(function (x) {
      return "<tr><td>" + x.n + "</td><td>" + setGuide + " × " + p1.reps + "</td><td>" + p1.rest +
        "</td>" + "<td>" + (x.note ? x.note : "Leave 1–2 reps in reserve early on") + "</td></tr>";
    }).join("");

    /* add-on panels */
    var addonHtml = "";
    if (cfg.addons.indexOf("nutrition") !== -1) addonHtml += nutritionPanel(cfg);
    if (cfg.addons.indexOf("mental") !== -1) addonHtml += mentalPanel(cfg);

    var html =
      '<div class="panel">' +
        '<div class="flex between"><div>' +
          '<span class="badge badge-new">Your program</span>' +
          "<h2 style=\"margin-top:.5rem\">" + GOAL_LABEL[cfg.goal] + " · " + totalWeeks + "-week plan</h2>" +
          "<p>A periodized block for an <strong>" + expWord + "</strong> climber" +
          (cfg.redpoint ? " redpointing around <strong>" + esc(cfg.redpoint) + "</strong>" : "") +
          ", training <strong>" + cfg.days + " days/week</strong> in ~" + cfg.session + "-minute sessions with " +
          equipLabel(cfg.equip) + ". " + prio + "</p>" +
        "</div></div>" +
        inj +

        '<h3 class="mt-4">Mesocycle overview — how your variables progress</h3>' +
        '<p class="muted" style="font-size:.92rem">Intensity rises and reps fall across the block so adaptation keeps coming, capped by a deload/taper to let fitness surface.</p>' +
        '<div class="table-wrap mt-2"><table><thead><tr><th>Weeks</th><th>Phase</th><th>Intensity</th><th>Reps</th><th>Rest</th><th>Focus</th></tr></thead><tbody>' +
        mesoRows + "</tbody></table></div>" +

        '<h3 class="mt-4">Your training week</h3>' +
        '<p class="muted" style="font-size:.92rem">A sample week — climbing and resistance sessions arranged to protect recovery. Rotate hard climbing away from heavy pulling days.</p>' +
        '<div class="table-wrap mt-2"><table><thead><tr><th>Day</th><th>Focus</th><th>Session</th></tr></thead><tbody>' +
        weekRows + "</tbody></table></div>" +

        '<h3 class="mt-4">Phase 1 prescription — “' + p1.name + '”</h3>' +
        '<div class="table-wrap mt-2"><table><thead><tr><th>Exercise</th><th>Sets × reps</th><th>Rest</th><th>Cue</th></tr></thead><tbody>' +
        rxRows + "</tbody></table></div>" +
        '<p class="muted mt-2" style="font-size:.9rem">Log every set in the <a href="practice.html#logger">workout logger</a> so your charts — and the next block — reflect real progress.</p>' +

        addonHtml +

        '<div class="notice mt-3"><span>ℹ️</span><span>This is a science-based starting template, not medical advice. The full Performance product will refine load targets from your logged data and adjust automatically each week.</span></div>' +

        '<div class="mt-3 flex">' +
          '<button class="btn btn-primary" data-buy="Custom Performance Program (12-month, adaptive)" data-price="$149/yr">Unlock the full adaptive program</button>' +
          '<button class="btn btn-ghost" id="print-plan" type="button">Print / save this plan</button>' +
        "</div>" +
      "</div>";

    var results = document.getElementById("results");
    results.innerHTML = html;
    results.classList.remove("hidden");
    document.getElementById("adapt").classList.remove("hidden");
    results.scrollIntoView({ behavior: "smooth", block: "start" });

    var pb = document.getElementById("print-plan");
    if (pb) pb.addEventListener("click", function () { window.print(); });
  }

  function labelWeak(v){return {fingers:"finger strength",power:"explosive power",endurance:"endurance / pump",
    core:"core &amp; tension",shoulders:"shoulder &amp; pushing",mobility:"mobility",elbows:"elbows"}[v]||v;}
  function equipLabel(e){return {gym:"full gym access",hangboard:"a hangboard &amp; some weights",minimal:"minimal home equipment"}[e];}

  function nutritionPanel(cfg) {
    var goalNote = cfg.goal === "strength" || cfg.goal === "power"
      ? "enough protein and total energy to support neural &amp; tissue adaptation while keeping bodyweight stable"
      : "steady energy availability so you can recover between sessions without unnecessary weight gain";
    return '<div class="callout mt-4"><h4>🍎 Nutrition guidance</h4>' +
      "<p>For your goal, aim for " + goalNote + ".</p>" +
      "<ul style='margin:.6rem 0 0 1.2rem'>" +
      "<li><strong>Protein:</strong> roughly 1.6–2.0 g per kg bodyweight daily, spread across meals, to support recovery.</li>" +
      "<li><strong>Energy:</strong> avoid large deficits during heavy training — under-fuelling blunts strength gains and tendon health.</li>" +
      "<li><strong>Around sessions:</strong> some carbs before hard training; protein + carbs after.</li>" +
      "<li><strong>Hydration &amp; sleep:</strong> the two most underrated performance tools.</li></ul>" +
      "<p class='muted mt-2' style='font-size:.85rem'>General guidance only — see a registered dietitian for individualised plans.</p></div>";
  }
  function mentalPanel() {
    return '<div class="callout mt-4"><h4>🧠 Mental training</h4>' +
      "<ul style='margin:0 0 0 1.2rem'>" +
      "<li><strong>Pre-climb routine:</strong> a consistent breathing &amp; visualisation ritual before hard attempts.</li>" +
      "<li><strong>Process goals:</strong> focus on execution cues (breathe, precise feet) rather than the outcome.</li>" +
      "<li><strong>Fall practice:</strong> scheduled, controlled falling to reduce fear and free up commitment.</li>" +
      "<li><strong>Reflection:</strong> a short post-session note on what worked builds self-awareness over time.</li></ul></div>";
  }

  /* ---- adapt next block ---- */
  var adaptForm = document.getElementById("adapt-form");
  if (adaptForm) adaptForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var feel = document.getElementById("a-progress").value;
    var rpe = parseFloat(document.getElementById("a-rpe").value) || null;
    var comp = parseFloat(document.getElementById("a-sessions").value);
    var out = document.getElementById("adapt-result");

    var load = 0, vol = 0, notes = [];
    if (feel === "easy") { load = 5; notes.push("Add ~5% load (or a smaller edge / more added weight) — you left progress on the table."); }
    else if (feel === "hard") { load = -5; vol = -1; notes.push("Reduce load ~5% and drop a set; you were over-reaching."); }
    else { load = 2.5; notes.push("Nudge load up ~2.5% — you're in the sweet spot."); }

    if (rpe != null) {
      if (rpe >= 9 && feel !== "hard") notes.push("Average RPE was very high (" + rpe + "): keep added load conservative and protect recovery.");
      if (rpe <= 6 && feel !== "easy") notes.push("Average RPE was low (" + rpe + "): you have room to push intensity next block.");
    }
    if (!isNaN(comp)) {
      if (comp < 70) notes.push("You completed " + comp + "% of sessions — consider dropping to fewer, higher-quality days so the plan is sustainable.");
      else if (comp >= 95) notes.push("Excellent adherence (" + comp + "%) — you've earned a small step up in volume or intensity.");
    }
    notes.push("Insert a deload if you haven't had one in the last ~4 weeks.");

    var dir = load > 0 ? "increase" : load < 0 ? "decrease" : "hold";
    out.innerHTML =
      '<span class="badge badge-new">Adjusted recommendation</span>' +
      "<h3 style='margin-top:.6rem'>Next block: " + dir + " load by " + (load > 0 ? "+" : "") + load + "%" +
      (vol ? ", " + (vol < 0 ? "drop" : "add") + " " + Math.abs(vol) + " set" : "") + "</h3>" +
      "<ul style='margin:.6rem 0 0 1.2rem'>" + li(notes) + "</ul>" +
      "<p class='muted mt-2' style='font-size:.85rem'>The full product applies adjustments like these per-exercise, automatically, from your logged data.</p>";
    out.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
})();
