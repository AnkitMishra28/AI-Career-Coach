"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#07080B] pt-20 pb-14 overflow-hidden">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[200px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-full border border-white/20 p-0.5 bg-white/10 flex items-center justify-center transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="SenseAI Logo"
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                SenseAI Career OS
              </span>
            </Link>
            <p className="text-small text-muted-foreground max-w-sm">
              The AI Career Operating System empowering software engineers to measure career health, audit ATS resumes, run WebRTC mock interviews, and track applications.
            </p>
            <div className="flex items-center gap-2 text-small text-emerald-400 font-mono pt-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>All Systems Operational • v2.0 Live</span>
            </div>
          </div>

          {/* Product Engine Links */}
          <div className="space-y-4">
            <h4 className="text-small font-bold uppercase tracking-wide text-foreground">
              Workspaces
            </h4>
            <ul className="space-y-2.5 text-small text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">
                  Telemetry Command Center
                </Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-indigo-400 transition-colors">
                  Resume Intelligence Engine
                </Link>
              </li>
              <li>
                <Link href="/interview" className="hover:text-indigo-400 transition-colors">
                  Mock Interview Workspace
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-indigo-400 transition-colors">
                  Career Health Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture Links */}
          <div className="space-y-4">
            <h4 className="text-small font-bold uppercase tracking-wide text-foreground">
              Architecture
            </h4>
            <ul className="space-y-2.5 text-small text-muted-foreground font-mono">
              <li className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                Next.js 15 App Router
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                Prisma & PostgreSQL
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                Google Gemini 2.0 Flash
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                Clerk Authentication
              </li>
            </ul>
          </div>

          {/* Developer Attribution Column */}
          <div className="space-y-4">
            <h4 className="text-small font-bold uppercase tracking-wide text-foreground">
              Engineering
            </h4>
            <div className="text-small text-muted-foreground space-y-1.5">
              <p className="text-muted-foreground">Designed & Engineered by</p>
              <p className="text-foreground font-semibold text-small">Ankit Mishra</p>
              <p className="text-caption text-indigo-400 font-medium">Software Engineering Intern</p>
              <p className="text-caption text-muted-foreground">IIIT Vadodara</p>
            </div>
            {/* Social Links: GitHub & LinkedIn ONLY */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/AnkitMishra28"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Profile"
                className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-muted-foreground hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:scale-105 transition-all duration-200"
                aria-label="GitHub Profile"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/ankit-mishra-189b38277/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-muted-foreground hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:scale-105 transition-all duration-200"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-small text-muted-foreground">
          <p>© {new Date().getFullYear()} SenseAI Career OS. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-4 w-4 text-rose-500 fill-rose-500" /> for SDE & Tech Professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}
