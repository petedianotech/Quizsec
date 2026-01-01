import type { Quiz, Question } from '@/types/quiz';
import { collection, getDocs, limit, query, where, doc } from 'firebase/firestore';
import { firestore } from '@/firebase/client-side-exports';
import { dailyQuizData } from './quiz-data'; // Import local fallback data

// This function now fetches a random selection of 10 questions from the Firestore question bank.
export async function getDailyQuiz(): Promise<Quiz> {
  try {
    const questionsCol = collection(firestore, 'questions');
    
    // For simplicity, we'll query for questions not part of a campaign
    const q = query(questionsCol, where('seasonId', '==', null), limit(10));
    
    let querySnapshot = await getDocs(q);
  
    // If the query returns no documents, use fallback data.
    if (querySnapshot.empty) {
      console.log("No daily questions found in Firestore, using local fallback data.");
      const today = new Date();
      const todayDateString = today.toISOString().split('T')[0];
      return {
          ...dailyQuizData,
          id: `quiz-${todayDateString}`,
          date: todayDateString,
      };
    }

    const selectedQuestions: Question[] = [];
    querySnapshot.forEach((doc) => {
      selectedQuestions.push({ id: doc.id, ...doc.data() } as Question);
    });

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
  } catch (error) {
    console.error("Error fetching daily quiz, using local fallback:", error);
    // In case of any error (e.g., Firestore rules), fall back to local data.
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];
    return {
        ...dailyQuizData,
        id: `quiz-${todayDateString}`,
        date: todayDateString,
    };
  }
}

// Function to fetch questions for a specific campaign level
export async function getCampaignQuiz(seasonId: string, levelId: string): Promise<Quiz> {
  const questionsCol = collection(firestore, 'questions');
  const q = query(
    questionsCol, 
    where('seasonId', '==', seasonId), 
    where('levelId', '==', levelId),
    limit(10)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error(`No questions found for season ${seasonId}, level ${levelId}`);
  }

  const questions: Question[] = [];
  querySnapshot.forEach(doc => {
    questions.push({ id: doc.id, ...doc.data() } as Question);
  });

  return {
    id: `${seasonId}-${levelId}`,
    date: new Date().toISOString().split('T')[0], // Not really a 'daily' quiz date
    questions,
  };
}
