'use client'

import ChatHistoryManager from '@/components/chat/ChatHistoryManager'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Loading from '@/components/ui/Loading'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export default function ChatHistoryPage() {
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
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <ChatHistoryManager />
        </main>
      </div>
    </div>
  )
}
