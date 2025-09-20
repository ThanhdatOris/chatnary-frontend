import { cn } from '@/lib/utils'
import React from 'react'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  helperText?: string
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, error, label, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
            "disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)

TextInput.displayName = 'TextInput'

export default TextInput
