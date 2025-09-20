'use client'

import ChatLayout from '@/components/chat/ChatLayout'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Loading from '@/components/ui/Loading'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export default function ChatPage() {
  const { user, loading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header 
        user={user}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 min-h-0">
          <ChatLayout className="h-full" />
        </main>
      </div>
    </div>
  )
}
