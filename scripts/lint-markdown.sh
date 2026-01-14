#!/bin/bash
set -euo pipefail

# Lint Markdown files
FILES=$(git ls-files "*.md")
if [ -z "$FILES" ]; then
  echo "No Markdown files to lint."
  exit 0
fi

npx markdownlint-cli --config .markdownlint.json $FILES
