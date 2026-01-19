'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { usePathname } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import GlobalHeader from './GlobalHeader';
import Sidebar from './Sidebar';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { sidebarWidth, isCollapsed } = useSidebar();
  const pathname = usePathname();

  // Define routes that should NOT have the main layout structure (No Sidebar/Header)
  const isAuthPage = pathname?.startsWith('/auth');
  const isLandingPage = pathname === '/';
  
  const shouldHideLayout = isAuthPage || isLandingPage;

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Global Header */}
      <Suspense fallback={<div className="h-12 border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" />}>
        <GlobalHeader />
      </Suspense>
      
      {/* Content Area with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Suspense fallback={<div className="w-[300px] border-r bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" />}>
          <Sidebar />
        </Suspense>
        <main 
          style={{ marginLeft: isCollapsed ? '64px' : `${sidebarWidth}px` }} 
          className="flex-1 transition-[margin] duration-200 flex flex-col overflow-hidden w-full"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
