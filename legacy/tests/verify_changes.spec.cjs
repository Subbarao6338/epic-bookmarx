const { test, expect } = require('@playwright/test');

test('Verify Toolbox Pruning and URL to PDF', async ({ page }) => {
  await page.goto('http://localhost:5173/?tab=toolbox');

  // Check that only approved hubs are present
  // approved: Web & Social Tools, Network Hub, Markdown Tools, Data Science
  await expect(page.locator('#card-web-main')).toBeVisible();
  await expect(page.locator('#card-network-main')).toBeVisible();
  await expect(page.locator('#card-doc-main')).toBeVisible();
  await expect(page.locator('#card-data-main')).toBeVisible();

  // Check that some pruned hubs are gone
  await expect(page.locator('#card-pdf-main')).not.toBeVisible();
  await expect(page.locator('#card-img-main')).not.toBeVisible();
  await expect(page.locator('#card-audio-main')).not.toBeVisible();

  // Test URL to PDF in Web Hub
  await page.locator('#card-web-main').click();
  const urlToPdfPill = page.locator('button.pill:has-text("URL to PDF")');
  await expect(urlToPdfPill).toBeVisible();
  await urlToPdfPill.click();

  await expect(page.locator('input[placeholder="Enter Web URL..."]')).toBeVisible();
  await expect(page.locator('button:has-text("Convert URL to PDF")')).toBeVisible();

  // Check header title logic
  await expect(page.locator('h1.page-title')).toHaveText('Epic Toolbox');

  await page.goto('http://localhost:5173/?tab=bookmarks');
  await expect(page.locator('h1.page-title')).toHaveText('Epic Toolbox');
});
