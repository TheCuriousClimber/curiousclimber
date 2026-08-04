/* =====================================================================
   EXERCISE LIBRARY — movement families with regression/progression ladders
   ---------------------------------------------------------------------
   The heart of the training system. Every exercise is a *family*: an
   ordered ladder of variations from easiest (regression) to hardest
   (progression), the way the MBSC Certified Functional Strength Coach
   system teaches scalable difficulty. A program references a family plus
   a starting "level" (index into the ladder); the exerciser can scale up
   or down within the family without leaving the program.

   Shape of a family:
     id       unique key
     name     display name of the family / movement pattern
     section  where it usually lives: warmup | prehab | main | power |
              conditioning | cooldown
     pattern  human label for the movement bucket (Squat, Hinge, Push…)
     equipment  array of equipment tags (used for filtering)
     tempo    default tempo as "ecc-pause-con" (e.g. "3-0-1"); "—" if n/a
     cues     2–4 short coaching cues (plain language)
     levels   ORDERED ladder, easiest → hardest. Each level:
                { name, note, q }
              where q is a search phrase used to open a demonstration
              video (see DEMOS below).

   DEMOS: each level links to a YouTube search for its `q` phrase, so
   every variation always resolves to real demonstration videos with no
   dead links to maintain. To pin a specific curated video instead, give a
   level a `yt` property with a YouTube ID (e.g. yt:"dQw4w9WgXcQ") and the
   engine will link straight to it. See README.

   CURATED (`yt`) VIDEOS — EVERY variation (all 150) is pinned to a
   specific tutorial. Each level keeps its `q` phrase too, so removing a
   `yt` instantly reverts that one level to the YouTube-search fallback.
   IDs were sourced from current web search and favour reputable/
   institutional demos (NASM, Squat University, OPEX, exercise libraries)
   where available.
     VERIFICATION STATUS: this environment blocks youtube.com, so IDs
     can't be played to confirm here. A spot-check of ~10 (re-searching
     each movement and confirming the pinned ID is the video that comes
     back) found the large majority correct — usually the top result —
     with an occasional miss that was corrected. Treat the pins as
     best-effort until reviewed with YouTube access; because the `q`
     fallback is always present, deleting any wrong `yt` is a safe
     one-field fix. A sample of headline movements (see each level's
     `yt` for the rest):
     -CiWQ2IvY34 World's Greatest Stretch (Squat University)
     iKQ-DHgti20 Cat–Cow Stretch (PartnerMD)
     difYoBtZi2s Leg Swings
     RESEoAnLEmk Glute Bridge March (Exercise Library)
     b1zTCyGJXCQ Single-Leg Glute Bridge
     KRmT2td4uQA Band External Rotation (rotator cuff)
     smSSXITNpCI Band Pull-Apart
     eTCBSFlCJ_s Face Pull (NASM)
     gCESNsDsbqk Goblet Squat
     VPhhE6bBzZE Bulgarian Split Squat
     aa57T45iFSE Dumbbell Romanian Deadlift (NASM)
     Z6gcRfPNcZo Barbell Deadlift (NASM)
     J-gWN5hYwRU Dumbbell Bench Press
     WDIpL0pjun0 Push-Up (NASM)
     bj53-0DYKFo Standing Dumbbell Overhead Press
     W3fZzhw87ak Single-Arm Dumbbell Row
     aNUSgyWRJYA Pull-Ups for Beginners
     4yE-XGDWJPg Band-Assisted Pull-Ups
     wCBOqf-HrTI Forearm Plank
     lLAw6fUccKA Farmer's Carry
     29OfN4ztW_g Dumbbell Hip Thrust
     1Qi0NQW89Oc Kettlebell Swing (two-arm)
     IphGZ8OlfYg Single-Leg Calf Raise
     -rsIS-wl-ig Couch Stretch
     LVY692zJK0A Standing Hamstring Stretch
     eGqbnFII3J8 Supine Figure-4 Stretch
     CEQMx4zFwYs Doorway Pec Stretch
   ===================================================================== */
