import { cn } from '@/lib/utils'
import React, { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
  border?: boolean
  glass?: boolean
  float?: boolean
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  hover = false,
  border = true,
  glass = false,
  float = false,
  ...props
}) => {
  const baseStyles = glass 
    ? 'glass-card theme-transition shadow-glass' 
    : 'rounded-lg bg-background shadow-sm theme-transition'
  
  const paddingStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  const borderStyles = border && !glass ? 'border border-border dark:border-gray-700' : ''
  const hoverStyles = hover ? 'hover:shadow-md transition-all duration-300' : ''
  const floatStyles = float ? 'float-glass' : ''

  return (
    <div
      className={cn(
        baseStyles,
        paddingStyles[padding],
        borderStyles,
        hoverStyles,
        floatStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)}>
    {children}
  </div>
)

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
    {children}
  </h3>
)

const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <p className={cn('text-sm text-muted-foreground', className)}>
    {children}
  </p>
)

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('pt-0', className)}>
    {children}
  </div>
)

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('flex items-center pt-4', className)}>
    {children}
  </div>
)

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
export default Card
