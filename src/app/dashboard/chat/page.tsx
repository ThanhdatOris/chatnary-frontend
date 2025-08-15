'use client'

import ChatInterface from '@/components/chat/ChatInterface'
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
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <div className="flex min-h-screen">
        <Sidebar 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 lg:ml-64 p-6 lg:p-8">
          <ChatInterface />
        </main>
      </div>
    </div>
  )
}
