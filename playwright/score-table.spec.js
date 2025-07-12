// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('ShadowRoot Injector Tests', () => {
	test('score-table example renders and behaves as expected', async ({ page }) => {
		// Construct the absolute file path and use the file:// protocol
		const filePath = path.resolve(__dirname, '../example/score-table.html');
		await page.goto(`file://${filePath}`);

		// verify existing score column exists and has a shadow root
		const fistScoreColumn = page.locator('score-column');
		await expect(fistScoreColumn).toBeVisible();
		await expect(fistScoreColumn.getByLabel(/Name/)).toBeVisible();
		await expect(fistScoreColumn.getByLabel(/Scores/)).toBeVisible();

		// verify that created score columns also have shadow roots
		const createColumnButton = page.locator('button');
		await createColumnButton.click();
		await expect(page.locator('score-column')).toHaveCount(2);
		const secondScoreColumn = page.locator('score-column').nth(1);
		await expect(secondScoreColumn).toBeVisible();
		await expect(secondScoreColumn.getByLabel(/Name/)).toBeVisible();
		await expect(secondScoreColumn.getByLabel(/Scores/)).toBeVisible();
	});
});
