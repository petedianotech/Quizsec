import { QuizClient } from '@/components/game/QuizClient';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function QuizLoading() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your daily quiz...</p>
        </div>
    );
}

export default function QuizPage() {
  return (
    <main className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
        <div className="absolute top-0 left-0 h-full w-full bg-grid-pattern opacity-5" />
        <Suspense fallback={<QuizLoading />}>
            <QuizClient />
        </Suspense>
    </main>
  );
}
