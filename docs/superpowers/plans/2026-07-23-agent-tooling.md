# Agent Tooling (AGENTS.md, Makefile, ground-truth.json) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a cross-tool AGENTS.md pointer, a Makefile that mirrors the required CI checks as local commands, and an on-demand script that re-derives verifiable facts about the repo (`ground-truth.json`) instead of relying on prose that can drift.

**Architecture:** Three independent, additive files plus one `.gitignore` entry. No existing file is modified. AGENTS.md points at CLAUDE.md rather than duplicating it. The Makefile is a thin wrapper over existing `npm run` / `bundle` commands — no new build logic. The ground-truth script does all its verification via temp-file diffs so it never touches the working tree.

**Tech Stack:** Bash (matching `scripts/*.sh` conventions: tabs, `set -euo pipefail`, passes `shfmt`/`shellcheck`), GNU Make, `jq` for JSON construction, `gh` CLI for branch-protection lookups.

**Branch:** `feat/agent-tooling` (already created; contains the approved design spec at `docs/superpowers/specs/2026-07-23-agent-tooling-design.md`, commit `f5ad1a9`). Work directly on this branch.

## Global Constraints

- Shell scripts: bash, **tabs** for indentation, must pass `shfmt -d` (no diff output) and `shellcheck` (no findings) — per CLAUDE.md §11.
- Markdown files: must pass `npx markdownlint-cli --config .markdownlint.json <file>` — the repo's `lint:md` picks up any tracked `*.md` automatically via `git ls-files`, no wiring needed.
- Makefile: must pass `checkmake Makefile` with zero violations. Checkmake's `minphony` rule requires an `all` target to exist and be declared `.PHONY` — confirmed empirically during planning (a draft without `all` failed with `minphony: Required target "all" is missing`; adding `all: build` fixed it).
- `ground-truth.json` is **gitignored, not committed** — add it to `.gitignore` in this same pass.
- The ground-truth script must never write to any tracked file — all build/minify checks happen against files in a `mktemp -d` directory, diffed against the committed originals.
- No existing file is modified except `.gitignore` (one line added). This is additive-only work.
- Repo is `CivicTechWR/ctwr-web`. The `gh` CLI is already authenticated in this environment as `BreakableHoodie`.

---

### Task 1: AGENTS.md

**Files:**
- Create: `AGENTS.md`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed by later tasks — this is a standalone deliverable.

- [ ] **Step 1: Create `AGENTS.md`**

```markdown
# Agent Instructions

This project's agent instructions, architecture notes, and contributor
guardrails live in [CLAUDE.md](./CLAUDE.md).

Read that file first — it is the single maintained source of truth for AI
coding agents working in this repository (Claude Code, Codex, Cursor,
GitHub Copilot, etc.).
```

- [ ] **Step 2: Verify it passes the repo's markdown linter**

Run: `npx markdownlint-cli --config .markdownlint.json AGENTS.md`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add AGENTS.md pointing to CLAUDE.md

Cross-tool agent-instructions convention (Codex, Cursor, Copilot, etc.
look for AGENTS.md). Kept as a thin pointer rather than a duplicate to
avoid the two files drifting out of sync with each other.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Makefile

**Files:**
- Create: `Makefile`

**Interfaces:**
- Consumes: nothing directly, but the `groundtruth` target's recipe calls `bash scripts/generate-ground-truth.sh`, which Task 3 creates. The Makefile can be committed before that script exists — `make groundtruth` just won't work until Task 3 lands — but do not run `make groundtruth` for real until Task 3 is done (Step 3 below only checks the recipe is *wired correctly*, not that the script runs).
- Produces: the target names `all`, `help`, `install`, `build`, `lint`, `test`, `e2e`, `ci`, `serve`, `groundtruth`, `clean` — later tasks and the final integration task refer to these exact names.

- [ ] **Step 1: Create `Makefile`**

```makefile
.PHONY: all help install build lint test e2e ci serve groundtruth clean

all: build ## Default target: build the site

help: ## Show this help
	@echo "Available targets: all install build lint test e2e ci serve groundtruth clean"

install: ## Install Ruby gems and npm dependencies
	bundle install
	npm ci

build: ## Build the production site (minify assets, JEKYLL_ENV=production)
	npm run build:prod

lint: ## Run all linters (css, markdown, yaml, json, shell, csp)
	npm run lint

test: ## Run the CSS and Luma test suites
	npm run test

e2e: ## Run the Playwright end-to-end test suite
	npm run test:e2e

ci: lint test build e2e ## Run the full local CI rehearsal

serve: ## Start the local Jekyll dev server with livereload
	npm run serve

groundtruth: ## Regenerate ground-truth.json from current repo state
	bash scripts/generate-ground-truth.sh > ground-truth.json

clean: ## Remove local build byproducts
	rm -rf _site lighthouse-report.json css-analysis.json
```

