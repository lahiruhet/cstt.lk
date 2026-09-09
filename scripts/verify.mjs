import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { preview } from "vite";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

await readFile("dist/index.html");
await mkdir("work", { recursive: true });
const server = await preview({
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
});
const base = "http://127.0.0.1:4173";
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    channel:
      process.env.BROWSER_CHANNEL ||
      (process.platform === "win32" ? "msedge" : undefined),
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().startsWith(base) && response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(
    await page.title(),
    "CS Tours and Transport Service — Long-term vehicle hire. Lasting partnerships.",
  );
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(
    (await page.locator("svg.lucide").count()) > 20,
    true,
    "Icons render",
  );
  const badAnchors = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((link) => link.getAttribute("href"))
        .filter(
          (href) => href.length > 1 && !document.getElementById(href.slice(1)),
        ),
    );
  assert.deepEqual(badAnchors, [], "All section links resolve");
  assert.equal(
    await page
      .locator("img")
      .evaluateAll((images) =>
        images.every((image) => image.complete && image.naturalWidth > 0),
      ),
    true,
    "All images load",
  );
  await page.screenshot({ path: "work/desktop.png", fullPage: true });
  const desktopAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  assert.deepEqual(
    desktopAudit.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
    [],
    "Desktop accessibility",
  );

  await page.getByRole("button", { name: /Cars & compact vehicles/ }).click();
  assert.equal(
    await page
      .getByRole("button", { name: /Cars & compact vehicles/ })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.getByRole("link", { name: "Enquire about cars" }).click();
  assert.equal(
    await page.locator("#service-select").inputValue(),
    "Cars and compact vehicles",
  );
  await page.getByRole("link", { name: "Become a vehicle partner" }).click();
  assert.equal(
    await page.locator("#service-select").inputValue(),
    "Vehicle owner partnership",
  );
  await page.locator('input[name="name"]').fill("Test & Review");
  await page.locator('input[name="email"]').fill("review@example.com");
  await page
    .locator("textarea")
    .fill("Two vans for Colombo. Quote ref: #123 & dates to discuss.");
  assert.equal(
    await page.locator("form").evaluate((form) => form.checkValidity()),
    true,
  );
  await page.getByRole("button", { name: "Prepare email enquiry" }).click();
  await page
    .getByRole("status")
    .filter({ hasText: "Send it from your email app" })
    .waitFor();
  assert.equal(
    await page.locator('input[name="name"]').inputValue(),
    "Test & Review",
    "Enquiry retains entered details",
  );
  await page.locator('input[name="email"]').fill("not-an-email");
  assert.equal(
    await page.locator("form").evaluate((form) => form.checkValidity()),
    false,
    "Invalid email rejected",
  );

  for (const width of [390, 320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base, { waitUntil: "networkidle" });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
      `No horizontal overflow at ${width}px`,
    );
    if (width === 390) {
      await page.screenshot({ path: "work/mobile.png", fullPage: true });
      await page.getByRole("button", { name: "Open navigation" }).click();
      assert.equal(await page.getByRole("navigation").isVisible(), true);
      await page
        .getByRole("navigation")
        .getByRole("link", { name: "Our fleet" })
        .click();
      assert.equal(await page.getByRole("navigation").isVisible(), false);
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.keyboard.press("Escape");
      assert.equal(
        await page
          .getByRole("button", { name: "Open navigation" })
          .getAttribute("aria-expanded"),
        "false",
      );
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      assert.deepEqual(
        audit.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        [],
        "Mobile accessibility",
      );
    }
  }
  const noJs = await browser.newPage({ javaScriptEnabled: false });
  await noJs.goto(base);
  assert.equal(
    await noJs.locator("h1").isVisible(),
    true,
    "Core content works without JavaScript",
  );
  assert.equal(
    await noJs.locator('a[href="tel:+94112337887"]').first().isVisible(),
    true,
  );
  assert.deepEqual(errors, [], "No broken assets or JavaScript errors");
  console.log(
    "Passed: production assets, anchors, desktop/mobile accessibility, five responsive widths, mobile navigation, fleet selection, enquiry helper, validation and no-JavaScript content. Screenshots: work/desktop.png and work/mobile.png.",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
