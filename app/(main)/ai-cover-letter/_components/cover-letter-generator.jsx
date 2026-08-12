"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Sparkles, Copy, Check, Save, ArrowRight, FileText, PenBox, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { generateCoverLetter, updateCoverLetter } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/app/lib/schema";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";

export default function CoverLetterGenerator() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      jobDescription: "",
    },
  });

  const {
    loading: isGenerating,
    fn: generateLetterFn,
    data: generatedLetter,
    error: generateError,
  } = useFetch(generateCoverLetter);

  const {
    loading: isSaving,
    fn: updateLetterFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateCoverLetter);

  useEffect(() => {
    if (generatedLetter) {
      setPreviewContent(generatedLetter.content);
      toast.success("Cover letter generated successfully!");
    }
    if (generateError) {
      toast.error(generateError.message || "Failed to generate cover letter");
    }
  }, [generatedLetter, generateError]);

  useEffect(() => {
    if (updateResult && !isSaving) {
      toast.success("Cover letter updated successfully!");
    }
    if (updateError) {
      toast.error(updateError.message || "Failed to update cover letter");
    }
  }, [updateResult, updateError, isSaving]);

  const onSubmit = async (data) => {
    try {
      await generateLetterFn(data);
    } catch (err) {
      console.error("Generation error:", err);
    }
  };

  const handleSave = async () => {
    if (!generatedLetter?.id) {
      toast.error("Generate a cover letter first before saving.");
      return;
    }
    try {
      const companyName = watch("companyName");
      const jobTitle = watch("jobTitle");
      const jobDescription = watch("jobDescription");
      await updateLetterFn({
        id: generatedLetter.id,
        content: previewContent,
        companyName,
        jobTitle,
        jobDescription,
      });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleCopy = () => {
    if (!previewContent) return;
    navigator.clipboard.writeText(previewContent);
    setCopied(true);
    toast.success("Cover letter copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (typeof window === "undefined" || !previewContent) {
      if (!previewContent) toast.error("Generate a cover letter first to download PDF.");
      return;
    }
    setIsGeneratingPdf(true);
    try {
      const element = document.getElementById("cover-letter-pdf-gen");
      if (!element) {
        toast.error("Cover letter element not found.");
        return;
      }

      const html2pdfModule = await import("html2pdf.js/dist/html2pdf.min.js");
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const companyName = watch("companyName") || generatedLetter?.companyName || "Company";
      const jobTitle = watch("jobTitle") || generatedLetter?.jobTitle || "Role";

      const sanitize = (str) => (str || "").replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_").trim() || "Document";
      const filename = `Cover_Letter_${sanitize(companyName)}_${sanitize(jobTitle)}.pdf`;

      const opt = {
        margin: [10, 12, 10, 12],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 800 },
        jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"], avoid: [".cover-letter-signature", ".cover-letter-block"] },
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("Cover letter PDF downloaded successfully!");
    } catch (error) {
      console.error("Cover letter PDF generation error:", error);
      toast.error("Failed to download Cover Letter PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div data-color-mode="dark" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: JOB DETAILS FORM */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="glass-card border border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10 text-xs">
                  AI Letter Generator
                </Badge>
              </div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <PenBox className="h-4 w-4 text-purple-400" />
                Target Position Details
              </CardTitle>
              <CardDescription>
                Provide the job context to generate a tailored cover letter reflecting your experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName" className="text-xs font-mono text-muted-foreground uppercase">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="e.g. Stripe, Meta, OpenAI"
                    className="bg-white/[0.02]"
                    {...register("companyName")}
                  />
                  {errors.companyName && (
                    <p className="text-xs text-rose-400">{errors.companyName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="jobTitle" className="text-xs font-mono text-muted-foreground uppercase">
                    Job Title
                  </Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Senior Frontend Engineer"
                    className="bg-white/[0.02]"
                    {...register("jobTitle")}
                  />
                  {errors.jobTitle && (
                    <p className="text-xs text-rose-400">{errors.jobTitle.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="jobDescription" className="text-xs font-mono text-muted-foreground uppercase">
                    Job Description & Role Requirements
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the key responsibilities, requirements, or tech stack from the job posting..."
                    className="h-40 text-xs bg-white/[0.02]"
                    {...register("jobDescription")}
                  />
                  {errors.jobDescription && (
                    <p className="text-xs text-rose-400">{errors.jobDescription.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={generating}
                    className="w-full rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-5 shadow-lg shadow-indigo-600/25"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Tailored Letter...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 text-purple-300" />
                        Generate AI Cover Letter
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: GENERATED COVER LETTER WORKSPACE */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="glass-card border border-white/10">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  Generated Cover Letter
                </CardTitle>
                <CardDescription>
                  Editable markdown preview. Review, tweak, copy, save, or download.
                </CardDescription>
              </div>

              {previewContent && (
                <div className="flex items-center gap-2">
                  {generatedLetter?.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="rounded-full border-white/15 bg-white/[0.03] text-xs h-8"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="rounded-full border-white/15 bg-white/[0.03] text-xs h-8"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPdf}
                    className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8 font-semibold shadow-md shadow-indigo-600/25"
                  >
                    {isGeneratingPdf ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                        PDF...
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download PDF
                      </>
                    )}
                  </Button>

                  {generatedLetter?.id && (
                    <Button
                      size="sm"
                      onClick={() => router.push(`/ai-cover-letter/${generatedLetter.id}`)}
                      className="rounded-full bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 text-xs h-8"
                    >
                      Library &rarr;
                    </Button>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {previewContent ? (
                <div className="border border-white/10 rounded-xl overflow-hidden glass-card">
                  <MDEditor
                    value={previewContent}
                    onChange={setPreviewContent}
                    height={520}
                    preview="edit"
                  />
                </div>
              ) : (
                <div className="h-[400px] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <PenBox className="h-10 w-10 text-purple-400 opacity-60" />
                  <p className="text-sm font-semibold text-foreground">No Cover Letter Generated Yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Fill in the target company and job details on the left, then click &quot;Generate AI Cover Letter&quot; to produce a tailored letter.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Off-screen clean PDF renderer */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "210mm",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          id="cover-letter-pdf-gen"
          style={{
            backgroundColor: "#ffffff",
            color: "#111827",
            fontFamily: "'Helvetica Neue', Arial, Helvetica, sans-serif",
            padding: "15mm 20mm",
            fontSize: "10.5pt",
            lineHeight: "1.45",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          {(previewContent || "").split("\n\n").map((para, idx) => (
            <p key={idx} style={{ marginBottom: "12px", color: "#111827", whiteSpace: "pre-wrap" }}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
