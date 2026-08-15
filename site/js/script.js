(function () {
  "use strict";

  // Sticky header: pill merges into full-width bar once the user scrolls past the hero
  var header = document.getElementById("siteHeader");
  var heroEl = document.querySelector(".hero");
  var scrollThreshold = 48;
  var getHeaderHeight = function () {
    var v = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
    return parseFloat(v) || 84;
  };
  var recalcThreshold = function () {
    scrollThreshold = heroEl ? Math.max(heroEl.offsetHeight - getHeaderHeight(), 48) : 48;
  };
  var scrollTicking = false;
  var hysteresis = 24;
  var floatWhatsapp = document.getElementById("floatWhatsapp");
  var applyScrollState = function () {
    if (window.scrollY > scrollThreshold) header.classList.add("scrolled");
    else if (window.scrollY < scrollThreshold - hysteresis) header.classList.remove("scrolled");
    if (floatWhatsapp) floatWhatsapp.classList.toggle("is-visible", header.classList.contains("scrolled"));
    scrollTicking = false;
  };
  var onScroll = function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(applyScrollState);
      scrollTicking = true;
    }
  };
  recalcThreshold();
  document.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    recalcThreshold();
    applyScrollState();
  }, { passive: true });
  applyScrollState();

  // Nav dropdown toggle
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  var closeNav = function () {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };
  navToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    var isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });
  document.addEventListener("click", function (e) {
    if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  // Hero slider
  var heroSlider = document.getElementById("heroSlider");
  if (heroSlider) {
    var slides = heroSlider.querySelectorAll(".hero-slide");
    var panels = heroSlider.querySelectorAll(".hero-panel");
    var dots = heroSlider.querySelectorAll(".hero-dot");
    var prevBtn = document.getElementById("heroPrev");
    var nextBtn = document.getElementById("heroNext");
    var current = 0;
    var slideCount = slides.length;
    var autoplayTimer = null;
    var AUTOPLAY_MS = 4000;
    heroSlider.style.setProperty("--hero-dot-duration", AUTOPLAY_MS + "ms");

    var goTo = function (index) {
      current = (index + slideCount) % slideCount;
      slides.forEach(function (el, i) { el.classList.toggle("is-active", i === current); });
      panels.forEach(function (el, i) { el.classList.toggle("is-active", i === current); });
      dots.forEach(function (el, i) { el.classList.toggle("is-active", i === current); });
    };
    var next = function () { goTo(current + 1); };
    var prev = function () { goTo(current - 1); };

    var startAutoplay = function () {
      stopAutoplay();
      autoplayTimer = window.setInterval(next, AUTOPLAY_MS);
    };
    var stopAutoplay = function () {
      if (autoplayTimer) window.clearInterval(autoplayTimer);
    };

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { goTo(i); startAutoplay(); });
    });
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); startAutoplay(); });
    heroSlider.addEventListener("mouseenter", stopAutoplay);
    heroSlider.addEventListener("mouseleave", startAutoplay);

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) startAutoplay();
  }

  // Reveal-on-scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
