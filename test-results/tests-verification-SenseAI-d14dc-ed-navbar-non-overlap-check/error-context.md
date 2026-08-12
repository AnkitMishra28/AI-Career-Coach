# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\verification.spec.js >> SenseAI System & UI Verification >> 6. Viewport responsiveness & fixed navbar non-overlap check
- Location: tests\verification.spec.js:92:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/dashboard", waiting until "networkidle"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e4]:
      - link "SenseAI Logo SenseAI" [ref=e5] [cursor=pointer]:
        - /url: /
        - img "SenseAI Logo" [ref=e7]
        - generic [ref=e8]: SenseAI
      - button "Sign In" [ref=e10] [cursor=pointer]
  - main [ref=e11]:
    - generic [ref=e13]:
      - generic [ref=e14]:
        - link "Back to SenseAI Home" [ref=e15] [cursor=pointer]:
          - /url: /
        - generic [ref=e18]:
          - img "SenseAI Logo" [ref=e20]
          - generic [ref=e21]: SenseAI Career OS
      - generic [ref=e22]:
        - generic [ref=e23]:
          - generic [ref=e29]:
            - paragraph [ref=e30]: "Career Health: 84/100"
            - paragraph [ref=e31]: Top 12% of candidates
          - generic [ref=e32]:
            - paragraph [ref=e33]: "\"Landed 3 offers in 14 days using SenseAI's mock interviews.\""
            - paragraph [ref=e34]: — SDE Candidate, Verified
        - generic [ref=e37]:
          - generic [ref=e38]:
            - generic [ref=e40]:
              - heading "Sign in to My Application" [level=1] [ref=e41]
              - paragraph [ref=e42]: Welcome back! Please sign in to continue
            - generic [ref=e43]:
              - button "Sign in with Google Continue with Google" [ref=e46] [cursor=pointer]:
                - generic [ref=e47]:
                  - img "Sign in with Google" [ref=e49]
                  - generic [ref=e50]: Continue with Google
              - paragraph [ref=e53]: or
              - generic [ref=e55]:
                - generic [ref=e56]:
                  - generic [ref=e59]:
                    - generic [ref=e60]: Email address
                    - textbox "Email address" [ref=e62]:
                      - /placeholder: Enter your email address
                  - generic:
                    - generic:
                      - generic:
                        - generic: Password
                        - generic:
                          - textbox "Password":
                            - /placeholder: Enter your password
                          - button "Show password"
                - button "Continue" [ref=e65] [cursor=pointer]
          - generic [ref=e69]:
            - generic [ref=e70]:
              - generic [ref=e71]: Don’t have an account?
              - link "Sign up" [ref=e72] [cursor=pointer]:
                - /url: http://localhost:3001/sign-up#/?redirect_url=http%3A%2F%2Flocalhost%3A3001%2Fdashboard
            - generic [ref=e74]:
              - generic [ref=e76]:
                - paragraph [ref=e77]: Secured by
                - link "Clerk logo" [ref=e78] [cursor=pointer]:
                  - /url: https://go.clerk.com/components
              - paragraph [ref=e84]: Development mode
        - generic [ref=e85]:
          - generic [ref=e92]:
            - paragraph [ref=e93]: "Resume ATS Match: 91%"
            - paragraph [ref=e94]: Optimized for target roles
          - generic [ref=e102]:
            - paragraph [ref=e103]: Built for SDEs
            - paragraph [ref=e104]: Free for job seekers
      - generic [ref=e105]: Secure authentication powered by Clerk & SenseAI Engine
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e114] [cursor=pointer]
  - alert [ref=e118]
```

# Test source

```ts
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
  69  |     await expect(dashboardTitle).toBeVisible();
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
> 104 |       await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
      |                  ^ Error: page.goto: Test timeout of 30000ms exceeded.
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