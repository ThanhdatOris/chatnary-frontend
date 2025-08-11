import { cn } from '@/lib/utils'
import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
  border?: boolean
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  hover = false,
  border = true,
  ...props
}) => {
  const baseStyles = 'rounded-lg bg-white shadow-sm'
  
  const paddingStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  const borderStyles = border ? 'border border-gray-200' : ''
  const hoverStyles = hover ? 'hover:shadow-md transition-shadow duration-200' : ''

  return (
    <div
      className={cn(
        baseStyles,
        paddingStyles[padding],
        borderStyles,
        hoverStyles,
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
  <p className={cn('text-sm text-gray-600', className)}>
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
