"use client";

import { useCollection } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { collection, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/firebase/client-side-exports';
import type { Season, Level, UserLevelProgress } from '@/types/quiz';
import { Loader2, Lock, Star, Zap } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';

// Function to generate a color theme based on season number
const getSeasonTheme = (seasonNumber: number) => {
    const hue = (seasonNumber * 18) % 360; // Spread hues across the color wheel
    const saturation = 70;
    const lightness = 50;
    const accentLightness = 60;
  
    return {
      '--season-primary': `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      '--season-primary-foreground': `hsl(${hue}, ${saturation}%, 98%)`,
      '--season-accent': `hsl(${hue}, ${saturation}%, ${accentLightness}%)`,
      '--season-accent-foreground': `hsl(${hue}, ${saturation}%, 15%)`,
      '--season-border': `hsl(${hue}, ${saturation}%, ${lightness - 10}%)`,
      '--season-ring': `hsl(${hue}, ${saturation}%, ${accentLightness}%)`,
    } as React.CSSProperties;
};


function LevelItem({ level, seasonNumber, userProgress }: { level: Level; seasonNumber: number; userProgress: UserLevelProgress | undefined }) {
    const isUnlocked = userProgress?.unlocked ?? level.levelNumber === 1; // First level is always unlocked
    const isCompleted = userProgress?.completed ?? false;
    const score = userProgress?.score ?? 0;

    return (
        <div
            className={cn(
                "flex items-center justify-between rounded-lg border p-4 transition-all",
                !isUnlocked && "bg-muted/50 text-muted-foreground",
                isUnlocked && !isCompleted && "bg-accent/10 hover:bg-accent/20 cursor-pointer",
                isCompleted && "bg-green-600/10 border-green-600/30 text-primary"
            )}
            style={isUnlocked ? getSeasonTheme(seasonNumber) : {}}
        >
            <div className="flex items-center gap-4">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border-2",
                    isCompleted ? 'border-green-500 bg-green-500/20' : 'border-current'
                )}>
                    {isCompleted ? <Star className="h-5 w-5 text-yellow-400" /> : isUnlocked ? <Zap className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <div>
                    <h4 className="font-semibold">{level.title}</h4>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
            </div>
            {isCompleted && (
                <div className="text-right">
                    <p className="font-bold text-lg">{score}/10</p>
                    <p className="text-xs text-muted-foreground">SCORE</p>
                </div>
            )}
        </div>
    );
}

function SeasonAccordionItem({ season }: { season: Season }) {
    const { user } = useUser();
    const { data: levels, isLoading: levelsLoading } = useCollection<Level>(
        useMemoFirebase(() =>
            query(collection(firestore, 'seasons', season.id, 'levels'), orderBy('levelNumber')),
        [season.id])
    );
    const { data: userProfile, isLoading: userLoading } = useDoc(
        useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user])
    );

    if (levelsLoading || userLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <AccordionItem value={season.id} className="border-b-0">
            <AccordionTrigger 
                className="rounded-lg border-2 p-4 text-left data-[state=open]:rounded-b-none data-[state=open]:border-b-0"
                style={getSeasonTheme(season.seasonNumber)}
            >
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/20 font-bold text-xl">
                        {season.seasonNumber}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{season.title}</h3>
                        <p className="text-sm opacity-80">{season.description}</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent 
                className="border-2 border-t-0 rounded-b-lg p-4"
                style={getSeasonTheme(season.seasonNumber)}
            >
                <div className="space-y-3">
                    {levels?.map(level => {
                         const progress = userProfile?.campaignProgress?.[`season-${season.seasonNumber}-level-${level.levelNumber}`];
                         return <LevelItem key={level.id} level={level} seasonNumber={season.seasonNumber} userProgress={progress} />
                    })}
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}

export function CampaignClient() {
  const { data: seasons, isLoading } = useCollection<Season>(
    useMemoFirebase(() => 
        query(collection(firestore, 'seasons'), orderBy('seasonNumber')),
    [])
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading campaign...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-2 font-headline">Campaign Mode</h1>
      <p className="text-center text-muted-foreground mb-8">Test your knowledge across themed seasons and levels.</p>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {seasons?.map((season) => (
          <SeasonAccordionItem key={season.id} season={season} />
        ))}
      </Accordion>
    </div>
  );
}
