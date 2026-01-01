import { HomeClient } from '@/components/home/HomeClient';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <HomeClient />
    </main>
  );
}
