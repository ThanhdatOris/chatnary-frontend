'use client'

import { Button } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { api, API_ENDPOINTS } from '@/lib/api'
import { isBypassMode, mockFiles } from '@/lib/mockData'
import { formatDate, formatFileSize } from '@/lib/utils'
import { Calendar, ChevronLeft, ChevronRight, Download, Eye, File, FileText, MessageSquare, Trash2, Zap } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import FileContentViewer from './FileContentViewer'

interface FileItem {
  id?: string
  _id?: string
  filename: string
  originalName: string
  size: number
  mimetype?: string
  mimeType?: string
  uploadTime?: string
  uploadDate?: string
  indexed?: boolean
  processed?: boolean
  textContent?: string
  metadata?: {
    pages?: number
    wordCount?: number
  }
}

interface FileListProps {
  onFileSelect?: (file: FileItem) => void
  refreshTrigger?: number
}

export default function FileList({ onFileSelect, refreshTrigger }: FileListProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({})
  const [viewingFile, setViewingFile] = useState<{ id: string; name: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const { showToast } = useToast()

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true)
      setError('') // Clear previous errors
      if (isBypassMode()) {
        // Use mock files directly
        setFiles([...mockFiles] as unknown as FileItem[])
      } else {
        const response = await api.get(API_ENDPOINTS.files.list)
        console.log('Files API response:', response.data)
        // Handle different response structures
        let filesData: any = []
        if (response.data.success && response.data.data && response.data.data.files) {
          filesData = response.data.data.files
        } else if (response.data.files) {
          filesData = response.data.files
        } else if (Array.isArray(response.data)) {
          filesData = response.data
        }
        setFiles(Array.isArray(filesData) ? filesData : [])
      }
    } catch (err) {
      setError('Failed to load files')
      showToast('Không thể tải danh sách file', 'error')
      console.error('Error fetching files:', err)
      setFiles([])
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchFiles()
    setCurrentPage(1) // Reset to first page when refreshing
  }, [refreshTrigger, fetchFiles])

        // Auto-refresh every 30 seconds for processing status
      useEffect(() => {
        const interval = setInterval(() => {
          // Only refresh if there are processing files
          const hasProcessingFiles = files.some(file => !(file.indexed || file.processed))
          if (hasProcessingFiles && !loading) {
            fetchFiles()
          }
        }, 30000) // 30 seconds

        return () => clearInterval(interval)
      }, [files, loading, fetchFiles])

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa file "${fileName}"?`)) return

    setActionLoading(prev => ({ ...prev, [`delete-${fileId}`]: true }))
    
    try {
      if (isBypassMode()) {
        setFiles(prev => prev.filter(f => (f._id || f.id) !== fileId))
        // Also remove from global mock for consistency
        const idx = (mockFiles as any).findIndex((f: any) => f.id === fileId)
        if (idx > -1) (mockFiles as any).splice(idx, 1)
      } else {
        await api.delete(API_ENDPOINTS.files.delete(fileId))
        setFiles(prev => prev.filter(f => (f._id || f.id) !== fileId))
      }
      showToast('File đã được xóa thành công', 'success')
    } catch (err) {
      console.error('Error deleting file:', err)
      showToast('Không thể xóa file. Vui lòng thử lại.', 'error')
      
      // Refresh to ensure data consistency
      fetchFiles()
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev }
        delete newState[`delete-${fileId}`]
        return newState
      })
    }
  }

  const handleReprocess = async (fileId: string) => {
    setActionLoading(prev => ({ ...prev, [`reprocess-${fileId}`]: true }))
    
    try {
      if (isBypassMode()) {
        // Simulate processing by toggling processed flag in local state
        setTimeout(() => {
          setFiles(prev => prev.map(f => (f._id === fileId || f.id === fileId) ? { ...f, indexed: true, processed: true } : f))
          showToast('Đã xử lý lại (mock)', 'success')
        }, 1000)
      } else {
        await api.post(API_ENDPOINTS.files.process(fileId))
        showToast('Đang xử lý lại tài liệu...', 'info')
        setTimeout(() => {
          fetchFiles()
        }, 2000)
      }
    } catch (err) {
      console.error('Error reprocessing file:', err)
      showToast('Không thể xử lý lại file. Vui lòng thử lại.', 'error')
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev }
        delete newState[`reprocess-${fileId}`]
        return newState
      })
    }
  }

    const handleDownload = async (file: FileItem) => {
    const fileId = file._id || file.id
    if (!fileId) {
      showToast('Không thể download file: thiếu ID', 'error')
      return
    }
    
    setActionLoading(prev => ({ ...prev, [`download-${fileId}`]: true }))
    
    try {
      if (isBypassMode()) {
        // In mock mode, just show a toast
        showToast('Mock: không có file thực để tải xuống', 'info')
      } else {
        const response = await api.get(API_ENDPOINTS.files.download(fileId), {
          responseType: 'blob'
        })
        const blob = new Blob([response.data])
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = file.originalName || file.filename || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        showToast('File đã được tải xuống thành công', 'success')
      }
    } catch (err) {
      console.error('Error downloading file:', err)
      showToast('Không thể tải file. Vui lòng thử lại.', 'error')
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev }
        delete newState[`download-${fileId}`]
        return newState
      })
    }
  }

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <File className="w-8 h-8 text-muted-foreground" />
    if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
    if (mimeType.includes('word')) return <File className="w-8 h-8 text-blue-500" />
    return <File className="w-8 h-8 text-muted-foreground" />
  }

  const getFileId = (file: FileItem) => file._id || file.id || ''
  const getFileMimeType = (file: FileItem) => file.mimetype || file.mimeType || ''
  const getFileUploadTime = (file: FileItem) => file.uploadTime || file.uploadDate || ''
  const isFileProcessed = (file: FileItem) => file.indexed || file.processed || false

  const handleViewContent = (file: FileItem) => {
    const fileId = getFileId(file)
    const fileName = file.originalName || file.filename || 'Unknown file'
    setViewingFile({ id: fileId, name: fileName })
  }

  const canViewContent = (file: FileItem) => {
    const mimeType = getFileMimeType(file)
    return isFileProcessed(file) && (
      mimeType.includes('pdf') || 
      mimeType.includes('text') || 
      mimeType.includes('markdown')
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchFiles} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No files uploaded yet</h3>
        <p className="text-muted-foreground">Upload your first document to get started</p>
      </div>
    )
  }

  // Pagination logic
  const totalPages = Math.ceil(files.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentFiles = files.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          My Documents ({files.length})
        </h2>
        <Button onClick={fetchFiles} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {Array.isArray(currentFiles) && currentFiles.map((file) => (
          <div
            key={getFileId(file)}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-background"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {getFileIcon(getFileMimeType(file))}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {file.originalName || file.filename || 'Unknown file'}
                </h3>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>{formatFileSize(file.size || 0)}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {getFileUploadTime(file) ? formatDate(getFileUploadTime(file)) : 'Unknown date'}
                  </span>
                  
                  <span className={`
                    px-2 py-1 rounded text-xs font-medium flex items-center gap-1
                    ${isFileProcessed(file)
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                    }
                  `}>
                    {!isFileProcessed(file) && (
                      <div className="w-3 h-3 animate-spin rounded-full border border-yellow-600 border-t-transparent" />
                    )}
                    {isFileProcessed(file) ? 'Processed' : 'Processing...'}
                  </span>
                </div>

                {file.metadata && (
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    {file.metadata.pages && (
                      <span>{file.metadata.pages} pages</span>
                    )}
                    {file.metadata.wordCount && (
                      <span>{file.metadata.wordCount.toLocaleString()} words</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {canViewContent(file) && (
                  <Button
                    onClick={() => handleViewContent(file)}
                    variant="outline"
                    size="sm"
                    title="Xem nội dung file"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Xem
                  </Button>
                )}

                {isFileProcessed(file) && onFileSelect && (
                  <Button
                    onClick={() => onFileSelect(file)}
                    variant="outline"
                    size="sm"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                )}
                
                {!isFileProcessed(file) && (
                  <Button
                    onClick={() => handleReprocess(getFileId(file))}
                    variant="outline"
                    size="sm"
                    disabled={actionLoading[`reprocess-${getFileId(file)}`]}
                    className="text-blue-600 hover:text-blue-700 hover:border-blue-300"
                  >
                    {actionLoading[`reprocess-${getFileId(file)}`] ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                  </Button>
                )}
                
                <Button
                  onClick={() => handleDownload(file)}
                  variant="outline"
                  size="sm"
                  disabled={actionLoading[`download-${getFileId(file)}`]}
                >
                  {actionLoading[`download-${getFileId(file)}`] ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </Button>
                
                <Button
                  onClick={() => handleDelete(getFileId(file), file.originalName || file.filename || 'Unknown file')}
                  variant="outline"
                  size="sm"
                  disabled={actionLoading[`delete-${getFileId(file)}`]}
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  {actionLoading[`delete-${getFileId(file)}`] ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, files.length)} của {files.length} tài liệu
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Trước
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPages || 
                  Math.abs(page - currentPage) <= 1
                )
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <Button
                      onClick={() => goToPage(page)}
                      variant={currentPage === page ? "primary" : "outline"}
                      size="sm"
                      className="min-w-[2.5rem]"
                    >
                      {page}
                    </Button>
                  </div>
                ))
              }
            </div>
            
            <Button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Sau
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* File Content Viewer Modal */}
      {viewingFile && (
        <FileContentViewer
          fileId={viewingFile.id}
          fileName={viewingFile.name}
          isOpen={!!viewingFile}
          onClose={() => setViewingFile(null)}
        />
      )}
    </div>
  )
}
