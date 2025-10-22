'use client';

import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  showBorder?: boolean;
}

export default function PageHeader({ 
  title, 
  subtitle, 
  actions,
  showBorder = true 
}: PageHeaderProps) {
  return (
    <div className={`h-16 px-6 py-3 flex items-center ${showBorder ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}