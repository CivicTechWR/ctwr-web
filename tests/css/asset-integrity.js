const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('Running CSS Asset Smoke Tests...');

const htmlSourcesToCheck = [
  path.join('_includes', 'meeting-section.html'),
  'index.html',
  'about.html',
];
htmlSourcesToCheck.forEach((filePath) => {
  assert.ok(fs.existsSync(filePath), `Missing HTML source: ${filePath}`);
});

const assetPaths = [];

const srcRegex = /(?:^|[\s<])src\s*=\s*["']([^"']+)["']/gi;
const srcsetRegex = /(?:^|[\s<])srcset\s*=\s*["']([^"']+)["']/gi;

// Regression test: the attribute boundary must reject hyphenated/dotted
// lookalikes ("data-src", "data.src") while still matching real src/srcset
// attributes regardless of quote style or case.
const boundaryFixture =
  '<img data-src="/images/lazy.jpg" data.src="/images/dotted.jpg" ' +
  "SRC='/images/real.jpg' srcset=\"/images/x.webp\">";
assert.deepStrictEqual(
  [...boundaryFixture.matchAll(srcRegex)].map((m) => m[1]),
  ['/images/real.jpg'],
  'srcRegex should ignore data-src/data.src and match real src attributes regardless of case/quote style'
);
assert.deepStrictEqual(
  [...boundaryFixture.matchAll(srcsetRegex)].map((m) => m[1]),
  ['/images/x.webp'],
  'srcsetRegex should match real srcset attributes'
);

htmlSourcesToCheck.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');

  for (const match of html.matchAll(srcRegex)) {
    assetPaths.push(match[1]);
  }

  for (const match of html.matchAll(srcsetRegex)) {
    const srcsetEntries = match[1]
      .split(',')
      .map((entry) => entry.trim().split(' ')[0])
      .filter(Boolean);
    assetPaths.push(...srcsetEntries);
  }
});

const localAssets = assetPaths.filter((asset) => asset.startsWith('/images/'));
assert.ok(localAssets.length > 0, 'No local image assets found across checked HTML sources');

localAssets.forEach((asset) => {
  const filePath = path.join(process.cwd(), asset.replace(/^\//, ''));
  assert.ok(
    fs.existsSync(filePath) && fs.statSync(filePath).isFile(),
    `Missing asset file: ${asset}`
  );
});

const criticalCssPath = path.join('_includes', 'critical-css.html');
assert.ok(fs.existsSync(criticalCssPath), 'Missing critical CSS include');

const criticalCss = fs.readFileSync(criticalCssPath, 'utf8');
const rangeSyntaxTokens = ['(width <', '(width <=', '(width >=', '(width >'];
rangeSyntaxTokens.forEach((token) => {
  assert.ok(!criticalCss.includes(token), `Found range syntax token in critical CSS: ${token}`);
});

console.log('CSS asset smoke tests passed.');
