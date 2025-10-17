/**
 * CSS Component Testing Suite
 * Automated tests for CSS components and design system
 */

const fs = require('fs');
const path = require('path');

class CSSTestSuite {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
    this.cssDir = path.join(__dirname, '../../css');
  }

  /**
   * Run all CSS tests
   */
  async runAllTests() {
    console.log('🧪 Starting CSS Component Test Suite...\n');

    // Test 1: Component file structure
    this.testComponentStructure();

    // Test 2: CSS custom properties
    this.testCustomProperties();

    // Test 3: BEM naming convention
    this.testBEMNaming();

    // Test 4: No !important declarations
    this.testNoImportant();

    // Test 5: Responsive design
    this.testResponsiveDesign();

    // Test 6: Accessibility
    this.testAccessibility();

    // Test 7: Performance
    this.testPerformance();

    // Test 8: Code quality
    this.testCodeQuality();

    this.printResults();
    return this.results;
  }

  /**
   * Test component file structure
   */
  testComponentStructure() {
    const testName = 'Component File Structure';
    const expectedComponents = [
      'buttons.css',
      'navigation.css',
      'hero.css',
      'services.css',
      'footer.css',
      'avatar.css',
      'preloader.css',
      'icons.css',
      'featured.css',
      'sponsors.css',
      'projects.css',
      'forms.css',
      'organizers.css',
      'page-header.css',
      'footer-utilities.css'
    ];

    const componentsDir = path.join(this.cssDir, 'components');
    const actualComponents = fs.readdirSync(componentsDir)
      .filter(file => file.endsWith('.css'));

    const missing = expectedComponents.filter(comp => !actualComponents.includes(comp));
    const extra = actualComponents.filter(comp => !expectedComponents.includes(comp));

    if (missing.length === 0 && extra.length === 0) {
      this.addResult(testName, 'PASS', 'All expected components present');
    } else {
      const message = `Missing: ${missing.join(', ')}. Extra: ${extra.join(', ')}`;
      this.addResult(testName, 'FAIL', message);
    }
  }

  /**
   * Test CSS custom properties
   */
  testCustomProperties() {
    const testName = 'CSS Custom Properties';
    const variablesFile = path.join(this.cssDir, 'base/variables.css');
    
    if (!fs.existsSync(variablesFile)) {
      this.addResult(testName, 'FAIL', 'Variables file not found');
      return;
    }

    const content = fs.readFileSync(variablesFile, 'utf8');
    const customProps = content.match(/--[a-zA-Z0-9-]+:/g) || [];
    
    if (customProps.length >= 100) {
      this.addResult(testName, 'PASS', `Found ${customProps.length} custom properties`);
    } else {
      this.addResult(testName, 'WARN', `Only ${customProps.length} custom properties found (expected 100+)`);
    }
  }

  /**
   * Test BEM naming convention
   */
  testBEMNaming() {
    const testName = 'BEM Naming Convention';
    const componentsDir = path.join(this.cssDir, 'components');
    const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.css'));
    
    let bemViolations = 0;
    let totalClasses = 0;

    files.forEach(file => {
      const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
      const classes = content.match(/\.[a-zA-Z0-9_-]+/g) || [];
      
      classes.forEach(className => {
        totalClasses++;
        const cleanClass = className.substring(1);
        
        // Check for BEM violations
        if (cleanClass.includes('__') && cleanClass.includes('--')) {
          // Element with modifier - should be valid
        } else if (cleanClass.includes('__') || cleanClass.includes('--')) {
          // Element or modifier - should be valid
        } else if (cleanClass.match(/^[a-z][a-z0-9-]*$/)) {
          // Block - should be valid
        } else if (cleanClass.match(/^[a-z][a-z0-9-]*__[a-z][a-z0-9-]*$/)) {
          // Element - should be valid
        } else if (cleanClass.match(/^[a-z][a-z0-9-]*--[a-z][a-z0-9-]*$/)) {
          // Modifier - should be valid
        } else if (cleanClass.match(/^[a-z][a-z0-9-]*__[a-z][a-z0-9-]*--[a-z][a-z0-9-]*$/)) {
          // Element with modifier - should be valid
        } else {
          // Check if it's a utility class or special case
          if (!cleanClass.match(/^(container|row|col|d-|p-|m-|text-|bg-|border-|rounded-|shadow-|opacity-|position-|top-|left-|right-|bottom-|w-|h-|max-|min-|overflow-|flex-|grid-|justify-|align-|items-|content-|self-|order-|grow-|shrink-|basis-|gap-|space-|divide-|sr-only|skip-link|is-|has-|site-|page-|projects-|meeting-|organizer-|shoutout-|custom-|form-|floating-|img-|fluid-|responsive-|mobile-|tablet-|desktop-|avatar-|preloader-|spinner-|icon-|featured-|sponsors-|contact-|profile-|about-|footer-col)/)) {
            bemViolations++;
          }
        }
      });
    });

    const violationRate = (bemViolations / totalClasses) * 100;
    
    if (violationRate < 5) {
      this.addResult(testName, 'PASS', `BEM compliance: ${(100 - violationRate).toFixed(1)}% (${bemViolations}/${totalClasses} violations)`);
    } else if (violationRate < 15) {
      this.addResult(testName, 'WARN', `BEM compliance: ${(100 - violationRate).toFixed(1)}% (${bemViolations}/${totalClasses} violations)`);
    } else {
      this.addResult(testName, 'FAIL', `BEM compliance: ${(100 - violationRate).toFixed(1)}% (${bemViolations}/${totalClasses} violations)`);
    }
  }

  /**
   * Test for !important declarations
   */
  testNoImportant() {
    const testName = 'No !important Declarations';
    const componentsDir = path.join(this.cssDir, 'components');
    const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.css'));
    
    let importantCount = 0;
    let totalFiles = 0;

    files.forEach(file => {
      const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
      const importantMatches = content.match(/!important/g) || [];
      importantCount += importantMatches.length;
      totalFiles++;
    });

    if (importantCount === 0) {
      this.addResult(testName, 'PASS', 'No !important declarations found in components');
    } else {
      this.addResult(testName, 'FAIL', `Found ${importantCount} !important declarations in ${totalFiles} component files`);
    }
  }

  /**
   * Test responsive design
   */
  testResponsiveDesign() {
    const testName = 'Responsive Design';
    const responsiveFile = path.join(this.cssDir, 'base/responsive.css');
    
    if (!fs.existsSync(responsiveFile)) {
      this.addResult(testName, 'FAIL', 'Responsive CSS file not found');
      return;
    }

    const content = fs.readFileSync(responsiveFile, 'utf8');
    const mediaQueries = content.match(/@media/g) || [];
    const breakpoints = content.match(/min-width|max-width/g) || [];

    if (mediaQueries.length >= 5 && breakpoints.length >= 10) {
      this.addResult(testName, 'PASS', `Found ${mediaQueries.length} media queries with ${breakpoints.length} breakpoints`);
    } else {
      this.addResult(testName, 'WARN', `Found ${mediaQueries.length} media queries with ${breakpoints.length} breakpoints (expected 5+ queries, 10+ breakpoints)`);
    }
  }

  /**
   * Test accessibility features
   */
  testAccessibility() {
    const testName = 'Accessibility Features';
    const componentsDir = path.join(this.cssDir, 'components');
    const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.css'));
    
    let focusStyles = 0;
    let ariaStyles = 0;
    let highContrast = 0;

    files.forEach(file => {
      const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
      
      // Check for focus styles
      if (content.includes(':focus')) focusStyles++;
      
      // Check for ARIA-related styles
      if (content.includes('[aria-') || content.includes('.sr-only')) ariaStyles++;
      
      // Check for high contrast considerations
      if (content.includes('outline') || content.includes('box-shadow')) highContrast++;
    });

    const totalChecks = focusStyles + ariaStyles + highContrast;
    
    if (totalChecks >= 10) {
      this.addResult(testName, 'PASS', `Accessibility features: ${focusStyles} focus styles, ${ariaStyles} ARIA styles, ${highContrast} contrast features`);
    } else {
      this.addResult(testName, 'WARN', `Limited accessibility features: ${focusStyles} focus styles, ${ariaStyles} ARIA styles, ${highContrast} contrast features`);
    }
  }

  /**
   * Test performance metrics
   */
  testPerformance() {
    const testName = 'Performance Metrics';
    const componentsDir = path.join(this.cssDir, 'components');
    const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.css'));
    
    let totalSize = 0;
    let totalLines = 0;
    let complexSelectors = 0;

    files.forEach(file => {
      const filePath = path.join(componentsDir, file);
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      
      totalSize += stats.size;
      totalLines += content.split('\n').length;
      
      // Count complex selectors (more than 3 parts)
      const selectors = content.match(/[^{}]+{/g) || [];
      selectors.forEach(selector => {
        const parts = selector.trim().split(/[\s>+~]/).filter(part => part.length > 0);
        if (parts.length > 3) complexSelectors++;
      });
    });

    const avgFileSize = totalSize / files.length;
    const avgLines = totalLines / files.length;
    const complexityRate = (complexSelectors / totalLines) * 100;

    if (avgFileSize < 5000 && avgLines < 200 && complexityRate < 10) {
      this.addResult(testName, 'PASS', `Performance: ${avgFileSize.toFixed(0)}B avg file size, ${avgLines.toFixed(0)} avg lines, ${complexityRate.toFixed(1)}% complexity`);
    } else {
      this.addResult(testName, 'WARN', `Performance: ${avgFileSize.toFixed(0)}B avg file size, ${avgLines.toFixed(0)} avg lines, ${complexityRate.toFixed(1)}% complexity`);
    }
  }

  /**
   * Test code quality
   */
  testCodeQuality() {
    const testName = 'Code Quality';
    const componentsDir = path.join(this.cssDir, 'components');
    const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.css'));
    
    let comments = 0;
    let emptyRules = 0;
    let duplicateSelectors = 0;
    const allSelectors = new Set();

    files.forEach(file => {
      const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
      
      // Count comments
      comments += (content.match(/\/\*[\s\S]*?\*\//g) || []).length;
      
      // Count empty rules
      emptyRules += (content.match(/[^{}]+{\s*}/g) || []).length;
      
      // Check for duplicate selectors
      const selectors = content.match(/[^{}]+{/g) || [];
      selectors.forEach(selector => {
        const cleanSelector = selector.trim().replace(/\s*{/, '');
        if (allSelectors.has(cleanSelector)) {
          duplicateSelectors++;
        } else {
          allSelectors.add(cleanSelector);
        }
      });
    });

    const commentRate = (comments / files.length);
    const emptyRate = (emptyRules / allSelectors.size) * 100;
    const duplicateRate = (duplicateSelectors / allSelectors.size) * 100;

    if (commentRate >= 2 && emptyRate < 5 && duplicateRate < 2) {
      this.addResult(testName, 'PASS', `Quality: ${commentRate.toFixed(1)} comments/file, ${emptyRate.toFixed(1)}% empty rules, ${duplicateRate.toFixed(1)}% duplicates`);
    } else {
      this.addResult(testName, 'WARN', `Quality: ${commentRate.toFixed(1)} comments/file, ${emptyRate.toFixed(1)}% empty rules, ${duplicateRate.toFixed(1)}% duplicates`);
    }
  }

  /**
   * Add test result
   */
  addResult(testName, status, message) {
    const result = { testName, status, message };
    this.results.tests.push(result);
    
    if (status === 'PASS') {
      this.results.passed++;
      console.log(`✅ ${testName}: ${message}`);
    } else if (status === 'WARN') {
      this.results.warnings++;
      console.log(`⚠️  ${testName}: ${message}`);
    } else {
      this.results.failed++;
      console.log(`❌ ${testName}: ${message}`);
    }
  }

  /**
   * Print test results
   */
  printResults() {
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Total: ${this.results.tests.length}`);
    
    const successRate = ((this.results.passed + this.results.warnings) / this.results.tests.length) * 100;
    console.log(`🎯 Success Rate: ${successRate.toFixed(1)}%`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'FAIL')
        .forEach(test => console.log(`  - ${test.testName}: ${test.message}`));
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const testSuite = new CSSTestSuite();
  testSuite.runAllTests().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}

module.exports = CSSTestSuite;