import { test, expect, type Page } from "@playwright/test";
import { fakeFreighterScript } from "./fakeFreighter";

declare global {
  interface Window {
    __freighterCalls: string[];
  }
}

async function openWalletModal(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/connect-wallet");
  await page.waitForLoadState("networkidle");
  // Let the card's fade-up animation (0.7s + 140ms delay) finish so we
  // measure the steady state, which is what a user clicking normally sees.
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Connect Wallet" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  return errors;
}

/**
 * Click a wallet option only if a person could: Playwright will happily hit
 * a 16px-wide button, which is how the collapsed-modal bug once passed an
 * end-to-end run. Guard the width before clicking.
 */
async function clickWalletOption(page: Page, name: RegExp) {
  const option = page.getByRole("button", { name });
  await expect(option).toBeVisible();
  await expect(option).toBeEnabled();
  const box = await option.boundingBox();
  expect(box!.width, `${name} option must be usably wide`).toBeGreaterThan(300);
  await option.click();
}

test.describe("wallet modal on /connect-wallet (production build)", () => {
  test("opens at a usable size with the overlay covering the viewport", async ({ page }) => {
    const errors = await openWalletModal(page);

    const dialog = page.getByRole("dialog");
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    // Regression: max-w-md resolved to --spacing-md (16px) and the panel
    // rendered as a 16px-wide, 1076px-tall strip.
    expect(box!.width).toBeGreaterThanOrEqual(400);
    expect(box!.width).toBeLessThanOrEqual(480);
    expect(box!.height).toBeGreaterThanOrEqual(400);
    expect(box!.height).toBeLessThanOrEqual(900);

    const computed = await dialog.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { maxWidth: cs.maxWidth, transform: cs.transform, clipPath: cs.clipPath, opacity: cs.opacity };
    });
    expect(computed).toEqual({ maxWidth: "448px", transform: "none", clipPath: "none", opacity: "1" });

    // Regression: the card's fade-up animation left a transform behind, so
    // the fixed overlay was confined to the card instead of the viewport.
    const viewport = page.viewportSize()!;
    const overlay = await dialog.evaluate((el) => el.parentElement!.getBoundingClientRect().toJSON());
    expect(overlay).toMatchObject({ x: 0, y: 0, width: viewport.width, height: viewport.height });

    for (const name of ["Freighter", "Albedo", "WalletConnect"]) {
      const option = page.getByRole("button", { name: new RegExp(name) });
      await expect(option).toBeVisible();
      const optionBox = await option.boundingBox();
      expect(optionBox!.width).toBeGreaterThan(300);
      expect(optionBox!.height).toBeGreaterThan(40);
    }
    expect(errors).toEqual([]);
  });

  test("Freighter approve → onboarding → dashboard, and the session survives reloads", async ({ page }) => {
    await page.addInitScript(fakeFreighterScript("approve"));
    const errors = await openWalletModal(page);

    await clickWalletOption(page, /Freighter/);

    await page.waitForURL(/\/onboarding$/);
    expect(await page.evaluate(() => window.__freighterCalls)).toEqual([
      "REQUEST_ACCESS",
      "REQUEST_NETWORK_DETAILS",
    ]);

    const next = page.getByRole("button", { name: /Continue/ });
    await next.click();
    await page.getByPlaceholder(/legal name/i).fill("Test User");
    await page.getByPlaceholder(/name@company/i).fill("test@example.com");
    await page.locator("select").first().selectOption({ index: 1 });
    await next.click();
    await page.locator('input[type="radio"]').first().check({ force: true });
    await page.getByPlaceholder(/freelance business/i).fill("Test Workspace");
    await next.click();
    await page.getByRole("button", { name: /Go to Dashboard/i }).click();

    await page.waitForURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { name: "Financial Overview" })).toBeVisible();

    for (let i = 0; i < 2; i++) {
      await page.reload();
      await expect(page).toHaveURL(/\/dashboard$/);
      await expect(page.getByRole("heading", { name: "Financial Overview" })).toBeVisible();
    }
    expect(errors).toEqual([]);
  });

  test("Freighter decline stays on /connect-wallet and shows the error", async ({ page }) => {
    await page.addInitScript(fakeFreighterScript("reject"));
    const errors = await openWalletModal(page);

    await clickWalletOption(page, /Freighter/);

    await expect(page.getByRole("dialog")).toContainText("Connection request was rejected");
    await expect(page).toHaveURL(/\/connect-wallet$/);
    expect(await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("stellflow_")))).toEqual([]);
    expect(errors).toEqual([]);
  });
});
