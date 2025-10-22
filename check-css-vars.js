const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });

  const cssVars = await page.evaluate(() => {
    const root = document.documentElement;
    const styles = window.getComputedStyle(root);
    return {
      'space-4': styles.getPropertyValue('--space-4'),
      'space-5': styles.getPropertyValue('--space-5'),
      'space-6': styles.getPropertyValue('--space-6'),
      'space-7': styles.getPropertyValue('--space-7')
    };
  });

  const paragraphMarginRaw = await page.evaluate(() => {
    const p = document.querySelector('.about-thumb p');
    const styles = window.getComputedStyle(p);
    return {
      marginBottom: styles.marginBottom,
      marginBottomRaw: getComputedStyle(p).getPropertyValue('margin-bottom')
    };
  });

  console.log('\n📊 CSS Custom Properties:');
  console.log('  --space-4: ' + cssVars['space-4']);
  console.log('  --space-5: ' + cssVars['space-5']);
  console.log('  --space-6: ' + cssVars['space-6']);
  console.log('  --space-7: ' + cssVars['space-7']);
  console.log('\n📏 Paragraph Margin:');
  console.log('  Computed: ' + paragraphMarginRaw.marginBottom);
  console.log('  Raw value: ' + paragraphMarginRaw.marginBottomRaw);

  await browser.close();
})();
