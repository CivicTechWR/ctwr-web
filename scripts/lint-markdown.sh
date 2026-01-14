#!/bin/bash
set -euo pipefail

# Lint Markdown files
mapfile -t FILES < <(git ls-files "*.md")
if [ ${#FILES[@]} -eq 0 ]; then
	echo "No Markdown files to lint."
	exit 0
fi

npx markdownlint-cli --config .markdownlint.json "${FILES[@]}"
