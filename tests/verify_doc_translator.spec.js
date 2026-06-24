import { test, expect } from '@playwright/test';

test('Doc Translator UI is visible', async ({ page }) => {
  // Use a longer timeout and go to the specific sub-tool
  await page.goto('http://localhost:3001/?tab=toolbox&tool=doc-translator', { waitUntil: 'networkidle' });

  // The hub uses lazy loading, so wait for the component
  await page.waitForSelector('.tool-form', { timeout: 15000 });

  // Check for file input and language select
  await expect(page.locator('input[type="file"]')).toBeVisible();
  await expect(page.locator('select')).toBeVisible();
  await expect(page.locator('button.btn-primary', { hasText: 'Translate Document' })).toBeVisible();
});
