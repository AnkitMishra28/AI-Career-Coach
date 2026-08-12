"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";

export default function HeroCTA() {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Button Group */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button
            size="lg"
            className="btn-shine w-full sm:w-auto rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-6 text-base shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/35 active:scale-[0.98]"
          >
            Launch Career OS
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>

        <Link href="/demo" className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto rounded-full border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-foreground font-semibold px-7 py-6 text-base backdrop-blur-md transition-all duration-300 hover:border-white/25 active:scale-[0.98]"
          >
            <Play className="mr-2 h-4 w-4 fill-current text-indigo-400" />
            Explore Live Demo
          </Button>
        </Link>
      </div>

      {/* Recruiter Microcopy Telemetry */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          100% Free for Job Seekers
        </span>
        <span className="hidden sm:inline-block text-white/20">•</span>
        <span className="hidden sm:flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
          Powered by Next.js 15 & Gemini 2.0
        </span>
      </div>
    </div>
  );
}
