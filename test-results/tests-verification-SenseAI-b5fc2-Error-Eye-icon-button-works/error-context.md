# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\verification.spec.js >> SenseAI System & UI Verification >> 4. /dashboard page loads without ReferenceError & Eye icon button works
- Location: tests\verification.spec.js:56:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1:has-text("Candidate Telemetry & Operations")').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1:has-text("Candidate Telemetry & Operations")').first()

```

```yaml
- banner:
  - link "SenseAI Logo SenseAI":
    - /url: /
    - img "SenseAI Logo"
    - text: SenseAI
  - button "Sign In"
- main:
  - link "Back to SenseAI Home":
    - /url: /
    - img
    - text: Back to SenseAI Home
  - img "SenseAI Logo"
  - text: SenseAI Career OS
  - img
  - paragraph: "Career Health: 84/100"
  - paragraph: Top 12% of candidates
  - paragraph: "\"Landed 3 offers in 14 days using SenseAI's mock interviews.\""
  - paragraph: — SDE Candidate, Verified
  - heading "Sign in to My Application" [level=1]
  - paragraph: Welcome back! Please sign in to continue
  - button "Sign in with Google Continue with Google":
    - img "Sign in with Google"
    - text: Continue with Google
  - paragraph: or
  - text: Email address
  - textbox "Email address":
    - /placeholder: Enter your email address
  - text: Password
  - textbox "Password":
    - /placeholder: Enter your password
  - button "Show password":
    - img
  - button "Continue":
    - text: Continue
    - img
  - text: Don’t have an account?
  - link "Sign up":
    - /url: http://localhost:3000/sign-up#/?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fdashboard
  - paragraph: Secured by
  - link "Clerk logo":
    - /url: https://go.clerk.com/components
    - img
  - paragraph: Development mode
  - img
  - paragraph: "Resume ATS Match: 91%"
  - paragraph: Optimized for target roles
  - img
  - paragraph: Built for SDEs
  - paragraph: Free for job seekers
  - img
  - text: Secure authentication powered by Clerk & SenseAI Engine
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  4   | 
  5   | test.describe('SenseAI System & UI Verification', () => {
  6   | 
  7   |   test('1. Landing Page loads completely without runtime errors', async ({ page }) => {
  8   |     const consoleErrors = [];
  9   |     const pageErrors = [];
  10  | 
  11  |     page.on('console', msg => {
  12  |       if (msg.type() === 'error') consoleErrors.push(msg.text());
  13  |     });
  14  |     page.on('pageerror', err => pageErrors.push(err.message));
  15  | 
  16  |     await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  17  | 
  18  |     // Verify H1 title or main branding
  19  |     const h1 = page.locator('h1').first();
  20  |     await expect(h1).toBeVisible();
  21  | 
  22  |     // Verify zero ReferenceError / runtime errors
  23  |     const refErrors = pageErrors.filter(e => e.includes('ReferenceError'));
  24  |     expect(refErrors.length).toBe(0);
  25  |     expect(pageErrors.length).toBe(0);
  26  |   });
  27  | 
  28  |   test('2. "Launch Career OS" and "Explore Live Demo" buttons on Landing Page', async ({ page }) => {
  29  |     await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  30  | 
  31  |     // Check Launch Career OS button/link
  32  |     const launchBtn = page.locator('a:has-text("Launch Career OS"), button:has-text("Launch Career OS")').first();
  33  |     await expect(launchBtn).toBeVisible();
  34  | 
  35  |     // Check Explore Live Demo link
  36  |     const demoBtn = page.locator('a:has-text("Explore Live Demo"), button:has-text("Explore Live Demo")').first();
  37  |     await expect(demoBtn).toBeVisible();
  38  | 
  39  |     // Click Explore Live Demo & verify navigation to /demo
  40  |     await demoBtn.click();
  41  |     await page.waitForURL('**/demo');
  42  |     expect(page.url()).toContain('/demo');
  43  |   });
  44  | 
  45  |   test('3. /demo page loads successfully', async ({ page }) => {
  46  |     const pageErrors = [];
  47  |     page.on('pageerror', err => pageErrors.push(err.message));
  48  | 
  49  |     await page.goto(`${BASE_URL}/demo`, { waitUntil: 'domcontentloaded' });
  50  |     
  51  |     const heading = page.locator('h1, h2').first();
  52  |     await expect(heading).toBeVisible();
  53  |     expect(pageErrors.length).toBe(0);
  54  |   });
  55  | 
  56  |   test('4. /dashboard page loads without ReferenceError & Eye icon button works', async ({ page }) => {
  57  |     const pageErrors = [];
  58  |     const consoleErrors = [];
  59  | 
  60  |     page.on('console', msg => {
  61  |       if (msg.type() === 'error') consoleErrors.push(msg.text());
  62  |     });
  63  |     page.on('pageerror', err => pageErrors.push(err.message));
  64  | 
  65  |     await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
  66  | 
  67  |     // Verify dashboard title
  68  |     const dashboardTitle = page.locator('h1:has-text("Candidate Telemetry & Operations")').first();
> 69  |     await expect(dashboardTitle).toBeVisible();
      |                                  ^ Error: expect(locator).toBeVisible() failed
  70  | 
  71  |     // Verify View Demo Data button with Eye icon
  72  |     const viewDemoBtn = page.locator('button:has-text("View Demo Data"), a:has-text("View Demo Data")').first();
  73  |     await expect(viewDemoBtn).toBeVisible();
  74  | 
  75  |     // Click View Demo Data button and verify navigation to /demo
  76  |     await viewDemoBtn.click();
  77  |     await page.waitForURL('**/demo');
  78  |     expect(page.url()).toContain('/demo');
  79  | 
  80  |     // Confirm no ReferenceErrors occurred
  81  |     const refErrors = pageErrors.filter(e => e.includes('ReferenceError') || e.includes('Eye is not defined'));
  82  |     expect(refErrors.length).toBe(0);
  83  |   });
  84  | 
  85  |   test('5. Navbar logged-out & logged-in auth check', async ({ page }) => {
  86  |     // Unauthenticated state check
  87  |     await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  88  |     const signInBtn = page.locator('button:has-text("Sign In"), a:has-text("Sign In")').first();
  89  |     await expect(signInBtn).toBeVisible();
  90  |   });
  91  | 
  92  |   test('6. Viewport responsiveness & fixed navbar non-overlap check', async ({ page }) => {
  93  |     const viewports = [
  94  |       { width: 1440, height: 900 },
  95  |       { width: 1280, height: 800 },
  96  |       { width: 1024, height: 768 },
  97  |       { width: 768, height: 1024 },
  98  |       { width: 390, height: 844 },
  99  |       { width: 375, height: 812 },
  100 |     ];
  101 | 
  102 |     for (const vp of viewports) {
  103 |       await page.setViewportSize(vp);
  104 |       await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
  105 |       
  106 |       // Scroll from top to bottom
  107 |       await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  108 |       await page.waitForTimeout(100);
  109 | 
  110 |       // Scroll back to top
  111 |       await page.evaluate(() => window.scrollTo(0, 0));
  112 |       await page.waitForTimeout(100);
  113 |     }
  114 |   });
  115 | 
  116 | });
  117 | 
```