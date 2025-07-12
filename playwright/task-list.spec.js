// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('ShadowRoot Injector Tests', () => {
	test('task-list example renders and behaves as expected', async ({ page }) => {
		// Construct the absolute file path and use the file:// protocol
		const filePath = path.resolve(__dirname, '../example/task-list.html');
		await page.goto(`file://${filePath}`);

		// verify existing task items exist and have the expected shadow dom
		await expect(page.locator('task-item')).toHaveCount(2);
		const firstTaskItem = page.locator('task-item').nth(0);
		await expect(firstTaskItem).toBeVisible();
		await expect(firstTaskItem.locator('li')).toBeVisible();
		const secondTaskItem = page.locator('task-item').nth(1);
		await expect(secondTaskItem).toBeVisible();
		await expect(secondTaskItem.locator('li')).toBeVisible();

		// verify that they have interactivity from the defined web-component class
		const secondTaskItemRemoveControl = secondTaskItem.locator('button');
		await expect(secondTaskItemRemoveControl).toBeVisible();
		await secondTaskItemRemoveControl.click();
		await expect(page.locator('task-item')).toHaveCount(1);

		// create a new task item
		const newTaskInput = page.locator('input');
		await newTaskInput.fill('Test Task');
		await newTaskInput.press('Enter');
		await expect(page.locator('task-item')).toHaveCount(2);

		// verify new task item has expected shadow root and interactivity
		const testTaskItem = page.locator('task-item').filter({ hasText: 'Test Task' });
		const testTaskItemRemoveControl = testTaskItem.locator('button');
		await expect(testTaskItemRemoveControl).toBeVisible();
		await testTaskItemRemoveControl.click();
		await expect(page.locator('task-item')).toHaveCount(1);
	});
});
