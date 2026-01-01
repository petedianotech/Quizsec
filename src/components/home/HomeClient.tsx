"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, BrainCircuit, ArrowRight, ShieldCheck, LogOut, Settings } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useUser, useAuth } from '@/firebase';
import { AuthForm } from '@/components/auth/AuthForm';
import { doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useEffect } from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useSettingsStore } from '@/store/settings-store';


function SettingsSheet() {
  const { timerEnabled, timerDuration, setTimerEnabled, setTimerDuration } = useSettingsStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="absolute top-4 right-4 text-muted-foreground">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Game Settings</SheetTitle>
          <SheetDescription>Customize your quiz experience.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="timer-switch" className='col-span-2 text-base'>
                Enable Question Timer
              </Label>
              <Switch
                id="timer-switch"
                checked={timerEnabled}
                onCheckedChange={setTimerEnabled}
                className='col-start-1'
              />
            </div>
            {timerEnabled && (
                <div className="grid gap-2">
                    <div className='flex justify-between items-baseline'>
                        <Label htmlFor="timer-duration" className='text-base'>
                            Timer Duration
                        </Label>
                         <span className='text-sm font-bold text-primary w-12 text-center'>{timerDuration}s</span>
                    </div>
                    <Slider
                        id="timer-duration"
                        min={5}
                        max={15}
                        step={1}
                        value={[timerDuration]}
                        onValueChange={(value) => setTimerDuration(value[0])}
                    />
                </div>
            )}
        </div>
      </SheetContent>
    </Sheet>
  );
}


function WelcomeCard() {
  const { user } = useUser();
  const auth = useAuth();
  
  const handleLogout = () => {
    auth.signOut();
  }

  return (
    <Card className="relative w-full max-w-md text-center shadow-lg animate-in fade-in zoom-in-95 border-primary/20">
      <SettingsSheet />
      <CardHeader className="pt-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 border-2 border-primary/20">
            <BrainCircuit className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-4xl font-bold font-headline">Quizsec</CardTitle>
        <CardDescription className="text-lg">
            Welcome, <span className="font-semibold text-primary">{user?.displayName || user?.email}</span>!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Choose your challenge: a quick daily quiz or the epic campaign mode.</p>
      </CardContent>
      <CardFooter className="flex-col gap-3">
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
        <Button variant="link" size="sm" className="text-muted-foreground mt-4" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
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
