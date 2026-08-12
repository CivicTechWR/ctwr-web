(function () {
  "use strict";

  const btn = document.getElementById("nav-toggle-btn");
  const nav = document.getElementById("navbarNav");
  if (!btn || !nav) return;

  btn.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", function (e) {
    if (!btn.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      btn.focus();
    }
  });
})();
