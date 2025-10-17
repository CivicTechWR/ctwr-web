#!/bin/bash

# CSS Performance Budget Validation Script
# Validates CSS against performance budgets and generates reports

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Starting CSS Performance Budget Validation...${NC}"

# Load budget configuration
BUDGET_FILE="css-performance-budget.json"
if [ ! -f "$BUDGET_FILE" ]; then
  echo -e "${RED}❌ Budget file not found: $BUDGET_FILE${NC}"
  exit 1
fi

# Create reports directory
mkdir -p reports/css-budget
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
REPORT_FILE="reports/css-budget/validation-${TIMESTAMP}.json"

# Initialize report
cat > "$REPORT_FILE" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "budget": {},
  "metrics": {},
  "violations": [],
  "warnings": [],
  "summary": {
    "status": "unknown",
    "totalViolations": 0,
    "totalWarnings": 0
  }
}
EOF

echo -e "${BLUE}🔍 Analyzing CSS file sizes...${NC}"

# Function to convert size to bytes
size_to_bytes() {
  local size="$1"
  if [[ $size =~ ^([0-9.]+)([KMGT]?B)$ ]]; then
    local num="${BASH_REMATCH[1]}"
    local unit="${BASH_REMATCH[2]}"
    case $unit in
      "KB") echo "$(echo "$num * 1024" | bc)" ;;
      "MB") echo "$(echo "$num * 1024 * 1024" | bc)" ;;
      "GB") echo "$(echo "$num * 1024 * 1024 * 1024" | bc)" ;;
      *) echo "$num" ;;
    esac
  else
    echo "0"
  fi
}

# Function to convert bytes to human readable
bytes_to_human() {
  local bytes="$1"
  if [ "$bytes" -ge 1073741824 ]; then
    echo "$(echo "scale=2; $bytes / 1073741824" | bc)GB"
  elif [ "$bytes" -ge 1048576 ]; then
    echo "$(echo "scale=2; $bytes / 1048576" | bc)MB"
  elif [ "$bytes" -ge 1024 ]; then
    echo "$(echo "scale=2; $bytes / 1024" | bc)KB"
  else
    echo "${bytes}B"
  fi
}

# Analyze main CSS files
echo -e "${BLUE}📏 Measuring main CSS files...${NC}"

# Get total CSS size
TOTAL_CSS_SIZE=$(find css -name "*.css" -not -name "*.min.css" -not -name "*.optimized.css" -exec du -cb {} + | tail -1 | cut -f1)
TOTAL_CSS_HUMAN=$(bytes_to_human $TOTAL_CSS_SIZE)

# Get critical CSS size
CRITICAL_CSS_SIZE=0
if [ -f "css/critical.css" ]; then
  CRITICAL_CSS_SIZE=$(du -cb css/critical.css | tail -1 | cut -f1)
fi
CRITICAL_CSS_HUMAN=$(bytes_to_human $CRITICAL_CSS_SIZE)

# Get minified CSS size
MINIFIED_CSS_SIZE=0
if [ -d "css" ]; then
  MINIFIED_CSS_SIZE=$(find css -name "*.min.css" -exec du -cb {} + 2>/dev/null | tail -1 | cut -f1 || echo "0")
fi
MINIFIED_CSS_HUMAN=$(bytes_to_human $MINIFIED_CSS_SIZE)

# Count component files
COMPONENT_COUNT=$(find css/components -name "*.css" 2>/dev/null | wc -l || echo "0")

# Count custom properties
CUSTOM_PROP_COUNT=$(grep -r "^[[:space:]]*--" css --include="*.css" | wc -l || echo "0")

# Count media queries
MEDIA_QUERY_COUNT=$(grep -r "@media" css --include="*.css" | wc -l || echo "0")

# Count selectors
SELECTOR_COUNT=$(grep -r "^[^@]*{" css --include="*.css" | wc -l || echo "0")

echo -e "${GREEN}📊 CSS Metrics Collected:${NC}"
echo "  Total CSS Size: $TOTAL_CSS_HUMAN"
echo "  Critical CSS Size: $CRITICAL_CSS_HUMAN"
echo "  Minified CSS Size: $MINIFIED_CSS_HUMAN"
echo "  Component Files: $COMPONENT_COUNT"
echo "  Custom Properties: $CUSTOM_PROP_COUNT"
echo "  Media Queries: $MEDIA_QUERY_COUNT"
echo "  Selectors: $SELECTOR_COUNT"

# Load budget limits from JSON
MAX_CSS_SIZE=$(jq -r '.budget.css.maxSize' "$BUDGET_FILE")
MAX_CRITICAL_SIZE=$(jq -r '.budget.criticalCss.maxSize' "$BUDGET_FILE")
MAX_COMPONENT_FILES=$(jq -r '.budget.components.maxFiles' "$BUDGET_FILE")
MAX_CUSTOM_PROPS=$(jq -r '.budget.customProperties.maxCount' "$BUDGET_FILE")
MAX_MEDIA_QUERIES=$(jq -r '.budget.mediaQueries.maxCount' "$BUDGET_FILE")

# Convert budget limits to bytes
MAX_CSS_BYTES=$(size_to_bytes "$MAX_CSS_SIZE")
MAX_CRITICAL_BYTES=$(size_to_bytes "$MAX_CRITICAL_SIZE")

echo -e "${BLUE}🎯 Validating against budget limits...${NC}"

VIOLATIONS=0
WARNINGS=0

