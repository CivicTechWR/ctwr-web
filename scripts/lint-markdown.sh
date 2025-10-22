#!/usr/bin/env bash

set -euo pipefail

# Collect tracked Markdown files excluding generated directories
files=()
while IFS= read -r file; do
  files+=("$file")
done < <(git ls-files '*.md' '*.markdown' | grep -v '^node_modules/' | grep -v '^_site/' || true)

if [ ${#files[@]} -eq 0 ]; then
  echo "No Markdown files to lint."
  exit 0
fi

markdownlint -c .markdownlint.json "${files[@]}"
