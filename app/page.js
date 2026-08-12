"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HeroSection from "@/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  Video,
  Briefcase,
  ShieldCheck,
  Cpu,
  Layers,
  Award,
} from "lucide-react";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";
import Reveal from "@/components/reveal";
import { StaggerGroup, StaggerItem } from "@/components/stagger";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("ats");

  return (
    <div className="relative min-h-screen bg-[#07080B] text-foreground overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="grid-background"></div>

      {/* 1. HERO EXPERIENCE (Story Chapter 1: The Solution Proof) */}
      <HeroSection />

      {/* 2. TRUST & ENGINEERING TELEMETRY ROW */}
      <section className="relative z-10 w-full py-8 border-y border-white/10 bg-white/[0.01] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Cpu className="h-4 w-4 text-indigo-400" />
              <span>ENTERPRISE ENGINEERING STACK:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-mono text-gray-300">
              <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.02]">
                Next.js 15 App Router
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.02]">
                Prisma & PostgreSQL
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.02]">
                Google Gemini 2.0 Flash
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.02]">
                Clerk Security
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="h-4 w-4" />
              <span>99.99% Telemetry Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM SECTION (Story Chapter 2: The Broken Job Search) */}
      <section className="relative z-10 w-full section-padding">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto section-header-gap space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-semibold uppercase tracking-wider">
              <XCircle className="h-3.5 w-3.5" />
              The Status Quo is Broken
            </div>
            <h2 className="text-section-title text-foreground">
              Why Software Engineering Applications Get Rejected
            </h2>
            <p className="text-muted-foreground text-body">
              Most candidates apply to hundreds of tech roles blindly without actionable telemetry, leading to low callback rates and interview rejection.
            </p>
          </div>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Problem Card 1 */}
            <StaggerItem className="glass-card glass-card-hover rounded-2xl p-6 md:p-8 space-y-4 border-t-2 border-t-rose-500/50 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-card-title text-foreground">1. Blind ATS Rejections</h3>
                <p className="text-small text-muted-foreground">
                  Resumes are parsed by automated ATS screeners that silently drop candidate files for missing keywords, formatting errors, or unquantified bullet points.
                </p>
              </div>
            </StaggerItem>

            {/* Problem Card 2 */}
            <StaggerItem className="glass-card glass-card-hover rounded-2xl p-6 md:p-8 space-y-4 border-t-2 border-t-amber-500/50 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Video className="h-5 w-5" />
                </div>
                <h3 className="text-card-title text-foreground">2. Opaque Interview Feedback</h3>
                <p className="text-small text-muted-foreground">
                  Candidates fail technical and behavioral interviews without understanding whether their issue was System Design depth, speech pacing, or communication clarity.
                </p>
              </div>
            </StaggerItem>

            {/* Problem Card 3 */}
            <StaggerItem className="glass-card glass-card-hover rounded-2xl p-6 md:p-8 space-y-4 border-t-2 border-t-indigo-500/50 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="text-card-title text-foreground">3. Disconnected Tooling</h3>
                <p className="text-small text-muted-foreground">
                  Managing job search across spreadsheets, generic text editors, and random ChatGPT prompts creates chaos without systematic feedback loops.
                </p>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      {/* 4. THE SOLUTION SECTION (Story Chapter 3: The Career OS Engine) */}
      <section className="relative z-10 w-full section-padding border-t border-white/10 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto section-header-gap space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              The Career Intelligence Solution
            </div>
            <h2 className="text-section-title text-foreground">
              One Context-Aware Operating System
            </h2>
            <p className="text-muted-foreground text-body">
              SenseAI unifies your candidate profile into a single candidate graph that continuously syncs your resume, mock practice, and application tracking.
            </p>
          </div>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <StaggerItem className="glass-card glass-card-hover rounded-2xl p-6 md:p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono font-bold">
                  01
                </div>
                <h3 className="text-card-title text-foreground">Single Candidate Graph</h3>
                <p className="text-small text-muted-foreground">
                  Your target roles, technical skills, resume edits, and mock scores update a central state powering targeted AI recommendations.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem className="glass-card glass-card-hover rounded-2xl p-6 md:p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold">
                  02
                </div>
                <h3 className="text-card-title text-foreground">Real-Time Career Telemetry</h3>
                <p className="text-small text-muted-foreground">
                  Quantify your interview readiness and ATS resume match in real-time with your overall Career Health Score (CHS 0 - 100).
                </p>
              </div>
            </StaggerItem>

            <StaggerItem className="glass-card glass-card-hover rounded-2xl p-6 md:p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold">
                  03
                </div>
                <h3 className="text-card-title text-foreground">Zero-Downtime Fallback Engine</h3>
                <p className="text-small text-muted-foreground">
                  Engineered with deterministic template fallbacks ensuring 100% platform availability even during external AI API outages.
                </p>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      {/* 5. INTERACTIVE WORKSPACE SHOWCASE (Story Chapter 4: The Product AS Proof) */}
      <section id="demo-preview" className="relative z-10 w-full section-padding">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto section-header-gap space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Layers className="h-3.5 w-3.5" />
              Interactive Workspaces
            </div>
            <h2 className="text-section-title text-foreground">
              Explore the SenseAI Workspaces
            </h2>
            <p className="text-muted-foreground text-body">
              Click through the core engine workspaces to see candidate telemetry in action.
            </p>

            {/* Interactive Module Tabs - Centered, shared-layout sliding indicator */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {[
                { id: "ats", label: "📄 Resume Intelligence Engine" },
                { id: "interview", label: "🎙️ Mock Interview Workspace" },
                { id: "crm", label: "💼 Application Workspace CRM" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="workspace-tab-pill"
                      className="absolute inset-0 rounded-full bg-indigo-600 shadow-lg shadow-indigo-600/30"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Workspace Display Frame - Centered & Responsive */}
          <div className="max-w-5xl mx-auto glass-card rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait">
            {activeTab === "ats" && (
              <motion.div
                key="ats"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-card-title text-foreground">ATS Resume Parse Audit</h3>
                    <p className="text-xs text-muted-foreground">Target Role: Senior Software Engineer (Infrastructure)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-indigo-400">91 / 100</span>
                    <p className="text-[11px] text-emerald-400 font-medium">ATS Match: High</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                    <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Matched Keywords (12)
                    </h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">Distributed Systems</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">Kubernetes</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">Go / Rust</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">PostgreSQL</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                    <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <XCircle className="h-3.5 w-3.5" /> Missing Keyword Gaps (2)
                    </h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono">+ GraphQL Subscriptions</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono">+ Terraform IaC</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "interview" && (
              <motion.div
                key="interview"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-card-title text-foreground">WebRTC Technical Mock Interview</h3>
                    <p className="text-xs text-muted-foreground">Topic: System Design & Distributed Rate Limiter</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-cyan-400">82 / 100</span>
                    <p className="text-[11px] text-cyan-400 font-medium">Interview Ready</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>Speech Pace: 135 WPM (Optimal)</span>
                    <span>Clarity: 94%</span>
                  </div>
                  <p className="text-xs text-gray-300 italic bg-white/[0.02] p-3 rounded-lg border border-white/5">
                    &quot;AI Feedback: Strong architecture breakdown using Redis sliding logs. Consider detailing token bucket trade-offs for high concurrency.&quot;
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "crm" && (
              <motion.div
                key="crm"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-card-title text-foreground">Application Pipeline Workspace</h3>
                    <p className="text-xs text-muted-foreground">14 Active Applications • 3 Onsite Interviews</p>
                  </div>
                  <Link href="/dashboard">
                    <Button size="sm" className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs">
                      Open Full CRM →
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-muted-foreground">Applied</span>
                    <p className="text-sm font-bold text-foreground">Meta • Production Eng</p>
                    <p className="text-[11px] text-muted-foreground">Applied 2d ago</p>
                  </div>
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-indigo-300">Interviewing</span>
                    <p className="text-sm font-bold text-foreground">Stripe • Infra Lead</p>
                    <p className="text-[11px] text-indigo-400">Onsite Stage Next</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-emerald-300">Offer Stage</span>
                    <p className="text-sm font-bold text-foreground">OpenAI • Staff Eng</p>
                    <p className="text-[11px] text-emerald-400">Offer Evaluation</p>
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 6. CORE FEATURES GRID (Linear-Style Glass Cards) */}
      <section className="relative z-10 w-full section-padding border-t border-white/10 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto section-header-gap space-y-3">
            <h2 className="text-section-title text-foreground">
              Built for Engineering Excellence
            </h2>
            <p className="text-muted-foreground text-body">
              Comprehensive toolset engineered to maximize candidate callback rates.
            </p>
          </div>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {features.map((feature, index) => (
              <StaggerItem key={index} className="h-full">
                <div className="group glass-card glass-card-hover rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-4 h-full">
                  <div className="space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <h3 className="text-card-title text-foreground">{feature.title}</h3>
                    <p className="text-small text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* 7. HOW IT WORKS (Progressive 4-Step Process) */}
      <section className="relative z-10 w-full section-padding">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto section-header-gap space-y-3">
            <h2 className="text-section-title text-foreground">
              How SenseAI Accelerates Your Search
            </h2>
            <p className="text-muted-foreground text-body">
              Four structured steps turning candidate preparation into predictable offers.
            </p>
          </div>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {howItWorks.map((item, index) => (
              <StaggerItem key={index} className="h-full">
                <div className="group glass-card glass-card-hover rounded-2xl p-6 md:p-8 space-y-4 relative flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="text-caption font-mono text-indigo-400 font-bold">STEP 0{index + 1}</div>
                    <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-foreground transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <h3 className="text-card-title text-foreground">{item.title}</h3>
                    <p className="text-small text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* 8. CANDIDATE TRANSFORMATION TIMELINE (Outcome Chapter) */}
      <section className="relative z-10 w-full section-padding border-t border-white/10 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto section-header-gap space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Award className="h-3.5 w-3.5" /> Verified Candidate Milestones
            </div>
            <h2 className="text-section-title text-foreground">
              The Candidate Career Transformation
            </h2>
            <p className="text-muted-foreground text-body">
              From unorganized applications to multiple high-paying tech offers.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-white/10 space-y-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-1 p-4 rounded-xl bg-white/[0.02]">
                <span className="text-xs font-mono text-muted-foreground uppercase">Initial Baseline</span>
                <p className="text-2xl font-bold font-mono text-rose-400">CHS: 52 / 100</p>
                <p className="text-xs text-muted-foreground">0 Callbacks / 50 Applications</p>
              </div>
              <div className="space-y-1 p-4 rounded-xl bg-white/[0.02]">
                <span className="text-xs font-mono text-muted-foreground uppercase">After 14 Days</span>
                <p className="text-2xl font-bold font-mono text-amber-400">CHS: 71 / 100</p>
                <p className="text-xs text-muted-foreground">ATS Score 91% + Mock Practice</p>
              </div>
              <div className="space-y-1 p-4 rounded-xl bg-white/[0.02]">
                <span className="text-xs font-mono text-muted-foreground uppercase">Offer Phase</span>
                <p className="text-2xl font-bold font-mono text-emerald-400">CHS: 84 / 100</p>
                <p className="text-xs text-emerald-400 font-medium">3 Tech Offers Received</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS SECTION (Verified Candidate Feedback) */}
      <section className="relative z-10 w-full section-padding">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto section-header-gap space-y-3">
            <h2 className="text-section-title text-foreground">
              Candidate Feedback & Reviews
            </h2>
            <p className="text-muted-foreground text-body">
              See how students and engineering candidates land roles using SenseAI.
            </p>
          </div>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {testimonial.map((item, index) => (
              <StaggerItem key={index} className="h-full">
                <div className="glass-card glass-card-hover rounded-2xl p-6 md:p-8 space-y-4 flex flex-col justify-between h-full">
                  <p className="text-small text-gray-300 italic">
                    &quot;{item.quote}&quot;
                  </p>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-small font-bold text-foreground">{item.author}</p>
                      <p className="text-caption text-muted-foreground">{item.role} • <span className="text-indigo-400">{item.company}</span></p>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                      Verified
                    </Badge>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section className="relative z-10 w-full section-padding border-t border-white/10 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto section-header-gap space-y-3">
            <h2 className="text-section-title text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-body">
              Everything you need to know about SenseAI Career OS.
            </p>
          </div>

          <div className="max-w-3xl mx-auto glass-card rounded-2xl p-6 md:p-8 border border-white/10">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-white/10 px-2 py-1">
                  <AccordionTrigger className="text-left text-sm font-bold text-foreground hover:text-indigo-400 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-small text-muted-foreground pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA CONVERSION BANNER */}
      <section className="relative z-10 w-full section-padding">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="glass-card rounded-3xl p-10 md:p-16 text-center space-y-6 relative overflow-hidden border border-indigo-500/30">
              <div className="aurora-bg pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-600/25 via-purple-600/20 to-cyan-500/25 opacity-60" />
              <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[280px] w-[560px] rounded-full bg-indigo-500/30 blur-[120px] blob-float-a" />
              <h2 className="text-section-title text-foreground relative z-10">
                Ready to Accelerate Your Engineering Career?
              </h2>
              <p className="mx-auto max-w-2xl text-body text-muted-foreground relative z-10">
                Join software engineers optimizing their resumes, mock interviews, and application search with SenseAI.
              </p>
              <div className="pt-4 relative z-10">
                <Link href="/dashboard">
                  <Button size="lg" className="btn-shine rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-6 text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-105">
                    Launch Career OS Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
