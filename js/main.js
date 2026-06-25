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

  /* --- Footer year --- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
