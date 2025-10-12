#!/usr/bin/env bash

# Read the tool input from stdin
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

# Only run on git commit commands
if [[ "$COMMAND" != *"git commit"* ]]; then
  exit 0
fi

echo "🔍 Running pre-commit validations..."

# Check for staged files
STAGED_FILES=$(git diff --cached --name-only 2>/dev/null || echo "")
if [ -z "$STAGED_FILES" ]; then
  echo "No staged files to validate"
  exit 0
fi

echo "Validating staged files: $STAGED_FILES"

# Check for forbidden files
echo "Checking for forbidden files..."
if echo "$STAGED_FILES" | grep -E "\.(env|DS_Store)$|node_modules/"; then
  echo "❌ Forbidden files detected in staging area" >&2
  echo "Remove .env, .DS_Store, or node_modules files before committing" >&2
  exit 2
fi

# Check file sizes
echo "Checking file sizes..."
for file in $STAGED_FILES; do
  if [ -f "$file" ]; then
    size=$(wc -c <"$file")
    if [ "$size" -gt 10485760 ]; then # 10MB limit
      echo "⚠️ Large file detected: $file ($(($size / 1024 / 1024))MB)" >&2
    fi
  fi
done

# Run linting if available
if command -v npm &>/dev/null && [ -f "package.json" ]; then
  echo "Running ESLint..."
  npm run lint 2>/dev/null || echo "⚠️ Linting issues found" >&2
fi

# Run formatting if available
if command -v prettier &>/dev/null; then
  echo "Running Prettier..."
  prettier --check $STAGED_FILES 2>/dev/null || echo "⚠️ Formatting issues found" >&2
fi

# Run tests if available
if command -v npm &>/dev/null && [ -f "package.json" ]; then
  echo "Running tests..."
  npm test 2>/dev/null || echo "⚠️ Tests failed" >&2
fi

echo "✅ Pre-commit validation completed" >&2
exit 0
