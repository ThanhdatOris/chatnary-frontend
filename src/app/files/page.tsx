'use client'

import FileList from '@/components/file/FileList'
import FileUpload from '@/components/file/FileUpload'
import ModernLayout from '@/components/layout/ModernLayout'
import { Button } from '@/components/ui'
import { Plus, Upload } from 'lucide-react'
import { useState } from 'react'

export default function FilesPage() {
  const [showUpload, setShowUpload] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
    setShowUpload(false)
  }

  const handleFileSelect = (file: unknown) => {
    // TODO: Navigate to chat page with this file
    console.log('Selected file for chat:', file)
  }

  const actions = (
    <Button
      onClick={() => setShowUpload(!showUpload)}
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
    >
      <Plus className="w-4 h-4 mr-2" />
      {showUpload ? 'Ẩn Upload' : 'Tải lên'}
    </Button>
  );

  return (
    <ModernLayout 
      title="Tài liệu của bạn" 
      description="Quản lý và tải lên tài liệu để trò chuyện với AI"
      actions={actions}
    >
      {showUpload && (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Tải lên tài liệu</h2>
          </div>
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={(error) => {
              console.error('Upload error:', error)
              alert('Upload failed: ' + error)
            }}
          />
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 h-[calc(85vh)] sticky top-16 z-20 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <FileList
            onFileSelect={handleFileSelect}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </ModernLayout>
  )
}


