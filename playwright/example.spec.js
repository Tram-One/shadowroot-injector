// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('ShadowRoot Injector Tests', () => {
	test('should validate all ShadowRoot Injector APIs and Use Cases', async ({ page }) => {
		// Construct the absolute file path and use the file:// protocol
		const filePath = path.resolve(__dirname, './spec.html');
		await page.goto(`file://${filePath}`);

		// validate that the first highlightable title exists and has the expected text content
		const ht1 = page.locator('#ht1');
		await expect(ht1).toBeVisible();
		const ht1h2 = ht1.locator('h2');
		await expect(ht1h2).toBeVisible();

		expect(ht1).toHaveText('First Title');

		// validate that clicking the element changes the element style
		await ht1.click();
		await expect(ht1).toHaveAttribute('highlighted', '');

		// validate that the second highlightable title exists and has the expected text content
		const ht2 = page.locator('#ht2');
		await expect(ht2).toBeVisible();
		const ht2h2 = ht2.locator('h2');
		await expect(ht2h2).toBeVisible();

		expect(ht2).toHaveText('Second Title');

		// validate that clicking the element changes the element style
		await ht2.click();
		await expect(ht2).toHaveAttribute('highlighted', '');
	});
});
