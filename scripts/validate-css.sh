#!/bin/bash

echo "🔍 Validating CSS architecture..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Initialize error count
ERRORS=0

# Check for !important (should only be in utility files)
echo "Checking !important declarations..."
# shellcheck disable=SC2126
IMPORTANT_COUNT=$(grep -r "!important" css --include="*.css" --exclude-dir="_site" --exclude="*.min.css" | wc -l | tr -d ' ')
# shellcheck disable=SC2126
IMPORTANT_IN_UTILITIES=$(grep -r "!important" css/base/fallbacks.css css/loading-strategy.css 2>/dev/null | wc -l | tr -d ' ')
# shellcheck disable=SC2126
IMPORTANT_IN_COMPONENTS=$(grep -r "!important" css/components --include="*.css" --exclude="*.min.css" 2>/dev/null | grep -v "NO !important" | grep -v "^\s*//" | wc -l | tr -d ' ')

echo "  Total !important: $IMPORTANT_COUNT"
echo "  In utilities: $IMPORTANT_IN_UTILITIES"
echo "  In components: $IMPORTANT_IN_COMPONENTS"

if [ "$IMPORTANT_IN_COMPONENTS" -gt 0 ]; then
  echo -e "  ${RED}❌ Found $IMPORTANT_IN_COMPONENTS !important in component files (should be 0)${NC}"
  grep -r "!important" css/components --include="*.css" --exclude="*.min.css" -n 2>/dev/null
  ((ERRORS++))
else
  echo -e "  ${GREEN}✅ No !important in component files${NC}"
fi

echo ""

# Check for duplicate variable definitions in component files
echo "Checking for CSS variable definitions in component files..."
# shellcheck disable=SC2126
VAR_IN_COMPONENTS=$(grep -rl "^:root" css/components css/pages --include="*.css" --exclude="*.min.css" 2>/dev/null | wc -l | tr -d ' ')

if [ "$VAR_IN_COMPONENTS" -gt 0 ]; then
  echo -e "  ${RED}❌ Found :root definitions in component/page files (should be in base/variables.css only)${NC}"
  grep -rl "^:root" css/components css/pages --include="*.css" --exclude="*.min.css" 2>/dev/null
  ((ERRORS++))
else
  echo -e "  ${GREEN}✅ No variables in component files${NC}"
fi

# Check that base/variables.css exists
if [ -f "css/base/variables.css" ]; then
  echo -e "  ${GREEN}✅ Primary variables file exists (base/variables.css)${NC}"
else
  echo -e "  ${RED}❌ base/variables.css not found${NC}"
  ((ERRORS++))
fi

echo ""

# Check style.css size
echo "Checking style.css optimization..."
if [ -f "css/style.css" ]; then
  STYLE_SIZE=$(wc -l <css/style.css | tr -d ' ')
  echo "  style.css: $STYLE_SIZE lines"

  if [ "$STYLE_SIZE" -gt 200 ]; then
    echo -e "  ${YELLOW}⚠️  style.css is larger than target (goal: <200 lines)${NC}"
  else
    echo -e "  ${GREEN}✅ style.css is optimized${NC}"
  fi
else
  echo -e "  ${RED}❌ style.css not found${NC}"
  ((ERRORS++))
fi

echo ""

# Check for profile.css component
echo "Checking for new profile.css component..."
if [ -f "css/components/profile.css" ]; then
  echo -e "  ${GREEN}✅ profile.css component exists${NC}"
else
  echo -e "  ${RED}❌ profile.css component not found${NC}"
  ((ERRORS++))
fi

echo ""

# Check main.css includes profile.css
echo "Checking main.css imports..."
if grep -q "profile.css" css/main.css 2>/dev/null; then
  echo -e "  ${GREEN}✅ main.css imports profile.css${NC}"
else
  echo -e "  ${RED}❌ main.css does not import profile.css${NC}"
  ((ERRORS++))
fi

echo ""

# Count component files
echo "Checking component architecture..."
# shellcheck disable=SC2126
COMPONENT_COUNT=$(find css/components -name "*.css" -not -name "*.min.css" 2>/dev/null | wc -l | tr -d ' ')
echo "  Component files: $COMPONENT_COUNT"

if [ "$COMPONENT_COUNT" -ge 16 ]; then
  echo -e "  ${GREEN}✅ Good component separation${NC}"
else
  echo -e "  ${YELLOW}⚠️  Expected at least 16 component files${NC}"
fi

echo ""

# Summary
echo "================================"
if [ "$ERRORS" -eq 0 ]; then
  echo -e "${GREEN}✅ All CSS validation checks passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Found $ERRORS validation errors${NC}"
  exit 1
fi
