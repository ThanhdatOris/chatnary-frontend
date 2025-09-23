'use client'

import { ChevronDown, Palette } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const gradientOptions = [
  { 
    name: 'Aurora', 
    key: 'bg-gradient-aurora',
    previewClass: 'gradient-preview-aurora'
  },
  { 
    name: 'Sunset', 
    key: 'bg-gradient-sunset',
    previewClass: 'gradient-preview-sunset'
  },
  { 
    name: 'Ocean', 
    key: 'bg-gradient-ocean',
    previewClass: 'gradient-preview-ocean'
  },
  { 
    name: 'Cosmic', 
    key: 'bg-gradient-cosmic',
    previewClass: 'gradient-preview-cosmic'
  },
  { 
    name: 'Rainbow', 
    key: 'bg-gradient-rainbow',
    previewClass: 'gradient-preview-rainbow'
  },
  { 
    name: 'Neon', 
    key: 'bg-gradient-neon',
    previewClass: 'gradient-preview-neon'
  },
  { 
    name: 'Galaxy', 
    key: 'bg-gradient-galaxy',
    previewClass: 'gradient-preview-galaxy'
  },
  { 
    name: 'Emerald', 
    key: 'bg-gradient-emerald',
    previewClass: 'gradient-preview-emerald'
  },
  { 
    name: 'Fire', 
    key: 'bg-gradient-fire',
    previewClass: 'gradient-preview-fire'
  },
  { 
    name: 'Ice', 
    key: 'bg-gradient-ice',
    previewClass: 'gradient-preview-ice'
  }
]

interface BackgroundToggleProps {
  onBackgroundChange?: (gradient: string) => void
  compact?: boolean
}

export default function BackgroundToggle({ onBackgroundChange, compact = false }: BackgroundToggleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGradient, setSelectedGradient] = useState(gradientOptions[5]) // Default to Neon
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('top')
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('chatnary-background')
    if (saved) {
      const found = gradientOptions.find(g => g.key === saved)
      if (found) {
        setSelectedGradient(found)
      }
    }
  }, [])

  const handleGradientChange = (gradient: typeof gradientOptions[0]) => {
    setSelectedGradient(gradient)
    setIsOpen(false)
    
    // Save to localStorage
    localStorage.setItem('chatnary-background', gradient.key)
    
    // Notify parent component
    if (onBackgroundChange) {
      onBackgroundChange(gradient.key)
    }
  }

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      // Calculate if dropdown should open upward or downward
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const dropdownHeight = 300 // Approximate height of dropdown
      
      // If button is in lower half of screen, open upward
      if (buttonRect.bottom + dropdownHeight > viewportHeight) {
        setDropdownPosition('top')
      } else {
        setDropdownPosition('bottom')
      }
    }
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          compact 
            ? 'bg-transparent hover:bg-white/10 text-foreground'
            : 'bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white'
        }`}
        title="Thay đổi nền"
      >
        <Palette className={`w-4 h-4 ${compact ? 'text-foreground' : 'text-white'}`} />
        <span className={`text-sm font-medium ${compact ? 'hidden sm:inline text-foreground' : 'hidden sm:inline text-white'}`}>
          {selectedGradient.name}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${compact ? 'text-foreground' : 'text-white'}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={`absolute right-0 w-64 bg-white/95 backdrop-blur-md rounded-xl border border-white/30 shadow-xl z-50 overflow-hidden ${
            dropdownPosition === 'top' 
              ? 'bottom-full mb-2' 
              : 'top-full mt-2'
          }`}>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Chọn nền gradient</h3>
              <div className="grid grid-cols-2 gap-2">
                {gradientOptions.map((gradient) => (
                  <button
                    key={gradient.key}
                    onClick={() => handleGradientChange(gradient)}
                    className={`group relative p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedGradient.key === gradient.key 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {/* Gradient Preview */}
                    <div 
                      className={`w-full h-8 rounded-md mb-2 ${gradient.previewClass}`}
                    />
                    
                    {/* Name */}
                    <div className="text-xs font-medium text-gray-900 text-center">
                      {gradient.name}
                    </div>
                    
                    {/* Selected indicator */}
                    {selectedGradient.key === gradient.key && (
                      <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Hook để sử dụng background gradient hiện tại
export function useCurrentBackground() {
  const [currentGradient, setCurrentGradient] = useState('bg-gradient-neon')

  useEffect(() => {
    const saved = localStorage.getItem('chatnary-background')
    if (saved) {
      setCurrentGradient(saved)
    }
  }, [])

  return currentGradient
}