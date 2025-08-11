'use client'

import { useEffect } from 'react'

export default function DevTools() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Add dev tools to window for easy access
      (window as any).devTools = {
        clearCache: () => {
          if ('caches' in window) {
            caches.keys().then(names => {
              names.forEach(name => {
                caches.delete(name)
              })
            })
          }
          localStorage.clear()
          sessionStorage.clear()
          console.log('🧹 Cache cleared!')
        },
        
        hardRefresh: () => {
          window.location.reload()
        },
        
        debugAuth: () => {
          const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('auth_token='))
            ?.split('=')[1]
          
          const user = localStorage.getItem('user')
          
          console.log('🔐 Auth Debug:', {
            token: token ? 'Present' : 'Missing',
            tokenLength: token?.length || 0,
            user: user ? JSON.parse(user) : null,
            cookies: document.cookie,
            localStorage: { ...localStorage }
          })
        }
      }
      
      // Add keyboard shortcuts
      const handleKeyDown = (e: KeyboardEvent) => {
        // Ctrl+Shift+R - Hard refresh
        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
          e.preventDefault()
          ;(window as any).devTools.hardRefresh()
        }
        
        // Ctrl+Shift+C - Clear cache
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
          e.preventDefault()
          ;(window as any).devTools.clearCache()
        }
        
        // Ctrl+Shift+D - Debug auth
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
          e.preventDefault()
          ;(window as any).devTools.debugAuth()
        }
      }
      
      window.addEventListener('keydown', handleKeyDown)
      
      console.log('🛠️ Dev Tools loaded! Available commands:')
      console.log('- window.devTools.clearCache() or Ctrl+Shift+C')
      console.log('- window.devTools.hardRefresh() or Ctrl+Shift+R') 
      console.log('- window.devTools.debugAuth() or Ctrl+Shift+D')
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [])

  // Don't render anything in production
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-2 rounded text-xs font-mono opacity-20 hover:opacity-100 transition-opacity">
      Dev Mode
      <div className="text-[10px] mt-1">
        Ctrl+Shift+C: Clear Cache<br/>
        Ctrl+Shift+R: Hard Refresh<br/>
        Ctrl+Shift+D: Debug Auth
      </div>
    </div>
  )
}
