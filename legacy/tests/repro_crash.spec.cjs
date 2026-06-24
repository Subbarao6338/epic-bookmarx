const { test, expect } = require('@playwright/test');

test('Dev Hub should not crash when opened', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:5173/?tab=toolbox');

  await page.waitForSelector('.card-title');

  const devHubCard = page.locator('.card', { hasText: 'Dev Hub' });
  await devHubCard.click();

  await page.waitForTimeout(2000);

  const errorMsg = page.locator('text=Epic Toolbox Error');
  if (await errorMsg.isVisible()) {
      console.log('CRASH DETECTED');
      const errorText = await page.locator('pre').textContent();
      console.log('ERROR TEXT:', errorText);
  } else {
      console.log('NO CRASH DETECTED INITIALLY');
  }

  const tabs = ['Base64', 'JSON Formatter', 'Diff Viewer', 'JWT Decoder', 'Cron Helper', 'SQL Formatter', 'Regex Tester', 'Security Hub', 'URL Tool', 'YAML Conv', 'Minifier', 'XML ↔ JSON', 'XML Formatter', 'JSON to TS'];
  for (const tab of tabs) {
    console.log(`Testing tab: ${tab}`);
    const tabBtn = page.locator('.pill', { hasText: tab }).first();
    if (await tabBtn.isVisible()) {
        await tabBtn.click();
        await page.waitForTimeout(500);
        if (await errorMsg.isVisible()) {
            console.log(`CRASH DETECTED ON TAB: ${tab}`);
            const errorText = await page.locator('pre').textContent();
            console.log('ERROR TEXT:', errorText);
            break;
        }
    } else {
        console.log(`Tab ${tab} not visible`);
    }
  }
});
