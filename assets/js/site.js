/* =====================================================================
   Site-wide behaviour: mobile nav, footer year, demo purchase modal
   ===================================================================== */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  /* ---- Footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Demo purchase / unlock modal ----
     There is no real payment backend on this static build. Any element with
     [data-buy] opens a demo checkout modal describing what would happen. */
  function buildModal() {
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true">' +
      '<button class="close" aria-label="Close">&times;</button>' +
      '<h3 id="modal-title">Checkout</h3>' +
      '<p id="modal-body" class="muted"></p>' +
      '<div class="mt-3"><button class="btn btn-primary btn-block" id="modal-confirm">Continue to secure checkout</button></div>' +
      '<p class="muted mt-2" style="font-size:.8rem">Demo build — no card is charged. Wire this button to Stripe / Gumroad to go live.</p>' +
      "</div>";
    document.body.appendChild(overlay);
    function close() { overlay.classList.remove("open"); }
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.classList.contains("close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    return overlay;
  }

  var overlay = null;
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-buy]");
    if (!el) return;
    e.preventDefault();
    if (!overlay) overlay = buildModal();
    var name = el.getAttribute("data-buy") || "this program";
    var price = el.getAttribute("data-price") || "";
    overlay.querySelector("#modal-title").textContent = name;
    overlay.querySelector("#modal-body").textContent =
      "You're purchasing “" + name + "”" + (price ? " for " + price : "") +
      ". After payment you'll get instant access to the full program, video demos, and the workout logger.";
    var confirm = overlay.querySelector("#modal-confirm");
    confirm.textContent = price ? "Pay " + price + " securely" : "Continue to secure checkout";
    overlay.classList.add("open");
  });
})();