# Check CSS size
if [ "$TOTAL_CSS_SIZE" -gt "$MAX_CSS_BYTES" ]; then
  echo -e "${RED}❌ VIOLATION: Total CSS size ($TOTAL_CSS_HUMAN) exceeds budget ($MAX_CSS_SIZE)${NC}"
  ((VIOLATIONS++))
elif [ "$TOTAL_CSS_SIZE" -gt "$(echo "$MAX_CSS_BYTES * 0.9" | bc)" ]; then
  echo -e "${YELLOW}⚠️  WARNING: Total CSS size ($TOTAL_CSS_HUMAN) approaching budget ($MAX_CSS_SIZE)${NC}"
  ((WARNINGS++))
fi

# Check critical CSS size
if [ "$CRITICAL_CSS_SIZE" -gt "$MAX_CRITICAL_BYTES" ]; then
  echo -e "${RED}❌ VIOLATION: Critical CSS size ($CRITICAL_CSS_HUMAN) exceeds budget ($MAX_CRITICAL_SIZE)${NC}"
  ((VIOLATIONS++))
elif [ "$CRITICAL_CSS_SIZE" -gt "$(echo "$MAX_CRITICAL_BYTES * 0.9" | bc)" ]; then
  echo -e "${YELLOW}⚠️  WARNING: Critical CSS size ($CRITICAL_CSS_HUMAN) approaching budget ($MAX_CRITICAL_SIZE)${NC}"
  ((WARNINGS++))
fi

# Check component count
if [ "$COMPONENT_COUNT" -gt "$MAX_COMPONENT_FILES" ]; then
  echo -e "${RED}❌ VIOLATION: Component files ($COMPONENT_COUNT) exceeds budget ($MAX_COMPONENT_FILES)${NC}"
  ((VIOLATIONS++))
elif [ "$COMPONENT_COUNT" -gt "$(echo "$MAX_COMPONENT_FILES * 0.9" | bc)" ]; then
  echo -e "${YELLOW}⚠️  WARNING: Component files ($COMPONENT_COUNT) approaching budget ($MAX_COMPONENT_FILES)${NC}"
  ((WARNINGS++))
fi

# Check custom properties
if [ "$CUSTOM_PROP_COUNT" -gt "$MAX_CUSTOM_PROPS" ]; then
  echo -e "${RED}❌ VIOLATION: Custom properties ($CUSTOM_PROP_COUNT) exceeds budget ($MAX_CUSTOM_PROPS)${NC}"
  ((VIOLATIONS++))
elif [ "$CUSTOM_PROP_COUNT" -gt "$(echo "$MAX_CUSTOM_PROPS * 0.9" | bc)" ]; then
  echo -e "${YELLOW}⚠️  WARNING: Custom properties ($CUSTOM_PROP_COUNT) approaching budget ($MAX_CUSTOM_PROPS)${NC}"
  ((WARNINGS++))
fi

# Check media queries
if [ "$MEDIA_QUERY_COUNT" -gt "$MAX_MEDIA_QUERIES" ]; then
  echo -e "${RED}❌ VIOLATION: Media queries ($MEDIA_QUERY_COUNT) exceeds budget ($MAX_MEDIA_QUERIES)${NC}"
  ((VIOLATIONS++))
elif [ "$MEDIA_QUERY_COUNT" -gt "$(echo "$MAX_MEDIA_QUERIES * 0.9" | bc)" ]; then
  echo -e "${YELLOW}⚠️  WARNING: Media queries ($MEDIA_QUERY_COUNT) approaching budget ($MAX_MEDIA_QUERIES)${NC}"
  ((WARNINGS++))
fi

# Generate summary
if [ "$VIOLATIONS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
  STATUS="✅ PASS"
  echo -e "${GREEN}🎉 All budget checks passed!${NC}"
elif [ "$VIOLATIONS" -eq 0 ]; then
  STATUS="⚠️  WARNINGS"
  echo -e "${YELLOW}⚠️  Budget check completed with warnings${NC}"
else
  STATUS="❌ FAIL"
  echo -e "${RED}❌ Budget check failed with violations${NC}"
fi

# Update report with results
jq --arg status "$STATUS" --argjson violations $VIOLATIONS --argjson warnings $WARNINGS --argjson totalSize $TOTAL_CSS_SIZE --argjson criticalSize $CRITICAL_CSS_SIZE --argjson componentCount $COMPONENT_COUNT --argjson customPropCount $CUSTOM_PROP_COUNT --argjson mediaQueryCount $MEDIA_QUERY_COUNT '
  .summary.status = $status |
  .summary.totalViolations = $violations |
  .summary.totalWarnings = $warnings |
  .metrics.totalCssSize = $totalSize |
  .metrics.criticalCssSize = $criticalSize |
  .metrics.componentCount = $componentCount |
  .metrics.customPropertyCount = $customPropCount |
  .metrics.mediaQueryCount = $mediaQueryCount
' "$REPORT_FILE" > "${REPORT_FILE}.tmp" && mv "${REPORT_FILE}.tmp" "$REPORT_FILE"

echo -e "${BLUE}📊 Budget Validation Summary:${NC}"
echo "  Status: $STATUS"
echo "  Violations: $VIOLATIONS"
echo "  Warnings: $WARNINGS"
echo "  Report: $REPORT_FILE"

# Exit with appropriate code
if [ "$VIOLATIONS" -gt 0 ]; then
  exit 1
else
  exit 0
fi