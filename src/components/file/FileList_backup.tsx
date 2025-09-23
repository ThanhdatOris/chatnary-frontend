'use client'

import { Button } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { api, API_ENDPOINTS } from '@/lib/api'
import { isBypassMode, mockFiles } from '@/lib/mockData'
import { formatDate, formatFileSize } from '@/lib/utils'
import { Calendar, ChevronLeft, ChevronRight, Download, Eye, File, FileText, Filter, MessageSquare, Search, SortAsc, SortDesc, Trash2, Zap } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'processed' | 'processing'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'pdf' | 'docx' | 'xlsx' | 'txt' | 'zip'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
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

  // Memoized filtering to prevent re-renders and maintain input focus
  const filteredFiles = useMemo(() => {
    let result = [...files]

    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter(file => 
        file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.filename.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(file => {
        const isProcessed = file.indexed || file.processed || false
        return statusFilter === 'processed' ? isProcessed : !isProcessed
      })
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(file => {
        const mimeType = file.mimetype || file.mimeType || ''
        switch (typeFilter) {
          case 'pdf':
            return mimeType.includes('pdf')
          case 'docx':
            return mimeType.includes('word')
          case 'xlsx':
            return mimeType.includes('spreadsheet')
          case 'txt':
            return mimeType.includes('text')
          case 'zip':
            return mimeType.includes('zip')
          default:
            return true
        }
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.originalName.localeCompare(b.originalName)
          break
        case 'date':
          const dateA = new Date(a.uploadTime || a.uploadDate || 0).getTime()
          const dateB = new Date(b.uploadTime || b.uploadDate || 0).getTime()
          comparison = dateA - dateB
          break
        case 'size':
          comparison = (a.size || 0) - (b.size || 0)
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [files, searchQuery, statusFilter, typeFilter, sortBy, sortOrder])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, typeFilter, sortBy, sortOrder])

  // Optimized search handler to prevent unnecessary re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as 'all' | 'processed' | 'processing')
  }, [])

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value as 'all' | 'pdf' | 'docx' | 'xlsx' | 'txt' | 'zip')
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setStatusFilter('all')
    setTypeFilter('all')
    setSortBy('date')
    setSortOrder('desc')
  }, [])

  // Shared search and filter components to maintain focus
  const SearchAndFilters = useCallback(() => (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          ref={searchInputRef}
          placeholder="Tìm kiếm tài liệu..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          title="Lọc theo trạng thái"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="processed">Đã xử lý</option>
          <option value="processing">Đang xử lý</option>
        </select>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={handleTypeChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          title="Lọc theo loại file"
        >
          <option value="all">Tất cả loại file</option>
          <option value="pdf">PDF</option>
          <option value="docx">Word</option>
          <option value="xlsx">Excel</option>
          <option value="txt">Text</option>
          <option value="zip">Archive</option>
        </select>

        {/* Clear Filters */}
        <Button
          onClick={clearFilters}
          variant="outline"
          size="sm"
          className="text-sm"
        >
          <Filter className="w-4 h-4 mr-1" />
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  ), [searchQuery, statusFilter, typeFilter, handleSearchChange, handleStatusChange, handleTypeChange, clearFilters])

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
      <div className="flex flex-col h-full">
        {/* Sticky Filters and Search */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 pb-4 mb-4">
          <SearchAndFilters />
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-lg font-semibold text-foreground">
              Tài liệu của bạn (0)
            </h2>
            <Button onClick={fetchFiles} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No files uploaded yet</h3>
            <p className="text-muted-foreground">Upload your first document to get started</p>
          </div>
        </div>
      </div>
    )
  }

  if (filteredFiles.length === 0 && (searchQuery || statusFilter !== 'all' || typeFilter !== 'all')) {
    return (
      <div className="space-y-6">
        <SearchAndFilters />
        
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Không tìm thấy tài liệu</h3>
          <p className="text-muted-foreground mb-4">Không có tài liệu nào phù hợp với bộ lọc hiện tại</p>
          <Button onClick={clearFilters} variant="outline">
            Xóa tất cả bộ lọc
          </Button>
        </div>
      </div>
    )
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentFiles = filteredFiles.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Filters and Search */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 pb-4 mb-4">
        <SearchAndFilters />
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              title="Lọc theo trạng thái"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="processed">Đã xử lý</option>
              <option value="processing">Đang xử lý</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={handleTypeChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              title="Lọc theo loại file"
            >
              <option value="all">Tất cả loại file</option>
              <option value="pdf">PDF</option>
              <option value="docx">Word</option>
              <option value="xlsx">Excel</option>
              <option value="txt">Text</option>
              <option value="zip">Archive</option>
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              title="Sắp xếp theo"
            >
              <option value="date">Sắp xếp theo ngày</option>
              <option value="name">Sắp xếp theo tên</option>
              <option value="size">Sắp xếp theo kích thước</option>
            </select>

            {/* Sort Order */}
            <Button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </Button>

            {/* Items per page */}
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              title="Số mục mỗi trang"
            >
              <option value={8}>8 mục/trang</option>
              <option value={12}>12 mục/trang</option>
              <option value={16}>16 mục/trang</option>
              <option value={24}>24 mục/trang</option>
            </select>

            {/* Clear Filters */}
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              Xóa bộ lọc
            </Button>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Tài liệu của bạn ({filteredFiles.length} / {files.length})
            </h2>
            <Button onClick={fetchFiles} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">

      <div className="grid-container px-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 max-w-full">
          {Array.isArray(currentFiles) && currentFiles.map((file) => (
            <div key={getFileId(file)} className="transform-wrapper">
              <div
                className="file-grid-item group relative border rounded-xl p-4 pb-20 bg-background hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer min-h-[220px] overflow-hidden"
              >
            {/* File Icon and Type Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex-shrink-0">
                {getFileIcon(getFileMimeType(file))}
              </div>
              <span className={`
                status-badge px-2 py-1 rounded-full text-xs font-medium transition-all duration-200
                ${isFileProcessed(file)
                  ? 'bg-green-100 text-green-800 group-hover:bg-green-200' 
                  : 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200'
                }
              `}>
                {!isFileProcessed(file) && (
                  <div className="w-2 h-2 animate-spin rounded-full border border-yellow-600 border-t-transparent inline-block mr-1" />
                )}
                {isFileProcessed(file) ? 'Xử lý xong' : 'Đang xử lý'}
              </span>
            </div>

            {/* File Name with scrolling effect for long names */}
            <div className="relative mb-2 overflow-hidden">
              <h3 
                className="filename-scroll font-semibold text-foreground group-hover:text-blue-600 transition-colors whitespace-nowrap"
                data-text={file.originalName || file.filename || 'Unknown file'}
              >
                {file.originalName || file.filename || 'Unknown file'}
              </h3>
            </div>
            
            {/* File Details */}
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <span className="font-medium">Kích thước:</span>
                <span>{formatFileSize(file.size || 0)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{getFileUploadTime(file) ? formatDate(getFileUploadTime(file)) : 'Unknown date'}</span>
              </div>
              
              {file.metadata && (
                <div className="flex items-center gap-3 text-xs">
                  {file.metadata.pages && (
                    <span className="bg-gray-100 px-2 py-1 rounded">{file.metadata.pages} trang</span>
                  )}
                  {file.metadata.wordCount && (
                    <span className="bg-gray-100 px-2 py-1 rounded">{file.metadata.wordCount.toLocaleString()} từ</span>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons - Improved visibility */}
            <div className="file-actions absolute inset-x-2 bottom-2 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 backdrop-blur-sm rounded-lg p-2 border border-gray-200/50 shadow-lg">
              <div className="flex flex-wrap gap-1">
                {canViewContent(file) && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewContent(file)
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700 font-medium shadow-sm"
                    title="Xem nội dung file"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Xem
                  </Button>
                )}

                {isFileProcessed(file) && onFileSelect && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      onFileSelect(file)
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 font-medium shadow-sm"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Chat
                  </Button>
                )}
              </div>
              
              <div className="flex gap-1">
                {!isFileProcessed(file) && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReprocess(getFileId(file))
                    }}
                    variant="outline"
                    size="sm"
                    disabled={actionLoading[`reprocess-${getFileId(file)}`]}
                    className="flex-1 text-xs bg-orange-50 hover:bg-orange-100 border-orange-300 text-orange-700 font-medium shadow-sm"
                  >
                    {actionLoading[`reprocess-${getFileId(file)}`] ? (
                      <div className="w-3 h-3 animate-spin rounded-full border border-orange-600 border-t-transparent" />
                    ) : (
                      <Zap className="w-3 h-3" />
                    )}
                  </Button>
                )}
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(file)
                  }}
                  variant="outline"
                  size="sm"
                  disabled={actionLoading[`download-${getFileId(file)}`]}
                  className="flex-1 text-xs bg-green-50 hover:bg-green-100 border-green-300 text-green-700 font-medium shadow-sm"
                >
                  {actionLoading[`download-${getFileId(file)}`] ? (
                    <div className="w-3 h-3 animate-spin rounded-full border border-green-600 border-t-transparent" />
                  ) : (
                    <Download className="w-3 h-3" />
                  )}
                </Button>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(getFileId(file), file.originalName || file.filename || 'Unknown file')
                  }}
                  variant="outline"
                  size="sm"
                  disabled={actionLoading[`delete-${getFileId(file)}`]}
                  className="flex-1 text-xs bg-red-50 hover:bg-red-100 border-red-300 text-red-700 font-medium shadow-sm"
                >
                  {actionLoading[`delete-${getFileId(file)}`] ? (
                    <div className="w-3 h-3 animate-spin rounded-full border border-red-600 border-t-transparent" />
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>

            {/* Hover overlay for better visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
          </div>
          </div>
        ))}
        </div>
      </div>
      </div>

      {/* Sticky Pagination */}
      {totalPages > 1 && (
        <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredFiles.length)} của {filteredFiles.length} tài liệu
              {filteredFiles.length !== files.length && (
                <span className="text-orange-600"> (đã lọc từ {files.length} tài liệu)</span>
              )}
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
