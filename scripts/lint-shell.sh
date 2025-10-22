#!/usr/bin/env bash

set -euo pipefail

files=()
while IFS= read -r file; do
  files+=("$file")
done < <(git ls-files 'scripts/*.sh' 'scripts/**/*.sh' 2>/dev/null | sort -u || true)

if [ ${#files[@]} -eq 0 ]; then
  echo "No shell scripts to lint."
  exit 0
fi

shellcheck --severity=error "${files[@]}"
