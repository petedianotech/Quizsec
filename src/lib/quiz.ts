import type { Quiz, Question } from '@/types/quiz';
import { collection, getDocs, limit, query, orderBy, documentId, doc } from 'firebase/firestore';
import { firestore } from '@/firebase/client-side-exports';
import { dailyQuizData } from './quiz-data'; // Import local fallback data

// This function now fetches a random selection of 10 questions from the Firestore question bank.
export async function getDailyQuiz(): Promise<Quiz> {
  try {
    const questionsCol = collection(firestore, 'questions');

    // A more efficient way to get random documents in Firestore.
    // 1. Generate a random ID in the valid character set for Firestore document IDs.
    // This creates a new reference in a temporary "imaginary" collection to get a valid random ID.
    const randomId = doc(collection(firestore, 'tmp')).id;
  
    // 2. Query for documents "starting at" our random ID and get 10.
    const q = query(questionsCol, orderBy(documentId()), limit(10));
    
    let querySnapshot = await getDocs(q);
  
    // 3. If the query returns no documents (e.g., collection is empty), use fallback data.
    if (querySnapshot.empty) {
      console.log("No questions found in Firestore, using local fallback data.");
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
      // Ensure the ID is attached, as it might not be in the document data itself
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
