"use client";

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface TimerBarProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isPaused: boolean;
}

export function TimerBar({ duration, onTimeUp, isPaused }: TimerBarProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setProgress(100);
  }, [duration]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration * 10)); // update every 100ms
        if (newProgress <= 0) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onTimeUp, isPaused]);

  return <Progress value={progress} className="h-2 w-full" />;
}
