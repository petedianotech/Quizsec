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
        <main className="flex h-full w-full flex-col items-center justify-center bg-background p-4">
            <Suspense fallback={<ResultsLoading />}>
                <ResultsClient />
            </Suspense>
        </main>
    );
}
