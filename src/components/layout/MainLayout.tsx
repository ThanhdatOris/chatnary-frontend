'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { sidebarWidth, isCollapsed } = useSidebar();
  const pathname = usePathname();
  
  // Chat pages use custom full-height layout
  const isChatPage = pathname?.startsWith('/chat/');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main 
        style={{ marginLeft: isCollapsed ? '64px' : `${sidebarWidth}px` }} 
        className="transition-[margin] duration-200"
      >
        {isChatPage ? (
          children
        ) : (
          <div className="p-6 lg:p-8">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}

