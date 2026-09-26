import { test, expect } from '@playwright/test';

test.describe('Extension Sources Tool', () => {
  test('should navigate to Extension Sources and verify Streaming, Anime, Manga, Light Novels, and JS sections', async ({ page }) => {
    await page.goto('/?tab=toolbox&tool=extension-sources');

    // Header check
    await expect(page.locator('h3', { hasText: 'Extension Sources Hub' })).toBeVisible();

    // Verify sections headers in 'All' view
    await expect(page.locator('h3', { hasText: 'Streaming' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Anime' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Manga' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Light Novels' })).toBeVisible();

    // Filter by Streaming section
    await page.locator('button.pill', { hasText: 'Streaming' }).click();
    await expect(page.locator('text=Cloudstream Official Repository')).toBeVisible();
    await expect(page.locator('text=Aniyomi Anime Extensions Repo')).not.toBeVisible();

    // Filter by Anime section
    await page.locator('button.pill', { hasText: 'Anime' }).click();
    await expect(page.locator('text=Aniyomi Anime Extensions Repo')).toBeVisible();

    // Filter by Manga section
    await page.locator('button.pill', { hasText: 'Manga' }).click();
    await expect(page.locator('text=Mangayomi Manga Sources')).toBeVisible();

    // Filter by Light Novels section
    await page.locator('button.pill', { hasText: 'Light Novels' }).click();
    await expect(page.locator('text=Shosetsu Light Novel Extensions')).toBeVisible();
    await expect(page.locator('text=LNReader Novel Sources Repository')).toBeVisible();

    // Test Copy Source URL
    const copySourceBtn = page.locator('button', { hasText: 'Copy Source URL' }).first();
    await copySourceBtn.click();
    await expect(page.locator('text=Source Raw URL copied to clipboard!')).toBeVisible();
  });
});
