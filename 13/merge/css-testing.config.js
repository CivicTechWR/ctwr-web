/**
 * CSS Testing Configuration
 * Centralized configuration for all CSS testing tools
 */

module.exports = {
  // Performance Budget Configuration
  budget: {
    css: {
      maxSize: '50KB',
      maxGzipSize: '15KB',
      maxBrotliSize: '12KB',
      warnings: {
        maxSize: '40KB',
        maxGzipSize: '12KB',
        maxBrotliSize: '10KB'
      }
    },
    criticalCss: {
      maxSize: '3KB',
      maxGzipSize: '1KB',
      warnings: {
        maxSize: '2.5KB',
        maxGzipSize: '800B'
      }
    },
    components: {
      maxFiles: 20,
      maxSizePerFile: '5KB',
      warnings: {
        maxFiles: 15,
        maxSizePerFile: '4KB'
      }
    },
    selectors: {
      maxSpecificity: 3,
      maxDepth: 3,
      maxSelectorsPerRule: 2,
      warnings: {
        maxSpecificity: 2,
        maxDepth: 2,
        maxSelectorsPerRule: 1
      }
    },
    customProperties: {
      maxCount: 150,
      maxUnused: 10,
      warnings: {
        maxCount: 120,
        maxUnused: 5
      }
    },
    mediaQueries: {
      maxCount: 20,
      maxNesting: 2,
      warnings: {
        maxCount: 15,
        maxNesting: 1
      }
    },
    performance: {
      maxFCP: '2.0s',
      maxLCP: '3.0s',
      maxCLS: '0.1',
      maxFID: '100ms',
      warnings: {
        maxFCP: '1.5s',
        maxLCP: '2.5s',
        maxCLS: '0.05',
        maxFID: '50ms'
      }
    }
  },

  // Component Testing Configuration
  components: {
    expectedFiles: [
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
    ],
    bemCompliance: {
      minComplianceRate: 95, // 95% BEM compliance required
      warningThreshold: 90   // 90% triggers warning
    },
    noImportant: {
      allowedFiles: ['bootstrap-custom.css'], // Only utility files can use !important
      maxImportantPerFile: 20
    }
  },

  // Visual Regression Testing Configuration
  visualRegression: {
    baseUrl: 'http://localhost:4000',
    viewports: [
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 },
      { name: 'mobile-large', width: 414, height: 896 }
    ],
    tests: [
      {
        name: 'homepage',
        url: '/',
        selectors: ['body', '.navbar', '.hero', '.footer']
      },
      {
        name: 'about-page',
        url: '/about.html',
        selectors: ['body', '.navbar', '.footer']
      },
      {
        name: 'projects-page',
        url: '/projects.html',
        selectors: ['body', '.navbar', '.footer']
      }
    ],
    thresholds: {
      pixelDifference: 100,    // Max pixel difference allowed
      percentageDifference: 1  // Max percentage difference allowed
    }
  },

  // Performance Regression Testing Configuration
  performanceRegression: {
    baselineFile: 'reports/css-regression/baseline.json',
    thresholds: {
      fileSizeIncrease: 10,      // 10% increase triggers regression
      fileSizeDecrease: 20,      // 20% decrease triggers improvement
      componentCountIncrease: 2, // 2+ new components triggers regression
      lineCountIncrease: 20,     // 20% line increase triggers regression
      importantIncrease: 5,      // 5+ new !important triggers regression
      fcpIncrease: 500,          // 500ms FCP increase triggers regression
      lcpIncrease: 1000,         // 1000ms LCP increase triggers regression
      clsIncrease: 0.1           // 0.1 CLS increase triggers regression
    }
  },

  // Code Quality Configuration
  codeQuality: {
    minCommentsPerFile: 2,      // Minimum comments per component file
    maxEmptyRules: 5,           // Maximum empty rules percentage
    maxDuplicateSelectors: 2,   // Maximum duplicate selectors percentage
    minCustomProperties: 100,   // Minimum custom properties required
    maxMediaQueryNesting: 2,    // Maximum media query nesting level
    maxSelectorComplexity: 3    // Maximum selector complexity level
  },

  // Accessibility Configuration
  accessibility: {
    minFocusStyles: 5,          // Minimum focus styles required
    minAriaStyles: 3,           // Minimum ARIA-related styles
    minContrastFeatures: 5,     // Minimum high contrast features
    requiredAriaLabels: [       // Required ARIA labels
      'navigation',
      'main',
      'footer',
      'button'
    ]
  },

  // Browser Support Configuration
  browserSupport: {
    modern: {
      chrome: 90,
      firefox: 88,
      safari: 14,
      edge: 90
    },
    fallbacks: {
      enabled: true,
      ie11: false,
      safari12: false
    }
  },

  // Testing Environment Configuration
  environment: {
    devServer: {
      url: 'http://localhost:4000',
      timeout: 30000
    },
    screenshots: {
      directory: 'tests/screenshots',
      baseline: 'tests/screenshots/baseline',
      current: 'tests/screenshots/current',
      diff: 'tests/screenshots/diff'
    },
    reports: {
      directory: 'reports',
      cssPerformance: 'reports/css-performance',
      cssBudget: 'reports/css-budget',
      cssRegression: 'reports/css-regression'
    }
  },

  // CI/CD Configuration
  ci: {
    failOnRegression: true,
    failOnBudgetExceed: true,
    failOnVisualDifference: true,
    generateReports: true,
    uploadReports: false,
    notifyOnFailure: false
  }
};