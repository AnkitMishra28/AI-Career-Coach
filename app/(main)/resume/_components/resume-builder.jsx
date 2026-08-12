"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
  Sparkles,
  CheckCircle2,
  XCircle,
  Target,
  Brain,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { saveResume, auditResumeWithAI } from "@/actions/resume";
import { WorkExperienceForm } from "./work-experience-form";
import { EducationForm } from "./education-form";
import { ProjectForm } from "./project-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import {
  workExperienceToMarkdown,
  educationToMarkdown,
  projectsToMarkdown,
  buildMarkdownFromStructured,
  parseResumeContent,
  stringifyResumeData,
  getResumeMarkdown,
  sanitizeAndCleanResumeData,
} from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ResumeBuilder({ initialResume }) {
  const { user } = useUser();
  const initialFeedback = initialResume?.feedback ? JSON.parse(initialResume.feedback) : null;
  const isInitialHydrated = useRef(false);

  // Parse structured data from initialResume content if present
  const parsedInitial = useMemo(
    () => parseResumeContent(initialResume?.content),
    [initialResume?.content]
  );

  const [activeTab, setActiveTab] = useState(initialFeedback ? "audit" : "edit");
  const [previewContent, setPreviewContent] = useState(parsedInitial.markdown || "");
  const [resumeMode, setResumeMode] = useState("preview");
  const [targetJobTitle, setTargetJobTitle] = useState("Software Engineer");
  const [targetJobDescription, setTargetJobDescription] = useState("");
  const [auditResult, setAuditResult] = useState(initialFeedback);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const defaultFormValues = useMemo(() => {
    if (parsedInitial.structured) {
      return {
        contactInfo: {
          email: parsedInitial.structured.contactInfo?.email || user?.primaryEmailAddress?.emailAddress || "",
          mobile: parsedInitial.structured.contactInfo?.mobile || "",
          linkedin: parsedInitial.structured.contactInfo?.linkedin || "",
          twitter: parsedInitial.structured.contactInfo?.twitter || "",
        },
        summary: parsedInitial.structured.summary || "",
        skills: parsedInitial.structured.skills || "",
        experience: parsedInitial.structured.experience || [],
        education: parsedInitial.structured.education || [],
        projects: parsedInitial.structured.projects || [],
      };
    }
    return {
      contactInfo: {
        email: user?.primaryEmailAddress?.emailAddress || "",
        mobile: "",
        linkedin: "",
        twitter: "",
      },
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    };
  }, [parsedInitial.structured, user]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    shouldUnregister: false, // CRITICAL: Prevent react-hook-form from dropping state on tab switch
    defaultValues: defaultFormValues,
  });

  // Re-hydrate form state ONLY ONCE when initial resume loads from DB
  useEffect(() => {
    if (!isInitialHydrated.current && parsedInitial.structured) {
      isInitialHydrated.current = true;
      reset({
        contactInfo: {
          email: parsedInitial.structured.contactInfo?.email || user?.primaryEmailAddress?.emailAddress || "",
          mobile: parsedInitial.structured.contactInfo?.mobile || "",
          linkedin: parsedInitial.structured.contactInfo?.linkedin || "",
          twitter: parsedInitial.structured.contactInfo?.twitter || "",
        },
        summary: parsedInitial.structured.summary || "",
        skills: parsedInitial.structured.skills || "",
        experience: parsedInitial.structured.experience || [],
        education: parsedInitial.structured.education || [],
        projects: parsedInitial.structured.projects || [],
      });
    }
  }, [parsedInitial.structured, reset, user]);

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const formValues = watch();

  // Sanitize structured data for clean single-source-of-truth PDF export
  const cleanData = useMemo(() => sanitizeAndCleanResumeData(formValues), [formValues]);

  // Update markdown preview dynamically when structured values change
  useEffect(() => {
    const name = user?.fullName || user?.name || "Candidate";
    const generated = buildMarkdownFromStructured(formValues, name);
    if (generated) {
      setPreviewContent(generated);
    }
  }, [formValues, user]);

  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const generatePDF = async () => {
    if (typeof window === "undefined") return;
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf-container");
      if (!element) {
        toast.error("Resume content not ready for PDF export.");
        return;
      }

      const html2pdfModule = await import("html2pdf.js/dist/html2pdf.min.js");
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const candidateName = user?.fullName || user?.name || "Resume";
      const filename = `${candidateName.replace(/\s+/g, "_")}_ATS.pdf`;

      const opt = {
        margin: [8, 10, 8, 10], // 8mm top/bottom (~0.31in), 10mm left/right (~0.39in)
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 800 },
        jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"], avoid: [".pdf-entry-block", "h2"] },
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("ATS Resume PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderSectionHeading = (title) => (
    <div
      className="pdf-section-heading"
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        marginTop: "5px",
        marginBottom: "3px",
        lineHeight: "1",
        pageBreakAfter: "avoid",
        breakAfter: "avoid",
      }}
    >
      <span
        className="pdf-section-heading-text"
        style={{
          flex: "0 0 auto",
          fontSize: "9.5pt",
          fontWeight: "700",
          textTransform: "uppercase",
          color: "#000000",
          letterSpacing: "0.5px",
          lineHeight: "1",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </span>
      <span
        className="pdf-section-heading-rule"
        style={{
          flex: "1 1 auto",
          height: "0.75px",
          backgroundColor: "#111111",
          marginLeft: "6px",
          marginTop: "2px",
        }}
      />
    </div>
  );

  const renderFormattedBullets = (descStr) => {
    if (!descStr) return null;
    const bullets = descStr
      .split("\n")
      .map((b) => b.replace(/^[-*•]\s*/, "").trim())
      .filter(Boolean);

    if (bullets.length === 0) return null;

    return (
      <ul
        style={{
          margin: "1px 0 2px 0",
          paddingLeft: "15px",
          listStyleType: "disc",
        }}
      >
        {bullets.map((bullet, i) => (
          <li
            key={i}
            style={{
              fontSize: "8.5pt",
              lineHeight: "1.16",
              color: "#111111",
              margin: "0.5px 0",
              padding: "0",
            }}
          >
            {bullet}
          </li>
        ))}
      </ul>
    );
  };

  const renderFormattedSkills = (skillsStr) => {
    if (!skillsStr) return null;
    const lines = skillsStr.split("\n").filter((l) => l.trim());
    const isCategorized = lines.some((l) => l.includes(":"));

    if (isCategorized) {
      return (
        <div style={{ fontSize: "8.5pt", lineHeight: "1.2", color: "#111111", margin: "1px 0" }}>
          {lines.map((line, idx) => {
            const colonIdx = line.indexOf(":");
            if (colonIdx !== -1) {
              const category = line.substring(0, colonIdx).trim();
              const items = line.substring(colonIdx + 1).trim();
              return (
                <div key={idx} style={{ margin: "0.5px 0" }}>
                  <span style={{ fontWeight: "700", color: "#000000" }}>{category}: </span>
                  <span>{items}</span>
                </div>
              );
            }
            return (
              <div key={idx} style={{ margin: "0.5px 0" }}>
                {line}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div style={{ fontSize: "8.5pt", lineHeight: "1.2", color: "#111111", margin: "1px 0" }}>
        {skillsStr}
      </div>
    );
  };

  const onSubmit = async () => {
    try {
      const fullContentToSave = stringifyResumeData(formValues, previewContent);
      await saveResumeFn(fullContentToSave);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleRunAudit = async () => {
    const contentToAudit = previewContent || getResumeMarkdown(initialResume?.content);
    if (!contentToAudit) {
      toast.error("Please add content to your resume before running the ATS audit.");
      return;
    }

    setIsAuditing(true);
    try {
      const result = await auditResumeWithAI({
        resumeContent: contentToAudit,
        jobTitle: targetJobTitle,
        jobDescription: targetJobDescription,
      });
      setAuditResult(result);
      setActiveTab("audit");
      toast.success("ATS Resume Audit complete!");
    } catch (err) {
      console.error("Audit error:", err);
      toast.error("Failed to run ATS audit.");
    } finally {
      setIsAuditing(false);
    }
  };

  const candidateName = user?.fullName || user?.name || "Candidate Name";

  return (
    <div data-color-mode="dark" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-xs">
              SenseAI Resume OS
            </Badge>
            {auditResult?.atsScore && (
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-xs">
                ATS Score: {auditResult.atsScore}/100
              </Badge>
            )}
          </div>
          <h1 className="page-title">Resume Intelligence Engine</h1>
          <p className="text-xs text-muted-foreground">
            Audit keyword coverage against job descriptions, build structured ATS resumes, and export clean PDFs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="rounded-full border-white/15 bg-white/[0.03] text-xs"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save Resume
              </>
            )}
          </Button>

          <Button
            size="sm"
            onClick={generatePDF}
            disabled={isGenerating}
            className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Primary Workspace Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/[0.04] border border-white/10 p-1 rounded-full">
          <TabsTrigger value="audit" className="rounded-full text-xs px-4">
            <Brain className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
            ATS Audit & Keyword Intelligence
          </TabsTrigger>
          <TabsTrigger value="edit" className="rounded-full text-xs px-4">
            <Edit className="h-3.5 w-3.5 mr-1.5 text-cyan-400" />
            Structured Section Builder
          </TabsTrigger>
          <TabsTrigger value="preview" className="rounded-full text-xs px-4">
            <Monitor className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
            Live Markdown & PDF
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ATS AUDIT & KEYWORD INTELLIGENCE */}
        <TabsContent value="audit" className="space-y-6">
          <Card className="glass-card border border-indigo-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-400" />
                Configure Target Role & Job Description
              </CardTitle>
              <CardDescription>
                Provide the role title and requirements you are targeting to measure exact ATS keyword match.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase">Target Job Title</label>
                  <Input
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="mt-1 bg-white/[0.02]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Job Description / Requirements (Optional)</label>
                  <Textarea
                    value={targetJobDescription}
                    onChange={(e) => setTargetJobDescription(e.target.value)}
                    placeholder="Paste key technical requirements from the target job posting to extract matched and missing keywords..."
                    className="mt-1 h-20 bg-white/[0.02] text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-6 shadow-md shadow-indigo-600/25"
                >
                  {isAuditing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Resume Keywords & Parsing ATS...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Run ATS Resume Audit
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AUDIT RESULTS DISPLAY */}
          {auditResult ? (
            <div className="space-y-6">
              {/* Score Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-card border border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-mono text-muted-foreground uppercase">Overall ATS Score</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="text-3xl font-extrabold font-mono text-indigo-400">
                      {auditResult.atsScore} / 100
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {auditResult.isBaseline ? "Baseline ATS Readiness" : auditResult.atsScore >= 80 ? "High ATS Pass Rate" : "Needs Keyword Optimization"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card border border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-mono text-muted-foreground uppercase">Keyword Match</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="text-3xl font-extrabold font-mono text-cyan-400">
                      {auditResult.keywordMatchScore !== null ? `${auditResult.keywordMatchScore}%` : "N/A (Provide JD)"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {auditResult.isBaseline ? "Provide JD for match %" : "Compared to target job posting"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card border border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-mono text-muted-foreground uppercase">Section Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="text-3xl font-extrabold font-mono text-emerald-400">
                      {Object.values(auditResult.sectionHealth || {}).filter(Boolean).length} / 5
                    </div>
                    <p className="text-xs text-muted-foreground">Core structural sections present</p>
                  </CardContent>
                </Card>
              </div>

              {/* Matched vs Missing Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass-card border border-emerald-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Matched Keywords ({auditResult.matchedKeywords?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {auditResult.matchedKeywords?.length ? (
                        auditResult.matchedKeywords.map((kw) => (
                          <Badge key={kw} variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-xs">
                            {kw}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">No matched technical keywords found.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border border-rose-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                      <XCircle className="h-4 w-4" /> Missing Keyword Gaps ({auditResult.missingKeywords?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {auditResult.missingKeywords?.length ? (
                        auditResult.missingKeywords.map((kw) => (
                          <Badge key={kw} variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/10 text-xs">
                            + {kw}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-emerald-400">Great coverage! No missing keyword gaps detected.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actionable Recommendations */}
              <Card className="glass-card border border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    Actionable Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs text-gray-300">
                    {(auditResult.recommendations || []).map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Specific Bullet Rewrite Suggestions */}
              {auditResult.rewriteSuggestions?.length > 0 && (
                <Card className="glass-card border border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-cyan-400" />
                      Quantifiable Bullet Rewrite Suggestions
                    </CardTitle>
                    <CardDescription>
                      Transform generic responsibilities into high-impact, measurable achievements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {auditResult.rewriteSuggestions.map((sug, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-rose-400 uppercase">Original</span>
                          <p className="text-xs text-muted-foreground line-through">&quot;{sug.original}&quot;</p>
                        </div>
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-mono text-emerald-400 uppercase">Suggested Rewrite</span>
                          <p className="text-xs font-semibold text-emerald-300">&quot;{sug.suggested}&quot;</p>
                        </div>
                        <p className="text-[11px] text-muted-foreground italic pt-1 border-t border-white/5">
                          Rationale: {sug.reason}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="glass-card border border-white/10 text-center py-12">
              <CardContent className="space-y-3">
                <Brain className="h-10 w-10 text-indigo-400 mx-auto" />
                <h3 className="text-base font-bold text-foreground">No ATS Audit Run Yet</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Configure your target job title above and click &quot;Run ATS Resume Audit&quot; to parse your resume and generate a detailed keyword match report.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB 2: STRUCTURED SECTION BUILDER */}
        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-white/10 rounded-xl bg-white/[0.02]">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Email Address</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your.email@example.com"
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-xs text-rose-400">{errors.contactInfo.email.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Mobile Phone</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">LinkedIn Profile URL</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Twitter / X Profile URL</label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-foreground">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32 text-xs"
                    placeholder="Write a concise, high-impact overview of your technical experience, target domain, and core achievements..."
                  />
                )}
              />
            </div>

            {/* Technical Skills */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-foreground">Technical & Professional Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-28 text-xs"
                    placeholder="e.g. React, Next.js, TypeScript, Node.js, PostgreSQL, Docker, AWS, System Design, REST APIs..."
                  />
                )}
              />
            </div>

            {/* Work Experience */}
            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <WorkExperienceForm
                  entries={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Education */}
            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <EducationForm
                  entries={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Technical Projects */}
            <Controller
              name="projects"
              control={control}
              render={({ field }) => (
                <ProjectForm
                  entries={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />
          </form>
        </TabsContent>

        {/* TAB 3: LIVE MARKDOWN & CLEAN ATS PDF EXPORT */}
        <TabsContent value="preview" className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              type="button"
              size="sm"
              className="rounded-full text-xs border-white/10"
              onClick={() => setResumeMode(resumeMode === "preview" ? "edit" : "preview")}
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                  Edit Raw Markdown
                </>
              ) : (
                <>
                  <Monitor className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                  Show Preview Mode
                </>
              )}
            </Button>

            <Button
              size="sm"
              onClick={generatePDF}
              disabled={isGenerating}
              className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download PDF Document
                </>
              )}
            </Button>
          </div>

          <div className="border border-white/10 rounded-xl overflow-hidden glass-card">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={700}
              preview={resumeMode}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Off-screen LaTeX-style ATS Resume PDF Template (Single Source of Truth) */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "195mm",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          id="resume-pdf-container"
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
            fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
            padding: "0mm",
            margin: "0mm",
            boxSizing: "border-box",
            width: "100%",
            fontSize: "8.5pt",
            lineHeight: "1.16",
            letterSpacing: "normal",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "4px",
              marginTop: "0px",
              paddingTop: "0px",
            }}
          >
            <h1
              style={{
                fontSize: "17pt",
                fontWeight: "800",
                textTransform: "uppercase",
                margin: "0 0 2px 0",
                padding: "0",
                color: "#000000",
                letterSpacing: "0.5px",
                lineHeight: "1",
              }}
            >
              {candidateName}
            </h1>
            <div
              style={{
                fontSize: "8.5pt",
                color: "#222222",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
                lineHeight: "1.15",
                margin: "0",
                padding: "0",
              }}
            >
              {cleanData?.contactInfo?.email && <span>{cleanData.contactInfo.email}</span>}
              {cleanData?.contactInfo?.mobile && (
                <span>{cleanData?.contactInfo?.email ? " | " : ""}{cleanData.contactInfo.mobile}</span>
              )}
              {cleanData?.contactInfo?.linkedin && (
                <span>
                  {(cleanData?.contactInfo?.email || cleanData?.contactInfo?.mobile) ? " | " : ""}
                  <a
                    href={cleanData.contactInfo.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#1d4ed8", textDecoration: "none", fontWeight: "500" }}
                  >
                    LinkedIn
                  </a>
                </span>
              )}
              {cleanData?.contactInfo?.twitter && (
                <span>
                  {(cleanData?.contactInfo?.email || cleanData?.contactInfo?.mobile || cleanData?.contactInfo?.linkedin) ? " | " : ""}
                  <a
                    href={cleanData.contactInfo.twitter}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#1d4ed8", textDecoration: "none", fontWeight: "500" }}
                  >
                    Twitter/X
                  </a>
                </span>
              )}
            </div>
          </div>

          {/* PROFESSIONAL SUMMARY */}
          {cleanData?.summary && (
            <div className="pdf-entry-block" style={{ marginBottom: "4px" }}>
              {renderSectionHeading("Professional Summary")}
              <p style={{ margin: "0", fontSize: "8.5pt", lineHeight: "1.18", color: "#111111" }}>
                {cleanData.summary}
              </p>
            </div>
          )}

          {/* TECHNICAL SKILLS */}
          {cleanData?.skills && (
            <div className="pdf-entry-block" style={{ marginBottom: "4px" }}>
              {renderSectionHeading("Technical Skills")}
              {renderFormattedSkills(cleanData.skills)}
            </div>
          )}

          {/* WORK EXPERIENCE */}
          {cleanData?.experience?.length > 0 && (
            <div className="pdf-entry-block" style={{ marginBottom: "4px" }}>
              {renderSectionHeading("Work Experience")}
              {cleanData.experience.map((item, idx) => (
                <div key={idx} style={{ marginBottom: "4px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      margin: "0 0 1px 0",
                    }}
                  >
                    <span style={{ fontSize: "9pt", fontWeight: "700", color: "#000000" }}>
                      {item.jobTitle || "Role"}{" "}
                      <span style={{ fontWeight: "600", color: "#222222" }}>— {item.company || "Company"}</span>
                    </span>
                    <span style={{ fontSize: "8.5pt", fontWeight: "600", color: "#333333", whitespace: "nowrap" }}>
                      {item.location ? `${item.location} | ` : ""}
                      {item.startDate}{item.endDate || item.current ? ` – ${item.current ? "Present" : item.endDate}` : ""}
                    </span>
                  </div>
                  {renderFormattedBullets(item.description)}
                </div>
              ))}
            </div>
          )}

          {/* EDUCATION */}
          {cleanData?.education?.length > 0 && (
            <div className="pdf-entry-block" style={{ marginBottom: "4px" }}>
              {renderSectionHeading("Education")}
              {cleanData.education.map((item, idx) => (
                <div key={idx} style={{ marginBottom: "3px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      margin: "0 0 1px 0",
                    }}
                  >
                    <span style={{ fontSize: "9pt", fontWeight: "700", color: "#000000" }}>
                      {item.degree || "Degree"}{item.fieldOfStudy ? ` in ${item.fieldOfStudy}` : ""}{" "}
                      <span style={{ fontWeight: "600", color: "#222222" }}>— {item.institution || "Institution"}</span>
                    </span>
                    <span style={{ fontSize: "8.5pt", fontWeight: "600", color: "#333333", whitespace: "nowrap" }}>
                      {item.startDate}{item.endDate || item.current ? ` – ${item.current ? "Present" : item.endDate}` : ""}
                    </span>
                  </div>
                  {item.grade && (
                    <div style={{ fontSize: "8.5pt", color: "#222222", margin: "0.5px 0" }}>
                      <span style={{ fontWeight: "600" }}>Grade / CGPA:</span> {item.grade}
                    </div>
                  )}
                  {item.coursework && (
                    <div style={{ fontSize: "8.5pt", color: "#222222", margin: "0.5px 0" }}>
                      <span style={{ fontWeight: "600" }}>Relevant Coursework:</span> {item.coursework}
                    </div>
                  )}
                  {item.activities && (
                    <div style={{ fontSize: "8.5pt", color: "#222222", margin: "0.5px 0" }}>
                      <span style={{ fontWeight: "600" }}>Activities & Honors:</span> {item.activities}
                    </div>
                  )}
                  {item.description && renderFormattedBullets(item.description)}
                </div>
              ))}
            </div>
          )}

          {/* TECHNICAL PROJECTS */}
          {cleanData?.projects?.length > 0 && (
            <div className="pdf-entry-block" style={{ marginBottom: "4px" }}>
              {renderSectionHeading("Technical Projects")}
              {cleanData.projects.map((item, idx) => {
                const links = [];
                if (item.projectUrl) links.push({ label: "Live Demo", url: item.projectUrl });
                if (item.githubUrl) links.push({ label: "GitHub", url: item.githubUrl });

                return (
                  <div key={idx} style={{ marginBottom: "4px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        margin: "0 0 1px 0",
                      }}
                    >
                      <span style={{ fontSize: "9pt", fontWeight: "700", color: "#000000" }}>
                        {item.projectName || "Project"}{" "}
                        {item.technologies ? (
                          <span style={{ fontWeight: "400", color: "#333333", fontSize: "8.5pt" }}>
                            ({item.technologies})
                          </span>
                        ) : null}
                      </span>
                      {links.length > 0 && (
                        <span style={{ fontSize: "8.5pt", color: "#1d4ed8", whitespace: "nowrap" }}>
                          {links.map((link, lIdx) => (
                            <React.Fragment key={lIdx}>
                              {lIdx > 0 && <span style={{ color: "#555555", margin: "0 3px" }}>|</span>}
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#1d4ed8", textDecoration: "none", fontWeight: "500" }}
                              >
                                {link.label}
                              </a>
                            </React.Fragment>
                          ))}
                        </span>
                      )}
                    </div>
                    {item.role && (
                      <div style={{ fontSize: "8.5pt", fontWeight: "600", color: "#222222", margin: "0.5px 0" }}>
                        Role: {item.role}
                      </div>
                    )}
                    {renderFormattedBullets(item.description)}
                    {item.achievements && (
                      <div style={{ fontSize: "8.5pt", fontStyle: "italic", color: "#333333", margin: "1px 0 0 0" }}>
                        Key Outcomes: {item.achievements}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
