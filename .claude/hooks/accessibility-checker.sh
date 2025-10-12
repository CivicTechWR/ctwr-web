#!/usr/bin/env bash

# Read the tool input from stdin
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Check if it's an HTML file
if [[ "$FILE_PATH" != *.html ]]; then
  exit 0
fi

echo "🔍 Running accessibility checks on $FILE_PATH..."

# Check for basic accessibility issues
if command -v axe &>/dev/null; then
  echo "Running axe-core accessibility scan..."
  axe "$FILE_PATH" --format json 2>/dev/null | jq -r '.violations[] | "⚠️ " + .id + ": " + .description'
  echo "✅ Accessibility scan completed" >&2
else
  # Basic checks without axe
  echo "Running basic accessibility checks..."

  # Check for missing alt attributes
  if grep -q '<img[^>]*>' "$FILE_PATH" && ! grep -q 'alt=' "$FILE_PATH"; then
    echo "⚠️ Images without alt attributes found" >&2
  fi

  # Check for missing labels
  if grep -q '<input[^>]*>' "$FILE_PATH" && ! grep -q 'aria-label\|<label' "$FILE_PATH"; then
    echo "⚠️ Form inputs without labels found" >&2
  fi

  echo "✅ Basic accessibility checks completed" >&2
fi

exit 0
