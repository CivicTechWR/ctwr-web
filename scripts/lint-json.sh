#!/bin/bash
set -euo pipefail

# Lint JSON files (JSONC files like .vscode/settings.json are excluded — they allow comments)
FILES=$(git ls-files "*.json" | grep -v '^\.vscode/')
if [ -z "$FILES" ]; then
	echo "No JSON files to lint."
	exit 0
fi

for file in $FILES; do
        # Skip Jekyll Liquid templates (files with YAML front matter)
        if head -1 "$file" | grep -q '^---'; then
                continue
        fi
        node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))"
done

echo "JSON lint passed."
