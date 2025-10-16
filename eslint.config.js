module.exports = [
  {
    files: ['js/**/*.js'],
    ignores: ['**/*.min.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        XMLHttpRequest: 'readonly',
        Blob: 'readonly',
        Image: 'readonly',
        Event: 'readonly',
        Element: 'readonly',
        HTMLElement: 'readonly',
        Node: 'readonly',
        ShadowRoot: 'readonly',
        CSS: 'readonly',
        getComputedStyle: 'readonly',
        IntersectionObserver: 'readonly',
        requestAnimFrame: 'readonly',
        cancelRequestAnimFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        pJSDom: 'readonly',
        check: 'readonly',
        // Performance APIs
        performance: 'readonly',
        PerformanceObserver: 'readonly',
        // Library globals
        jQuery: 'readonly',
        $: 'readonly',
        particlesJS: 'readonly',
        MagnificPopup: 'readonly',
        // Module globals
        module: 'readonly',
        define: 'readonly',
        self: 'readonly'
      }
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'warn',
      'no-extra-semi': 'error',
      'no-func-assign': 'error',
      'no-irregular-whitespace': 'error',
      'no-obj-calls': 'error',
      'no-sparse-arrays': 'error',
      'no-unexpected-multiline': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error'
    }
  },
        {
          ignores: [
            'node_modules/',
            '_site/',
            'vendor/',
            '**/*.min.js',
            'js/bootstrap.js',
            'js/jquery.js',
            'js/jquery.magnific-popup.js'
          ]
        }
];
