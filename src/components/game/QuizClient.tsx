
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDailyQuiz, getCampaignQuiz } from '@/lib/quiz';
import type { Quiz, Question, UserProfile } from '@/types/quiz';
import { QuestionCard } from './QuestionCard';
import { Loader2 } from 'lucide-react';
import { logQuizStart, logQuestionAnswer, logQuizComplete } from '@/lib/analytics';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useSettingsStore } from '@/store/settings-store';
import Script from 'next/script';

export function QuizClient() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { timerEnabled } = useSettingsStore();

  const levelId = searchParams.get('levelId');
  const seasonId = searchParams.get('seasonId');
  const isCampaignMode = !!levelId && !!seasonId;

  const { data: userProfile } = useDoc<UserProfile>(
    useMemo(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore])
  );

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const quizData = isCampaignMode
          ? await getCampaignQuiz(seasonId!, levelId!)
          : await getDailyQuiz();
        
        setQuiz(quizData);
        if (user) {
            logQuizStart();
        }
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [user, seasonId, levelId, isCampaignMode]);

  const currentQuestion: Question | undefined = useMemo(
    () => quiz?.questions[currentQuestionIndex],
    [quiz, currentQuestionIndex]
  );
  
  const handleNextQuestion = useCallback(async () => {
    if (!quiz) return;

    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedAnswerIndex(null);
    } else {
      // End of quiz
      const finalScore = score;
      logQuizComplete(finalScore, quiz.questions.length);

      if (user && firestore) {
        const quizSessionId = isCampaignMode ? `${seasonId}-${levelId}` : quiz.id;
        const sessionRef = doc(firestore, 'users', user.uid, 'userQuizSessions', quizSessionId);
        setDocumentNonBlocking(sessionRef, {
            id: quizSessionId,
            userId: user.uid,
            quizId: quiz.id,
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            score: finalScore,
            ...(isCampaignMode && { seasonId, levelId })
        }, { merge: true });

        if (isCampaignMode) {
          const userRef = doc(firestore, 'users', user.uid);
          const progressKey = `campaignProgress.season-${seasonId.split('-')[1]}-level-${levelId.split('-')[3]}`;
          
          // Unlock next level if this one is passed (score > 5)
          const passed = finalScore > 5;
          if (passed) {
              const currentLevelNumber = parseInt(levelId.split('-')[3], 10);
              const nextLevelNumber = currentLevelNumber + 1;
              if (nextLevelNumber <= 10) { // Assuming 10 levels per season
                const nextLevelKey = `campaignProgress.season-${seasonId.split('-')[1]}-level-${nextLevelNumber}`;
                 await updateDoc(userRef, {
                    [nextLevelKey + '.unlocked']: true
                });
              }
          }

          const currentProgress = userProfile?.campaignProgress?.[progressKey.replace('campaignProgress.', '')] ?? { score: 0 };
          if(finalScore > currentProgress.score) {
            await updateDoc(userRef, {
                [progressKey]: {
                    levelId: levelId,
                    seasonId: seasonId,
                    score: finalScore,
                    completed: true,
                    unlocked: true, 
                }
            });
          }
        }
      }
      if (isCampaignMode) {
        router.push(`/campaign`);
      } else {
        router.push(`/results?score=${finalScore}&total=${quiz.questions.length}`);
      }
    }
  }, [currentQuestionIndex, quiz, router, score, user, firestore, isCampaignMode, seasonId, levelId, userProfile]);
  
  const confirmAnswer = useCallback((answerIndex: number | null) => {
    if (!currentQuestion) return;

    setIsAnswered(true);

    const isCorrect = answerIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (user) {
      logQuestionAnswer(currentQuestionIndex, isCorrect);
    }

    // Wait for 1.5 seconds to show the result, then move to the next question.
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);

  }, [currentQuestion, currentQuestionIndex, user, handleNextQuestion]);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswerIndex(answerIndex);

    // If timer is off, show selection for a moment, then confirm.
    if (!timerEnabled) {
      setTimeout(() => {
        confirmAnswer(answerIndex);
      }, 300);
    } else {
      // If timer is on, confirm immediately as the timer will be paused.
      confirmAnswer(answerIndex);
    }
  }, [isAnswered, confirmAnswer, timerEnabled]);

  const handleTimeUp = useCallback(() => {
    if (isAnswered) return;
    
    // When time is up, we don't have a selected answer, so we pass null.
    setSelectedAnswerIndex(null); 
    confirmAnswer(null);

  }, [isAnswered, confirmAnswer]);


  if (isLoading || !quiz || !currentQuestion) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Preparing your challenge...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <Script id="propeller-ads-banner">
        {`(function(s){s.dataset.zone='10402635',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
      </Script>
      <Script
        src="https://quge5.com/88/tag.min.js"
        data-zone="197925"
        async
        data-cfasync="false"
      ></Script>
      <div className="flex-grow flex items-center justify-center">
        <QuestionCard
            key={currentQuestionIndex}
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quiz.questions.length}
            onAnswer={handleAnswer}
            onTimeUp={handleTimeUp}
            isAnswered={isAnswered}
            selectedAnswerIndex={selectedAnswerIndex}
            isCampaignMode={isCampaignMode}
        />
      </div>
      <div className="h-16 flex items-center justify-center text-sm text-muted-foreground/50">
        Ad banner space
      </div>
    </div>
  );
}
