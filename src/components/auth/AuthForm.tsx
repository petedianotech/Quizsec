"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { BrainCircuit, LogIn } from 'lucide-react';
import { useAuth } from '@/firebase';
import { initiateAnonymousSignIn, initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';


const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type UserFormValue = z.infer<typeof formSchema>;

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = (data: UserFormValue) => {
    setLoading(true);
    if (isLogin) {
      initiateEmailSignIn(auth, data.email, data.password);
    } else {
      initiateEmailSignUp(auth, data.email, data.password);
    }
    // Non-blocking functions; loading state will be handled by onAuthStateChanged listener
    // For now, we'll just show a toast as feedback. A more robust solution
    // would listen for auth errors.
    toast({
        title: `Attempting to ${isLogin ? 'log in' : 'sign up'}...`,
        description: "You will be redirected upon success."
    });
  };

  const handleAnonymousSignIn = () => {
    initiateAnonymousSignIn(auth);
    toast({
        title: "Signing in as guest...",
        description: "You can play the quiz, but your progress won't be saved across devices."
    });
  }

  return (
    <Card className="w-full max-w-md shadow-lg animate-in fade-in zoom-in-95">
       <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold font-headline">MindSprint Daily</CardTitle>
            <CardDescription className="text-lg">
              {isLogin ? "Welcome back! Please sign in." : "Create an account to get started."}
            </CardDescription>
        </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="mr-2 h-4 w-4" /> {isLogin ? 'Log In' : 'Sign Up'}
            </Button>
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
             <Button variant="outline" className="w-full" onClick={handleAnonymousSignIn} disabled={loading}>
              Sign In As Guest
            </Button>
             <p className="text-center text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <Button
                    variant="link"
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="p-0 h-auto font-semibold"
                >
                    {isLogin ? 'Sign up' : 'Log in'}
                </Button>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
