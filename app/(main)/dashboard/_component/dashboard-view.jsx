"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
  FileText,
  PenBox,
  GraduationCap,
  Sparkles,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  Activity,
  ChevronRight,
  AlertCircle,
  Eye,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardView({ data }) {
  const { user, resume, assessments = [], coverLetters = [], insights } = data || {};
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate real Career Health Score (CHS) based on stored user data
  const hasIndustry = Boolean(user?.industry);
  const hasSkills = Boolean(user?.skills && user.skills.length > 0);
  const hasBio = Boolean(user?.bio);
  const profileScore = (hasIndustry ? 8 : 0) + (hasSkills ? 10 : 0) + (hasBio ? 7 : 0); // max 25

  const hasResume = Boolean(resume?.content);
  const atsScoreVal = typeof resume?.atsScore === "number" ? resume.atsScore : null;
  const resumeScore = hasResume ? 20 + (atsScoreVal ? Math.round(atsScoreVal * 0.15) : 5) : 0; // max 35

  const totalAssessments = assessments.length;
  const avgQuizScore = totalAssessments > 0
    ? Math.round(assessments.reduce((sum, a) => sum + (a.quizScore || 0), 0) / totalAssessments)
    : 0;
  const interviewScore = totalAssessments > 0 ? Math.min(30, 10 + Math.round(avgQuizScore * 0.2)) : 0; // max 30

  const totalCoverLetters = coverLetters.length;
  const applicationScore = totalCoverLetters > 0 ? Math.min(10, totalCoverLetters * 5) : 0; // max 10

  const totalCHS = Math.min(100, profileScore + resumeScore + interviewScore + applicationScore);

  const getCHSStatus = (score) => {
    if (score >= 85) return { label: "Exceptional", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" };
    if (score >= 70) return { label: "Interview Ready", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/30" };
    if (score >= 50) return { label: "Developing", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" };
    return { label: "Action Required", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/30" };
  };

  const chsStatus = getCHSStatus(totalCHS);

  // Generate dynamic contextual AI Recommendation
  const getAIRecommendation = () => {
    if (!hasResume) {
      return {
        title: "Resume Audit Required",
        description: "Your ATS resume profile is currently empty. Upload or generate your resume to calculate keyword match and ATS score.",
        actionLabel: "Build Resume",
        actionHref: "/resume",
        icon: FileText,
      };
    }
    if (totalAssessments === 0) {
      return {
        title: "Initial Mock Practice Needed",
        description: `Take your first 10-question ${user?.industry || "technical"} mock interview to benchmark your score and unlock detailed feedback.`,
        actionLabel: "Start Mock Interview",
        actionHref: "/interview/mock",
        icon: GraduationCap,
      };
    }
    if (insights?.topSkills && user?.skills) {
      const userSkillsSet = new Set(user.skills.map((s) => s.toLowerCase()));
      const missingTopSkill = insights.topSkills.find((s) => !userSkillsSet.has(s.toLowerCase()));
      if (missingTopSkill) {
        return {
          title: `Skill Opportunity Identified: ${missingTopSkill}`,
          description: `The ${user.industry} market frequently requires "${missingTopSkill}". Consider adding this skill or relevant projects to your resume.`,
          actionLabel: "Update Resume",
          actionHref: "/resume",
          icon: Sparkles,
        };
      }
    }
    return {
      title: "Maintain Interview Momentum",
      description: `Your average quiz score is ${avgQuizScore}%. Run another practice set to sharpen technical answers for your target role.`,
      actionLabel: "Take Quiz Set",
      actionHref: "/interview/mock",
      icon: GraduationCap,
    };
  };

  const recommendation = getAIRecommendation();
  const RecIcon = recommendation.icon;

  // Format industry salary data for Recharts in INR LPA
  const salaryData = (insights?.salaryRanges || []).map((range) => {
    const rawMin = range.min || 0;
    const rawMedian = range.median || 0;
    const rawMax = range.max || 0;
    const minLPA = rawMin > 500 ? Number((rawMin / 100000).toFixed(1)) : rawMin;
    const medianLPA = rawMedian > 500 ? Number((rawMedian / 100000).toFixed(1)) : rawMedian;
    const maxLPA = rawMax > 500 ? Number((rawMax / 100000).toFixed(1)) : rawMax;

    return {
      name: range.role,
      min: minLPA,
      median: medianLPA,
      max: maxLPA,
    };
  });

  // Build Recent Activity Feed from real database records
  const recentActivities = [
    ...assessments.map((a) => ({
      type: "assessment",
      title: `Completed ${a.category || "Technical"} Mock Interview`,
      detail: `Score: ${a.quizScore}% • ${a.questions?.length || 10} questions`,
      date: new Date(a.createdAt),
      icon: GraduationCap,
      iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    })),
    ...coverLetters.map((cl) => ({
      type: "coverLetter",
      title: `Generated Cover Letter for ${cl.jobTitle}`,
      detail: `Company: ${cl.companyName}`,
      date: new Date(cl.createdAt),
      icon: PenBox,
      iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    })),
    ...(resume?.updatedAt
      ? [
          {
            type: "resume",
            title: "Updated ATS Resume Profile",
            detail: resume.atsScore ? `ATS Score: ${resume.atsScore}/100` : "Resume content modified",
            date: new Date(resume.updatedAt),
            icon: FileText,
            iconColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
          },
        ]
      : []),
  ].sort((a, b) => b.date - a.date);

  const getMarketOutlookInfo = (outlook = "") => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-emerald-400" };
      case "negative":
        return { icon: TrendingDown, color: "text-rose-400" };
      default:
        return { icon: LineChart, color: "text-amber-400" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights?.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights?.marketOutlook).color;

  return (
    <div className="space-y-8">
      {/* 1. TOP HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-xs">
              SenseAI Command Center
            </Badge>
            {user?.industry && (
              <Badge variant="outline" className="border-white/10 text-muted-foreground text-xs">
                Domain: {user.industry}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight gradient-title">
            Candidate Telemetry & Operations
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Welcome back, {user?.name || "Engineer"}. Here is your live career health telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/demo">
            <Button size="sm" variant="outline" className="rounded-full border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-xs">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              View Demo Data
            </Button>
          </Link>
          <Link href="/resume">
            <Button size="sm" variant="outline" className="rounded-full border-white/15 bg-white/[0.03] hover:bg-white/10 text-xs">
              <FileText className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
              Resume Engine
            </Button>
          </Link>
          <Link href="/ai-cover-letter/new">
            <Button size="sm" variant="outline" className="rounded-full border-white/15 bg-white/[0.03] hover:bg-white/10 text-xs">
              <PenBox className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
              Cover Letter
            </Button>
          </Link>
          <Link href="/interview/mock">
            <Button size="sm" className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25">
              <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
              Mock Interview
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. CAREER HEALTH SCORE (CHS) HERO BANNER */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/15 shadow-2xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-[90px]" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-400" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Career Health Score (CHS)
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-extrabold font-mono text-foreground tracking-tight">
                {totalCHS}
              </span>
              <span className="text-base font-mono text-muted-foreground">/ 100</span>
              <Badge variant="outline" className={`ml-2 text-xs font-semibold px-2.5 py-0.5 border ${chsStatus.bg} ${chsStatus.color}`}>
                {chsStatus.label}
              </Badge>
            </div>
            <Progress value={totalCHS} className="h-2.5 bg-white/10" />
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground uppercase">Profile</span>
              <p className="text-base font-bold text-foreground">{profileScore} / 25</p>
              <p className="text-[10px] text-muted-foreground">{hasSkills ? `${user?.skills.length} skills set` : "Incomplete"}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground uppercase">Resume ATS</span>
              <p className="text-base font-bold text-foreground">{resumeScore} / 35</p>
              <p className="text-[10px] text-muted-foreground">{atsScoreVal ? `ATS Match: ${atsScoreVal}%` : hasResume ? "Resume saved" : "No resume"}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground uppercase">Interview Prep</span>
              <p className="text-base font-bold text-foreground">{interviewScore} / 30</p>
              <p className="text-[10px] text-muted-foreground">{totalAssessments > 0 ? `${avgQuizScore}% Avg Score` : "0 quizzes taken"}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground uppercase">Applications</span>
              <p className="text-base font-bold text-foreground">{applicationScore} / 10</p>
              <p className="text-[10px] text-muted-foreground">{totalCoverLetters > 0 ? `${totalCoverLetters} letters` : "0 applications"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC AI RECOMMENDATION TILE */}
      <div className="glass-card rounded-xl p-5 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-background to-background flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
            <RecIcon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
                AI Next Recommendation
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground">{recommendation.title}</h3>
            <p className="text-xs text-muted-foreground max-w-2xl">{recommendation.description}</p>
          </div>
        </div>
        <Link href={recommendation.actionHref} className="shrink-0">
          <Button size="sm" className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4">
            {recommendation.actionLabel} &rarr;
          </Button>
        </Link>
      </div>

      {/* 4. TELEMETRY METRIC CARDS (4 COLUMNS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Resume Tile */}
        <Card className="glass-card border border-white/10 hover:border-indigo-500/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Resume Intelligence
            </CardTitle>
            <FileText className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold font-mono text-foreground">
              {atsScoreVal ? `${atsScoreVal} / 100` : hasResume ? "Saved" : "Not Built"}
            </div>
            <p className="text-xs text-muted-foreground">
              {hasResume ? "ATS resume content configured" : "Upload or paste to audit ATS match"}
            </p>
            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <Link href="/resume" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-medium">
                Manage Resume <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Mock Interview Tile */}
        <Card className="glass-card border border-white/10 hover:border-cyan-500/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Interview Readiness
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold font-mono text-foreground">
              {totalAssessments > 0 ? `${avgQuizScore}%` : "No Attempts"}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalAssessments > 0 ? `${totalAssessments} assessment(s) completed` : "Take a technical quiz set to benchmark score"}
            </p>
            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <Link href="/interview" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium">
                View Interviews <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Applications Tile */}
        <Card className="glass-card border border-white/10 hover:border-purple-500/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cover Letters Generated
            </CardTitle>
            <PenBox className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold font-mono text-foreground">
              {totalCoverLetters}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalCoverLetters > 0 ? `Latest: ${coverLetters[0]?.companyName || "Application"}` : "Generate tailored cover letters"}
            </p>
            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <Link href="/ai-cover-letter" className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-medium">
                Cover Letters <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Industry Market Tile */}
        <Card className="glass-card border border-white/10 hover:border-emerald-500/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Market Demand
            </CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold font-mono text-foreground">
              {insights?.demandLevel || "High"}
            </div>
            <p className="text-xs text-muted-foreground">
              Growth: {insights?.growthRate ? `${insights.growthRate}%` : "12.5%"} • {insights?.marketOutlook || "Positive"} Outlook
            </p>
            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-[11px] text-muted-foreground">
                Updated {insights?.lastUpdated ? format(new Date(insights.lastUpdated), "MMM dd") : "recently"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. TABBED DETAILED WORKSPACE (OVERVIEW / MARKET INSIGHTS / ACTIVITY) */}
      <Tabs defaultValue="activity" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <TabsList className="bg-white/[0.04] border border-white/10 p-1 rounded-full">
            <TabsTrigger value="overview" className="rounded-full text-xs px-4">
              <Activity className="h-3.5 w-3.5 mr-1.5" />
              Telemetry Feed
            </TabsTrigger>
            <TabsTrigger value="industry" className="rounded-full text-xs px-4">
              <BriefcaseIcon className="h-3.5 w-3.5 mr-1.5" />
              Industry Salary & Trends
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: TELEMETRY & RECENT ACTIVITY */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Activity Timeline */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="glass-card border border-white/10">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-400" />
                    Recent Candidate Telemetry & Activity
                  </CardTitle>
                  <CardDescription>
                    Real-time log of your assessment scores, cover letters, and resume edits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivities.map((act, index) => {
                        const IconComponent = act.icon;
                        return (
                          <div key={index} className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                            <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${act.iconColor}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">{act.title}</p>
                              <p className="text-xs text-muted-foreground">{act.detail}</p>
                            </div>
                            <span className="text-[11px] text-muted-foreground shrink-0 font-mono">
                              {formatDistanceToNow(act.date, { addSuffix: true })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 text-center space-y-3">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-sm font-medium text-foreground">No recent telemetry recorded yet.</p>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Complete your resume audit or take your first mock interview to generate live activity events.
                      </p>
                      <div className="pt-2">
                        <Link href="/interview/mock">
                          <Button size="sm" className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs">
                            Start First Mock Interview
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Col: Candidate Profile & Skills Breakdown */}
            <div className="space-y-4">
              <Card className="glass-card border border-white/10">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Skill Telemetry Profile</CardTitle>
                  <CardDescription>Configured candidate skills & target domain</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-mono">Industry / Domain</span>
                    <p className="text-sm font-semibold text-foreground">{user?.industry || "Software Engineering"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-mono">Years Experience</span>
                    <p className="text-sm font-semibold text-foreground">{user?.experience ?? 0} years</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground uppercase font-mono">Skill Stack</span>
                    <div className="flex flex-wrap gap-1.5">
                      {user?.skills?.length ? (
                        user.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs bg-white/[0.04] border border-white/10 text-gray-200">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">No skills added yet.</p>
                      )}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <Link href="/onboarding">
                      <Button size="sm" variant="ghost" className="w-full text-xs text-indigo-400 hover:text-indigo-300">
                        Update Candidate Profile &rarr;
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: INDUSTRY SALARY & TRENDS */}
        <TabsContent value="industry" className="space-y-6">
          {/* Salary Ranges Chart */}
          <Card className="glass-card border border-white/10">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold">Salary Ranges by Role ({user?.industry || "Industry"})</CardTitle>
                  <CardDescription>
                    Displaying minimum, median, and maximum compensation benchmarks (in ₹ LPA)
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[11px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10 w-fit">
                  AI-Generated Intelligence
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[360px] w-full">
                {salaryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salaryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} unit=" LPA" />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-[#0f1117] border border-white/15 rounded-xl p-3 shadow-2xl space-y-1">
                                <p className="font-bold text-xs text-foreground">{label}</p>
                                {payload.map((item) => (
                                  <p key={item.name} className="text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground">{item.name}:</span> ₹{item.value} LPA
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="min" fill="#64748b" radius={[4, 4, 0, 0]} name="Min Salary" />
                      <Bar dataKey="median" fill="#818cf8" radius={[4, 4, 0, 0]} name="Median Salary" />
                      <Bar dataKey="max" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Max Salary" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full border border-dashed border-white/10 rounded-xl flex items-center justify-center text-xs text-muted-foreground p-4">
                    Salary benchmark data is being updated for your domain. Check back shortly.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Key Trends & Recommended Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="text-base font-bold">Key Market Trends</CardTitle>
                <CardDescription>Current trends shaping hiring decisions in {user?.industry}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-xs text-gray-300">
                  {(insights?.keyTrends || []).map((trend, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{trend}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="text-base font-bold">Recommended Skills for Upskilling</CardTitle>
                <CardDescription>High-demand technical skills to strengthen your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(insights?.recommendedSkills || []).map((skill) => (
                    <Badge key={skill} variant="outline" className="border-indigo-500/30 text-indigo-300 bg-indigo-500/10 text-xs py-1 px-3">
                      + {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
