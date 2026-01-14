#!/bin/bash
set -euo pipefail

# Lint YAML files
FILES=$(git ls-files "*.yml" "*.yaml")
if [ -z "$FILES" ]; then
  echo "No YAML files to lint."
  exit 0
fi

npx yaml-lint $FILES
