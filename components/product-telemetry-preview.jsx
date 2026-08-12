"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Activity,
  FileText,
  Video,
  Briefcase,
  Target,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProductTelemetryPreview() {
  const [chsScore, setChsScore] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // Animated Count-Up Counter (0 -> 84)
  useEffect(() => {
    let start = 0;
    const end = 84;
    const duration = 1200; // ms
    const incrementTime = duration / end;

    const timer = setInterval(() => {
      start += 1;
      setChsScore(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, []);

  // Gentle Mouse Hover Tilt (max ±3°)
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3; // max ±3 deg
    const rotateY = ((x - centerX) / centerX) * 3;  // max ±3 deg

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 ? "transform 0.5s ease-out" : "none",
      }}
      className="relative mx-auto w-full max-w-5xl rounded-2xl border border-white/15 bg-card/70 p-2 md:p-3 shadow-[0_20px_50px_rgba(99,102,241,0.18)] backdrop-blur-xl transition-shadow duration-500 hover:border-indigo-500/40 hover:shadow-[0_25px_60px_rgba(99,102,241,0.25)]"
    >
      {/* Mac Window Titlebar Header */}
      <div className="flex items-center justify-between rounded-t-xl border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs font-mono text-muted-foreground hidden sm:inline-block">
            SenseAI Career OS — Telemetry Command Center
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono py-0.5 px-2"
          >
            Live Telemetry
          </Badge>
        </div>
      </div>

      {/* Main Preview Content Grid */}
      <div className="p-4 md:p-5 space-y-4 md:space-y-5">
        {/* Top 4 Core Product Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Card 1: Career Health Score */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.05]">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Career Health
              </span>
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-extrabold text-foreground font-mono">
                {chsScore}<span className="text-xs text-muted-foreground font-normal">/100</span>
              </span>
              <span className="text-xs font-medium text-emerald-400 flex items-center">
                +6% <TrendingUp className="h-3 w-3 ml-0.5" />
              </span>
            </div>
            <p className="text-[11px] text-emerald-400/90 mt-1 font-medium">
              Excellent Progress
            </p>
          </div>

          {/* Card 2: Resume Score */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.05]">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Resume Score
              </span>
              <FileText className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-extrabold text-foreground font-mono">
                91<span className="text-xs text-muted-foreground font-normal">/100</span>
              </span>
              <span className="text-xs font-medium text-indigo-400">
                ATS Ready
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Optimized for Target Roles
            </p>
          </div>

          {/* Card 3: Interview Readiness */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.05]">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Interview Prep
              </span>
              <Video className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-extrabold text-foreground font-mono">
                82<span className="text-xs text-muted-foreground font-normal">/100</span>
              </span>
              <span className="text-xs font-medium text-cyan-400">
                Interview Ready
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              System Design & Behavioral
            </p>
          </div>

          {/* Card 4: Active Applications */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.05]">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Applications
              </span>
              <Briefcase className="h-4 w-4 text-purple-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-extrabold text-foreground font-mono">
                14
              </span>
              <span className="text-xs font-medium text-purple-400">
                Active
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              3 Active Interviews
            </p>
          </div>
        </div>

        {/* Bottom Split Action & Recommendation Layer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Weekly Goal Progress Widget */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Weekly Goal
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-400 py-0.5">
                75% Complete
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Improve System Design
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000 ease-out" />
              </div>
            </div>
          </div>

          {/* Next AI Recommendation Widget */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/[0.05] p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  Next AI Recommendation
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-indigo-400" />
            </div>
            <p className="text-sm font-medium text-gray-200">
              Optimize resume for <span className="font-semibold text-indigo-300">Amazon SDE II</span> (Missing: Distributed Systems).
            </p>
          </div>
        </div>

        {/* Real-time Scrolling Activity Feed Ticker */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-2 truncate">
            <Clock className="h-3 w-3 text-indigo-400 flex-shrink-0" />
            <span className="truncate text-gray-300">
              Recent Activity: System Design Mock completed (Score 92%) • Resume ATS sync verified
            </span>
          </div>
          <span className="text-emerald-400 flex-shrink-0 font-medium hidden sm:inline-block">
            Synced 2m ago
          </span>
        </div>
      </div>
    </div>
  );
}
