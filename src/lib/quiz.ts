import type { Quiz, Question } from '@/types/quiz';
import { collection, getDocs, limit, query, where, orderBy, startAt, documentId, doc } from 'firebase/firestore';
import { firestore } from '@/firebase/client-side-exports';

// This function now fetches a random selection of 10 questions from the Firestore question bank.
export async function getDailyQuiz(): Promise<Quiz> {
  const questionsCol = collection(firestore, 'questions');
  
  // A more efficient way to get random documents in Firestore.
  // 1. Generate a random ID in the valid character set for Firestore document IDs.
  const randomId = doc(collection(firestore, 'tmp')).id;

  // 2. Query for documents "starting at" our random ID and get 10.
  const q = query(questionsCol, orderBy(documentId()), startAt(randomId), limit(10));
  
  let querySnapshot = await getDocs(q);

  // 3. If we're at the end of the collection and don't get 10, wrap around and fetch from the start.
  if (querySnapshot.docs.length < 10) {
    const wrapAroundQuery = query(questionsCol, limit(10));
    querySnapshot = await getDocs(wrapAroundQuery);
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
}
