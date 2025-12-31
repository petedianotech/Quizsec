export interface Question {
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
