"use strict";

const { test, expect } = require("@playwright/test");

test.describe("Blog", () => {
  test("nav Blog link opens the on-site blog", async ({ page }) => {
    await page.goto("/");
    await page.locator("#navbarNav a", { hasText: "Blog" }).first().click();
    await expect(page).toHaveURL(/\/blog\/$/);
    await expect(page.locator("h1.page-title")).toHaveText("Blog");
  });

  test("index lists recaps grouped by season, newest first", async ({ page }) => {
    await page.goto("/blog/");
    const seasons = page.locator(".blog-season-title");
    await expect(seasons.first()).toBeVisible();
    const titles = await seasons.allTextContents();
    const numbers = titles.map((t) => Number(t.replace(/\D/g, "")));
    expect(numbers).toEqual([...numbers].sort((a, b) => b - a));
    await expect(page.locator(".blog-list-item a").first()).toBeVisible();
  });

  // Post pages live two directories deep, so this catches relative asset paths in the layout.
  test("post page loads site styles and links back to its source", async ({ page }) => {
    await page.goto("/blog/");
    await page.locator(".blog-list-item a").first().click();
    await expect(page).toHaveURL(/\/blog\/[^/]+\/$/);

    const article = page.locator("main.post");
    await expect(article).toBeVisible();
    await expect(article).toHaveCSS("max-width", "760px");

    const source = page.locator(".post-meta a");
    await expect(source).toHaveAttribute("href", /^https:\/\/discourse\.ctwr\.org\/t\//);

    await page.locator(".post-back a").click();
    await expect(page).toHaveURL(/\/blog\/$/);
  });
});
