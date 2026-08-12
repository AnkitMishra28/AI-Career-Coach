"use client";

import React from "react";

export default function HeroHeadline({
  titleMain = "The Operating System for",
  titleHighlight = "Software Engineering Careers",
  description = "Stop applying blindly. SenseAI measures your career health score, audits your resume, runs WebRTC mock interviews, and tracks applications—all in one context-aware system.",
}) {
  return (
    <div className="space-y-6 text-center max-w-5xl mx-auto">
      {/* Main Title */}
      <h1 className="text-hero text-foreground">
        {titleMain}{" "}
        <span className="block sm:inline-block mt-1 sm:mt-0 bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
          {titleHighlight}
        </span>
      </h1>

      {/* Subheadline Description */}
      <p className="mx-auto max-w-2xl text-body text-muted-foreground font-normal">
        {description}
      </p>
    </div>
  );
}
