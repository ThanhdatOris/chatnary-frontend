import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function Loading({ size = 'md', text, className, ...props }: LoadingProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };
  
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)} {...props}>
      <div className={cn('animate-spin rounded-full border-4 border-gray-200 border-t-blue-600', sizes[size])} />
      {text && <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );
}

// Skeleton loader
export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('animate-pulse bg-gray-200 dark:bg-gray-700 rounded', className)}
    {...props}
  />
);

