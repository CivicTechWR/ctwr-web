const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });

  // Get all CSS rules that apply to paragraphs
  const allParagraphRules = await page.evaluate(() => {
    const p = document.querySelector('.about-thumb p');
    const matchedRules = [];

    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules || sheet.rules) {
          if (rule.style && rule.style.marginBottom) {
            // Check if this rule applies to our paragraph
            if (p.matches(rule.selectorText)) {
              matchedRules.push({
                selector: rule.selectorText,
                marginBottom: rule.style.marginBottom,
                specificity: 'matched'
              });
            }
          }
        }
      } catch (e) {
        // Skip CORS protected stylesheets
      }
    }

    return matchedRules;
  });

  console.log('\n🎯 CSS Rules Setting margin-bottom on Paragraphs:\n');
  allParagraphRules.forEach(rule => {
    console.log('  Selector: ' + rule.selector);
    console.log('  margin-bottom: ' + rule.marginBottom);
    console.log('  ---');
  });

  await browser.close();
})();
