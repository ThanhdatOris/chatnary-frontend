'use client';

import { ReactNode, useEffect, useState } from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(256);

  useEffect(() => {
    // Listen for sidebar width changes
    const handleResize = () => {
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        setSidebarWidth(sidebar.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main style={{ marginLeft: `${sidebarWidth}px` }} className="transition-all duration-200">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

