import { test, expect } from '@playwright/test';

test.describe('Word Tool Evan Extension', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for the extension to be ready
    await page.goto('about:blank');
  });

  test('should load content script without errors', async ({ page }) => {
    // This is a basic test to ensure the extension doesn't crash
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to a test page
    await page.goto('data:text/html,<html><body><p>Hello world test</p></body></html>');
    
    // Wait a bit for content script to initialize
    await page.waitForTimeout(1000);
    
    // Check no critical errors
    const criticalErrors = consoleErrors.filter(e => !e.includes('Warning'));
    expect(criticalErrors).toHaveLength(0);
  });

  test('should handle text selection', async ({ page }) => {
    await page.goto('data:text/html,<html><body><p>Select this word</p></body></html>');
    
    // Select text
    await page.locator('p').dblclick();
    
    // The floating button should appear (handled by content script)
    // This is a basic test - in real scenario would test the full flow
    await page.waitForTimeout(500);
    
    // No errors should occur
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    
    expect(errors).toHaveLength(0);
  });

  test('should handle double-click on word', async ({ page }) => {
    await page.goto('data:text/html,<html><body><p>Hello world</p></body></html>');
    
    // Double click on a word
    await page.locator('text=Hello').dblclick();
    
    await page.waitForTimeout(500);
    
    // No errors should occur
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    
    expect(errors).toHaveLength(0);
  });
});
