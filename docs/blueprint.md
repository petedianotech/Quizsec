# **App Name**: MindSprint Daily

## Core Features:

- Daily Quiz Generation: Generates a unique daily quiz identified by date (YYYY-MM-DD) and stores it in Firestore. This process is run automatically each day.
- Quiz Display: Displays quiz questions with multiple-choice options, a countdown timer (15 seconds per question), and a progress indicator. Fetches quiz data from Firestore.
- Answer Submission & Validation: Allows users to submit answers, validates the correctness of the answer against the data in Firestore, and prevents re-answering questions.
- Score Tracking: Tracks user's score throughout the quiz, updating after each question.
- Daily Lock Logic: Utilizes localStorage and server-side validation to lock the game after completion, preventing replay until the next day.  Clear completion data at midnight.
- Results Display: Displays the final score, performance label (e.g., 'Sharp', 'Average', 'Elite'), and a shareable text result after quiz completion.
- Firebase Analytics Integration: Logs quiz interactions using Firebase Analytics for data insights.

## Style Guidelines:

- Primary color: Dark blue (#34495E) for a calm, intellectual feel.
- Background color: Off-white (#F5F5F5) to provide high contrast and readability.
- Accent color: Orange (#E67E22) for interactive elements and important CTAs, providing a sense of urgency.
- Body and headline font: 'Inter', a grotesque-style sans-serif known for its modern, neutral, readable qualities. Note: currently only Google Fonts are supported.
- Mobile-first, clean, minimal design optimized for clear presentation on small screens. Reserve bottom space for potential banner ads.
- Simple, high-contrast icons to represent various quiz elements (timer, progress). Note: currently only Google Fonts are supported.
- Subtle transitions between questions to maintain user engagement.