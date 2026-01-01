
"use client";

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Award, Copy, Home } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast"
import Script from 'next/script';

const getPerformanceLabel = (score: number, total: number): {label: string, description: string} => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return {label: "Elite Thinker", description: "Your mind is exceptionally sharp!"};
    if (percentage >= 70) return {label: "Sharp Mind", description: "A truly impressive performance."};
    if (percentage >= 40) return {label: "Getting Sharp", description: "Solid reasoning and logic skills."};
    return {label: "Still Waking Up", description: "A good warm-up for your brain!"};
};

export function ResultsClient() {
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const score = parseInt(searchParams.get('score') || '0', 10);
    const total = parseInt(searchParams.get('total') || '10', 10);
    const { label, description } = getPerformanceLabel(score, total);
    
    const handleShare = () => {
        const shareText = `I scored ${score}/${total} on MindSprint Daily and earned the rank of "${label}"! How sharp is your mind today?`;
        navigator.clipboard.writeText(shareText).then(() => {
            toast({
                title: "Copied to clipboard!",
                description: "Share your results with your friends.",
            });
        });
    };

    return (
       <div className="flex flex-col w-full h-full">
            <Script id="propeller-ads-banner">
                {`(function(s){s.dataset.zone='10402635',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
            </Script>
            <div className="flex-grow flex items-center justify-center">
                <Card className="w-full max-w-md text-center shadow-lg animate-in fade-in zoom-in-95">
                    <CardHeader>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-4">
                            <Award className="h-10 w-10 text-accent" />
                        </div>
                        <CardTitle className="text-3xl font-bold">Your Result</CardTitle>
                        <CardDescription className="text-lg">You've completed today's quiz.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-baseline justify-center gap-2">
                             <p className="text-6xl font-bold text-primary">{score}</p>
                             <p className="text-2xl text-muted-foreground">/ {total}</p>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-accent">{label}</p>
                            <p className="text-muted-foreground">{description}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                         <Button onClick={handleShare} className="w-full" variant="outline">
                            <Copy className="mr-2 h-4 w-4" /> Share Result
                        </Button>
                        <Button asChild className="w-full" variant="default">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" /> Go to Home
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
             <div className="h-16 flex items-center justify-center text-sm text-muted-foreground/50">
                Ad banner space
            </div>
       </div>
    );
}
