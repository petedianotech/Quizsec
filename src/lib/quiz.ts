import { dailyQuizData } from './quiz-data';
import type { Quiz } from '@/types/quiz';

// In a real app, this would fetch from Firestore based on the current date.
// For this MVP, we return a static, pre-generated quiz.
export function getDailyQuiz(): Quiz {
  // To ensure the quiz date is always "today", we dynamically update the date.
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayDateString = `${year}-${month}-${day}`;

  return {
    ...dailyQuizData,
    id: `quiz-${todayDateString}`,
    date: todayDateString,
  };
}
