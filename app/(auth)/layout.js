"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, TrendingUp, FileCheck2, Users } from "lucide-react";

const floatChip = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay },
});

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#07080B] flex flex-col items-center justify-center navbar-clearance pb-12 px-4 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="grid-background"></div>

      {/* Ambient Lighting Glow - slow floating blobs, consistent with the landing hero */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-gradient-to-tr from-indigo-600/25 via-purple-600/15 to-cyan-500/10 blur-[140px] opacity-70 blob-float-a" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/3 h-[300px] w-[420px] rounded-full bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-transparent blur-[120px] opacity-50 blob-float-b" />

      {/* Navigation Header Link */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 mb-8 flex flex-col items-center gap-3"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-md transition-all hover:bg-white/10 hover:text-white hover:-translate-x-0.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to SenseAI Home
        </Link>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full border border-white/20 p-0.5 bg-white/10 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="SenseAI Logo"
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            SenseAI Career OS
          </span>
        </div>
      </motion.div>

      {/* Card + Atmosphere Row - floating proof chips flank the card on wide screens */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-center gap-10">
        {/* Left floating chips (desktop only) */}
        <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0">
          <motion.div
            {...floatChip(0.25)}
            className="glass-card rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-small font-bold text-foreground">Career Health: 84/100</p>
              <p className="text-caption text-muted-foreground">Top 12% of candidates</p>
            </div>
          </motion.div>

          <motion.div
            {...floatChip(0.45)}
            className="glass-card rounded-2xl p-4 space-y-2"
          >
            <p className="text-caption text-gray-300 italic leading-relaxed">
              &quot;Landed 3 offers in 14 days using SenseAI&apos;s mock interviews.&quot;
            </p>
            <p className="text-caption text-indigo-400 font-medium">— SDE Candidate, Verified</p>
          </motion.div>
        </div>

        {/* Clerk Form Container Wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-card/70 p-6 shadow-2xl backdrop-blur-xl"
        >
          {children}
        </motion.div>

        {/* Right floating chip (desktop only) */}
        <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0">
          <motion.div
            {...floatChip(0.35)}
            className="glass-card rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <FileCheck2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-small font-bold text-foreground">Resume ATS Match: 91%</p>
              <p className="text-caption text-muted-foreground">Optimized for target roles</p>
            </div>
          </motion.div>

          <motion.div
            {...floatChip(0.55)}
            className="glass-card rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-small font-bold text-foreground">Built for SDEs</p>
              <p className="text-caption text-muted-foreground">Free for job seekers</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="relative z-10 mt-8 text-center text-xs text-muted-foreground flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
        <span>Secure authentication powered by Clerk & SenseAI Engine</span>
      </div>
    </div>
  );
};

export default AuthLayout;
