const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Hard reload to bypass cache
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });

  console.log('\n🔍 FINAL VERIFICATION OF CSS FIXES\n');

  // Test 1: Paragraph spacing (should be 32px now)
  const paragraphMargin = await page.evaluate(() => {
    const p = document.querySelector('.about-thumb p');
    const styles = window.getComputedStyle(p);
    return styles.marginBottom;
  });

  console.log('📏 Paragraph Spacing Test:');
  console.log('  Current margin-bottom: ' + paragraphMargin);
  console.log('  Expected: 32px (var(--space-6))');
  console.log('  Status: ' + (paragraphMargin === '32px' ? '✅ PASS - Spacing increased successfully!' : '❌ FAIL') + '\n');

  // Test 2: Safari button text visibility fix
  const buttonTextFillColor = await page.evaluate(() => {
    const btn = document.querySelector('.btn--light');
    const styles = window.getComputedStyle(btn);
    return styles.webkitTextFillColor || 'not set';
  });

  const buttonColor = await page.evaluate(() => {
    const btn = document.querySelector('.btn--light');
    const styles = window.getComputedStyle(btn);
    return styles.color;
  });

  console.log('🎨 Safari Button Text Visibility Test:');
  console.log('  Button color: ' + buttonColor);
  console.log('  -webkit-text-fill-color: ' + buttonTextFillColor);
  console.log('  Expected: Should NOT be transparent');
  console.log('  Status: ' + (buttonTextFillColor !== 'transparent' && buttonTextFillColor !== 'rgba(0, 0, 0, 0)' ? '✅ PASS - Text visible!' : '❌ FAIL') + '\n');

  // Test 3: Cache-busting parameter
  const cssUrl = await page.evaluate(() => {
    const link = document.querySelector('link[href*="main.css"]');
    return link ? link.href : 'not found';
  });

  console.log('🔄 Cache-Busting Verification:');
  console.log('  CSS URL: ' + cssUrl);
  console.log('  Status: ' + (cssUrl.includes('v=1761100001') ? '✅ PASS - New version loaded!' : '❌ FAIL - Old cache') + '\n');

  await browser.close();
})();
