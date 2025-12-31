"use client";

import { useDailyLock } from '@/hooks/use-daily-lock';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, CheckCircle, BrainCircuit, ArrowRight } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export function HomeClient() {
  const { isCompletedToday, score } = useDailyLock();

  if (isCompletedToday === null) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Checking your daily status...</p>
      </div>
    );
  }

  if (isCompletedToday) {
    return (
      <Card className="w-full max-w-md text-center shadow-lg animate-in fade-in zoom-in-95">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Quiz Completed!</CardTitle>
          <CardDescription>
            You scored {score}/10 today. Great job!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Come back tomorrow for a new set of challenges.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md text-center shadow-lg animate-in fade-in zoom-in-95">
      <CardHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <BrainCircuit className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold font-headline">MindSprint Daily</CardTitle>
        <CardDescription className="text-lg">How sharp is your mind today?</CardDescription>
      </CardHeader>
      <CardContent>
        <p>You have 10 questions to solve. Each has a 15-second time limit. Good luck!</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" size="lg">
          <Link href="/quiz">
            Start Today's Quiz <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
