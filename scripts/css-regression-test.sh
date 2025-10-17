#!/bin/bash

# CSS Performance Regression Testing Script
# Monitors CSS performance metrics over time and detects regressions

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Starting CSS Performance Regression Testing...${NC}"

# Configuration
REPORTS_DIR="reports/css-regression"
BASELINE_FILE="$REPORTS_DIR/baseline.json"
CURRENT_FILE="$REPORTS_DIR/current.json"
REGRESSION_FILE="$REPORTS_DIR/regression-$(date +%Y%m%d-%H%M%S).json"

# Create reports directory
mkdir -p "$REPORTS_DIR"

# Function to get CSS metrics
get_css_metrics() {
  local output_file="$1"
  
  echo -e "${BLUE}🔍 Collecting CSS metrics...${NC}"
  
  # Get file sizes
  local total_css_size=$(find css -name "*.css" -not -name "*.min.css" -not -name "*.optimized.css" -exec du -cb {} + | tail -1 | cut -f1)
  local minified_css_size=$(find css -name "*.min.css" -exec du -cb {} + 2>/dev/null | tail -1 | cut -f1 || echo "0")
  local critical_css_size=$(du -cb css/critical.css 2>/dev/null | tail -1 | cut -f1 || echo "0")
  
  # Get file counts
  local component_count=$(find css/components -name "*.css" 2>/dev/null | wc -l || echo "0")
  local total_css_files=$(find css -name "*.css" -not -name "*.min.css" -not -name "*.optimized.css" | wc -l)
  
  # Get complexity metrics
  local total_lines=$(find css -name "*.css" -not -name "*.min.css" -not -name "*.optimized.css" -exec wc -l {} + | tail -1 | awk '{print $1}')
  local custom_props=$(grep -r "^[[:space:]]*--" css --include="*.css" | wc -l || echo "0")
  local media_queries=$(grep -r "@media" css --include="*.css" | wc -l || echo "0")
  local selectors=$(grep -r "^[^@]*{" css --include="*.css" | wc -l || echo "0")
  local important_count=$(grep -r "!important" css --include="*.css" | wc -l || echo "0")
  
  # Get performance metrics (if available)
  local fcp=""
  local lcp=""
  local cls=""
  local fid=""
  
  if command -v lighthouse &> /dev/null; then
    echo -e "${BLUE}🎯 Running Lighthouse audit...${NC}"
    local lighthouse_output=$(lighthouse http://localhost:4000 --output=json --chrome-flags='--headless' --quiet 2>/dev/null || echo "{}")
    
    fcp=$(echo "$lighthouse_output" | jq -r '.audits.first-contentful-paint.numericValue // empty' 2>/dev/null || echo "")
    lcp=$(echo "$lighthouse_output" | jq -r '.audits.largest-contentful-paint.numericValue // empty' 2>/dev/null || echo "")
    cls=$(echo "$lighthouse_output" | jq -r '.audits.cumulative-layout-shift.numericValue // empty' 2>/dev/null || echo "")
    fid=$(echo "$lighthouse_output" | jq -r '.audits.max-potential-fid.numericValue // empty' 2>/dev/null || echo "")
  fi
  
  # Create metrics JSON
  cat > "$output_file" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "metrics": {
    "fileSizes": {
      "totalCssSize": $total_css_size,
      "minifiedCssSize": $minified_css_size,
      "criticalCssSize": $critical_css_size
    },
    "fileCounts": {
      "totalCssFiles": $total_css_files,
      "componentFiles": $component_count
    },
    "complexity": {
      "totalLines": $total_lines,
      "customProperties": $custom_props,
      "mediaQueries": $media_queries,
      "selectors": $selectors,
      "importantDeclarations": $important_count
    },
    "performance": {
      "fcp": $fcp,
      "lcp": $lcp,
      "cls": $cls,
      "fid": $fid
    }
  }
}
EOF
}

