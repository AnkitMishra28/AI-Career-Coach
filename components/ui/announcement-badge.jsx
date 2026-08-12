"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function AnnouncementBadge({
  badgeText = "SenseAI v2.0 Live",
  announcementText = "Introducing the AI Career Operating System",
  href = "/dashboard",
}) {
  return (
    <div className="inline-flex items-center transition-all duration-500">
      <Link
        href={href}
        className="group relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs md:text-sm text-muted-foreground backdrop-blur-md transition-all duration-300 hover:border-indigo-500/40 hover:bg-white/[0.07] hover:text-foreground hover:shadow-lg hover:shadow-indigo-500/10"
      >
        {/* Pulsing Status Indicator */}
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>

        {/* Badge Highlight */}
        <span className="flex items-center gap-1 font-semibold text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" />
          {badgeText}
        </span>

        <span className="hidden sm:inline-block text-white/20">•</span>

        {/* Announcement Text */}
        <span className="truncate max-w-[200px] sm:max-w-none text-gray-300">
          {announcementText}
        </span>

        {/* Arrow Chevron */}
        <ArrowRight className="h-3.5 w-3.5 text-gray-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-indigo-400" />
      </Link>
    </div>
  );
}