- [ ] **Step 2: Validate against checkmake**

Run: `checkmake Makefile` (install once via `brew install checkmake` on macOS, or `go install github.com/mrtazz/checkmake/cmd/checkmake@latest` elsewhere — this is a linting tool only, not a project dependency). If neither install path is available in your environment, skip this step: the exact Makefile content above was already validated with checkmake during planning (0 violations, after adding the `all` target to satisfy the `minphony` rule) — CI's super-linter is the final authority regardless.
Expected: exit code 0, no violations printed.

- [ ] **Step 3: Confirm target wiring without running slow targets**

Run: `make -n ci`
Expected: prints the shell commands for `lint`, `test`, `build`, `e2e` in that order (via `npm run lint`, `npm run test`, `npm run build:prod`, `npm run test:e2e`) without executing any of them (`-n` is Make's dry-run flag).

Run: `make help`
Expected: prints `Available targets: all install build lint test e2e ci serve groundtruth clean`.

- [ ] **Step 4: Commit**

```bash
git add Makefile
git commit -m "chore: add Makefile wrapping existing npm/bundle commands

Thin convenience layer only — no new build logic. 'make ci' mirrors
CLAUDE.md's existing 'run lint + tests + build locally before every
commit' guidance as a single command instead of five.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: `scripts/generate-ground-truth.sh` + `.gitignore`

**Files:**
- Create: `scripts/generate-ground-truth.sh`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: a script at `scripts/generate-ground-truth.sh` that, when run from anywhere (it `cd`s to the repo root itself via `git rev-parse --show-toplevel`), prints a single JSON object to stdout with top-level keys `generated_at`, `commit`, `css_modularization`, `build_assets_sync`, `dormant_files`, `branch_protection_required_checks`, `e2e_specs`. This exact shape is what Task 2's `groundtruth` Makefile target redirects into `ground-truth.json`.

**Note on schema vs. the design spec:** the spec's illustrative JSON listed `build_assets_sync.main_css_matches` alongside `main_min_css_matches`/`js_bundle_min_matches`. That field is intentionally dropped here — it would duplicate `css_modularization.build_matches_committed`, which already answers exactly the same question (does a fresh build of `css/main.css` from `css/src/` match the committed file). All three files the spec named are still checked, just not twice: `css/main.css` → `css_modularization.build_matches_committed`, `css/main.min.css` → `build_assets_sync.main_min_css_matches`, `js/optimized-bundle.min.js` → `build_assets_sync.js_bundle_min_matches`.

- [ ] **Step 1: Create `scripts/generate-ground-truth.sh`**

```bash
#!/bin/bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

commit="$(git rev-parse HEAD)"
generated_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# --- css_modularization ---
src_dir_exists=false
partial_file_count=0
build_matches_committed=false

if [ -d css/src ]; then
	src_dir_exists=true
	partial_file_count="$(find css/src -name '*.css' | wc -l | tr -d ' ')"

	if [ -f css/src/main.css ]; then
		if npx postcss css/src/main.css --output "$tmp_dir/main.css" --config postcss.config.js >/dev/null 2>&1; then
			if diff -q "$tmp_dir/main.css" css/main.css >/dev/null 2>&1; then
				build_matches_committed=true
			fi
		fi
	fi
fi

# --- build_assets_sync ---
main_min_css_matches=false
js_bundle_min_matches=false

if [ -f css/main.css ]; then
	if npx cleancss -o "$tmp_dir/main.min.css" css/main.css >/dev/null 2>&1; then
		if diff -q "$tmp_dir/main.min.css" css/main.min.css >/dev/null 2>&1; then
			main_min_css_matches=true
		fi
	fi
fi

if [ -f js/optimized-bundle.js ]; then
	if npx terser js/optimized-bundle.js -o "$tmp_dir/optimized-bundle.min.js" --compress --mangle >/dev/null 2>&1; then
		if diff -q "$tmp_dir/optimized-bundle.min.js" js/optimized-bundle.min.js >/dev/null 2>&1; then
			js_bundle_min_matches=true
		fi
	fi
fi

# --- dormant_files ---
critical_css_referenced=false
if grep -rl "critical-css" _layouts _includes --include="*.html" 2>/dev/null | grep -v "_includes/critical-css.html" | grep -q .; then
	critical_css_referenced=true
fi

# --- branch_protection_required_checks ---
required_checks_json="null"
if gh auth status >/dev/null 2>&1; then
	if checks="$(gh api repos/CivicTechWR/ctwr-web/branches/main/protection/required_status_checks --jq '[.checks[].context]' 2>/dev/null)"; then
		required_checks_json="$checks"
	fi
fi

# --- e2e_specs ---
mapfile -t e2e_files < <(git ls-files 'tests/e2e/*.spec.js' | xargs -n1 basename | sort)
e2e_count="${#e2e_files[@]}"
if [ "$e2e_count" -eq 0 ]; then
	e2e_files_json="[]"
else
	e2e_files_json="$(printf '%s\n' "${e2e_files[@]}" | jq -R . | jq -s .)"
fi

jq -n \
	--arg generated_at "$generated_at" \
	--arg commit "$commit" \
	--argjson src_dir_exists "$src_dir_exists" \
	--argjson partial_file_count "$partial_file_count" \
	--argjson build_matches_committed "$build_matches_committed" \
	--argjson main_min_css_matches "$main_min_css_matches" \
	--argjson js_bundle_min_matches "$js_bundle_min_matches" \
	--argjson critical_css_referenced "$critical_css_referenced" \
	--argjson required_checks "$required_checks_json" \
	--argjson e2e_count "$e2e_count" \
	--argjson e2e_files "$e2e_files_json" \
	'{
		generated_at: $generated_at,
		commit: $commit,
		css_modularization: {
			src_dir_exists: $src_dir_exists,
			partial_file_count: $partial_file_count,
			build_matches_committed: $build_matches_committed
		},
		build_assets_sync: {
			main_min_css_matches: $main_min_css_matches,
			js_bundle_min_matches: $js_bundle_min_matches
		},
		dormant_files: {
			critical_css_html_referenced: $critical_css_referenced
		},
		branch_protection_required_checks: $required_checks,
		e2e_specs: {
			count: $e2e_count,
			files: $e2e_files
		}
	}'