# Function to compare metrics
compare_metrics() {
  local baseline_file="$1"
  local current_file="$2"
  local regression_file="$3"
  
  echo -e "${BLUE}📈 Comparing metrics...${NC}"
  
  if [ ! -f "$baseline_file" ]; then
    echo -e "${YELLOW}⚠️  No baseline found. Creating new baseline...${NC}"
    cp "$current_file" "$baseline_file"
    echo -e "${GREEN}✅ Baseline created: $baseline_file${NC}"
    return 0
  fi
  
  # Compare metrics using jq
  local regressions=()
  local improvements=()
  local warnings=()
  
  # File size comparisons
  local baseline_total_size=$(jq -r '.metrics.fileSizes.totalCssSize' "$baseline_file")
  local current_total_size=$(jq -r '.metrics.fileSizes.totalCssSize' "$current_file")
  local size_diff=$((current_total_size - baseline_total_size))
  local size_diff_percent=$((size_diff * 100 / baseline_total_size))
  
  if [ "$size_diff_percent" -gt 10 ]; then
    regressions+=("Total CSS size increased by ${size_diff_percent}% (${size_diff} bytes)")
  elif [ "$size_diff_percent" -lt -10 ]; then
    improvements+=("Total CSS size decreased by $((-size_diff_percent))% ($((-size_diff)) bytes)")
  elif [ "$size_diff_percent" -gt 5 ]; then
    warnings+=("Total CSS size increased by ${size_diff_percent}% (${size_diff} bytes)")
  fi
  
  # Component count comparison
  local baseline_components=$(jq -r '.metrics.fileCounts.componentFiles' "$baseline_file")
  local current_components=$(jq -r '.metrics.fileCounts.componentFiles' "$current_file")
  local component_diff=$((current_components - baseline_components))
  
  if [ "$component_diff" -gt 2 ]; then
    regressions+=("Component files increased by $component_diff")
  elif [ "$component_diff" -lt -2 ]; then
    improvements+=("Component files decreased by $((-component_diff))")
  fi
  
  # Complexity comparisons
  local baseline_lines=$(jq -r '.metrics.complexity.totalLines' "$baseline_file")
  local current_lines=$(jq -r '.metrics.complexity.totalLines' "$current_file")
  local lines_diff=$((current_lines - baseline_lines))
  local lines_diff_percent=$((lines_diff * 100 / baseline_lines))
  
  if [ "$lines_diff_percent" -gt 20 ]; then
    regressions+=("Total lines increased by ${lines_diff_percent}% (${lines_diff} lines)")
  elif [ "$lines_diff_percent" -lt -20 ]; then
    improvements+=("Total lines decreased by $((-lines_diff_percent))% ($((-lines_diff)) lines)")
  fi
  
  # Important declarations comparison
  local baseline_important=$(jq -r '.metrics.complexity.importantDeclarations' "$baseline_file")
  local current_important=$(jq -r '.metrics.complexity.importantDeclarations' "$current_file")
  local important_diff=$((current_important - baseline_important))
  
  if [ "$important_diff" -gt 5 ]; then
    regressions+=("!important declarations increased by $important_diff")
  elif [ "$important_diff" -lt -5 ]; then
    improvements+=("!important declarations decreased by $((-important_diff))")
  fi
  
  # Performance comparisons (if available)
  local baseline_fcp=$(jq -r '.metrics.performance.fcp // empty' "$baseline_file")
  local current_fcp=$(jq -r '.metrics.performance.fcp // empty' "$current_file")
  
  if [ -n "$baseline_fcp" ] && [ -n "$current_fcp" ] && [ "$baseline_fcp" != "null" ] && [ "$current_fcp" != "null" ]; then
    local fcp_diff=$(echo "$current_fcp - $baseline_fcp" | bc)
    local fcp_diff_percent=$(echo "scale=2; $fcp_diff * 100 / $baseline_fcp" | bc)
    
    if (( $(echo "$fcp_diff > 500" | bc -l) )); then
      regressions+=("FCP increased by ${fcp_diff}ms (${fcp_diff_percent}%)")
    elif (( $(echo "$fcp_diff < -500" | bc -l) )); then
      improvements+=("FCP decreased by $((-fcp_diff))ms ($((-fcp_diff_percent))%)")
    fi
  fi
  
  # Create regression report
  cat > "$regression_file" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "baseline": "$baseline_file",
  "current": "$current_file",
  "regressions": $(printf '%s\n' "${regressions[@]}" | jq -R . | jq -s .),
  "improvements": $(printf '%s\n' "${improvements[@]}" | jq -R . | jq -s .),
  "warnings": $(printf '%s\n' "${warnings[@]}" | jq -R . | jq -s .),
  "summary": {
    "regressionCount": ${#regressions[@]},
    "improvementCount": ${#improvements[@]},
    "warningCount": ${#warnings[@]},
    "status": "$(if [ ${#regressions[@]} -gt 0 ]; then echo "FAIL"; elif [ ${#warnings[@]} -gt 0 ]; then echo "WARN"; else echo "PASS"; fi)"
  }
}
EOF
  
  # Print results
  echo -e "${BLUE}📊 Regression Analysis Results:${NC}"
  
  if [ ${#regressions[@]} -gt 0 ]; then
    echo -e "${RED}❌ Regressions detected:${NC}"
    for regression in "${regressions[@]}"; do
      echo -e "  - $regression"
    done
  fi
  
  if [ ${#improvements[@]} -gt 0 ]; then
    echo -e "${GREEN}✅ Improvements detected:${NC}"
    for improvement in "${improvements[@]}"; do
      echo -e "  - $improvement"
    done
  fi
  
  if [ ${#warnings[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Warnings:${NC}"
    for warning in "${warnings[@]}"; do
      echo -e "  - $warning"
    done
  fi
  
  if [ ${#regressions[@]} -eq 0 ] && [ ${#improvements[@]} -eq 0 ] && [ ${#warnings[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ No significant changes detected${NC}"
  fi
  
  # Return exit code based on regressions
  if [ ${#regressions[@]} -gt 0 ]; then
    return 1
  else
    return 0
  fi
}

# Main execution
echo -e "${BLUE}🔍 Collecting current metrics...${NC}"
get_css_metrics "$CURRENT_FILE"

echo -e "${BLUE}📊 Comparing with baseline...${NC}"
if compare_metrics "$BASELINE_FILE" "$CURRENT_FILE" "$REGRESSION_FILE"; then
  echo -e "${GREEN}✅ CSS regression test passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ CSS regression test failed!${NC}"
  echo -e "${YELLOW}📁 Regression report: $REGRESSION_FILE${NC}"
  exit 1
fi