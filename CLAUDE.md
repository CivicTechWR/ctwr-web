# CLAUDE.md — AI Agent & Contributor Reference

This file documents non-obvious constraints, workflows, and architecture decisions for this repository. README.md covers general setup; this file covers the things that would take you an hour to discover on your own.

## The project and why it matters

CivicTech Waterloo Region is a community of people who cherish their region and want to see it grow. The website is not just a static page — it is the front door for residents, organizers, volunteers, and contributors trying to connect with that community. Every regression we introduce is a door that doesn't open for someone. Every improvement we make is an invitation.

Approach all work here with that in mind. Be respectful and intentional. Move carefully. Test thoroughly. Document for the contributors who come after you. When a change is risky, take the slower path. When something breaks, fix the root cause, not just the symptom.

## Table of Contents

1. [Repo at a glance](#1-repo-at-a-glance)
2. [Merging PRs — the admin bypass workflow](#2-merging-prs--the-admin-bypass-workflow)
3. [CI — what the checks are and common failure modes](#3-ci--what-the-checks-are-and-common-failure-modes)
4. [CSS architecture — modularized source, generated output](#4-css-architecture--modularized-source-generated-output)
5. [CSP constraints — no inline styles or scripts](#5-csp-constraints--no-inline-styles-or-scripts)
6. [GitHub Pages build constraint](#6-github-pages-build-constraint)
7. [JavaScript files](#7-javascript-files)
8. [Navigation toggle](#8-navigation-toggle)
9. [Dormant files — do not activate](#9-dormant-files--do-not-activate)
10. [E2E testing — Playwright setup and maintenance](#10-e2e-testing--playwright-setup-and-maintenance)
11. [Key conventions](#11-key-conventions)

---

## 1. Repo at a glance

| Item | Detail |
| ------ | -------- |
| Framework | Jekyll static site, deployed to GitHub Pages |
| CSS | Single assembled file `css/main.css` (3,700 lines) — modularization in progress |
| JS | `js/optimized-bundle.min.js` (minified from `js/optimized-bundle.js`), `js/projects.js`, `js/nav-toggle.js`, `js/mailchimp-embed.js` |
| Layouts | `_layouts/default.html` — single layout for all pages |
| CI | GitHub Actions: Lint, Accessibility, Security, E2E, Deploy, CodeQL, Preview Deploy |
| Org | CivicTech Waterloo Region — `@CivicTechWR/website` owns all files; `@CivicTechWR/organizers` co-owns `.github/workflows/**` and `docs/**` |

---

## 2. Merging PRs — the admin bypass workflow

**The problem:** Branch protection requires code owner approval (`@CivicTechWR/website`). The primary maintainer (`BreakableHoodie`) is in `@CivicTechWR/organizers` but not `@CivicTechWR/website`, so they cannot self-approve. `enforce_admins: true` also blocks `gh pr merge --admin` by default.

**The workflow** (used when all CI is green and no reviewer is available):

```bash
# 1. Disable enforce_admins
gh api -X DELETE repos/CivicTechWR/ctwr-web/branches/main/protection/enforce_admins

# 2. Merge (squash preferred)
gh pr merge <N> --squash --admin --subject "commit subject line"

# 3. Re-enable immediately — do not skip this step
gh api -X POST repos/CivicTechWR/ctwr-web/branches/main/protection/enforce_admins
```

Always chain all three commands so enforce_admins is never left disabled if a step fails.

**Never merge with failing CI.** Always check `gh pr checks <N>` and `gh pr view <N> --json mergeStateStatus` before running this workflow. Check for open review comments too.

---

## 3. CI — what the checks are and common failure modes

### Required status checks (as of 2026-05-28)

| Check name | Workflow | What it runs |
| ----------- | ---------- | ------------- |
| `super-linter` | Lint | Super-Linter (bash, shell shfmt, YAML, git markers, etc.) |
| `htmlhint` | Lint | HTMLHint on all `.html` files |
| `node-lint` | Lint | `npm run lint` (CSS, markdown, YAML, JSON, shell, CSP inline) |
| `css-tests` | Lint | `npm run test` (CSS component + Luma tests) |
| `build-assets` | Lint | Rebuilds minified assets and verifies they match committed files |
| `pa11y` | Accessibility | pa11y-ci + axe-core against built site |
| `Scan for committed secrets` | Security | Gitleaks |
| `Scan Ruby gems for vulnerabilities` | Security | bundler-audit |

### Common failure modes

**`Scan Ruby gems for vulnerabilities` showing as "pending" forever**
The job's `name:` display field in `security.yml` is `Scan Ruby gems for vulnerabilities`. Branch protection was originally set up using the job key `bundler-audit`. If you see a perpetual pending check named `bundler-audit`, update the required status check via:
```bash
gh api repos/CivicTechWR/ctwr-web/branches/main/protection/required_status_checks \
  --method PATCH --input - <<'EOF'
{"strict":true,"checks":[
  {"context":"super-linter","app_id":15368},
  {"context":"htmlhint","app_id":15368},
  {"context":"node-lint","app_id":15368},
  {"context":"css-tests","app_id":15368},
  {"context":"build-assets","app_id":15368},
  {"context":"pa11y","app_id":15368},
  {"context":"Scan for committed secrets","app_id":15368},
  {"context":"Scan Ruby gems for vulnerabilities","app_id":15368}
]}
EOF
```
**Rule:** The required check name must match the job's `name:` field (display name), not the job key (YAML key).

**`pa11y` failing with Chrome-related errors**
The pa11y job uses `google-chrome-stable` and `chromedriver` pre-installed on the ubuntu runner. The `Configure Chrome for accessibility testing` step sets `PUPPETEER_EXECUTABLE_PATH` to the system Chrome (for pa11y-ci) and symlinks the system `chromedriver` binary into `node_modules/chromedriver/lib/chromedriver/` (for `@axe-core/cli`). If pa11y fails with a Chrome or chromedriver error, verify the step is present in `accessibility.yml` and that `google-chrome-stable` and `chromedriver` are available on the runner (both are pre-installed on ubuntu-latest).

**`super-linter` / `SHELL_SHFMT` failing on new shell scripts**
All `.sh` files must use **tabs** for indentation (shfmt default). Run `shfmt -w <script.sh>` locally before committing.

**`build-assets` failing with "Minified assets are out of date"**
After any change to `css/main.css` or `js/optimized-bundle.js`, regenerate the minified files:
```bash
npm run minify
git add css/main.min.css js/optimized-bundle.min.js
```

**`super-linter` failing on `TRIVY` (e.g. a CVE flagged in `Gemfile.lock` or `package-lock.json`)**
Super-Linter bundles **Trivy**, which scans `Gemfile.lock` and `package-lock.json` against a vulnerability DB it **downloads fresh on every run**. A branch that was green can therefore fail later with **no code change** when a new CVE is published against an already-pinned dependency — and Trivy flags advisories that the dedicated `Scan Ruby gems for vulnerabilities` (bundler-audit) and `Scan npm dependencies for vulnerabilities` checks miss, because they use different advisory databases. Fix at the source on `main`, not per-branch: bump the flagged dependency (often a lockfile-only `bundle update <gem> --conservative` for a transitive gem), merge to `main`, then rebase open PRs (`@dependabot rebase`, or `gh pr update-branch <N>`) so they pick it up. Example: 2026-06 `concurrent-ruby` 1.3.6 → 1.3.7 (CVE-2026-54904), PR #139.

---

## 4. CSS architecture — modularized source, generated output

**CSS modularization is complete** (merged across 4 PRs by 2026-05-28). `css/src/*.css` — 22 partial files — is the real source of truth. **`css/main.css` is a generated build artifact, not a hand-edited file.** Editing it directly is a trap: the next `npm run build:css` silently regenerates it from `css/src/` and overwrites any direct edit with no warning.

**Actual directory structure** (verify with `find css/src -name '*.css' | sort` if this ever looks stale again):
```
css/
  main.css                 ← generated output (committed, served by GitHub Pages — DO NOT hand-edit)
  main.min.css             ← minified output (committed)
  src/
    main.css               ← entry point: @imports below, plus a small "Global base" tail
                              (body reset, .text-decoration-underline and a few other
                              utility classes, reduced-motion media query, *:focus — see below)
    base/
      variables.css        ← :root design tokens
      fonts.css             ← @font-face
      typography.css        ← headings, p, a, lists, link states
    layout/
      grid.css              ← .container, .row, col-*
    components/
      preloader.css, icons.css, featured-numbers.css, sponsors.css,
      avatar.css, forms.css, page-header.css, newsletter.css,
      navigation.css, buttons.css, hero.css, services.css, footer.css,
      projects-cards.css, organizers.css
    utilities/
      shapes.css             ← .shape-* variants + @keyframes
    pages/
      about.css, projects.css
```

Note: `base/reset.css` and `layout/utilities.css` from the original extraction plan were never split out as separate files — that content (body reset, `.text-decoration-underline`, etc.) lives directly in `css/src/main.css`'s "Global base" tail section instead. Functionally equivalent; just not a 1:1 match to the originally planned file layout.

**Build pipeline:**
- Source: `css/src/main.css` (entry point) → `css/src/**/*.css` (partials, via `postcss-import`)
- Generated output: `css/main.css` (committed — required, since GitHub Pages only runs Jekyll, not npm scripts; see [GitHub Pages constraint](#6-github-pages-build-constraint))
- Minified output: `css/main.min.css` (also committed)
- PostCSS config: `postcss.config.js` (postcss-import, autoprefixer, sort/combine media queries, combine duplicated selectors)
- Build command: `npm run build:css` → `scripts/build-css.sh` → `npx postcss css/src/main.css --output css/main.css --config postcss.config.js`

**After changing anything in `css/src/`:** run `npm run build:css && npm run minify:css`, and commit both `css/main.css` and `css/main.min.css` alongside your `css/src/` change. The `build-assets` CI job rebuilds from `css/src/` and diffs against the committed `css/main.css`/`css/main.min.css` — it will fail if you forget either step, and it will *not* catch a direct edit to `css/main.css` that was never applied to the real `css/src/` source (the rebuild just silently overwrites it back to whatever `css/src/` says).

**Critical gotcha — cascade order is load-bearing.** The `*:focus` rule in `css/src/main.css`'s tail is intentionally the last thing in the assembled output, sitting *after* all component focus overrides (lower specificity wins are expected). Do not move it without verifying all component focus styles still apply.

**Note on PostCSS and `*:focus` position.** `postcss-sort-media-queries` collects all `@media` rules and sorts them, which means the assembled `css/main.css` places sorted media queries *after* the `*:focus` rule in the file. This looks wrong but is currently harmless: no `:focus` rules exist inside any `@media` block, so nothing in the media queries overrides the base outline. If you add a `:focus` rule inside a media query in the future, verify it doesn't conflict with `*:focus`. To check: `awk '/^@media/{m=1} m && /:focus/{print NR": "$0} /^}$/{m=0}' css/main.css`

**Critical gotcha — `postcss-combine-duplicated-selectors` cross-file behavior.** Two `.about-image` blocks exist across separate `css/src/` partials and are auto-merged by this plugin at build time (it runs on the assembled output, so cross-file duplicates are still caught). If you touch either, verify the merge still preserves `margin-bottom`.

**Before touching any `css/src/` file:** run `npm run build:css && npm run test:css && npm run lint:css` to establish a baseline. After your change, run the same suite and diff the `css/main.css` output against the baseline to confirm only the intended rules changed.

---

## 5. CSP constraints — no inline styles or scripts

The site enforces a Content Security Policy via `<meta http-equiv="Content-Security-Policy">` in `_layouts/default.html`:

```
style-src 'self'      ← blocks ALL inline style="" attributes
script-src 'self' https://chimpstatic.com https://form-assets.mailchimp.com
```

**This means:** Any `style="..."` attribute in any HTML template will be silently blocked in production. The element will render without the style, which can cause layout regressions. This has already caused one production incident (SVG sprite became visible, white gap appeared above nav).

**Prevention:** `npm run lint:csp` (runs `scripts/lint-csp-inline.sh`) scans all HTML source templates for `style="` attributes and fails if any are found. This runs as part of `npm run lint` in CI.

**If you need to hide something:** Add a CSS class to `css/main.css` and use that class instead of `style="display:none"`.

**Note:** `Content-Security-Policy-Report-Only` cannot be delivered via `<meta>` tag — browsers ignore it. GitHub Pages does not support custom HTTP headers. The `lint:csp` script is the substitute.

---

## 6. GitHub Pages build constraint

**GitHub Pages does not run `npm run build:css` or any npm scripts.** It only runs Jekyll. This means:

- `css/main.css` (assembled PostCSS output) must be committed to git
- `css/main.min.css` (minified) must be committed to git
- `js/optimized-bundle.min.js` (minified) must be committed to git

After any change to `css/main.css` source or `js/optimized-bundle.js`, you must run `npm run minify` and commit the minified output. The `build-assets` CI job enforces this by rebuilding and diffing.

CSS modularization is complete: `css/src/main.css` is the entry point, and `npm run build:css` writes the assembled output to `css/main.css` — commit that file (and `css/main.min.css`) alongside any `css/src/` change. See [§4](#4-css-architecture--modularized-source-generated-output).

---

## 7. JavaScript files

| File | Purpose | Notes |
| ------ | --------- | ------- |
| `js/optimized-bundle.js` | Main site JS (preloader, scroll nav, smooth scroll, lazy loading) | Source file; minified to `optimized-bundle.min.js` via `npm run minify:js` |
| `js/projects.js` | Fetches and renders project cards, GitHub API integration, filter bar | Runs only on `projects.html`; has `r.ok` checks and null guards on all DOM ops |
| `js/nav-toggle.js` | Mobile nav button toggle — open/close, outside-click dismiss, Escape key | Tiny; no dependencies |
| `js/mailchimp-embed.js` | Injects Mailchimp signup script | Extracted from inline script for CSP compliance |
| `js/projects.json` | Featured project data | Consumed by `projects.js` |
| `js/github_overrides.json` | Per-repo display overrides for GitHub API results | Consumed by `projects.js`; failures logged to console but fall back to `{}` |

The JS files do not have a monolith problem. `optimized-bundle.js` is already well-structured with named functions and a clean `init()` orchestrator.

---

## 8. Navigation toggle

The mobile nav toggle uses a `<button>` with `aria-expanded` / `aria-controls` (since PR #111). Do not revert to the old CSS-only `<input type="checkbox">` pattern.

**How it works:**
- `_includes/header.html`: `<button id="nav-toggle-btn" aria-expanded="false" aria-controls="navbarNav">`
- `js/nav-toggle.js`: toggles `.is-open` class on `#navbarNav`, updates `aria-expanded`
- `css/main.css`: `.navbar-collapse.is-open { display: flex; ... }` (inside mobile media query)

**Why not CSS-only?** The checkbox pattern exposes the element as a form control to screen readers ("checkbox, not checked") instead of a button ("button, collapsed"). The button pattern is the correct ARIA implementation.

---

## 9. Dormant files — do not activate

**`_includes/critical-css.html`** — Contains a hand-copied inline `<style>` block with subsets of hero, nav, button, and font CSS. It is **not included anywhere** in layouts or pages. Do not `{% include critical-css.html %}` without first:
1. Verifying the inline styles are still accurate (they drift from `css/main.css` without automation)
2. Generating a CSP hash for the `<style>` block (required since `style-src 'self'` blocks inline `<style>` tags)
3. Adding that hash to the CSP in `_layouts/default.html`

---

## 10. E2E testing — Playwright setup and maintenance

### What exists

`tests/e2e/newsletter-form.spec.js` — 84-line Playwright spec that runs 8 tests per page across `/`, `/about.html`, and `/projects.html` (24 tests total). It covers: section visibility, email input attributes, subscribe button, honeypot field and hiding, form action/method/target, browser-side validation (empty and invalid email), and valid email acceptance.

**CI job:** `.github/workflows/e2e.yml` (`e2e` job) — builds the site fresh, installs Chromium, then runs `npm run test:e2e`.

**Config:** `playwright.config.js`
- `testDir: ./tests/e2e`, `baseURL: http://127.0.0.1:4000`
- Chromium only; 2 retries in CI, 0 locally
- `webServer`: starts `bundle exec jekyll serve --no-watch --skip-initial-build` locally; reuses an existing server if one is running

### Running locally

```bash
# First time only — install Chromium
npx playwright install chromium

# Build the site first (--skip-initial-build means Playwright won't build it)
bundle exec jekyll build

# Run all E2E tests
npm run test:e2e

# Run with the interactive UI (useful when writing new specs)
npx playwright test --ui
```

**Gotcha:** `playwright.config.js` passes `--skip-initial-build` to Jekyll so the dev server starts fast. This means if you haven't built recently, tests will run against stale HTML. Always rebuild before running E2E locally when you've changed templates or CSS.

### Maintenance expectations

**E2E coverage is a standing priority.** Gaps should be closed, not tracked indefinitely. If a feature has interactive behaviour and no spec, write one before the next unrelated PR merges.

**When adding a new feature or template change:** Write a corresponding E2E spec (or extend an existing one) before merging. The newsletter spec is the model — test the component's presence, key attributes, and user interactions. Do not just test that an element exists; test that it behaves correctly.

**When extracting CSS (Phase 2, 3, 4 modularization):** Add a smoke-test spec that verifies the extracted component still renders. At minimum: visible on the page, no obvious layout collapse. See the Phase 1 spec pattern as a reference — check that key elements have non-zero dimensions and are within the viewport.

**When modifying `_includes/` or `_layouts/`:** Check whether any existing spec covers the changed element. If the change touches an ID or class that a spec locates by, update the spec. Broken locators silently pass in Playwright if the element is simply absent — use `toBeVisible()` not just `toBeAttached()`.

**When the E2E job fails in CI:** The most common causes are a stale Jekyll build (the CI step builds fresh, so this is rarely the issue there) or a broken locator after an HTML change. Run `npm run test:e2e` locally against the latest build to reproduce, then fix the spec or the HTML.

### Spec file location

All E2E specs live in `tests/e2e/`. Name files `<feature>.spec.js`. One spec file per feature area. The CI workflow picks up any `*.spec.js` under that directory automatically.

---

## 11. Key conventions

**Shell scripts:** Use tabs for indentation (shfmt requirement). Run `shfmt -w <script>` before committing.

**Commit messages:** Conventional Commits format — `type(scope): description`. Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `ci`. Always add `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` when AI-assisted.

**CSS changes:** After modifying `css/main.css`, always run `npm run minify:css` and commit `css/main.min.css` in the same commit or PR.

**New shell scripts:** Must pass `shfmt` (tabs) and `shellcheck`. Add to `scripts/` directory. Mark executable with `chmod +x`. Wire into `package.json` if it should run in CI.

**PR size:** Keep PRs focused. One logical change per PR. The `build-assets` check will catch forgotten minification.

**Required check names:** Branch protection uses the job's `name:` display field, not the YAML job key. If you rename a job's `name:`, update the required status checks in branch protection settings.
