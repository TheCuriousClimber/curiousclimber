/* =====================================================================
   THE AUTOBODY SHOP — standalone behaviour
   Nav toggle · footer year · self-guided "build sheet" configurator
   No dependencies, no build step, no tracking. Runs on any static host.
   ===================================================================== */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () { links.classList.toggle("open"); });
  }

  /* ---- Footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Self-guided "Build sheet" configurator (Manual page) ----
     Any element with [data-pkg] toggles into the build sheet. The sheet
     lists your chosen upgrade packages so the self-directed athlete can see
     the plan they've assembled. Persists to localStorage so it survives a
     reload — this is a demo tool, nothing is sent anywhere. */
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
      // reflect state on the buttons
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
    // Safety net: guarantee everything is visible shortly after load.
    setTimeout(function () { reveals.forEach(show); }, 1500);
  }
})();
