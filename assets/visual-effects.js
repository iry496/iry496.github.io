(() => {
  "use strict";

  function initialize() {
    const progressBar = document.getElementById("readingProgress");
    const header = document.querySelector(".site-header");
    const navigationLinks = Array.from(document.querySelectorAll('#navLinks a[href^="#"]'));
    const sections = navigationLinks.map((link) => {
      try {
        const id = decodeURIComponent(link.getAttribute("href").slice(1));
        const section = id ? document.getElementById(id) : null;
        return section ? { link, section } : null;
      } catch {
        return null;
      }
    }).filter(Boolean);
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let scheduledFrame = 0;
    let currentSection = null;
    let revealObserver = null;

    if (progressBar) {
      progressBar.setAttribute("aria-hidden", "true");
      progressBar.style.transformOrigin = "left center";
    }

    function updateScrollState() {
      scheduledFrame = 0;
      const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
      const pageHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      const maximumScroll = Math.max(0, pageHeight - viewportHeight);
      const scrollPosition = Math.max(0, window.scrollY);
      const progress = maximumScroll > 0 ? Math.min(1, scrollPosition / maximumScroll) : 0;

      if (progressBar) progressBar.style.transform = `scaleX(${progress})`;

      // The parent section's start remains selected while reading its details.
      const readingLine = Math.min(viewportHeight * 0.4, (header?.getBoundingClientRect().height || 0) + 32);
      let active = null;
      let nearestTop = -Infinity;
      sections.forEach((entry) => {
        const top = entry.section.getBoundingClientRect().top;
        if (top <= readingLine && top >= nearestTop) {
          active = entry.section;
          nearestTop = top;
        }
      });
      // A short final section may never reach the header before the page ends.
      if (maximumScroll > 0 && scrollPosition >= maximumScroll - 2 && sections.length) {
        active = sections.reduce((last, entry) => (
          entry.section.getBoundingClientRect().top > last.section.getBoundingClientRect().top ? entry : last
        )).section;
      }

      if (active !== currentSection) {
        currentSection = active;
        sections.forEach(({ link, section }) => {
          const selected = section === active;
          link.classList.toggle("is-current", selected);
          if (selected) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
    }

    function scheduleUpdate() {
      if (!scheduledFrame) scheduledFrame = window.requestAnimationFrame(updateScrollState);
    }

    function observeReveals() {
      revealObserver?.disconnect();
      revealObserver = null;
      // Every section is already visible without enhancement. Reduced-motion
      // users receive no entrance-animation class or observation callbacks.
      if (motionPreference.matches || !("IntersectionObserver" in window)) return;
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || motionPreference.matches) return;
          entry.target.classList.add("is-in-view");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
      document.querySelectorAll(".reveal-on-scroll:not(.is-in-view)").forEach((element) => {
        revealObserver.observe(element);
      });
    }

    // Ambient decorations share a pause control. CSS is static unless this
    // enhancement runs; hidden tabs and offscreen artwork use no running loops.
    const motionButton = document.getElementById("motionToggle");
    const ambientElements = Array.from(document.querySelectorAll("[data-ambient-motion]"));
    let motionPaused = false;
    try { motionPaused = window.localStorage.getItem("site_motion") === "paused"; } catch { /* Storage is optional. */ }
    function updateAmbientState() {
      document.documentElement.classList.toggle("motion-paused", motionPaused);
      document.documentElement.classList.toggle("motion-document-hidden", document.hidden);
      if (motionButton) motionButton.dataset.paused = String(motionPaused);
    }
    if (motionButton) {
      motionButton.hidden = false;
      motionButton.addEventListener("click", () => {
        motionPaused = !motionPaused;
        updateAmbientState();
        try { window.localStorage.setItem("site_motion", motionPaused ? "paused" : "running"); } catch { /* Storage is optional. */ }
      });
    }
    updateAmbientState();
    document.documentElement.classList.add("motion-ready");
    if ("IntersectionObserver" in window) {
      const ambientObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.target.classList.toggle("motion-visible", entry.isIntersecting));
      });
      ambientElements.forEach((element) => ambientObserver.observe(element));
    } else {
      ambientElements.forEach((element) => element.classList.add("motion-visible"));
    }
    document.addEventListener("visibilitychange", updateAmbientState);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("load", scheduleUpdate, { once: true });
    document.addEventListener("toggle", scheduleUpdate, true);
    if ("ResizeObserver" in window) {
      const layoutObserver = new ResizeObserver(scheduleUpdate);
      layoutObserver.observe(document.body);
    }
    if (typeof motionPreference.addEventListener === "function") {
      motionPreference.addEventListener("change", observeReveals);
    } else if (typeof motionPreference.addListener === "function") {
      motionPreference.addListener(observeReveals);
    }

    observeReveals();
    scheduleUpdate();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
