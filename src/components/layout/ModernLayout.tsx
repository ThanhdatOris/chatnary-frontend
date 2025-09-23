'use client'

import { Button, NavbarSearch } from '@/components/ui';
import BackgroundToggle from '@/components/ui/BackgroundToggle';
import {
  ArrowLeft,
  BarChart3,
  FileText,
  Library,
  MessageSquare,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ModernLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  showBackButton?: boolean;
  actions?: ReactNode;
}

export default function ModernLayout({ 
  children, 
  title, 
  description, 
  showBackButton = false,
  actions 
}: ModernLayoutProps) {
  const pathname = usePathname();

  const tabs = [
    { id: 'overview', name: 'Tổng quan', icon: BarChart3, href: '/overview' },
    { id: 'files', name: 'Tài liệu', icon: Library, href: '/files' },
    { id: 'chat', name: 'Trò chuyện', icon: MessageSquare, href: '/chat' },
  ];

  return (
    <div className="min-h-screen">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-2 sm:gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Chatnary
              </span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-2 sm:mx-4">
              <NavbarSearch className="w-full" />
            </div>

            {/* Theme & Background Toggles + Actions */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {/* <ThemeToggle /> */}
              <BackgroundToggle compact />
              
              {/* Actions or Quick Add Button - Desktop */}
              <div className="hidden sm:block">
                {actions || (
                  <Link href="/files">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm tài liệu
                    </Button>
                  </Link>
                )}
              </div>
              
              {/* Mobile Action Button */}
              <div className="sm:hidden">
                {actions || (
                  <Link href="/files">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-8 overflow-x-auto mobile-nav-scroll pb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;
              
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-3 sm:px-2 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap touch-target ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {showBackButton && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-gray-600 mt-2">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
