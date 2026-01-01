
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import Script from 'next/script';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});


export const metadata: Metadata = {
  title: 'Quizsec',
  description: 'How sharp is your mind today?',
  other: {
    'monetag': 'cbfb4eb2eac41b19706971a7d7ff78d5'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={cn("font-body antialiased h-full", fontBody.variable, fontHeadline.variable)}>
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
        <Script id="propeller-ads-banner">
            {`(function(s){s.dataset.zone='10402635',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
        </Script>
      </body>
    </html>
  );
}
