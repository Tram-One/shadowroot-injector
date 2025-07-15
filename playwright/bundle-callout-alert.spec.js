// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('ShadowRoot Injector Tests', () => {
	test('callout-alert example renders and behaves as expected', async ({ page }) => {
		await page.goto(`http://127.0.0.1:3000`);

		// verify first callout alert exists and has shadow root elements
		const fistCalloutAlert = page.locator('callout-alert').first();
		await expect(fistCalloutAlert).toBeVisible();
		await expect(fistCalloutAlert.locator('summary')).toBeVisible();
	});
});
