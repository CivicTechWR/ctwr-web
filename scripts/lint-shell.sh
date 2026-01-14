#!/bin/bash
set -euo pipefail

# Lint Shell scripts
if command -v shellcheck &> /dev/null; then
  FILES=$(git ls-files "*.sh")
  if [ -z "$FILES" ]; then
    echo "No shell scripts to lint."
    exit 0
  fi
  shellcheck $FILES
else
  echo "shellcheck not found, skipping..."
fi
