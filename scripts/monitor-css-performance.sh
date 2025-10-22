#!/bin/bash

# CSS Performance Monitoring Script
# Monitors CSS performance metrics and generates reports

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Starting CSS Performance Monitoring...${NC}"

# Create reports directory
mkdir -p reports/css-performance

# Get current timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

echo -e "${BLUE}🔍 Analyzing CSS complexity...${NC}"
npm run analyze:css >"reports/css-performance/complexity-${TIMESTAMP}.json"

echo -e "${BLUE}📏 Measuring file sizes...${NC}"
{
  echo "CSS File Size Report - $(date)"
  echo "=================================="
  echo ""
  echo "Original Files:"
  find css -name "*.css" -not -name "*.min.css" -not -name "*.optimized.css" | while read -r file; do
    size=$(du -h "$file" | cut -f1)
    lines=$(wc -l <"$file")
    echo "  $file: $size ($lines lines)"
  done
  echo ""
  echo "Minified Files:"
  find css -name "*.min.css" | while read -r file; do
    size=$(du -h "$file" | cut -f1)
    echo "  $file: $size"
  done
  echo ""
  echo "Total Original CSS:"
  find css -name "*.css" -not -name "*.min.css" -not -name "*.optimized.css" -exec du -ch {} + | tail -1
  echo ""
  echo "Total Minified CSS:"
  find css -name "*.min.css" -exec du -ch {} + | tail -1
} >"reports/css-performance/sizes-${TIMESTAMP}.txt"

echo -e "${BLUE}🎯 Running Lighthouse audit...${NC}"
if command -v lighthouse &>/dev/null; then
  lighthouse http://localhost:4000 --output=json --output-path="./reports/css-performance/lighthouse-${TIMESTAMP}.json" --chrome-flags='--headless' --quiet
  lighthouse http://localhost:4000 --output=html --output-path="./reports/css-performance/lighthouse-${TIMESTAMP}.html" --chrome-flags='--headless' --quiet
else
  echo -e "${YELLOW}⚠️  Lighthouse not found. Install with: npm install -g lighthouse${NC}"
fi

echo -e "${BLUE}🔍 Checking for unused CSS...${NC}"
if command -v purgecss &>/dev/null; then
  purgecss --css css/main.css --content "**/*.html" --output "reports/css-performance/unused-${TIMESTAMP}.css"
  echo "Unused CSS saved to reports/css-performance/unused-${TIMESTAMP}.css"
else
  echo -e "${YELLOW}⚠️  PurgeCSS not found. Install with: npm install -g purgecss${NC}"
fi

echo -e "${BLUE}📈 Generating performance summary...${NC}"
{
  echo "CSS Performance Summary - $(date)"
  echo "================================="
  echo ""
  echo "File Counts:"
  echo "  Original CSS files: $(find css -name "*.css" -not -name "*.min.css" -not -name "*.optimized.css" | wc -l)"
  echo "  Minified CSS files: $(find css -name "*.min.css" | wc -l)"
  echo "  Component files: $(find css/components -name "*.css" | wc -l)"
  echo ""
  echo "Size Analysis:"
  echo "  Main CSS: $(du -h css/main.css | cut -f1)"
  # NOTE: critical.css was orphaned file not loaded in production - removed during cleanup
  echo "  Total Original: $(find css -name "*.css" -not -name "*.min.css" -not -name "*.optimized.css" -exec du -ch {} + | tail -1 | cut -f1)"
  echo "  Total Minified: $(find css -name "*.min.css" -exec du -ch {} + | tail -1 | cut -f1)"
  echo ""
  echo "Component Breakdown:"
  find css/components -name "*.css" | while read -r file; do
    size=$(du -h "$file" | cut -f1)
    name=$(basename "$file" .css)
    echo "  $name: $size"
  done
} >"reports/css-performance/summary-${TIMESTAMP}.txt"

echo -e "${GREEN}✅ CSS Performance monitoring completed!${NC}"
echo -e "${YELLOW}📁 Reports saved to: reports/css-performance/${NC}"
echo -e "${YELLOW}📊 Latest files:${NC}"
# shellcheck disable=SC2012
ls -la reports/css-performance/ | tail -5

echo -e "${GREEN}🚀 Performance monitoring complete!${NC}"
