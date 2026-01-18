'use client';

import { HeaderBadge } from '@/components/ui';
import { useSidebar } from '@/contexts/SidebarContext';
import useBreadcrumbNavigation from '@/hooks/useBreadcrumb';
import { useProject } from '@/hooks/useProject';
import { FileText, MessageSquare } from 'lucide-react';
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
  // Project statistics in header
  showProjectStats?: boolean;
}

export default function MainLayout({ 
  children, 
  headerTitle,
  headerSubtitle,
  headerActions,
  showHeaderBorder = true,
  headerExtras,
  showProjectStats = false
}: MainLayoutProps) {
  const { sidebarWidth, isCollapsed } = useSidebar();
  const pathname = usePathname();
  const { project } = useProject();
  
  // Initialize breadcrumb navigation
  useBreadcrumbNavigation();
  
  // Create project stats component
  const projectStats = showProjectStats && project ? (
    <div className="flex items-center gap-3">
      <HeaderBadge
        label="tài liệu"
        value={project.documentsCount || 0}
        icon={<FileText className="w-4 h-4" />}
        variant="info"
        size="md"
        tooltip="Số lượng tài liệu trong project"
        onClick={() => {
          window.location.href = `/documents?project=${project.id}`;
        }}
      />
      <HeaderBadge
        label="cuộc trò chuyện"
        value={project.chatsCount || 0}
        icon={<MessageSquare className="w-4 h-4" />}
        variant="success"
        size="md"
        tooltip="Số lượng cuộc trò chuyện trong project"
        onClick={() => {
          window.location.href = `/history?project=${project.id}`;
        }}
      />
    </div>
  ) : null;
  
  // Combine header actions with project stats
  const combinedHeaderActions = (
    <div className="flex items-center gap-3">
      {projectStats}
      {headerActions}
    </div>
  );
  
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
                actions={combinedHeaderActions}
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

