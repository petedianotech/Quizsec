'use server';
/**
 * @fileOverview An AI flow to generate trivia questions and store them in Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { firestore } from '@/firebase/client-side-exports';
import { collection, addDoc } from 'firebase/firestore';

const QuestionSchema = z.object({
  questionText: z.string().describe('The trivia question text.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
  correctIndex: z.number().min(0).max(3).describe('The index of the correct answer in the options array.'),
  difficultyLevel: z.number().min(1).max(10).describe('The difficulty of the question from 1 to 10.'),
});

const GenerateQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema),
});
export type GenerateQuestionsOutput = z.infer<typeof GenerateQuestionsOutputSchema>;

const generateQuestionsPrompt = ai.definePrompt({
  name: 'generateQuestionsPrompt',
  output: { schema: GenerateQuestionsOutputSchema },
  prompt: `You are a master trivia creator. Generate 100 unique and engaging trivia questions on a wide variety of topics (science, history, pop culture, logic puzzles, etc.). Ensure the questions have a good mix of difficulty levels. For each question, provide 4 options and indicate the correct one.`,
});

export const generateQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFlow',
    outputSchema: z.void(),
  },
  async () => {
    const { output } = await generateQuestionsPrompt();
    if (!output) {
      throw new Error('Failed to generate questions.');
    }

    const questionsCollection = collection(firestore, 'questions');

    // Batch write questions to Firestore
    const promises = output.questions.map((question) => {
      return addDoc(questionsCollection, question);
    });

    await Promise.all(promises);
  }
);

// We can create a separate flow or a simple function to trigger this.
// For now, it can be manually triggered from a development environment.
// For example, by calling it from a script or a test.