(function () {
  "use strict";

  var LIB = {

    /* ================= WARM-UP / MOBILITY ================= */
    "wgs": {
      id: "wgs", name: "World's Greatest Stretch", section: "warmup", pattern: "Mobility flow",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Move slowly and breathe", "Long spine", "Feel a stretch, never pain"],
      levels: [
        { name: "Kneeling hip-flexor rock", note: "Easiest — no floor-to-stand transition.", yt: "Q4Ko275cluo", q: "kneeling hip flexor stretch" },
        { name: "World's Greatest Stretch", note: "Lunge, elbow to instep, rotate open.", yt: "-CiWQ2IvY34", q: "worlds greatest stretch" },
        { name: "World's Greatest Stretch w/ overhead reach", note: "Add a tall reach to load the thoracic spine.", yt: "Ma2Mpin0Uow", q: "worlds greatest stretch with rotation" }
      ]
    },
    "catcow": {
      id: "catcow", name: "Cat–Cow / Spinal Waves", section: "warmup", pattern: "Spine mobility",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Move one segment at a time", "Match the breath to the motion"],
      levels: [
        { name: "Seated cat–cow", note: "Do it in a chair if the floor is hard to get to.", yt: "PMxA3xlFpAk", q: "seated cat cow stretch" },
        { name: "Quadruped cat–cow", note: "Classic on hands and knees.", yt: "iKQ-DHgti20", q: "cat cow stretch" },
        { name: "Cat–cow to child's pose flow", note: "Add a rock-back to open the hips.", yt: "GsJPpAtA2PY", q: "cat cow to childs pose flow" }
      ]
    },
    "legswing": {
      id: "legswing", name: "Dynamic Leg Swings", section: "warmup", pattern: "Dynamic mobility",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Hold something for balance", "Start small, grow the range"],
      levels: [
        { name: "Supported leg swings (front/back)", note: "Hold a wall or rack.", yt: "korxBhGzzJE", q: "leg swings warm up" },
        { name: "Front-back + side-side swings", note: "Add lateral swings for the hips.", yt: "difYoBtZi2s", q: "dynamic leg swings side to side" }
      ]
    },
    "inchworm": {
      id: "inchworm", name: "Inchworm to Plank", section: "warmup", pattern: "Full-body prep",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Keep legs as straight as comfy", "Brace the belly at the top"],
      levels: [
        { name: "Hands-elevated inchworm", note: "Walk out onto a bench or box.", yt: "I2MUFqa3p20", q: "elevated inchworm exercise" },
        { name: "Inchworm to plank", note: "Walk hands to a full plank and back.", yt: "XFnK5X8hKB0", q: "inchworm exercise" },
        { name: "Inchworm + push-up", note: "Add a push-up at the bottom.", yt: "Lao2xS3vIHk", q: "inchworm to push up" }
      ]
    },
    "glutebridge": {
      id: "glutebridge", name: "Glute Bridge (activation)", section: "warmup", pattern: "Glute activation",
      equipment: ["bodyweight"], tempo: "2-1-1",
      cues: ["Squeeze the glutes, not the low back", "Ribs down"],
      levels: [
        { name: "Two-leg glute bridge", note: "Both feet down, squeeze at the top.", yt: "XvN_Qagzs-0", q: "glute bridge exercise" },
        { name: "Glute bridge march", note: "Lift one knee at a time without dropping the hips.", yt: "RESEoAnLEmk", q: "glute bridge march" },
        { name: "Single-leg glute bridge", note: "One foot down — big step up in demand.", yt: "b1zTCyGJXCQ", q: "single leg glute bridge" }
      ]
    },

    /* ================= PREHAB / INJURY-PREVENTION ================= */
    "extrot": {
      id: "extrot", name: "Rotator-Cuff External Rotation", section: "prehab", pattern: "Shoulder health",
      equipment: ["band", "cable"], tempo: "2-0-2",
      cues: ["Elbow pinned to your side", "Rotate from the shoulder, slow and controlled"],
      levels: [
        { name: "Side-lying external rotation (no weight)", note: "Groove the pattern first.", yt: "A1_3p0U96Kk", q: "side lying external rotation" },
        { name: "Band external rotation", note: "Elbow tucked, rotate the forearm out.", yt: "KRmT2td4uQA", q: "band external rotation shoulder" },
        { name: "Cable/dumbbell external rotation", note: "Add steady load once form is clean.", yt: "LpNgc6Vx4iY", q: "cable external rotation shoulder" }
      ]
    },
    "facepull": {
      id: "facepull", name: "Face Pull", section: "prehab", pattern: "Upper-back / posture",
      equipment: ["band", "cable"], tempo: "2-1-2",
      cues: ["Pull to your eyes/forehead", "Thumbs back at the finish", "Squeeze the shoulder blades"],
      levels: [
        { name: "Band pull-apart", note: "Simplest rear-shoulder builder.", yt: "smSSXITNpCI", q: "band pull apart exercise" },
        { name: "Band face pull", note: "Anchor at head height and pull to the face.", yt: "AlTGQrDOd98", q: "band face pull" },
        { name: "Cable face pull (rope)", note: "Heavier, smoother resistance.", yt: "eTCBSFlCJ_s", q: "cable face pull rope" }
      ]
    },
    "wristext": {
      id: "wristext", name: "Wrist Extension / Reverse Curl", section: "prehab", pattern: "Elbow health",
      equipment: ["dumbbell", "band"], tempo: "3-1-3",
      cues: ["Slow lowering is the point", "Small weight, full control"],
      levels: [
        { name: "Wrist extension (no weight)", note: "Just the range of motion first.", yt: "UcwgCTkVvIQ", q: "wrist extension exercise no weight" },
        { name: "Light dumbbell wrist extension", note: "Forearm on the thigh, wrist over the knee.", yt: "la-0c4ubkvs", q: "dumbbell wrist extension" },
        { name: "Reverse (pronated) curl", note: "Loads the elbow tendons for climber's/tennis elbow.", yt: "hCMC4Vh2g_s", q: "reverse curl elbow" }
      ]
    },
    "pallof": {
      id: "pallof", name: "Pallof Press (anti-rotation)", section: "prehab", pattern: "Core / anti-rotation",
      equipment: ["band", "cable"], tempo: "2-2-2",
      cues: ["Resist the twist — don't let the band turn you", "Ribs down, glutes on"],
      levels: [
        { name: "Tall-kneeling Pallof hold", note: "Just hold and resist rotation.", yt: "y30uEJhBTwQ", q: "tall kneeling pallof press" },
        { name: "Standing Pallof press", note: "Press out and back in without rotating.", yt: "dBAmQ9bx3JA", q: "pallof press" },
        { name: "Split-stance Pallof press", note: "Narrower base raises the anti-rotation demand.", yt: "hSdbU0wj3-c", q: "split stance pallof press" }
      ]
    },
    "calf": {
      id: "calf", name: "Calf Raise", section: "prehab", pattern: "Lower-leg / Achilles",
      equipment: ["bodyweight", "dumbbell"], tempo: "2-1-3",
      cues: ["Full range — heel below the step", "Pause at the top"],
      levels: [
        { name: "Two-leg calf raise", note: "Bodyweight, both feet.", yt: "Og5Sle5DEkc", q: "double leg calf raise" },
        { name: "Single-leg calf raise", note: "One foot, hold a wall for balance.", yt: "IphGZ8OlfYg", q: "single leg calf raise" },
        { name: "Loaded single-leg calf raise", note: "Add a dumbbell for strength.", yt: "Jy0aMkLNsKo", q: "weighted single leg calf raise" }
      ]
    },
    "nordic": {
      id: "nordic", name: "Hamstring Eccentric (Nordic)", section: "prehab", pattern: "Hamstring resilience",
      equipment: ["bodyweight", "band"], tempo: "5-0-1",
      cues: ["Lower as slowly as you can", "Hips stay straight — hinge at the knee"],
      levels: [
        { name: "Prone band hamstring curl", note: "Gentle entry point.", yt: "LtTcXXgeRYo", q: "band hamstring curl" },
        { name: "Band-assisted Nordic curl", note: "Loop a band across the chest to share the load.", yt: "RS9yc3i69M8", q: "band assisted nordic curl" },
        { name: "Nordic hamstring curl", note: "Full eccentric lower — advanced.", yt: "Yn7aqLkeF0U", q: "nordic hamstring curl" }
      ]
    },
    "sideplank": {
      id: "sideplank", name: "Side Plank", section: "prehab", pattern: "Lateral core / hips",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Stack the hips", "Push the floor away", "Long line head to heel"],
      levels: [
        { name: "Short-lever side plank (from knees)", note: "Knees down shortens the lever.", yt: "ribtncUfriU", q: "side plank from knees" },
        { name: "Full side plank", note: "Feet stacked, hips high.", yt: "iNbH7_edNI8", q: "side plank exercise" },
        { name: "Side plank + top-leg raise", note: "Adds hip-abductor work.", yt: "PAD7sMmIgts", q: "side plank with leg raise" }
      ]
    },

    /* ================= MAIN — SQUAT ================= */
    "squat": {
      id: "squat", name: "Squat", section: "main", pattern: "Squat",
      equipment: ["bodyweight", "dumbbell", "kettlebell", "barbell"], tempo: "3-0-1",
      cues: ["Sit between your hips", "Knees track over the toes", "Chest tall, full-foot pressure"],
      levels: [
        { name: "Box squat to a bench", note: "Sit to a target to learn depth safely.", yt: "7LpLZOdz68A", q: "box squat to bench" },
        { name: "Bodyweight squat", note: "Own your bodyweight before loading.", yt: "P-yaD24bUE8", q: "bodyweight squat form" },
        { name: "Goblet squat", note: "Hold a dumbbell/kettlebell at the chest — the money regression.", yt: "gCESNsDsbqk", q: "goblet squat" },
        { name: "Front-rack squat", note: "Front-loaded with two bells or a barbell.", yt: "OCTkFBXqsnw", q: "front rack kettlebell squat" },
        { name: "Barbell back/front squat", note: "Highest loading potential.", yt: "0ect9ETE6t0", q: "barbell front squat" }
      ]
    },
    "splitsquat": {
      id: "splitsquat", name: "Split Squat / Lunge", section: "main", pattern: "Single-leg (knee)",
      equipment: ["bodyweight", "dumbbell"], tempo: "3-0-1",
      cues: ["Front shin roughly vertical", "Drop straight down", "Push through the front heel"],
      levels: [
        { name: "Supported split squat", note: "Hold a rack/TRX for balance.", yt: "UUpqJMrJ6ok", q: "assisted split squat trx" },
        { name: "Reverse lunge", note: "Step back — knee-friendly starting lunge.", yt: "94AXT7D3bKY", q: "reverse lunge" },
        { name: "Bulgarian split squat", note: "Rear foot on a bench — big single-leg demand.", yt: "VPhhE6bBzZE", q: "bulgarian split squat" },
        { name: "Loaded Bulgarian split squat", note: "Add dumbbells to progress.", yt: "vLuhN_glFZ8", q: "dumbbell bulgarian split squat" }
      ]
    },
    "stepup": {
      id: "stepup", name: "Step-Up", section: "main", pattern: "Single-leg (knee)",
      equipment: ["bodyweight", "dumbbell"], tempo: "2-0-1",
      cues: ["Drive through the top foot", "Don't push off the bottom foot", "Control the way down"],
      levels: [
        { name: "Low box step-up", note: "Knee-height or lower.", yt: "Mlj_4LmNGOk", q: "low box step up" },
        { name: "Knee-height step-up", note: "Standard step-up.", yt: "vOiHvzj5XhA", q: "step up exercise" },
        { name: "Loaded step-up", note: "Hold dumbbells for strength.", yt: "DxUNi119Qzs", q: "dumbbell step up" }
      ]
    },

    /* ================= MAIN — HINGE ================= */
    "hinge": {
      id: "hinge", name: "Hip Hinge / Deadlift", section: "main", pattern: "Hinge",
      equipment: ["bodyweight", "kettlebell", "dumbbell", "barbell"], tempo: "3-0-1",
      cues: ["Push the hips back, not down", "Flat back — chest proud", "Squeeze glutes to stand tall"],
      levels: [
        { name: "Dowel hip hinge", note: "Learn the pattern with a stick on your back.", yt: "ctMrDzw8LYQ", q: "dowel hip hinge" },
        { name: "Kettlebell deadlift", note: "Bell between the feet — friendly first load.", yt: "BP3uhdsMlS4", q: "kettlebell deadlift" },
        { name: "Romanian deadlift (RDL)", note: "Soft knees, hinge to mid-shin.", yt: "aa57T45iFSE", q: "romanian deadlift dumbbell" },
        { name: "Barbell deadlift", note: "Full-range pull from the floor.", yt: "Z6gcRfPNcZo", q: "barbell deadlift form" }
      ]
    },
    "slrdl": {
      id: "slrdl", name: "Single-Leg RDL", section: "main", pattern: "Single-leg (hip)",
      equipment: ["bodyweight", "dumbbell"], tempo: "3-1-1",
      cues: ["Hips square to the floor", "Reach the free leg back", "Hinge, don't bend the spine"],
      levels: [
        { name: "Supported single-leg RDL", note: "Fingertips on a wall for balance.", yt: "oDyLaFpkMV4", q: "supported single leg rdl" },
        { name: "Single-leg RDL (bodyweight)", note: "Balance and hinge on one leg.", yt: "DPFnfAUCvTA", q: "single leg rdl bodyweight" },
        { name: "Loaded single-leg RDL", note: "Hold a dumbbell in the opposite hand.", yt: "iS7atZhcRnw", q: "single leg romanian deadlift dumbbell" }
      ]
    },

    /* ================= MAIN — HORIZONTAL PUSH ================= */
    "hpush": {
      id: "hpush", name: "Horizontal Push (Push-Up / Bench)", section: "main", pattern: "Push (horizontal)",
      equipment: ["bodyweight", "dumbbell", "barbell"], tempo: "3-0-1",
      cues: ["Body in one straight line", "Elbows ~45°, not flared", "Full range — chest to the floor/bar"],
      levels: [
        { name: "Hands-elevated push-up", note: "Higher hands = easier. Wall > counter > box.", yt: "76TQU7iZlsI", q: "incline push up" },
        { name: "Push-up", note: "Full push-up from the floor.", yt: "WDIpL0pjun0", q: "push up form" },
        { name: "Dumbbell bench/floor press", note: "Load each arm independently.", yt: "J-gWN5hYwRU", q: "dumbbell bench press" },
        { name: "Weighted / barbell bench press", note: "Highest loading for pressing strength.", yt: "Pp8rHcFVIYg", q: "barbell bench press form" }
      ]
    },

    /* ================= MAIN — VERTICAL PUSH ================= */
    "vpush": {
      id: "vpush", name: "Overhead Press", section: "main", pattern: "Push (vertical)",
      equipment: ["dumbbell", "barbell", "band"], tempo: "2-0-1",
      cues: ["Ribs down, squeeze the glutes", "Press slightly back, not forward", "Full lockout overhead"],
      levels: [
        { name: "Half-kneeling landmine press", note: "Angled path is shoulder-friendly.", yt: "-5moEsVzZpY", q: "half kneeling landmine press" },
        { name: "Seated dumbbell press", note: "Seated removes the balance demand.", yt: "1jYq9QQEWqE", q: "seated dumbbell shoulder press" },
        { name: "Standing dumbbell press", note: "Adds trunk stability.", yt: "bj53-0DYKFo", q: "standing dumbbell overhead press" },
        { name: "Barbell overhead press", note: "Classic strict press.", yt: "F3QY5vMz_6I", q: "barbell overhead press" }
      ]
    },

    /* ================= MAIN — HORIZONTAL PULL ================= */
    "hpull": {
      id: "hpull", name: "Horizontal Pull (Row)", section: "main", pattern: "Pull (horizontal)",
      equipment: ["dumbbell", "band", "trx", "barbell"], tempo: "2-1-2",
      cues: ["Lead with the elbow", "Squeeze the shoulder blade", "No shrugging or twisting"],
      levels: [
        { name: "Band row", note: "Anchor a band and row — scalable and joint-friendly.", yt: "TBNt2DBvkl4", q: "seated band row" },
        { name: "Inverted row (feet forward)", note: "Walk feet out to make it easier/harder.", yt: "iT_oaf3k0Xw", q: "inverted row trx" },
        { name: "Single-arm dumbbell row", note: "Support on a bench, row one arm.", yt: "W3fZzhw87ak", q: "single arm dumbbell row" },
        { name: "Barbell bent-over row", note: "Bilateral heavy rowing.", yt: "rqTOAM8WoeM", q: "barbell bent over row" }
      ]
    },

    /* ================= MAIN — VERTICAL PULL ================= */
    "vpull": {
      id: "vpull", name: "Vertical Pull (Pull-Up / Pulldown)", section: "main", pattern: "Pull (vertical)",
      equipment: ["bodyweight", "band", "cable"], tempo: "2-1-2",
      cues: ["Start from a full hang", "Drive elbows to the ribs", "Chin over the bar, no kipping"],
      levels: [
        { name: "Lat pulldown", note: "Pick any load — easiest way to train the pattern.", yt: "j9jtjL8FhPI", q: "lat pulldown form" },
        { name: "Band-assisted pull-up", note: "Band under the feet shares the load.", yt: "4yE-XGDWJPg", q: "band assisted pull up" },
        { name: "Negative pull-up", note: "Jump up, lower slowly (5s).", yt: "ELOKABEA1mU", q: "negative pull up" },
        { name: "Pull-up", note: "Full-range from a dead hang.", yt: "aNUSgyWRJYA", q: "pull up form" },
        { name: "Weighted pull-up", note: "Add load once reps come easily.", yt: "HuuyDNGrCI8", q: "weighted pull up" }
      ]
    },

    /* ================= MAIN — CORE ================= */
    "plank": {
      id: "plank", name: "Plank (anti-extension)", section: "main", pattern: "Core / anti-extension",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Ribs down, glutes squeezed", "Straight line, no sagging hips", "Breathe"],
      levels: [
        { name: "Hands-elevated plank", note: "Hands on a bench reduces the load.", yt: "tX_Ez9Mtf7E", q: "incline plank" },
        { name: "Forearm plank", note: "Standard plank on the elbows.", yt: "wCBOqf-HrTI", q: "forearm plank" },
        { name: "Plank with shoulder taps", note: "Add anti-rotation by tapping shoulders.", yt: "NV55raYCP0E", q: "plank shoulder taps" },
        { name: "RKC / long-lever plank", note: "Maximal full-body tension.", yt: "feE0RCgWAUs", q: "rkc plank" }
      ]
    },
    "deadbug": {
      id: "deadbug", name: "Dead Bug", section: "main", pattern: "Core / anti-extension",
      equipment: ["bodyweight"], tempo: "3-0-3",
      cues: ["Press the low back into the floor", "Move slowly, opposite arm/leg", "Exhale as you reach"],
      levels: [
        { name: "Dead bug — legs only", note: "Arms rest; just march the legs.", yt: "Mf-mv9T9xXM", q: "dead bug legs only" },
        { name: "Dead bug (arm + leg)", note: "Opposite arm and leg together.", yt: "bxn9FBrt4-A", q: "dead bug exercise" },
        { name: "Weighted / band dead bug", note: "Hold a band or light weight overhead.", yt: "ChML0ZvchJI", q: "weighted dead bug" }
      ]
    },
    "legraise": {
      id: "legraise", name: "Hanging / Lying Leg Raise", section: "main", pattern: "Core / hip flexion",
      equipment: ["bodyweight", "pullup-bar"], tempo: "2-1-3",
      cues: ["Curl the pelvis, don't just swing legs", "Control the lower", "No momentum"],
      levels: [
        { name: "Lying leg raise", note: "On the floor, hands under the hips.", yt: "xJJu-WiROM8", q: "lying leg raise" },
        { name: "Hanging knee raise", note: "Knees tucked, from a bar.", yt: "l7OroezzX9k", q: "hanging knee raise" },
        { name: "Hanging straight-leg raise", note: "Full lever — advanced.", yt: "rbOJSK07AGA", q: "hanging leg raise" }
      ]
    },
    "carry": {
      id: "carry", name: "Loaded Carry", section: "main", pattern: "Carry / grip",
      equipment: ["dumbbell", "kettlebell"], tempo: "—",
      cues: ["Tall and braced", "Even, quiet steps", "Don't lean to one side"],
      levels: [
        { name: "Two-hand farmer carry", note: "A bell in each hand.", yt: "lLAw6fUccKA", q: "farmer carry" },
        { name: "Suitcase carry (one side)", note: "Load one hand — big anti-lean challenge.", yt: "y-hn_Ha1-RE", q: "suitcase carry" },
        { name: "Front-rack / overhead carry", note: "Higher load position, more core demand.", yt: "0OzaglIheOc", q: "front rack carry" }
      ]
    },

    /* ================= POWER ================= */
    "mbslam": {
      id: "mbslam", name: "Medicine-Ball Slam / Throw", section: "power", pattern: "Power (total-body)",
      equipment: ["med-ball"], tempo: "explosive",
      cues: ["Fast and violent, then reset", "Full-body extension", "Quality over quantity"],
      levels: [
        { name: "Med-ball chest pass", note: "Push a ball hard into a wall.", yt: "Jo2on0-YBPM", q: "medicine ball chest pass" },
        { name: "Overhead med-ball slam", note: "Slam down with full extension.", yt: "EsAhU1jHpiQ", q: "medicine ball slam" },
        { name: "Rotational med-ball throw", note: "Adds a powerful hip rotation.", yt: "o9BC7lgN1bo", q: "rotational medicine ball throw" }
      ]
    },
    "jump": {
      id: "jump", name: "Jump / Plyometric", section: "power", pattern: "Power (lower-body)",
      equipment: ["bodyweight", "box"], tempo: "explosive",
      cues: ["Land soft and quiet", "Absorb through the hips", "Full reset between reps"],
      levels: [
        { name: "Countermovement jump (in place)", note: "Vertical jump, soft landing.", yt: "iU9MOreQB8Y", q: "countermovement jump" },
        { name: "Box jump", note: "Jump onto a box; step down to save the knees.", yt: "G-bxQY57mKc", q: "box jump" },
        { name: "Broad jump", note: "Horizontal power; stick the landing.", yt: "x9qlFXfQaZU", q: "broad jump exercise" },
        { name: "Depth jump", note: "Drop off a low box, rebound fast — advanced.", yt: "bMHL5xqKn3E", q: "depth jump plyometric" }
      ]
    },
    "swing": {
      id: "swing", name: "Kettlebell Swing", section: "power", pattern: "Power (hinge)",
      equipment: ["kettlebell"], tempo: "explosive",
      cues: ["It's a hip snap, not a squat", "Float the bell with the hips", "Braced, neutral spine"],
      levels: [
        { name: "Kettlebell deadlift → hip snap drill", note: "Groove the hinge and snap first.", yt: "QpjJN3I6HLo", q: "kettlebell hip snap drill" },
        { name: "Two-hand kettlebell swing", note: "Explosive hip drive to chest height.", yt: "1Qi0NQW89Oc", q: "kettlebell swing form" },
        { name: "Single-arm kettlebell swing", note: "Adds an anti-rotation demand.", yt: "axaCQqM0R1k", q: "single arm kettlebell swing" }
      ]
    },

    /* ================= CONDITIONING ================= */
    "intervals": {
      id: "intervals", name: "Cardio Intervals", section: "conditioning", pattern: "Conditioning",
      equipment: ["bike", "rower", "bodyweight"], tempo: "—",
      cues: ["Pick a machine you can push safely", "Hard efforts are truly hard", "Full recovery between hard sets"],
      levels: [
        { name: "Steady-state (Zone 2)", note: "20–40 min easy, nose-breathing pace.", yt: "2pWX4FXSvb8", q: "zone 2 cardio training" },
        { name: "Long intervals (1:1)", note: "e.g. 1 min hard / 1 min easy.", yt: "guK58aW7ewY", q: "cardio interval training beginner" },
        { name: "Short sprints (1:3+)", note: "Short max efforts with long rest.", yt: "wOATrDoX5i0", q: "sprint interval training" }
      ]
    },
    "circuit": {
      id: "circuit", name: "Metabolic Circuit", section: "conditioning", pattern: "Conditioning",
      equipment: ["bodyweight", "dumbbell"], tempo: "—",
      cues: ["Keep form crisp as you fatigue", "Move between stations, short rests", "Scale reps to keep quality"],
      levels: [
        { name: "Timed rounds w/ generous rest", note: "e.g. 30s work / 30s rest.", yt: "YQnoaMVGHX0", q: "beginner bodyweight circuit" },
        { name: "Density circuit", note: "Fixed reps, minimal rest, more rounds.", yt: "IRt1Aadbe1A", q: "dumbbell metabolic circuit" },
        { name: "EMOM / AMRAP finisher", note: "Every-minute or as-many-rounds format.", yt: "TJjz-WyXCL4", q: "emom workout finisher" }
      ]
    },

    /* ================= COOL-DOWN / FLEXIBILITY ================= */
    "couch": {
      id: "couch", name: "Hip-Flexor / Couch Stretch", section: "cooldown", pattern: "Hip flexibility",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Squeeze the glute of the back leg", "Ribs down — don't arch the back", "Breathe into it 30–60s"],
      levels: [
        { name: "Half-kneeling hip-flexor stretch", note: "Gentle version on the floor.", yt: "Bfb-9dIWEr4", q: "half kneeling hip flexor stretch" },
        { name: "Couch stretch", note: "Back foot up a wall/bench — deep stretch.", yt: "-rsIS-wl-ig", q: "couch stretch" }
      ]
    },
    "hammy": {
      id: "hammy", name: "Hamstring Stretch", section: "cooldown", pattern: "Posterior flexibility",
      equipment: ["bodyweight", "band"], tempo: "—",
      cues: ["Long spine, hinge from the hip", "Ease in — never bounce"],
      levels: [
        { name: "Supine band hamstring stretch", note: "Lie down, loop a band over the foot.", yt: "BgJmjs3MFI8", q: "supine hamstring stretch band" },
        { name: "Standing/seated hamstring stretch", note: "Hinge forward with a flat back.", yt: "LVY692zJK0A", q: "standing hamstring stretch" }
      ]
    },
    "pigeon": {
      id: "pigeon", name: "Glute / Pigeon Stretch", section: "cooldown", pattern: "Hip flexibility",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Keep the hips square", "Sink slowly, breathe"],
      levels: [
        { name: "Figure-4 stretch (on back)", note: "Easiest on the joints.", yt: "eGqbnFII3J8", q: "figure 4 stretch" },
        { name: "Seated figure-4 (in a chair)", note: "Great if the floor is tough.", yt: "vBzxkDAsMbU", q: "seated figure 4 stretch" },
        { name: "Pigeon pose", note: "Deeper floor-based glute stretch.", yt: "eEdrVDK8M3U", q: "pigeon pose stretch" }
      ]
    },
    "pecstretch": {
      id: "pecstretch", name: "Chest / Doorway Stretch", section: "cooldown", pattern: "Shoulder flexibility",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Gentle lean, no shoulder pinch", "Open the chest, not the low back"],
      levels: [
        { name: "Doorway pec stretch", note: "Forearm on the frame, step through.", yt: "CEQMx4zFwYs", q: "doorway pec stretch" },
        { name: "Floor 'W' / thoracic opener", note: "Lie back over a rolled towel and open the arms.", yt: "BwRQCqC9cvQ", q: "thoracic spine opener stretch" }
      ]
    },
    "breath": {
      id: "breath", name: "Down-Regulation Breathing", section: "cooldown", pattern: "Recovery",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Longer exhale than inhale", "Let the shoulders drop", "Slow the heart rate before you leave"],
      levels: [
        { name: "Box breathing (4-4-4-4)", note: "Equal in-hold-out-hold.", yt: "tEmt1Znux58", q: "box breathing exercise" },
        { name: "Extended-exhale breathing (4-8)", note: "Inhale 4, exhale 8 to calm down.", yt: "VVpkAxGBFrw", q: "extended exhale breathing" }
      ]
    },

    /* ================= WARM-UP (added) ================= */
    "tspine": {
      id: "tspine", name: "Thoracic Rotation (Open Book)", section: "warmup", pattern: "Upper-back mobility",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Rotate from the mid-back, not the low back", "Follow your hand with your eyes", "Exhale as you open"],
      levels: [
        { name: "Seated thoracic rotation", note: "Easiest — rotate in a chair, arms crossed.", yt: "uGl-AG4C1Wc", q: "seated thoracic rotation" },
        { name: "Open-book stretch (side-lying)", note: "Knees stacked, peel the top arm open.", yt: "rDviWORCWEw", q: "open book thoracic rotation" },
        { name: "Quadruped thread-the-needle", note: "Reach under and then rotate up and open.", yt: "SkQhKf74nZk", q: "thread the needle stretch" }
      ]
    },
    "ankle": {
      id: "ankle", name: "Ankle Mobility (Knee-to-Wall)", section: "warmup", pattern: "Ankle mobility",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Drive the knee over the toes", "Keep the heel glued down", "Small, gentle reps"],
      levels: [
        { name: "Seated ankle circles / pumps", note: "Gentle entry with no load.", yt: "4GW6QdSaQ6U", q: "ankle mobility drills" },
        { name: "Knee-to-wall dorsiflexion", note: "Half-kneel, drive the knee past the toes.", yt: "Y1IZXkdPPdw", q: "knee to wall ankle mobility" },
        { name: "Loaded ankle rock (deep squat)", note: "Rock into a deep squat to open both ankles.", yt: "77iX2a1BqOk", q: "deep squat ankle mobility" }
      ]
    },

    /* ================= PREHAB (added) ================= */
    "birddog": {
      id: "birddog", name: "Bird Dog", section: "prehab", pattern: "Core / anti-rotation",
      equipment: ["bodyweight"], tempo: "2-2-2",
      cues: ["Reach long, don't just lift", "Keep the hips level — no twisting", "Move slow and controlled"],
      levels: [
        { name: "Bird dog — arm only", note: "Master a stable back with just the arm.", yt: "6kSJOnr7U1E", q: "bird dog arm only" },
        { name: "Bird dog (opposite arm + leg)", note: "Classic — reach and hold briefly.", yt: "ZdAHe9_HeEw", q: "bird dog exercise" },
        { name: "Bird dog with band / elbow-to-knee", note: "Add a crunch or band for more demand.", yt: "1Jpm9Mw9EkY", q: "bird dog crunch exercise" }
      ]
    },
    "copenhagen": {
      id: "copenhagen", name: "Copenhagen Plank (adductor)", section: "prehab", pattern: "Groin / adductor health",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Squeeze the top leg into the bench", "Long line, hips lifted", "Build time slowly"],
      levels: [
        { name: "Adductor squeeze (ball)", note: "Simplest — squeeze a ball between the knees.", yt: "LV10oi6ruUY", q: "adductor squeeze exercise" },
        { name: "Short-lever Copenhagen (knee on bench)", note: "Bottom knee down shortens the lever.", yt: "nhGK-DxiGBE", q: "short lever copenhagen plank" },
        { name: "Full Copenhagen plank (foot on bench)", note: "Top foot on the bench — advanced.", yt: "48wlc5zn02A", q: "copenhagen plank" }
      ]
    },
    "dislocate": {
      id: "dislocate", name: "Band Shoulder Dislocates", section: "prehab", pattern: "Shoulder mobility",
      equipment: ["band"], tempo: "—",
      cues: ["Wide grip — never force it", "Slow arc overhead and back", "Stop at any pinch"],
      levels: [
        { name: "Wall slides", note: "Forearms on a wall, slide up and down.", yt: "YIvNRUJp7_E", q: "wall slides shoulder" },
        { name: "Wide-grip band pass-through", note: "Take a band over and behind you.", yt: "riVxa9By-pM", q: "band shoulder dislocates" },
        { name: "Narrower-grip pass-through", note: "Close the grip a little as mobility improves.", yt: "htphsDzpWcc", q: "shoulder pass through mobility" }
      ]
    },

    /* ================= MAIN (added) ================= */
    "hipthrust": {
      id: "hipthrust", name: "Hip Thrust / Bridge", section: "main", pattern: "Hinge (glute)",
      equipment: ["bodyweight", "dumbbell", "barbell"], tempo: "2-1-2",
      cues: ["Chin tucked, ribs down", "Squeeze the glutes at the top", "Shins vertical at lockout"],
      levels: [
        { name: "Feet-elevated glute bridge", note: "Floor bridge — friendliest version.", yt: "Z3cY3d3BBo4", q: "glute bridge floor" },
        { name: "Shoulder-elevated hip thrust", note: "Upper back on a bench, bodyweight.", yt: "j59jWsUbl8A", q: "bodyweight hip thrust bench" },
        { name: "Dumbbell hip thrust", note: "Add a dumbbell across the hips.", yt: "29OfN4ztW_g", q: "dumbbell hip thrust" },
        { name: "Barbell hip thrust", note: "Highest loading for the glutes.", yt: "pF17m_CXfL0", q: "barbell hip thrust" }
      ]
    },
    "lateral": {
      id: "lateral", name: "Lateral Lunge / Cossack", section: "main", pattern: "Single-leg (frontal plane)",
      equipment: ["bodyweight", "dumbbell"], tempo: "3-0-1",
      cues: ["Sit into the bent hip", "Keep the other leg straight", "Push the floor away to return"],
      levels: [
        { name: "Assisted lateral lunge", note: "Hold a rack/TRX and step wide.", yt: "SgolPMO0HdE", q: "assisted lateral lunge" },
        { name: "Lateral lunge", note: "Bodyweight, sit into one hip.", yt: "gwWv7aPcD88", q: "lateral lunge exercise" },
        { name: "Cossack squat", note: "Deeper range, heel stays down.", yt: "JaCbmoDqUc4", q: "cossack squat" },
        { name: "Goblet Cossack squat", note: "Hold a weight at the chest.", yt: "rSaWYv37zzE", q: "goblet cossack squat" }
      ]
    },
    "hollow": {
      id: "hollow", name: "Hollow-Body Hold", section: "main", pattern: "Core / anti-extension",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Press the low back flat to the floor", "Long from fingers to toes", "Breathe through it"],
      levels: [
        { name: "Tuck hollow hold", note: "Knees tucked — easiest.", yt: "BZDI4Wrnw70", q: "tuck hollow hold" },
        { name: "Single-leg hollow", note: "One leg extended at a time.", yt: "_2NhOrUgjHM", q: "hollow hold single leg" },
        { name: "Full hollow-body hold", note: "Arms and legs long — advanced.", yt: "0yPin8hSc8o", q: "hollow body hold" },
        { name: "Hollow rocks", note: "Add a small rocking motion.", yt: "XWNXnEfIdZU", q: "hollow body rocks" }
      ]
    },

    /* ================= POWER (added) ================= */
    "pushpress": {
      id: "pushpress", name: "Push Press (upper-body power)", section: "power", pattern: "Power (vertical push)",
      equipment: ["dumbbell", "barbell"], tempo: "explosive",
      cues: ["Small dip, then drive with the legs", "Punch the weight overhead fast", "Reset each rep"],
      levels: [
        { name: "Medicine-ball push press (into wall)", note: "Learn the dip-drive safely.", yt: "wDIpNpQlomU", q: "medicine ball push press" },
        { name: "Dumbbell push press", note: "Dip and drive two dumbbells overhead.", yt: "4tCaD42ghlc", q: "dumbbell push press" },
        { name: "Barbell push press", note: "Heaviest, most powerful version.", yt: "Hqxjk5Z35SM", q: "barbell push press" }
      ]
    },

    /* ================= CONDITIONING (added) ================= */
    "jumprope": {
      id: "jumprope", name: "Jump Rope", section: "conditioning", pattern: "Conditioning / footwork",
      equipment: ["jump-rope", "bodyweight"], tempo: "—",
      cues: ["Small, quick bounces", "Turn the rope from the wrists", "Land soft on the balls of the feet"],
      levels: [
        { name: "No-rope 'phantom' bounces", note: "Groove the timing without the rope.", yt: "nrM3n9fH1-o", q: "jump rope beginner no rope" },
        { name: "Steady two-foot skips", note: "Continuous basic bounce.", yt: "Y3wzaWE9QRY", q: "jump rope basic bounce" },
        { name: "Intervals / double-unders", note: "Fast intervals or double-unders for a big engine hit.", yt: "pQRnSYfliEc", q: "jump rope double unders" }
      ]
    },
    "sled": {
      id: "sled", name: "Sled / Loaded Push", section: "conditioning", pattern: "Conditioning (low-impact)",
      equipment: ["sled", "bodyweight"], tempo: "—",
      cues: ["Low, driving angle", "Powerful, full leg strides", "Joint-friendly — no impact"],
      levels: [
        { name: "Uphill / incline walk", note: "No sled needed — a brisk incline works.", yt: "NAsObfFJXvE", q: "incline treadmill walk conditioning" },
        { name: "Sled push", note: "Drive a loaded sled for distance.", yt: "YJbKlXj4WhI", q: "sled push exercise" },
        { name: "Heavy sled push/drag intervals", note: "Alternate hard pushes with walk-back rest.", yt: "oUg3tDB-E2A", q: "heavy sled push intervals" }
      ]
    },

    /* ================= COOL-DOWN (added) ================= */
    "childs": {
      id: "childs", name: "Child's Pose / Lat Stretch", section: "cooldown", pattern: "Back & lat flexibility",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Sink the hips back toward the heels", "Reach the fingertips long", "Breathe into the ribs"],
      levels: [
        { name: "Supported child's pose (on a bench)", note: "Hands on a bench if the floor is tough.", yt: "v1rMvAcfNKY", q: "supported childs pose" },
        { name: "Child's pose", note: "Classic kneeling reach-back.", yt: "jaCOZJPSy2g", q: "childs pose stretch" },
        { name: "Side-bent lat stretch", note: "Walk the hands to one side to bias the lats.", yt: "GRUbJjv8tBs", q: "childs pose lat stretch side" }
      ]
    }
  };

  /* Group family ids by section for quick lookup / defaults. */
  var BY_SECTION = {};
  Object.keys(LIB).forEach(function (id) {
    var s = LIB[id].section;
    (BY_SECTION[s] = BY_SECTION[s] || []).push(id);
  });

  window.TS_EXERCISES = LIB;
  window.TS_BY_SECTION = BY_SECTION;
})();
