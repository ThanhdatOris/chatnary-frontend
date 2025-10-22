'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import useBreadcrumbNavigation from '@/hooks/useBreadcrumb';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Breadcrumb from './Breadcrumb';
import PageHeader from './PageHeader';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  // Optional header props - if provided, will render consistent header
  headerTitle?: string;
  headerSubtitle?: string;
  headerActions?: ReactNode;
  showHeaderBorder?: boolean;
  // Additional content between header and main content (like search bars)
  headerExtras?: ReactNode;
}

export default function MainLayout({ 
  children, 
  headerTitle,
  headerSubtitle,
  headerActions,
  showHeaderBorder = true,
  headerExtras
}: MainLayoutProps) {
  const { sidebarWidth, isCollapsed } = useSidebar();
  const pathname = usePathname();
  
  // Initialize breadcrumb navigation
  useBreadcrumbNavigation();
  
  // Chat pages use custom full-height layout without padding
  const isChatPage = pathname?.startsWith('/chat');
  const isDocumentsPage = pathname?.startsWith('/documents');
  const isDashboardPage = pathname?.startsWith('/dashboard');
  const isSettingsPage = pathname?.startsWith('/settings');
  const useFullHeight = isChatPage || isDocumentsPage || isDashboardPage || isSettingsPage;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main 
        style={{ marginLeft: isCollapsed ? '64px' : `${sidebarWidth}px` }} 
        className={`transition-[margin] duration-200 ${useFullHeight ? 'h-screen overflow-hidden flex flex-col' : ''}`}
      >
        {useFullHeight ? (
          <div className="h-full flex flex-col">
            {/* Render header if title provided */}
            {headerTitle && (
              <PageHeader
                title={headerTitle}
                subtitle={headerSubtitle}
                actions={headerActions}
                showBorder={showHeaderBorder}
              />
            )}
            
            {/* Header extras like search bars */}
            {headerExtras}
            
            {/* Main content */}
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
            
            {/* Breadcrumb navigation - positioned after content */}
            <Breadcrumb />
          </div>
        ) : (
          <div>
            {/* Show breadcrumb at top for settings page */}
            {isSettingsPage && <Breadcrumb />}
            
            <div className="p-4 lg:p-6">
              {children}
            </div>
            
            {/* Breadcrumb navigation for non-full-height pages (except settings) */}
            {!isSettingsPage && <Breadcrumb />}
          </div>
        )}
      </main>
    </div>
  );
}

