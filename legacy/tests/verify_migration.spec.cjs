const { test, expect } = require('@playwright/test');

test('Verify Tool Hub Pruning', async ({ page }) => {
  await page.goto('http://localhost:5173/?tab=toolbox');

  // Allowed Hub IDs
  const allowedHubs = [
    'web-main',
    'network-main',
    'ai-main',
    'dev-main',
    'doc-main',
    'data-main',
    'time-main'
  ];

  // Removed Hub IDs (samples)
  const removedHubs = [
    'pdf-main',
    'image-main',
    'color-main',
    'audio-main',
    'finance-main',
    'unit-main',
    'health-main',
    'edu-main',
    'device-main',
    'privacy-main',
    'game-main'
  ];

  // Check allowed hubs are visible
  for (const id of allowedHubs) {
    await expect(page.locator(`#card-${id}`)).toBeVisible();
  }

  // Check removed hubs are not present
  for (const id of removedHubs) {
    await expect(page.locator(`#card-${id}`)).not.toBeVisible();
  }

  // Verify Network Hub sub-tools (Stability Check)
  await page.locator('#card-network-main').click();
  await page.waitForSelector('.pill');
  await expect(page.locator('button.pill:has-text("IP Info")')).toBeVisible();
  await expect(page.locator('button.pill:has-text("Ping")')).toBeVisible();

  // Go back to Toolbox
  await page.locator('div.breadcrumb-item').filter({ hasText: 'Toolbox' }).first().click();

  // Verify AI Hub sub-tools (Stability Check)
  await page.locator('#card-ai-main').click();
  await page.waitForSelector('.pill');
  await expect(page.locator('button.pill:has-text("Image Gen")')).toBeVisible();
  await expect(page.locator('button.pill:has-text("Chat")')).toBeVisible();
});
