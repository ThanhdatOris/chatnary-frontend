'use client';

import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { cn } from '@/lib/utils';
import { ChevronRight, Edit2, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface BreadcrumbProps {
  className?: string;
  showProjectName?: boolean;
}

export default function Breadcrumb({ className, showProjectName = true }: BreadcrumbProps) {
  const { breadcrumbs, projectName, projectColor } = useBreadcrumb();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const handleProjectEdit = () => {
    // Redirect to settings page where project management UI exists with project context
    const settingsUrl = projectId ? `/settings?project=${projectId}` : '/settings';
    window.location.href = settingsUrl;
  };

  // Chỉ hiển thị khi có breadcrumb hoặc có project name
  if (breadcrumbs.length === 0 && !projectName) {
    return null;
  }

  return (
    <nav 
      className={cn(
        'flex items-center gap-2 px-6 py-1.5 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700',
        className
      )}
      aria-label="Breadcrumb"
    >
      <div className="flex items-center justify-between w-full">
        {/* Left side - Project name with breadcrumbs */}
        <div className="flex items-center gap-2">
          {/* Project name as first breadcrumb item */}
          {showProjectName && projectName && (
            <div className="flex items-center text-sm">
              <div 
                className="flex items-center px-3 py-1.5 rounded-lg font-medium shadow-sm bg-transparent border-2 group cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden"
                style={{ 
                  borderColor: projectColor || '#3b82f6',
                  color: projectColor || '#3b82f6'
                }}
              >
                <span className="whitespace-nowrap">{projectName}</span>
                <div className="overflow-hidden transition-all duration-200 w-0 group-hover:w-3 group-hover:ml-1">
                  <button
                    onClick={handleProjectEdit}
                    className="transition-all duration-200 hover:scale-110 w-full h-3 flex items-center justify-center opacity-0 group-hover:opacity-100"
                    title="Chỉnh sửa thông tin project"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {breadcrumbs.length > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
              )}
            </div>
          )}

          {/* Regular breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <ol className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((breadcrumb, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <li key={index} className="flex items-center">
                    {breadcrumb.href && !isLast ? (
                      <Link 
                        href={breadcrumb.href}
                        className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                      >
                        {breadcrumb.icon}
                        <span>{breadcrumb.label}</span>
                      </Link>
                    ) : (
                      <span 
                        className={cn(
                          'flex items-center gap-1.5',
                          breadcrumb.isActive 
                            ? 'text-gray-900 dark:text-gray-100 font-medium' 
                            : 'text-gray-600 dark:text-gray-400'
                        )}
                      >
                        {breadcrumb.icon}
                        <span>{breadcrumb.label}</span>
                      </span>
                    )}

                    {!isLast && (
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
        
        {/* Right side - Navigate to project selection */}
        <div className="flex items-center text-sm">
          <Link href="/">
            <button 
              className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Quay về trang chọn project"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Chọn project</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}