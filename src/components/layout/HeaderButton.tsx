'use client';

import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface HeaderButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'search';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  // Search specific props
  isSearchButton?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  // Tooltip
  tooltip?: string;
}

export default function HeaderButton({
  children,
  icon,
  onClick,
  disabled = false,
  isLoading = false,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  isSearchButton = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm...',
  tooltip
}: HeaderButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Auto focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Handle ESC key to close search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSearchExpanded) {
        setIsSearchExpanded(false);
      }
    };

    if (isSearchExpanded) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchExpanded]);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsSearchExpanded(false);
      }
    };

    if (isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpanded]);

  const baseStyles = 'relative rounded-lg text-sm font-medium transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg';
  
  const sizeStyles = {
    sm: 'px-2 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base'
  };
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-gray-500/25',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/25',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-yellow-500/25',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/25',
    search: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 shadow-gray-500/25',
  };

  const handleSearchClick = () => {
    if (isSearchButton) {
      setIsSearchExpanded(!isSearchExpanded);
    } else {
      onClick?.();
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClick?.();
  };

  // Search button specific rendering
  if (isSearchButton) {
    return (
      <div className="relative flex items-center">
        <button
          ref={buttonRef}
          type={type}
          onClick={handleSearchClick}
          disabled={disabled || isLoading}
          className={cn(
            baseStyles,
            sizeStyles[size],
            variantStyles[variant],
            isSearchExpanded ? 'rounded-r-none' : '',
            className
          )}
          title={tooltip}
          onMouseEnter={() => !isSearchExpanded && setIsExpanded(true)}
          onMouseLeave={() => !isSearchExpanded && setIsExpanded(false)}
        >
          {isLoading && (
            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          )}
          {!isLoading && icon}
          
          {/* Text appears on hover or when search is expanded */}
          <span className={cn(
            'overflow-hidden transition-all duration-300 whitespace-nowrap',
            (isExpanded || isSearchExpanded) ? 'max-w-32 ml-2 opacity-100' : 'max-w-0 ml-0 opacity-0'
          )}>
            {children}
          </span>
        </button>

        {/* Search input */}
        <div
          ref={searchContainerRef}
          className={cn(
            'overflow-hidden transition-all duration-300',
            isSearchExpanded ? 'max-w-64 w-64' : 'max-w-0 w-0'
          )}
        >
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              ref={searchInputRef}
              type="text"
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder={searchPlaceholder}
              className={cn(
                'px-3 py-2 border-l border-gray-300 dark:border-gray-600',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                'rounded-r-lg text-sm placeholder-gray-400 dark:placeholder-gray-500',
                'transition-all duration-200',
                variantStyles[variant].includes('bg-gray') 
                  ? 'border-gray-300 dark:border-gray-600' 
                  : 'border-blue-600'
              )}
            />
            {/* Search submit button - hidden but functional */}
            <button type="submit" className="sr-only">Search</button>
          </form>
        </div>
      </div>
    );
  }

  // Regular button rendering
  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      title={tooltip}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {isLoading && (
        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
      )}
      {!isLoading && icon}
      
      {/* Text appears on hover */}
      <span className={cn(
        'overflow-hidden transition-all duration-300 whitespace-nowrap',
        isExpanded ? 'max-w-32 ml-2 opacity-100' : 'max-w-0 ml-0 opacity-0'
      )}>
        {children}
      </span>
    </button>
  );
}