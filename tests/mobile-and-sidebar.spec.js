import { test, expect } from '@playwright/test';

test.describe('Mobile Layout & Extension Sources Overflow', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE viewport

  test('should fit toolbox cards within mobile viewport without horizontal scroll overflow', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page.locator('h2', { hasText: 'Toolbox' })).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('should render Extension Sources without horizontal overflow on mobile', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Navigate to Extension Sources
    const card = page.locator('.card', { hasText: 'Extension Sources' }).first();
    await card.click();

    await expect(page.locator('h3', { hasText: 'Extension Sources Hub' })).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});

test.describe('Desktop Sidebar Collapse & Expand', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('should toggle sidebar collapse state', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const sidebar = page.locator('.app-sidebar');
    await expect(sidebar).toBeVisible();
    await expect(sidebar).not.toHaveClass(/collapsed/);

    const toggleBtn = page.locator('.sidebar-collapse-toggle');
    await expect(toggleBtn).toBeVisible();

    // Click to collapse
    await toggleBtn.click();
    await expect(sidebar).toHaveClass(/collapsed/);

    // Verify title/labels are hidden in collapsed mode
    await expect(page.locator('.sidebar-title')).not.toBeVisible();

    // Click to expand again
    await toggleBtn.click();
    await expect(sidebar).not.toHaveClass(/collapsed/);
    await expect(page.locator('.sidebar-title')).toBeVisible();
  });
});
