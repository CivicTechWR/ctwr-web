#!/usr/bin/env bash

set -euo pipefail

files=()
while IFS= read -r file; do
  files+=("$file")
done < <(git ls-files '*.json' | grep -v '^node_modules/' | grep -v '^_site/' || true)

if [ ${#files[@]} -eq 0 ]; then
  echo "No JSON files to lint."
  exit 0
fi

for file in "${files[@]}"; do
  jsonlint --quiet "$file"
done
