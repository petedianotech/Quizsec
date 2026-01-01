"use client";

import type { Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TimerBar } from './TimerBar';
import { Check, X, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (optionIndex: number) => void;
  onTimeUp: () => void;
  isAnswered: boolean;
  selectedAnswerIndex: number | null;
  isCampaignMode?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onTimeUp,
  isAnswered,
  selectedAnswerIndex,
  isCampaignMode = false
}: QuestionCardProps) {
  const getButtonVariant = (index: number) => {
    if (!isAnswered) return 'outline';
    if (index === question.correctIndex) return 'success';
    if (index === selectedAnswerIndex) return 'destructive';
    return 'outline';
  };
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(prev => prev + 1);
  }, [question]);

  return (
    <Card className="w-full max-w-2xl animate-in fade-in zoom-in-95">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-medium text-muted-foreground">
            Question {questionNumber} / {totalQuestions}
          </p>
          <div className="w-1/3">
             <TimerBar key={key} duration={15} onTimeUp={onTimeUp} isPaused={isAnswered} />
          </div>
        </div>
        <CardTitle className="text-xl md:text-2xl text-center leading-relaxed">
          {question.questionText}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {question.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => onAnswer(index)}
              disabled={isAnswered}
              className={cn(
                "h-auto min-h-[4rem] whitespace-normal justify-start p-4 text-left text-base leading-snug",
                isAnswered && "text-white",
                getButtonVariant(index) === 'success' && 'bg-green-600 hover:bg-green-700 border-green-600',
                getButtonVariant(index) === 'destructive' && 'bg-red-600 hover:bg-red-700 border-red-600',
              )}
              variant={isAnswered ? 'default' : 'outline'}
            >
              <div className="flex items-center w-full">
                <span className="flex-grow">{option}</span>
                {isAnswered && index === question.correctIndex && <Check className="h-5 w-5 ml-2 shrink-0"/>}
                {isAnswered && index !== question.correctIndex && index === selectedAnswerIndex && <X className="h-5 w-5 ml-2 shrink-0"/>}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
      {isCampaignMode && (
          <CardFooter>
            <Button variant="ghost" asChild>
                <Link href="/campaign">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Campaign
                </Link>
            </Button>
          </CardFooter>
      )}
    </Card>
  );
}
