"use strict";

const { test, expect } = require("@playwright/test");

// Smoke tests for Phase 1 CSS modularization.
// These verify that the extracted partials still apply correctly after the
// postcss-import split: variables.css, grid.css, icons.css, sponsors.css, shapes.css.
// A failure here means a CSS regression was introduced during extraction — not a product bug.

test.describe("Phase 1 CSS smoke — homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // ── variables.css ─────────────────────────────────────────────────────────
  test("CSS custom properties are defined on :root (variables.css)", async ({ page }) => {
    const [primaryColor, secondaryColor, bodyFont] = await page.evaluate(() => [
      getComputedStyle(document.documentElement).getPropertyValue("--primary-color").trim(),
      getComputedStyle(document.documentElement).getPropertyValue("--secondary-color").trim(),
      getComputedStyle(document.documentElement).getPropertyValue("--body-font-family").trim(),
    ]);
    expect(primaryColor).toBeTruthy();
    expect(secondaryColor).toBeTruthy();
    expect(bodyFont).toContain("DM Sans");
  });

  // ── grid.css ──────────────────────────────────────────────────────────────
  test("box-sizing is border-box (grid.css reset)", async ({ page }) => {
    const boxSizing = await page.evaluate(() => getComputedStyle(document.body).boxSizing);
    expect(boxSizing).toBe("border-box");
  });

  test(".container is visible with non-zero dimensions (grid.css)", async ({ page }) => {
    const container = page.locator(".container").first();
    await expect(container).toBeVisible();
    const box = await container.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  // ── icons.css ─────────────────────────────────────────────────────────────
  test(".svg-sprite-defs is in the DOM and hidden (icons.css)", async ({ page }) => {
    await expect(page.locator(".svg-sprite-defs")).toBeAttached();
    await expect(page.locator(".svg-sprite-defs")).toBeHidden();
  });

  test(".icon elements in hero buttons are visible (icons.css)", async ({ page }) => {
    await expect(page.locator(".icon").first()).toBeVisible();
  });

  // ── sponsors.css ──────────────────────────────────────────────────────────
  test("#sponsor-container uses CSS grid layout (sponsors.css)", async ({ page }) => {
    const display = await page.locator("#sponsor-container").evaluate((el) =>
      getComputedStyle(el).display,
    );
    expect(display).toBe("grid");
  });

  test(".sponsors-item-height containers are visible with correct height (sponsors.css)", async ({
    page,
  }) => {
    const firstItem = page.locator(".sponsors-item-height").first();
    await expect(firstItem).toBeVisible();
    const box = await firstItem.boundingBox();
    expect(box.height).toBeGreaterThan(0);
  });

  test("#previous-sponsor-container uses CSS grid layout (sponsors.css)", async ({ page }) => {
    const display = await page.locator("#previous-sponsor-container").evaluate((el) =>
      getComputedStyle(el).display,
    );
    expect(display).toBe("grid");
  });

  // ── shapes.css ────────────────────────────────────────────────────────────
  test(".shape-container sections are present on the page (shapes.css)", async ({ page }) => {
    const count = await page.locator(".shape-container").count();
    expect(count).toBeGreaterThan(0);
  });

  test(".abstract-shape elements are absolutely positioned with negative z-index (shapes.css)", async ({
    page,
  }) => {
    const { position, zIndex } = await page.locator(".abstract-shape").first().evaluate((el) => {
      const s = getComputedStyle(el);
      return { position: s.position, zIndex: s.zIndex };
    });
    expect(position).toBe("absolute");
    expect(Number(zIndex)).toBeLessThan(0);
  });

  test(".abstract-shape elements have pointer-events: none (shapes.css)", async ({ page }) => {
    const pointerEvents = await page.locator(".abstract-shape").first().evaluate((el) =>
      getComputedStyle(el).pointerEvents,
    );
    expect(pointerEvents).toBe("none");
  });
});
