"use strict";

const { test, expect } = require("@playwright/test");

// Smoke tests for Phase 3 CSS modularization.
// Verifies that the extracted partials still apply correctly after the
// postcss-import split: navigation.css, buttons.css, hero.css.
// A failure here indicates a CSS regression introduced during extraction.

test.describe("Phase 3 CSS smoke — navigation (homepage)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("navbar has dark background (navigation.css)", async ({ page }) => {
    const bg = await page.locator(".navbar").evaluate((el) =>
      getComputedStyle(el).backgroundColor,
    );
    // --dark-color: #000 → rgb(0, 0, 0)
    expect(bg).toBe("rgb(0, 0, 0)");
  });

  test("navbar is sticky positioned (navigation.css)", async ({ page }) => {
    const position = await page.locator(".navbar").evaluate((el) =>
      getComputedStyle(el).position,
    );
    expect(position).toBe("sticky");
  });

  test("skip-link is present and off-screen by default (navigation.css)", async ({ page }) => {
    const skipLink = page.locator(".skip-link");
    await expect(skipLink).toBeAttached();
    const top = await skipLink.evaluate((el) => getComputedStyle(el).top);
    // top: -40px when not focused
    expect(top).toBe("-40px");
  });

  test(".sr-only clips to 1x1px (navigation.css)", async ({ page }) => {
    const srOnly = page.locator(".sr-only").first();
    await expect(srOnly).toBeAttached();
    const width = await srOnly.evaluate((el) => getComputedStyle(el).width);
    expect(width).toBe("1px");
  });

  test("navbar-brand link is present and white (navigation.css)", async ({ page }) => {
    const color = await page.locator(".navbar-brand").evaluate((el) =>
      getComputedStyle(el).color,
    );
    // --white-color: #fafafa → rgb(250, 250, 250)
    expect(color).toBe("rgb(250, 250, 250)");
  });
});

test.describe("Phase 3 CSS smoke — buttons (homepage)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test(".btn--primary has teal background (buttons.css)", async ({ page }) => {
    const bg = await page.locator(".btn--primary").first().evaluate((el) =>
      getComputedStyle(el).backgroundColor,
    );
    // --secondary-color: #2d6f72 → rgb(45, 111, 114)
    expect(bg).toBe("rgb(45, 111, 114)");
  });

  test(".btn--primary has white text (buttons.css)", async ({ page }) => {
    const color = await page.locator(".btn--primary").first().evaluate((el) =>
      getComputedStyle(el).color,
    );
    // --white-color: #fafafa → rgb(250, 250, 250)
    expect(color).toBe("rgb(250, 250, 250)");
  });

  test(".btn--light has teal border (buttons.css)", async ({ page }) => {
    const borderColor = await page.locator(".btn--light").first().evaluate((el) =>
      getComputedStyle(el).borderTopColor,
    );
    expect(borderColor).toBe("rgb(45, 111, 114)");
  });

  test(".btn-group has non-zero gap (buttons.css)", async ({ page }) => {
    const gap = await page.locator(".btn-group").first().evaluate((el) =>
      getComputedStyle(el).gap,
    );
    expect(gap).not.toBe("0px");
    expect(gap).not.toBe("normal");
  });
});

test.describe("Phase 3 CSS smoke — hero (homepage)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test(".hero has dark background (hero.css)", async ({ page }) => {
    const bg = await page.locator(".hero").evaluate((el) =>
      getComputedStyle(el).backgroundColor,
    );
    expect(bg).toBe("rgb(0, 0, 0)");
  });

  test(".hero has min-height 100vh (hero.css)", async ({ page }) => {
    const minHeight = await page.locator(".hero").evaluate((el) =>
      getComputedStyle(el).minHeight,
    );
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    expect(parseInt(minHeight, 10)).toBeGreaterThanOrEqual(viewportHeight * 0.9);
  });

  test(".hero-title is visible (hero.css)", async ({ page }) => {
    await expect(page.locator(".hero-title")).toBeVisible();
  });

  test("@keyframes gradient is defined in stylesheet (hero.css)", async ({ page }) => {
    const hasGradient = await page.evaluate(() => {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSKeyframesRule && rule.name === "gradient") return true;
          }
        } catch {
          /* cross-origin sheet */
        }
      }
      return false;
    });
    expect(hasGradient).toBe(true);
  });

  test("@keyframes fade-in-up is defined in stylesheet (hero.css)", async ({ page }) => {
    const hasFadeInUp = await page.evaluate(() => {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSKeyframesRule && rule.name === "fade-in-up") return true;
          }
        } catch {
          /* cross-origin sheet */
        }
      }
      return false;
    });
    expect(hasFadeInUp).toBe(true);
  });
});
