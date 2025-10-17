/**
 * CSS Visual Regression Testing
 * Automated visual testing for CSS components
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VisualRegressionTester {
  constructor() {
    this.screenshotsDir = path.join(__dirname, '../screenshots');
    this.baselineDir = path.join(this.screenshotsDir, 'baseline');
    this.currentDir = path.join(this.screenshotsDir, 'current');
    this.diffDir = path.join(this.screenshotsDir, 'diff');
    
    // Create directories
    [this.baselineDir, this.currentDir, this.diffDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Run visual regression tests
   */
  async runTests() {
    console.log('🖼️  Starting Visual Regression Tests...\n');

    const tests = [
      {
        name: 'homepage-desktop',
        url: 'http://localhost:4000',
        viewport: { width: 1920, height: 1080 },
        selector: 'body'
      },
      {
        name: 'homepage-tablet',
        url: 'http://localhost:4000',
        viewport: { width: 768, height: 1024 },
        selector: 'body'
      },
      {
        name: 'homepage-mobile',
        url: 'http://localhost:4000',
        viewport: { width: 375, height: 667 },
        selector: 'body'
      },
      {
        name: 'about-page-desktop',
        url: 'http://localhost:4000/about.html',
        viewport: { width: 1920, height: 1080 },
        selector: 'body'
      },
      {
        name: 'projects-page-desktop',
        url: 'http://localhost:4000/projects.html',
        viewport: { width: 1920, height: 1080 },
        selector: 'body'
      },
      {
        name: 'navigation-component',
        url: 'http://localhost:4000',
        viewport: { width: 1920, height: 1080 },
        selector: '.navbar'
      },
      {
        name: 'hero-component',
        url: 'http://localhost:4000',
        viewport: { width: 1920, height: 1080 },
        selector: '.hero'
      },
      {
        name: 'footer-component',
        url: 'http://localhost:4000',
        viewport: { width: 1920, height: 1080 },
        selector: '.footer'
      },
      {
        name: 'button-components',
        url: 'http://localhost:4000',
        viewport: { width: 1920, height: 1080 },
        selector: '.btn'
      },
      {
        name: 'card-components',
        url: 'http://localhost:4000',
        viewport: { width: 1920, height: 1080 },
        selector: '.card'
      }
    ];

    const results = {
      passed: 0,
      failed: 0,
      new: 0,
      tests: []
    };

    for (const test of tests) {
      try {
        const result = await this.runSingleTest(test);
        results.tests.push(result);
        
        if (result.status === 'PASS') {
          results.passed++;
          console.log(`✅ ${test.name}: Visual test passed`);
        } else if (result.status === 'NEW') {
          results.new++;
          console.log(`🆕 ${test.name}: New baseline created`);
        } else {
          results.failed++;
          console.log(`❌ ${test.name}: Visual test failed`);
        }
      } catch (error) {
        results.failed++;
        results.tests.push({
          name: test.name,
          status: 'ERROR',
          message: error.message
        });
        console.log(`❌ ${test.name}: Error - ${error.message}`);
      }
    }

    this.printResults(results);
    return results;
  }

  /**
   * Run a single visual test
   */
  async runSingleTest(test) {
    const { name, url, viewport, selector } = test;
    
    // Check if baseline exists
    const baselinePath = path.join(this.baselineDir, `${name}.png`);
    const currentPath = path.join(this.currentDir, `${name}.png`);
    const diffPath = path.join(this.diffDir, `${name}.png`);

    // Take current screenshot
    await this.takeScreenshot(url, currentPath, viewport, selector);

    if (!fs.existsSync(baselinePath)) {
      // Create baseline
      fs.copyFileSync(currentPath, baselinePath);
      return {
        name,
        status: 'NEW',
        message: 'New baseline created',
        baseline: baselinePath,
        current: currentPath
      };
    }

    // Compare with baseline
    const isDifferent = await this.compareImages(baselinePath, currentPath, diffPath);
    
    if (isDifferent) {
      return {
        name,
        status: 'FAIL',
        message: 'Visual differences detected',
        baseline: baselinePath,
        current: currentPath,
        diff: diffPath
      };
    } else {
      return {
        name,
        status: 'PASS',
        message: 'No visual differences',
        baseline: baselinePath,
        current: currentPath
      };
    }
  }

  /**
   * Take a screenshot using Playwright
   */
  async takeScreenshot(url, outputPath, viewport, selector) {
    const playwright = require('playwright');
    
    let browser;
    try {
      browser = await playwright.chromium.launch({ headless: true });
      const page = await browser.newPage();
      
      await page.setViewportSize(viewport);
      await page.goto(url, { waitUntil: 'networkidle' });
      
      if (selector) {
        await page.waitForSelector(selector, { timeout: 5000 });
        const element = await page.$(selector);
        if (element) {
          await element.screenshot({ path: outputPath });
        } else {
          throw new Error(`Selector ${selector} not found`);
        }
      } else {
        await page.screenshot({ path: outputPath, fullPage: true });
      }
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Compare two images using ImageMagick
   */
  async compareImages(baselinePath, currentPath, diffPath) {
    try {
      // Use ImageMagick to compare images
      execSync(`compare -metric AE "${baselinePath}" "${currentPath}" "${diffPath}"`, { stdio: 'pipe' });
      return false; // No difference
    } catch (error) {
      // ImageMagick returns non-zero exit code when images differ
      return true; // Difference detected
    }
  }

  /**
   * Print test results
   */
  printResults(results) {
    console.log('\n📊 Visual Regression Test Results:');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`🆕 New: ${results.new}`);
    console.log(`📈 Total: ${results.tests.length}`);
    
    const successRate = (results.passed / results.tests.length) * 100;
    console.log(`🎯 Success Rate: ${successRate.toFixed(1)}%`);
    
    if (results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      results.tests
        .filter(test => test.status === 'FAIL')
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.message}`);
          if (test.diff) {
            console.log(`    Diff image: ${test.diff}`);
          }
        });
    }
    
    if (results.new > 0) {
      console.log('\n🆕 New Baselines:');
      results.tests
        .filter(test => test.status === 'NEW')
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.baseline}`);
        });
    }
  }

  /**
   * Update baselines with current screenshots
   */
  async updateBaselines() {
    console.log('🔄 Updating baselines...');
    
    const currentFiles = fs.readdirSync(this.currentDir);
    
    for (const file of currentFiles) {
      if (file.endsWith('.png')) {
        const currentPath = path.join(this.currentDir, file);
        const baselinePath = path.join(this.baselineDir, file);
        
        fs.copyFileSync(currentPath, baselinePath);
        console.log(`✅ Updated baseline: ${file}`);
      }
    }
    
    console.log('🎉 Baselines updated successfully!');
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new VisualRegressionTester();
  
  const command = process.argv[2];
  
  if (command === 'update') {
    tester.updateBaselines();
  } else {
    tester.runTests().then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    });
  }
}

module.exports = VisualRegressionTester;