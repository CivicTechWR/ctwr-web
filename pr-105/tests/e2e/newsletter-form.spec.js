"use strict";

const { test, expect } = require("@playwright/test");

const PAGES_WITH_NEWSLETTER = ["/", "/about.html", "/projects.html"];

for (const page of PAGES_WITH_NEWSLETTER) {
  test.describe(`Newsletter form on ${page}`, () => {
    test.beforeEach(async ({ page: pw }) => {
      await pw.goto(page);
    });

    test("newsletter section is present", async ({ page: pw }) => {
      await expect(pw.locator("#newsletter-section")).toBeVisible();
    });

    test("email input is present and required", async ({ page: pw }) => {
      const input = pw.locator("#mce-EMAIL-main");
      await expect(input).toBeVisible();
      await expect(input).toHaveAttribute("type", "email");
      await expect(input).toHaveAttribute("required");
      await expect(input).toHaveAttribute("aria-label", "Email Address");
    });

    test("subscribe button is present", async ({ page: pw }) => {
      const btn = pw.locator("#mc-embedded-subscribe-main");
      await expect(btn).toBeVisible();
      await expect(btn).toHaveAttribute("type", "submit");
    });

    test("honeypot field exists and has tabindex -1", async ({ page: pw }) => {
      // Verify the honeypot input is in the DOM with correct attributes
      const tabindex = await pw.locator("#newsletter-section").evaluate((section) => {
        const input = section.querySelector(
          'input[name="b_70e9ca4ba196596a75a7b6a3e_e8b89282ec"]',
        );
        return input ? input.getAttribute("tabindex") : null;
      });
      expect(tabindex).toBe("-1");
    });

    test("honeypot wrapper is visually hidden", async ({ page: pw }) => {
      const isHidden = await pw.locator("#newsletter-section").evaluate((section) => {
        const wrapper = section.querySelector(".mc-honeypot");
        if (!wrapper) return false;
        const style = window.getComputedStyle(wrapper);
        const left = parseInt(style.left, 10);
        return left < -1000;
      });
      expect(isHidden).toBe(true);
    });

    test("form POSTs to Mailchimp and opens in new tab", async ({ page: pw }) => {
      const form = pw.locator("#mc-embedded-subscribe-form-main");
      await expect(form).toHaveAttribute(
        "action",
        /civictechwr\.us11\.list-manage\.com/,
      );
      await expect(form).toHaveAttribute("method", "post");
      await expect(form).toHaveAttribute("target", "_blank");
    });

    test("browser rejects empty submission", async ({ page: pw }) => {
      await pw.locator("#mc-embedded-subscribe-main").click();
      const valid = await pw.locator("#mce-EMAIL-main").evaluate((el) => el.checkValidity());
      expect(valid).toBe(false);
    });

    test("browser rejects invalid email", async ({ page: pw }) => {
      await pw.locator("#mce-EMAIL-main").fill("not-an-email");
      await pw.locator("#mc-embedded-subscribe-main").click();
      const valid = await pw.locator("#mce-EMAIL-main").evaluate((el) => el.checkValidity());
      expect(valid).toBe(false);
    });

    test("accepts a valid email without navigating to Mailchimp", async ({
      page: pw,
    }) => {
      await pw.route(/list-manage\.com/, (route) => route.abort());
      await pw.locator("#mce-EMAIL-main").fill("test@example.com");
      await expect(pw.locator("#mce-EMAIL-main")).toHaveValue("test@example.com");
    });
  });
}
