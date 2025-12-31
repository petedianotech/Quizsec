/**
 * In a real app, you would initialize Firebase here and use its analytics library.
 * For this MVP, we'll use placeholder functions.
 */

// A generic event logging function
export const logEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
  // In a real app, this would be: firebase.analytics().logEvent(eventName, eventParams);
  console.log(`[Analytics] Event: ${eventName}`, eventParams);
};

// Specific event logging functions for the quiz
export const logQuizStart = () => {
  logEvent('quiz_start', { date: new Date().toISOString().split('T')[0] });
};

export const logQuestionAnswer = (questionIndex: number, isCorrect: boolean) => {
  logEvent('question_answer', {
    question_index: questionIndex,
    is_correct: isCorrect,
  });
};

export const logQuizComplete = (score: number, totalQuestions: number) => {
  logEvent('quiz_complete', {
    score: score,
    total_questions: totalQuestions,
  });
};
