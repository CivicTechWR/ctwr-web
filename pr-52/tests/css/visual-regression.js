const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('Running CSS Asset Smoke Tests...');

const meetingIncludePath = path.join('_includes', 'meeting-section.html');
assert.ok(fs.existsSync(meetingIncludePath), 'Missing meeting-section include');

const meetingHtml = fs.readFileSync(meetingIncludePath, 'utf8');
const assetPaths = [];

const srcRegex = /src="([^"]+)"/g;
const srcsetRegex = /srcset="([^"]+)"/g;

for (const match of meetingHtml.matchAll(srcRegex)) {
  assetPaths.push(match[1]);
}

for (const match of meetingHtml.matchAll(srcsetRegex)) {
  const srcsetEntries = match[1]
    .split(',')
    .map((entry) => entry.trim().split(' ')[0])
    .filter(Boolean);
  assetPaths.push(...srcsetEntries);
}

const localAssets = assetPaths.filter((asset) => asset.startsWith('/images/'));
assert.ok(localAssets.length > 0, 'No meeting image assets found');

localAssets.forEach((asset) => {
  const filePath = path.join(process.cwd(), asset.replace(/^\//, ''));
  assert.ok(fs.existsSync(filePath), `Missing asset file: ${asset}`);
});

const criticalCssPath = path.join('_includes', 'critical-css.html');
assert.ok(fs.existsSync(criticalCssPath), 'Missing critical CSS include');

const criticalCss = fs.readFileSync(criticalCssPath, 'utf8');
const rangeSyntaxTokens = ['(width <', '(width <=', '(width >=', '(width >'];
rangeSyntaxTokens.forEach((token) => {
  assert.ok(!criticalCss.includes(token), `Found range syntax token in critical CSS: ${token}`);
});

console.log('CSS asset smoke tests passed.');
