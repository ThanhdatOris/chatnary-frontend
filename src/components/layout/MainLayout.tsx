'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { sidebarWidth, isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main 
        style={{ marginLeft: isCollapsed ? '64px' : `${sidebarWidth}px` }} 
        className="transition-[margin] duration-200"
      >
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

