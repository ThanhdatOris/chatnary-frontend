'use client'

import FileUpload from '@/components/file/FileUpload'
import { Button, Modal } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { MessageCircle, Plus, Search, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function QuickActions() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  const handleUploadSuccess = () => {
    showToast('Tải lên thành công!', 'success')
    setIsUploadModalOpen(false)
    // Refresh the page to show new file
    window.location.reload()
  }

  const handleUploadError = (error: string) => {
    showToast(`Lỗi tải lên: ${error}`, 'error')
  }

  const actions = [
    {
      title: 'Tải lên tài liệu',
      description: 'Thêm PDF, DOCX, TXT vào thư viện',
      icon: <Upload className="w-6 h-6" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => setIsUploadModalOpen(true)
    },
    {
      title: 'Trò chuyện mới',
      description: 'Bắt đầu chat với AI',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => router.push('/dashboard/chat')
    },
    {
      title: 'Tìm kiếm tài liệu',
      description: 'Tìm kiếm trong thư viện',
      icon: <Search className="w-6 h-6" />,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      onClick: () => router.push('/dashboard/search')
    },
    {
      title: 'Quản lý files',
      description: 'Xem và quản lý tất cả files',
      icon: <Plus className="w-6 h-6" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => router.push('/dashboard/files')
    }
  ]

  return (
    <>
      <div className="glass-card float-glass">
        <div className="px-6 py-4 border-b border-glass-border">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Hành động nhanh</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="group relative p-6 glass-card border-2 border-glass-border hover:border-white/30 dark:hover:border-white/20 hover:shadow-glass transition-all duration-200 float-glass"
              >
                <div className="text-center">
                  <div className={`mx-auto w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    {action.icon}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-700 dark:text-gray-400 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Tải lên tài liệu"
        size="lg"
      >
        <div className="p-6">
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            maxSize={10 * 1024 * 1024} // 10MB
            multiple={true}
          />
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-glass-border">
          <Button
            variant="outline"
            onClick={() => setIsUploadModalOpen(false)}
          >
            Hủy
          </Button>
        </div>
      </Modal>
    </>
  )
}
