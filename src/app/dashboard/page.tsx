'use client'

import { Button } from '@/components/ui';
import {
    BarChart3,
    FileText,
    Library,
    MessageSquare,
    Plus,
    Search,
    Sparkles,
    Upload
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function DashboardPage() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Tổng quan', icon: BarChart3 },
    { id: 'files', name: 'Tài liệu', icon: Library, href: '/files' },
    { id: 'chat', name: 'Trò chuyện', icon: MessageSquare, href: '/chat' },
  ];

  const quickActions = [
    {
      title: 'Tải lên tài liệu',
      description: 'Thêm tài liệu mới để bắt đầu trò chuyện',
      icon: Upload,
      href: '/files',
      color: 'bg-blue-500 hover:bg-blue-600',
      iconBg: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Bắt đầu chat',
      description: 'Tạo cuộc trò chuyện mới với AI',
      icon: MessageSquare,
      href: '/chat',
      color: 'bg-green-500 hover:bg-green-600',
      iconBg: 'bg-green-100 text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Chatnary
              </span>
            </Link>

            {/* Quick Add Button */}
            <Link href="/files">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Thêm tài liệu
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === 'overview' && pathname === '/dashboard' || pathname === tab.href;
              
              return tab.href ? (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </Link>
              ) : (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
            <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Chào mừng trở lại!
              </h1>
          </div>
          <p className="text-lg text-gray-600">
            Sẵn sàng khám phá và trò chuyện với tài liệu của bạn
              </p>
            </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className={`w-12 h-12 ${action.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tài liệu</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Library className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cuộc trò chuyện</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tìm kiếm</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-xs text-gray-500 mt-1">Sử dụng thanh tìm kiếm</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          </div>
        </main>
    </div>
  );
}
