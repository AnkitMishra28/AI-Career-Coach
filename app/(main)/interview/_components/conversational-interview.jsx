"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  generateConversationalQuestions,
  evaluateInterviewAnswer,
  saveConversationalInterviewResult,
} from "@/actions/interview";
import { BarLoader } from "react-spinners";
import {
  Brain,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Mic,
  MicOff,
  Volume2,
  Send,
  Award,
  Layers,
  HelpCircle,
  RotateCcw,
} from "lucide-react";

export default function ConversationalInterview({ onFinish }) {
  const [category, setCategory] = useState("Technical");
  const [step, setStep] = useState("setup"); // 'setup' | 'interview' | 'evaluating' | 'evaluated' | 'completed'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluations, setEvaluations] = useState([]);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      setSpeechSupported(true);
    }
  }, []);

  const startVoiceDictation = () => {
    if (!speechSupported) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        toast.info("Listening... Speak your answer now.");
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Voice dictation error:", err);
      setIsListening(false);
    }
  };

  const handleSpeakQuestion = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Speech synthesis is not supported in your browser.");
    }
  };

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const qList = await generateConversationalQuestions(category);
      setQuestions(qList);
      setCurrentIndex(0);
      setEvaluations([]);
      setUserAnswer("");
      setCurrentEvaluation(null);
      setStep("interview");
    } catch (err) {
      toast.error("Failed to initialize interview questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please enter your answer before submitting.");
      return;
    }

    setLoading(true);
    setStep("evaluating");
    const currentQuestion = questions[currentIndex];

    try {
      const evaluation = await evaluateInterviewAnswer({
        category,
        question: currentQuestion,
        userAnswer,
      });

      setCurrentEvaluation(evaluation);
      const newEntry = {
        question: currentQuestion,
        userAnswer,
        evaluation,
      };

      setEvaluations((prev) => [...prev, newEntry]);
      setStep("evaluated");
    } catch (err) {
      toast.error("Evaluation error. Please try again.");
      setStep("interview");
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setCurrentEvaluation(null);
      setStep("interview");
    } else {
      finishConversationalInterview();
    }
  };

  const finishConversationalInterview = async () => {
    setLoading(true);
    const totalScore = evaluations.reduce((sum, item) => sum + (item.evaluation.score || 0), 0);
    const overallScore = Math.round(totalScore / evaluations.length);

    try {
      await saveConversationalInterviewResult({
        category,
        evaluations,
        overallScore,
      });
      toast.success("AI Mock Interview completed and saved!");
      setStep("completed");
      if (typeof onFinish === "function") onFinish();
    } catch (err) {
      toast.error("Failed to save interview result.");
    } finally {
      setLoading(false);
    }
  };

  // RENDER STEP 1: SETUP
  if (step === "setup") {
    return (
      <Card className="glass-card border border-indigo-500/30">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Brain className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-foreground">
            AI Conversational Mock Interview
          </CardTitle>
          <CardDescription>
            Answer 5 role-specific scenario questions with detailed text or voice answers and get comprehensive technical evaluation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Select Interview Category
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "Technical", desc: "React, Node.js, DBs, Algorithms" },
                { id: "System Design", desc: "Scalability, Caching, Sharding" },
                { id: "Behavioral", desc: "Leadership, Ownership, Conflict" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    category === cat.id
                      ? "border-indigo-500 bg-indigo-600/20 text-white shadow-md shadow-indigo-600/20"
                      : "border-white/10 bg-white/[0.02] text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <p className="text-xs font-bold text-foreground">{cat.id}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Evaluation Criteria:
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Technical Accuracy</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Answer Depth & Constraints</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Structural Communication</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Missing Trade-off Identification</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleStartInterview}
            disabled={loading}
            className="w-full rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-5 shadow-lg shadow-indigo-600/25"
          >
            {loading ? (
              <>
                <BarLoader width={60} color="#ffffff" className="mr-2" />
                Generating Questions...
              </>
            ) : (
              <>
                Begin AI Conversational Interview <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // RENDER EVALUATING LOADING STATE
  if (step === "evaluating") {
    return (
      <Card className="glass-card border border-indigo-500/30 text-center py-16">
        <CardContent className="space-y-4">
          <BarLoader className="mx-auto" width={"60%"} color="#6366f1" />
          <p className="text-sm font-semibold text-foreground">Evaluating Technical Answer...</p>
          <p className="text-xs text-muted-foreground">Analyzing technical accuracy, architectural depth, trade-off coverage, and clarity.</p>
        </CardContent>
      </Card>
    );
  }

  // RENDER INTERVIEW QUESTION / ANSWER STEP
  if (step === "interview") {
    const questionText = questions[currentIndex];
    return (
      <Card className="glass-card border border-white/15 shadow-2xl">
        <CardHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-xs">
              {category} Question {currentIndex + 1} of {questions.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSpeakQuestion(questionText)}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              <Volume2 className="h-4 w-4 mr-1" />
              Listen to Question
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <p className="text-base font-semibold text-foreground leading-relaxed">
            {questionText}
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold uppercase text-muted-foreground">
                Your Technical Answer
              </label>
              {speechSupported && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={startVoiceDictation}
                  className={`text-xs rounded-full ${
                    isListening ? "border-rose-500 text-rose-400 animate-pulse" : "border-white/15 text-muted-foreground"
                  }`}
                >
                  {isListening ? <Mic className="h-3.5 w-3.5 mr-1" /> : <Mic className="h-3.5 w-3.5 mr-1" />}
                  {isListening ? "Listening..." : "Dictate by Voice"}
                </Button>
              )}
            </div>
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your structured answer here. State constraints, explain key components, and detail trade-offs..."
              className="h-44 text-xs bg-white/[0.02]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-white/10 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStep("setup")}
            className="rounded-full text-xs border-white/10"
          >
            Cancel Interview
          </Button>
          <Button
            onClick={handleSubmitAnswer}
            disabled={loading || !userAnswer.trim()}
            size="sm"
            className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-6 shadow-md shadow-indigo-600/25"
          >
            Submit Answer for AI Evaluation <Send className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // RENDER EVALUATION FEEDBACK STEP
  if (step === "evaluated" && currentEvaluation) {
    return (
      <Card className="glass-card border border-indigo-500/30">
        <CardHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-xs">
              AI Evaluation Report — Question {currentIndex + 1}
            </Badge>
            <span className="font-mono text-sm font-bold text-indigo-400">
              Score: {currentEvaluation.score} / 100
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Metrics Breakdown Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center space-y-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Accuracy</span>
              <p className="text-lg font-bold text-emerald-400">{currentEvaluation.technicalAccuracy}%</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center space-y-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Depth</span>
              <p className="text-lg font-bold text-cyan-400">{currentEvaluation.depth}%</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center space-y-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Clarity</span>
              <p className="text-lg font-bold text-purple-400">{currentEvaluation.communication}%</p>
            </div>
          </div>

          {/* Strengths vs Missing Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Strong Answer Aspects
              </h4>
              <ul className="space-y-1 text-xs text-gray-300">
                {(currentEvaluation.strengths || []).map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
              <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4" /> Missing Points / Trade-offs
              </h4>
              <ul className="space-y-1 text-xs text-gray-300">
                {(currentEvaluation.missingPoints || []).map((m, i) => (
                  <li key={i}>• {m}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Advice & Exemplar Answer */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
              <span className="text-xs font-mono font-bold uppercase text-indigo-400">Actionable Improvement Advice</span>
              <p className="text-xs text-gray-200 leading-relaxed">{currentEvaluation.improvement}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <span className="text-xs font-mono font-bold uppercase text-muted-foreground">Exemplar Answer Approach</span>
              <p className="text-xs text-gray-300 italic leading-relaxed">{currentEvaluation.idealApproach}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-white/10 pt-4">
          <Button
            onClick={handleNextQuestion}
            size="sm"
            className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-6 shadow-md shadow-indigo-600/25"
          >
            {currentIndex < questions.length - 1 ? (
              <>
                Next Question ({currentIndex + 2} / {questions.length}) <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Complete Interview & Save <CheckCircle2 className="ml-1.5 h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // RENDER COMPLETED INTERVIEW FINAL SUMMARY
  if (step === "completed") {
    const totalScore = evaluations.reduce((sum, item) => sum + (item.evaluation.score || 0), 0);
    const overallScore = Math.round(totalScore / evaluations.length);

    return (
      <Card className="glass-card border border-emerald-500/30">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-foreground">
            AI Conversational Interview Completed!
          </CardTitle>
          <CardDescription>
            Your interview evaluation has been recorded and added to your performance dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4 text-center">
          <div className="space-y-1">
            <span className="text-xs font-mono text-muted-foreground uppercase">Overall Technical Score</span>
            <div className="text-4xl font-extrabold font-mono text-emerald-400">{overallScore}%</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-left space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-muted-foreground">Evaluation Breakdown per Question</h4>
            {evaluations.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 text-xs">
                <span className="text-foreground font-medium truncate flex-1">
                  Q{idx + 1}. {item.question}
                </span>
                <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-xs shrink-0 font-mono">
                  {item.evaluation.score}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button
            onClick={() => setStep("setup")}
            variant="outline"
            className="w-full rounded-full border-white/15 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Start Another Interview
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
}
