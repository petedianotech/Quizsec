import type { Quiz, Question } from '@/types/quiz';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { firestore } from '@/firebase/client-side-exports';

// This function now fetches a random selection of 10 questions from the Firestore question bank.
export async function getDailyQuiz(): Promise<Quiz> {
  const questionsCol = collection(firestore, 'questions');
  // In a real-world scenario with a large dataset, you'd want a more sophisticated
  // way to select random documents. Firestore doesn't have a native "random" function.
  // A common strategy is to generate a random ID and query for documents greater than that ID,
  // but for this MVP, we'll fetch a limited number and shuffle them.
  const q = query(questionsCol, limit(50)); // Fetch 50 questions to get a random-enough sample
  const querySnapshot = await getDocs(q);

  const allQuestions: Question[] = [];
  querySnapshot.forEach((doc) => {
    allQuestions.push(doc.data() as Question);
  });

  // Shuffle the array and pick the first 10
  const shuffled = allQuestions.sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, 10);

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayDateString = `${year}-${month}-${day}`;

  return {
    id: `quiz-${todayDateString}`,
    date: todayDateString,
    questions: selectedQuestions,
  };
}
