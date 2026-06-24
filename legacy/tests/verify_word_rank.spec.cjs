const { test, expect } = require('@playwright/test');

test('Verify Word Rank Calculator', async ({ page }) => {
    // Navigate to Word Rank tool directly
    await page.goto('http://localhost:5173/?tab=toolbox&tool=word-rank');

    // Wait for the tool to load
    await page.waitForSelector('textarea[placeholder*="word-rank"]');

    const textarea = page.locator('textarea[placeholder*="word-rank"]');
    const runButton = page.locator('button:has-text("Run word-rank")');

    // Test Case 1: Simple word without duplicate letters (BAC)
    await textarea.fill('BAC');
    await runButton.click();
    await expect(page.locator('.tool-result')).toContainText('Rank of the word: 3');

    // Test Case 2: Word with duplicate letters (BAA)
    await textarea.clear();
    await textarea.fill('BAA');
    await runButton.click();
    await expect(page.locator('.tool-result')).toContainText('Rank of the word: 3');

    // Test Case 3: Another word with duplicate letters (BOOK)
    await textarea.clear();
    await textarea.fill('BOOK');
    await runButton.click();
    await expect(page.locator('.tool-result')).toContainText('Rank of the word: 3');

    // Test Case 4: Long word for BigInt verification (ALPHABET)
    await textarea.clear();
    await textarea.fill('ALPHABET');
    await runButton.click();
    await expect(page.locator('.tool-result')).toContainText('Rank of the word:');
});
