const { test, expect } = require('@playwright/test');

test('verify enable profiles is in bookmarks settings', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Open Settings Modal
  await page.click('.top-bar button .material-icons:text("settings")');

  // Find Bookmarks section specifically
  const bookmarksSection = page.locator('.settings-collapsible').filter({ has: page.locator('.header-left span:text("Bookmarks")') });
  await bookmarksSection.locator('.collapsible-header').click();

  // Check if Bookmarks section contains Enable Profiles
  await expect(bookmarksSection.locator('text=Enable Profiles')).toBeVisible();

  // Find General section specifically and check it does NOT have Enable Profiles
  const generalSection = page.locator('.settings-collapsible').filter({ has: page.locator('.header-left span:text("General")') });
  await expect(generalSection.locator('text=Enable Profiles')).not.toBeVisible();
});

test('verify urls in bookmark actions modal wrap', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Go to Bookmarks tab
  await page.click('.tab-item:has-text("Bookmarks")');

  // Wait for content to load
  await page.waitForTimeout(1000);

  // Take first card and long press
  const cards = page.locator('.card');
  const count = await cards.count();
  if (count === 0) {
      console.log("No bookmark cards found to test long-press.");
      return;
  }

  const firstCard = cards.first();
  await firstCard.dispatchEvent('mousedown', { clientX: 100, clientY: 100 });
  await page.waitForTimeout(600);
  await firstCard.dispatchEvent('mouseup', { clientX: 100, clientY: 100 });

  // Verify modal is open
  const modal = page.locator('.modal-multi-url');
  await expect(modal).toBeVisible();

  // Verify url-btn-content has expected styles for wrapping
  const urlContent = modal.locator('.url-btn-content').first();
  const styles = await urlContent.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      whiteSpace: s.whiteSpace,
      wordBreak: s.wordBreak
    };
  });

  expect(styles.whiteSpace).toBe('normal');
  expect(styles.wordBreak).toBe('break-all');
});
