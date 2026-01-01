import { Suspense } from 'react';
import { ResultsClient } from '@/components/game/ResultsClient';
import { Loader2 } from 'lucide-react';

function ResultsLoading() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Calculating your results...</p>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <main className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
            <div className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 animate-pulse rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 animate-pulse rounded-full bg-primary/10 blur-3xl" />
            <Suspense fallback={<ResultsLoading />}>
                <ResultsClient />
            </Suspense>
        </main>
    );
}
