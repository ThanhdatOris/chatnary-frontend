import { Button, Modal, NavbarSearch, ThemeToggle } from '@/components/ui'
import {
    FileText,
    Menu,
    Search,
    X
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface HeaderProps {
  onMobileMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

const Header: React.FC<HeaderProps> = ({ 
  onMobileMenuToggle,
  isMobileMenuOpen = false 
}) => {
  const [showMobileSearch, setShowMobileSearch] = React.useState(false)

  return (
    <header className="glass-header border-b border-glass-border theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
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

            {/* User menu removed - no authentication */}

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

      {/* User menu removed */}

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
