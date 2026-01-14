#!/bin/bash
set -euo pipefail

# Lint YAML files
mapfile -t FILES < <(git ls-files "*.yml" "*.yaml")
if [ ${#FILES[@]} -eq 0 ]; then
	echo "No YAML files to lint."
	exit 0
fi

npx yaml-lint "${FILES[@]}"
