# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\verification.spec.js >> SenseAI System & UI Verification >> 1. Landing Page loads completely without runtime errors
- Location: tests\verification.spec.js:7:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/", waiting until "networkidle"

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
      - generic [ref=e15]:
        - link "SenseAI v2.0 Live • Introducing the AI Career Operating System" [ref=e18] [cursor=pointer]:
          - /url: /dashboard
          - generic [ref=e22]: SenseAI v2.0 Live
          - generic [ref=e25]: •
          - generic [ref=e26]: Introducing the AI Career Operating System
        - generic [ref=e30]:
          - heading "The Operating System for Software Engineering Careers" [level=1] [ref=e31]:
            - text: The Operating System for
            - generic [ref=e32]: Software Engineering Careers
          - paragraph [ref=e33]: Stop applying blindly. SenseAI measures your career health score, audits your resume, runs WebRTC mock interviews, and tracks applications—all in one context-aware system.
        - generic [ref=e35]:
          - generic [ref=e36]:
            - link [ref=e37] [cursor=pointer]:
              - /url: /dashboard
              - button "Launch Career OS" [ref=e38]
            - link [ref=e39] [cursor=pointer]:
              - /url: /demo
              - button "Explore Live Demo" [ref=e40]
          - generic [ref=e41]:
            - generic [ref=e42]: 100% Free for Job Seekers
            - generic [ref=e46]: •
            - generic [ref=e47]: Powered by Next.js 15 & Gemini 2.0
        - generic [ref=e52]:
          - generic [ref=e53]:
            - generic [ref=e54]: SenseAI Career OS — Telemetry Command Center
            - generic [ref=e59]: Live Telemetry
          - generic [ref=e64]:
            - generic [ref=e65]:
              - generic [ref=e66]:
                - generic [ref=e67]: Career Health
                - generic [ref=e71]:
                  - generic [ref=e72]: 0/100
                  - generic [ref=e73]: +6%
                - paragraph [ref=e77]: Excellent Progress
              - generic [ref=e78]:
                - generic [ref=e79]: Resume Score
                - generic [ref=e84]:
                  - generic [ref=e85]: 91/100
                  - generic [ref=e86]: ATS Ready
                - paragraph [ref=e87]: Optimized for Target Roles
              - generic [ref=e88]:
                - generic [ref=e89]: Interview Prep
                - generic [ref=e94]:
                  - generic [ref=e95]: 82/100
                  - generic [ref=e96]: Interview Ready
                - paragraph [ref=e97]: System Design & Behavioral
              - generic [ref=e98]:
                - generic [ref=e99]: Applications
                - generic [ref=e104]:
                  - generic [ref=e105]: "14"
                  - generic [ref=e106]: Active
                - paragraph [ref=e107]: 3 Active Interviews
            - generic [ref=e108]:
              - generic [ref=e109]:
                - generic [ref=e110]:
                  - generic [ref=e111]: Weekly Goal
                  - generic [ref=e117]: 75% Complete
                - paragraph [ref=e119]: Improve System Design
              - generic [ref=e122]:
                - generic [ref=e123]: Next AI Recommendation
                - paragraph [ref=e131]: "Optimize resume for Amazon SDE II (Missing: Distributed Systems)."
            - generic [ref=e132]:
              - generic [ref=e133]: "Recent Activity: System Design Mock completed (Score 92%) • Resume ATS sync verified"
              - generic [ref=e138]: Synced 2m ago
      - generic [ref=e141]:
        - generic [ref=e142]: "ENTERPRISE ENGINEERING STACK:"
        - generic [ref=e147]:
          - generic [ref=e148]: Next.js 15 App Router
          - generic [ref=e149]: Prisma & PostgreSQL
          - generic [ref=e150]: Google Gemini 2.0 Flash
          - generic [ref=e151]: Clerk Security
        - generic [ref=e152]: 99.99% Telemetry Uptime
      - generic [ref=e158]:
        - generic [ref=e159]:
          - generic [ref=e160]: The Status Quo is Broken
          - heading "Why Software Engineering Applications Get Rejected" [level=2] [ref=e165]
          - paragraph [ref=e166]: Most candidates apply to hundreds of tech roles blindly without actionable telemetry, leading to low callback rates and interview rejection.
        - generic [ref=e167]:
          - generic [ref=e169]:
            - heading "1. Blind ATS Rejections" [level=3] [ref=e174]
            - paragraph [ref=e175]: Resumes are parsed by automated ATS screeners that silently drop candidate files for missing keywords, formatting errors, or unquantified bullet points.
          - generic [ref=e177]:
            - heading "2. Opaque Interview Feedback" [level=3] [ref=e182]
            - paragraph [ref=e183]: Candidates fail technical and behavioral interviews without understanding whether their issue was System Design depth, speech pacing, or communication clarity.
          - generic [ref=e185]:
            - heading "3. Disconnected Tooling" [level=3] [ref=e190]
            - paragraph [ref=e191]: Managing job search across spreadsheets, generic text editors, and random ChatGPT prompts creates chaos without systematic feedback loops.
      - generic [ref=e193]:
        - generic [ref=e194]:
          - generic [ref=e195]: The Career Intelligence Solution
          - heading "One Context-Aware Operating System" [level=2] [ref=e198]
          - paragraph [ref=e199]: SenseAI unifies your candidate profile into a single candidate graph that continuously syncs your resume, mock practice, and application tracking.
        - generic [ref=e200]:
          - generic [ref=e202]:
            - generic [ref=e203]: "01"
            - heading "Single Candidate Graph" [level=3] [ref=e204]
            - paragraph [ref=e205]: Your target roles, technical skills, resume edits, and mock scores update a central state powering targeted AI recommendations.
          - generic [ref=e207]:
            - generic [ref=e208]: "02"
            - heading "Real-Time Career Telemetry" [level=3] [ref=e209]
            - paragraph [ref=e210]: Quantify your interview readiness and ATS resume match in real-time with your overall Career Health Score (CHS 0 - 100).
          - generic [ref=e212]:
            - generic [ref=e213]: "03"
            - heading "Zero-Downtime Fallback Engine" [level=3] [ref=e214]
            - paragraph [ref=e215]: Engineered with deterministic template fallbacks ensuring 100% platform availability even during external AI API outages.
      - generic [ref=e217]:
        - generic [ref=e218]:
          - generic [ref=e219]: Interactive Workspaces
          - heading "Explore the SenseAI Workspaces" [level=2] [ref=e224]
          - paragraph [ref=e225]: Click through the core engine workspaces to see candidate telemetry in action.
          - generic [ref=e226]:
            - button "📄 Resume Intelligence Engine" [ref=e227] [cursor=pointer]
            - button "🎙️ Mock Interview Workspace" [ref=e229] [cursor=pointer]
            - button "💼 Application Workspace CRM" [ref=e230] [cursor=pointer]
        - generic [ref=e232]:
          - generic [ref=e233]:
            - generic [ref=e234]:
              - heading "ATS Resume Parse Audit" [level=3] [ref=e235]
              - paragraph [ref=e236]: "Target Role: Senior Software Engineer (Infrastructure)"
            - generic [ref=e237]:
              - text: 91 / 100
              - paragraph [ref=e238]: "ATS Match: High"
          - generic [ref=e239]:
            - generic [ref=e240]:
              - heading "Matched Keywords (12)" [level=4] [ref=e241]
              - generic [ref=e245]:
                - generic [ref=e246]: Distributed Systems
                - generic [ref=e247]: Kubernetes
                - generic [ref=e248]: Go / Rust
                - generic [ref=e249]: PostgreSQL
            - generic [ref=e250]:
              - heading "Missing Keyword Gaps (2)" [level=4] [ref=e251]
              - generic [ref=e256]:
                - generic [ref=e257]: + GraphQL Subscriptions
                - generic [ref=e258]: + Terraform IaC
      - generic [ref=e260]:
        - generic [ref=e261]:
          - heading "Built for Engineering Excellence" [level=2] [ref=e262]
          - paragraph [ref=e263]: Comprehensive toolset engineered to maximize candidate callback rates.
        - generic [ref=e264]:
          - generic [ref=e267]:
            - heading "AI-Powered Career Guidance" [level=3] [ref=e281]
            - paragraph [ref=e282]: Get personalized career advice and insights powered by advanced AI technology.
          - generic [ref=e285]:
            - heading "Interview Preparation" [level=3] [ref=e290]
            - paragraph [ref=e291]: Practice with role-specific questions and get instant feedback to improve your performance.
          - generic [ref=e294]:
            - heading "Industry Insights" [level=3] [ref=e299]
            - paragraph [ref=e300]: Stay ahead with real-time industry trends, salary data, and market analysis.
          - generic [ref=e303]:
            - heading "Smart Resume Creation" [level=3] [ref=e308]
            - paragraph [ref=e309]: Generate ATS-optimized resumes with AI assistance.
      - generic [ref=e311]:
        - generic [ref=e312]:
          - heading "How SenseAI Accelerates Your Search" [level=2] [ref=e313]
          - paragraph [ref=e314]: Four structured steps turning candidate preparation into predictable offers.
        - generic [ref=e315]:
          - generic [ref=e318]:
            - generic [ref=e319]: STEP 01
            - heading "Professional Onboarding" [level=3] [ref=e324]
            - paragraph [ref=e325]: Share your industry and expertise for personalized guidance
          - generic [ref=e328]:
            - generic [ref=e329]: STEP 02
            - heading "Craft Your Documents" [level=3] [ref=e335]
            - paragraph [ref=e336]: Create ATS-optimized resumes and compelling cover letters
          - generic [ref=e339]:
            - generic [ref=e340]: STEP 03
            - heading "Prepare for Interviews" [level=3] [ref=e347]
            - paragraph [ref=e348]: Practice with AI-powered mock interviews tailored to your role
          - generic [ref=e351]:
            - generic [ref=e352]: STEP 04
            - heading "Track Your Progress" [level=3] [ref=e357]
            - paragraph [ref=e358]: Monitor improvements with detailed performance analytics
      - generic [ref=e360]:
        - generic [ref=e361]:
          - generic [ref=e362]: Verified Candidate Milestones
          - heading "The Candidate Career Transformation" [level=2] [ref=e366]
          - paragraph [ref=e367]: From unorganized applications to multiple high-paying tech offers.
        - generic [ref=e369]:
          - generic [ref=e370]:
            - text: Initial Baseline
            - paragraph [ref=e371]: "CHS: 52 / 100"
            - paragraph [ref=e372]: 0 Callbacks / 50 Applications
          - generic [ref=e373]:
            - text: After 14 Days
            - paragraph [ref=e374]: "CHS: 71 / 100"
            - paragraph [ref=e375]: ATS Score 91% + Mock Practice
          - generic [ref=e376]:
            - text: Offer Phase
            - paragraph [ref=e377]: "CHS: 84 / 100"
            - paragraph [ref=e378]: 3 Tech Offers Received
      - generic [ref=e380]:
        - generic [ref=e381]:
          - heading "Candidate Feedback & Reviews" [level=2] [ref=e382]
          - paragraph [ref=e383]: See how students and engineering candidates land roles using SenseAI.
        - generic [ref=e384]:
          - generic [ref=e386]:
            - paragraph [ref=e387]: "\"The ATS Resume Intelligence Engine highlighted structural keyword gaps I had missed for months. My callback rate jumped from 0 to 4 interviews in two weeks.\""
            - generic [ref=e388]:
              - generic [ref=e389]:
                - paragraph [ref=e390]: Software Engineering Intern
                - paragraph [ref=e391]: CS Senior • Early Beta Tester
              - generic [ref=e392]: Verified
          - generic [ref=e394]:
            - paragraph [ref=e395]: "\"Practicing System Design voice mock interviews gave me concrete feedback on pacing and architectural trade-offs. The feedback was remarkably realistic.\""
            - generic [ref=e396]:
              - generic [ref=e397]:
                - paragraph [ref=e398]: Backend Engineering Candidate
                - paragraph [ref=e399]: IIIT Student • Beta User
              - generic [ref=e400]: Verified
          - generic [ref=e402]:
            - paragraph [ref=e403]: "\"Having a unified Career Health Score (CHS) and Application CRM stopped me from applying blindly. It made my job search structured and metric-driven.\""
            - generic [ref=e404]:
              - generic [ref=e405]:
                - paragraph [ref=e406]: DevOps Engineer Candidate
                - paragraph [ref=e407]: 2025 Graduate • Early Adopter
              - generic [ref=e408]: Verified
      - generic [ref=e410]:
        - generic [ref=e411]:
          - heading "Frequently Asked Questions" [level=2] [ref=e412]
          - paragraph [ref=e413]: Everything you need to know about SenseAI Career OS.
        - generic [ref=e415]:
          - heading [level=3] [ref=e417]:
            - button "What makes Sensai unique as a career development tool?" [ref=e418] [cursor=pointer]
          - heading [level=3] [ref=e422]:
            - button "How does Sensai create tailored content?" [ref=e423] [cursor=pointer]
          - heading [level=3] [ref=e427]:
            - button "How accurate and up-to-date are Sensai's industry insights?" [ref=e428] [cursor=pointer]
          - heading [level=3] [ref=e432]:
            - button "Is my data secure with Sensai?" [ref=e433] [cursor=pointer]
          - heading [level=3] [ref=e437]:
            - button "How can I track my interview preparation progress?" [ref=e438] [cursor=pointer]
          - heading [level=3] [ref=e442]:
            - button "Can I edit the AI-generated content?" [ref=e443] [cursor=pointer]
      - generic [ref=e449]:
        - heading "Ready to Accelerate Your Engineering Career?" [level=2] [ref=e450]
        - paragraph [ref=e451]: Join software engineers optimizing their resumes, mock interviews, and application search with SenseAI.
        - link [ref=e453] [cursor=pointer]:
          - /url: /dashboard
          - button "Launch Career OS Free" [ref=e454]
  - region "Notifications alt+T"
  - contentinfo [ref=e455]:
    - generic [ref=e456]:
      - generic [ref=e457]:
        - generic [ref=e458]:
          - link "SenseAI Logo SenseAI Career OS" [ref=e459] [cursor=pointer]:
            - /url: /
            - img "SenseAI Logo" [ref=e461]
            - generic [ref=e462]: SenseAI Career OS
          - paragraph [ref=e463]: The AI Career Operating System empowering software engineers to measure career health, audit ATS resumes, run WebRTC mock interviews, and track applications.
          - generic [ref=e464]: All Systems Operational • v2.0 Live
        - generic [ref=e469]:
          - heading "Workspaces" [level=4] [ref=e470]
          - list [ref=e471]:
            - listitem [ref=e472]:
              - link "Telemetry Command Center" [ref=e473] [cursor=pointer]:
                - /url: /dashboard
            - listitem [ref=e474]:
              - link "Resume Intelligence Engine" [ref=e475] [cursor=pointer]:
                - /url: /resume
            - listitem [ref=e476]:
              - link "Mock Interview Workspace" [ref=e477] [cursor=pointer]:
                - /url: /interview
            - listitem [ref=e478]:
              - link "Career Health Audit" [ref=e479] [cursor=pointer]:
                - /url: /onboarding
        - generic [ref=e480]:
          - heading "Architecture" [level=4] [ref=e481]
          - list [ref=e482]:
            - listitem [ref=e483]: Next.js 15 App Router
            - listitem [ref=e486]: Prisma & PostgreSQL
            - listitem [ref=e489]: Google Gemini 2.0 Flash
            - listitem [ref=e492]: Clerk Authentication
        - generic [ref=e495]:
          - heading "Engineering" [level=4] [ref=e496]
          - generic [ref=e497]:
            - paragraph [ref=e498]: Designed & Engineered by
            - paragraph [ref=e499]: Ankit Mishra
            - paragraph [ref=e500]: Software Engineering Intern
            - paragraph [ref=e501]: IIIT Vadodara
          - generic [ref=e502]:
            - link "GitHub Profile" [ref=e503] [cursor=pointer]:
              - /url: https://github.com/AnkitMishra28
            - link "LinkedIn Profile" [ref=e507] [cursor=pointer]:
              - /url: https://www.linkedin.com/in/ankit-mishra-189b38277/
      - generic [ref=e512]:
        - paragraph [ref=e513]: © 2026 SenseAI Career OS. All rights reserved.
        - paragraph [ref=e514]: Built with for SDE & Tech Professionals.
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const BASE_URL = 'http://localhost:3001';
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
> 16  |     await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
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
  29  |     await page.goto(BASE_URL, { waitUntil: 'networkidle' });
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
  49  |     await page.goto(`${BASE_URL}/demo`, { waitUntil: 'networkidle' });
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
  65  |     await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
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
  87  |     await page.goto(BASE_URL, { waitUntil: 'networkidle' });
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
  104 |       await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
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
```