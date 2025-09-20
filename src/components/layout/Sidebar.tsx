import { cn } from '@/lib/utils'
import {
    Home,
    Library,
    MessageSquare,
    Search,
    Settings
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Files', href: '/dashboard/files', icon: Library },
    { name: 'Search', href: '/dashboard/search', icon: Search },
    { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 glass-sidebar border-r border-glass-border transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full lg:min-h-screen min-h-[calc(100vh-4rem)]">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 float-glass',
                    isActive
                      ? 'glass-card text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-800 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  <Icon className={cn(
                    'mr-3 h-5 w-5',
                    isActive ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'
                  )} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-glass-border">
            <div className="text-xs text-gray-700 dark:text-gray-400 text-center">
              <p>Chatnary v1.0</p>
              <p>Document Chat System</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
