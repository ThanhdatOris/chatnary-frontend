'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeaderButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
  type?: 'button' | 'submit';
}

export default function HeaderButton({
  children,
  onClick,
  disabled = false,
  isLoading = false,
  variant = 'primary',
  className,
  type = 'button'
}: HeaderButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {isLoading && (
        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
      )}
      {children}
    </button>
  );
}