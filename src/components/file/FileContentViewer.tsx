'use client'

import { Button, Modal } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { api, API_ENDPOINTS } from '@/lib/api'
import { isBypassMode, mockFiles } from '@/lib/mockData'
import { Copy, Download, FileText, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface FileContentData {
  success: boolean
  content: string
  filename: string
  mimetype: string
  size: number
  pages: number
}

interface FileContentViewerProps {
  fileId: string
  fileName: string
  isOpen: boolean
  onClose: () => void
}

export default function FileContentViewer({ 
  fileId, 
  fileName, 
  isOpen, 
  onClose 
}: FileContentViewerProps) {
  const [content, setContent] = useState<FileContentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { showToast } = useToast()

  const fetchFileContent = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError('')
      if (isBypassMode()) {
        // Mock simple content view from mockFiles
        const f = mockFiles.find(f => f.id === fileId)
        if (!f) throw new Error('File not found')
        setContent({
          success: true,
          content: `Nội dung mô phỏng của tài liệu: ${f.originalName}\n\n(Đây là dữ liệu giả lập để xem nội dung file trong chế độ mock)`,
          filename: f.filename,
          mimetype: f.mimetype,
          size: f.size,
          pages: Math.max(1, Math.round(f.size / 50000))
        })
      } else {
        const response = await api.get<FileContentData>(
          API_ENDPOINTS.files.content(fileId)
        )
        if (response.data.success) {
          setContent(response.data)
        } else {
          throw new Error('Failed to load content')
        }
      }
    } catch (err: unknown) {
      let errorMessage = 'Không thể tải nội dung file'
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { detail?: string } } }).response
        if (response?.data?.detail) {
          errorMessage = response.data.detail
        }
      }
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }, [fileId, showToast])

  useEffect(() => {
    if (isOpen && fileId) {
      fetchFileContent()
    }
  }, [isOpen, fileId, fetchFileContent])

  const handleCopyContent = async () => {
    if (!content?.content) return
    
    try {
      await navigator.clipboard.writeText(content.content)
      showToast('Đã sao chép nội dung', 'success')
    } catch {
      showToast('Không thể sao chép nội dung', 'error')
    }
  }

  const handleDownloadContent = () => {
    if (!content?.content) return
    
    const blob = new Blob([content.content], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${content.filename}_content.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    showToast('Đã tải xuống nội dung', 'success')
  }

  const getFileTypeIcon = (mimetype: string) => {
    if (mimetype.includes('pdf')) return '📄'
    if (mimetype.includes('text')) return '📝'
    if (mimetype.includes('markdown')) return '📋'
    return '📄'
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Nội dung tài liệu
              </h2>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {content && (
              <>
                <Button
                  onClick={handleCopyContent}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Sao chép
                </Button>
                
                <Button
                  onClick={handleDownloadContent}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Tải về
                </Button>
              </>
            )}
            
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Đang tải nội dung...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Không thể tải nội dung
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchFileContent} variant="outline">
                  Thử lại
                </Button>
              </div>
            </div>
          )}

          {content && (
            <div className="h-full flex flex-col">
              {/* Content Stats */}
              <div className="px-6 py-3 bg-muted border-b">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    {getFileTypeIcon(content.mimetype)} {content.mimetype}
                  </span>
                  <span>
                    📊 {content.size.toLocaleString()} ký tự
                  </span>
                  <span>
                    📄 {content.pages} trang
                  </span>
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 overflow-auto p-6">
                <div className="bg-background border rounded-lg">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed p-4 max-w-none overflow-auto">
                    {content.content}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
