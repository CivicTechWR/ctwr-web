  (function () {
    "use strict";

    // ── helpers ──────────────────────────────────────────────────────────────
    function safeUrl(url) {
      if (!url) return "#";
      // Browsers normalize embedded backslashes and tab/newline/CR characters
      // during URL parsing (WHATWG URL spec), which can turn a seemingly-safe
      // relative path (e.g. "/\evil.com" or "/\t/evil.com") into a
      // protocol-relative reference to an attacker-controlled host.
      if (/[\t\n\r\\]/.test(url)) return "#";
      // Protocol-relative URLs ("//evil.com") start with "/" too but resolve
      // to an attacker-controlled host using the current page's scheme —
      // must be excluded from the relative-path allowance below.
      return url.startsWith("https://") ||
        url.startsWith("http://") ||
        (url.startsWith("/") && !url.startsWith("//"))
        ? url
        : "#";
    }

    function formatTag(tag) {
      return tag.replace(/-/g, " ");
    }

    function buildTagPills(tags) {
      if (!tags || !tags.length) return null;
      const wrap = document.createElement("div");
      wrap.className = "project-tag-pills";
      tags.forEach((tag) => {
        const pill = document.createElement("span");
        pill.className = "project-tag-pill";
        pill.textContent = formatTag(tag);
        wrap.appendChild(pill);
      });
      return wrap;
    }

    // ── filter ───────────────────────────────────────────────────────────────
    function getActiveFilter() {
      const btn = document.querySelector(".filter-btn--active");
      return btn ? btn.dataset.filter : "all";
    }

    function applyFilter(tag) {
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.toggle("filter-btn--active", btn.dataset.filter === tag);
      });

      ["project-container", "github-projects-container"].forEach((id) => {
        const container = document.getElementById(id);
        const empty = document.getElementById(id + "-empty");
        if (!container) return;

        let visibleCount = 0;
        Array.from(container.children).forEach((card) => {
          if (card.id && card.id.endsWith("-empty")) return;
          let show;
          if (tag === "all") {
            show = true;
          } else if (card.dataset.tags) {
            show = card.dataset.tags.split(" ").filter(Boolean).includes(tag);
          } else {
            show = false;
          }
          card.style.display = show ? "" : "none";
          if (show) visibleCount++;
        });

        if (empty) empty.style.display = visibleCount === 0 ? "" : "none";
      });
    }

    function updateFilterBar() {
      const tagSet = new Set();
      document.querySelectorAll("[data-tags]").forEach((el) => {
        el.dataset.tags
          .split(" ")
          .filter(Boolean)
          .forEach((t) => tagSet.add(t));
      });

      const bar = document.getElementById("projects-filter-bar");
      if (!bar) return;

      const activeFilter = getActiveFilter();
      bar.innerHTML = "";

      const makeBtn = (label, value) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "filter-btn" + (activeFilter === value ? " filter-btn--active" : "");
        btn.dataset.filter = value;
        btn.textContent = label;
        btn.addEventListener("click", () => applyFilter(value));
        return btn;
      };

      bar.appendChild(makeBtn("All", "all"));
      Array.from(tagSet)
        .sort()
        .forEach((tag) => bar.appendChild(makeBtn(formatTag(tag), tag)));
    }

    // ── featured projects ─────────────────────────────────────────────────────
    function buildFeaturedCard(project) {
      const tags = Array.isArray(project.tags) ? project.tags : [];
      const yearString = Array.isArray(project.year)
        ? project.year.join(", ")
        : String(project.year);

      const col = document.createElement("div");
      col.className = "col-lg-4 col-md-6 col-12 mb-4";
      if (tags.length) col.dataset.tags = tags.join(" ");

      const card = document.createElement("div");
      card.className = "project-card";

      const info = document.createElement("div");
      info.className = "project-info";

      const githubLink = document.createElement("a");
      githubLink.href = safeUrl(project.github);
      githubLink.className = "btn btn--badge";
      githubLink.target = "_blank";
      githubLink.rel = "noopener noreferrer";
      githubLink.setAttribute(
        "aria-label",
        (project.display_name || project.name) +
          " on GitHub (opens in new window)",
      );
      githubLink.textContent = "GitHub";

      const title = document.createElement("h3");
      title.className = "projects-title";
      title.textContent = project.display_name || project.name;

      const yearTag = document.createElement("small");
      yearTag.className = "projects-tag";
      yearTag.textContent = "Year: " + yearString;

      info.appendChild(githubLink);
      info.appendChild(title);
      info.appendChild(yearTag);

      if (project.description) {
        const desc = document.createElement("p");
        desc.textContent = project.description;
        info.appendChild(desc);
      }

      const pills = buildTagPills(tags);
      if (pills) info.appendChild(pills);

      const imgLink = document.createElement("a");
      imgLink.href = safeUrl(project.url);
      imgLink.target = "_blank";
      imgLink.rel = "noopener noreferrer";
      imgLink.setAttribute(
        "aria-label",
        "View " +
          (project.display_name || project.name) +
          " (opens in new window)",
      );

      const img = document.createElement("img");
      img.src = safeUrl(project.logo);
      img.className = "project-image img-fluid";
      img.alt = project.display_name || project.name;
      img.loading = "lazy";
      img.decoding = "async";

      imgLink.appendChild(img);
      card.appendChild(info);
      card.appendChild(imgLink);
      col.appendChild(card);
      return col;
    }

    function loadProjects() {
      fetch("/js/projects.json")
        .then((r) => {
          if (!r.ok) throw new Error("projects.json responded " + r.status);
          return r.json();
        })
        .then((projects) => {
          const container = document.getElementById("project-container");
          if (!container) return;
          container.innerHTML = "";
          projects.forEach((p) => container.appendChild(buildFeaturedCard(p)));

          const empty = document.createElement("div");
          empty.id = "project-container-empty";
          empty.className = "col-12 text-center";
          empty.style.display = "none";
          empty.innerHTML = "<p>No featured projects match this filter.</p>";
          container.appendChild(empty);

          updateFilterBar();
          applyFilter(getActiveFilter());
        })
        .catch((err) => {
          console.error("[projects] Failed to load featured projects:", err);
          const container = document.getElementById("project-container");
          if (!container) return;
          const errDiv = document.createElement("div");
          errDiv.className = "col-12 text-center";
          errDiv.innerHTML =
            "<p>Sorry, we couldn't load the projects. Please try again later.</p>";
          container.appendChild(errDiv);
        });
    }

    // ── GitHub projects ───────────────────────────────────────────────────────
    function buildGitHubCard(repo, override) {
      const displayName = override.display_name || repo.name;
      const description = override.description || repo.description || "";
      const tags =
        override.tags && override.tags.length
          ? override.tags
          : repo.topics || [];
      const siteUrl = override.url || repo.html_url;

      const col = document.createElement("div");
      col.className = "col-lg-4 col-md-6 col-12 mb-4";
      if (tags.length) col.dataset.tags = tags.join(" ");

      const card = document.createElement("div");
      card.className = "project-card project-card--text";

      const info = document.createElement("div");
      info.className = "project-info";

      const githubLink = document.createElement("a");
      githubLink.href =
        repo.html_url && repo.html_url.startsWith("https://")
          ? repo.html_url
          : "#";
      githubLink.className = "btn btn--badge";
      githubLink.target = "_blank";
      githubLink.rel = "noopener noreferrer";
      githubLink.setAttribute(
        "aria-label",
        displayName + " on GitHub (opens in new window)",
      );
      githubLink.textContent = "GitHub";

      const titleEl = document.createElement("h3");
      titleEl.className = "projects-title";
      titleEl.textContent = displayName;

      info.appendChild(githubLink);
      info.appendChild(titleEl);

      if (repo.language) {
        const lang = document.createElement("small");
        lang.className = "projects-tag";
        lang.textContent = repo.language;
        info.appendChild(lang);
      }

      if (description) {
        const desc = document.createElement("p");
        desc.textContent = description;
        info.appendChild(desc);
      }

      const pills = buildTagPills(tags);
      if (pills) info.appendChild(pills);

      card.appendChild(info);
      col.appendChild(card);
      return col;
    }

    function loadGitHubProjects() {
      Promise.all([
        fetch("https://api.github.com/orgs/CivicTechWR/repos?per_page=100").then(
          (r) => {
            if (!r.ok) throw new Error("GitHub API responded " + r.status);
            return r.json();
          },
        ),
        fetch("/js/github_overrides.json")
          .then((r) => {
            if (!r.ok) throw new Error("github_overrides.json responded " + r.status);
            return r.json();
          })
          .catch((err) => {
            console.error("[projects] Could not load github_overrides.json, overrides will not be applied:", err);
            return {};
          }),
      ])
        .then(([repos, overrides]) => {
          const container = document.getElementById("github-projects-container");
          if (!container) return;
          container.innerHTML = "";

          repos
            .filter((repo) => !repo.fork && !repo.archived)
            .filter((repo) => !(overrides[repo.name] || {}).hidden)
            .forEach((repo) =>
              container.appendChild(
                buildGitHubCard(repo, overrides[repo.name] || {}),
              ),
            );

          const empty = document.createElement("div");
          empty.id = "github-projects-container-empty";
          empty.className = "col-12 text-center";
          empty.style.display = "none";
          empty.innerHTML = "<p>No projects match this filter.</p>";
          container.appendChild(empty);

          updateFilterBar();
          applyFilter(getActiveFilter());
        })
        .catch((err) => {
          console.error("[projects] Failed to load GitHub projects:", err);
          const container = document.getElementById("github-projects-container");
          if (!container) return;
          const errDiv = document.createElement("div");
          errDiv.className = "col-12 text-center";
          errDiv.innerHTML =
            "<p>Sorry, we couldn't load the other projects. Please try again later.</p>";
          container.appendChild(errDiv);
        });
    }

    // Guarded so Node can require() this file (see module.exports below)
    // without a DOMContentLoaded listener attempt blowing up outside a browser.
    if (typeof document !== "undefined") {
      document.addEventListener("DOMContentLoaded", () => {
        loadProjects();
        loadGitHubProjects();
      });
    }

    // Test hook: exposes safeUrl to Node's require() for tests/js/safe-url.js.
    // module is undefined in the browser, so this block never runs there.
    if (typeof module !== "undefined" && module.exports) {
      module.exports = { safeUrl };
    }
  })();
