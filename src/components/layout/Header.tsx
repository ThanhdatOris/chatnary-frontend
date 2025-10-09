'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../ui/ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Chatnary
          </span>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
              pathname === '/dashboard'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/documents"
            className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
              pathname === '/documents'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Tài liệu
          </Link>
          <Link
            href="/chat"
            className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
              pathname?.startsWith('/chat')
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Chat
          </Link>
          <Link
            href="/history"
            className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
              pathname === '/history'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Lịch sử
          </Link>
        </nav>
        
        {/* Right section */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* User menu */}
          <div className="ml-2 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">N</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

