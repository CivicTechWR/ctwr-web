module.exports = {
  content: [
    './*.html',
    './_includes/*.html',
    './_layouts/*.html',
    './js/*.js'
  ],
  css: ['./css/bootstrap.css'],
  output: './css/',
  safelist: [
    // Dynamic classes that might be added by JavaScript
    'show',
    'collapse',
    'collapsing',
    'fade',
    'active',
    // Responsive breakpoint classes
    /^col-/,
    /^col-sm-/,
    /^col-md-/,
    /^col-lg-/,
    /^col-xl-/,
    /^d-/,
    /^flex-/,
    /^text-/,
    /^align-/,
    /^justify-/,
    // Spacing utilities
    /^m[tblr]?-/,
    /^p[tblr]?-/,
    // Button variants
    /^btn/,
    // Navbar
    /^nav/,
    /^navbar/
  ]
};
