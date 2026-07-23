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
