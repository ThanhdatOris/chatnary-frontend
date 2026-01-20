'use client';

import { HeaderBadge } from '@/components/ui';
import useBreadcrumbNavigation from '@/hooks/useBreadcrumb';
import { useProject } from '@/hooks/useProject';
import { FileText, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import PageHeader from './PageHeader';

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
  const isNotebookPage = pathname?.startsWith('/notebook');
  const useFullHeight = isChatPage || isDocumentsPage || isDashboardPage || isSettingsPage || isNotebookPage;

  return (
    <>
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
        </div>
      ) : (
        <div>
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </div>
      )}
    </>
  );
}

