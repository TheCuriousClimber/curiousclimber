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
        { name: "Kneeling hip-flexor rock", note: "Easiest — no floor-to-stand transition.", q: "kneeling hip flexor stretch" },
        { name: "World's Greatest Stretch", note: "Lunge, elbow to instep, rotate open.", q: "worlds greatest stretch" },
        { name: "World's Greatest Stretch w/ overhead reach", note: "Add a tall reach to load the thoracic spine.", q: "worlds greatest stretch with rotation" }
      ]
    },
    "catcow": {
      id: "catcow", name: "Cat–Cow / Spinal Waves", section: "warmup", pattern: "Spine mobility",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Move one segment at a time", "Match the breath to the motion"],
      levels: [
        { name: "Seated cat–cow", note: "Do it in a chair if the floor is hard to get to.", q: "seated cat cow stretch" },
        { name: "Quadruped cat–cow", note: "Classic on hands and knees.", q: "cat cow stretch" },
        { name: "Cat–cow to child's pose flow", note: "Add a rock-back to open the hips.", q: "cat cow to childs pose flow" }
      ]
    },
    "legswing": {
      id: "legswing", name: "Dynamic Leg Swings", section: "warmup", pattern: "Dynamic mobility",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Hold something for balance", "Start small, grow the range"],
      levels: [
        { name: "Supported leg swings (front/back)", note: "Hold a wall or rack.", q: "leg swings warm up" },
        { name: "Front-back + side-side swings", note: "Add lateral swings for the hips.", q: "dynamic leg swings side to side" }
      ]
    },
    "inchworm": {
      id: "inchworm", name: "Inchworm to Plank", section: "warmup", pattern: "Full-body prep",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Keep legs as straight as comfy", "Brace the belly at the top"],
      levels: [
        { name: "Hands-elevated inchworm", note: "Walk out onto a bench or box.", q: "elevated inchworm exercise" },
        { name: "Inchworm to plank", note: "Walk hands to a full plank and back.", q: "inchworm exercise" },
        { name: "Inchworm + push-up", note: "Add a push-up at the bottom.", q: "inchworm to push up" }
      ]
    },
    "glutebridge": {
      id: "glutebridge", name: "Glute Bridge (activation)", section: "warmup", pattern: "Glute activation",
      equipment: ["bodyweight"], tempo: "2-1-1",
      cues: ["Squeeze the glutes, not the low back", "Ribs down"],
      levels: [
        { name: "Two-leg glute bridge", note: "Both feet down, squeeze at the top.", q: "glute bridge exercise" },
        { name: "Glute bridge march", note: "Lift one knee at a time without dropping the hips.", q: "glute bridge march" },
        { name: "Single-leg glute bridge", note: "One foot down — big step up in demand.", q: "single leg glute bridge" }
      ]
    },

    /* ================= PREHAB / INJURY-PREVENTION ================= */
    "extrot": {
      id: "extrot", name: "Rotator-Cuff External Rotation", section: "prehab", pattern: "Shoulder health",
      equipment: ["band", "cable"], tempo: "2-0-2",
      cues: ["Elbow pinned to your side", "Rotate from the shoulder, slow and controlled"],
      levels: [
        { name: "Side-lying external rotation (no weight)", note: "Groove the pattern first.", q: "side lying external rotation" },
        { name: "Band external rotation", note: "Elbow tucked, rotate the forearm out.", q: "band external rotation shoulder" },
        { name: "Cable/dumbbell external rotation", note: "Add steady load once form is clean.", q: "cable external rotation shoulder" }
      ]
    },
    "facepull": {
      id: "facepull", name: "Face Pull", section: "prehab", pattern: "Upper-back / posture",
      equipment: ["band", "cable"], tempo: "2-1-2",
      cues: ["Pull to your eyes/forehead", "Thumbs back at the finish", "Squeeze the shoulder blades"],
      levels: [
        { name: "Band pull-apart", note: "Simplest rear-shoulder builder.", q: "band pull apart exercise" },
        { name: "Band face pull", note: "Anchor at head height and pull to the face.", q: "band face pull" },
        { name: "Cable face pull (rope)", note: "Heavier, smoother resistance.", q: "cable face pull rope" }
      ]
    },
    "wristext": {
      id: "wristext", name: "Wrist Extension / Reverse Curl", section: "prehab", pattern: "Elbow health",
      equipment: ["dumbbell", "band"], tempo: "3-1-3",
      cues: ["Slow lowering is the point", "Small weight, full control"],
      levels: [
        { name: "Wrist extension (no weight)", note: "Just the range of motion first.", q: "wrist extension exercise no weight" },
        { name: "Light dumbbell wrist extension", note: "Forearm on the thigh, wrist over the knee.", q: "dumbbell wrist extension" },
        { name: "Reverse (pronated) curl", note: "Loads the elbow tendons for climber's/tennis elbow.", q: "reverse curl elbow" }
      ]
    },
    "pallof": {
      id: "pallof", name: "Pallof Press (anti-rotation)", section: "prehab", pattern: "Core / anti-rotation",
      equipment: ["band", "cable"], tempo: "2-2-2",
      cues: ["Resist the twist — don't let the band turn you", "Ribs down, glutes on"],
      levels: [
        { name: "Tall-kneeling Pallof hold", note: "Just hold and resist rotation.", q: "tall kneeling pallof press" },
        { name: "Standing Pallof press", note: "Press out and back in without rotating.", q: "pallof press" },
        { name: "Split-stance Pallof press", note: "Narrower base raises the anti-rotation demand.", q: "split stance pallof press" }
      ]
    },
    "calf": {
      id: "calf", name: "Calf Raise", section: "prehab", pattern: "Lower-leg / Achilles",
      equipment: ["bodyweight", "dumbbell"], tempo: "2-1-3",
      cues: ["Full range — heel below the step", "Pause at the top"],
      levels: [
        { name: "Two-leg calf raise", note: "Bodyweight, both feet.", q: "double leg calf raise" },
        { name: "Single-leg calf raise", note: "One foot, hold a wall for balance.", q: "single leg calf raise" },
        { name: "Loaded single-leg calf raise", note: "Add a dumbbell for strength.", q: "weighted single leg calf raise" }
      ]
    },
    "nordic": {
      id: "nordic", name: "Hamstring Eccentric (Nordic)", section: "prehab", pattern: "Hamstring resilience",
      equipment: ["bodyweight", "band"], tempo: "5-0-1",
      cues: ["Lower as slowly as you can", "Hips stay straight — hinge at the knee"],
      levels: [
        { name: "Prone band hamstring curl", note: "Gentle entry point.", q: "band hamstring curl" },
        { name: "Band-assisted Nordic curl", note: "Loop a band across the chest to share the load.", q: "band assisted nordic curl" },
        { name: "Nordic hamstring curl", note: "Full eccentric lower — advanced.", q: "nordic hamstring curl" }
      ]
    },
    "sideplank": {
      id: "sideplank", name: "Side Plank", section: "prehab", pattern: "Lateral core / hips",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Stack the hips", "Push the floor away", "Long line head to heel"],
      levels: [
        { name: "Short-lever side plank (from knees)", note: "Knees down shortens the lever.", q: "side plank from knees" },
        { name: "Full side plank", note: "Feet stacked, hips high.", q: "side plank exercise" },
        { name: "Side plank + top-leg raise", note: "Adds hip-abductor work.", q: "side plank with leg raise" }
      ]
    },

    /* ================= MAIN — SQUAT ================= */
    "squat": {
      id: "squat", name: "Squat", section: "main", pattern: "Squat",
      equipment: ["bodyweight", "dumbbell", "kettlebell", "barbell"], tempo: "3-0-1",
      cues: ["Sit between your hips", "Knees track over the toes", "Chest tall, full-foot pressure"],
      levels: [
        { name: "Box squat to a bench", note: "Sit to a target to learn depth safely.", q: "box squat to bench" },
        { name: "Bodyweight squat", note: "Own your bodyweight before loading.", q: "bodyweight squat form" },
        { name: "Goblet squat", note: "Hold a dumbbell/kettlebell at the chest — the money regression.", q: "goblet squat" },
        { name: "Front-rack squat", note: "Front-loaded with two bells or a barbell.", q: "front rack kettlebell squat" },
        { name: "Barbell back/front squat", note: "Highest loading potential.", q: "barbell front squat" }
      ]
    },
    "splitsquat": {
      id: "splitsquat", name: "Split Squat / Lunge", section: "main", pattern: "Single-leg (knee)",
      equipment: ["bodyweight", "dumbbell"], tempo: "3-0-1",
      cues: ["Front shin roughly vertical", "Drop straight down", "Push through the front heel"],
      levels: [
        { name: "Supported split squat", note: "Hold a rack/TRX for balance.", q: "assisted split squat trx" },
        { name: "Reverse lunge", note: "Step back — knee-friendly starting lunge.", q: "reverse lunge" },
        { name: "Bulgarian split squat", note: "Rear foot on a bench — big single-leg demand.", q: "bulgarian split squat" },
        { name: "Loaded Bulgarian split squat", note: "Add dumbbells to progress.", q: "dumbbell bulgarian split squat" }
      ]
    },
    "stepup": {
      id: "stepup", name: "Step-Up", section: "main", pattern: "Single-leg (knee)",
      equipment: ["bodyweight", "dumbbell"], tempo: "2-0-1",
      cues: ["Drive through the top foot", "Don't push off the bottom foot", "Control the way down"],
      levels: [
        { name: "Low box step-up", note: "Knee-height or lower.", q: "low box step up" },
        { name: "Knee-height step-up", note: "Standard step-up.", q: "step up exercise" },
        { name: "Loaded step-up", note: "Hold dumbbells for strength.", q: "dumbbell step up" }
      ]
    },

    /* ================= MAIN — HINGE ================= */
    "hinge": {
      id: "hinge", name: "Hip Hinge / Deadlift", section: "main", pattern: "Hinge",
      equipment: ["bodyweight", "kettlebell", "dumbbell", "barbell"], tempo: "3-0-1",
      cues: ["Push the hips back, not down", "Flat back — chest proud", "Squeeze glutes to stand tall"],
      levels: [
        { name: "Dowel hip hinge", note: "Learn the pattern with a stick on your back.", q: "dowel hip hinge" },
        { name: "Kettlebell deadlift", note: "Bell between the feet — friendly first load.", q: "kettlebell deadlift" },
        { name: "Romanian deadlift (RDL)", note: "Soft knees, hinge to mid-shin.", q: "romanian deadlift dumbbell" },
        { name: "Barbell deadlift", note: "Full-range pull from the floor.", q: "barbell deadlift form" }
      ]
    },
    "slrdl": {
      id: "slrdl", name: "Single-Leg RDL", section: "main", pattern: "Single-leg (hip)",
      equipment: ["bodyweight", "dumbbell"], tempo: "3-1-1",
      cues: ["Hips square to the floor", "Reach the free leg back", "Hinge, don't bend the spine"],
      levels: [
        { name: "Supported single-leg RDL", note: "Fingertips on a wall for balance.", q: "supported single leg rdl" },
        { name: "Single-leg RDL (bodyweight)", note: "Balance and hinge on one leg.", q: "single leg rdl bodyweight" },
        { name: "Loaded single-leg RDL", note: "Hold a dumbbell in the opposite hand.", q: "single leg romanian deadlift dumbbell" }
      ]
    },

    /* ================= MAIN — HORIZONTAL PUSH ================= */
    "hpush": {
      id: "hpush", name: "Horizontal Push (Push-Up / Bench)", section: "main", pattern: "Push (horizontal)",
      equipment: ["bodyweight", "dumbbell", "barbell"], tempo: "3-0-1",
      cues: ["Body in one straight line", "Elbows ~45°, not flared", "Full range — chest to the floor/bar"],
      levels: [
        { name: "Hands-elevated push-up", note: "Higher hands = easier. Wall > counter > box.", q: "incline push up" },
        { name: "Push-up", note: "Full push-up from the floor.", q: "push up form" },
        { name: "Dumbbell bench/floor press", note: "Load each arm independently.", q: "dumbbell bench press" },
        { name: "Weighted / barbell bench press", note: "Highest loading for pressing strength.", q: "barbell bench press form" }
      ]
    },

    /* ================= MAIN — VERTICAL PUSH ================= */
    "vpush": {
      id: "vpush", name: "Overhead Press", section: "main", pattern: "Push (vertical)",
      equipment: ["dumbbell", "barbell", "band"], tempo: "2-0-1",
      cues: ["Ribs down, squeeze the glutes", "Press slightly back, not forward", "Full lockout overhead"],
      levels: [
        { name: "Half-kneeling landmine press", note: "Angled path is shoulder-friendly.", q: "half kneeling landmine press" },
        { name: "Seated dumbbell press", note: "Seated removes the balance demand.", q: "seated dumbbell shoulder press" },
        { name: "Standing dumbbell press", note: "Adds trunk stability.", q: "standing dumbbell overhead press" },
        { name: "Barbell overhead press", note: "Classic strict press.", q: "barbell overhead press" }
      ]
    },

    /* ================= MAIN — HORIZONTAL PULL ================= */
    "hpull": {
      id: "hpull", name: "Horizontal Pull (Row)", section: "main", pattern: "Pull (horizontal)",
      equipment: ["dumbbell", "band", "trx", "barbell"], tempo: "2-1-2",
      cues: ["Lead with the elbow", "Squeeze the shoulder blade", "No shrugging or twisting"],
      levels: [
        { name: "Band row", note: "Anchor a band and row — scalable and joint-friendly.", q: "seated band row" },
        { name: "Inverted row (feet forward)", note: "Walk feet out to make it easier/harder.", q: "inverted row trx" },
        { name: "Single-arm dumbbell row", note: "Support on a bench, row one arm.", q: "single arm dumbbell row" },
        { name: "Barbell bent-over row", note: "Bilateral heavy rowing.", q: "barbell bent over row" }
      ]
    },

    /* ================= MAIN — VERTICAL PULL ================= */
    "vpull": {
      id: "vpull", name: "Vertical Pull (Pull-Up / Pulldown)", section: "main", pattern: "Pull (vertical)",
      equipment: ["bodyweight", "band", "cable"], tempo: "2-1-2",
      cues: ["Start from a full hang", "Drive elbows to the ribs", "Chin over the bar, no kipping"],
      levels: [
        { name: "Lat pulldown", note: "Pick any load — easiest way to train the pattern.", q: "lat pulldown form" },
        { name: "Band-assisted pull-up", note: "Band under the feet shares the load.", q: "band assisted pull up" },
        { name: "Negative pull-up", note: "Jump up, lower slowly (5s).", q: "negative pull up" },
        { name: "Pull-up", note: "Full-range from a dead hang.", q: "pull up form" },
        { name: "Weighted pull-up", note: "Add load once reps come easily.", q: "weighted pull up" }
      ]
    },

    /* ================= MAIN — CORE ================= */
    "plank": {
      id: "plank", name: "Plank (anti-extension)", section: "main", pattern: "Core / anti-extension",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Ribs down, glutes squeezed", "Straight line, no sagging hips", "Breathe"],
      levels: [
        { name: "Hands-elevated plank", note: "Hands on a bench reduces the load.", q: "incline plank" },
        { name: "Forearm plank", note: "Standard plank on the elbows.", q: "forearm plank" },
        { name: "Plank with shoulder taps", note: "Add anti-rotation by tapping shoulders.", q: "plank shoulder taps" },
        { name: "RKC / long-lever plank", note: "Maximal full-body tension.", q: "rkc plank" }
      ]
    },
    "deadbug": {
      id: "deadbug", name: "Dead Bug", section: "main", pattern: "Core / anti-extension",
      equipment: ["bodyweight"], tempo: "3-0-3",
      cues: ["Press the low back into the floor", "Move slowly, opposite arm/leg", "Exhale as you reach"],
      levels: [
        { name: "Dead bug — legs only", note: "Arms rest; just march the legs.", q: "dead bug legs only" },
        { name: "Dead bug (arm + leg)", note: "Opposite arm and leg together.", q: "dead bug exercise" },
        { name: "Weighted / band dead bug", note: "Hold a band or light weight overhead.", q: "weighted dead bug" }
      ]
    },
    "legraise": {
      id: "legraise", name: "Hanging / Lying Leg Raise", section: "main", pattern: "Core / hip flexion",
      equipment: ["bodyweight", "pullup-bar"], tempo: "2-1-3",
      cues: ["Curl the pelvis, don't just swing legs", "Control the lower", "No momentum"],
      levels: [
        { name: "Lying leg raise", note: "On the floor, hands under the hips.", q: "lying leg raise" },
        { name: "Hanging knee raise", note: "Knees tucked, from a bar.", q: "hanging knee raise" },
        { name: "Hanging straight-leg raise", note: "Full lever — advanced.", q: "hanging leg raise" }
      ]
    },
    "carry": {
      id: "carry", name: "Loaded Carry", section: "main", pattern: "Carry / grip",
      equipment: ["dumbbell", "kettlebell"], tempo: "—",
      cues: ["Tall and braced", "Even, quiet steps", "Don't lean to one side"],
      levels: [
        { name: "Two-hand farmer carry", note: "A bell in each hand.", q: "farmer carry" },
        { name: "Suitcase carry (one side)", note: "Load one hand — big anti-lean challenge.", q: "suitcase carry" },
        { name: "Front-rack / overhead carry", note: "Higher load position, more core demand.", q: "front rack carry" }
      ]
    },

    /* ================= POWER ================= */
    "mbslam": {
      id: "mbslam", name: "Medicine-Ball Slam / Throw", section: "power", pattern: "Power (total-body)",
      equipment: ["med-ball"], tempo: "explosive",
      cues: ["Fast and violent, then reset", "Full-body extension", "Quality over quantity"],
      levels: [
        { name: "Med-ball chest pass", note: "Push a ball hard into a wall.", q: "medicine ball chest pass" },
        { name: "Overhead med-ball slam", note: "Slam down with full extension.", q: "medicine ball slam" },
        { name: "Rotational med-ball throw", note: "Adds a powerful hip rotation.", q: "rotational medicine ball throw" }
      ]
    },
    "jump": {
      id: "jump", name: "Jump / Plyometric", section: "power", pattern: "Power (lower-body)",
      equipment: ["bodyweight", "box"], tempo: "explosive",
      cues: ["Land soft and quiet", "Absorb through the hips", "Full reset between reps"],
      levels: [
        { name: "Countermovement jump (in place)", note: "Vertical jump, soft landing.", q: "countermovement jump" },
        { name: "Box jump", note: "Jump onto a box; step down to save the knees.", q: "box jump" },
        { name: "Broad jump", note: "Horizontal power; stick the landing.", q: "broad jump exercise" },
        { name: "Depth jump", note: "Drop off a low box, rebound fast — advanced.", q: "depth jump plyometric" }
      ]
    },
    "swing": {
      id: "swing", name: "Kettlebell Swing", section: "power", pattern: "Power (hinge)",
      equipment: ["kettlebell"], tempo: "explosive",
      cues: ["It's a hip snap, not a squat", "Float the bell with the hips", "Braced, neutral spine"],
      levels: [
        { name: "Kettlebell deadlift → hip snap drill", note: "Groove the hinge and snap first.", q: "kettlebell hip snap drill" },
        { name: "Two-hand kettlebell swing", note: "Explosive hip drive to chest height.", q: "kettlebell swing form" },
        { name: "Single-arm kettlebell swing", note: "Adds an anti-rotation demand.", q: "single arm kettlebell swing" }
      ]
    },

    /* ================= CONDITIONING ================= */
    "intervals": {
      id: "intervals", name: "Cardio Intervals", section: "conditioning", pattern: "Conditioning",
      equipment: ["bike", "rower", "bodyweight"], tempo: "—",
      cues: ["Pick a machine you can push safely", "Hard efforts are truly hard", "Full recovery between hard sets"],
      levels: [
        { name: "Steady-state (Zone 2)", note: "20–40 min easy, nose-breathing pace.", q: "zone 2 cardio training" },
        { name: "Long intervals (1:1)", note: "e.g. 1 min hard / 1 min easy.", q: "cardio interval training beginner" },
        { name: "Short sprints (1:3+)", note: "Short max efforts with long rest.", q: "sprint interval training" }
      ]
    },
    "circuit": {
      id: "circuit", name: "Metabolic Circuit", section: "conditioning", pattern: "Conditioning",
      equipment: ["bodyweight", "dumbbell"], tempo: "—",
      cues: ["Keep form crisp as you fatigue", "Move between stations, short rests", "Scale reps to keep quality"],
      levels: [
        { name: "Timed rounds w/ generous rest", note: "e.g. 30s work / 30s rest.", q: "beginner bodyweight circuit" },
        { name: "Density circuit", note: "Fixed reps, minimal rest, more rounds.", q: "dumbbell metabolic circuit" },
        { name: "EMOM / AMRAP finisher", note: "Every-minute or as-many-rounds format.", q: "emom workout finisher" }
      ]
    },

    /* ================= COOL-DOWN / FLEXIBILITY ================= */
    "couch": {
      id: "couch", name: "Hip-Flexor / Couch Stretch", section: "cooldown", pattern: "Hip flexibility",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Squeeze the glute of the back leg", "Ribs down — don't arch the back", "Breathe into it 30–60s"],
      levels: [
        { name: "Half-kneeling hip-flexor stretch", note: "Gentle version on the floor.", q: "half kneeling hip flexor stretch" },
        { name: "Couch stretch", note: "Back foot up a wall/bench — deep stretch.", q: "couch stretch" }
      ]
    },
    "hammy": {
      id: "hammy", name: "Hamstring Stretch", section: "cooldown", pattern: "Posterior flexibility",
      equipment: ["bodyweight", "band"], tempo: "—",
      cues: ["Long spine, hinge from the hip", "Ease in — never bounce"],
      levels: [
        { name: "Supine band hamstring stretch", note: "Lie down, loop a band over the foot.", q: "supine hamstring stretch band" },
        { name: "Standing/seated hamstring stretch", note: "Hinge forward with a flat back.", q: "standing hamstring stretch" }
      ]
    },
    "pigeon": {
      id: "pigeon", name: "Glute / Pigeon Stretch", section: "cooldown", pattern: "Hip flexibility",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Keep the hips square", "Sink slowly, breathe"],
      levels: [
        { name: "Figure-4 stretch (on back)", note: "Easiest on the joints.", q: "figure 4 stretch" },
        { name: "Seated figure-4 (in a chair)", note: "Great if the floor is tough.", q: "seated figure 4 stretch" },
        { name: "Pigeon pose", note: "Deeper floor-based glute stretch.", q: "pigeon pose stretch" }
      ]
    },
    "pecstretch": {
      id: "pecstretch", name: "Chest / Doorway Stretch", section: "cooldown", pattern: "Shoulder flexibility",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Gentle lean, no shoulder pinch", "Open the chest, not the low back"],
      levels: [
        { name: "Doorway pec stretch", note: "Forearm on the frame, step through.", q: "doorway pec stretch" },
        { name: "Floor 'W' / thoracic opener", note: "Lie back over a rolled towel and open the arms.", q: "thoracic spine opener stretch" }
      ]
    },
    "breath": {
      id: "breath", name: "Down-Regulation Breathing", section: "cooldown", pattern: "Recovery",
      equipment: ["bodyweight"], tempo: "—",
      cues: ["Longer exhale than inhale", "Let the shoulders drop", "Slow the heart rate before you leave"],
      levels: [
        { name: "Box breathing (4-4-4-4)", note: "Equal in-hold-out-hold.", q: "box breathing exercise" },
        { name: "Extended-exhale breathing (4-8)", note: "Inhale 4, exhale 8 to calm down.", q: "extended exhale breathing" }
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
