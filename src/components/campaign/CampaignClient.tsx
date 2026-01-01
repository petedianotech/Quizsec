"use client";

import { useCollection } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { collection, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/firebase/client-side-exports';
import type { Season, Level, UserLevelProgress, UserProfile } from '@/types/quiz';
import { Loader2, Lock, Star, Zap, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import Link from 'next/link';

// Function to generate a color theme based on season number
const getSeasonTheme = (seasonNumber: number) => {
    const hue = (seasonNumber * 18) % 360; // Spread hues across the color wheel
    const saturation = 70;
    const lightness = 50;
    const accentLightness = 60;
  
    return {
      '--season-primary-hsl': `${hue}, ${saturation}%, ${lightness}%`,
      '--season-accent-hsl': `${hue}, ${saturation}%, ${accentLightness}%`,
      '--season-border-hsl': `${hue}, ${saturation}%, ${lightness - 10}%`,
      '--season-ring-hsl': `${hue}, ${saturation}%, ${accentLightness}%`,
    } as React.CSSProperties;
};


function LevelItem({ level, seasonNumber, userProgress, isUnlocked, onPlay }: { level: Level; seasonNumber: number; userProgress: UserLevelProgress | undefined, isUnlocked: boolean, onPlay: (levelId: string, seasonId: string) => void }) {
    const isCompleted = userProgress?.completed ?? false;
    const score = userProgress?.score ?? 0;

    const handleClick = () => {
        if (isUnlocked) {
            onPlay(level.id, `season-${seasonNumber}`);
        }
    }

    return (
        <div
            onClick={handleClick}
            className={cn(
                "group flex items-center justify-between rounded-lg border-2 p-4 transition-all",
                !isUnlocked && "bg-muted/30 border-dashed border-muted-foreground/30 text-muted-foreground cursor-not-allowed",
                isUnlocked && !isCompleted && "bg-background border-primary/20 hover:bg-primary/5 hover:border-primary/50 cursor-pointer",
                isCompleted && "bg-green-600/10 border-green-600/30 text-primary cursor-default"
            )}
        >
            <div className="flex items-center gap-4">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted ? 'border-green-500 bg-green-500/20' : 'border-primary/30',
                    isUnlocked && !isCompleted && 'group-hover:border-primary/50 group-hover:bg-primary/10'
                )}>
                    {isCompleted ? <Star className="h-6 w-6 text-yellow-400" /> : isUnlocked ? <Zap className="h-6 w-6 text-primary/70 group-hover:text-primary" /> : <Lock className="h-6 w-6" />}
                </div>
                <div>
                    <h4 className="font-semibold text-lg">{`Level ${level.levelNumber}: ${level.title}`}</h4>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
            </div>
            {isCompleted && (
                <div className="text-right">
                    <p className="font-bold text-lg">{score}/10</p>
                    <p className="text-xs text-muted-foreground">SCORE</p>
                </div>
            )}
             {isUnlocked && !isCompleted && (
                <Zap className="h-6 w-6 text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </div>
    );
}

function SeasonAccordionItem({ season }: { season: Season }) {
    const { user } = useUser();
    const router = useRouter();

    const { data: levels, isLoading: levelsLoading } = useCollection<Level>(
        useMemoFirebase(() =>
            query(collection(firestore, 'seasons', season.id, 'levels'), orderBy('levelNumber')),
        [season.id])
    );
    const { data: userProfile, isLoading: userLoading } = useDoc<UserProfile>(
        useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user])
    );

    const onPlayLevel = (levelId: string, seasonId: string) => {
        router.push(`/quiz?levelId=${levelId}&seasonId=${seasonId}`);
    }

    if (levelsLoading || userLoading) {
        return (
            <div className="flex items-center justify-center p-8 rounded-lg border-2 border-dashed">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const getLevelIsUnlocked = (levelNumber: number) => {
        if (levelNumber === 1) return true; // Level 1 is always unlocked

        const previousLevelNumber = levelNumber - 1;
        const previousLevelProgressKey = `season-${season.seasonNumber}-level-${previousLevelNumber}`;
        const previousLevelProgress = userProfile?.campaignProgress?.[previousLevelProgressKey];

        return previousLevelProgress?.completed ?? false;
    }


    return (
        <AccordionItem value={season.id} className="border-b-0" style={getSeasonTheme(season.seasonNumber)}>
            <AccordionTrigger 
                className="rounded-lg border-2 border-[hsl(var(--season-primary-hsl))] bg-[hsl(var(--season-primary-hsl)/0.1)] p-4 text-left hover:no-underline hover:bg-[hsl(var(--season-primary-hsl)/0.2)] data-[state=open]:rounded-b-none data-[state=open]:border-b-0"
            >
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/20 font-bold text-xl border-2 border-[hsl(var(--season-primary-hsl))]">
                        {season.seasonNumber}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-headline">{season.title}</h3>
                        <p className="text-sm text-muted-foreground">{season.description}</p>
                    </div>
                </div>
                 <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 text-[hsl(var(--season-primary-hsl))]" />
            </AccordionTrigger>
            <AccordionContent 
                className="border-2 border-[hsl(var(--season-primary-hsl))] border-t-0 rounded-b-lg p-4 bg-card"
            >
                <div className="space-y-3">
                    {levels?.map(level => {
                         const progressKey = `season-${season.seasonNumber}-level-${level.levelNumber}`;
                         const progress = userProfile?.campaignProgress?.[progressKey];
                         const isUnlocked = getLevelIsUnlocked(level.levelNumber);

                         return <LevelItem 
                                    key={level.id} 
                                    level={level} 
                                    seasonNumber={season.seasonNumber} 
                                    userProgress={progress} 
                                    isUnlocked={isUnlocked}
                                    onPlay={onPlayLevel}
                                />
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
    <div className="w-full max-w-4xl px-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold font-headline">Campaign Mode</h1>
        <p className="text-lg text-muted-foreground mt-2">Test your knowledge across themed seasons and levels.</p>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {seasons?.map((season) => (
          <SeasonAccordionItem key={season.id} season={season} />
        ))}
      </Accordion>
      <div className="text-center mt-8">
          <Button variant="ghost" asChild>
            <Link href="/">
                &larr; Back to Home
            </Link>
          </Button>
      </div>
    </div>
  );
}
