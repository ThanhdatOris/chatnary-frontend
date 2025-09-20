import { Button, KeyboardShortcuts, ThemeToggle } from '@/components/ui'
import { AuthUtils } from '@/lib/auth'
import { User as UserType } from '@/lib/types'
import {
  FileText,
  Keyboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Upload,
  User,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

interface HeaderProps {
  user?: UserType | null
  onMobileMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onMobileMenuToggle,
  isMobileMenuOpen = false 
}) => {
  const router = useRouter()
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false)
  const [showShortcuts, setShowShortcuts] = React.useState(false)

  const handleLogout = () => {
    AuthUtils.logout()
    router.push('/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FileText },
    { name: 'Upload', href: '/dashboard/upload', icon: Upload },
    { name: 'Search', href: '/dashboard/search', icon: Search },
    { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
  ]

  return (
    <header className="glass-header border-b border-glass-border theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center shadow-glass">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Chatnary</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-foreground hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-background/20 dark:hover:bg-background/10"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle size="sm" />
            
            {/* Keyboard Shortcuts Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShortcuts(true)}
              className="hidden md:flex items-center space-x-2"
              title="Keyboard Shortcuts"
            >
              <Keyboard className="w-4 h-4" />
              <span className="hidden lg:inline">Shortcuts</span>
            </Button>

            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.fullName}</span>
                </Button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-card py-1 z-50">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-background/20 dark:hover:bg-background/10 rounded-lg mx-1 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-background/20 dark:hover:bg-background/10 rounded-lg mx-1 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              className="md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-glass-border">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-foreground hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-background/20 dark:hover:bg-background/10"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </header>
  )
}

export default Header
