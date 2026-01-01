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
  const timeUpReported = useRef(false);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    // Reset timer state when a new question comes in (via key change)
    setProgress(100);
    timeUpReported.current = false;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration * 10)); // update every 100ms
        if (newProgress <= 0) {
          clearInterval(interval);
          if (!timeUpReported.current) {
            onTimeUp();
            timeUpReported.current = true;
          }
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, isPaused, onTimeUp]);

  return <Progress value={progress} className="h-2 w-full" />;
}
