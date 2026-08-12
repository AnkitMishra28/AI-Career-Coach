"use client";

import React from "react";
import { motion } from "framer-motion";
import AnnouncementBadge from "@/components/ui/announcement-badge";
import HeroHeadline from "@/components/hero-headline";
import HeroCTA from "@/components/hero-cta";
import ProductTelemetryPreview from "@/components/product-telemetry-preview";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
};

const HeroSection = () => {
  return (
    <section className="relative w-full navbar-clearance pb-16 lg:pb-24 overflow-hidden">
      {/* Ambient Radial Gradient Background Light Glow - slow floating blobs for depth */}
      <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 h-[350px] w-[600px] md:h-[450px] md:w-[900px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 blur-[130px] opacity-75 blob-float-a" />
      <div className="pointer-events-none absolute top-32 left-1/3 h-[280px] w-[420px] rounded-full bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-transparent blur-[110px] opacity-60 blob-float-b" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 space-y-6 md:space-y-8"
      >
        {/* Top Announcement Badge */}
        <motion.div variants={item} className="flex justify-center">
          <AnnouncementBadge
            badgeText="SenseAI v2.0 Live"
            announcementText="Introducing the AI Career Operating System"
            href="/dashboard"
          />
        </motion.div>

        {/* Main Title & Subheadline */}
        <motion.div variants={item}>
          <HeroHeadline
            titleMain="The Operating System for"
            titleHighlight="Software Engineering Careers"
            description="Stop applying blindly. SenseAI measures your career health score, audits your resume, runs WebRTC mock interviews, and tracks applications—all in one context-aware system."
          />
        </motion.div>

        {/* Action Button Group & Microcopy */}
        <motion.div variants={item}>
          <HeroCTA />
        </motion.div>

        {/* Product OS Telemetry Frame Preview */}
        <motion.div
          variants={item}
          className="pt-10 md:pt-14"
        >
          <ProductTelemetryPreview />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
