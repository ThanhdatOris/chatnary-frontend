'use client'

import FileList from '@/components/file/FileList'
import FileUpload from '@/components/file/FileUpload'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import { Button } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { Upload } from 'lucide-react'
import { useState } from 'react'

export default function FilesPage() {
  const { user, loading } = useAuth()
  const [showUpload, setShowUpload] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please log in to access files.</p>
      </div>
    )
  }

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
    setShowUpload(false)
  }

  const handleFileSelect = (file: unknown) => {
    // TODO: Navigate to chat page with this file
    console.log('Selected file for chat:', file)
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header 
        user={user}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Files</h1>
                <p className="text-gray-800 dark:text-gray-300 mt-1">
                  Upload and manage your documents
                </p>
              </div>
              
              <Button
                onClick={() => setShowUpload(!showUpload)}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Files
              </Button>
            </div>

            {showUpload && (
              <div className="glass-card float-glass p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Documents</h2>
                <FileUpload
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={(error) => {
                    console.error('Upload error:', error)
                    alert('Upload failed: ' + error)
                  }}
                />
              </div>
            )}

            <div className="glass-card float-glass p-6">
              <FileList
                onFileSelect={handleFileSelect}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
