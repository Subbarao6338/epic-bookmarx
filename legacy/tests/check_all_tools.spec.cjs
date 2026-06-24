const { test, expect } = require('@playwright/test');

test.setTimeout(120000); // Increase timeout to 2 minutes

test('Check all tools in toolbox for crashes', async ({ page }) => {
  page.on('console', msg => {
      if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });
  page.on('pageerror', err => console.log('UNCAUGHT EXCEPTION:', err.message));

  await page.goto('http://localhost:5173/?tab=toolbox');
  await page.waitForSelector('.card-title');

  const hubCards = await page.locator('.card').all();
  const hubTitles = [];
  for (const card of hubCards) {
      const title = await card.locator('.card-title').textContent();
      hubTitles.push(title.trim());
  }

  console.log(`Found ${hubTitles.length} hubs: ${hubTitles.join(', ')}`);

  for (const title of hubTitles) {
      console.log(`\n--- Testing Hub: ${title} ---`);
      await page.goto('http://localhost:5173/?tab=toolbox');
      await page.locator('.card', { hasText: title }).first().click();
      await page.waitForTimeout(1000);

      // Check for ErrorBoundary
      const errorMsg = page.locator('text=Epic Toolbox Error');
      if (await errorMsg.isVisible()) {
          console.log(`CRASH DETECTED on Hub: ${title}`);
          continue;
      }

      // Test each sub-tab in the hub
      const subTabs = await page.locator('.tool-form > .pill-group > .pill').all();
      console.log(`Found ${subTabs.length} main sub-tabs in ${title}`);

      for (let i = 0; i < subTabs.length; i++) {
          const tab = subTabs[i];
          const tabName = await tab.textContent();
          console.log(`  Testing Sub-tab: ${tabName.trim()}`);

          try {
              await tab.click();
              await page.waitForTimeout(500);
              if (await errorMsg.isVisible()) {
                  console.log(`  !!! CRASH DETECTED on Sub-tab: ${tabName.trim()}`);
                  const errorText = await page.locator('pre').textContent();
                  console.log('  ERROR TEXT:', errorText);
                  // Reload hub to continue
                  await page.goto('http://localhost:5173/?tab=toolbox');
                  await page.locator('.card', { hasText: title }).first().click();
                  await page.waitForTimeout(1000);
              }
          } catch (e) {
              console.log(`  Could not click tab ${tabName.trim()}: ${e.message}`);
          }
      }
  }
});
