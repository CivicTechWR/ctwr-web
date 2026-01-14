#!/bin/bash
set -euo pipefail

# Lint JSON files
FILES=$(git ls-files "*.json")
if [ -z "$FILES" ]; then
  echo "No JSON files to lint."
  exit 0
fi

for file in $FILES; do
  node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))"
done

echo "JSON lint passed."
