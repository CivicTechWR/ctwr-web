"use strict";

const { test, expect } = require("@playwright/test");

// Stub the GitHub API so tests don't depend on network availability or rate limits.
// The real fetch in loadGitHubProjects() targets api.github.com; page.route()
// intercepts it at the browser level before it leaves the machine.
const MOCK_REPOS = [
  {
    name: "mock-project",
    description: "A mock CivicTech project for testing",
    html_url: "https://github.com/CivicTechWR/mock-project",
    language: "JavaScript",
    fork: false,
    archived: false,
  },
];

test.describe("Projects page — filter bar and card loading", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api.github.com/orgs/CivicTechWR/repos**", (route) =>
      route.fulfill({ json: MOCK_REPOS }),
    );
    await page.goto("/projects.html");
  });

  test("filter bar is visible with at least two buttons", async ({ page }) => {
    await page.waitForSelector("#project-container .project-card");
    const filterBar = page.locator("#projects-filter-bar");
    await expect(filterBar).toBeVisible();
    // Expect "All" button plus at least one tag filter
    const btns = page.locator(".filter-btn");
    const count = await btns.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('"All" filter button is active by default', async ({ page }) => {
    const allBtn = page.locator('.filter-btn[data-filter="all"]');
    await expect(allBtn).toBeVisible();
    await expect(allBtn).toHaveClass(/filter-btn--active/);
  });

  test("featured project cards load from projects.json", async ({ page }) => {
    await page.waitForSelector("#project-container .project-card");
    const cards = page.locator("#project-container .project-card");
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("GitHub project cards load after API fetch", async ({ page }) => {
    await page.waitForSelector("#github-projects-container .project-card");
    const cards = page.locator("#github-projects-container .project-card");
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("clicking a tag filter makes it active and deactivates All", async ({ page }) => {
    await page.waitForSelector("#project-container .project-card");

    const allBtn = page.locator('.filter-btn[data-filter="all"]');
    const tagBtns = page.locator('.filter-btn:not([data-filter="all"])');

    if ((await tagBtns.count()) === 0) {
      test.skip();
      return;
    }

    const firstTag = tagBtns.first();
    await firstTag.click();

    await expect(firstTag).toHaveClass(/filter-btn--active/);
    await expect(allBtn).not.toHaveClass(/filter-btn--active/);
  });
});
