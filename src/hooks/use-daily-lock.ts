"use client";

import { useState, useEffect, useCallback } from 'react';

type CompletionStatus = {
  date: string;
  score: number;
} | null;

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export function useDailyLock() {
  const [completionStatus, setCompletionStatus] = useState<{isCompleted: boolean | null, score: number | null}>({ isCompleted: null, score: null });

  useEffect(() => {
    let isMounted = true;
    try {
      const storedData = localStorage.getItem('mindSprintCompletion');
      if (storedData) {
        const parsedData: CompletionStatus = JSON.parse(storedData);
        if (isMounted && parsedData && parsedData.date === getTodayDateString()) {
          setCompletionStatus({ isCompleted: true, score: parsedData.score });
        } else {
          // Data is for a previous day
          localStorage.removeItem('mindSprintCompletion');
          if (isMounted) setCompletionStatus({ isCompleted: false, score: null });
        }
      } else {
         if (isMounted) setCompletionStatus({ isCompleted: false, score: null });
      }
    } catch (error) {
      console.error("Could not read from localStorage", error);
      if (isMounted) setCompletionStatus({ isCompleted: false, score: null });
    }

    return () => { isMounted = false; };
  }, []);

  const markAsCompleted = useCallback((score: number) => {
    const today = getTodayDateString();
    const data = { date: today, score };
    try {
      localStorage.setItem('mindSprintCompletion', JSON.stringify(data));
      setCompletionStatus({ isCompleted: true, score });
    } catch (error) {
       console.error("Could not write to localStorage", error);
    }
  }, []);

  return { isCompletedToday: completionStatus.isCompleted, score: completionStatus.score, markAsCompleted };
}
