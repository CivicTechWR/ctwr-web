#!/bin/bash
# Scan HTML source files for inline style= attributes.
# style-src 'self' in the CSP blocks all inline styles, so any style=""
# attribute in a template will cause a silent visual regression in production.
set -euo pipefail

SEARCH_DIRS=("_includes" "_layouts")
PAGE_FILES=(*.html)
VIOLATIONS=0

check_file() {
	local file="$1"
	local matches
	# Exclude SVG path/polygon/rect attributes that use style legitimately
	matches=$(grep -n 'style="' "$file" 2>/dev/null || true)
	if [ -n "$matches" ]; then
		echo "VIOLATION: $file"
		echo "$matches"
		VIOLATIONS=$((VIOLATIONS + 1))
	fi
}

for dir in "${SEARCH_DIRS[@]}"; do
	if [ -d "$dir" ]; then
		while IFS= read -r -d '' file; do
			check_file "$file"
		done < <(find "$dir" -name "*.html" -print0)
	fi
done

for file in "${PAGE_FILES[@]}"; do
	[ -f "$file" ] && check_file "$file"
done

if [ "$VIOLATIONS" -gt 0 ]; then
	echo ""
	echo "ERROR: $VIOLATIONS file(s) contain inline style= attributes."
	echo "The CSP (style-src 'self') blocks inline styles in production."
	echo "Move styles to a CSS class in css/main.css instead."
	exit 1
fi

echo "CSP inline style check passed — no inline style= attributes found."
