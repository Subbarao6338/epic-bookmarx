const { test, expect } = require('@playwright/test');

test('Capture Screenshots - Desktop & Mobile', async ({ page }) => {
  // Desktop
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173/?tab=toolbox');
  await page.waitForSelector('#search');
  await page.fill('#search', 'json');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/desktop-search.png' });

  // Mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:5173/?tab=toolbox');
  // In mobile, search might be hidden behind a toggle in TabBar
  const searchTab = page.locator('#tab-search');
  if (await searchTab.isVisible()) {
    await searchTab.click();
  }
  await page.waitForSelector('#search');
  await page.fill('#search', 'pdf');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/mobile-search.png' });
});
