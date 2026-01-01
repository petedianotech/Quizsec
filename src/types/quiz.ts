export interface Question {
  id?: string; // Firestore document ID
  questionText: string;
  options: string[];
  correctIndex: number;
  difficultyLevel: number;
}

export interface Quiz {
  id: string;
  date: string;
  questions: Question[];
}
