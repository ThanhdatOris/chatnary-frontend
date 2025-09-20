import { Button, Modal, NavbarSearch, ThemeToggle } from '@/components/ui'
import { AuthUtils } from '@/lib/auth'
import { User as UserType } from '@/lib/types'
import {
  FileText,
  LogOut,
  Menu,
  Search,
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
  const [showMobileSearch, setShowMobileSearch] = React.useState(false)

  const handleLogout = () => {
    AuthUtils.logout()
    router.push('/login')
  }

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

          {/* Search Bar - Hidden on mobile */}
          <div className="flex-1 max-w-md mx-6 hidden md:flex md:items-center">
            <NavbarSearch />
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileSearch(true)}
              className="md:hidden"
              title="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle size="sm" />

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
                  <div className="absolute right-0 mt-2 w-48 glass-card py-1 z-[52]">
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
      </div>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-[51]" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}

      {/* Mobile Search Modal */}
      <Modal
        isOpen={showMobileSearch}
        onClose={() => setShowMobileSearch(false)}
        title="Tìm kiếm tài liệu"
      >
        <div className="p-4">
          <NavbarSearch className="w-full" />
        </div>
      </Modal>
    </header>
  )
}

export default Header
