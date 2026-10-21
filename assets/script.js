(() => {
  "use strict";

  function initialize() {
    const languageButton = document.getElementById("langToggle");
    const menuButton = document.getElementById("navToggle");
    const navigation = document.getElementById("navLinks");
    const filterButtons = Array.from(document.querySelectorAll("button[data-filter]"));
    const publicationItems = Array.from(document.querySelectorAll("[data-category]"));
    const publicationCount = document.getElementById("publicationCount");
    const publicationEntries = Array.from(document.querySelectorAll("#publications .pub"));
    const allowedFilters = new Set(["all", "published", "review", "projects", "presentations"]);
    let language = "en";
    let menuOpen = false;
    let activeFilter = "all";

    document.documentElement.classList.add("js");
    [languageButton, menuButton, ...document.querySelectorAll(".publication-filters")]
      .forEach((element) => { if (element) element.hidden = false; });

    function updatePublicationCount() {
      if (!publicationCount) return;
      const count = publicationEntries.filter((entry) => !entry.closest("[hidden]")).length;
      publicationCount.textContent = language === "zh"
        ? `顯示 ${count} 項成果`
        : `${count} ${count === 1 ? "entry" : "entries"} shown`;
    }

    // Translation attributes contain trusted, author-written HTML. Translate
    // leaves only so an accidental nested translation cannot detach its nodes.
    const translations = Array.from(document.querySelectorAll("[data-zh]"))
      .filter((element) => !element.querySelector("[data-zh]"))
      .map((element) => {
        const isMeta = element.tagName === "META";
        const english = element.dataset.en ?? (isMeta ? element.content : element.innerHTML);
        element.dataset.en = english;
        return { element, english, chinese: element.dataset.zh, isMeta };
      });

    function updateControlLabels() {
      if (languageButton) {
        languageButton.textContent = language === "zh" ? "EN" : "繁中";
        languageButton.setAttribute("lang", language === "zh" ? "en" : "zh-Hant");
        languageButton.setAttribute("aria-label", language === "zh" ? "Switch to English" : "切換至繁體中文");
      }
      if (menuButton) {
        menuButton.setAttribute("aria-label", language === "zh"
          ? (menuOpen ? "關閉導覽選單" : "開啟導覽選單")
          : (menuOpen ? "Close navigation menu" : "Open navigation menu"));
      }
    }

    function setLanguage(nextLanguage) {
      language = nextLanguage === "zh" ? "zh" : "en";
      translations.forEach(({ element, english, chinese, isMeta }) => {
        const value = language === "zh" ? chinese : english;
        if (isMeta) element.content = value;
        else element.innerHTML = value;
      });
      document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
      document.body.classList.toggle("zh", language === "zh");
      updateControlLabels();
      setFilter(activeFilter);
      try {
        window.localStorage.setItem("site_lang", language);
      } catch {
        // Language switching still works when browser storage is unavailable.
      }
    }

    function setMenuOpen(open, restoreFocus = false) {
      menuOpen = Boolean(open && menuButton && navigation);
      // CSS may use either hook; both represent exactly the same state.
      document.body.classList.toggle("nav-open", menuOpen);
      navigation?.classList.toggle("is-open", menuOpen);
      menuButton?.setAttribute("aria-expanded", String(menuOpen));
      updateControlLabels();
      if (restoreFocus && menuButton) menuButton.focus();
    }

    if (menuButton && navigation) {
      menuButton.setAttribute("aria-controls", "navLinks");
      setMenuOpen(false);
      menuButton.addEventListener("click", () => {
        setMenuOpen(!menuOpen);
        if (menuOpen) navigation.querySelector("a")?.focus();
      });
      navigation.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) setMenuOpen(false);
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuOpen) {
          event.preventDefault();
          setMenuOpen(false, true);
        }
      });
      document.addEventListener("click", (event) => {
        if (menuOpen && event.target instanceof Node
          && !navigation.contains(event.target) && !menuButton.contains(event.target)) {
          setMenuOpen(false);
        }
      });
      // A disclosure menu also closes once keyboard focus leaves its controls.
      document.addEventListener("focusin", (event) => {
        if (menuOpen && event.target instanceof Node
          && !navigation.contains(event.target) && !menuButton.contains(event.target)) {
          setMenuOpen(false);
        }
      });
    }

    function setFilter(filter) {
      if (!allowedFilters.has(filter)) return;
      activeFilter = filter;
      filterButtons.forEach((button) => {
        const selected = button.dataset.filter === filter;
        button.setAttribute("aria-pressed", String(selected));
        button.classList.toggle("is-active", selected);
      });
      publicationItems.forEach((item) => {
        const categories = (item.dataset.category || "").split(/\s+/);
        item.hidden = filter !== "all" && !categories.includes(filter);
      });
      updatePublicationCount();
    }

    if (filterButtons.length) {
      const selected = filterButtons.find((button) => button.getAttribute("aria-pressed") === "true");
      setFilter(allowedFilters.has(selected?.dataset.filter) ? selected.dataset.filter : "all");
      filterButtons.forEach((button) => {
        button.addEventListener("click", () => setFilter(button.dataset.filter));
      });
    }

    try {
      language = window.localStorage.getItem("site_lang") === "zh" ? "zh" : "en";
    } catch {
      language = "en";
    }
    setLanguage(language);
    languageButton?.addEventListener("click", () => setLanguage(language === "zh" ? "en" : "zh"));

    function openLinkedDetails() {
      if (!window.location.hash) return;
      let id;
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (!target) return;
      const publicationGroup = target.closest(".publication-group");
      if (publicationGroup?.hidden) {
        setFilter("all");
        window.requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "instant" }));
      }
      let details = target.closest("details");
      if (!details) return;
      while (details) {
        details.open = true;
        details = details.parentElement?.closest("details");
      }
      // Scroll only after native disclosure content participates in layout.
      window.requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "instant" }));
    }

    document.querySelectorAll('a[href="#presentations"]').forEach((link) => {
      link.addEventListener("click", () => {
        if (document.getElementById("presentations")?.hidden) setFilter("all");
      });
    });
    openLinkedDetails();
    window.addEventListener("load", openLinkedDetails, { once: true });
    window.addEventListener("hashchange", openLinkedDetails);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
