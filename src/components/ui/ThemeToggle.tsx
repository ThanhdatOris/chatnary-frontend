'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Moon, Sun } from 'lucide-react'
import React from 'react'

interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'button' | 'switch'
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  size = 'md',
  variant = 'button'
}) => {
  const { theme, toggleTheme } = useTheme()

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'glass-card border-0',
          theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200',
          className
        )}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform flex items-center justify-center',
            theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
          )}
        >
          {theme === 'light' ? (
            <Sun className="w-2 h-2 text-yellow-500" />
          ) : (
            <Moon className="w-2 h-2 text-blue-500" />
          )}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'glass-card border-0 rounded-full flex items-center justify-center',
        'hover:scale-105 active:scale-95 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'text-gray-700 dark:text-gray-300',
        sizeClasses[size],
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Sun className={cn(iconSizes[size], 'text-yellow-500')} />
      ) : (
        <Moon className={cn(iconSizes[size], 'text-blue-500')} />
      )}
    </button>
  )
}

export default ThemeToggle
