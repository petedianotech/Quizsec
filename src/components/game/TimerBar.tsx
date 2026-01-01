"use client";

import { useState, useEffect, useRef } from 'react';
import { Progress } from '@/components/ui/progress';

interface TimerBarProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isPaused: boolean;
}

export function TimerBar({ duration, onTimeUp, isPaused }: TimerBarProps) {
  const [progress, setProgress] = useState(100);
  const timeIsUp = progress <= 0;

  useEffect(() => {
    if (isPaused) {
      return;
    }
    const interval = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - (100 / (duration * 10)) : 0));
    }, 100);

    return () => clearInterval(interval);
  }, [duration, isPaused]);
  
  useEffect(() => {
    if(timeIsUp) {
        onTimeUp();
    }
  }, [timeIsUp, onTimeUp]);


  return <Progress value={progress} className="h-2 w-full" />;
}
