'use client'

import { Button } from '@/components/ui'
import Loading from '@/components/ui/Loading'
import { useAuth } from '@/hooks/useAuth'
import { FileText, MessageSquare, Search, Shield, Upload, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePageClient() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    )
  }

  // If user is logged in, don't show home page content (will redirect)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    )
  }

  const features = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Drag & drop your documents (PDF, DOCX, TXT) for instant processing'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find content across all your documents with full-text search powered by AI'
    },
    {
      icon: MessageSquare,
      title: 'Chat with Documents',
      description: 'Ask questions about your documents and get accurate answers with citations'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your documents are encrypted and stored securely with user-level access control'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant search results and real-time chat responses powered by advanced AI'
    },
    {
      icon: FileText,
      title: 'Multiple Formats',
      description: 'Support for various document formats including PDF, Word, and plain text'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <header className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">Chatnary</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Đăng nhập</Button>
              </Link>
              <Link href="/register">
                <Button>Đăng ký</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Chat with Your{' '}
              <span className="gradient-text">Documents</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Upload your documents and start chatting with them using AI. 
              Search, ask questions, and get instant answers from your own knowledge base.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="px-8 py-3">
                  Bắt đầu miễn phí
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-3">
                Xem demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything you need to manage documents
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make document management and interaction effortless.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="p-6 rounded-lg border border-border hover:border-blue-300 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to transform your document workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already chatting with their documents.
          </p>
          <Link href="/register">
            <Button size="lg" variant="outline" className="bg-background text-blue-600 hover:bg-muted px-8 py-3">
              Bắt đầu ngay hôm nay
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Chatnary</span>
            </div>
            <div className="text-muted-foreground text-sm">
              © 2025 Chatnary. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
