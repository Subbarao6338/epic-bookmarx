const { test, expect } = require('@playwright/test');

test('Verify Settings Organization and Card Layouts', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Open Settings
  await page.click('.tab-item:has-text("Settings")');

  // Verify Type-wise sections exist in Settings
  await expect(page.locator('.collapsible-header:has-text("Toolbox")')).toBeVisible();
  await expect(page.locator('.collapsible-header:has-text("Bookmarks")')).toBeVisible();
  await expect(page.locator('.collapsible-header:has-text("Projects")')).toBeVisible();

  // Close Settings
  await page.click('.icon-btn:has-text("close")');

  // Verify Toolbox Card Layout
  await page.click('.tab-item:has-text("Toolbox")');
  const toolboxCard = page.locator('#card-web-main');
  await expect(toolboxCard.locator('.card-body')).toBeVisible();
  await expect(toolboxCard.locator('.card-footer')).toBeVisible();
  await expect(toolboxCard.locator('.card-footer .material-icons:has-text("apps")')).toBeVisible();
  await expect(toolboxCard.locator('.card-footer .pin-btn')).toBeVisible();

  // Verify Bookmarks Card Layout
  await page.click('.tab-item:has-text("Bookmarks")');
  const bookmarkCard = page.locator('.card').first();
  await expect(bookmarkCard.locator('.card-header')).toBeVisible();
  await expect(bookmarkCard.locator('.card-body')).toBeVisible();
  await expect(bookmarkCard.locator('.card-footer')).toBeVisible();
  await expect(bookmarkCard.locator('.card-header .card-url')).toBeVisible();
  await expect(bookmarkCard.locator('.card-footer .material-icons:has-text("layers")')).toBeVisible();
});
