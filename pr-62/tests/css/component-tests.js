const assert = require('assert');
const fs = require('fs');

console.log('Running CSS Component Tests...');

const cssPath = 'css/main.css';
assert.ok(fs.existsSync(cssPath), 'css/main.css not found');

const css = fs.readFileSync(cssPath, 'utf8');

const requiredSelectors = [
  '.btn',
  '.btn--primary',
  '.btn--light',
  '.btn-group',
  '.col-lg-4',
  '.col-lg-8',
  '.text-lg-end',
  '.section-padding'
];

requiredSelectors.forEach((selector) => {
  assert.ok(css.includes(selector), `Missing selector: ${selector}`);
});

const rangeSyntaxTokens = ['(width <', '(width <=', '(width >=', '(width >'];
rangeSyntaxTokens.forEach((token) => {
  assert.ok(!css.includes(token), `Found range syntax token in CSS: ${token}`);
});

assert.ok(
  /\.section-padding\s*\{[^}]*padding:\s*var\(--section-padding-md\)/s.test(css),
  'section-padding should use var(--section-padding-md)'
);

assert.ok(
  /\.projects-main-centered\s*\{[^}]*max-width:\s*1140px/s.test(css),
  'projects-main-centered should align with container width'
);

console.log('CSS component tests passed.');
