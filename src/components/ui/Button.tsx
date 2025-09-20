import { ButtonProps } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import React from 'react'

const Button: React.FC<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  className,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-ring',
    outline: 'border border-border bg-transparent text-foreground hover:bg-muted focus-visible:ring-ring',
    ghost: 'text-foreground hover:bg-muted focus-visible:ring-ring',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500'
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg'
  }

  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

export default Button
