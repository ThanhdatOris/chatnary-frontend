import { ModalProps } from '@/lib/types'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import React from 'react'
import Button from './Button'

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Handle ESC key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-modal backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          'relative w-full rounded-lg bg-background shadow-xl',
          sizes[size],
          'mx-4 my-8 max-h-[90vh] overflow-hidden'
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="max-h-[calc(90vh-8rem)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
