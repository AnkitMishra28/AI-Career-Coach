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
  LineChart,
  Line,
} from "recharts";
import {
  Award,
  FileText,
  GraduationCap,
  PenBox,
  BriefcaseIcon,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Brain,
  Sliders,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  Activity,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MDEditor from "@uiw/react-md-editor";

const SAMPLE_SALARY_DATA = [
  { name: "Senior Software Eng", min: 12.0, median: 18.5, max: 32.0 },
  { name: "System Architect", min: 18.0, median: 28.0, max: 45.0 },
  { name: "DevOps / Infra Lead", min: 11.5, median: 16.5, max: 28.0 },
  { name: "Frontend Specialist", min: 8.5, median: 14.0, max: 22.0 },
  { name: "AI / ML Engineer", min: 14.0, median: 22.0, max: 38.0 },
];

const SAMPLE_PERFORMANCE_TREND = [
  { date: "Aug 01", score: 68 },
  { date: "Aug 03", score: 74 },
  { date: "Aug 05", score: 79 },
  { date: "Aug 07", score: 82 },
  { date: "Aug 08", score: 85 },
];

const SAMPLE_COVER_LETTER_MARKDOWN = `
August 8, 2026

Hiring Manager  
Stripe Infrastructure Engineering Team

Subject: Application for Staff Infrastructure Engineer (Demo Profile)

Dear Hiring Manager,

I am writing to express my strong interest in the Staff Infrastructure Engineer role at Stripe. With 6+ years of experience engineering high-throughput distributed systems and cloud infrastructure, I have led technical initiatives that improved service availability to 99.999% while optimizing cloud compute latency under peak workloads.

At my previous role, I architected a multi-region Redis caching topology that handled 45,000 requests per second, reducing database query volume by 62%. Additionally, I championed Kubernetes operator automations and CI/CD pipelines that reduced deployment lead times from hours to under 10 minutes.

I am particularly excited about Stripe's work in global financial infrastructure. Key capabilities I would bring to your team include:
- Deep expertise in Go, Distributed Consensus, and Cloud Architecture (AWS/Kubernetes)
- Proven ownership of mission-critical platform migrations with zero downtime
- Strong technical leadership, cross-functional alignment, and engineering mentorship

I look forward to discussing how my technical background aligns with Stripe's infrastructure goals.

Sincerely,  
Ankit Mishra (Sample Candidate)
`.trim();

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("telemetry");
  const [demoLetterContent, setDemoLetterContent] = useState(SAMPLE_COVER_LETTER_MARKDOWN);
  const [copied, setCopied] = useState(false);

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(demoLetterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div data-color-mode="dark" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 navbar-clearance mb-20 space-y-8">
      {/* HIGHLY VISIBLE DEMO BANNER */}
      <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/20 text-xs font-bold uppercase tracking-wider">
                Demo Mode — Sample Telemetry Data
              </Badge>
              <span className="text-xs text-amber-300 font-mono hidden sm:inline">• Read-Only Sandbox</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-foreground mt-1">
              SenseAI Career OS Interactive Experience Preview
            </h1>
            <p className="text-xs text-muted-foreground">
              Exploring sample telemetry data for a Senior Software Engineer candidate. No sign-in required & zero database mutations.
            </p>
          </div>
        </div>

        <Link href="/sign-up" className="shrink-0">
          <Button size="sm" className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 shadow-lg shadow-indigo-600/25">
            Launch Your Real Career OS <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* DEMO NAVIGATION TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/[0.04] border border-white/10 p-1.5 rounded-full flex flex-wrap justify-start gap-1">
          <TabsTrigger value="telemetry" className="rounded-full text-xs px-4">
            <Activity className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
            Command Center
          </TabsTrigger>
          <TabsTrigger value="resume" className="rounded-full text-xs px-4">
            <FileText className="h-3.5 w-3.5 mr-1.5 text-cyan-400" />
            Resume Intelligence ATS
          </TabsTrigger>
          <TabsTrigger value="interview" className="rounded-full text-xs px-4">
            <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
            Mock Interview Analytics
          </TabsTrigger>

          <TabsTrigger value="cover-letter" className="rounded-full text-xs px-4">
            <PenBox className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
            Cover Letter Generator
          </TabsTrigger>
          <TabsTrigger value="insights" className="rounded-full text-xs px-4">
            <BriefcaseIcon className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
            Industry Insights
          </TabsTrigger>
        </TabsList>

        {/* DEMO TAB 1: TELEMETRY COMMAND CENTER */}
        <TabsContent value="telemetry" className="space-y-6">
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/15 shadow-2xl relative overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-[90px]" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-400" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Sample Career Health Score (CHS)
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-extrabold font-mono text-foreground tracking-tight">84</span>
                  <span className="text-base font-mono text-muted-foreground">/ 100</span>
                  <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5 border text-indigo-400 bg-indigo-500/10 border-indigo-500/30">
                    Interview Ready
                  </Badge>
                </div>
                <Progress value={84} className="h-2.5 bg-white/10" />
              </div>

              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">Profile</span>
                  <p className="text-base font-bold text-foreground">25 / 25</p>
                  <p className="text-[10px] text-muted-foreground">8 core skills set</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">Resume ATS</span>
                  <p className="text-base font-bold text-indigo-400">91 / 100</p>
                  <p className="text-[10px] text-muted-foreground">ATS Match: High</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">Interview Prep</span>
                  <p className="text-base font-bold text-cyan-400">82 / 100</p>
                  <p className="text-[10px] text-muted-foreground">5 assessments completed</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">Applications</span>
                  <p className="text-base font-bold text-purple-400">14 Active</p>
                  <p className="text-[10px] text-muted-foreground">3 onsite invitations</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-card border border-white/10">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Resume Score</CardTitle>
                <FileText className="h-4 w-4 text-indigo-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-foreground">91 / 100</div>
                <p className="text-xs text-muted-foreground mt-1">Matched 12/14 target keywords</p>
              </CardContent>
            </Card>

            <Card className="glass-card border border-white/10">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Interview Readiness</CardTitle>
                <GraduationCap className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-foreground">82.5%</div>
                <p className="text-xs text-muted-foreground mt-1">50 questions practiced</p>
              </CardContent>
            </Card>

            <Card className="glass-card border border-white/10">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Applications</CardTitle>
                <PenBox className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-foreground">14 Active</div>
                <p className="text-xs text-muted-foreground mt-1">Latest: Stripe (Staff Eng)</p>
              </CardContent>
            </Card>

            <Card className="glass-card border border-white/10">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Demand Level</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-foreground">High Demand</div>
                <p className="text-xs text-emerald-400 mt-1">+16.5% Tech Growth Rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* DEMO TAB 2: RESUME INTELLIGENCE ATS */}
        <TabsContent value="resume" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card border border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-mono uppercase text-muted-foreground">ATS Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-indigo-400">91 / 100</div>
                <p className="text-xs text-emerald-400 mt-1">High ATS Pass Probability</p>
              </CardContent>
            </Card>

            <Card className="glass-card border border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Keyword Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-cyan-400">85% Match</div>
                <p className="text-xs text-muted-foreground mt-1">12 Matched • 3 Missing</p>
              </CardContent>
            </Card>

            <Card className="glass-card border border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Section Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-emerald-400">5 / 5 Sections</div>
                <p className="text-xs text-muted-foreground mt-1">Summary, Exp, Skills, Ed, Projects</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card border border-emerald-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Sample Matched Keywords (12)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Go", "Redis", "System Design", "Microservices", "REST APIs", "CI/CD", "Git"].map((kw) => (
                    <Badge key={kw} variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-xs">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border border-rose-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                  <XCircle className="h-4 w-4" /> Sample Missing Keyword Gaps (3)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {["Distributed Systems", "Docker", "AWS"].map((kw) => (
                    <Badge key={kw} variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/10 text-xs">
                      + {kw}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-cyan-400" />
                Sample Quantifiable Bullet Rewrite Suggestion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div>
                  <span className="text-[10px] font-mono text-rose-400 uppercase">Original Draft</span>
                  <p className="text-xs text-muted-foreground line-through">&quot;Worked on backend microservices and databases.&quot;</p>
                </div>
                <div className="pt-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">Suggested Rewrite</span>
                  <p className="text-xs font-semibold text-emerald-300">
                    &quot;Engineered high-throughput Node.js microservices and Redis caching layers, scaling database throughput by 62% under peak load.&quot;
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEMO TAB 3: MOCK INTERVIEW ANALYTICS */}
        <TabsContent value="interview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-card border border-white/10">
              <CardHeader className="pb-2"><CardTitle className="text-xs font-mono uppercase text-muted-foreground">Overall Score</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-bold font-mono text-indigo-400">82.5%</div></CardContent>
            </Card>
            <Card className="glass-card border border-white/10">
              <CardHeader className="pb-2"><CardTitle className="text-xs font-mono uppercase text-muted-foreground">Technical Score</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-bold font-mono text-cyan-400">85.0%</div></CardContent>
            </Card>
            <Card className="glass-card border border-white/10">
              <CardHeader className="pb-2"><CardTitle className="text-xs font-mono uppercase text-muted-foreground">System Design Score</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-bold font-mono text-purple-400">80.0%</div></CardContent>
            </Card>
            <Card className="glass-card border border-white/10">
              <CardHeader className="pb-2"><CardTitle className="text-xs font-mono uppercase text-muted-foreground">Behavioral Score</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-bold font-mono text-emerald-400">81.0%</div></CardContent>
            </Card>
          </div>

          <Card className="glass-card border border-white/10">
            <CardHeader>
              <CardTitle className="text-base font-bold">Sample Performance Trend Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SAMPLE_PERFORMANCE_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload?.length) {
                        return (
                          <div className="bg-[#0f1117] border border-white/15 rounded-xl p-2.5 text-xs">
                            <p className="font-bold text-foreground">Score: {payload[0].value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Line type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={2.5} dot={{ fill: "#818cf8", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEMO TAB 4: COVER LETTER GENERATOR */}
        <TabsContent value="cover-letter" className="space-y-4">
          <Card className="glass-card border border-white/10">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <PenBox className="h-4 w-4 text-purple-400" />
                  Sample Generated Cover Letter Preview
                </CardTitle>
                <CardDescription>
                  Editable markdown preview. Test editing or copying without saving to database.
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={handleCopyLetter} className="rounded-full border-white/15 text-xs">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                {copied ? "Copied" : "Copy Demo Letter"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border border-white/10 rounded-xl overflow-hidden glass-card">
                <MDEditor value={demoLetterContent} onChange={setDemoLetterContent} height={480} preview="edit" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEMO TAB 5: INDUSTRY INSIGHTS */}
        <TabsContent value="insights" className="space-y-6">
          <Card className="glass-card border border-white/10">
            <CardHeader>
              <CardTitle className="text-base font-bold">Sample Tech Industry Compensation Benchmarks</CardTitle>
              <CardDescription>Minimum, median, and maximum base compensation (in ₹ LPA)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SAMPLE_SALARY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} unit=" LPA" />
                    <Bar dataKey="min" fill="#64748b" name="Min Salary" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="median" fill="#818cf8" name="Median Salary" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="max" fill="#38bdf8" name="Max Salary" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
