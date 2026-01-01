"use client";

import { useDailyLock } from '@/hooks/use-daily-lock';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, CheckCircle, BrainCircuit, ArrowRight, ShieldCheck } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useUser } from '@/firebase';
import { AuthForm } from '@/components/auth/AuthForm';
import { doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useEffect } from 'react';

function WelcomeCard() {
  const { isCompletedToday, score } = useDailyLock();

  if (isCompletedToday) {
    return (
      <Card className="w-full max-w-md text-center shadow-lg animate-in fade-in zoom-in-95">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Quiz Completed!</CardTitle>
          <CardDescription>
            You scored {score}/10 today. Great job!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Come back tomorrow for a new set of challenges or try our new campaign mode!</p>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Button asChild className="w-full" size="lg">
              <Link href="/campaign">
                Play Campaign <ShieldCheck className="ml-2 h-5 w-5" />
              </Link>
            </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md text-center shadow-lg animate-in fade-in zoom-in-95">
      <CardHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <BrainCircuit className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold font-headline">MindSprint</CardTitle>
        <CardDescription className="text-lg">Daily Quiz & Campaign</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Choose your challenge: the quick daily quiz or the epic campaign mode.</p>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button asChild className="w-full" size="lg">
          <Link href="/quiz">
            Start Today's Quiz <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button asChild className="w-full" size="lg" variant="secondary">
          <Link href="/campaign">
            Play Campaign <ShieldCheck className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


export function HomeClient() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  
  useEffect(() => {
    if (user && userDocRef) {
      // When a user is authenticated, we create their user profile document
      // in Firestore. We use `set` with `merge: true` to avoid overwriting
      // the document if it already exists.
      const userData = {
        id: user.uid,
        email: user.email,
        username: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        createdAt: new Date().toISOString(),
      };
      setDocumentNonBlocking(userDocRef, userData, { merge: true });
    }
  }, [user, userDocRef]);


  if (isUserLoading) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <WelcomeCard />;
}
