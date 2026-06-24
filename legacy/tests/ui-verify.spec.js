import { test, expect } from '@playwright/test';

test.describe('Epic Toolbox UI Verification', () => {
  test('verify toolbox and bookmarks layout', async ({ page }) => {
    // Go to toolbox
    await page.goto('http://localhost:5173/?tab=toolbox');
    await page.waitForTimeout(2000); // Wait for animations
    await page.screenshot({ path: 'toolbox-desktop.png' });

    // Go to bookmarks
    await page.goto('http://localhost:5173/?tab=bookmarks');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'bookmarks-desktop.png' });

    // Verify mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/?tab=toolbox');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'toolbox-mobile.png' });

    await page.goto('http://localhost:5173/?tab=bookmarks');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'bookmarks-mobile.png' });
  });
});
