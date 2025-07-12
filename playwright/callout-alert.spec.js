// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('ShadowRoot Injector Tests', () => {
	test('callout-alert example renders and behaves as expected', async ({ page }) => {
		// Construct the absolute file path and use the file:// protocol
		const filePath = path.resolve(__dirname, '../example/callout-alert.html');
		await page.goto(`file://${filePath}`);

		// verify first callout alert exists and has shadow root elements
		const fistCalloutAlert = page.locator('callout-alert').first();
		await expect(fistCalloutAlert).toBeVisible();
		await expect(fistCalloutAlert.locator('summary')).toBeVisible();
	});
});
