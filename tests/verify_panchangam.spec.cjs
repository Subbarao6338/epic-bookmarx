const { test, expect } = require('@playwright/test');

test('verify Telugu Panchangam tool', async ({ page }) => {
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

  // Select Custom Location to see Lat/Lng inputs
  await page.selectOption('select', 'Custom');
  await expect(page.locator('input[placeholder="17.38"]')).toBeVisible();
  await expect(page.locator('input[placeholder="78.48"]')).toBeVisible();

  // Click Calculate Panchangam
  await page.click('button:has-text("Calculate Panchangam")');

  // Verify results are displayed
  await expect(page.locator('text=Samvatsara')).toBeVisible();
  await expect(page.locator('text=Tithi')).toBeVisible();
  await expect(page.locator('text=Nakshatra')).toBeVisible();
  await expect(page.locator('text=Rahu Kalam')).toBeVisible();

  // Take screenshot
  await page.screenshot({ path: 'test-results/panchangam_verification.png' });
});
