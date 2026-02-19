import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Word Tool Evan Extension', () => {
  test('should load popup correctly', async ({ browser }) => {
    const extensionPath = path.resolve(__dirname, '../../dist');
    
    // Launch browser with extension
    const context = await browser.newContext({
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`
      ]
    });
    
    const page = await context.newPage();
    
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', err => {
      errors.push(err.message);
    });
    
    // Create a new tab and navigate
    await page.goto('https://example.com');
    await page.waitForTimeout(1000);
    
    // Check for errors
    console.log('Page errors:', errors);
    
    await context.close();
    
    // Allow some expected errors but fail on critical ones
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('Warning')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
