"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";

export default function QuizList({ assessments }) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-title text-3xl md:text-4xl">
                Recent Quizzes
              </CardTitle>
              <CardDescription>
                Review your past quiz performance
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/interview/mock")}>
              Start New Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {assessments?.length > 0 ? (
            <div className="space-y-4">
              {assessments.map((assessment, i) => (
                <Card
                  key={assessment.id}
                  className="cursor-pointer glass-card hover:border-indigo-500/40 transition-all"
                  onClick={() => setSelectedQuiz(assessment)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold text-foreground">
                        Quiz #{i + 1} — {assessment.category || "Technical"}
                      </CardTitle>
                      <span className="font-mono text-sm font-bold text-indigo-400">
                        {assessment.quizScore.toFixed(1)}%
                      </span>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Completed {format(new Date(assessment.createdAt), "PPP 'at' p")}
                    </CardDescription>
                  </CardHeader>
                  {assessment.improvementTip && (
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground italic border-t border-white/5 pt-2 mt-1">
                        Tip: {assessment.improvementTip}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
                <Button variant="ghost" size="icon" className="pointer-events-none">
                  ⚡
                </Button>
              </div>
              <h3 className="text-base font-bold text-foreground">No Interviews Completed Yet</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Benchmark your technical readiness with role-specific multiple-choice questions and instant AI feedback.
              </p>
              <div className="pt-2">
                <Button onClick={() => router.push("/interview/mock")} className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-6">
                  Start Your First Mock Interview &rarr;
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <QuizResult
            result={selectedQuiz}
            hideStartNew
            onStartNew={() => router.push("/interview/mock")}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
