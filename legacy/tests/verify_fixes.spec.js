import { test, expect } from '@playwright/test';

test('Verify UI fixes', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForSelector('.logo-container');

  // 1. Main View
  await page.screenshot({ path: 'test-results/01-main-view.png' });

  // 2. Settings Modal (X button and Improved UI)
  await page.click('button[title="Settings"]');
  await page.waitForSelector('.modal');
  await page.screenshot({ path: 'test-results/02-settings-modal.png' });

  // 3. Compact View
  // Try to toggle it using evaluate to avoid viewport issues
  await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.settings-row'));
    const compactRow = rows.find(r => r.innerText.includes('Compact View'));
    if (compactRow) {
      const checkbox = compactRow.querySelector('input[type="checkbox"]');
      if (checkbox) checkbox.click();
    }
  });

  // Close modal via the fixed X button
  await page.click('.modal-header-flex .icon-btn');
  await page.waitForSelector('.modal', { state: 'hidden' });

  // Take screenshot of compact view
  await page.screenshot({ path: 'test-results/03-compact-view.png' });

  // 4. Back to Top button
  await page.evaluate(() => {
    const container = document.querySelector('.tools-container');
    if (container) {
      const dummy = document.createElement('div');
      dummy.id = 'dummy-scroller';
      dummy.style.height = '3000px';
      container.appendChild(dummy);
      container.scrollTop = 1500;
    }
  });

  await page.waitForTimeout(1000);
  await page.waitForSelector('#back-to-top.visible');
  await page.screenshot({ path: 'test-results/04-back-to-top.png' });
});
