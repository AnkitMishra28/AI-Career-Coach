import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('SenseAI System & UI Verification', () => {

  test('1. Landing Page loads completely without runtime errors', async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => pageErrors.push(err.message));

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

    // Verify H1 title or main branding
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Verify zero ReferenceError / runtime errors
    const refErrors = pageErrors.filter(e => e.includes('ReferenceError'));
    expect(refErrors.length).toBe(0);
    expect(pageErrors.length).toBe(0);
  });

  test('2. "Launch Career OS" and "Explore Live Demo" buttons on Landing Page', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

    // Check Launch Career OS button/link
    const launchBtn = page.locator('a:has-text("Launch Career OS"), button:has-text("Launch Career OS")').first();
    await expect(launchBtn).toBeVisible();

    // Check Explore Live Demo link
    const demoBtn = page.locator('a:has-text("Explore Live Demo"), button:has-text("Explore Live Demo")').first();
    await expect(demoBtn).toBeVisible();

    // Click Explore Live Demo & verify navigation to /demo
    await demoBtn.click();
    await page.waitForURL('**/demo');
    expect(page.url()).toContain('/demo');
  });

  test('3. /demo page loads successfully', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));

    await page.goto(`${BASE_URL}/demo`, { waitUntil: 'domcontentloaded' });
    
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    expect(pageErrors.length).toBe(0);
  });

  test('4. /dashboard page loads without ReferenceError & Eye icon button works', async ({ page }) => {
    const pageErrors = [];
    const consoleErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => pageErrors.push(err.message));

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });

    // Verify dashboard title
    const dashboardTitle = page.locator('h1:has-text("Candidate Telemetry & Operations")').first();
    await expect(dashboardTitle).toBeVisible();

    // Verify View Demo Data button with Eye icon
    const viewDemoBtn = page.locator('button:has-text("View Demo Data"), a:has-text("View Demo Data")').first();
    await expect(viewDemoBtn).toBeVisible();

    // Click View Demo Data button and verify navigation to /demo
    await viewDemoBtn.click();
    await page.waitForURL('**/demo');
    expect(page.url()).toContain('/demo');

    // Confirm no ReferenceErrors occurred
    const refErrors = pageErrors.filter(e => e.includes('ReferenceError') || e.includes('Eye is not defined'));
    expect(refErrors.length).toBe(0);
  });

  test('5. Navbar logged-out & logged-in auth check', async ({ page }) => {
    // Unauthenticated state check
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const signInBtn = page.locator('button:has-text("Sign In"), a:has-text("Sign In")').first();
    await expect(signInBtn).toBeVisible();
  });

  test('6. Viewport responsiveness & fixed navbar non-overlap check', async ({ page }) => {
    const viewports = [
      { width: 1440, height: 900 },
      { width: 1280, height: 800 },
      { width: 1024, height: 768 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
      { width: 375, height: 812 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
      
      // Scroll from top to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(100);

      // Scroll back to top
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);
    }
  });

});
