#!/bin/bash
set -euo pipefail

# Lint Shell scripts
if command -v shellcheck &>/dev/null; then
	mapfile -t FILES < <(git ls-files "*.sh")
	if [ ${#FILES[@]} -eq 0 ]; then
		echo "No shell scripts to lint."
		exit 0
	fi
	shellcheck "${FILES[@]}"
else
	echo "shellcheck not found, skipping..."
fi
