
"use client";

import type { Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TimerBar } from './TimerBar';
import { Check, X, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSettingsStore } from '@/store/settings-store';

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
  
  const { timerEnabled, timerDuration } = useSettingsStore();

  const getButtonVariant = (index: number): 'outline' | 'success' | 'destructive' | 'secondary' => {
    if (!isAnswered) {
      // If an answer has been selected but not yet confirmed as correct/incorrect
      return index === selectedAnswerIndex ? 'secondary' : 'outline';
    }

    // After the answer has been confirmed
    const isCorrect = index === question.correctIndex;
    const isSelected = index === selectedAnswerIndex;

    if (isCorrect) return 'success';
    if (isSelected && !isCorrect) return 'destructive';
    
    return 'outline';
  };

  const getButtonClass = (index: number) => {
    if (!isAnswered) return '';

    const isCorrect = index === question.correctIndex;
    
    // If an incorrect answer was selected, or if time ran out,
    // fade out the non-correct options.
    if(selectedAnswerIndex !== question.correctIndex) {
      if(!isCorrect) {
        return 'opacity-50';
      }
    }
    
    return '';
  };

  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(prev => prev + 1);
  }, [question]);

  return (
    <Card className="w-full max-w-2xl animate-in fade-in zoom-in-95 shadow-lg border-primary/10">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-semibold text-muted-foreground tracking-wider">
            QUESTION {questionNumber} / {totalQuestions}
          </p>
          {timerEnabled && (
            <div className="w-1/3">
                <TimerBar key={key} duration={timerDuration} onTimeUp={onTimeUp} isPaused={isAnswered} />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl md:text-3xl text-center leading-relaxed font-headline">
          {question.questionText}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {question.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => onAnswer(index)}
              className={cn(
                "h-auto min-h-[4rem] whitespace-normal justify-start p-4 text-left text-base leading-snug transition-all duration-300 border-2",
                getButtonClass(index)
              )}
              variant={getButtonVariant(index)}
            >
              <div className="flex items-center w-full">
                <span className="flex-grow">{option}</span>
                {isAnswered && index === question.correctIndex && <Check className="h-6 w-6 ml-2 shrink-0"/>}
                {isAnswered && index !== question.correctIndex && index === selectedAnswerIndex && <X className="h-6 w-6 ml-2 shrink-0"/>}
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
