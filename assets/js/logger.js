/* =====================================================================
   Practice page: program filters + workout logger with SVG progress chart
   Data is stored locally in the browser (localStorage) — no backend.
   ===================================================================== */
(function () {
  "use strict";

  /* ----------------------------------------------------------------- */
  /*  1. Program filter chips                                           */
  /* ----------------------------------------------------------------- */
  var filterBar = document.getElementById("filters");
  var grid = document.getElementById("program-grid");
  if (filterBar && grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".card"));
    var noResults = document.getElementById("no-results");
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      filterBar.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("selected"); });
      btn.classList.add("selected");
      var f = btn.getAttribute("data-filter");
      var shown = 0;
      cards.forEach(function (card) {
        var cats = card.getAttribute("data-cat") || "";
        var match = f === "all" || cats.indexOf(f) !== -1;
        card.style.display = match ? "" : "none";
        if (match) shown++;
      });
      if (noResults) noResults.style.display = shown ? "none" : "block";
    });
  }

  /* ----------------------------------------------------------------- */
  /*  2. Workout logger                                                 */
  /* ----------------------------------------------------------------- */
  var form = document.getElementById("log-form");
  if (!form) return;

  var KEY = "koc-workout-log-v1";
  var exSelect = document.getElementById("ex");
  var customWrap = document.getElementById("custom-wrap");
  var customInput = document.getElementById("ex-custom");
  var chartSelect = document.getElementById("chart-ex");
  var chartHost = document.getElementById("chart-host");
  var tableBody = document.querySelector("#log-table tbody");
  var dateInput = document.getElementById("date");

  if (dateInput && !dateInput.value) dateInput.value = new Date().toISOString().slice(0, 10);

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  /* estimated 1-rep max (Epley); falls back to raw load if no reps */
  function e1rm(load, reps) {
    load = parseFloat(load) || 0;
    reps = parseInt(reps, 10) || 0;
    if (reps <= 1) return load;
    return Math.round(load * (1 + reps / 30) * 10) / 10;
  }

  /* show custom-name field only when "custom" chosen */
  exSelect.addEventListener("change", function () {
    var custom = exSelect.value === "__custom";
    customWrap.classList.toggle("hidden", !custom);
    if (custom) customInput.focus();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = exSelect.value === "__custom"
      ? (customInput.value.trim() || "Custom")
      : exSelect.value;
    if (!name) return;
    var entry = {
      id: Date.now(),
      ex: name,
      load: parseFloat(document.getElementById("load").value) || 0,
      reps: parseInt(document.getElementById("reps").value, 10) || 0,
      sets: parseInt(document.getElementById("sets").value, 10) || 1,
      rpe: parseFloat(document.getElementById("rpe").value) || null,
      date: dateInput.value || new Date().toISOString().slice(0, 10)
    };
    var list = load();
    list.push(entry);
    save(list);
    form.reset();
    dateInput.value = new Date().toISOString().slice(0, 10);
    customWrap.classList.add("hidden");
    render();
    // keep the just-logged exercise selected in the chart
    chartSelect.value = name;
    drawChart(name);
  });

  /* delete a single entry (event delegation) */
  tableBody.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-del]");
    if (!btn) return;
    var id = parseInt(btn.getAttribute("data-del"), 10);
    save(load().filter(function (r) { return r.id !== id; }));
    render();
  });

  var clearBtn = document.getElementById("clear-log");
  if (clearBtn) clearBtn.addEventListener("click", function () {
    if (confirm("Clear your entire workout log? This can't be undone.")) {
      save([]); render();
    }
  });

  chartSelect.addEventListener("change", function () { drawChart(chartSelect.value); });

  /* ---- rendering ---- */
  function render() {
    var list = load().slice().sort(function (a, b) {
      return a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id;
    });

    /* table */
    if (!list.length) {
      tableBody.innerHTML = '<tr><td colspan="6" class="muted" style="text-align:center;padding:1.5rem">No sessions logged yet.</td></tr>';
    } else {
      tableBody.innerHTML = list.slice(0, 25).map(function (r) {
        return "<tr><td>" + r.date + "</td><td>" + esc(r.ex) + "</td><td>" +
          (r.load ? r.load + " kg" : "—") + "</td><td>" +
          (r.reps ? r.reps + "×" + r.sets : r.sets) + "</td><td>" +
          (r.rpe != null ? r.rpe : "—") + '</td><td><button class="btn btn-ghost btn-sm" data-del="' +
          r.id + '" aria-label="Delete">✕</button></td></tr>';
      }).join("");
    }

    /* chart exercise dropdown */
    var names = [];
    load().forEach(function (r) { if (names.indexOf(r.ex) === -1) names.push(r.ex); });
    if (!names.length) {
      chartSelect.innerHTML = '<option value="">Log a set to see your chart</option>';
    } else {
      var current = chartSelect.value;
      chartSelect.innerHTML = names.map(function (n) {
        return '<option' + (n === current ? " selected" : "") + ">" + esc(n) + "</option>";
      }).join("");
      if (!current || names.indexOf(current) === -1) chartSelect.value = names[0];
    }
    drawChart(chartSelect.value);
  }

  /* ---- SVG progress chart (best estimated 1RM per date) ---- */
  function drawChart(name) {
    if (!name) {
      chartHost.innerHTML = '<p class="muted" style="padding:2rem 0;text-align:center">Your progress chart will appear here once you log a few sessions.</p>';
      return;
    }
    /* best e1RM per date for this exercise */
    var byDate = {};
    load().forEach(function (r) {
      if (r.ex !== name) return;
      var v = e1rm(r.load, r.reps);
      if (byDate[r.date] == null || v > byDate[r.date]) byDate[r.date] = v;
    });
    var points = Object.keys(byDate).sort().map(function (d) { return { date: d, v: byDate[d] }; });

    if (points.length < 2) {
      chartHost.innerHTML = '<p class="muted" style="padding:2rem 0;text-align:center">Log this exercise on at least two different dates to see a trend line.<br><small>Latest: ' +
        (points.length ? points[0].v + " kg on " + points[0].date : "—") + "</small></p>";
      return;
    }

    var W = 560, H = 240, pad = 36;
    var vals = points.map(function (p) { return p.v; });
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    if (min === max) { min = Math.max(0, min - 1); max = max + 1; }
    var range = max - min;

    function x(i) { return pad + (i / (points.length - 1)) * (W - pad * 2); }
    function y(v) { return H - pad - ((v - min) / range) * (H - pad * 2); }

    var line = points.map(function (p, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p.v).toFixed(1); }).join(" ");
    var area = line + " L" + x(points.length - 1).toFixed(1) + " " + (H - pad) + " L" + x(0).toFixed(1) + " " + (H - pad) + " Z";

    var dots = points.map(function (p, i) {
      return '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(p.v).toFixed(1) + '" r="4" fill="#2f8f6b"><title>' +
        p.date + ": " + p.v + ' kg</title></circle>';
    }).join("");

    /* y-axis gridlines (3) */
    var grid = "";
    for (var g = 0; g <= 2; g++) {
      var gv = min + (range * g / 2);
      var gy = y(gv).toFixed(1);
      grid += '<line x1="' + pad + '" x2="' + (W - pad) + '" y1="' + gy + '" y2="' + gy +
        '" stroke="#e3ddd0"/><text x="' + (pad - 6) + '" y="' + (parseFloat(gy) + 4) +
        '" text-anchor="end" font-size="11" fill="#4a5751">' + (Math.round(gv * 10) / 10) + "</text>";
    }
    /* x labels: first, middle, last */
    var xl = [0, Math.floor((points.length - 1) / 2), points.length - 1];
    var xlabels = xl.map(function (i) {
      return '<text x="' + x(i).toFixed(1) + '" y="' + (H - pad + 18) +
        '" text-anchor="middle" font-size="10" fill="#4a5751">' + points[i].date.slice(5) + "</text>";
    }).join("");

    var change = points[points.length - 1].v - points[0].v;
    var pct = points[0].v ? Math.round((change / points[0].v) * 100) : 0;

    chartHost.innerHTML =
      '<svg viewBox="0 0 ' + W + " " + H + '" width="100%" role="img" aria-label="Progress chart for ' + esc(name) + '">' +
      '<defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#2f8f6b" stop-opacity=".22"/><stop offset="1" stop-color="#2f8f6b" stop-opacity="0"/></linearGradient></defs>' +
      grid +
      '<path d="' + area + '" fill="url(#fill)"/>' +
      '<path d="' + line + '" fill="none" stroke="#2f8f6b" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>' +
      dots + xlabels + "</svg>" +
      '<p class="muted" style="text-align:center;margin-top:.4rem;font-size:.9rem">' +
      esc(name) + ": <strong style=\"color:var(--forest)\">" +
      (change >= 0 ? "+" : "") + (Math.round(change * 10) / 10) + " kg" +
      (pct ? " (" + (pct >= 0 ? "+" : "") + pct + "%)" : "") +
      "</strong> since you started tracking.</p>";
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  render();
})();
