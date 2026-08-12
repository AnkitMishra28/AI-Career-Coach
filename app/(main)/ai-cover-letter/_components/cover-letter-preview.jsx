"use client";

import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Copy, Check, Edit, Monitor, Save, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateCoverLetter } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";

export default function CoverLetterPreview({
  id,
  content: initialContent,
  companyName = "Company",
  jobTitle = "Role",
}) {
  const [content, setContent] = useState(initialContent || "");
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState("preview");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const {
    loading: isSaving,
    fn: updateLetterFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateCoverLetter);

  useEffect(() => {
    if (updateResult && !isSaving) {
      toast.success("Cover letter saved successfully!");
    }
    if (updateError) {
      toast.error(updateError.message || "Failed to save cover letter");
    }
  }, [updateResult, updateError, isSaving]);

  const handleSave = async () => {
    if (!id) {
      toast.error("Cover letter ID missing");
      return;
    }
    try {
      await updateLetterFn({ id, content, companyName, jobTitle });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Cover letter copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (typeof window === "undefined" || !content) {
      if (!content) toast.error("No content to generate PDF");
      return;
    }
    setIsGeneratingPdf(true);
    try {
      const element = document.getElementById("cover-letter-pdf-preview");
      if (!element) {
        toast.error("Cover letter element not found.");
        return;
      }

      const html2pdfModule = await import("html2pdf.js/dist/html2pdf.min.js");
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const sanitize = (str) => (str || "").replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_").trim() || "Document";
      const filename = `Cover_Letter_${sanitize(companyName)}_${sanitize(jobTitle)}.pdf`;

      const opt = {
        margin: [10, 12, 10, 12], // 10mm top/bottom (~0.39in), 12mm left/right (~0.47in)
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 800 },
        jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"], avoid: [".cover-letter-signature", ".cover-letter-block"] },
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("Cover letter PDF downloaded successfully!");
    } catch (error) {
      console.error("Cover letter PDF error:", error);
      toast.error("Failed to generate Cover Letter PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div data-color-mode="dark" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMode(mode === "preview" ? "edit" : "preview")}
          className="rounded-full border-white/10 text-xs"
        >
          {mode === "preview" ? (
            <>
              <Edit className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
              Edit Letter
            </>
          ) : (
            <>
              <Monitor className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
              Preview Mode
            </>
          )}
        </Button>

        <div className="flex items-center gap-2">
          {id && (
            <Button
              variant="outline"
              size="sm"
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
                  Save Letter
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
            className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-8 shadow-md shadow-indigo-600/25"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                Downloading PDF...
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 mr-1" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="border border-white/10 rounded-xl overflow-hidden glass-card">
        <MDEditor value={content} onChange={setContent} height={650} preview={mode} />
      </div>

      {/* Off-screen clean PDF document renderer */}
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
          id="cover-letter-pdf-preview"
          style={{
            backgroundColor: "#ffffff",
            color: "#111827",
            fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
            padding: "0mm",
            margin: "0mm",
            fontSize: "9.5pt",
            lineHeight: "1.3",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          {(() => {
            const paragraphs = (content || "").split("\n\n").filter(Boolean);
            const closingKeywords = [
              "sincerely,",
              "regards,",
              "best regards,",
              "thank you,",
              "yours sincerely,",
            ];

            const isClosingPara = (text) => {
              const lower = text.trim().toLowerCase();
              return closingKeywords.some((kw) => lower.startsWith(kw));
            };

            const bodyParas = [];
            const closingParas = [];
            let foundClosing = false;

            paragraphs.forEach((p) => {
              if (isClosingPara(p) || foundClosing) {
                foundClosing = true;
                closingParas.push(p);
              } else {
                bodyParas.push(p);
              }
            });

            return (
              <>
                {bodyParas.map((para, idx) => (
                  <p
                    key={idx}
                    className="cover-letter-block"
                    style={{
                      marginBottom: "8px",
                      color: "#111827",
                      whiteSpace: "pre-wrap",
                      pageBreakInside: "avoid",
                      breakInside: "avoid",
                    }}
                  >
                    {para}
                  </p>
                ))}

                {closingParas.length > 0 ? (
                  <div
                    className="cover-letter-signature"
                    style={{
                      marginTop: "12px",
                      marginBottom: "0px",
                      pageBreakInside: "avoid",
                      breakInside: "avoid",
                    }}
                  >
                    {closingParas.map((para, idx) => (
                      <p
                        key={idx}
                        style={{
                          marginBottom: "4px",
                          color: "#111827",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                ) : null}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
