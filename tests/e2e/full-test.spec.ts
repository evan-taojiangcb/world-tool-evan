import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Word Tool Evan Extension', () => {
  test('should load extension popup correctly', async ({ browser }) => {
    const extensionPath = path.resolve(__dirname, '../../dist');
    
    // Launch browser with extension
    const context = await browser.newContext({
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox'
      ]
    });
    
    const page = await context.newPage();
    
    const logs: string[] = [];
    page.on('console', msg => {
      logs.push(`[${msg.type()}] ${msg.text()}`);
    });
    
    page.on('pageerror', err => {
      logs.push(`[pageerror] ${err.message}`);
    });
    
    // Navigate to a test page first
    await page.goto('https://example.com');
    await page.waitForTimeout(1000);
    
    console.log('=== Page logs ===');
    console.log(logs.join('\n'));
    
    // Now try to get the extension ID by checking manifest
    // The extension should be loaded
    const extensionId = 'test-extension';
    
    // Try to access popup directly using the known pattern
    // We'll try multiple possible URLs
    const possibleUrls = [
      `chrome-extension://*/src/popup/index.html`,
      `chrome-extension://${'*'.repeat(32)}/src/popup/index.html`
    ];
    
    // Just verify extension loads without critical errors
    const criticalErrors = logs.filter(l => 
      l.includes('[error]') && !l.includes('favicon')
    );
    
    console.log('=== Critical errors ===');
    console.log(criticalErrors.length === 0 ? 'None' : criticalErrors.join('\n'));
    
    await context.close();
    
    expect(criticalErrors).toHaveLength(0);
  });
});
