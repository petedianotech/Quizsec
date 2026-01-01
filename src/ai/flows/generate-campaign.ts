
'use server';
/**
 * @fileOverview An AI flow to generate a full trivia campaign with seasons and levels.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { firestore } from '@/firebase/client-side-exports';
import { collection, doc, writeBatch } from 'firebase/firestore';

const QuestionSchema = z.object({
  questionText: z.string().describe('The trivia question text.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
  correctIndex: z.number().min(0).max(3).describe('The index of the correct answer in the options array.'),
  difficultyLevel: z.number().min(1).max(10).describe('The difficulty of the question from 1 to 10.'),
});

const LevelSchema = z.object({
    levelNumber: z.number(),
    title: z.string().describe("A creative and short title for the level."),
    description: z.string().describe("A brief, one-sentence description of the level's theme."),
    questions: z.array(QuestionSchema).length(10).describe("An array of 10 questions for this level.")
});

const SeasonSchema = z.object({
    seasonNumber: z.number(),
    title: z.string().describe("A grand, thematic title for the season."),
    description: z.string().describe("A brief, one-sentence description of the season's overall theme."),
    levels: z.array(LevelSchema).length(10).describe("An array of 10 levels for this season.")
});

const CampaignSchema = z.object({
  campaignTitle: z.string().describe("A title for the entire campaign."),
  seasons: z.array(SeasonSchema).length(20).describe("An array of 20 seasons for the campaign."),
});

const generateCampaignPrompt = ai.definePrompt({
  name: 'generateCampaignPrompt',
  output: { schema: CampaignSchema },
  prompt: `You are a master game designer and trivia creator. Generate a full trivia game campaign with 20 seasons. Each season must have a unique theme (e.g., 'Ancient Empires', 'Cosmic Wonders', 'Literary Giants', 'Pop Culture Flashback'). Each season must contain 10 levels. Each level must have a sub-theme related to the season and contain exactly 10 trivia questions with 4 options each. The difficulty should gradually increase throughout the levels and seasons.`,
});

export const generateCampaignFlow = ai.defineFlow(
  {
    name: 'generateCampaignFlow',
    outputSchema: z.void(),
  },
  async () => {
    console.log('Starting campaign generation...');
    const { output } = await generateCampaignPrompt();
    if (!output) {
      throw new Error('Failed to generate campaign content.');
    }
    console.log(`Generated campaign: ${output.campaignTitle}`);

    const batch = writeBatch(firestore);

    for (const season of output.seasons) {
        const seasonId = `season-${season.seasonNumber}`;
        const seasonRef = doc(firestore, 'seasons', seasonId);
        batch.set(seasonRef, {
            id: seasonId,
            seasonNumber: season.seasonNumber,
            title: season.title,
            description: season.description,
        });
        console.log(`Processing Season ${season.seasonNumber}: ${season.title}`);

        for (const level of season.levels) {
            const levelId = `season-${season.seasonNumber}-level-${level.levelNumber}`;
            const levelRef = doc(firestore, 'seasons', seasonId, 'levels', levelId);
            batch.set(levelRef, {
                id: levelId,
                levelNumber: level.levelNumber,
                seasonId: seasonId,
                title: level.title,
                description: level.description,
            });
            console.log(`  Processing Level ${level.levelNumber}: ${level.title}`);

            for (const question of level.questions) {
                const questionRef = doc(collection(firestore, 'questions'));
                batch.set(questionRef, {
                    ...question,
                    id: questionRef.id,
                    seasonId: seasonId,
                    levelId: levelId,
                });
            }
        }
    }

    console.log('Committing batch to Firestore...');
    await batch.commit();
    console.log('Campaign generation complete and saved to Firestore.');
  }
);
