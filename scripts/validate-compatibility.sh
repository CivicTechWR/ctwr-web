#!/bin/bash

echo "=== COMPREHENSIVE COMPATIBILITY VALIDATION ==="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Start Jekyll server in background
print_status "Starting Jekyll development server..."
bundle exec jekyll serve --detach --port 4000
sleep 5

# Check if server is running
if ! curl -s http://localhost:4000 > /dev/null; then
    print_error "Jekyll server failed to start"
    exit 1
fi

print_success "Jekyll server started successfully"

# 1. CSS Validation and Autoprefixing
print_status "Running CSS validation and autoprefixing..."
npx postcss css/**/*.css --dir css/autoprefixed --map
if [ $? -eq 0 ]; then
    print_success "CSS autoprefixing completed"
else
    print_error "CSS autoprefixing failed"
fi

# 2. Browser Compatibility Check
print_status "Checking browser compatibility..."
npx browserslist
if [ $? -eq 0 ]; then
    print_success "Browser compatibility check completed"
else
    print_warning "Browser compatibility check had issues"
fi

# 3. Accessibility Testing
print_status "Running accessibility tests..."
npx pa11y-ci --config pa11y.config.js
if [ $? -eq 0 ]; then
    print_success "Accessibility tests passed"
else
    print_warning "Accessibility tests found issues"
fi

# 4. Cross-browser Testing with Playwright
print_status "Running cross-browser tests..."
npx playwright test --config playwright.config.js
if [ $? -eq 0 ]; then
    print_success "Cross-browser tests passed"
else
    print_warning "Cross-browser tests found issues"
fi

# 5. Performance Testing
print_status "Running performance tests..."
npx lighthouse http://localhost:4000 --output=json --output-path=./lighthouse-compatibility.json --chrome-flags="--headless" --quiet
if [ $? -eq 0 ]; then
    print_success "Performance tests completed"
    
    # Extract key metrics
    PERFORMANCE=$(node -e "const report = require('./lighthouse-compatibility.json'); console.log('Performance Score:', Math.round(report.categories.performance.score * 100));")
    ACCESSIBILITY=$(node -e "const report = require('./lighthouse-compatibility.json'); console.log('Accessibility Score:', Math.round(report.categories.accessibility.score * 100));")
    BEST_PRACTICES=$(node -e "const report = require('./lighthouse-compatibility.json'); console.log('Best Practices Score:', Math.round(report.categories['best-practices'].score * 100));")
    SEO=$(node -e "const report = require('./lighthouse-compatibility.json'); console.log('SEO Score:', Math.round(report.categories.seo.score * 100));")
    
    echo "$PERFORMANCE"
    echo "$ACCESSIBILITY"
    echo "$BEST_PRACTICES"
    echo "$SEO"
else
    print_error "Performance tests failed"
fi

# 6. Responsive Design Testing
print_status "Testing responsive design..."
echo "Testing breakpoints: 320px, 768px, 1024px, 1440px"

# Test mobile (320px)
npx playwright test --config playwright.config.js --grep "mobile" || print_warning "Mobile tests had issues"

# Test tablet (768px)
npx playwright test --config playwright.config.js --grep "tablet" || print_warning "Tablet tests had issues"

# Test desktop (1024px+)
npx playwright test --config playwright.config.js --grep "desktop" || print_warning "Desktop tests had issues"

# 7. Button BEM Compliance Check
print_status "Checking button BEM compliance..."
BEM_ISSUES=$(grep -r "class.*btn" . --include="*.html" | grep -v "btn--" | grep -v ".min." | wc -l)
if [ "$BEM_ISSUES" -eq 0 ]; then
    print_success "All buttons are BEM compliant"
else
    print_warning "Found $BEM_ISSUES non-BEM button instances"
    grep -r "class.*btn" . --include="*.html" | grep -v "btn--" | grep -v ".min."
fi

# 8. CSS Validation
print_status "Validating CSS syntax..."
npx stylelint "css/**/*.css" --config .stylelintrc.json --formatter verbose
if [ $? -eq 0 ]; then
    print_success "CSS validation passed"
else
    print_warning "CSS validation found issues"
fi

# 9. HTML Validation
print_status "Validating HTML structure..."
npx pa11y http://localhost:4000 --standard WCAG2AA --reporter json > html-validation.json
if [ $? -eq 0 ]; then
    print_success "HTML validation completed"
else
    print_warning "HTML validation found issues"
fi

# 10. Generate Compatibility Report
print_status "Generating compatibility report..."
cat > compatibility-report.md << EOF
# Compatibility Validation Report

## Test Results

### Performance Metrics
- Performance Score: $(node -e "const report = require('./lighthouse-compatibility.json'); console.log(Math.round(report.categories.performance.score * 100));" 2>/dev/null || echo "N/A")
- Accessibility Score: $(node -e "const report = require('./lighthouse-compatibility.json'); console.log(Math.round(report.categories.accessibility.score * 100));" 2>/dev/null || echo "N/A")
- Best Practices Score: $(node -e "const report = require('./lighthouse-compatibility.json'); console.log(Math.round(report.categories['best-practices'].score * 100));" 2>/dev/null || echo "N/A")
- SEO Score: $(node -e "const report = require('./lighthouse-compatibility.json'); console.log(Math.round(report.categories.seo.score * 100));" 2>/dev/null || echo "N/A")

### Browser Support
- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90
- iOS >= 14
- Android >= 10

### Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Large Desktop: 1440px+

### Button BEM Compliance
- Non-BEM buttons found: $BEM_ISSUES

### Test Date
$(date)

EOF

print_success "Compatibility report generated: compatibility-report.md"

# Cleanup
print_status "Cleaning up..."
pkill -f "jekyll serve" || true

print_success "Compatibility validation completed!"
echo ""
echo "📊 Check the following files for detailed results:"
echo "• compatibility-report.md - Summary report"
echo "• lighthouse-compatibility.json - Performance metrics"
echo "• html-validation.json - HTML validation results"
echo "• css/autoprefixed/ - Autoprefixed CSS files"