const assert = require('assert');
const { safeUrl } = require('../../js/projects.js');

console.log('Running safeUrl() sanitizer tests...');

assert.strictEqual(safeUrl('javascript:alert(1)'), '#', 'Should reject javascript: URLs');
assert.strictEqual(safeUrl('data:text/html,<script>alert(1)</script>'), '#', 'Should reject data: URLs');
assert.strictEqual(safeUrl('//evil.com'), '#', 'Should reject protocol-relative URLs');
assert.strictEqual(safeUrl('/\\evil.com'), '#', 'Should reject backslash paths that browsers resolve as protocol-relative');
assert.strictEqual(safeUrl('/\t/evil.com'), '#', 'Should reject paths with an embedded tab that browsers strip before resolving');
assert.strictEqual(safeUrl('/\n/evil.com'), '#', 'Should reject paths with an embedded newline that browsers strip before resolving');
assert.strictEqual(safeUrl('/\r/evil.com'), '#', 'Should reject paths with an embedded carriage return that browsers strip before resolving');
assert.strictEqual(safeUrl(''), '#', 'Should return # for empty input');
assert.strictEqual(safeUrl(undefined), '#', 'Should return # for undefined input');
assert.strictEqual(safeUrl(null), '#', 'Should return # for null input');
assert.strictEqual(safeUrl('vbscript:alert(1)'), '#', 'Should reject vbscript: URLs');
assert.strictEqual(safeUrl('mailto:someone@example.com'), '#', 'Should reject mailto: URLs (not http/https)');

assert.strictEqual(
  safeUrl('https://github.com/CivicTechWR/ctwr-web'),
  'https://github.com/CivicTechWR/ctwr-web',
  'Should pass through https:// URLs unchanged'
);
assert.strictEqual(
  safeUrl('http://example.com'),
  'http://example.com',
  'Should pass through http:// URLs unchanged'
);
assert.strictEqual(
  safeUrl('HTTPS://github.com/CivicTechWR/ctwr-web'),
  'HTTPS://github.com/CivicTechWR/ctwr-web',
  'Should pass through uppercase-scheme https URLs unchanged'
);
assert.strictEqual(
  safeUrl('/images/logo.png'),
  '/images/logo.png',
  'Should pass through relative paths unchanged'
);
assert.strictEqual(
  safeUrl('images/logo.png'),
  'images/logo.png',
  'Should pass through relative paths without a leading slash (resolves same-origin)'
);
// "https:evil.com" has no "//" after the scheme, so the URL parser treats it
// as a same-scheme relative reference against the base rather than a new
// authority — it resolves to a same-origin path, not to evil.com.
assert.strictEqual(
  safeUrl('https:evil.com'),
  'https:evil.com',
  'Scheme-without-slashes input should resolve same-origin, not to an external host'
);

console.log('safeUrl() sanitizer tests passed.');
