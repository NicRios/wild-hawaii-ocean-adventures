/* Wild Hawaii Ocean Adventures — site interactions (vanilla JS, no deps) */
(function () {
  "use strict";

  /* --- Sticky header: solid background once scrolled past the hero top --- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-solid", window.scrollY > 24);
  }
  if (header) {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- Mobile nav toggle --- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // close the menu after tapping a link
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* --- FAQ: keep one item open at a time (optional accordion behaviour) --- */
  var faqs = Array.prototype.slice.call(document.querySelectorAll(".faq"));
  faqs.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqs.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* --- Contact / booking form: front-end handling + success message ---
     No backend is wired yet. To go live, point the form's `action` at a
     form service (Formspree, Netlify Forms, Basin, etc.) and remove the
     preventDefault below — or keep this for a static mailto fallback. */
  var forms = Array.prototype.slice.call(document.querySelectorAll("form[data-contact]"));
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      if (form.getAttribute("action") && form.getAttribute("action") !== "#") {
        return; // a real endpoint is configured — let it submit
      }
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var ok = form.querySelector(".form-success");
      if (ok) ok.classList.add("show");
      form.querySelectorAll("input, textarea, select, button").forEach(function (el) {
        if (el.type !== "hidden") el.setAttribute("disabled", "disabled");
      });
    });
  });

  /* --- Reveal on scroll --- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* --- Reviews carousel (scroll-snap + arrows + dots) --- */
  var carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    // the prev/next buttons live in the section header, outside [data-carousel]
    var scope = carousel.closest("section") || document;
    var track = carousel.querySelector("[data-car-track]");
    var btnPrev = scope.querySelector("[data-car-prev]");
    var btnNext = scope.querySelector("[data-car-next]");
    var dotsWrap = carousel.querySelector("[data-car-dots]");

    if (track) {
      // collect every review once, then (re)group them into slides for the current
      // breakpoint — 4 per slide (2x2) on desktop, 2 per slide on phones
      var reviews = Array.prototype.slice.call(track.querySelectorAll(".review"));
      var cards = [];
      var perSlide = function () { return window.matchMedia("(max-width: 640px)").matches ? 2 : 4; };
      var slideSize = -1;
      var buildSlides = function () {
        slideSize = perSlide();
        track.innerHTML = "";
        for (var s = 0; s < reviews.length; s += slideSize) {
          var slide = document.createElement("div");
          slide.className = "car-slide";
          for (var k = s; k < s + slideSize && k < reviews.length; k++) slide.appendChild(reviews[k]);
          track.appendChild(slide);
        }
        cards = Array.prototype.slice.call(track.children);
      };
      buildSlides();
    }
    if (track && cards.length) {
      var stepSize = function () {
        var cs = getComputedStyle(track);
        var gap = parseFloat(cs.columnGap || cs.gap || "0") || 0;
        return cards[0].getBoundingClientRect().width + gap;
      };
      var perView = function () { return Math.max(1, Math.round(track.clientWidth / stepSize())); };
      var maxIndex = function () { return Math.max(0, cards.length - perView()); };
      var current = function () { return Math.min(Math.round(track.scrollLeft / stepSize()), maxIndex()); };

      var goTo = function (i) {
        var mi = maxIndex();
        if (i < 0) i = mi;       // wrap to end
        if (i > mi) i = 0;       // wrap to start
        track.scrollTo({ left: i * stepSize() });
      };

      if (btnNext) btnNext.addEventListener("click", function () { goTo(current() + 1); });
      if (btnPrev) btnPrev.addEventListener("click", function () { goTo(current() - 1); });

      var updateDots = function () {
        if (!dotsWrap) return;
        var c = current();
        Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
          d.classList.toggle("active", i === c);
        });
      };
      var buildDots = function () {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = "";
        var n = maxIndex() + 1;
        for (var i = 0; i < n; i++) {
          (function (idx) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "car-dot";
            b.setAttribute("aria-label", "Go to review set " + (idx + 1));
            b.addEventListener("click", function () { goTo(idx); });
            dotsWrap.appendChild(b);
          })(i);
        }
        updateDots();
      };

      var ticking = false;
      track.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { updateDots(); ticking = false; });
      }, { passive: true });

      var resizeTimer;
      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          // re-group into 2- or 4-per-slide when crossing the phone breakpoint
          if (perSlide() !== slideSize) { buildSlides(); track.scrollTo({ left: 0 }); }
          buildDots();
        }, 150);
      });

      buildDots();
    }
  }

  /* --- Smooth-scroll for SAME-page anchor links (e.g. the home-page nav).
     Cross-page links like index.html#gallery don't match a[href^="#"], so they
     still load the page and jump to the section instantly. --- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    if (a.classList.contains("skip")) return; // keep the skip link instant/focusable
    a.addEventListener("click", function (e) {
      var hash = a.getAttribute("href");
      if (hash.length < 2) return;
      var target = document.getElementById(hash.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", hash);
    });
  });

  /* --- Footer year --- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
