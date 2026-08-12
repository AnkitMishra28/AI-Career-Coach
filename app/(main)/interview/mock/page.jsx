"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Quiz from "../_components/quiz";
import ConversationalInterview from "../_components/conversational-interview";

export default function MockInterviewPage() {
  const [interviewMode, setInterviewMode] = useState("conversational"); // 'conversational' | 'mcq'
  const [isSessionActive, setIsSessionActive] = useState(false);

  const handleModeChange = (targetMode) => {
    if (targetMode === interviewMode) return;

    if (isSessionActive) {
      const confirmed = window.confirm("Switching modes will end your current active interview session. Are you sure you want to continue?");
      if (!confirmed) return;
    }

    setInterviewMode(targetMode);
    setIsSessionActive(false);
  };

  return (
    <div className="container mx-auto space-y-6 py-6 max-w-4xl">
      <div className="flex flex-col space-y-3">
        <Link href="/interview">
          <Button variant="link" className="gap-2 pl-0 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Workspace
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Mock Interview Workspace
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Practice scenario-based conversational interviews or diagnostic MCQ quizzes with real-time AI evaluation.
            </p>
          </div>

          {/* MODE TOGGLE SWITCH WITH CONFIRMATION */}
          <div className="bg-white/[0.04] border border-white/10 p-1 rounded-full flex shrink-0">
            <button
              type="button"
              onClick={() => handleModeChange("conversational")}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                interviewMode === "conversational"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Brain className="h-3.5 w-3.5" />
              AI Conversational Mock
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("mcq")}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                interviewMode === "mcq"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Diagnostic MCQ Quiz
            </button>
          </div>
        </div>
      </div>

      {/* RENDER ACTIVE MODE WITH SESSION TRACKING */}
      {interviewMode === "conversational" ? (
        <ConversationalInterview onStateChange={setIsSessionActive} />
      ) : (
        <Quiz onStateChange={setIsSessionActive} />
      )}
    </div>
  );
}
