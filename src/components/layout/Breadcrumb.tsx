'use client';

import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { cn } from '@/lib/utils';
import { ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbProps {
  className?: string;
  showProjectName?: boolean;
}

export default function Breadcrumb({ className, showProjectName = true }: BreadcrumbProps) {
  const { breadcrumbs, projectName } = useBreadcrumb();

  // Chỉ hiển thị khi có breadcrumb hoặc có project name
  if (breadcrumbs.length === 0 && !projectName) {
    return null;
  }

  return (
    <nav 
      className={cn(
        'flex items-center gap-2 px-6 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700',
        className
      )}
      aria-label="Breadcrumb"
    >
      <div className="flex items-center justify-between w-full">
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
        
        {/* Project name displayed on the right */}
        {showProjectName && projectName && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FileText className="w-4 h-4" />
            <span className="font-medium">{projectName}</span>
          </div>
        )}
      </div>
    </nav>
  );
}