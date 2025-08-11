import { Button } from '@/components/ui'
import { FileText, MessageSquare, Search, Shield, Upload, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Chatnary</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              Chat with Your
              <span className="text-blue-600"> Documents</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Transform how you interact with documents. Upload, search, and chat with your files using AI. 
              Get instant answers with accurate citations from your document library.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need for document interaction
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features to make your documents more accessible and interactive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
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
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to transform your document workflow?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of users who are already chatting with their documents
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Get Started for Free
              </Button>
            </Link>
          </div>
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
            <div className="text-gray-400 text-sm">
              © 2025 Chatnary. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
