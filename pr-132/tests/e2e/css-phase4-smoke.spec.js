"use strict";

const { test, expect } = require("@playwright/test");

// Smoke tests for Phase 4 CSS modularization.
// Verifies that the extracted partials still apply correctly:
// services.css, footer.css, projects-cards.css, organizers.css,
// pages/about.css, pages/projects.css.
// A failure here indicates a CSS regression introduced during extraction.

test.describe("Phase 4 CSS smoke — services (homepage)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test(".section-secondary-bg text is white (services.css)", async ({ page }) => {
    const color = await page.locator(".section-secondary-bg").first().evaluate((el) =>
      getComputedStyle(el).color,
    );
    // --white-color: #fafafa → rgb(250, 250, 250)
    expect(color).toBe("rgb(250, 250, 250)");
  });

  test(".meeting-section-alt has teal background (services.css)", async ({ page }) => {
    const bg = await page.locator(".meeting-section-alt").evaluate((el) =>
      getComputedStyle(el).backgroundColor,
    );
    // --secondary-color: #2d6f72 → rgb(45, 111, 114)
    expect(bg).toBe("rgb(45, 111, 114)");
  });

  test(".meeting-card is visible (services.css)", async ({ page }) => {
    await expect(page.locator(".meeting-card")).toBeVisible();
  });
});

test.describe("Phase 4 CSS smoke — footer (homepage)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test(".footer-redesign is present (footer.css)", async ({ page }) => {
    await expect(page.locator(".footer-redesign")).toBeVisible();
  });

  test(".footer-redesign has light background (footer.css)", async ({ page }) => {
    const bg = await page.locator(".footer-redesign").evaluate((el) =>
      getComputedStyle(el).backgroundColor,
    );
    // --gray-50 should produce a light color, not white or transparent
    expect(bg).not.toBe("rgba(0, 0, 0, 0)");
    expect(bg).not.toBe("rgb(0, 0, 0)");
  });

  test(".footer-col has min-width set (footer.css)", async ({ page }) => {
    const minWidth = await page.locator(".footer-col").first().evaluate((el) =>
      getComputedStyle(el).minWidth,
    );
    expect(minWidth).not.toBe("0px");
  });
});

test.describe("Phase 4 CSS smoke — projects cards (homepage)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test(".projects-thumb card is visible (projects-cards.css)", async ({ page }) => {
    await expect(page.locator(".projects-thumb").first()).toBeVisible();
  });

  test(".projects-thumb has fixed height (projects-cards.css)", async ({ page }) => {
    const height = await page.locator(".projects-thumb").first().evaluate((el) =>
      getComputedStyle(el).height,
    );
    expect(parseInt(height, 10)).toBeGreaterThan(0);
  });
});

test.describe("Phase 4 CSS smoke — organizers (about page)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about.html");
  });

  test(".organizers-section .organizer-name has bold weight (organizers.css)", async ({ page }) => {
    const fontWeight = await page.locator(".organizers-section .organizer-name").first().evaluate((el) =>
      getComputedStyle(el).fontWeight,
    );
    expect(parseInt(fontWeight, 10)).toBeGreaterThanOrEqual(600);
  });

  test(".about-thumb has padding on homepage (organizers.css)", async ({ page }) => {
    await page.goto("/");
    const paddingRight = await page.locator(".about-thumb").first().evaluate((el) =>
      getComputedStyle(el).paddingRight,
    );
    expect(parseInt(paddingRight, 10)).toBeGreaterThan(0);
  });
});

test.describe("Phase 4 CSS smoke — about page (about.html)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about.html");
  });

  test(".organizer-card has centered text (pages/about.css)", async ({ page }) => {
    const textAlign = await page.locator(".organizer-card").first().evaluate((el) =>
      getComputedStyle(el).textAlign,
    );
    expect(textAlign).toBe("center");
  });

  test(".organizers-grid uses CSS grid (pages/about.css)", async ({ page }) => {
    const display = await page.locator(".organizers-grid").first().evaluate((el) =>
      getComputedStyle(el).display,
    );
    expect(display).toBe("grid");
  });
});

test.describe("Phase 4 CSS smoke — projects page (projects.html)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects.html");
  });

  test(".project-card is visible (pages/projects.css)", async ({ page }) => {
    await expect(page.locator(".project-card").first()).toBeVisible();
  });

  test(".filter-btn is visible (pages/projects.css)", async ({ page }) => {
    await expect(page.locator(".filter-btn").first()).toBeVisible();
  });

  test(".filter-btn--active has teal background (pages/projects.css)", async ({ page }) => {
    const bg = await page.locator(".filter-btn--active").first().evaluate((el) =>
      getComputedStyle(el).backgroundColor,
    );
    expect(bg).toBe("rgb(45, 111, 114)");
  });
});
