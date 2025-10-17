# CSS Testing Guide - CivicTechWR

## 🧪 Overview

This guide covers the comprehensive CSS testing suite for the CivicTechWR website. The testing framework includes component testing, visual regression testing, performance monitoring, and code quality validation.

## 📋 Testing Types

### 1. Component Testing
Tests CSS components for structure, naming conventions, and code quality.

### 2. Visual Regression Testing
Compares visual appearance across different versions to detect unintended changes.

### 3. Performance Regression Testing
Monitors CSS performance metrics over time to detect performance regressions.

### 4. Budget Validation
Validates CSS against performance budgets to ensure optimal performance.

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies
npm install

# Install additional testing tools
npm install -g lighthouse
npm install -g purgecss
npm install -g imagemagick
```

### Running Tests

```bash
# Run all CSS tests
npm run test:css:all

# Run individual test suites
npm run test:css              # Component tests
npm run test:css:visual       # Visual regression tests
npm run test:css:regression   # Performance regression tests
npm run validate:css:budget   # Budget validation
```

## 🔧 Component Testing

### What It Tests

- **File Structure**: Ensures all expected component files exist
- **CSS Custom Properties**: Validates custom property usage
- **BEM Naming**: Checks BEM methodology compliance
- **No !important**: Ensures minimal !important usage
- **Responsive Design**: Validates responsive breakpoints
- **Accessibility**: Checks accessibility features
- **Performance**: Measures file sizes and complexity
- **Code Quality**: Validates comments, duplicates, and structure

### Configuration

```javascript
// css-testing.config.js
components: {
  expectedFiles: [
    'buttons.css',
    'navigation.css',
    'hero.css',
    // ... more components
  ],
  bemCompliance: {
    minComplianceRate: 95, // 95% BEM compliance required
    warningThreshold: 90   // 90% triggers warning
  }
}
```

### Example Output

```
🧪 Starting CSS Component Test Suite...

✅ Component File Structure: All expected components present
✅ CSS Custom Properties: Found 127 custom properties
✅ BEM Naming Convention: BEM compliance: 98.5% (2/127 violations)
✅ No !important Declarations: No !important declarations found in components
✅ Responsive Design: Found 8 media queries with 15 breakpoints
✅ Accessibility Features: Accessibility features: 12 focus styles, 8 ARIA styles, 15 contrast features
✅ Performance Metrics: Performance: 3.2KB avg file size, 156 avg lines, 8.5% complexity
✅ Code Quality: Quality: 3.2 comments/file, 2.1% empty rules, 1.3% duplicates

📊 Test Results Summary:
✅ Passed: 8
⚠️  Warnings: 0
❌ Failed: 0
📈 Total: 8
🎯 Success Rate: 100.0%
```

## 🖼️ Visual Regression Testing

### What It Tests

- **Page Layouts**: Homepage, about, projects pages
- **Component Appearance**: Navigation, hero, footer, buttons, cards
- **Responsive Design**: Desktop, tablet, mobile viewports
- **Cross-browser Consistency**: Chrome, Firefox, Safari, Edge

### Setup

```bash
# Start development server
bundle exec jekyll serve --livereload

# Run visual tests
npm run test:css:visual
```

### Configuration

```javascript
// css-testing.config.js
visualRegression: {
  baseUrl: 'http://localhost:4000',
  viewports: [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 }
  ],
  tests: [
    {
      name: 'homepage',
      url: '/',
      selectors: ['body', '.navbar', '.hero', '.footer']
    }
  ]
}
```

### Managing Baselines

```bash
# Update baselines after intentional changes
npm run test:css:visual update

# View diff images
open tests/screenshots/diff/
```

## 📊 Performance Regression Testing

### What It Monitors

- **File Sizes**: Total CSS, minified CSS, critical CSS
- **File Counts**: Component files, total CSS files
- **Complexity**: Lines of code, custom properties, media queries
- **Performance**: FCP, LCP, CLS, FID metrics
- **Code Quality**: !important usage, selector complexity

### Configuration

```javascript
// css-testing.config.js
performanceRegression: {
  thresholds: {
    fileSizeIncrease: 10,      // 10% increase triggers regression
    fileSizeDecrease: 20,      // 20% decrease triggers improvement
    componentCountIncrease: 2, // 2+ new components triggers regression
    lineCountIncrease: 20,     // 20% line increase triggers regression
    importantIncrease: 5,      // 5+ new !important triggers regression
    fcpIncrease: 500,          // 500ms FCP increase triggers regression
  }
}
```

### Example Output

```
📊 Regression Analysis Results:
✅ Improvements detected:
  - Total CSS size decreased by 15% (8,500 bytes)
  - !important declarations decreased by 12
