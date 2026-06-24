const { test, expect } = require('@playwright/test');

test('Verify Bookmark Card Changes', async ({ page }) => {
  await page.goto('http://localhost:5173/?tab=bookmarks');

  // Wait for data to load
  await page.waitForSelector('.card');

  // Find exactly the YouTube card
  const multiUrlCard = page.locator('.card:has-text("YouTube")').first();
  await expect(multiUrlCard).toBeVisible();

  // Verify pin button in footer
  const pinBtn = multiUrlCard.locator('.card-footer .pin-btn');
  await expect(pinBtn).toBeVisible();

  // Perform long press (simulated)
  // Playwright's click with delay can simulate long press
  await multiUrlCard.click({ delay: 600 });

  // Verify modal is open
  const modal = page.locator('.modal.modal-multi-url');
  await expect(modal).toBeVisible();

  // Verify modal is displayed
  const style = await modal.getAttribute('style');
  expect(style).toContain('display: block');
});
