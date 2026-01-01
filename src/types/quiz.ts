
export interface Question {
  id?: string; // Firestore document ID
  questionText: string;
  options: string[];
  correctIndex: number;
  difficultyLevel: number;
  levelId?: string; // Link question to a level
  seasonId?: string; // Link question to a season
}

export interface Quiz {
  id: string;
  date: string;
  questions: Question[];
}

export interface Level {
    id: string;
    levelNumber: number;
    seasonId: string;
    title: string;
    description: string;
    questions: Question[];
}

export interface Season {
    id: string;
    seasonNumber: number;
    title: string;
    description: string;
    levels: Level[];
}

export interface UserLevelProgress {
    levelId: string;
    seasonId: string;
    score: number;
    completed: boolean;
    unlocked: boolean;
}
