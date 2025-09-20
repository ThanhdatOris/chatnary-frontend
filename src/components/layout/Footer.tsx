import Link from 'next/link'
import React from 'react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-foreground">Chatnary</span>
            <span className="text-sm text-muted-foreground">
              Document Chat System
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6 text-sm">
            <Link 
              href="/privacy" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              href="/support" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Support
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © {currentYear} Chatnary. All rights reserved.
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Built with Next.js, powered by AI. Made for seamless document interaction.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
