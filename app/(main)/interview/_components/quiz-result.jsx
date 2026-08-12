"use client";

import { Trophy, CheckCircle2, XCircle, Brain, Sparkles, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function QuizResult({
  result,
  hideStartNew = false,
  onStartNew,
}) {
  if (!result) return null;

  const score = result.quizScore || 0;
  const questions = result.questions || [];
  const correctCount = questions.filter((q) => q.isCorrect).length;
  const totalCount = questions.length;

  const getScoreBadge = (scoreVal) => {
    if (scoreVal >= 80) return { label: "Interview Ready", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
    if (scoreVal >= 60) return { label: "Good Attempt", color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" };
    return { label: "Needs Practice", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" };
  };

  const scoreBadge = getScoreBadge(score);

  return (
    <div className="space-y-6">
      {/* Score Overview Card */}
      <Card className="glass-card border border-white/10">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-foreground">
            Interview Evaluation Summary
          </CardTitle>
          <div className="flex justify-center pt-1">
            <Badge variant="outline" className={`text-xs font-semibold px-3 py-1 ${scoreBadge.color}`}>
              {scoreBadge.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <div className="text-4xl font-extrabold font-mono text-foreground">
              {score.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Correct Answers: {correctCount} of {totalCount} questions
            </p>
            <Progress value={score} className="h-2 bg-white/10" />
          </div>

          {/* AI Improvement Tip */}
          {result.improvementTip && (
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> AI Diagnostic Feedback
              </div>
              <p className="text-xs text-gray-200 leading-relaxed">{result.improvementTip}</p>
            </div>
          )}

          {/* Questions Review */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
              Detailed Question Breakdown
            </h4>
            <div className="space-y-3">
              {questions.map((q, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-semibold text-foreground">
                      <span className="font-mono text-muted-foreground mr-1.5">Q{index + 1}.</span>
                      {q.question}
                    </p>
                    {q.isCorrect ? (
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px] shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Correct
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/10 text-[10px] shrink-0 flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> Incorrect
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1 pt-1 font-mono">
                    <p className={q.isCorrect ? "text-emerald-400" : "text-rose-400"}>
                      Your Answer: {q.userAnswer || "No answer selected"}
                    </p>
                    {!q.isCorrect && (
                      <p className="text-emerald-400">Correct Answer: {q.answer}</p>
                    )}
                  </div>

                  {q.explanation && (
                    <p className="text-xs text-gray-300 bg-white/[0.03] p-2.5 rounded-lg border border-white/5 italic">
                      Explanation: {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        {!hideStartNew && (
          <CardFooter className="pt-2">
            <Button
              onClick={onStartNew}
              className="w-full rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-5 shadow-lg shadow-indigo-600/25"
            >
              Start New Practice Quiz <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
