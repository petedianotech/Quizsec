
import { CampaignClient } from '@/components/campaign/CampaignClient';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { HomeClient } from '@/components/home/HomeClient';
import Script from 'next/script';

function CampaignLoading() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading Campaign...</p>
        </div>
    );
}

export default function CampaignPage() {
  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                 <HomeClient />
            </SidebarHeader>
        </Sidebar>
        <SidebarInset>
             <main className="flex h-full w-full flex-col bg-background">
                 <div className="flex-grow flex flex-col items-center justify-center p-4">
                    <div className="absolute top-4 left-4">
                        <SidebarTrigger />
                    </div>
                    <Suspense fallback={<CampaignLoading />}>
                        <CampaignClient />
                    </Suspense>
                </div>
                <div className="h-16 flex items-center justify-center text-sm text-muted-foreground/50">
                    <Script id="propeller-ads-banner-campaign">
                        {`(function(s){s.dataset.zone='10402635',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
                    </Script>
                    <Script
                        src="https://quge5.com/88/tag.min.js"
                        data-zone="197925"
                        async
                        data-cfasync="false"
                    ></Script>
                    Ad banner space
                </div>
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
