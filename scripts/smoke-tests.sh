#!/bin/bash

# Smoke Tests for CivicTech Waterloo Region Website
# This script runs basic tests to ensure the site builds and renders correctly

# Run tests sequentially and report failures without exiting immediately
set +e

echo "🧪 Starting Smoke Tests for CivicTech Waterloo Region Website"
echo "=============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
  local test_name="$1"
  local test_command="$2"

  echo -e "\n${BLUE}Testing: ${test_name}${NC}"
  echo "Command: ${test_command}"

  if eval "$test_command"; then
    echo -e "${GREEN}✅ PASSED: ${test_name}${NC}"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌ FAILED: ${test_name}${NC}"
    ((TESTS_FAILED++))
  fi
}

# Function to check if a file exists
check_file_exists() {
  local file_path="$1"
  local test_name="$2"

  if [ -f "$file_path" ]; then
    echo -e "${GREEN}✅ PASSED: ${test_name} - File exists: ${file_path}${NC}"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌ FAILED: ${test_name} - File missing: ${file_path}${NC}"
    ((TESTS_FAILED++))
  fi
}

echo -e "\n${YELLOW}Phase 1: Pre-build Tests${NC}"
echo "================================"

# Test 1: Check if required files exist
check_file_exists "package.json" "Package.json exists"
check_file_exists "Gemfile" "Gemfile exists"
check_file_exists "_config.yaml" "Jekyll config exists"
check_file_exists "index.html" "Homepage exists"
check_file_exists "about.html" "About page exists"
check_file_exists "projects.html" "Projects page exists"

# Test 2: Check if dependencies are installed
run_test "Node.js dependencies installed" "npm list --depth=0 > /dev/null 2>&1"
run_test "Ruby dependencies installed" "bundle check > /dev/null 2>&1"

# Test 3: Linting tests
run_test "HTML linting passes" "npm run lint:html"
run_test "CSS linting passes" "npm run lint:css"
run_test "JavaScript linting passes" "npm run lint:js"
run_test "Markdown linting passes" "npm run lint:md"
run_test "YAML linting passes" "npm run lint:yaml"
run_test "JSON linting passes" "npm run lint:json"

echo -e "\n${YELLOW}Phase 2: Build Tests${NC}"
echo "====================="

# Test 4: Build the site
run_test "Jekyll build succeeds" "npm run build:prod"

# Test 5: Check if build artifacts exist
check_file_exists "_site/index.html" "Homepage built"
check_file_exists "_site/about.html" "About page built"
check_file_exists "_site/projects.html" "Projects page built"
check_file_exists "_site/css/style.css" "CSS built"
check_file_exists "_site/js/custom.js" "JavaScript built"

# Test 6: Check if minified files exist
check_file_exists "css/style.min.css" "CSS minified"
check_file_exists "js/bundle.min.js" "JavaScript minified"

echo -e "\n${YELLOW}Phase 3: Content Tests${NC}"
echo "======================="

# Test 7: Check if critical content exists in built files
run_test "Homepage contains title" "grep -q 'CivicTech Waterloo Region' _site/index.html"
run_test "Homepage contains navigation" "grep -q 'navbar' _site/index.html"
run_test "About page contains content" "grep -q 'About Us' _site/about.html"
run_test "Projects page contains content" "grep -q 'Projects' _site/projects.html"

# Test 8: Check if CSS is properly linked
run_test "CSS files are linked" "grep -q 'style.css' _site/index.html"
run_test "JavaScript files are linked" "grep -q 'custom.js' _site/index.html"

echo -e "\n${YELLOW}Phase 4: Accessibility Tests${NC}"
echo "============================="

# Test 9: Basic accessibility checks
run_test "Images have alt text" "grep -q 'alt=' _site/index.html"
run_test "Skip navigation exists" "grep -q 'skip-link' _site/index.html"
run_test "ARIA labels exist" "grep -q 'aria-' _site/index.html"

echo -e "\n${YELLOW}Phase 5: Performance Tests${NC}"
echo "============================="

# Test 10: Check file sizes (basic performance check)
run_test "CSS file is reasonable size" "[ \$(stat -f%z css/style.css) -lt 500000 ]"
run_test "JavaScript file is reasonable size" "[ \$(stat -f%z js/custom.js) -lt 100000 ]"
run_test "Homepage is reasonable size" "[ \$(stat -f%z _site/index.html) -lt 100000 ]"

echo -e "\n${YELLOW}Phase 6: Security Tests${NC}"
echo "========================="

# Test 11: Security checks
run_test "No HTTP links in HTML" "! grep -r 'http://' _site/ --include='*.html'"
run_test "HTTPS links present" "grep -q 'https://' _site/index.html"
run_test "Security headers in .htaccess" "grep -q 'X-Frame-Options' .htaccess"

echo -e "\n${YELLOW}Test Summary${NC}"
echo "============="
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Failed: ${RED}${TESTS_FAILED}${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "\n${GREEN}🎉 All smoke tests passed! The site is rock solid.${NC}"
  exit 0
else
  echo -e "\n${RED}💥 Some smoke tests failed. Please check the output above.${NC}"
  exit 1
fi
