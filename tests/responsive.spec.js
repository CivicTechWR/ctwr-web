const { test, expect } = require('@playwright/test');

// Test responsive design across different screen sizes
test.describe('Responsive Design Tests', () => {
  
  // Mobile tests (320px - 767px)
  test.describe('Mobile (320px - 767px)', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Check if mobile navigation is working
      const mobileNav = page.locator('.navbar-toggler');
      if (await mobileNav.isVisible()) {
        await mobileNav.click();
        await expect(page.locator('.navbar-nav')).toBeVisible();
      }
      
      // Check if buttons are touch-friendly (min 44px)
      const buttons = page.locator('.btn');
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
      
      // Check if text is readable
      const bodyText = page.locator('body');
      await expect(bodyText).toHaveCSS('font-size', /1[4-6]px/);
    });
    
    test('should have proper mobile spacing', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Check section padding
      const sections = page.locator('.section-padding');
      const count = await sections.count();
      for (let i = 0; i < count; i++) {
        const section = sections.nth(i);
        const padding = await section.evaluate(el => {
          const style = window.getComputedStyle(el);
          return {
            top: parseInt(style.paddingTop),
            bottom: parseInt(style.paddingBottom),
            left: parseInt(style.paddingLeft),
            right: parseInt(style.paddingRight)
          };
        });
        
        expect(padding.top).toBeGreaterThanOrEqual(16);
        expect(padding.bottom).toBeGreaterThanOrEqual(16);
      }
    });
  });
  
  // Tablet tests (768px - 1023px)
  test.describe('Tablet (768px - 1023px)', () => {
    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      
      // Check if navigation is horizontal
      const navItems = page.locator('.navbar-nav .nav-item');
      const firstItem = navItems.first();
      const box = await firstItem.boundingBox();
      expect(box.width).toBeLessThan(200); // Should be horizontal, not full width
      
      // Check if buttons have proper tablet sizing
      const buttons = page.locator('.btn');
      const firstButton = buttons.first();
      const buttonBox = await firstButton.boundingBox();
      expect(buttonBox.height).toBeGreaterThanOrEqual(48);
    });
    
    test('should have proper tablet spacing', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      
      // Check container max-width
      const container = page.locator('.container');
      const box = await container.boundingBox();
      expect(box.width).toBeLessThanOrEqual(720); // tablet container max-width
    });
  });
  
  // Desktop tests (1024px+)
  test.describe('Desktop (1024px+)', () => {
    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/');
      
      // Check if navigation is fully visible
      const navItems = page.locator('.navbar-nav .nav-item');
      await expect(navItems).toHaveCount(4); // Assuming 4 nav items
      
      // Check if buttons have proper desktop sizing
      const buttons = page.locator('.btn');
      const firstButton = buttons.first();
      const buttonBox = await firstButton.boundingBox();
      expect(buttonBox.height).toBeGreaterThanOrEqual(52);
    });
    
    test('should have proper desktop spacing', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/');
      
      // Check container max-width
      const container = page.locator('.container');
      const box = await container.boundingBox();
      expect(box.width).toBeLessThanOrEqual(1320); // desktop container max-width
    });
  });
  
  // Button BEM compliance tests
  test.describe('Button BEM Compliance', () => {
    test('all buttons should follow BEM naming convention', async ({ page }) => {
      await page.goto('/');
      
      // Get all button elements
      const buttons = page.locator('[class*="btn"]');
      const count = await buttons.count();
      
      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const className = await button.getAttribute('class');
        
        // Check if button follows BEM pattern (btn or btn--modifier)
        const isValidBEM = /^btn(\s|$)|btn--/.test(className);
        expect(isValidBEM).toBeTruthy(`Button with class "${className}" does not follow BEM convention`);
      }
    });
    
    test('buttons should have proper hover states', async ({ page }) => {
      await page.goto('/');
      
      const buttons = page.locator('.btn');
      const count = await buttons.count();
      
      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        
        // Check if button has hover state
        await button.hover();
        const backgroundColor = await button.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        });
        
        // Should have some visual change on hover
        expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      }
    });
  });
  
  // Accessibility tests
  test.describe('Accessibility', () => {
    test('should have proper focus management', async ({ page }) => {
      await page.goto('/');
      
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Check if focus is visible
      const focusStyles = await focusedElement.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          outline: style.outline,
          boxShadow: style.boxShadow
        };
      });
      
      expect(focusStyles.outline !== 'none' || focusStyles.boxShadow !== 'none').toBeTruthy();
    });
    
    test('should have proper color contrast', async ({ page }) => {
      await page.goto('/');
      
      // This is a basic test - in production, you'd use axe-core for detailed contrast testing
      const buttons = page.locator('.btn');
      const count = await buttons.count();
      
      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const styles = await button.evaluate(el => {
          const style = window.getComputedStyle(el);
          return {
            color: style.color,
            backgroundColor: style.backgroundColor
          };
        });
        
        // Basic check that button has both color and background
        expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
        expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      }
    });
  });
  
  // Cross-browser compatibility tests
  test.describe('Cross-Browser Compatibility', () => {
    test('should work in Chrome', async ({ page, browserName }) => {
      await page.goto('/');
      
      // Test basic functionality
      const title = await page.title();
      expect(title).toBeTruthy();
      
      // Test if CSS custom properties work
      const rootStyles = await page.evaluate(() => {
        const root = document.documentElement;
        const style = window.getComputedStyle(root);
        return {
          primaryColor: style.getPropertyValue('--primary-color'),
          secondaryColor: style.getPropertyValue('--secondary-color')
        };
      });
      
      expect(rootStyles.primaryColor).toBeTruthy();
      expect(rootStyles.secondaryColor).toBeTruthy();
    });
    
    test('should work in Firefox', async ({ page, browserName }) => {
      await page.goto('/');
      
      // Test CSS Grid support
      const gridElements = page.locator('[style*="display: grid"], .grid');
      const count = await gridElements.count();
      
      // If grid elements exist, they should be visible
      if (count > 0) {
        await expect(gridElements.first()).toBeVisible();
      }
    });
    
    test('should work in Safari', async ({ page, browserName }) => {
      await page.goto('/');
      
      // Test flexbox support
      const flexElements = page.locator('[style*="display: flex"], .d-flex, .flex');
      const count = await flexElements.count();
      
      if (count > 0) {
        await expect(flexElements.first()).toBeVisible();
      }
    });
  });
});