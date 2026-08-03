/* =====================================================================
   PROGRAM TEMPLATES — periodized, evidence-based training programs
   ---------------------------------------------------------------------
   Each program is a template the engine renders into a full, phone-ready
   plan. A program bundles:
     - metadata (audience, duration, equipment, level, subscription tier)
     - a plain-language description (written for a high-school reader)
     - an evidence-based justification with citations
     - a "how-to" glossary of any protocols an exerciser might not know
     - PHASES (mesocycle blocks) that apply progressive overload, each
       containing WORKOUTS with the four required sections:
         warmup  → warm-up / mobility
         prehab  → injury-prevention / supplemental
         main    → the main training block
         cooldown→ cool-down / flexibility

   A prescription references an exercise family from TS_EXERCISES:
     { ex, level, sets, reps, tempo, rest, note }
   - ex:    family id (see assets/data/exercises.js)
   - level: index into that family's ladder (its default difficulty here).
            The exerciser can scale up/down at view time.
   - sets/reps/tempo/rest: the prescribed variables. tempo/rest fall back
            to the family default or the phase scheme when omitted.

   Subscription tiers control how many programs a member can open (see
   TS_TIERS at the bottom) — more programs = higher tier.
   ===================================================================== */
(function () {
  "use strict";

  var PROGRAMS = [

    /* =================================================================
       1) MOVEMENT FOUNDATIONS — free starter
       ================================================================= */
    {
      id: "movement-foundations",
      title: "Movement Foundations",
      tagline: "Learn the six big patterns and build a base you can train on.",
      goal: "foundation",
      level: "beginner",
      weeks: 3,
      daysPerWeek: 2,
      sessionMinutes: 35,
      equipment: "A pair of dumbbells (or a backpack), a sturdy chair or bench, and a resistance band.",
      equipmentTier: "minimal",
      tier: "free",
      audience: "Anyone brand-new to structured training, or coming back after a long break, who wants to build safe technique before adding intensity.",
      description:
        "A short, gentle on-ramp. Over three weeks you'll learn the six movements that almost every workout is built from — squat, hinge, push, pull, carry, and core — and groove them with light load. Nothing here should feel maxed out. The goal is clean technique and consistency, so the harder programs later actually work. Two short sessions a week is all it takes.",
      justification: [
        { plain: "We start with movement quality and light loads on purpose. Adding difficulty gradually — instead of going hard on day one — is the safest, most reliable way to get stronger, and it's the whole idea behind 'progressive overload'.",
          cite: "American College of Sports Medicine. Progression Models in Resistance Training for Healthy Adults. Med Sci Sports Exerc. 2009." },
        { plain: "Learning a handful of big, compound patterns (rather than lots of tiny isolation moves) gives you the most strength and fitness for your time, which matters when you're just getting the habit going.",
          cite: "Kraemer WJ, Ratamess NA. Fundamentals of resistance training: progression and exercise prescription. Med Sci Sports Exerc. 2004." }
      ],
      howto: [
        { name: "Tempo (the 3-number code)", text: "A tempo like 3-0-1 means: take 3 seconds to lower, pause 0 seconds at the bottom, take 1 second to lift. Slower lowering builds control and strength. If you see '—', just move at a normal, controlled pace." },
        { name: "Reps in reserve (RIR)", text: "Stop each set with 1–3 good reps still 'in the tank'. Early on, never grind to failure — leave a buffer so your form stays crisp and you recover for the next session." },
        { name: "Regressions & progressions", text: "Every exercise has an easier version (regression) and a harder version (progression). Use the ◀ / ▶ buttons on each move to pick the level that lets you hit the reps with good form." }
      ],
      phases: [
        {
          name: "Whole block — Groove the patterns",
          weeks: "1–3",
          focus: "Own the movements with light load and full range. Add a little weight or a rep or two each week only if form stays perfect.",
          scheme: { intensity: "Light–moderate", sets: "2", reps: "8–12", rest: "60–90 s" },
          progression: "Week 1 learn it; week 2 add a rep or slightly more load; week 3 add one more set or a small load bump. Keep 2–3 reps in reserve throughout.",
          workouts: [
            {
              name: "Day A — Squat & Push focus",
              warmup: [
                { ex: "catcow", level: 1, sets: 1, reps: "6 slow" },
                { ex: "wgs", level: 0, sets: 1, reps: "4 / side" },
                { ex: "glutebridge", level: 0, sets: 2, reps: "10" }
              ],
              prehab: [
                { ex: "facepull", level: 0, sets: 2, reps: "12–15" }
              ],
              main: [
                { ex: "squat", level: 2, sets: 2, reps: "8–10", tempo: "3-0-1", rest: "75 s" },
                { ex: "hpush", level: 0, sets: 2, reps: "8–12", tempo: "3-0-1", rest: "75 s" },
                { ex: "hpull", level: 0, sets: 2, reps: "10–12", tempo: "2-1-2", rest: "75 s" },
                { ex: "plank", level: 1, sets: 2, reps: "20–30 s hold" }
              ],
              cooldown: [
                { ex: "couch", level: 0, sets: 1, reps: "30–45 s / side" },
                { ex: "breath", level: 0, sets: 1, reps: "1–2 min" }
              ]
            },
            {
              name: "Day B — Hinge & Pull focus",
              warmup: [
                { ex: "legswing", level: 0, sets: 1, reps: "10 / direction" },
                { ex: "inchworm", level: 0, sets: 1, reps: "5" },
                { ex: "glutebridge", level: 1, sets: 2, reps: "8 / side" }
              ],
              prehab: [
                { ex: "extrot", level: 1, sets: 2, reps: "12–15" }
              ],
              main: [
                { ex: "hinge", level: 1, sets: 2, reps: "8–10", tempo: "3-0-1", rest: "75 s" },
                { ex: "vpull", level: 0, sets: 2, reps: "10–12", tempo: "2-1-2", rest: "75 s" },
                { ex: "splitsquat", level: 1, sets: 2, reps: "8 / leg", tempo: "2-0-1", rest: "75 s" },
                { ex: "carry", level: 0, sets: 2, reps: "30 m walk" }
              ],
              cooldown: [
                { ex: "hammy", level: 0, sets: 1, reps: "30–45 s / side" },
                { ex: "pecstretch", level: 0, sets: 1, reps: "30 s / side" }
              ]
            }
          ]
        }
      ]
    },

    /* =================================================================
       2) TOTAL-BODY STRENGTH FOUNDATIONS
       ================================================================= */
    {
      id: "total-body-strength",
      title: "Total-Body Strength Foundations",
      tagline: "Eight weeks to get genuinely stronger, three days a week.",
      goal: "strength",
      level: "beginner",
      weeks: 8,
      daysPerWeek: 3,
      sessionMinutes: 55,
      equipment: "Dumbbells (adjustable is ideal) or access to a gym, a bench, a pull-up bar or band, and a resistance band.",
      equipmentTier: "minimal",
      tier: "essential",
      audience: "Beginner-to-early-intermediate lifters who can already perform the basic patterns and want a structured plan to build full-body strength without living in the gym.",
      description:
        "A classic strength block that takes you from 'I do some workouts' to 'I follow a plan and I'm measurably stronger'. It runs on a simple full-body, three-days-a-week structure and moves through three phases: first you build work capacity and clean technique, then you push heavier for pure strength, and finally you peak and back off so your gains show up. Every session covers your whole body, protects your joints with prehab, and finishes with mobility. You add a little each week — that steady climb is what drives results.",
      justification: [
        { plain: "The program is 'periodized' — the sets, reps and intensity change in a planned way from phase to phase. Studies that stack periodized plans against doing the same thing every week consistently favour the periodized approach for strength.",
          cite: "Rhea MR, et al. A comparison of linear and daily undulating periodized programs. J Strength Cond Res. 2002; Williams TD, et al. Comparison of periodization models: meta-analysis. Sports Med. 2017." },
        { plain: "We start with more reps at moderate load and shift toward heavier weights for fewer reps. Heavy, lower-rep work is the strongest driver of maximal-strength gains for trained-enough lifters.",
          cite: "American College of Sports Medicine. Progression Models in Resistance Training. Med Sci Sports Exerc. 2009." },
        { plain: "Three full-body days lets each big muscle group get trained about 2–3 times a week, and that training frequency tends to beat hitting a muscle just once a week when weekly volume is matched.",
          cite: "Schoenfeld BJ, Ogborn D, Krieger JW. Effects of resistance training frequency on measures of muscle hypertrophy: a meta-analysis. Sports Med. 2016." },
        { plain: "The prehab section isn't filler. Doing dedicated strength and resistance work meaningfully lowers your risk of overuse and acute injuries, which keeps you training consistently.",
          cite: "Lauersen JB, Bertelsen DM, Andersen LB. The effectiveness of exercise interventions to prevent sports injuries. Br J Sports Med. 2014." },
        { plain: "The deload week at the end isn't lost time — pulling back on volume lets fatigue clear so the fitness you built can surface. This 'fitness–fatigue' idea underpins how peaking works.",
          cite: "Bosquet L, Montpetit J, Arvisais D, Mujika I. Effects of tapering on performance: a meta-analysis. Med Sci Sports Exerc. 2007." }
      ],
      howto: [
        { name: "Tempo (the 3-number code)", text: "3-0-1 means 3 seconds down, 0-second pause, 1 second up. Controlling the lowering phase builds strength and protects joints." },
        { name: "RPE (rate of perceived exertion)", text: "A 1–10 effort scale. RPE 8 means you could have done about 2 more reps. We nudge the target RPE up as the phases progress so effort rises in a controlled way." },
        { name: "Progressive overload", text: "Each week, do a little more than last week — one more rep, a small load increase, or one more set — but only while your form holds. That steady 'more' is what makes you adapt." },
        { name: "Deload", text: "A planned easy week (fewer sets, lighter loads) that lets accumulated fatigue drain away so your true strength shows up afterward. Don't skip it." },
        { name: "Straight sets vs. supersets", text: "Straight sets: finish all sets of one exercise before the next. If two moves are marked as a superset (e.g. A1/A2), alternate between them, resting after each pair to save time." }
      ],
      phases: [
        {
          name: "Phase 1 — Base & technique",
          weeks: "1–3",
          focus: "Build work capacity and bullet-proof technique with moderate loads and slightly higher reps. Keep 2–3 reps in reserve.",
          scheme: { intensity: "Moderate (RPE 6–7)", sets: "3", reps: "8–12", rest: "60–90 s", tempo: "3-0-1" },
          progression: "Add reps within the range week to week; when you hit the top of the range on all sets with good form, add a little load and drop back to the bottom of the range.",
          workouts: [
            {
              name: "Day 1 — Full body A",
              warmup: [
                { ex: "catcow", level: 1, sets: 1, reps: "6" },
                { ex: "wgs", level: 1, sets: 1, reps: "4 / side" },
                { ex: "glutebridge", level: 1, sets: 2, reps: "8 / side" }
              ],
              prehab: [
                { ex: "facepull", level: 1, sets: 2, reps: "12–15" },
                { ex: "pallof", level: 1, sets: 2, reps: "10 / side" }
              ],
              main: [
                { ex: "squat", level: 2, sets: 3, reps: "8–10", rest: "90 s" },
                { ex: "hpush", level: 1, sets: 3, reps: "8–12", rest: "75 s" },
                { ex: "hpull", level: 2, sets: 3, reps: "10–12", rest: "75 s" },
                { ex: "deadbug", level: 1, sets: 3, reps: "8 / side" }
              ],
              cooldown: [
                { ex: "couch", level: 1, sets: 1, reps: "40 s / side" },
                { ex: "pecstretch", level: 0, sets: 1, reps: "30 s / side" }
              ]
            },
            {
              name: "Day 2 — Full body B",
              warmup: [
                { ex: "legswing", level: 1, sets: 1, reps: "10 / direction" },
                { ex: "inchworm", level: 1, sets: 1, reps: "5" },
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" }
              ],
              prehab: [
                { ex: "extrot", level: 1, sets: 2, reps: "12–15" },
                { ex: "calf", level: 1, sets: 2, reps: "12 / side" }
              ],
              main: [
                { ex: "hinge", level: 2, sets: 3, reps: "8–10", rest: "90 s" },
                { ex: "vpush", level: 1, sets: 3, reps: "8–10", rest: "75 s" },
                { ex: "vpull", level: 1, sets: 3, reps: "6–10", rest: "90 s" },
                { ex: "sideplank", level: 1, sets: 2, reps: "20–30 s / side" }
              ],
              cooldown: [
                { ex: "hammy", level: 0, sets: 1, reps: "40 s / side" },
                { ex: "breath", level: 0, sets: 1, reps: "1–2 min" }
              ]
            },
            {
              name: "Day 3 — Full body C",
              warmup: [
                { ex: "catcow", level: 1, sets: 1, reps: "6" },
                { ex: "wgs", level: 1, sets: 1, reps: "4 / side" }
              ],
              prehab: [
                { ex: "nordic", level: 0, sets: 2, reps: "8" },
                { ex: "wristext", level: 1, sets: 2, reps: "15" }
              ],
              main: [
                { ex: "splitsquat", level: 1, sets: 3, reps: "8 / leg", rest: "75 s" },
                { ex: "hpull", level: 1, sets: 3, reps: "10–12", rest: "75 s" },
                { ex: "hpush", level: 1, sets: 3, reps: "10–12", rest: "75 s" },
                { ex: "carry", level: 0, sets: 3, reps: "40 m" }
              ],
              cooldown: [
                { ex: "pigeon", level: 0, sets: 1, reps: "40 s / side" },
                { ex: "pecstretch", level: 1, sets: 1, reps: "30 s" }
              ]
            }
          ]
        },
        {
          name: "Phase 2 — Maximal strength",
          weeks: "4–6",
          focus: "Shift toward heavier loads and lower reps on the main lifts to drive strength. Longer rests so each hard set is high quality.",
          scheme: { intensity: "High (RPE 7–8)", sets: "3–4", reps: "4–6", rest: "2–3 min", tempo: "3-0-1" },
          progression: "Aim to add a small amount of load each week while staying in the 4–6 rep range. Back-off/assistance moves stay in the 8–12 range.",
          workouts: [
            {
              name: "Day 1 — Lower emphasis",
              warmup: [
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" },
                { ex: "wgs", level: 2, sets: 1, reps: "4 / side" }
              ],
              prehab: [
                { ex: "pallof", level: 1, sets: 2, reps: "10 / side" },
                { ex: "calf", level: 2, sets: 3, reps: "10 / side" }
              ],
              main: [
                { ex: "squat", level: 3, sets: 4, reps: "4–6", rest: "3 min" },
                { ex: "hinge", level: 2, sets: 3, reps: "5", rest: "2–3 min" },
                { ex: "splitsquat", level: 2, sets: 3, reps: "8 / leg", rest: "90 s" },
                { ex: "deadbug", level: 2, sets: 3, reps: "8 / side" }
              ],
              cooldown: [
                { ex: "couch", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "hammy", level: 1, sets: 1, reps: "40 s / side" }
              ]
            },
            {
              name: "Day 2 — Upper emphasis",
              warmup: [
                { ex: "inchworm", level: 2, sets: 1, reps: "5" },
                { ex: "catcow", level: 2, sets: 1, reps: "6" }
              ],
              prehab: [
                { ex: "facepull", level: 2, sets: 3, reps: "12–15" },
                { ex: "extrot", level: 2, sets: 2, reps: "12" }
              ],
              main: [
                { ex: "hpush", level: 3, sets: 4, reps: "4–6", rest: "2–3 min" },
                { ex: "vpull", level: 3, sets: 4, reps: "4–6", rest: "2–3 min" },
                { ex: "vpush", level: 2, sets: 3, reps: "6–8", rest: "90 s" },
                { ex: "sideplank", level: 2, sets: 2, reps: "30 s / side" }
              ],
              cooldown: [
                { ex: "pecstretch", level: 1, sets: 1, reps: "30 s" },
                { ex: "breath", level: 0, sets: 1, reps: "2 min" }
              ]
            },
            {
              name: "Day 3 — Full body strength",
              warmup: [
                { ex: "legswing", level: 1, sets: 1, reps: "10 / direction" },
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" }
              ],
              prehab: [
                { ex: "nordic", level: 1, sets: 3, reps: "6" },
                { ex: "wristext", level: 2, sets: 2, reps: "12" }
              ],
              main: [
                { ex: "hinge", level: 3, sets: 4, reps: "4–6", rest: "3 min" },
                { ex: "hpull", level: 2, sets: 4, reps: "6–8", rest: "90 s" },
                { ex: "hpush", level: 2, sets: 3, reps: "6–8", rest: "90 s" },
                { ex: "carry", level: 1, sets: 3, reps: "30 m / side" }
              ],
              cooldown: [
                { ex: "pigeon", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "breath", level: 1, sets: 1, reps: "2 min" }
              ]
            }
          ]
        },
        {
          name: "Phase 3 — Peak & deload",
          weeks: "7–8",
          focus: "Week 7 briefly touches your heaviest loads for low reps; week 8 is a deload — cut the sets roughly in half and lighten up so your strength surfaces.",
          scheme: { intensity: "Wk7 very high (RPE 8–9) · Wk8 low", sets: "Wk7: 3–4 · Wk8: 2", reps: "Wk7: 2–4 · Wk8: 6–8 easy", rest: "3–4 min (Wk7)", tempo: "2-0-1" },
          progression: "Week 7: work up to a heavy top set of 2–4 on the main lifts, leaving 1 rep in reserve — do not grind. Week 8: everything light and smooth; you should leave the gym feeling fresher, not wrecked. Retest a lift or two at the end to see your progress.",
          workouts: [
            {
              name: "Peak day — Lower",
              warmup: [
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" },
                { ex: "wgs", level: 2, sets: 1, reps: "4 / side" }
              ],
              prehab: [
                { ex: "pallof", level: 2, sets: 2, reps: "8 / side" }
              ],
              main: [
                { ex: "squat", level: 4, sets: 4, reps: "2–4", rest: "3–4 min" },
                { ex: "hinge", level: 3, sets: 3, reps: "3", rest: "3 min" },
                { ex: "plank", level: 3, sets: 2, reps: "30–40 s" }
              ],
              cooldown: [
                { ex: "couch", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "breath", level: 1, sets: 1, reps: "2–3 min" }
              ]
            },
            {
              name: "Peak day — Upper",
              warmup: [
                { ex: "inchworm", level: 2, sets: 1, reps: "5" },
                { ex: "facepull", level: 2, sets: 2, reps: "12" }
              ],
              prehab: [
                { ex: "extrot", level: 2, sets: 2, reps: "12" }
              ],
              main: [
                { ex: "hpush", level: 3, sets: 4, reps: "2–4", rest: "3 min" },
                { ex: "vpull", level: 4, sets: 4, reps: "2–4", rest: "3 min" },
                { ex: "carry", level: 2, sets: 3, reps: "20 m" }
              ],
              cooldown: [
                { ex: "pecstretch", level: 1, sets: 1, reps: "30 s" },
                { ex: "breath", level: 1, sets: 1, reps: "2–3 min" }
              ]
            }
          ]
        }
      ]
    },

    /* =================================================================
       3) ATHLETIC POWER & PERFORMANCE
       ================================================================= */
    {
      id: "athletic-power",
      title: "Athletic Power & Performance",
      tagline: "Turn strength into speed and explosiveness for sport.",
      goal: "power",
      level: "intermediate",
      weeks: 8,
      daysPerWeek: 4,
      sessionMinutes: 60,
      equipment: "A gym or solid home setup: barbell or dumbbells, a box, a medicine ball, a pull-up bar, and space to jump and throw.",
      equipmentTier: "gym",
      tier: "complete",
      audience: "Intermediate trainees and recreational or competitive athletes who already have a strength base and want to move faster and jump, throw and change direction more explosively.",
      description:
        "Power is strength expressed quickly — and you can't express force you haven't built, so this program builds both. It follows the proven 'strength then power' sequence: an early block raises how much force you can produce, and later blocks teach your body to produce that force fast through jumps, throws and explosive lifts. Power and speed work always comes first in each session, while you're fresh, because quality matters more than fatigue here. Four days a week split into lower- and upper-focused sessions, with prehab and mobility woven in to keep you healthy for your sport.",
      justification: [
        { plain: "Maximal strength is the foundation of power: stronger athletes can produce more force, and more force available means more can be turned into speed. That's why the early phase pushes strength before we chase explosiveness.",
          cite: "Suchomel TJ, Nimphius S, Stone MH. The Importance of Muscular Strength in Athletic Performance. Sports Med. 2016." },
        { plain: "Developing power works best by training across the force–velocity spectrum: heavy strength work, then ballistic and plyometric work done with maximal speed. We sequence the phases to do exactly that.",
          cite: "Cormie P, McGuigan MR, Newton RU. Developing maximal neuromuscular power (Parts 1 & 2). Sports Med. 2011." },
        { plain: "Explosive moves are placed at the very start of each session, before you're tired. Power output drops sharply with fatigue, so training it fresh gives the best-quality reps and the best adaptation.",
          cite: "Kraemer WJ, Ratamess NA. Fundamentals of resistance training: progression and exercise prescription. Med Sci Sports Exerc. 2004." },
        { plain: "Plyometric (jump) training genuinely improves jump height, sprint speed and change-of-direction — the qualities most sports care about — when it's dosed sensibly with full recovery between efforts.",
          cite: "Markovic G, Mikulic P. Neuro-musculoskeletal and performance adaptations to lower-extremity plyometric training. Sports Med. 2010." },
        { plain: "Strength and neuromuscular training also cuts injury risk in athletes, which is why prehab stays in every week even during a performance block.",
          cite: "Lauersen JB, Andersen TE, Andersen LB. Strength training as superior injury-prevention. Br J Sports Med. 2018." }
      ],
      howto: [
        { name: "Power before strength, every session", text: "Do the explosive move (jump, throw, swing) first, while your nervous system is fresh. These are about speed and quality, not exhaustion — rest fully between sets." },
        { name: "Intent (move it fast)", text: "On power exercises, try to move the load or your body as fast as humanly possible on the way up, even if the weight is light. The *intent* to be explosive is what trains power." },
        { name: "Contrast / complex pairs", text: "In later phases you'll pair a heavy strength lift with an explosive move (e.g. heavy squat, then a jump). The heavy set briefly 'primes' the nervous system so the jump is springier. Rest 2–3 min between the pair." },
        { name: "Full recovery on plyos", text: "Jumps and throws need long rests (often 2–3 min or by feel). If reps get slow or sloppy, the set is over — stop and rest. Tired plyometrics build fatigue, not power." },
        { name: "Tempo & RPE", text: "Same as the strength program: tempo is lower-pause-lift in seconds; RPE is a 1–10 effort scale where 8 leaves about 2 reps in the tank." }
      ],
      phases: [
        {
          name: "Phase 1 — Strength base",
          weeks: "1–3",
          focus: "Raise maximal strength on the big lifts so there's more force to convert into power later. Introduce low-volume, high-quality jumps and throws to prime the pattern.",
          scheme: { intensity: "High (RPE 7–8)", sets: "3–4", reps: "4–6 (strength) · 3–5 (power)", rest: "2–3 min", tempo: "3-0-1 (strength) · fast" },
          progression: "Add small load to the main lifts weekly. Keep power reps low and crisp — 3–5 quality reps, full rest.",
          workouts: [
            {
              name: "Day 1 — Lower (strength)",
              warmup: [
                { ex: "legswing", level: 1, sets: 1, reps: "10 / direction" },
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" },
                { ex: "wgs", level: 2, sets: 1, reps: "4 / side" }
              ],
              prehab: [
                { ex: "calf", level: 2, sets: 3, reps: "10 / side" },
                { ex: "pallof", level: 1, sets: 2, reps: "10 / side" }
              ],
              main: [
                { ex: "jump", level: 0, sets: 4, reps: "4", rest: "2 min", note: "Power first — max height, soft landings." },
                { ex: "squat", level: 4, sets: 4, reps: "4–6", rest: "3 min" },
                { ex: "hinge", level: 3, sets: 3, reps: "5", rest: "2–3 min" },
                { ex: "sideplank", level: 2, sets: 2, reps: "30 s / side" }
              ],
              cooldown: [
                { ex: "couch", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "breath", level: 0, sets: 1, reps: "2 min" }
              ]
            },
            {
              name: "Day 2 — Upper (strength)",
              warmup: [
                { ex: "inchworm", level: 2, sets: 1, reps: "5" },
                { ex: "facepull", level: 1, sets: 2, reps: "12–15" }
              ],
              prehab: [
                { ex: "extrot", level: 2, sets: 2, reps: "12" },
                { ex: "wristext", level: 2, sets: 2, reps: "12" }
              ],
              main: [
                { ex: "mbslam", level: 0, sets: 4, reps: "4", rest: "90 s", note: "Explosive chest pass into a wall." },
                { ex: "hpush", level: 3, sets: 4, reps: "4–6", rest: "2–3 min" },
                { ex: "vpull", level: 3, sets: 4, reps: "4–6", rest: "2–3 min" },
                { ex: "carry", level: 1, sets: 3, reps: "30 m / side" }
              ],
              cooldown: [
                { ex: "pecstretch", level: 1, sets: 1, reps: "30 s" },
                { ex: "breath", level: 0, sets: 1, reps: "2 min" }
              ]
            },
            {
              name: "Day 3 — Lower (power-bias)",
              warmup: [
                { ex: "legswing", level: 1, sets: 1, reps: "10 / direction" },
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" }
              ],
              prehab: [
                { ex: "nordic", level: 1, sets: 3, reps: "6" }
              ],
              main: [
                { ex: "swing", level: 1, sets: 5, reps: "8", rest: "90 s", note: "Snap the hips — float the bell." },
                { ex: "splitsquat", level: 2, sets: 3, reps: "6 / leg", rest: "90 s" },
                { ex: "slrdl", level: 2, sets: 3, reps: "8 / leg", rest: "75 s" },
                { ex: "deadbug", level: 2, sets: 3, reps: "8 / side" }
              ],
              cooldown: [
                { ex: "pigeon", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "hammy", level: 1, sets: 1, reps: "40 s / side" }
              ]
            },
            {
              name: "Day 4 — Upper (power-bias)",
              warmup: [
                { ex: "catcow", level: 2, sets: 1, reps: "6" },
                { ex: "facepull", level: 2, sets: 2, reps: "12" }
              ],
              prehab: [
                { ex: "extrot", level: 1, sets: 2, reps: "15" }
              ],
              main: [
                { ex: "mbslam", level: 1, sets: 4, reps: "5", rest: "90 s" },
                { ex: "vpush", level: 3, sets: 4, reps: "5", rest: "2 min" },
                { ex: "hpull", level: 3, sets: 4, reps: "6–8", rest: "90 s" },
                { ex: "pallof", level: 2, sets: 3, reps: "8 / side" }
              ],
              cooldown: [
                { ex: "pecstretch", level: 1, sets: 1, reps: "30 s" },
                { ex: "breath", level: 1, sets: 1, reps: "2 min" }
              ]
            }
          ]
        },
        {
          name: "Phase 2 — Power conversion",
          weeks: "4–6",
          focus: "Convert that strength into speed. Heavy lifts drop in volume and pair with explosive moves (contrast pairs). Jumps and throws ramp up with maximal intent.",
          scheme: { intensity: "Explosive · strength RPE 7", sets: "3–5", reps: "3–5 (power) · 3–4 (strength)", rest: "2–3 min", tempo: "fast up" },
          progression: "Increase jump/throw quality (height, distance) rather than reps. Nudge strength load only if bar/dumbbell speed stays fast.",
          workouts: [
            {
              name: "Day 1 — Lower (contrast)",
              warmup: [
                { ex: "legswing", level: 1, sets: 1, reps: "10 / direction" },
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" },
                { ex: "wgs", level: 2, sets: 1, reps: "4 / side" }
              ],
              prehab: [
                { ex: "calf", level: 2, sets: 3, reps: "8 / side" }
              ],
              main: [
                { ex: "squat", level: 4, sets: 4, reps: "3", rest: "20–30 s, then jump", note: "Heavy triple, rest briefly, then the jump below (contrast pair)." },
                { ex: "jump", level: 1, sets: 4, reps: "3", rest: "3 min", note: "Max-height box jump right after the heavy squat." },
                { ex: "slrdl", level: 2, sets: 3, reps: "6 / leg", rest: "90 s" },
                { ex: "sideplank", level: 2, sets: 2, reps: "30 s / side" }
              ],
              cooldown: [
                { ex: "couch", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "breath", level: 1, sets: 1, reps: "2 min" }
              ]
            },
            {
              name: "Day 2 — Upper (contrast)",
              warmup: [
                { ex: "inchworm", level: 2, sets: 1, reps: "5" },
                { ex: "facepull", level: 2, sets: 2, reps: "12" }
              ],
              prehab: [
                { ex: "extrot", level: 2, sets: 2, reps: "12" }
              ],
              main: [
                { ex: "hpush", level: 3, sets: 4, reps: "3", rest: "20–30 s, then throw" },
                { ex: "mbslam", level: 0, sets: 4, reps: "4", rest: "2–3 min", note: "Explosive chest pass after the heavy press (contrast pair)." },
                { ex: "vpull", level: 3, sets: 4, reps: "4", rest: "2 min" },
                { ex: "carry", level: 2, sets: 3, reps: "20 m" }
              ],
              cooldown: [
                { ex: "pecstretch", level: 1, sets: 1, reps: "30 s" },
                { ex: "breath", level: 1, sets: 1, reps: "2 min" }
              ]
            },
            {
              name: "Day 3 — Explosive lower & throws",
              warmup: [
                { ex: "legswing", level: 1, sets: 1, reps: "10 / direction" },
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" }
              ],
              prehab: [
                { ex: "nordic", level: 2, sets: 3, reps: "5" }
              ],
              main: [
                { ex: "jump", level: 2, sets: 5, reps: "3", rest: "2–3 min", note: "Broad jumps — stick every landing." },
                { ex: "swing", level: 2, sets: 5, reps: "6 / side", rest: "90 s" },
                { ex: "mbslam", level: 2, sets: 4, reps: "5 / side", rest: "90 s", note: "Rotational throws for change-of-direction power." },
                { ex: "deadbug", level: 2, sets: 3, reps: "8 / side" }
              ],
              cooldown: [
                { ex: "pigeon", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "breath", level: 1, sets: 1, reps: "2 min" }
              ]
            },
            {
              name: "Day 4 — Upper strength maintain",
              warmup: [
                { ex: "catcow", level: 2, sets: 1, reps: "6" },
                { ex: "facepull", level: 2, sets: 2, reps: "12" }
              ],
              prehab: [
                { ex: "wristext", level: 2, sets: 2, reps: "12" }
              ],
              main: [
                { ex: "vpush", level: 3, sets: 3, reps: "4–5", rest: "2 min" },
                { ex: "hpull", level: 3, sets: 4, reps: "5", rest: "2 min" },
                { ex: "hpush", level: 2, sets: 3, reps: "6", rest: "90 s" },
                { ex: "pallof", level: 2, sets: 3, reps: "8 / side" }
              ],
              cooldown: [
                { ex: "pecstretch", level: 1, sets: 1, reps: "30 s" },
                { ex: "breath", level: 1, sets: 1, reps: "2 min" }
              ]
            }
          ]
        },
        {
          name: "Phase 3 — Peak & taper",
          weeks: "7–8",
          focus: "Sharpen and freshen. Keep intensity high but cut volume hard so fatigue clears and your power peaks — ideal to line up before a season, test, or event.",
          scheme: { intensity: "High but low-volume", sets: "2–3", reps: "2–4 (power) · 2–3 (strength)", rest: "full (3 min+)", tempo: "fast" },
          progression: "Every rep is crisp and fast. Reduce total sets ~40–50% versus phase 2. Stop while you feel springy — never chase fatigue this close to peak.",
          workouts: [
            {
              name: "Peak — Lower & jumps",
              warmup: [
                { ex: "legswing", level: 1, sets: 1, reps: "8 / direction" },
                { ex: "glutebridge", level: 2, sets: 2, reps: "6 / side" }
              ],
              prehab: [
                { ex: "calf", level: 1, sets: 2, reps: "10 / side" }
              ],
              main: [
                { ex: "jump", level: 3, sets: 3, reps: "3", rest: "3 min", note: "Low-box depth jumps — fast rebound, only if springy." },
                { ex: "squat", level: 4, sets: 2, reps: "2–3", rest: "3–4 min" },
                { ex: "swing", level: 2, sets: 3, reps: "5", rest: "2 min" }
              ],
              cooldown: [
                { ex: "couch", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "breath", level: 1, sets: 1, reps: "2–3 min" }
              ]
            },
            {
              name: "Peak — Upper & throws",
              warmup: [
                { ex: "inchworm", level: 1, sets: 1, reps: "4" },
                { ex: "facepull", level: 2, sets: 2, reps: "12" }
              ],
              prehab: [
                { ex: "extrot", level: 1, sets: 2, reps: "12" }
              ],
              main: [
                { ex: "mbslam", level: 1, sets: 3, reps: "4", rest: "2 min" },
                { ex: "hpush", level: 3, sets: 2, reps: "2–3", rest: "3 min" },
                { ex: "vpull", level: 4, sets: 2, reps: "2–3", rest: "3 min" }
              ],
              cooldown: [
                { ex: "pecstretch", level: 1, sets: 1, reps: "30 s" },
                { ex: "breath", level: 1, sets: 1, reps: "2–3 min" }
              ]
            }
          ]
        }
      ]
    },

    /* =================================================================
       4) LEAN & CONDITIONED (metabolic)
       ================================================================= */
    {
      id: "lean-conditioned",
      title: "Lean & Conditioned",
      tagline: "Build a fitter engine and keep your muscle while you lean out.",
      goal: "conditioning",
      level: "intermediate",
      weeks: 6,
      daysPerWeek: 4,
      sessionMinutes: 45,
      equipment: "Dumbbells or kettlebells, a bit of floor space, and a cardio option (bike, rower, or just your bodyweight). A jump rope is a bonus.",
      equipmentTier: "minimal",
      tier: "essential",
      audience: "Early-to-mid-intermediate exercisers who want to improve conditioning and body composition while keeping the strength they've built. Great as a 'get fitter and leaner' block between strength phases.",
      description:
        "A six-week conditioning block that trains your heart and your muscles together. You'll lift with short rests to keep the intensity up, build an aerobic base with steady cardio, and sprinkle in intervals that raise your ceiling. Keeping some real strength work in the plan is deliberate — it's what protects your muscle while you're eating a bit less and moving a lot. Four efficient sessions a week, each under an hour, alternating strength-circuit days with conditioning days.",
      justification: [
        { plain: "Keeping heavy-ish resistance training in a fat-loss or conditioning block is what preserves muscle while you lose weight. Cardio alone tends to give up more muscle; lifting protects it.",
          cite: "Garber CE, et al. ACSM position stand: Quantity and Quality of Exercise. Med Sci Sports Exerc. 2011." },
        { plain: "Mixing steady 'Zone 2' work with harder intervals builds both a big aerobic base and a high ceiling. Interval training is a time-efficient way to boost cardiorespiratory fitness.",
          cite: "Milanović Z, Sporiš G, Weston M. Effectiveness of HIIT vs. continuous endurance training for VO2max: a meta-analysis. Sports Med. 2015." },
        { plain: "Circuit-style resistance training with short rests keeps your heart rate up and gives a real conditioning stimulus while still training strength, making each session do double duty.",
          cite: "Alcaraz PE, et al. Physical performance and cardiovascular responses to an acute bout of heavy resistance circuit training. J Strength Cond Res. 2008." },
        { plain: "We keep total hard training sane and include easy days. Managing how fast you ramp training load is one of the clearest ways to stay healthy while pushing conditioning.",
          cite: "Gabbett TJ. The training–injury prevention paradox. Br J Sports Med. 2016." }
      ],
      howto: [
        { name: "Circuit / superset", text: "Move through the listed exercises with short rests, doing one round then repeating. It keeps the heart rate elevated so you get strength and conditioning at once." },
        { name: "Zone 2 (easy cardio)", text: "A conversational pace — you can talk but not sing. It feels almost too easy, and that's the point: it builds your aerobic engine and helps recovery." },
        { name: "Intervals (work:rest)", text: "'1:1' means the hard effort and the rest are equal in length (e.g. 1 min hard / 1 min easy). Bigger rest ratios (1:3) mean shorter, harder sprints with longer recovery." },
        { name: "EMOM / AMRAP", text: "EMOM = 'every minute on the minute' — start a set each minute and rest whatever's left. AMRAP = 'as many rounds as possible' in a time cap. Both keep intensity honest — but always keep form clean." },
        { name: "Strength stays heavy-ish", text: "On strength moves, still pick a load that's challenging for the listed reps. Preserving strength is the whole reason it's in a conditioning block — don't turn everything into light cardio." }
      ],
      phases: [
        {
          name: "Phase 1 — Base & capacity",
          weeks: "1–2",
          focus: "Build an aerobic base and re-groove circuits with moderate loads and honest but sub-maximal effort. Lay the engine down before turning up the intensity.",
          scheme: { intensity: "Moderate", sets: "3 rounds", reps: "10–15 (circuit) · 20–30 min Zone 2", rest: "short (30–45 s)", tempo: "2-0-1" },
          progression: "Add a round or trim rest slightly across the two weeks. Extend Zone 2 by a few minutes as it gets easier.",
          workouts: [
            {
              name: "Day 1 — Full-body strength circuit",
              warmup: [
                { ex: "catcow", level: 1, sets: 1, reps: "6" },
                { ex: "glutebridge", level: 1, sets: 2, reps: "10" },
                { ex: "inchworm", level: 1, sets: 1, reps: "5" }
              ],
              prehab: [
                { ex: "facepull", level: 1, sets: 2, reps: "15" }
              ],
              main: [
                { ex: "squat", level: 2, sets: 3, reps: "12", rest: "30 s", note: "Circuit: move through all four, then repeat." },
                { ex: "hpush", level: 1, sets: 3, reps: "10–12", rest: "30 s" },
                { ex: "hpull", level: 2, sets: 3, reps: "12", rest: "30 s" },
                { ex: "carry", level: 0, sets: 3, reps: "40 m" }
              ],
              cooldown: [
                { ex: "hammy", level: 0, sets: 1, reps: "40 s / side" },
                { ex: "breath", level: 0, sets: 1, reps: "2 min" }
              ]
            },
            {
              name: "Day 2 — Zone 2 aerobic base",
              warmup: [
                { ex: "legswing", level: 1, sets: 1, reps: "10 / direction" }
              ],
              prehab: [
                { ex: "calf", level: 1, sets: 2, reps: "15 / side" }
              ],
              main: [
                { ex: "intervals", level: 0, sets: 1, reps: "20–30 min", note: "Easy, conversational pace — build the engine." }
              ],
              cooldown: [
                { ex: "couch", level: 0, sets: 1, reps: "45 s / side" },
                { ex: "pigeon", level: 0, sets: 1, reps: "40 s / side" }
              ]
            },
            {
              name: "Day 3 — Lower & core circuit",
              warmup: [
                { ex: "glutebridge", level: 1, sets: 2, reps: "10" },
                { ex: "wgs", level: 1, sets: 1, reps: "4 / side" }
              ],
              prehab: [
                { ex: "nordic", level: 0, sets: 2, reps: "8" }
              ],
              main: [
                { ex: "hinge", level: 1, sets: 3, reps: "12", rest: "30 s", note: "Circuit." },
                { ex: "splitsquat", level: 1, sets: 3, reps: "10 / leg", rest: "30 s" },
                { ex: "swing", level: 1, sets: 3, reps: "15", rest: "40 s" },
                { ex: "plank", level: 1, sets: 3, reps: "30 s" }
              ],
              cooldown: [
                { ex: "pigeon", level: 0, sets: 1, reps: "45 s / side" },
                { ex: "breath", level: 0, sets: 1, reps: "2 min" }
              ]
            },
            {
              name: "Day 4 — Easy intervals",
              warmup: [
                { ex: "legswing", level: 1, sets: 1, reps: "10 / direction" }
              ],
              prehab: [
                { ex: "extrot", level: 1, sets: 2, reps: "15" }
              ],
              main: [
                { ex: "intervals", level: 1, sets: 8, reps: "1 min hard / 1 min easy", note: "1:1 intervals — hard should be genuinely hard but repeatable." }
              ],
              cooldown: [
                { ex: "hammy", level: 0, sets: 1, reps: "40 s / side" },
                { ex: "breath", level: 1, sets: 1, reps: "2–3 min" }
              ]
            }
          ]
        },
        {
          name: "Phase 2 — Intensity",
          weeks: "3–4",
          focus: "Turn up the dial. Circuits get denser, intervals get sharper, and strength stays heavy-ish to hold onto muscle.",
          scheme: { intensity: "Moderate–high", sets: "3–4 rounds", reps: "8–12 (circuit) · sprint intervals", rest: "20–30 s (circuit)", tempo: "2-0-1" },
          progression: "Add a round or move to shorter, harder sprint intervals. Keep at least one heavier strength move per circuit day in the 6–8 range.",
          workouts: [
            {
              name: "Day 1 — Strength-biased circuit",
              warmup: [
                { ex: "catcow", level: 2, sets: 1, reps: "6" },
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" }
              ],
              prehab: [
                { ex: "facepull", level: 2, sets: 2, reps: "12" }
              ],
              main: [
                { ex: "squat", level: 3, sets: 4, reps: "6–8", rest: "45 s", note: "Heavier strength move — keep it challenging." },
                { ex: "hpush", level: 2, sets: 3, reps: "8–10", rest: "30 s" },
                { ex: "vpull", level: 2, sets: 3, reps: "8–10", rest: "30 s" },
                { ex: "carry", level: 1, sets: 3, reps: "30 m / side" }
              ],
              cooldown: [
                { ex: "pecstretch", level: 1, sets: 1, reps: "30 s" },
                { ex: "breath", level: 1, sets: 1, reps: "2 min" }
              ]
            },
            {
              name: "Day 2 — Sprint intervals",
              warmup: [
                { ex: "legswing", level: 1, sets: 1, reps: "10 / direction" },
                { ex: "inchworm", level: 1, sets: 1, reps: "5" }
              ],
              prehab: [
                { ex: "calf", level: 2, sets: 2, reps: "12 / side" }
              ],
              main: [
                { ex: "intervals", level: 2, sets: 10, reps: "20 s sprint / 60 s easy", note: "1:3 sprints — near-max effort, long recovery." }
              ],
              cooldown: [
                { ex: "couch", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "breath", level: 1, sets: 1, reps: "2–3 min" }
              ]
            },
            {
              name: "Day 3 — Density circuit",
              warmup: [
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" },
                { ex: "wgs", level: 1, sets: 1, reps: "4 / side" }
              ],
              prehab: [
                { ex: "pallof", level: 1, sets: 2, reps: "10 / side" }
              ],
              main: [
                { ex: "hinge", level: 2, sets: 4, reps: "8", rest: "30 s", note: "Density: fixed reps, minimal rest, beat last week's rounds." },
                { ex: "splitsquat", level: 2, sets: 3, reps: "8 / leg", rest: "20 s" },
                { ex: "swing", level: 2, sets: 4, reps: "12", rest: "30 s" },
                { ex: "circuit", level: 1, sets: 1, reps: "6–8 min finisher", note: "Optional bodyweight density finisher." }
              ],
              cooldown: [
                { ex: "pigeon", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "breath", level: 1, sets: 1, reps: "2 min" }
              ]
            },
            {
              name: "Day 4 — Zone 2 recovery",
              warmup: [
                { ex: "catcow", level: 1, sets: 1, reps: "6" }
              ],
              prehab: [
                { ex: "extrot", level: 1, sets: 2, reps: "15" },
                { ex: "wristext", level: 1, sets: 2, reps: "15" }
              ],
              main: [
                { ex: "intervals", level: 0, sets: 1, reps: "25–35 min easy", note: "Flush the legs, build the base, aid recovery." }
              ],
              cooldown: [
                { ex: "hammy", level: 1, sets: 1, reps: "40 s / side" },
                { ex: "breath", level: 1, sets: 1, reps: "2–3 min" }
              ]
            }
          ]
        },
        {
          name: "Phase 3 — Peak & recover",
          weeks: "5–6",
          focus: "Week 5 is your hardest conditioning week; week 6 backs off so you finish fit and fresh rather than fried.",
          scheme: { intensity: "Wk5 high · Wk6 easy", sets: "Wk5: 4 · Wk6: 2", reps: "AMRAP/EMOM (Wk5) · easy (Wk6)", rest: "minimal (Wk5)", tempo: "2-0-1" },
          progression: "Week 5: push the finishers and intervals; log your rounds/times to see progress. Week 6: cut volume in half, keep it light and smooth, and retest an interval or circuit at the end.",
          workouts: [
            {
              name: "Peak — Full-body EMOM",
              warmup: [
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" },
                { ex: "inchworm", level: 2, sets: 1, reps: "5" }
              ],
              prehab: [
                { ex: "facepull", level: 2, sets: 2, reps: "12" }
              ],
              main: [
                { ex: "swing", level: 2, sets: 4, reps: "EMOM 12", rest: "rest of minute", note: "Every minute: 12 swings, rest the remainder." },
                { ex: "hpush", level: 2, sets: 4, reps: "AMRAP 40 s", rest: "20 s" },
                { ex: "squat", level: 2, sets: 4, reps: "AMRAP 40 s", rest: "20 s" },
                { ex: "plank", level: 2, sets: 3, reps: "40 s" }
              ],
              cooldown: [
                { ex: "pigeon", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "breath", level: 1, sets: 1, reps: "2–3 min" }
              ]
            },
            {
              name: "Peak — Interval test",
              warmup: [
                { ex: "legswing", level: 1, sets: 1, reps: "10 / direction" }
              ],
              prehab: [
                { ex: "calf", level: 1, sets: 2, reps: "12 / side" }
              ],
              main: [
                { ex: "intervals", level: 2, sets: 6, reps: "30 s hard / 90 s easy", note: "Week 5: push. Week 6: do half the sets, easy." }
              ],
              cooldown: [
                { ex: "couch", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "breath", level: 1, sets: 1, reps: "3 min" }
              ]
            }
          ]
        }
      ]
    },

    /* =================================================================
       5) BUILD MUSCLE (hypertrophy)
       ================================================================= */
    {
      id: "build-muscle",
      title: "Build Muscle",
      tagline: "An eight-week hypertrophy block to add lean, usable size.",
      goal: "hypertrophy",
      level: "intermediate",
      weeks: 8,
      daysPerWeek: 4,
      sessionMinutes: 60,
      equipment: "Dumbbells (a range of weights) or a gym, a bench, and a pull-up bar or band.",
      equipmentTier: "gym",
      tier: "complete",
      audience: "Intermediate lifters who already train the basic patterns and want a structured, higher-volume plan to build muscle without guesswork.",
      description:
        "Muscle grows when you give it enough hard, challenging work and then feed and rest it. This block does exactly that. It's split into an upper-body day and a lower-body day, each hit twice a week, and it climbs through three phases: first you pile up quality volume, then you push a bit heavier to add tension, then you peak and deload so your body can turn all that work into size. You'll train close to — but not quite to — failure, in rep ranges built for growth, with the prehab and mobility that keep you in the game.",
      justification: [
        { plain: "Total hard sets — your 'volume' — is one of the biggest levers for muscle growth. More weekly sets per muscle generally means more growth, up to a sensible point, which is why volume climbs early in the plan.",
          cite: "Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and muscle hypertrophy. J Sports Sci. 2017." },
        { plain: "Muscle responds to a range of rep counts as long as sets are taken close to failure. We mostly live in the 8–15 range with 1–3 reps left in reserve, which balances growth with manageable fatigue.",
          cite: "Schoenfeld BJ, et al. Effects of low- vs. high-load resistance training on muscle strength and hypertrophy. J Strength Cond Res. 2015." },
        { plain: "Training each muscle about twice a week, rather than once, lets you accumulate more quality volume with better form, which supports more growth.",
          cite: "Schoenfeld BJ, Ogborn D, Krieger JW. Effects of resistance training frequency on measures of muscle hypertrophy: a meta-analysis. Sports Med. 2016." },
        { plain: "On your big lifts we keep rests a bit longer (about 2 minutes). For trained lifters, that preserves the load and reps you can do across sets, which drives more growth than very short rests.",
          cite: "Schoenfeld BJ, et al. Longer inter-set rest periods enhance muscle strength and hypertrophy in resistance-trained men. J Strength Cond Res. 2016." }
      ],
      howto: [
        { name: "Reps in reserve (RIR)", text: "Stop most sets with 1–3 reps still in the tank. That's close enough to failure to grow, without wrecking your form or recovery. On the last set of an exercise you can push to 0–1 RIR." },
        { name: "Volume", text: "The total number of hard working sets you do for a muscle each week. It's the main dial we turn up to drive growth — but only as fast as you can recover from it." },
        { name: "Tempo for growth", text: "Control the lowering (the 3 in 3-0-1) and feel the target muscle work. Slow, deliberate reps create more useful tension than fast, bouncy ones." },
        { name: "Progressive overload", text: "Beat last week a little: add a rep, a small load, or a set. When a lift feels easy at the top of its rep range on every set, add weight and drop back down the range." },
        { name: "Fuel & sleep", text: "Growth needs raw materials. Eat enough total food with plenty of protein (roughly 1.6–2.2 g per kg of bodyweight daily) and sleep well — the training is only half the job." }
      ],
      phases: [
        {
          name: "Phase 1 — Volume accumulation",
          weeks: "1–3",
          focus: "Build a big base of quality sets in higher rep ranges with short-to-moderate rests. Chase a strong muscle 'pump' and clean form.",
          scheme: { intensity: "Moderate (2–3 RIR)", sets: "3", reps: "10–15", rest: "60–90 s", tempo: "3-0-1" },
          progression: "Add reps within the range each week; when you top the range on all sets, add a little load. Add one set to a lagging muscle in week 3 if you're recovering well.",
          workouts: [
            {
              name: "Upper A — Push emphasis",
              warmup: [
                { ex: "catcow", level: 1, sets: 1, reps: "6" },
                { ex: "dislocate", level: 1, sets: 2, reps: "10" },
                { ex: "facepull", level: 1, sets: 2, reps: "15" }
              ],
              prehab: [
                { ex: "extrot", level: 1, sets: 2, reps: "15" }
              ],
              main: [
                { ex: "hpush", level: 2, sets: 3, reps: "10–12", rest: "90 s" },
                { ex: "vpush", level: 2, sets: 3, reps: "10–12", rest: "75 s" },
                { ex: "hpull", level: 2, sets: 3, reps: "12–15", rest: "75 s" },
                { ex: "vpull", level: 1, sets: 3, reps: "10–12", rest: "90 s" },
                { ex: "carry", level: 0, sets: 3, reps: "40 m" }
              ],
              cooldown: [
                { ex: "pecstretch", level: 1, sets: 1, reps: "30 s / side" },
                { ex: "childs", level: 1, sets: 1, reps: "45 s" }
              ]
            },
            {
              name: "Lower A — Squat emphasis",
              warmup: [
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" },
                { ex: "ankle", level: 1, sets: 1, reps: "8 / side" },
                { ex: "wgs", level: 1, sets: 1, reps: "4 / side" }
              ],
              prehab: [
                { ex: "calf", level: 2, sets: 3, reps: "12 / side" }
              ],
              main: [
                { ex: "squat", level: 2, sets: 3, reps: "10–12", rest: "90 s" },
                { ex: "hipthrust", level: 2, sets: 3, reps: "12–15", rest: "75 s" },
                { ex: "splitsquat", level: 2, sets: 3, reps: "10 / leg", rest: "75 s" },
                { ex: "hollow", level: 0, sets: 3, reps: "20–30 s" }
              ],
              cooldown: [
                { ex: "couch", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "hammy", level: 1, sets: 1, reps: "40 s / side" }
              ]
            }
          ]
        },
        {
          name: "Phase 2 — Tension & load",
          weeks: "4–6",
          focus: "Nudge loads up and reps down into the 8–10 range on the main lifts, with slightly longer rests, while keeping a couple of higher-rep 'pump' moves.",
          scheme: { intensity: "Higher (1–2 RIR)", sets: "3–4", reps: "8–10 (mains) · 12–15 (pump)", rest: "90 s–2 min", tempo: "3-1-1" },
          progression: "Add load on the mains while holding 8–10 reps. Keep the last set of each exercise honest — 0–1 RIR is fine here.",
          workouts: [
            {
              name: "Upper B — Pull emphasis",
              warmup: [
                { ex: "dislocate", level: 2, sets: 2, reps: "10" },
                { ex: "facepull", level: 2, sets: 2, reps: "15" }
              ],
              prehab: [
                { ex: "extrot", level: 2, sets: 2, reps: "12" },
                { ex: "wristext", level: 2, sets: 2, reps: "12" }
              ],
              main: [
                { ex: "vpull", level: 3, sets: 4, reps: "8–10", rest: "2 min" },
                { ex: "hpull", level: 3, sets: 3, reps: "8–10", rest: "90 s" },
                { ex: "vpush", level: 3, sets: 3, reps: "8–10", rest: "90 s" },
                { ex: "hpush", level: 2, sets: 3, reps: "12–15", rest: "75 s" }
              ],
              cooldown: [
                { ex: "childs", level: 2, sets: 1, reps: "45 s" },
                { ex: "pecstretch", level: 1, sets: 1, reps: "30 s / side" }
              ]
            },
            {
              name: "Lower B — Hinge emphasis",
              warmup: [
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" },
                { ex: "ankle", level: 2, sets: 1, reps: "8 / side" }
              ],
              prehab: [
                { ex: "nordic", level: 1, sets: 3, reps: "6" },
                { ex: "copenhagen", level: 1, sets: 2, reps: "20 s / side" }
              ],
              main: [
                { ex: "hinge", level: 2, sets: 4, reps: "8–10", rest: "2 min" },
                { ex: "hipthrust", level: 3, sets: 3, reps: "10–12", rest: "90 s" },
                { ex: "lateral", level: 2, sets: 3, reps: "8 / side", rest: "75 s" },
                { ex: "legraise", level: 1, sets: 3, reps: "10–12" }
              ],
              cooldown: [
                { ex: "pigeon", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "hammy", level: 1, sets: 1, reps: "40 s / side" }
              ]
            }
          ]
        },
        {
          name: "Phase 3 — Peak pump & deload",
          weeks: "7–8",
          focus: "Week 7 is a high-effort 'metabolite' week — a touch more volume, shorter rests, big pumps. Week 8 deloads: cut the sets roughly in half and keep it light so growth catches up.",
          scheme: { intensity: "Wk7 high · Wk8 easy", sets: "Wk7: 3–4 · Wk8: 2", reps: "12–20 (Wk7) · 10 easy (Wk8)", rest: "45–60 s (Wk7)", tempo: "2-0-1" },
          progression: "Week 7: chase reps and a strong pump, short rests. Week 8: light and smooth, leave the gym fresh. Take progress photos or measurements at the end.",
          workouts: [
            {
              name: "Full-body pump A",
              warmup: [
                { ex: "catcow", level: 1, sets: 1, reps: "6" },
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" }
              ],
              prehab: [
                { ex: "facepull", level: 2, sets: 2, reps: "15" }
              ],
              main: [
                { ex: "squat", level: 2, sets: 3, reps: "15–20", rest: "45 s" },
                { ex: "hpush", level: 2, sets: 3, reps: "15", rest: "45 s" },
                { ex: "hpull", level: 2, sets: 3, reps: "15", rest: "45 s" },
                { ex: "hollow", level: 1, sets: 3, reps: "30 s" }
              ],
              cooldown: [
                { ex: "childs", level: 1, sets: 1, reps: "45 s" },
                { ex: "breath", level: 1, sets: 1, reps: "2 min" }
              ]
            },
            {
              name: "Full-body pump B",
              warmup: [
                { ex: "dislocate", level: 1, sets: 2, reps: "10" },
                { ex: "ankle", level: 1, sets: 1, reps: "8 / side" }
              ],
              prehab: [
                { ex: "extrot", level: 1, sets: 2, reps: "15" }
              ],
              main: [
                { ex: "hipthrust", level: 2, sets: 3, reps: "15–20", rest: "45 s" },
                { ex: "vpull", level: 1, sets: 3, reps: "12–15", rest: "45 s" },
                { ex: "vpush", level: 2, sets: 3, reps: "12–15", rest: "45 s" },
                { ex: "lateral", level: 1, sets: 3, reps: "10 / side" }
              ],
              cooldown: [
                { ex: "pigeon", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "breath", level: 1, sets: 1, reps: "2 min" }
              ]
            }
          ]
        }
      ]
    },

    /* =================================================================
       6) HOME MINIMALIST STRENGTH
       ================================================================= */
    {
      id: "home-minimalist",
      title: "Home Minimalist Strength",
      tagline: "Get strong at home with a band, a bench and one pair of dumbbells.",
      goal: "strength",
      level: "beginner",
      weeks: 6,
      daysPerWeek: 3,
      sessionMinutes: 40,
      equipment: "One resistance band, one pair of dumbbells (or a loaded backpack), and a sturdy chair, bench or step. That's it.",
      equipmentTier: "minimal",
      tier: "essential",
      audience: "Anyone training at home or travelling with almost no gear, who still wants a real, progressive full-body strength plan — not a random circuit.",
      description:
        "You don't need a gym to get stronger — you need a plan and a way to keep making things harder. This six-week program uses just a band, a pair of dumbbells and something to sit on, and it still progresses properly: first you build a base, then you make each move tougher by slowing it down, adding reps, and stepping up to harder variations. Three efficient full-body sessions a week, each with a warm-up, joint-care work, the main lifts and a cool-down.",
      justification: [
        { plain: "You don't need heavy machines to build strength — you need enough challenge. With limited weight, we create it by using harder exercise variations, slower tempos and higher reps taken close to failure, which grows strength and muscle much like heavy loads do.",
          cite: "Schoenfeld BJ, et al. Effects of low- vs. high-load resistance training on muscle strength and hypertrophy in well-trained men. J Strength Cond Res. 2015." },
        { plain: "Progressive overload still rules at home: because you can't always add weight, you add reps, sets, range or difficulty instead. That planned 'a little more' is what keeps you adapting.",
          cite: "American College of Sports Medicine. Progression Models in Resistance Training for Healthy Adults. Med Sci Sports Exerc. 2009." },
        { plain: "Full-body sessions three times a week hit each muscle often enough to progress, and fit real life better than long gym splits — which matters, because the plan you actually finish is the one that works.",
          cite: "Schoenfeld BJ, Grgic J, Krieger J. How many times per week should a muscle be trained? A meta-analysis. J Sports Sci. 2019." }
      ],
      howto: [
        { name: "Making it harder without more weight", text: "Use the ◀ / ▶ buttons to pick a tougher variation (e.g. push-up → harder angle → one-arm progressions), slow the lowering, add reps, or shorten your rest. Any of these overloads the muscle." },
        { name: "Tempo", text: "3-0-1 means 3 seconds down, no pause, 1 second up. With light weights, slowing the lowering is your best friend — it makes an easy load feel much harder." },
        { name: "RIR (reps in reserve)", text: "Stop with 1–3 solid reps left. With bodyweight and bands you can safely push the last set close to failure to make up for the lighter load." },
        { name: "Bands", text: "Resistance grows as the band stretches, so the top of each rep is hardest. Anchor it safely (a closed door, a rack, under your feet) and control the return — don't let it snap back." }
      ],
      phases: [
        {
          name: "Phase 1 — Build the base",
          weeks: "1–3",
          focus: "Learn the variations and build capacity with moderate reps and full control. Keep 2–3 reps in reserve.",
          scheme: { intensity: "Moderate", sets: "2–3", reps: "10–15", rest: "60–75 s", tempo: "3-0-1" },
          progression: "Add reps weekly; when a move feels easy at the top of the range, step up one level with ▶ or slow the tempo further.",
          workouts: [
            {
              name: "Day 1 — Full body A",
              warmup: [
                { ex: "catcow", level: 1, sets: 1, reps: "6" },
                { ex: "glutebridge", level: 1, sets: 2, reps: "10" },
                { ex: "dislocate", level: 0, sets: 2, reps: "10" }
              ],
              prehab: [
                { ex: "facepull", level: 0, sets: 2, reps: "15" }
              ],
              main: [
                { ex: "squat", level: 2, sets: 3, reps: "12–15", rest: "75 s" },
                { ex: "hpush", level: 1, sets: 3, reps: "8–12", rest: "60 s" },
                { ex: "hpull", level: 0, sets: 3, reps: "12–15", rest: "60 s" },
                { ex: "plank", level: 1, sets: 2, reps: "20–30 s" }
              ],
              cooldown: [
                { ex: "couch", level: 0, sets: 1, reps: "40 s / side" },
                { ex: "childs", level: 1, sets: 1, reps: "45 s" }
              ]
            },
            {
              name: "Day 2 — Full body B",
              warmup: [
                { ex: "legswing", level: 0, sets: 1, reps: "10 / direction" },
                { ex: "ankle", level: 1, sets: 1, reps: "8 / side" },
                { ex: "glutebridge", level: 1, sets: 2, reps: "8 / side" }
              ],
              prehab: [
                { ex: "extrot", level: 1, sets: 2, reps: "15" }
              ],
              main: [
                { ex: "hinge", level: 2, sets: 3, reps: "12", rest: "75 s" },
                { ex: "vpush", level: 1, sets: 3, reps: "8–10", rest: "60 s" },
                { ex: "splitsquat", level: 1, sets: 3, reps: "8 / leg", rest: "60 s" },
                { ex: "birddog", level: 1, sets: 2, reps: "8 / side" }
              ],
              cooldown: [
                { ex: "hammy", level: 0, sets: 1, reps: "40 s / side" },
                { ex: "pecstretch", level: 0, sets: 1, reps: "30 s / side" }
              ]
            },
            {
              name: "Day 3 — Full body C",
              warmup: [
                { ex: "catcow", level: 1, sets: 1, reps: "6" },
                { ex: "wgs", level: 1, sets: 1, reps: "4 / side" }
              ],
              prehab: [
                { ex: "calf", level: 1, sets: 2, reps: "15 / side" }
              ],
              main: [
                { ex: "hipthrust", level: 1, sets: 3, reps: "15", rest: "60 s" },
                { ex: "hpull", level: 0, sets: 3, reps: "15", rest: "60 s" },
                { ex: "hpush", level: 0, sets: 3, reps: "12–15", rest: "60 s" },
                { ex: "carry", level: 0, sets: 3, reps: "40 m" }
              ],
              cooldown: [
                { ex: "pigeon", level: 0, sets: 1, reps: "40 s / side" },
                { ex: "breath", level: 0, sets: 1, reps: "2 min" }
              ]
            }
          ]
        },
        {
          name: "Phase 2 — Overload",
          weeks: "4–6",
          focus: "Step up to harder variations and slower tempos, push closer to failure, and trim rest a little. This is where limited equipment still delivers real strength.",
          scheme: { intensity: "Challenging (1–2 RIR)", sets: "3", reps: "8–12", rest: "45–75 s", tempo: "4-0-1" },
          progression: "Each week, harder variation OR more reps OR less rest — pick one and beat last week. Retest a couple of moves (max push-ups, longest plank) at the end.",
          workouts: [
            {
              name: "Day 1 — Full body A+",
              warmup: [
                { ex: "dislocate", level: 1, sets: 2, reps: "10" },
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" }
              ],
              prehab: [
                { ex: "facepull", level: 1, sets: 2, reps: "15" }
              ],
              main: [
                { ex: "splitsquat", level: 2, sets: 3, reps: "8 / leg", rest: "60 s" },
                { ex: "hpush", level: 1, sets: 3, reps: "8–12", rest: "60 s" },
                { ex: "hpull", level: 1, sets: 3, reps: "10–12", rest: "60 s" },
                { ex: "hollow", level: 0, sets: 3, reps: "20–30 s" }
              ],
              cooldown: [
                { ex: "couch", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "childs", level: 1, sets: 1, reps: "45 s" }
              ]
            },
            {
              name: "Day 2 — Full body B+",
              warmup: [
                { ex: "legswing", level: 1, sets: 1, reps: "10 / direction" },
                { ex: "ankle", level: 2, sets: 1, reps: "8 / side" }
              ],
              prehab: [
                { ex: "birddog", level: 2, sets: 2, reps: "8 / side" }
              ],
              main: [
                { ex: "hinge", level: 2, sets: 3, reps: "10", rest: "75 s" },
                { ex: "vpush", level: 2, sets: 3, reps: "8–10", rest: "60 s" },
                { ex: "lateral", level: 1, sets: 3, reps: "8 / side", rest: "60 s" },
                { ex: "sideplank", level: 1, sets: 2, reps: "25–30 s / side" }
              ],
              cooldown: [
                { ex: "hammy", level: 1, sets: 1, reps: "40 s / side" },
                { ex: "pecstretch", level: 1, sets: 1, reps: "30 s / side" }
              ]
            },
            {
              name: "Day 3 — Full body C+",
              warmup: [
                { ex: "catcow", level: 2, sets: 1, reps: "6" },
                { ex: "glutebridge", level: 2, sets: 2, reps: "8 / side" }
              ],
              prehab: [
                { ex: "calf", level: 2, sets: 3, reps: "12 / side" }
              ],
              main: [
                { ex: "hipthrust", level: 2, sets: 3, reps: "12", rest: "60 s" },
                { ex: "vpull", level: 1, sets: 3, reps: "8–10", rest: "75 s" },
                { ex: "hpush", level: 1, sets: 3, reps: "10–12", rest: "60 s" },
                { ex: "carry", level: 1, sets: 3, reps: "30 m / side" }
              ],
              cooldown: [
                { ex: "pigeon", level: 1, sets: 1, reps: "45 s / side" },
                { ex: "breath", level: 1, sets: 1, reps: "2 min" }
              ]
            }
          ]
        }
      ]
    },

    /* =================================================================
       7) MOBILITY & LONGEVITY
       ================================================================= */
    {
      id: "mobility-longevity",
      title: "Mobility & Longevity",
      tagline: "Move better, feel looser, and keep your joints happy for the long haul.",
      goal: "mobility",
      level: "beginner",
      weeks: 4,
      daysPerWeek: 3,
      sessionMinutes: 30,
      equipment: "Just your bodyweight and a resistance band. A mat is nice to have.",
      equipmentTier: "minimal",
      tier: "essential",
      audience: "Anyone who sits a lot, feels stiff, is easing back in after time off, or wants a gentle plan to build usable range of motion and joint control alongside their main training.",
      description:
        "Flexibility is being able to reach a position; mobility is being strong and in control there — and control is what protects you. This four-week plan blends gentle mobility flows with light strength through a full range of motion and targeted joint care. It's low-intensity by design: something you can do on rest days, in the morning, or as a warm-up habit. Three short sessions a week, each with a gentle warm-up, joint-care work, the main mobility-and-control block, and a relaxing cool-down.",
      justification: [
        { plain: "Training strength through a full range of motion improves flexibility about as well as stretching does — with the bonus that you also get stronger and more controlled in those end ranges.",
          cite: "Afonso J, et al. Strength training versus stretching for improving range of motion: a systematic review and meta-analysis. Healthcare. 2021." },
        { plain: "It's not just about being bendy — being strong near your end range is what makes new mobility stick and helps protect the joint. So we load the stretched positions, not just hold them.",
          cite: "O'Sullivan K, McAuliffe S, DeBurca N. The effects of eccentric training on lower-limb flexibility: a systematic review. Br J Sports Med. 2012." },
        { plain: "Regular mobility and light resistance work supports joint health and everyday function, and helps you keep moving well as you age — a core reason to include it every week.",
          cite: "Garber CE, et al. ACSM position stand: Quantity and Quality of Exercise, including flexibility and neuromotor work. Med Sci Sports Exerc. 2011." }
      ],
      howto: [
        { name: "Mobility vs. flexibility", text: "Flexibility is passive range (how far you can be moved into a stretch). Mobility is active control of that range. This plan trains control, so the range you gain is range you can actually use." },
        { name: "Move slowly, breathe", text: "Mobility work responds to calm, controlled effort. Move slowly, breathe out as you deepen a position, and never push into sharp pain — mild tension is the target." },
        { name: "End-range holds", text: "When a move says to pause at the hardest point, that brief hold under tension is what teaches your body to own the new range. A few seconds is plenty." },
        { name: "Consistency over intensity", text: "Little and often beats occasional and hard. Doing these short sessions regularly is what changes how you move — no single session needs to be tough." }
      ],
      phases: [
        {
          name: "Phase 1 — Open & control",
          weeks: "1–2",
          focus: "Restore range in the big stiff areas — hips, ankles, mid-back and shoulders — and start adding gentle control at end range.",
          scheme: { intensity: "Gentle", sets: "2", reps: "6–10 slow reps / 30–45 s holds", rest: "as needed", tempo: "slow" },
          progression: "Ease a little deeper each session as it opens up. Add a second round when a flow feels easy.",
          workouts: [
            {
              name: "Session A — Hips & lower body",
              warmup: [
                { ex: "catcow", level: 1, sets: 1, reps: "8 slow" },
                { ex: "legswing", level: 0, sets: 1, reps: "10 / direction" }
              ],
              prehab: [
                { ex: "glutebridge", level: 1, sets: 2, reps: "10" },
                { ex: "calf", level: 1, sets: 2, reps: "12 / side" }
              ],
              main: [
                { ex: "ankle", level: 1, sets: 2, reps: "8 / side", note: "Pause 2 s at the deepest point." },
                { ex: "lateral", level: 1, sets: 2, reps: "6 / side", tempo: "slow", note: "Sit into each hip slowly for range." },
                { ex: "slrdl", level: 0, sets: 2, reps: "6 / leg", note: "Control the hinge — this is balance + hamstring range." },
                { ex: "hipthrust", level: 0, sets: 2, reps: "10", note: "Pause and squeeze at the top." }
              ],
              cooldown: [
                { ex: "pigeon", level: 0, sets: 1, reps: "45 s / side" },
                { ex: "couch", level: 0, sets: 1, reps: "45 s / side" }
              ]
            },
            {
              name: "Session B — Spine & shoulders",
              warmup: [
                { ex: "catcow", level: 2, sets: 1, reps: "8" },
                { ex: "wgs", level: 1, sets: 1, reps: "4 / side" }
              ],
              prehab: [
                { ex: "facepull", level: 0, sets: 2, reps: "15" },
                { ex: "extrot", level: 1, sets: 2, reps: "12" }
              ],
              main: [
                { ex: "tspine", level: 1, sets: 2, reps: "8 / side", note: "Open slowly, follow your hand with your eyes." },
                { ex: "dislocate", level: 1, sets: 2, reps: "8", note: "Wide grip — never force it." },
                { ex: "birddog", level: 1, sets: 2, reps: "8 / side", note: "Reach long for control, not speed." },
                { ex: "vpull", level: 0, sets: 2, reps: "10", note: "Light — feel the full stretch and pull." }
              ],
              cooldown: [
                { ex: "childs", level: 2, sets: 1, reps: "45–60 s" },
                { ex: "pecstretch", level: 1, sets: 1, reps: "30 s / side" }
              ]
            }
          ]
        },
        {
          name: "Phase 2 — Strengthen the range",
          weeks: "3–4",
          focus: "Add a little load and longer holds to lock in the new range so it lasts. Slightly deeper positions with real control.",
          scheme: { intensity: "Gentle–moderate", sets: "2–3", reps: "8–10 / 45–60 s holds", rest: "as needed", tempo: "slow + pause" },
          progression: "Add a light load, a deeper position, or a longer end-range pause. Keep it controlled and pain-free.",
          workouts: [
            {
              name: "Session A+ — Loaded lower mobility",
              warmup: [
                { ex: "legswing", level: 1, sets: 1, reps: "10 / direction" },
                { ex: "ankle", level: 2, sets: 1, reps: "8 / side" }
              ],
              prehab: [
                { ex: "copenhagen", level: 0, sets: 2, reps: "20 s / side" },
                { ex: "calf", level: 2, sets: 2, reps: "12 / side" }
              ],
              main: [
                { ex: "squat", level: 1, sets: 3, reps: "8", tempo: "4-2-1", note: "Slow, deep, paused at the bottom for control." },
                { ex: "lateral", level: 2, sets: 2, reps: "6 / side", note: "Cossack — sink deeper as you warm up." },
                { ex: "slrdl", level: 1, sets: 2, reps: "8 / leg" },
                { ex: "hollow", level: 0, sets: 2, reps: "20 s" }
              ],
              cooldown: [
                { ex: "pigeon", level: 1, sets: 1, reps: "60 s / side" },
                { ex: "hammy", level: 0, sets: 1, reps: "45 s / side" }
              ]
            },
            {
              name: "Session B+ — Loaded upper mobility",
              warmup: [
                { ex: "catcow", level: 2, sets: 1, reps: "8" },
                { ex: "dislocate", level: 2, sets: 2, reps: "8" }
              ],
              prehab: [
                { ex: "extrot", level: 2, sets: 2, reps: "12" },
                { ex: "birddog", level: 2, sets: 2, reps: "8 / side" }
              ],
              main: [
                { ex: "tspine", level: 2, sets: 2, reps: "8 / side" },
                { ex: "vpush", level: 0, sets: 2, reps: "8", tempo: "3-1-2", note: "Light overhead press for shoulder range + control." },
                { ex: "hpull", level: 0, sets: 2, reps: "12", note: "Full stretch each rep." },
                { ex: "sideplank", level: 1, sets: 2, reps: "20–30 s / side" }
              ],
              cooldown: [
                { ex: "childs", level: 2, sets: 1, reps: "60 s" },
                { ex: "breath", level: 1, sets: 1, reps: "2–3 min" }
              ]
            }
          ]
        }
      ]
    }
  ];

  /* =================================================================
     SUBSCRIPTION TIERS — scale by how many programs a member can open.
     `programsIncluded` is checked by the viewer against a program's
     `tier` so higher payment unlocks more programs (+ blog & extras).
     ================================================================= */
  var TIER_RANK = { free: 0, essential: 1, complete: 2, coach: 3 };

  var TIERS = [
    {
      id: "free", name: "Free Starter", price: "$0", cadence: "forever",
      blurb: "Try the system with one full starter program and every exercise demo.",
      programsIncluded: "1 starter program",
      features: [
        "The Movement Foundations starter program",
        "Full exercise library with video demos",
        "Progressions & regressions on every move",
        "Built-in workout logger"
      ],
      product: "sub-free"
    },
    {
      id: "essential", name: "Essential", price: "$12", cadence: "/month",
      blurb: "For the committed individual — up to three programs at a time.",
      programsIncluded: "Up to 3 programs",
      features: [
        "Everything in Free",
        "Any 3 programs of your choice",
        "Swap a program once a month",
        "Progress charts & printable plans"
      ],
      product: "sub-essential", highlight: false
    },
    {
      id: "complete", name: "Complete", price: "$24", cadence: "/month",
      blurb: "The whole library plus the education hub — best value for serious trainees.",
      programsIncluded: "All programs",
      features: [
        "Everything in Essential",
        "Full program library (all goals & levels)",
        "Members' article & video library",
        "New programs added as they launch"
      ],
      product: "sub-complete", highlight: true
    },
    {
      id: "coach", name: "Coach / Pro", price: "$49", cadence: "/month",
      blurb: "For trainers who want to build programs for clients with this system.",
      programsIncluded: "All programs + coaching tools",
      features: [
        "Everything in Complete",
        "Coach dashboard & client-ready exports",
        "Priority access to new templates",
        "Discounted seat at the trainer certification seminar"
      ],
      product: "sub-coach"
    }
  ];

  window.TS_PROGRAMS = PROGRAMS;
  window.TS_TIERS = TIERS;
  window.TS_TIER_RANK = TIER_RANK;
})();
