'use client'

import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import SearchInterface from '@/components/search/SearchInterface'
import Loading from '@/components/ui/Loading'
import { useAuth } from '@/hooks/useAuth'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SearchPage() {
  const { user, loading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

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
          <SearchInterface initialQuery={initialQuery} />
        </main>
      </div>
    </div>
  )
}
