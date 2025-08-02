// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('ShadowRoot Injector Tests', () => {
	test('blockquote example renders and behaves as expected', async ({ page }) => {
		// Construct the absolute file path and use the file:// protocol
		const filePath = path.resolve(__dirname, '../example/blockquote.html');
		await page.goto(`file://${filePath}`);

		// verify first blockquote exists and has shadow root elements
		const blockquote = page.locator('blockquote').first();
		await expect(blockquote).toBeVisible();
		await expect(blockquote).toHaveText(/Citation:/);
	});
});
