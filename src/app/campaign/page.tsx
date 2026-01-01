import { CampaignClient } from '@/components/campaign/CampaignClient';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { HomeClient } from '@/components/home/HomeClient';

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
             <main className="flex h-full w-full flex-col items-center justify-center bg-background p-4">
                <div className="absolute top-4 left-4">
                    <SidebarTrigger />
                </div>
                <Suspense fallback={<CampaignLoading />}>
                    <CampaignClient />
                </Suspense>
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
