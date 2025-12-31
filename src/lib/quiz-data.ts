import type { Quiz } from '@/types/quiz';

export const dailyQuizData: Quiz = {
  id: 'quiz-template',
  date: '2024-01-01',
  questions: [
    {
      questionText:
        "You are in a race and you overtake the person in second place. What position are you in now?",
      options: ['First place', 'Second place', 'Third place', 'Last place'],
      correctIndex: 1,
      difficultyLevel: 1,
    },
    {
      questionText: 'Which number is the odd one out: 9, 25, 49, 63?',
      options: ['9', '25', '49', '63'],
      correctIndex: 3,
      difficultyLevel: 2,
    },
    {
      questionText: "A farmer has 17 sheep. All but 9 die. How many are left?",
      options: ['17', '9', '8', '0'],
      correctIndex: 1,
      difficultyLevel: 3,
    },
    {
      questionText: "What comes next in the sequence: J, F, M, A, M, J, ?",
      options: ['J', 'A', 'S', 'O'],
      correctIndex: 0,
      difficultyLevel: 4,
    },
    {
      questionText:
        "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
      options: ['$0.10', '$1.00', '$0.05', '$0.50'],
      correctIndex: 2,
      difficultyLevel: 5,
    },
    {
      questionText:
        "If you rotate the letter 'b' 180 degrees, what letter do you get?",
      options: ['d', 'p', 'q', 'b'],
      correctIndex: 1,
      difficultyLevel: 6,
    },
    {
      questionText: "What is 15% of 300?",
      options: ['30', '45', '50', '60'],
      correctIndex: 1,
      difficultyLevel: 7,
    },
    {
      questionText: 'In a room with two people, one is the son of the other, but the other person is not his father. Who is the other person?',
      options: ['His uncle', 'His brother', 'His grandfather', 'His mother'],
      correctIndex: 3,
      difficultyLevel: 8,
    },
    {
      questionText: 'If all Zips are Zaps, and some Zaps are Zops, which statement must be true?',
      options: ['All Zips are Zops', 'Some Zips are Zops', 'No Zips are Zops', 'None of the above'],
      correctIndex: 3,
      difficultyLevel: 9,
    },
    {
      questionText: 'I am a word of five letters. People eat me. If you remove the first letter, I become a form of energy. If you remove the first two letters, I am needed for living. What word am I?',
      options: ['Wheat', 'Grape', 'Apple', 'Bread'],
      correctIndex: 0,
      difficultyLevel: 10,
    },
  ],
};
