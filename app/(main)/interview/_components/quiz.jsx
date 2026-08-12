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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { GraduationCap, Sparkles, ArrowRight, CheckCircle2, XCircle, HelpCircle } from "lucide-react";

export default function Quiz({ onStateChange }) {
  // All hooks declared at top of component body
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizCategory, setQuizCategory] = useState("Technical");

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
      setIsAnswerSubmitted(false);
    }
  }, [quizData]);

  // Track session activity for mode-switching safety
  useEffect(() => {
    if (typeof onStateChange === "function") {
      const active = Boolean(quizData && !resultData && currentQuestion > 0);
      onStateChange(active);
    }
  }, [quizData, resultData, currentQuestion, onStateChange]);

  const handleSelectOption = (option) => {
    if (isAnswerSubmitted) return; // Prevent changing after submission
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleStartQuiz = () => {
    generateQuizFn(quizCategory);
  };

  const handleSubmitAnswer = () => {
    if (!answers[currentQuestion]) {
      toast.error("Please select an answer option first");
      return;
    }
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsAnswerSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quizData.length) * 100);
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score, quizCategory);
      toast.success("Diagnostic Quiz completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsAnswerSubmitted(false);
    setResultData(null);
    generateQuizFn(quizCategory);
  };

  if (generatingQuiz) {
    return (
      <Card className="glass-card border border-white/10 text-center py-16">
        <CardContent className="space-y-4">
          <BarLoader className="mx-auto" width={"60%"} color="#6366f1" />
          <p className="text-sm font-semibold text-foreground">Generating {quizCategory} Quiz Questions...</p>
          <p className="text-xs text-muted-foreground">Synthesizing role-specific diagnostic questions tailored to your skills.</p>
        </CardContent>
      </Card>
    );
  }

  if (resultData) {
    return (
      <div>
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="glass-card border border-indigo-500/30">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <GraduationCap className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-foreground">
            Diagnostic Multiple-Choice Quiz
          </CardTitle>
          <CardDescription>
            Select a practice category and test your core knowledge with 10 diagnostic questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Select Practice Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Technical", "System Design", "Behavioral"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setQuizCategory(cat)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    quizCategory === cat
                      ? "border-indigo-500 bg-indigo-600/20 text-white shadow-md shadow-indigo-600/20"
                      : "border-white/10 bg-white/[0.02] text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Quiz Rules:
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>10 questions curated for the {quizCategory} domain</li>
              <li>Select your option and click &quot;Submit Answer&quot; to reveal accuracy & explanation</li>
              <li>Calculates score, strengths, and weakness analysis upon completion</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleStartQuiz}
            className="w-full rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-5 shadow-lg shadow-indigo-600/25"
          >
            Start {quizCategory} Quiz <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];
  const selectedOption = answers[currentQuestion];
  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <Card className="glass-card border border-white/15 shadow-2xl">
      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-xs font-mono">
            {quizCategory} • Question {currentQuestion + 1} of {quizData.length}
          </Badge>
          <span className="text-xs font-mono text-muted-foreground">
            Progress: {Math.round(((currentQuestion + 1) / quizData.length) * 100)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <p className="text-base font-semibold text-foreground leading-relaxed">
          {question.question}
        </p>

        <RadioGroup
          value={selectedOption || ""}
          className="space-y-3"
        >
          {question.options.map((option, index) => {
            let optionStyle = "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-300";

            if (isAnswerSubmitted) {
              if (option === question.correctAnswer) {
                optionStyle = "border-emerald-500/50 bg-emerald-500/15 text-emerald-300 shadow-sm font-semibold";
              } else if (option === selectedOption && !isCorrect) {
                optionStyle = "border-rose-500/50 bg-rose-500/15 text-rose-300 shadow-sm";
              }
            } else if (selectedOption === option) {
              optionStyle = "border-indigo-500 bg-indigo-600/20 text-white shadow-sm";
            }

            return (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3.5 rounded-xl border transition-all cursor-pointer ${optionStyle}`}
                onClick={() => handleSelectOption(option)}
              >
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  disabled={isAnswerSubmitted}
                  className="border-white/30 text-indigo-500"
                />
                <Label htmlFor={`option-${index}`} className="text-xs font-medium cursor-pointer flex-1">
                  {option}
                </Label>
                {isAnswerSubmitted && option === question.correctAnswer && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                )}
                {isAnswerSubmitted && option === selectedOption && !isCorrect && (
                  <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                )}
              </div>
            );
          })}
        </RadioGroup>

        {/* EXPLANATION IS HIDDEN UNTIL USER SUBMITS ANSWER */}
        {isAnswerSubmitted && (
          <div className={`p-4 rounded-xl border space-y-1.5 ${isCorrect ? "bg-emerald-950/30 border-emerald-500/30" : "bg-rose-950/30 border-rose-500/30"}`}>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase">
              {isCorrect ? (
                <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Correct Answer!</span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1"><XCircle className="h-4 w-4" /> Incorrect</span>
              )}
            </div>
            {!isCorrect && (
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Correct Option:</span> {question.correctAnswer}
              </p>
            )}
            <div className="pt-1">
              <p className="text-xs font-mono font-semibold uppercase text-indigo-400">Explanation:</p>
              <p className="text-xs text-gray-200 leading-relaxed mt-0.5">{question.explanation}</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-white/10 pt-4">
        {!isAnswerSubmitted ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={!selectedOption}
            size="sm"
            className="ml-auto rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-6 shadow-md shadow-indigo-600/20"
          >
            Submit Answer <HelpCircle className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            disabled={savingResult}
            size="sm"
            className="ml-auto rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-6 shadow-md shadow-indigo-600/20"
          >
            {savingResult ? (
              <>
                <BarLoader width={40} color="#ffffff" />
                Saving Results...
              </>
            ) : currentQuestion < quizData.length - 1 ? (
              <>
                Next Question ({currentQuestion + 2} / {quizData.length}) <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Finish & View Score Diagnostics <CheckCircle2 className="ml-1.5 h-3.5 w-3.5" />
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
