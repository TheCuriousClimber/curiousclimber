/* =====================================================================
   Progressive media: drop-in product photos + click-to-load videos.
   No HTML editing needed to add real media.
   ---------------------------------------------------------------------
   PHOTOS:  Any element with data-img="key" tries to load
            assets/img/<key>.jpg and, if the file exists, replaces the
            placeholder background with the photo. Just add the file — e.g.
            assets/img/send-it-tee.jpg — and it appears. Missing files leave
            the existing gradient/emoji placeholder untouched.
            (data-img may also be a full path if it contains a "/".)

   VIDEOS:  Any element with data-yt="" is a placeholder. Put a YouTube video
            ID in it — data-yt="dQw4w9WgXcQ" — and it becomes a click-to-play
            video (privacy-friendly youtube-nocookie, loaded only on click).
   ===================================================================== */
(function () {
  "use strict";

  /* ---- product / hero photos ---- */
  function loadImg(el) {
    var v = el.getAttribute("data-img");
    if (!v) return;
    var src = v.indexOf("/") > -1 ? v : "assets/img/" + v + ".jpg";
    var img = new Image();
    img.onload = function () {
      var card = el.closest(".card");
      var alt = el.getAttribute("data-img-alt") ||
        (card && card.querySelector("h3") ? card.querySelector("h3").textContent : "");
      img.setAttribute("alt", alt);
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      el.style.background = "none";
      el.textContent = "";
      el.appendChild(img);
    };
    img.onerror = function () { /* keep the placeholder */ };
    img.src = src;
  }
  var imgs = document.querySelectorAll("[data-img]");
  for (var i = 0; i < imgs.length; i++) loadImg(imgs[i]);

  /* ---- click-to-load YouTube videos ---- */
  function wireVideo(el) {
    var id = el.getAttribute("data-yt");
    if (!id) return; // empty -> stays a "coming soon" placeholder
    el.style.cursor = "pointer";
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "Play video");
    el.addEventListener("click", function () {
      var wrap = document.createElement("div");
      wrap.style.position = "relative";
      wrap.style.width = "100%";
      wrap.style.height = "100%";
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
      f.title = "Video";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.setAttribute("allowfullscreen", "");
      f.style.position = "absolute";
      f.style.inset = "0";
      f.style.width = "100%";
      f.style.height = "100%";
      f.style.border = "0";
      el.innerHTML = "";
      el.style.background = "#000";
      wrap.appendChild(f);
      el.appendChild(wrap);
    }, { once: true });
  }
  var vids = document.querySelectorAll("[data-yt]");
  for (var j = 0; j < vids.length; j++) wireVideo(vids[j]);
})();
