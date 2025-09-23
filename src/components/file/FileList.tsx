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
      setError('')
      if (isBypassMode()) {
        setFiles(mockFiles as FileItem[])
      } else {
        const response = await api.get(API_ENDPOINTS.files.list)
        setFiles(response.data?.files || [])
      }
    } catch (err) {
      setError('Failed to fetch files')
      showToast('Không thể tải danh sách tài liệu', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchFiles()
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

  // Optimized handlers to prevent unnecessary re-renders
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

        {/* Sort Options */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          title="Sắp xếp theo"
        >
          <option value="date">Ngày tải lên</option>
          <option value="name">Tên file</option>
          <option value="size">Kích thước</option>
        </select>

        {/* Sort Order */}
        <Button
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
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
          className="text-sm"
        >
          <Filter className="w-4 h-4 mr-1" />
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  ), [searchQuery, statusFilter, typeFilter, sortBy, sortOrder, itemsPerPage, handleSearchChange, handleStatusChange, handleTypeChange, clearFilters])

  // Event handlers
  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa file "${fileName}"?`)) return

    setActionLoading(prev => ({ ...prev, [`delete-${fileId}`]: true }))
    
    try {
      if (isBypassMode()) {
        setFiles(prev => prev.filter(f => (f._id || f.id) !== fileId))
        const idx = mockFiles.findIndex((f: FileItem) => (f.id || f._id) === fileId)
        if (idx > -1) mockFiles.splice(idx, 1)
        showToast('File đã được xóa thành công', 'success')
      } else {
        await api.delete(API_ENDPOINTS.files.delete(fileId))
        setFiles(prev => prev.filter(f => (f._id || f.id) !== fileId))
        showToast('File đã được xóa thành công', 'success')
      }
    } catch (err) {
      console.error('Error deleting file:', err)
      showToast('Không thể xóa file. Vui lòng thử lại.', 'error')
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev }
        delete newState[`delete-${fileId}`]
        return newState
      })
    }
  }

  const handleDownload = async (fileId: string, fileName: string) => {
    setActionLoading(prev => ({ ...prev, [`download-${fileId}`]: true }))
    
    try {
      if (isBypassMode()) {
        showToast('Chức năng tải file chưa khả dụng trong demo mode', 'info')
        return
      }

      const response = await fetch(API_ENDPOINTS.files.download(fileId), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      showToast('File đã được tải xuống', 'success')
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

  const getFileId = (file: FileItem) => file._id || file.id || ''
  
  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <File className="w-8 h-8 text-muted-foreground" />
    if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
    if (mimeType.includes('word')) return <File className="w-8 h-8 text-blue-500" />
    if (mimeType.includes('spreadsheet')) return <File className="w-8 h-8 text-green-500" />
    if (mimeType.includes('text')) return <FileText className="w-8 h-8 text-gray-500" />
    return <File className="w-8 h-8 text-muted-foreground" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải tài liệu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Lỗi tải dữ liệu</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchFiles} variant="outline">
          Thử lại
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

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Filters and Search */}
      <div className="sticky top-0 z-30 bg-white/40 backdrop-blur-md border-b border-white/30 pb-4 mb-4 rounded-lg mx-2 mt-2">
        <SearchAndFilters />

        {/* Results Header */}
        <div className="flex items-center justify-between mt-4">
          <h2 className="text-lg font-semibold text-gradient-aurora">
            Tài liệu của bạn ({filteredFiles.length} / {files.length})
          </h2>
          <Button onClick={fetchFiles} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="grid-container px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 max-w-full">
            {Array.isArray(currentFiles) && currentFiles.map((file, index) => (
              <div key={getFileId(file)} className="transform-wrapper">
                <div className={`file-grid-item group relative border-2 rounded-xl p-4 pb-20 ${
                  index % 5 === 0 ? 'bg-white/70 border-purple-200/50 shadow-lg shadow-purple-500/10' :
                  index % 5 === 1 ? 'bg-white/70 border-pink-200/50 shadow-lg shadow-pink-500/10' :
                  index % 5 === 2 ? 'bg-white/70 border-blue-200/50 shadow-lg shadow-blue-500/10' :
                  index % 5 === 3 ? 'bg-white/70 border-emerald-200/50 shadow-lg shadow-emerald-500/10' :
                  'bg-white/70 border-orange-200/50 shadow-lg shadow-orange-500/10'
                } hover:shadow-xl hover:shadow-purple-500/20 hover:bg-white/80 transition-all duration-300 ease-in-out cursor-pointer min-h-[220px] overflow-hidden backdrop-blur-sm`}>
                  {/* File Icon and Type Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-shrink-0">
                      {getFileIcon(file.mimetype || file.mimeType)}
                    </div>
                    <div className="flex flex-col gap-1">
                      {/* Status Badge */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        file.indexed || file.processed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {file.indexed || file.processed ? 'Đã xử lý' : 'Đang xử lý'}
                      </span>
                      {/* Processing Icon */}
                      {!(file.indexed || file.processed) && (
                        <div className="flex justify-center">
                          <Zap className="w-3 h-3 text-yellow-600 animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* File Name with scrolling animation */}
                  <div className="mb-3 overflow-hidden">
                    <h3 className="filename-display font-medium text-foreground group-hover:filename-scroll">
                      {file.originalName}
                    </h3>
                  </div>

                  {/* File Details */}
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(file.uploadTime || file.uploadDate || '')}</span>
                    </div>
                    <div>
                      <span className="font-medium">{formatFileSize(file.size)}</span>
                    </div>
                    {file.metadata?.pages && (
                      <div>
                        <span>{file.metadata.pages} trang</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                    <Button
                      onClick={() => setViewingFile({ id: getFileId(file), name: file.originalName })}
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-purple-500/80 backdrop-blur-sm border-white/30 hover:bg-purple-600/90 text-white shadow-lg hover:shadow-purple-500/40 transition-all duration-200"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Xem
                    </Button>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(getFileId(file), file.originalName)
                      }}
                      variant="outline"
                      size="sm"
                      disabled={actionLoading[`download-${getFileId(file)}`]}
                      className="bg-blue-500/80 backdrop-blur-sm border-white/30 hover:bg-blue-600/90 text-white shadow-lg hover:shadow-blue-500/40 transition-all duration-200"
                    >
                      {actionLoading[`download-${getFileId(file)}`] ? (
                        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download className="w-3 h-3" />
                      )}
                    </Button>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onFileSelect) onFileSelect(file)
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white/95"
                    >
                      <MessageSquare className="w-3 h-3" />
                    </Button>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(getFileId(file), file.originalName)
                      }}
                      variant="outline"
                      size="sm"
                      disabled={actionLoading[`delete-${getFileId(file)}`]}
                      className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                    >
                      {actionLoading[`delete-${getFileId(file)}`] ? (
                        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
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
      <div className="sticky bottom-0 z-30 bg-white/40 backdrop-blur-md border-t border-white/30 pt-4 mt-4 rounded-lg mx-2 mb-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-gradient-aurora font-medium">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredFiles.length)} của {filteredFiles.length} tài liệu
            {filteredFiles.length !== files.length && (
              <span className="text-gradient-cosmic font-semibold"> (đã lọc từ {files.length} tài liệu)</span>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      variant={currentPage === pageNum ? "primary" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* File Content Viewer Modal */}
      {viewingFile && (
        <FileContentViewer
          isOpen={true}
          fileId={viewingFile.id}
          fileName={viewingFile.name}
          onClose={() => setViewingFile(null)}
        />
      )}
    </div>
  )
}