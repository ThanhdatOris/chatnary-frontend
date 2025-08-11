import { InputProps } from '@/lib/types'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'
import React from 'react'

const Input: React.FC<InputProps & React.InputHTMLAttributes<HTMLInputElement>> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className,
  ...props
}) => {
  const baseStyles = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  
  const errorStyles = error ? 'border-red-500 focus-visible:ring-red-500' : ''

  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        className={cn(baseStyles, errorStyles, className)}
        {...props}
      />
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="mr-1 h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}

export default Input
