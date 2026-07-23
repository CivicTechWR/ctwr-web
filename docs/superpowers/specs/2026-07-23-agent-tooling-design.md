# Agent tooling: AGENTS.md, Makefile, ground-truth.json

Date: 2026-07-23
Status: Approved

## Context

A full-site audit (accessibility, security, performance, SEO, code quality)
run this session found that CLAUDE.md §4 (CSS modularization plan) was
stale: it described the modularization as "planned but not executed," but
the work actually completed on 2026-05-28 across four merged PRs. The doc
wasn't updated when the code that resolved it landed.

That prompted three related additions: a cross-tool agent-instructions
pointer, a unified local command interface, and a script that re-derives
verifiable facts about the repo on demand — so the next "is X actually
still true" question can be answered by running a command instead of
trusting prose.

## 1. AGENTS.md

A thin pointer file at the repo root, not a duplicate of CLAUDE.md:

```markdown
# Agent Instructions

This project's agent instructions, architecture notes, and contributor
guardrails live in [CLAUDE.md](./CLAUDE.md).

Read that file first — it is the single maintained source of truth for AI
coding agents working in this repository (Claude Code, Codex, Cursor,
GitHub Copilot, etc.).
```

**Rationale:** CLAUDE.md is already the actively maintained source of truth
(11 sections, edited as recently as 2026-06-22) and this project's daily
driver is Claude Code. AGENTS.md is an emerging cross-tool convention some
agents look for instead of CLAUDE.md. Duplicating full content into a
second file would recreate the exact staleness risk this whole effort is
meant to reduce; a pointer avoids it entirely.

## 2. Makefile

A thin wrapper over existing `package.json` scripts and `bundle` commands —
no new build logic, just a shorter, memorable entry point that mirrors the
required CI checks by name.

```makefile
.PHONY: help install build lint test e2e ci serve groundtruth clean

help:
    @echo "Available targets: install build lint test e2e ci serve groundtruth clean"

install:
    bundle install
    npm ci

build:
    npm run build:prod

lint:
    npm run lint

test:
    npm run test

e2e:
    npm run test:e2e

ci: lint test build e2e

serve:
    npm run serve

groundtruth:
    bash scripts/generate-ground-truth.sh > ground-truth.json

clean:
    rm -rf _site lighthouse-report.json css-analysis.json
```

**Rationale:** CLAUDE.md's engineering-hygiene doctrine already says "run
lint + tests + build locally before every commit." Today that's five
separate `npm run` invocations to remember; `make ci` makes it one.

## 3. ground-truth.json

Generated on demand by `scripts/generate-ground-truth.sh` (bash, tabs,
passes `shfmt`/`shellcheck` — matching every existing script in
`scripts/`). **Gitignored, not committed** — it is a verification tool
regenerated fresh each run, not a document. Committing it would let it go
stale exactly like CLAUDE.md §4 did.

Each run is tied to a specific commit so a stale run is self-evidently
stale:

```json
{
  "generated_at": "2026-07-23T00:00:00Z",
  "commit": "<git rev-parse HEAD>",
  "css_modularization": {
    "src_dir_exists": true,
    "partial_file_count": 23,
    "build_matches_committed": true
  },
  "build_assets_sync": {
    "main_css_matches": true,
    "main_min_css_matches": true,
    "js_bundle_min_matches": true
  },
  "dormant_files": {
    "critical_css_html_referenced": false
  },
  "branch_protection_required_checks": [
    "super-linter", "htmlhint", "node-lint", "css-tests",
    "build-assets", "pa11y", "Scan for committed secrets",
    "Scan Ruby gems for vulnerabilities"
  ],
  "e2e_specs": {
    "count": 7,
    "files": [
      "css-phase1-smoke.spec.js", "css-phase2-smoke.spec.js",
      "css-phase3-smoke.spec.js", "css-phase4-smoke.spec.js",
      "navigation.spec.js", "newsletter-form.spec.js",
      "projects-filter.spec.js"
    ]
  }
}
```

Script behavior:
- `css_modularization`: checks `css/src/` exists, counts partials. Note
  `scripts/build-css.sh` always writes to `css/main.css` in place (it calls
  `postcss css/src/main.css --output css/main.css`) — it has no "build
  somewhere else" mode. To check sync without touching the working tree,
  the ground-truth script calls `npx postcss css/src/main.css --output
  <tmpfile> --config postcss.config.js` directly (same underlying command,
  different `--output` target) and diffs `<tmpfile>` against the committed
  `css/main.css`. The real `css/main.css` is never written to.
- `build_assets_sync`: same direct-postcss-to-tempfile approach for
  `css/main.min.css` (via `cleancss`) and `js/optimized-bundle.min.js` (via
  `terser`), mirroring what the `build-assets` CI job checks, again without
  writing to the real files.
- `dormant_files`: greps `_layouts/` and `_includes/` for
  `critical-css` references.
- `branch_protection_required_checks`: `gh api
  repos/CivicTechWR/ctwr-web/branches/main/protection/required_status_checks`
  — read-only, requires `gh auth status` to succeed; if `gh` isn't
  authenticated, this field is omitted with a note rather than failing the
  whole script.
- `e2e_specs`: lists `tests/e2e/*.spec.js`.

Non-goals for this iteration (explicitly out of scope, can be added later
if they prove valuable): no CI job enforcing ground-truth.json is in sync,
no automatic CLAUDE.md drift detection/diffing against it, no coverage of
every doc claim in CLAUDE.md — only the specific fact categories listed
above.

## Testing

- `shfmt -d scripts/generate-ground-truth.sh` and `shellcheck
  scripts/generate-ground-truth.sh` must pass, per this repo's shell-script
  convention.
- Manual run of `make groundtruth` must produce valid JSON and each field
  must match manual verification (e.g. `find css/src -name '*.css' | wc -l`
  for `partial_file_count`).
- `make ci` must actually run all four steps in order and fail fast on the
  first failure (standard `make` behavior with sequential prerequisites).
- No existing npm script, CI workflow, or file is modified — this is
  additive only.
