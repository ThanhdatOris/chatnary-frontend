'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type BackgroundContextType = {
  currentBackground: string
  setBackground: (background: string) => void
  availableBackgrounds: {
    name: string
    key: string
    preview: string
  }[]
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

const gradientOptions = [
  { 
    name: 'Aurora', 
    key: 'bg-gradient-aurora',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)'
  },
  { 
    name: 'Sunset', 
    key: 'bg-gradient-sunset',
    preview: 'radial-gradient(ellipse at top, #f093fb 0%, #f5576c 25%, #ff8a56 50%, #ffad56 75%, #c850c0 100%)'
  },
  { 
    name: 'Ocean', 
    key: 'bg-gradient-ocean',
    preview: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 20%, #43e97b 40%, #38f9d7 60%, #667eea 80%, #764ba2 100%)'
  },
  { 
    name: 'Cosmic', 
    key: 'bg-gradient-cosmic',
    preview: 'conic-gradient(from 180deg at 50% 50%, #667eea 0deg, #764ba2 60deg, #f093fb 120deg, #f5576c 180deg, #4facfe 240deg, #00f2fe 300deg, #667eea 360deg)'
  },
  { 
    name: 'Rainbow', 
    key: 'bg-gradient-rainbow',
    preview: 'linear-gradient(90deg, #ff6b6b 0%, #ffa726 16.66%, #ffee58 33.33%, #66bb6a 50%, #42a5f5 66.66%, #ab47bc 83.33%, #ef5350 100%)'
  },
  { 
    name: 'Neon', 
    key: 'bg-gradient-neon',
    preview: 'radial-gradient(circle at 25% 25%, #ff00ff 0%, transparent 50%), radial-gradient(circle at 75% 75%, #00ffff 0%, transparent 50%), linear-gradient(45deg, #ff6b6b, #4ecdc4)'
  },
  { 
    name: 'Galaxy', 
    key: 'bg-gradient-galaxy',
    preview: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)'
  },
  { 
    name: 'Emerald', 
    key: 'bg-gradient-emerald',
    preview: 'linear-gradient(120deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%)'
  },
  { 
    name: 'Fire', 
    key: 'bg-gradient-fire',
    preview: 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 25%, #fecfef 50%, #ff9a9e 75%, #fad0c4 100%)'
  },
  { 
    name: 'Ice', 
    key: 'bg-gradient-ice',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #a8edea 50%, #fed6e3 75%, #ffecd2 100%)'
  }
]

interface BackgroundProviderProps {
  children: React.ReactNode
  defaultBackground?: string
}

export function BackgroundProvider({ 
  children, 
  defaultBackground = 'bg-gradient-neon' 
}: BackgroundProviderProps) {
  const [currentBackground, setCurrentBackground] = useState(defaultBackground)

  useEffect(() => {
    // Load saved preference from localStorage
    const saved = localStorage.getItem('chatnary-background')
    if (saved && gradientOptions.find(g => g.key === saved)) {
      setCurrentBackground(saved)
    } else {
      // Set default if no saved preference or invalid preference
      setCurrentBackground(defaultBackground)
      localStorage.setItem('chatnary-background', defaultBackground)
    }
  }, [defaultBackground])

  const setBackground = (background: string) => {
    setCurrentBackground(background)
    localStorage.setItem('chatnary-background', background)
    
    // Trigger custom event for layout to listen
    window.dispatchEvent(new CustomEvent('background-change', { 
      detail: { background } 
    }))
  }

  return (
    <BackgroundContext.Provider value={{
      currentBackground,
      setBackground,
      availableBackgrounds: gradientOptions
    }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider')
  }
  return context
}