```

- [ ] **Step 2: Make it executable and lint it**

Run:
```bash
chmod +x scripts/generate-ground-truth.sh
shfmt -d scripts/generate-ground-truth.sh
shellcheck scripts/generate-ground-truth.sh
```
Expected: `shfmt -d` prints nothing (no formatting diff), `shellcheck` prints nothing (exit 0).

- [ ] **Step 3: Run it for real and verify output + no working-tree mutation**

Run:
```bash
bash scripts/generate-ground-truth.sh | jq empty && echo "valid json"
git status --short
```
Expected: `valid json` printed, and `git status --short` shows nothing beyond whatever this task has already staged/committed so far — specifically, `css/main.css`, `css/main.min.css`, and `js/optimized-bundle.js`/`.min.js` must show **no** modifications. (This was already verified once during planning against the real repo — reproduce it here as part of the task's own test cycle, not just trust the planning-time run.)

- [ ] **Step 4: Add `ground-truth.json` to `.gitignore`**

Add this line under the existing `# Analysis files` section at the bottom of `.gitignore`:

```
ground-truth.json
```

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-ground-truth.sh .gitignore
git commit -m "feat: add ground-truth.json generator script

Re-derives verifiable facts about the repo (CSS modularization state,
build/minify sync, dormant-file references, branch-protection required
checks, e2e spec inventory) on demand instead of relying on prose that
can drift — CLAUDE.md §4 was found stale by exactly this kind of check
during this session's site audit. Output is gitignored; it's a
verification tool, not a document.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Integration check

**Files:** none created or modified — this task only runs and verifies.

**Interfaces:**
- Consumes: `make groundtruth` (Task 2) invoking `scripts/generate-ground-truth.sh` (Task 3).
- Produces: nothing for later tasks — this is the final verification before handoff.

- [ ] **Step 1: Run the Makefile target end-to-end**

Run: `make groundtruth`
Expected: creates `ground-truth.json` in the repo root with no errors.

- [ ] **Step 2: Confirm the output file is untracked, not staged**

Run: `git status --short`
Expected: shows `?? ground-truth.json` (untracked, thanks to the `.gitignore` entry from Task 3) and nothing else.

- [ ] **Step 3: Confirm the new files pass the full lint pipeline as CI would run it, through the Makefile itself**

Run: `make lint`
Expected: exits 0 (this runs `npm run lint` via the Task 2 Makefile target, so it verifies both that the new files pass lint *and* that the `lint` target is wired correctly). This exercises `lint:md` (covers `AGENTS.md`), `lint:shell` (covers `scripts/generate-ground-truth.sh`), and the others — none of which should be affected by these additions, but this confirms it rather than assuming it.

- [ ] **Step 4: Clean up the local verification artifact**

Run: `rm ground-truth.json`

(No commit needed for this task — nothing new was created in the working tree once the artifact is removed. `git status --short` should now be empty.)

---

## After this plan

This plan ends with a clean `feat/agent-tooling` branch, four commits ahead of `main`, ready to push. Pushing and opening a PR is a separate decision — surface it to the user rather than doing it automatically (this repo's branch protection and code-owner-review requirements mean a PR is the only path to `main` anyway).