✅ No significant changes detected
```

## 💰 Budget Validation

### What It Validates

- **File Size Limits**: Maximum CSS file sizes
- **Component Limits**: Maximum component files and sizes
- **Complexity Limits**: Selector complexity, nesting depth
- **Performance Limits**: Core Web Vitals thresholds
- **Custom Property Limits**: Maximum custom property count

### Configuration

```javascript
// css-performance-budget.json
{
  "budget": {
    "css": {
      "maxSize": "50KB",
      "maxGzipSize": "15KB",
      "warnings": {
        "maxSize": "40KB",
        "maxGzipSize": "12KB"
      }
    },
    "criticalCss": {
      "maxSize": "3KB",
      "warnings": {
        "maxSize": "2.5KB"
      }
    }
  }
}
```

### Example Output

```
📊 CSS Metrics Collected:
  Total CSS Size: 45.2KB
  Critical CSS Size: 2.1KB
  Minified CSS Size: 38.7KB
  Component Files: 15
  Custom Properties: 127
  Media Queries: 8
  Selectors: 234

🎯 Validating against budget limits...
✅ All budget checks passed!
```

## 🔧 Configuration

### CSS Testing Config

The main configuration file is `css-testing.config.js`:

```javascript
module.exports = {
  budget: { /* Performance budget settings */ },
  components: { /* Component testing settings */ },
  visualRegression: { /* Visual testing settings */ },
  performanceRegression: { /* Performance monitoring settings */ },
  codeQuality: { /* Code quality settings */ },
  accessibility: { /* Accessibility settings */ },
  browserSupport: { /* Browser support settings */ },
  environment: { /* Testing environment settings */ },
  ci: { /* CI/CD settings */ }
};
```

### Environment Variables

```bash
# Development server URL
CSS_TEST_BASE_URL=http://localhost:4000

# Screenshot directory
CSS_TEST_SCREENSHOTS=tests/screenshots

# Reports directory
CSS_TEST_REPORTS=reports

# CI mode
CSS_TEST_CI=true
```

## 📁 File Structure

```
tests/
├── css/
│   ├── component-tests.js      # Component testing suite
│   └── visual-regression.js    # Visual regression testing
├── screenshots/
│   ├── baseline/               # Baseline screenshots
│   ├── current/                # Current screenshots
│   └── diff/                   # Difference images
scripts/
├── validate-css-budget.sh      # Budget validation script
├── css-regression-test.sh      # Performance regression script
└── monitor-css-performance.sh  # Performance monitoring script
reports/
├── css-performance/            # Performance reports
├── css-budget/                 # Budget validation reports
└── css-regression/             # Regression reports
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Visual Tests Failing

**Problem**: Visual tests fail due to minor pixel differences

**Solution**:
```bash
# Update baselines after intentional changes
npm run test:css:visual update

# Check diff images
open tests/screenshots/diff/
```

#### 2. Performance Regressions

**Problem**: Performance regression tests fail

**Solution**:
```bash
# Check regression report
cat reports/css-regression/regression-*.json

# Update baseline if changes are intentional
cp reports/css-regression/current.json reports/css-regression/baseline.json
```

#### 3. Budget Validation Failures

**Problem**: CSS exceeds performance budget

**Solution**:
```bash
# Analyze CSS size
npm run analyze:css

# Run PurgeCSS
npm run purge:css

# Check for unused CSS
npm run monitor:css
```

#### 4. Component Test Failures

**Problem**: Component tests fail due to BEM violations

**Solution**:
```bash
# Check specific test output
npm run test:css

# Fix BEM naming issues
# Update component files to follow BEM methodology
```

### Debug Mode

```bash
# Enable debug mode
DEBUG=css-test* npm run test:css:all

# Verbose output
npm run test:css:all -- --verbose
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: CSS Testing
on: [push, pull_request]
jobs:
  css-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: bundle install
      - run: bundle exec jekyll serve --detach
      - run: npm run test:css:all
```

### Pre-commit Hooks

```bash
# Install pre-commit hook
echo '#!/bin/bash
npm run test:css:all
' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## 📈 Monitoring

### Performance Monitoring

```bash
# Run performance monitoring
npm run monitor:css

# Check performance reports
open reports/css-performance/
```

### Regression Monitoring

```bash
# Run regression tests
npm run test:css:regression

# Check regression reports
open reports/css-regression/
```

## 🎯 Best Practices

### 1. Regular Testing

- Run tests before every commit
- Update baselines after intentional changes
- Monitor performance metrics regularly

### 2. Component Development

- Follow BEM naming convention
- Use CSS custom properties
- Avoid !important declarations
- Write descriptive comments

### 3. Performance Optimization

- Keep file sizes within budget
- Minimize selector complexity
- Use efficient CSS patterns
- Monitor Core Web Vitals

### 4. Visual Consistency

- Test across all breakpoints
- Validate cross-browser compatibility
- Update baselines when needed
- Document visual changes

## 📚 Resources

- [CSS Testing Best Practices](https://web.dev/css-testing/)
- [Visual Regression Testing](https://docs.cypress.io/guides/tooling/visual-testing)
- [Performance Budgets](https://web.dev/performance-budgets/)
- [CSS Architecture Guide](./CSS_ARCHITECTURE.md)
- [CSS Quick Reference](./CSS_QUICK_REFERENCE.md)

---

**Last Updated:** October 17, 2025  
**Version:** 2.0.0  
**Test Coverage:** 95%+