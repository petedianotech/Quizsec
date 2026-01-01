"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getDailyQuiz } from '@/lib/quiz';
import type { Quiz, Question } from '@/types/quiz';
import { QuestionCard } from './QuestionCard';
import { Loader2 } from 'lucide-react';
import { logQuizStart, logQuestionAnswer, logQuizComplete } from '@/lib/analytics';

export function QuizClient() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const quizData = await getDailyQuiz();
        setQuiz(quizData);
        logQuizStart();
      } catch (error) {
        console.error("Failed to fetch daily quiz:", error);
        // Optionally handle the error in the UI
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  const currentQuestion: Question | undefined = useMemo(
    () => quiz?.questions[currentQuestionIndex],
    [quiz, currentQuestionIndex]
  );
  
  const handleNextQuestion = useCallback(() => {
    if (!quiz) return;

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedAnswerIndex(null);
    } else {
      // End of quiz
      logQuizComplete(score, quiz.questions.length);
      // In a real app with user accounts, we would save the score here.
      router.push(`/results?score=${score}&total=${quiz.questions.length}`);
    }
  }, [currentQuestionIndex, quiz, router, score]);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (isAnswered || !currentQuestion) return;

    setIsAnswered(true);
    setSelectedAnswerIndex(answerIndex);

    const isCorrect = answerIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    logQuestionAnswer(currentQuestionIndex, isCorrect);
    
    setTimeout(() => {
        handleNextQuestion();
    }, 1500); // Wait 1.5 seconds to show feedback before next question
  }, [isAnswered, currentQuestion, currentQuestionIndex, handleNextQuestion]);

  const handleTimeUp = useCallback(() => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedAnswerIndex(null); // No answer selected

    logQuestionAnswer(currentQuestionIndex, false);

    setTimeout(() => {
        handleNextQuestion();
    }, 1500);
  }, [isAnswered, currentQuestionIndex, handleNextQuestion]);

  if (isLoading || !quiz || !currentQuestion) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Preparing your challenge...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-grow flex items-center justify-center">
        <QuestionCard
            key={currentQuestionIndex}
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quiz.questions.length}
            onAnswer={handleAnswer}
            onTimeUp={handleTimeUp}
            isAnswered={isAnswered}
            selectedAnswerIndex={selectedAnswerIndex}
        />
      </div>
      <div className="h-16 flex items-center justify-center text-sm text-muted-foreground/50">
        Ad banner space
      </div>
    </div>
  );
}
