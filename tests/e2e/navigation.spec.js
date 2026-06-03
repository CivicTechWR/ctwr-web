"use strict";

const { test, expect } = require("@playwright/test");

// Mobile viewport required — navbar-expand-lg shows the full nav at ≥992px,
// so the toggle button and collapse behaviour only exist below that width.
test.describe("Mobile navigation toggle", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("nav opens when toggle button is clicked", async ({ page }) => {
    const btn = page.locator("#nav-toggle-btn");
    const nav = page.locator("#navbarNav");

    await expect(nav).not.toBeVisible();
    await btn.click();
    await expect(nav).toBeVisible();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
  });

  test("nav closes when clicking outside", async ({ page }) => {
    const btn = page.locator("#nav-toggle-btn");
    const nav = page.locator("#navbarNav");

    await btn.click();
    await expect(nav).toBeVisible();

    // Click a spot in the hero section (outside button and nav)
    await page.locator(".hero").click({ position: { x: 10, y: 10 }, force: true });
    await expect(nav).not.toBeVisible();
    await expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  test("nav closes on Escape key", async ({ page }) => {
    const btn = page.locator("#nav-toggle-btn");
    const nav = page.locator("#navbarNav");

    await btn.click();
    await expect(nav).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(nav).not.toBeVisible();
    await expect(btn).toHaveAttribute("aria-expanded", "false");
  });
});
