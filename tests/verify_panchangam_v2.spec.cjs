const { test, expect } = require('@playwright/test');

test('verify Telugu Panchangam tool v2', async ({ page }) => {
  await page.goto('http://localhost:3001');

  // Wait for the app to load
  await page.waitForSelector('.tools-container');

  // Click on Date & Time hub
  await page.click('text=Date & Time');

  // Click on Telugu Panchangam tab
  await page.click('button:has-text("Telugu Panchangam")');

  // Verify inputs are present
  await expect(page.locator('input[type="date"]')).toBeVisible();
  await expect(page.locator('input[type="time"]')).toBeVisible();
  await expect(page.locator('select')).toBeVisible();

  // Select custom location to see lat/lng inputs
  await page.selectOption('select', 'Custom');
  await expect(page.locator('input[type="number"]').first()).toBeVisible();

  // Click Calculate Panchangam
  await page.click('button:has-text("Calculate Panchangam")');

  // Verify results are displayed
  await expect(page.locator('text=Samvatsara')).toBeVisible();
  await expect(page.locator('text=Tithi')).toBeVisible();
  await expect(page.locator('text=Nakshatra')).toBeVisible();
  await expect(page.locator('text=Padam')).toBeVisible();
  await expect(page.locator('text=Lucky Color')).toBeVisible();

  // Take screenshot
  await page.screenshot({ path: 'test-results/panchangam_v2_verification.png' });
});
