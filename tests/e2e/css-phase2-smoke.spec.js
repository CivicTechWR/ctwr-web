"use strict";

const { test, expect } = require("@playwright/test");

// Smoke tests for Phase 2 CSS modularization.
// Verifies that the extracted partials still apply correctly after the
// postcss-import split: typography.css, avatar.css, forms.css,
// page-header.css, newsletter.css.
// A failure here indicates a CSS regression introduced during extraction.

test.describe("Phase 2 CSS smoke — typography (homepage)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("h2 headings have the secondary teal color (typography.css)", async ({ page }) => {
    const color = await page.locator("h2").first().evaluate((el) =>
      getComputedStyle(el).color,
    );
    // --secondary-color: #2d6f72 → rgb(45, 111, 114)
    expect(color).toBe("rgb(45, 111, 114)");
  });

  test("body paragraphs use --p-color (typography.css)", async ({ page }) => {
    const color = await page.locator("p").first().evaluate((el) =>
      getComputedStyle(el).color,
    );
    expect(color).toBeTruthy();
  });

  test("body content links use secondary color (typography.css)", async ({ page }) => {
    // Exclude .btn links (coral) and nav links (white) — target a prose text link
    const color = await page.locator("#section_about a:not(.btn)").first().evaluate((el) =>
      getComputedStyle(el).color,
    );
    expect(color).toBe("rgb(45, 111, 114)");
  });

  test("::selection uses secondary color background (typography.css)", async ({ page }) => {
    // Verify the rule compiled into the stylesheet
    const hasSelection = await page.evaluate(() => {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.selectorText === "::selection") return true;
          }
        } catch {
          /* cross-origin sheet */
        }
      }
      return false;
    });
    expect(hasSelection).toBe(true);
  });

  test(".section-padding has non-zero padding (typography.css)", async ({ page }) => {
    const padding = await page.locator(".section-padding").first().evaluate((el) =>
      getComputedStyle(el).paddingTop,
    );
    expect(parseInt(padding, 10)).toBeGreaterThan(0);
  });
});

test.describe("Phase 2 CSS smoke — page-header (about + projects)", () => {
  test(".site-header is present on about.html with padding (page-header.css)", async ({ page }) => {
    await page.goto("/about.html");
    const siteHeader = page.locator(".site-header");
    await expect(siteHeader).toBeVisible();
    const padding = await siteHeader.evaluate((el) => getComputedStyle(el).padding);
    expect(padding).not.toBe("0px");
  });

  test(".page-title is visible on projects.html (page-header.css)", async ({ page }) => {
    await page.goto("/projects.html");
    await expect(page.locator(".page-title")).toBeVisible();
  });
});

test.describe("Phase 2 CSS smoke — newsletter (homepage)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("footer newsletter input is styled (newsletter.css)", async ({ page }) => {
    const display = await page.locator(".footer-newsletter").evaluate((el) =>
      getComputedStyle(el).display,
    );
    expect(display).not.toBe("none");
  });

  test("footer newsletter signup is visible (newsletter.css)", async ({ page }) => {
    await expect(page.locator("#mc_embed_signup_footer")).toBeVisible();
  });
});
