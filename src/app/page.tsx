import { HomeClient } from '@/components/home/HomeClient';

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 animate-pulse rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 animate-pulse rounded-full bg-primary/10 blur-3xl" />
      <HomeClient />
    </main>
  );
}
