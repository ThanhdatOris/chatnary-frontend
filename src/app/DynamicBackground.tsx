'use client'

import { useEffect, useState } from 'react'

export default function DynamicBackground() {
  const [currentBackground, setCurrentBackground] = useState('bg-gradient-neon')

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem('chatnary-background')
    if (saved) {
      setCurrentBackground(saved)
    }

    // Listen for background changes
    const handleBackgroundChange = (event: CustomEvent) => {
      setCurrentBackground(event.detail.background)
    }

    window.addEventListener('background-change', handleBackgroundChange as EventListener)
    
    return () => {
      window.removeEventListener('background-change', handleBackgroundChange as EventListener)
    }
  }, [])

  return (
    <>
      {/* Main dynamic gradient background */}
      <div className={`fixed inset-0 ${currentBackground} bg-gradient-animated-slow`}></div>
      
      {/* Secondary overlay gradients for depth */}
      <div className="fixed inset-0 bg-gradient-aurora opacity-20 bg-gradient-animated-delay-2"></div>
      <div className="fixed inset-0 bg-gradient-cosmic opacity-10 bg-gradient-animated-delay-4"></div>
    </>
  )
}