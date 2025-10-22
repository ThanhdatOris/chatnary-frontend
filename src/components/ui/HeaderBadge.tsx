'use client';

import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';

interface HeaderBadgeProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  tooltip?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export default function HeaderBadge({
  label,
  value,
  icon,
  variant = 'primary',
  size = 'md',
  className,
  tooltip,
  isLoading = false,
  onClick
}: HeaderBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const baseStyles = 'relative rounded-lg font-medium transition-all duration-300 flex items-center shadow-sm';
  
  const sizeStyles = {
    sm: 'px-2 py-1.5 text-xs h-8',
    md: 'px-3 py-2 text-sm h-9',
    lg: 'px-4 py-2.5 text-sm h-10'
  };

  const gapStyles = {
    sm: 'gap-1.5',
    md: 'gap-2',
    lg: 'gap-2'
  };
  
  const variantStyles = {
    primary: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    secondary: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700/70 dark:text-gray-300 dark:border-gray-600',
    success: 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    warning: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    danger: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-300 dark:border-red-800',
    info: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 dark:bg-cyan-900/20 dark:hover:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800',
  };

  const Element = onClick ? 'button' : 'div';

  return (
    <Element
      onClick={onClick}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        isExpanded && gapStyles[size],
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      title={tooltip}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Icon */}
      {isLoading ? (
        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      
      {/* Value badge */}
      <span className="flex-shrink-0 font-bold">
        {isLoading ? '...' : value}
      </span>
      
      {/* Label appears on hover */}
      <span className={cn(
        'overflow-hidden transition-all duration-300 whitespace-nowrap',
        isExpanded ? 'max-w-32 opacity-100 ml-1' : 'max-w-0 opacity-0'
      )}>
        {label}
      </span>
    </Element>
  );
}