
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
}

export interface Season {
    id:string;
    seasonNumber: number;
    title: string;
    description: string;
}

export interface UserLevelProgress {
    levelId: string;
    seasonId: string;
    score: number;
    completed: boolean;
    unlocked: boolean;
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    campaignProgress?: {
        [key: string]: UserLevelProgress;
    };
}
