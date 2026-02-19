import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Word Tool Evan Extension', () => {
  test('should load without console errors', async ({ browser }) => {
    const extensionPath = path.resolve(__dirname, '../../dist');
    
    // Get extension ID using Chrome management API
    const { stdout } = await execPromise(
      `find "${extensionPath}" -name "manifest.json" -exec cat {} \\;`,
      { encoding: 'utf8' }
    );
    
    console.log('Extension path:', extensionPath);
    
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
    
    // Load a test page first
    await page.goto('data:text/html,<html><body><h1>Test</h1></body></html>');
    await page.waitForTimeout(2000);
    
    console.log('Console logs:', logs.join('\n'));
    
    // Filter critical errors
    const errors = logs.filter(l => 
      l.includes('[error]') && 
      !l.includes('favicon') &&
      !l.includes('DevTools')
    );
    
    console.log('Errors:', errors);
    
    await context.close();
    
    expect(errors).toHaveLength(0);
  });
});
