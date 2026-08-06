/* Standalone general-fitness site — minimal behaviour (nav toggle + year). */
(function () {
  "use strict";
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) toggle.addEventListener("click", function () { links.classList.toggle("open"); });
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
