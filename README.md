# SenseAI Career OS

<div align="center">

<img src="public/logo.png" alt="SenseAI Logo" width="80" height="80" style="border-radius: 50%;" />

### An Intelligent Career Operating System for Software Engineers
**Context-aware telemetry, deterministic career health scoring, AI-powered resume optimization, dual-mode mock interview coaching, and automated market intelligence.**

[![Next.js 15](https://img.shields.io/badge/Next.js-15.3.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.7.0-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini_3.1_Flash_Lite-8E75B2?style=flat-square&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk_v6-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com/)
[![Inngest](https://img.shields.io/badge/Jobs-Inngest_v3-FF5A5F?style=flat-square&logo=inngest&logoColor=white)](https://www.inngest.com/)
[![Playwright](https://img.shields.io/badge/Testing-Playwright_v1.62-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)

---

[Explore Architecture](#-system-architecture) •
[Core Features](#-core-features) •
[Product Showcase](#-product-showcase) •
[AI Implementation](#-ai-engine--grounding-architecture) •
[Local Setup](#-getting-started) •
[Data Model](#-data-layer--schema)

</div>

---

## Hero Overview

![SenseAI Landing Page & Hero Telemetry](docs/screenshots/senseai-landing.png)

---

## Why SenseAI?

Traditional tech job hunting is notoriously fragmented and opaque:
- **Blind ATS Rejections**: Candidates submit hundreds of resumes without visibility into keyword matching density, missing competencies, or unquantified achievements.
- **Disconnected Workspaces**: Job seekers manage disparate documents across spreadsheets, markdown files, and generic ChatGPT prompts with no shared candidate context.
- **Unstructured Interview Practice**: Technical and behavioral preparation lacks structured diagnostic feedback, scoring rubric criteria, and progressive tracking.

**SenseAI Career OS** unifies candidate telemetry into a single, context-aware operating system. By integrating user profile state, resume structure, interview performance metrics, and real-time market data, SenseAI acts as an autonomous career copilot designed specifically for software engineering workflows.

---

## Core Features

| Feature | Description | Engineering Implementation |
| :--- | :--- | :--- |
| **Telemetry Command Center** | Real-time candidate telemetry calculating a dynamic 0–100 **Career Health Score (CHS)** across profile depth, ATS readiness, mock interview benchmark, and pipeline activity. | Computed deterministically via Next.js Server Actions with active recommendation triggers. |
| **AI Resume Intelligence** | Multi-section structured resume builder with live Markdown preview, PDF export, and section-level AI bullet rewrite enhancements. | Contextual prompt injection with strict non-hallucination constraints and PDF compilation via `html2pdf.js`. |
| **ATS Audit & Gap Analysis** | Compares candidate resume against target job descriptions, outputting ATS compatibility score (0–100), keyword match coverage, section health checklists, and missing skill badges. | Structured JSON schema generation with a deterministic offline keyword extractor fallback. |
| **Dual-Mode Mock Interviews** | Practice via 10-question **Diagnostic MCQ Quizzes** or 5-question **Conversational Scenario Interviews** with real-time Web Speech API voice dictation. | Multi-dimensional scoring (Technical Accuracy, Depth, Communication) with personalized improvement tips. |
| **Grounded Cover Letter Generator** | Generates personalized, company-tailored cover letters strictly grounded in candidate database facts (experience, skills, projects) with zero fabricated claims. | Injects verified candidate profile into prompt; outputs formatted markdown in an interactive `@uiw/react-md-editor`. |
| **Automated Market Intelligence** | Live compensation benchmarks (in ₹ INR), demand levels, 7-day growth rates, in-demand skills radar, and industry trend analytics. | Inngest cron background functions (`0 0 * * 0`) running weekly batch updates with Prisma upserts. |
| **Interactive Sandbox Demo** | Full-fidelity read-only demo mode (`/demo`) allowing instant product evaluation with zero authentication or database writes. | Client-side reactive telemetry state with simulated performance trends and salary visualization. |

---

## Product Showcase

### 1. Telemetry Command Center (`/dashboard`)
> Real-time monitoring of Candidate Telemetry, dynamic Career Health Score (CHS), AI Next Action recommendations, and market demand status.

![SenseAI Command Center](docs/screenshots/senseai-dashboard.png)

---

### 2. AI Resume Intelligence & ATS Analyzer (`/resume`)
> Granular ATS audit providing 0–100 compatibility scores, keyword match density, structural section health, matched vs. missing skill tags, and quantifiable bullet rewrite suggestions.

![SenseAI Resume Intelligence & ATS Analyzer](docs/screenshots/senseai-resume-audit.png)

---

### 3. AI Grounded Cover Letter Studio (`/ai-cover-letter`)
> Full-featured markdown cover letter studio generating tailored applications grounded in real candidate achievements without placeholder tokens or hallucinations.

![SenseAI AI Cover Letter Studio](docs/screenshots/senseai-cover-letter.png)

---

### 4. Mock Interview Preparation & Score Trajectory (`/interview`)
> Diagnostic assessments with category breakdown (Technical, System Design, Behavioral), performance trends over time, and strategic engineering coaching tips.

![SenseAI Mock Interview Workspace](docs/screenshots/senseai-interview-prep.png)

---

## System Architecture

SenseAI is architected around **Next.js 15 App Router**, utilizing server-side rendering, React Server Components (RSC), and authenticated Server Actions for secure, direct data mutations.

```mermaid
flowchart TD
    subgraph Client ["Client Layer (React 19 / Tailwind / Radix)"]
        UI[Landing Page & Workspaces]
        Demo[Interactive Sandbox (/demo)]
        Voice[Web Speech API Audio Dictation]
    end

    subgraph AuthSecurity ["Authentication & Guardrails"]
        Clerk[Clerk Auth v6]
        MW[Next.js Route Matcher Middleware]
        Zod[Zod Schema Validation]
    end

    subgraph ServerLayer ["Server Execution Layer (Next.js 15)"]
        SA_User[User & Onboarding Action]
        SA_Resume[Resume & ATS Audit Action]
        SA_Interview[Mock Interview Action]
        SA_Letter[Cover Letter Action]
        SA_Dash[Command Center Telemetry Action]
    end

    subgraph ExternalServices ["External Engines & Background Workers"]
        Gemini[Google Gemini API<br/>gemini-3.1-flash-lite]
        Inngest[Inngest Background Cron<br/>Weekly Market Sync]
    end

    subgraph DatabaseLayer ["Data Persistence"]
        Prisma[Prisma ORM v6.7]
        Postgres[(PostgreSQL / Neon DB)]
    end

    UI --> MW --> Clerk
    UI --> Zod --> ServerLayer
    Demo --> UI
    Voice --> SA_Interview

    ServerLayer --> Prisma --> Postgres
    SA_Resume --> Gemini
    SA_Interview --> Gemini
    SA_Letter --> Gemini
    SA_Dash --> Gemini

    Inngest --> Gemini
    Inngest --> Prisma
```

### End-to-End User Journey

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Web as Next.js 15 Client
    participant Auth as Clerk Authentication
    participant Action as Server Actions
    participant DB as Prisma / PostgreSQL
    participant AI as Google Gemini Engine

    User->>Web: Access SenseAI Landing Page
    User->>Auth: Sign Up / Sign In (Email / OAuth)
    Auth-->>Web: Session Token Verified
    Web->>Action: checkUser() & getUserOnboardingStatus()
    Action->>DB: Sync User Record

    alt Profile Incomplete
        Web->>User: Redirect to /onboarding
        User->>Web: Submit Industry, Experience, Skills & Bio
        Web->>Action: updateUser(data) with DB Transaction
        Action->>DB: Upsert User Profile & IndustryInsight
    end

    Web->>User: Access Career Command Center (/dashboard)
    User->>Web: Run ATS Resume Audit or Mock Interview
    Web->>Action: auditResumeWithAI() / evaluateInterviewAnswer()
    Action->>AI: Structured Schema Prompt + Candidate Context
    AI-->>Action: Validated JSON Evaluation
    Action->>DB: Persist Assessment / Resume ATS Score
    Action-->>Web: Revalidate Path & Update UI Telemetry
```

---

## AI Engine & Grounding Architecture

SenseAI interfaces with the **Google Gemini API (`@google/generative-ai`)** through a resilient server-side abstraction layer designed to prevent hallucination, handle rate limits gracefully, and guarantee structured output.

```
Candidate Profile + Job Context  ───►  Grounded Prompt Construction
                                                │
                                                ▼
                                    Gemini API (gemini-3.1-flash-lite)
                                                │
                                                ▼
                                    Strict JSON Boundary Cleaner
                                                │
                                ┌───────────────┴───────────────┐
                                ▼                               ▼
                        [Valid JSON Parsed]             [Rate Limit (429) / Error]
                                │                               │
                                ▼                               ▼
                        Persist & Display             Deterministic Fallback Engine
```

### Key AI Engineering Practices Implemented

1. **Strict JSON Sanitization (`safeGenerateJSON`)**:
   Cleans response text, strips markdown code fences, and extracts JSON substrings by identifying root brace/bracket boundaries before `JSON.parse`.
2. **Context-Grounding & Anti-Hallucination**:
   Prompts are strictly bounded by verified candidate database records (work experience, education, projects, skills). Prompts explicitly enforce: *"Never invent false metrics, degrees, companies, or technologies not supplied by the user."*
3. **Deterministic Offline Fallbacks**:
   - **ATS Analyzer**: In the event of network timeouts or quota exhaustion (HTTP 429), `calculateDeterministicATS` performs rule-based keyword extraction and structural section health verification.
   - **Mock Interviews**: Backed by high-quality curated question templates across Technical, System Design, and Behavioral domains.
   - **Industry Insights**: Pre-calibrated compensation and skill benchmarks for immediate response availability.
4. **Intelligent Cooldown & Request Deduplication**:
   - `getAIErrorCooldownMs` detects rate limits and calculates exponential backoff timestamps (up to 6 hours for 429 quota exhaustion).
   - In-memory lock map (`activeInsightRequests`) prevents duplicate concurrent AI calls for identical industry requests.
5. **Request Timeout Safety**:
   All AI requests execute inside a `withTimeout(promise, 25000)` wrapper to prevent hung serverless workers.

---

## Data Layer & Schema

The data model is managed with **Prisma ORM** over **PostgreSQL**:

```
 ┌──────────────────────┐         ┌──────────────────────┐
 │         User         │1       1│        Resume        │
 │──────────────────────┼─────────┼──────────────────────┤
 │ id (UUID PK)         │         │ id (CUID PK)         │
 │ clerkUserId (Unique) │         │ userId (FK, Unique)  │
 │ email (Unique)       │         │ content (Text)       │
 │ name, imageUrl       │         │ atsScore (Float)     │
 │ industry (FK)        │         │ feedback (JSON Text) │
 │ experience, bio      │         └──────────────────────┘
 │ skills (String[])    │
 └──────────┬───────────┘
            │1         1│
            │           ├──────────────────────┐
            │*          │*                     │1
 ┌──────────▼───────────▼┐       ┌─────────────▼────────┐
 │      Assessment       │       │     CoverLetter      │
 │───────────────────────┤       │──────────────────────┤
 │ id (CUID PK)          │       │ id (CUID PK)         │
 │ userId (FK)           │       │ userId (FK)          │
 │ quizScore (Float)     │       │ content (Text)       │
 │ category (String)     │       │ companyName (String) │
 │ questions (Json[])    │       │ jobTitle (String)    │
 │ improvementTip (Text) │       │ status (String)      │
 └───────────────────────┘       └──────────────────────┘
            │*
            │
            │1 (relation on industry name)
 ┌──────────▼────────────┐
 │    IndustryInsight    │
 │───────────────────────┤
 │ id (CUID PK)          │
 │ industry (Unique)     │
 │ salaryRanges (Json[]) │
 │ growthRate (Float)    │
 │ demandLevel (String)  │
 │ topSkills (String[])  │
 │ marketOutlook         │
 │ keyTrends (String[])  │
 │ nextUpdate (DateTime) │
 └───────────────────────┘
```

---

## Authentication & Security

- **Clerk Authentication**: Full session lifecycle management supporting OAuth, email verification, and multi-factor authentication.
- **Protected Routing**: Next.js route matcher middleware (`middleware.js`) enforces strict server-side protection on `/dashboard`, `/resume`, `/interview`, `/ai-cover-letter`, and `/onboarding`.
- **Database Synchronization**: `lib/checkUser.js` executes an atomic user sync between Clerk identities and internal PostgreSQL records.
- **Server Action Authorization**: Every server action validates session identity with `auth()` and enforces tenant isolation on every SQL query (`where: { userId: user.id }`).
- **Input Validation**: All client mutations are validated server-side using **Zod** schemas (`onboardingSchema`, `resumeSchema`, `coverLetterSchema`, `workExperienceSchema`).
- **Sanitized Markdown**: Rich text editors use isolated rendering to prevent Cross-Site Scripting (XSS).

---

## Testing & Verification

Automated end-to-end testing is configured with **Playwright**:

```bash
# Run all Playwright verification tests
npx playwright test

# Run tests in headed UI mode
npx playwright test --ui

# Run ESLint validation
npm run lint
```

### Verified Test Suites (`tests/verification.spec.js`)
- **Landing Page DOM Integrity**: Confirms clean render without runtime or reference errors.
- **Navigation & Action Workflows**: Validates "Launch Career OS" and "Explore Live Demo" interaction pathways.
- **Demo Sandbox Verification**: Ensures zero-auth demo workspace loads without database dependency.
- **Command Center Telemetry**: Asserts presence of candidate health telemetry, dynamic action buttons, and icons.
- **Responsive Viewport Matrix**: Automated testing across 6 device viewports (Desktop 1440×900, Laptop 1280×800, Tablet 1024×768 & 768×1024, Mobile 390×844 & 375×812) to verify non-overlapping navbar clearance and layout stability.

---

## Project Structure

```
ai-career-coach/
├── actions/                  # Next.js Server Actions
│   ├── cover-letter.js       # Cover letter generation, update & CRUD
│   ├── dashboard.js          # Telemetry metrics, insights & aggregation
│   ├── interview.js          # MCQ quiz & conversational mock actions
│   ├── resume.js             # ATS audit, section improvement & persistence
│   └── user.js               # User profile & onboarding transactions
├── app/                      # Next.js 15 App Router
│   ├── (auth)/               # Clerk authentication routes (sign-in / sign-up)
│   ├── (main)/               # Authenticated application workspaces
│   │   ├── ai-cover-letter/  # Cover letter generator & markdown editor
│   │   ├── dashboard/        # Career Command Center & telemetry view
│   │   ├── interview/        # Mock interview workspace & quiz interface
│   │   ├── onboarding/       # Multi-step profile setup wizard
│   │   └── resume/           # Structured resume builder & ATS auditor
│   ├── api/
│   │   └── inngest/          # Inngest background cron endpoint
│   ├── demo/                 # Interactive read-only sandbox preview
│   ├── view-test/            # Telemetry verification view
│   ├── layout.js             # Root layout with theme & auth providers
│   └── page.js               # High-conversion landing page
├── components/               # Reusable UI components & layouts
│   ├── ui/                   # Radix UI primitives & custom badges
│   ├── hero.jsx              # Landing hero section with animated telemetry
│   ├── header.jsx            # Dynamic responsive navigation bar
│   ├── footer.jsx            # Product footer & engineering credits
│   └── product-telemetry-preview.jsx # 3D interactive macOS telemetry card
├── data/                     # Domain configurations & baseline benchmarks
│   ├── features.js           # Platform capabilities catalog
│   ├── industries.js         # Pre-configured industries & specializations
│   └── faqs.js               # Frequently asked technical questions
├── docs/
│   └── screenshots/          # High-resolution product documentation assets
├── hooks/                    # Custom React hooks (use-fetch, etc.)
├── lib/                      # Core infrastructure modules
│   ├── checkUser.js          # Clerk-to-Prisma user synchronization
│   ├── gemini.js             # Gemini AI client, JSON parser & cooldowns
│   ├── industry-insights.js  # Compensation profiles & fallback benchmarks
│   ├── inngest/              # Inngest client & scheduled cron definitions
│   └── prisma.js             # Prisma singleton client instance
├── prisma/
│   └── schema.prisma         # Relational database schema definitions
├── tests/                    # Playwright automated test suites
├── middleware.js             # Clerk route protection middleware
├── package.json              # Dependencies & scripts
└── tailwind.config.mjs       # Tailwind design tokens & animations
```

---

## Getting Started

### Prerequisites
- **Node.js**: `v18.18.0` or higher (Node.js `v20+` recommended)
- **npm** or **yarn** / **pnpm**
- **PostgreSQL Database**: Free serverless instance from [Neon](https://neon.tech/) or local PostgreSQL
- **Clerk Account**: Free API keys from [Clerk Dashboard](https://dashboard.clerk.com/)
- **Google Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/)

---

### 1. Clone Repository

```bash
git clone https://github.com/AnkitMishra28/AI-Career-Coach.git
cd AI-Career-Coach
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Connection (Neon / PostgreSQL)
DATABASE_URL="postgresql://username:password@ep-sample-pool.region.aws.neon.tech/career_db?sslmode=require"

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URL Routing
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/onboarding
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding

# Google Gemini AI
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-3.1-flash-lite
```

| Variable | Purpose | Required |
| :--- | :--- | :---: |
| `DATABASE_URL` | PostgreSQL connection string for Prisma ORM | **Yes** |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public frontend key | **Yes** |
| `CLERK_SECRET_KEY` | Clerk backend authentication secret | **Yes** |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page route (`/sign-in`) | **Yes** |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up page route (`/sign-up`) | **Yes** |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Post-auth onboarding redirect | **Yes** |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Post-signup onboarding redirect | **Yes** |
| `GEMINI_API_KEY` | Google Gemini API key for AI generation | **Yes** |
| `GEMINI_MODEL` | Gemini model selector (defaults to `gemini-3.1-flash-lite`) | Optional |

---

### 4. Database Setup

Generate the Prisma client and push schema tables to your PostgreSQL database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema directly to database (for development)
npx prisma db push
```

---

### 5. Launch Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Engineering Highlights

- **Server-First Architecture**: Built using React Server Components and Next.js Server Actions, minimizing client JavaScript bundle size and eliminating manual API route boilerplate.
- **Deterministic Resilience**: The application is built with graceful fallbacks across all AI endpoints—if the Gemini API experiences rate limits (HTTP 429) or network latency, the platform transitions to local deterministic algorithms without disrupting the candidate workflow.
- **Type-Safe Schema Validation**: End-to-end type safety and validation from client input to database mutation using **Zod** and **Prisma**.
- **Atomic Profile Transactions**: Profile updates and initial industry insight provisioning execute inside an atomic `db.$transaction` to ensure relational integrity.
- **Enterprise Scheduled Jobs**: Integration with **Inngest** for background cron task scheduling without requiring persistent dedicated worker infrastructure.
- **Automated Viewport QA**: Full-suite Playwright test coverage verifying layout stability across 6 distinct desktop, tablet, and mobile device resolutions.

---

## Deployment

SenseAI is configured for zero-configuration deployment on **Vercel**:

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Add the environment variables listed in the [Environment Variables](#3-configure-environment-variables) section.
4. Deploy — the `postinstall` script (`prisma generate`) will automatically prepare the Prisma client during the build phase.

---

## Future Roadmap

- [ ] **Real-Time Video Mock Interviews**: Integrating WebRTC peer connections with multimodal Gemini live streaming for facial expression and pacing analysis.
- [ ] **Direct Job Board Sync**: Bi-directional integration with GitHub Jobs, LinkedIn, and Greenhouse API for automated 1-click ATS tailored submissions.
- [ ] **Collaborative Peer Mock Sessions**: Real-time collaborative coding room with shared Monaco editor and live audio chat.
- [ ] **Automated GitHub Portfolio Analysis**: Auto-importing public GitHub repositories to extract verified technical skills and commit volume metrics.

---

## Author

**Ankit Mishra**

- GitHub: [@AnkitMishra28](https://github.com/AnkitMishra28)
- Repository: [AI-Career-Coach](https://github.com/AnkitMishra28/AI-Career-Coach)

---

<div align="center">
  <sub>Built with precision for software engineering career acceleration.</sub>
</div>
