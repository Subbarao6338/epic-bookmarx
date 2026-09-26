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
    await page.locator('button.pill', { hasText: 'Streaming' }).first().click();
    await expect(page.locator('text=Cloudstream Official Repository')).toBeVisible();
    await expect(page.locator('text=CyberFlix Catalog Stremio Addon')).toBeVisible();
    await expect(page.locator('text=Aniyomi Anime Extensions Repo')).not.toBeVisible();

    // Filter by Anime section
    await page.locator('button.pill', { hasText: 'Anime' }).first().click();
    await expect(page.locator('text=Aniyomi Anime Extensions Repo')).toBeVisible();
    await expect(page.locator('text=Keiyoushi Aniyomi Anime Index')).toBeVisible();

    // Filter by Manga section
    await page.locator('button.pill', { hasText: 'Manga' }).first().click();
    await expect(page.locator('text=Mangayomi Manga Sources')).toBeVisible();
    await expect(page.locator('text=Keiyoushi Extensions (Mihon / Tachiyomi)')).toBeVisible();

    // Filter by Light Novels section
    await page.locator('button.pill', { hasText: 'Light Novels' }).first().click();
    await expect(page.locator('text=Shosetsu Light Novel Extensions')).toBeVisible();
    await expect(page.locator('text=LNReader Novel Sources Repository')).toBeVisible();
    await expect(page.locator('text=QuickNovel Plugin Extensions')).toBeVisible();

    // Verify visible URL displays
    await expect(page.locator('text=Web Repository URL').first()).toBeVisible();
    await expect(page.locator('text=Raw Manifest / Source JSON').first()).toBeVisible();

    // Test Copy Source URL
    const copySourceBtn = page.locator('button', { hasText: 'Copy Source URL' }).first();
    await copySourceBtn.click();
    await expect(page.locator('text=Source Raw URL copied to clipboard!')).toBeVisible();
  });

  test('should support filtering by app platform and searching by query', async ({ page }) => {
    await page.goto('/?tab=toolbox&tool=extension-sources');

    // Filter by platform Stremio
    await page.locator('button.pill', { hasText: 'Stremio' }).first().click();
    await expect(page.locator('text=Torrentio Stremio Addon')).toBeVisible();
    await expect(page.locator('text=Cloudstream Official Repository')).not.toBeVisible();

    // Reset platform filter by clicking Clear All
    await page.locator('button', { hasText: 'Clear All' }).click();

    // Search query
    const searchInput = page.locator('input[placeholder*="Search sources"]');
    await searchInput.fill('Keiyoushi');
    await expect(page.locator('text=Keiyoushi Extensions (Mihon / Tachiyomi)')).toBeVisible();

    // Clear search filter
    await page.locator('button', { hasText: 'Clear All' }).click();
    await expect(page.locator('text=Cloudstream Official Repository')).toBeVisible();
  });
});
