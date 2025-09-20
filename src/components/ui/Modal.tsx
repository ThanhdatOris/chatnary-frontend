import { ModalProps } from '@/lib/types'
import { cn } from '@/lib/utils'
import React from 'react'

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
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
      className="fixed inset-0 z-[55] flex items-center justify-center bg-modal backdrop-blur-md"
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          'relative w-full rounded-lg glass-card shadow-2xl border border-border/20 overflow-y-auto',
          sizes[size],
          'mx-4 my-8'
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
