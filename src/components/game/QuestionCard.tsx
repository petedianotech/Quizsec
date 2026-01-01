
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

  const getButtonVariant = (index: number): 'outline' | 'success' | 'destructive' | 'default' | 'secondary' | 'ghost' | 'link' | null | undefined => {
    if (!isAnswered) {
      return index === selectedAnswerIndex ? 'secondary' : 'outline';
    }

    const isCorrect = index === question.correctIndex;
    const isSelected = index === selectedAnswerIndex;

    if (isCorrect) return 'success';
    if (isSelected && !isCorrect) return 'destructive';
    
    return 'outline';
  };

  const getButtonClass = (index: number) => {
    if (!isAnswered) return '';

    const isCorrect = index === question.correctIndex;
    const isSelected = index === selectedAnswerIndex;
    
    // If an answer was selected (incorrectly)
    if(selectedAnswerIndex !== null) {
      if(!isCorrect && !isSelected) {
        return 'opacity-50';
      }
    } else { // if time ran out (no selection)
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
