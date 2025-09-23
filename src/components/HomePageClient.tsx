'use client'

import { Button } from '@/components/ui'
import { ArrowRight, FileText, MessageSquare, Search, Upload } from 'lucide-react'
import Link from 'next/link'
import OverviewExtras from './OverviewExtras'

export default function HomePageClient() {

  const quickActions = [
    {
      icon: Upload,
      title: 'Upload & Chat',
      description: 'Tải tài liệu và bắt đầu trò chuyện ngay',
      href: '/files',
      color: 'bg-blue-500'
    },
    {
      icon: Search,
      title: 'Search Documents',
      description: 'Tìm kiếm nhanh trong tài liệu',
      href: '/chat',
      color: 'bg-green-500'
    },
    {
      icon: MessageSquare,
      title: 'Start Chatting',
      description: 'Bắt đầu cuộc trò chuyện mới',
      href: '/chat',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Modern Minimal Header */}
      <header className="absolute top-0 w-full z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Chatnary
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Centered & Focused */}
      <section className="relative flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                Chat với
              </span>
              <br />
              <span className="text-gray-900">Tài liệu của bạn</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Tải lên, tìm kiếm và trò chuyện với tài liệu thông qua AI một cách thông minh và nhanh chóng.
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon
              return (
                <Link key={index} href={action.href} className="block h-full">
                  <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
                    <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-1">
                      {action.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-purple-600 transition-colors">
                      Bắt đầu
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Main CTA */}
          <div className="space-y-4">
            <Link href="/files">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Khám phá ngay
              </Button>
            </Link>
            <p className="text-sm text-gray-500">
              Không cần đăng ký • Miễn phí sử dụng
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </section>

      {/* Overview extras */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <OverviewExtras />
        </div>
      </section>
    </div>
  )
}
