# 🧠 AI Career Coach Platform

A full-stack AI-powered career assistant built with Next.js, Tailwind CSS, Prisma, Neon DB, Inngest, and Clerk for authentication. This platform enables users to generate tailored resumes, write custom cover letters, and prepare for job interviews with AI-powered mock interviews — all in one place.

---

## 🚀 Features

- 🔐 **User Authentication** with Clerk (Sign up, Login, Onboarding)
- 📄 **Resume Builder** – Fill details and generate a professional resume PDF
- ✍️ **Cover Letter Generator** – Upload your resume and job description to get a tailored letter using Gemini AI
- 🤖 **AI Mock Interview** – Practice interview questions and receive real-time feedback from the Gemini model
- 📊 **Admin Dashboard** – Track user analytics, usage logs, and content generation
- 🧬 **LLM-Integrated Workflow** – All modules powered by Gemini API with seamless execution via Inngest
- 🧩 **Modern UI** with Shadcn UI + Tailwind CSS

---

## 🏗️ Tech Stack

| Tech         | Description                               |
|--------------|-------------------------------------------|
| `Next.js`    | React framework for SSR and scalability   |
| `Prisma`     | ORM for database interaction              |
| `Neon DB`    | Postgres database (serverless + fast)     |
| `Tailwind`   | Utility-first CSS styling                 |
| `Clerk`      | Full-stack user authentication            |
| `Gemini API` | AI resume, cover letter, and Q&A backend  |
| `Inngest`    | Event-driven serverless job orchestration |
| `Shadcn UI`  | Clean, accessible, and extendable UI      |

---

## 📦 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/ai-career-coach.git
cd ai-career-coach

npm install
# or
yarn

DATABASE_URL=your_neon_db_url

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=your_gemini_api_key

📚 Future Improvements
Export resume and cover letter in multiple formats

Add voice-based interview simulation

Analytics for feedback and improvement tips

LinkedIn optimization using AI

📄 License
This project is licensed under the MIT License.

🙏 Acknowledgements
Google Gemini API for powering the AI

Clerk for seamless authentication

Prisma + NeonDB for effortless data storage

Shadcn/UI for modern frontend components
