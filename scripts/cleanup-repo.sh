#!/bin/bash

echo "=== REPOSITORY CLEANUP SCRIPT ==="
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

# Check if we're in the right directory
if [ ! -f "_config.yaml" ]; then
    print_error "Not in Jekyll project directory. Please run from project root."
    exit 1
fi

print_status "Starting repository cleanup..."

# 1. Remove build artifacts
print_status "Removing build artifacts..."
rm -rf _site
rm -rf .jekyll-cache
rm -rf css/purged
rm -rf css/autoprefixed
print_success "Build artifacts removed"

# 2. Remove validation reports
print_status "Removing validation reports..."
rm -f *-report.json
rm -f *-validation.json
rm -f compatibility-report.md
rm -f lighthouse-report.json
rm -f html-validation.json
rm -f final-lighthouse.json
rm -f final-accessibility.json
print_success "Validation reports removed"

# 3. Remove test files
print_status "Removing test files..."
rm -f test-*.html
rm -f test-*.js
rm -f test-*.css
print_success "Test files removed"

# 4. Remove temporary files
print_status "Removing temporary files..."
find . -name "*.tmp" -o -name "*.temp" -o -name "*.log" -o -name "*.cache" | grep -v node_modules | grep -v vendor | xargs rm -f 2>/dev/null || true
find . -name "*.bak" -o -name "*.backup" -o -name "*~" | xargs rm -f 2>/dev/null || true
print_success "Temporary files removed"

# 5. Remove system files
print_status "Removing system files..."
find . -name ".DS_Store" -delete
find . -name "Thumbs.db" -delete
find . -name "Desktop.ini" -delete
print_success "System files removed"

# 6. Remove Playwright test results
print_status "Removing Playwright test results..."
rm -rf test-results
rm -rf playwright-report
rm -rf playwright/.cache
print_success "Playwright test results removed"

# 7. Remove Pa11y results
print_status "Removing Pa11y results..."
rm -rf pa11y-results
print_success "Pa11y results removed"

# 8. Check for large files
print_status "Checking for large files..."
LARGE_FILES=$(find . -type f -size +10M | grep -v node_modules | grep -v vendor | head -5)
if [ ! -z "$LARGE_FILES" ]; then
    print_warning "Large files found:"
    echo "$LARGE_FILES"
    print_warning "Consider adding these to .gitignore if they're not needed"
else
    print_success "No large files found"
fi

# 9. Check repository size
print_status "Checking repository size..."
REPO_SIZE=$(du -sh . | cut -f1)
print_success "Repository size: $REPO_SIZE"

# 10. Verify .gitignore
print_status "Verifying .gitignore configuration..."
if [ -f ".gitignore" ]; then
    print_success ".gitignore file exists"
else
    print_warning ".gitignore file not found"
fi

# 11. Check for untracked files
print_status "Checking for untracked files..."
UNTRACKED=$(git status --porcelain | grep "^??" | wc -l)
if [ "$UNTRACKED" -gt 0 ]; then
    print_warning "Found $UNTRACKED untracked files:"
    git status --porcelain | grep "^??" | head -10
    print_warning "Consider adding these to .gitignore if they're not needed"
else
    print_success "No untracked files found"
fi

# 12. Summary
echo ""
print_success "Repository cleanup completed!"
echo ""
echo "📊 Summary:"
echo "• Build artifacts removed"
echo "• Validation reports removed"
echo "• Test files removed"
echo "• Temporary files removed"
echo "• System files removed"
echo "• Repository size: $REPO_SIZE"
echo ""
echo "✅ Repository is now clean and ready for development!"
echo ""
echo "💡 Next steps:"
echo "• Run 'bundle install' to restore Ruby dependencies"
echo "• Run 'npm install' to restore Node.js dependencies"
echo "• Run 'bundle exec jekyll serve' to start development server"
echo ""
echo "📚 See REPOSITORY_CLEANUP.md for detailed guidelines"