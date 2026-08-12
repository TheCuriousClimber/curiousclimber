/* =====================================================================
   Antagonist & Tendon-Adaptation Trainer — transparent rules engine
   ---------------------------------------------------------------------
   A browser-only preview of the "Sports PT Antagonist Generator". Builds a
   personalised, clinically-grounded 4-week antagonist + tendon-adaptation
   block from a short self-assessment and a filtered exercise pool.

   Programming directives encoded below (mirrors the clinical spec):
     • Isometrics  — 30–45 s holds ~60–70% MVIC for analgesia & tendon stiffness.
     • Eccentric / HSR — slow 3–4 s eccentric tempo for collagen remodelling.
     • Hypertrophy / Endurance — 10–15+ reps for antagonist structural balance.
     • 4-week cycle — Wk1 baseline · Wk2 volume · Wk3 peak load · Wk4 deload
       (30–40% volume drop, load intensity preserved).
     • Guardrail — reported symptom severity > 5/10 (VAS) prioritises isometric
       holds and off-loading/mobility over high-load dynamic eccentrics.

   Runs entirely in the browser; no data leaves the page.
   ===================================================================== */
(function () {
  "use strict";

  var form = document.getElementById("antag-form");
  if (!form) return;

  /* ---- range outputs ---- */
  var vas = document.getElementById("t-vas");
  var vasOut = document.getElementById("t-vas-out");
  if (vas && vasOut) vas.addEventListener("input", function () { vasOut.textContent = vas.value; });

  var rpe = document.getElementById("t-rpe");
  var rpeOut = document.getElementById("t-rpe-out");
  if (rpe && rpeOut) rpe.addEventListener("input", function () { rpeOut.textContent = rpe.value; });

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

  /* =====================================================================
     Exercise pool. Each item declares:
       tissue   — extensors | external_rotators | scapular_retractors |
                  non_contractile_tendon (the schema's targetTissue enum)
       joint    — elbow_wrist | shoulder  (for primary-focus filtering)
       eq       — min equipment tier: 0 band/none, 1 hangboard/DBs, 2 gym
       protocols— which loading protocols this movement supports well
     Cues are non-jargon and emphasise alignment / tempo / no compensation.
     ===================================================================== */
  var POOL = [
    /* ---- wrist / forearm extensors (climber's elbow, epicondylalgia) ---- */
    { name: "Wrist extension (dumbbell / band), forearm supported", tissue: "extensors", joint: "elbow_wrist", eq: 0,
      protocols: ["isometric", "eccentric", "hypertrophy", "endurance"],
      cue: "Forearm flat on the bench, wrist off the edge. Curl the back of the hand up, then lower slowly — no shrugging or elbow lift." },
    { name: "Reverse (pronated) curl", tissue: "extensors", joint: "elbow_wrist", eq: 1,
      protocols: ["eccentric", "hypertrophy", "endurance"],
      cue: "Knuckles lead the way up. Keep the elbows pinned to your ribs so the forearm — not the biceps — does the work." },
    { name: "Rice-bucket extension / finger splays", tissue: "extensors", joint: "elbow_wrist", eq: 0,
      protocols: ["endurance"],
      cue: "Open the fingers wide and slow against the resistance. Relaxed shoulders, breathe steadily." },
    { name: "Isometric wrist-extension hold vs. band", tissue: "extensors", joint: "elbow_wrist", eq: 0,
      protocols: ["isometric"],
      cue: "Hold the wrist just past neutral against the band. Firm but not white-knuckle — you should still breathe easily." },

    /* ---- non-contractile tendon (collagen-load: HSR / heavy isometrics) ---- */
    { name: "Tyler twist (FlexBar) — extensor tendon", tissue: "non_contractile_tendon", joint: "elbow_wrist", eq: 0,
      protocols: ["eccentric", "isometric"],
      cue: "Load the twist with the healthy hand, then release slowly with the affected side over 3–4 s. Mild ache is fine, sharp pain is not." },
    { name: "Heavy-slow wrist curl complex (flex + extend)", tissue: "non_contractile_tendon", joint: "elbow_wrist", eq: 1,
      protocols: ["eccentric", "isometric"],
      cue: "Move through the full range under a slow count both ways. Pick a load you can control — never let it drop." },
    { name: "Long-lever supinated isometric hold", tissue: "non_contractile_tendon", joint: "elbow_wrist", eq: 1,
      protocols: ["isometric"],
      cue: "Elbow at ~90°, hold steady against the weight. Keep the shoulder down and back; stop if the ache climbs past a 3/10." },
    { name: "Overhead-carry / bottoms-up KB hold (shoulder tendon)", tissue: "non_contractile_tendon", joint: "shoulder", eq: 1,
      protocols: ["isometric", "endurance"],
      cue: "Ribs down, wrist stacked over elbow over shoulder. Squeeze hard and walk tall — no arching the low back." },

    /* ---- shoulder external rotators (rotator cuff balance) ---- */
    { name: "Side-lying / band external rotation (arm at side)", tissue: "external_rotators", joint: "shoulder", eq: 0,
      protocols: ["isometric", "eccentric", "hypertrophy", "endurance"],
      cue: "Elbow pinned to your side at 90°, rotate the forearm out. Lead with the back of the hand; don't let the elbow drift forward." },
    { name: "90/90 cable / band external rotation", tissue: "external_rotators", joint: "shoulder", eq: 1,
      protocols: ["eccentric", "hypertrophy", "endurance"],
      cue: "Elbow up at shoulder height. Rotate the knuckles toward the ceiling slowly — keep the shoulder blade set, not hiked." },
    { name: "Prone external-rotation (T on bench)", tissue: "external_rotators", joint: "shoulder", eq: 1,
      protocols: ["eccentric", "hypertrophy"],
      cue: "Thumb up, rotate the arm back until the forearm is vertical. Small range, strict — no swinging or momentum." },
    { name: "Isometric external-rotation hold vs. wall/band", tissue: "external_rotators", joint: "shoulder", eq: 0,
      protocols: ["isometric"],
      cue: "Press the back of the wrist gently into the band and hold. Shoulder relaxed and down; steady breathing throughout." },

    /* ---- scapular retractors / posterior chain (postural endurance) ---- */
    { name: "Face pull (band / cable), high-elbow", tissue: "scapular_retractors", joint: "shoulder", eq: 1,
      protocols: ["hypertrophy", "endurance", "isometric"],
      cue: "Pull the rope to your forehead, thumbs back, elbows high. Squeeze the shoulder blades together — chin tucked, don't crane forward." },
    { name: "Prone / bent-over row (retraction bias)", tissue: "scapular_retractors", joint: "shoulder", eq: 1,
      protocols: ["eccentric", "hypertrophy", "endurance"],
      cue: "Start by setting the shoulder blades, then row. Lower under control — feel the mid-back, not the neck or traps." },
    { name: "Scapular wall slides / prone Y-T-W", tissue: "scapular_retractors", joint: "shoulder", eq: 0,
      protocols: ["endurance", "isometric"],
      cue: "Ribs down, keep light contact throughout. Move slowly and stop the moment the neck or upper traps take over." },
    { name: "Band pull-apart (scap retraction)", tissue: "scapular_retractors", joint: "shoulder", eq: 0,
      protocols: ["hypertrophy", "endurance"],
      cue: "Arms long, pull the band to your chest by squeezing the blades. Keep the shoulders down away from the ears." },

    /* ---- mobility / off-load fallbacks (used when VAS is high) ---- */
    { name: "Wrist / forearm mobility flossing (pain-free range)", tissue: "extensors", joint: "elbow_wrist", eq: 0,
      protocols: ["endurance"],
      cue: "Gentle, pain-free circles and stretches. This is a calming, blood-flow drill — never push into sharp pain." },
    { name: "Thoracic opener + sleeper-adjacent shoulder mobility", tissue: "external_rotators", joint: "shoulder", eq: 0,
      protocols: ["endurance"],
      cue: "Open the mid-back and rotate gently to comfortable end range. Breathe out as you ease a little deeper." }
  ];

  var EQ = { gym: 2, hangboard: 1, minimal: 0 };

  /* pick exercises for a tissue that support a protocol, respect equipment,
     and (when a joint focus is set) prefer that joint but never return empty */
  function pick(tissue, protocol, equip, jointFocus, n) {
    var tier = EQ[equip];
    var base = POOL.filter(function (x) {
      return x.tissue === tissue &&
             x.eq <= tier &&
             x.protocols.indexOf(protocol) !== -1;
    });
    var focused = jointFocus === "both"
      ? base
      : base.filter(function (x) { return x.joint === jointFocus; });
    var out = focused.length ? focused : base;               // fall back across joints
    if (!out.length) {                                       // last resort: ignore protocol
      out = POOL.filter(function (x) { return x.tissue === tissue && x.eq <= tier; });
    }
    return out.slice(0, n || 1);
  }

  /* =====================================================================
     Sport → antagonist emphasis. Which tissues each sport chronically
     under-trains relative to its dominant (agonist) pattern.
     ===================================================================== */
  var SPORT = {
    climbing:  { label: "climbing", tissues: ["extensors", "non_contractile_tendon", "external_rotators", "scapular_retractors"] },
    overhead:  { label: "overhead athletics", tissues: ["external_rotators", "scapular_retractors", "non_contractile_tendon", "extensors"] },
    pulling:   { label: "high-volume pulling sports", tissues: ["external_rotators", "scapular_retractors", "extensors", "non_contractile_tendon"] }
  };

  var TISSUE_LABEL = {
    extensors: "wrist / forearm extensors",
    external_rotators: "shoulder external rotators",
    scapular_retractors: "scapular retractors",
    non_contractile_tendon: "non-contractile tendon"
  };

  /* =====================================================================
     Protocol prescriptions per week. Base values; the deload (Wk4) trims
     volume ~35% while holding intensity. Symptom-driven mode swaps dynamic
     eccentrics for isometrics.
     ===================================================================== */
  function protocolRx(protocol, week, deload) {
    // week 1..4; deload true on week 4
    var setsByWeek = deload ? [3, 3, 4, 2] : [3, 3, 4, 4];
    var sets = setsByWeek[week - 1];

    if (protocol === "isometric") {
      // holds lengthen Wk1→Wk3, trimmed at deload; intensity (MVIC) preserved
      var holds = deload ? ["30 s", "35 s", "45 s", "30 s"] : ["30 s", "40 s", "45 s", "45 s"];
      return {
        sets: sets,
        repsOrHoldTime: holds[week - 1] + " hold",
        tempo: "steady hold ~60–70% max effort",
        rest: "2–3 min",
        note: "Firm, pain-relieving contraction — you should still be able to breathe and hold form."
      };
    }
    if (protocol === "eccentric") {
      var reps = deload ? [8, 8, 6, 6] : [8, 8, 6, 6];
      return {
        sets: sets,
        repsOrHoldTime: reps[week - 1] + " reps (heavy-slow)",
        tempo: "3-0-3-0 (slow lower)",
        rest: "2–3 min",
        note: "Load the collagen: control every rep, emphasise the slow lowering phase."
      };
    }
    if (protocol === "hypertrophy") {
      var hReps = deload ? [12, 12, 10, 12] : [12, 12, 10, 12];
      return {
        sets: sets,
        repsOrHoldTime: hReps[week - 1] + " reps",
        tempo: "2-0-2-0 controlled",
        rest: "60–90 s",
        note: "Build antagonist balance — leave 1–2 reps in reserve, quality over grind."
      };
    }
    // endurance
    var eReps = deload ? [15, 15, 20, 15] : [15, 18, 20, 15];
    return {
      sets: sets,
      repsOrHoldTime: eReps[week - 1] + "+ reps",
      tempo: "1-0-1-0 rhythmic",
      rest: "45–60 s",
      note: "Postural endurance — light load, steady tempo, hold posture the whole set."
    };
  }

  /* choose the primary protocol for a tissue given symptom state */
  function protocolFor(tissue, symptomHigh) {
    if (symptomHigh) {
      // High VAS: off-load. Isometrics for symptomatic contractile/tendon
      // tissue; endurance/postural work for the rest.
      if (tissue === "non_contractile_tendon" || tissue === "extensors" || tissue === "external_rotators") return "isometric";
      return "endurance";
    }
    // Normal: match tissue to its best-evidenced adaptation stimulus
    if (tissue === "non_contractile_tendon") return "eccentric";
    if (tissue === "extensors") return "eccentric";
    if (tissue === "external_rotators") return "hypertrophy";
    return "endurance"; // scapular_retractors → postural endurance
  }

  /* ---- render helpers ---- */
  function esc(s){return String(s).replace(/[<>&"]/g,function(c){return{'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});}

  var WEEK_FOCUS = [
    "Baseline loading & movement familiarisation",
    "Volume progression — added sets / longer holds",
    "Peak stimulus — load density & top-end volume",
    "Strategic deload — volume down ~35%, intensity held"
  ];

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var cfg = {
      sport: document.getElementById("t-sport").value,
      joint: document.getElementById("t-joint").value,
      equip: document.getElementById("t-equip").value,
      agonistMinutes: parseInt(document.getElementById("t-agonist").value, 10) || 0,
      rpe: parseInt(rpe.value, 10),
      vas: parseInt(vas.value, 10),
      symptomAreas: selected("symptom"),
      sessions: parseInt(document.getElementById("t-sessions").value, 10) || 2
    };
    render(cfg);
  });

  function render(cfg) {
    var symptomHigh = cfg.vas > 5;
    var sport = SPORT[cfg.sport] || SPORT.climbing;

    // order tissues by sport emphasis, then restrict to the chosen joint focus
    var tissues = sport.tissues.filter(function (t) {
      if (cfg.joint === "both") return true;
      var poolJoint = cfg.joint; // elbow_wrist | shoulder
      return POOL.some(function (x) { return x.tissue === t && x.joint === poolJoint; });
    });
    if (!tissues.length) tissues = sport.tissues;

    // cap the number of distinct movements per session by available time /
    // sessions so the plan stays realistic (3–5 exercises)
    var maxEx = Math.min(5, Math.max(3, cfg.sessions + 1));
    var chosenTissues = tissues.slice(0, maxEx);

    // resolve one exercise per tissue (protocol depends on symptom state)
    var slots = chosenTissues.map(function (t) {
      var protocol = protocolFor(t, symptomHigh);
      var ex = pick(t, protocol, cfg.equip, cfg.joint, 1)[0];
      return { tissue: t, protocol: protocol, ex: ex };
    });

    // build the 4 weeks
    var weeks = [1, 2, 3, 4].map(function (w) {
      var deload = w === 4;
      var exercises = slots.map(function (s) {
        var rx = protocolRx(s.protocol, w, deload);
        return {
          exerciseName: s.ex ? s.ex.name : TISSUE_LABEL[s.tissue] + " drill",
          targetTissue: s.tissue,
          loadingProtocol: s.protocol,
          sets: rx.sets,
          repsOrHoldTime: rx.repsOrHoldTime,
          tempo: rx.tempo,
          restPeriod: rx.rest,
          coachingCue: s.ex ? s.ex.cue : rx.note
        };
      });
      return { week: w, focus: WEEK_FOCUS[w - 1], sessionsPerWeek: cfg.sessions, exercises: exercises };
    });

    var program = {
      title: capitalize(sport.label) + " antagonist & tendon-adaptation block · 4 weeks",
      rationale: buildRationale(cfg, sport, symptomHigh, chosenTissues),
      weeklyStructure: weeks
    };

    paint(program, cfg, symptomHigh);
  }

  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

  function buildRationale(cfg, sport, symptomHigh, tissues) {
    var parts = [];
    parts.push("Your " + sport.label + " loads the pulling / gripping muscles hard" +
      (cfg.agonistMinutes ? " (~" + cfg.agonistMinutes + " min/week of agonist work)" : "") +
      ", so this block deliberately trains the under-loaded antagonists — " +
      tissues.map(function (t) { return TISSUE_LABEL[t]; }).join(", ") +
      " — plus the tendons that take the chronic strain.");
    if (symptomHigh) {
      parts.push("Because you reported symptoms at " + cfg.vas + "/10 (above 5/10), the plan leads with " +
        "pain-relieving isometric holds and off-loading / mobility work rather than heavy dynamic eccentrics. " +
        "Progress dynamic loading back in only once symptoms settle below ~3/10 at rest.");
    } else {
      parts.push("With symptoms at " + cfg.vas + "/10 we can load progressively: heavy-slow resistance and " +
        "eccentrics for tendon collagen remodelling, hypertrophy / endurance work for muscular balance.");
    }
    parts.push("Volume climbs across weeks 1–3, then week 4 deloads (~35% fewer sets) while holding intensity so the tissue adapts and consolidates.");
    return parts.join(" ");
  }

  var PROTOCOL_BADGE = {
    isometric: "Isometric",
    eccentric: "Eccentric / HSR",
    hypertrophy: "Hypertrophy",
    endurance: "Endurance"
  };

  function paint(program, cfg, symptomHigh) {
    var weekBlocks = program.weeklyStructure.map(function (wk) {
      var rows = wk.exercises.map(function (ex) {
        return "<tr>" +
          "<td><strong>" + esc(ex.exerciseName) + "</strong><div class='muted' style='font-size:.82rem;margin-top:.15rem'>" + esc(ex.coachingCue) + "</div></td>" +
          "<td><span class='badge badge-new'>" + PROTOCOL_BADGE[ex.loadingProtocol] + "</span><div class='muted' style='font-size:.8rem;margin-top:.2rem'>" + TISSUE_LABEL[ex.targetTissue] + "</div></td>" +
          "<td>" + ex.sets + " × " + esc(ex.repsOrHoldTime) + "</td>" +
          "<td>" + esc(ex.tempo) + "</td>" +
          "<td>" + esc(ex.restPeriod) + "</td>" +
          "</tr>";
      }).join("");

      var deloadTag = wk.week === 4 ? " <span class='badge' style='background:#fdf0e3;color:#a05a12'>Deload</span>" : "";
      return "<div class='mt-4'>" +
        "<h3 style='margin-bottom:.2rem'>Week " + wk.week + deloadTag + "</h3>" +
        "<p class='muted' style='font-size:.92rem'>" + esc(wk.focus) + " · " + wk.sessionsPerWeek + "×/week</p>" +
        "<div class='table-wrap mt-2'><table><thead><tr>" +
        "<th>Exercise &amp; cue</th><th>Protocol · tissue</th><th>Sets × reps/hold</th><th>Tempo</th><th>Rest</th>" +
        "</tr></thead><tbody>" + rows + "</tbody></table></div>" +
      "</div>";
    }).join("");

    var safety = symptomHigh
      ? "<div class='notice mt-3'><span>⚠️</span><span><b>Symptom-led mode (VAS " + cfg.vas + "/10).</b> " +
        "Heavy dynamic eccentrics are held back in favour of isometric holds and off-loading. Sharp or worsening pain means stop, " +
        "and any symptom that isn’t settling should be reviewed by a physiotherapist before you progress load.</span></div>"
      : "<div class='notice mt-3'><span>ℹ️</span><span>This is a science-based antagonist / tendon-adaptation template, not medical advice. " +
        "If pain rises above ~5/10 during or after a session, drop back to the isometric variations and reduce load.</span></div>";

    var html =
      "<div class='panel'>" +
        "<span class='badge badge-new'>Your antagonist block</span>" +
        "<h2 style='margin-top:.5rem'>" + esc(program.title) + "</h2>" +
        "<p>" + esc(program.rationale) + "</p>" +
        safety +
        "<h3 class='mt-4'>How to run the block</h3>" +
        "<p class='muted' style='font-size:.92rem'>Do these as a short antagonist / prehab circuit " + cfg.sessions +
          "× per week, ideally on or after your main training days (not before hard climbing / throwing). " +
          "Progress the numbers week to week exactly as laid out — the deload in week 4 is part of the adaptation, not an optional extra.</p>" +
        weekBlocks +
        "<div class='notice mt-4'><span>📋</span><span>Log each session in the <a href='practice.html#logger'>training log</a> so you can watch symptoms trend down and loads trend up over the block.</span></div>" +
        "<div class='mt-3 flex'>" +
          "<button class='btn btn-ghost' id='antag-print' type='button'>Print / save this block</button>" +
        "</div>" +
      "</div>";

    var results = document.getElementById("antag-results");
    results.innerHTML = html;
    results.classList.remove("hidden");
    results.scrollIntoView({ behavior: "smooth", block: "start" });

    var pb = document.getElementById("antag-print");
    if (pb) pb.addEventListener("click", function () { window.print(); });
  }
})();
