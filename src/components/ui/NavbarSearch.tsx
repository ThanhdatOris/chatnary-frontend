'use client'

import { Button } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { api, API_ENDPOINTS } from '@/lib/api'
import { mockFiles } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import {
    Clock,
    FileText,
    Search,
    X,
    Zap
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface SearchResult {
  file: {
    id: string
    originalName: string
    size: number
    uploadTime: string
    mimetype: string
  }
  score: number
  snippet?: string
}

interface SearchResponse {
  success: boolean
  data: {
    results: SearchResult[]
    hitsCount: number
    processingTimeMs: number
    query: string
  }
}

interface NavbarSearchProps {
  className?: string
}

export default function NavbarSearch({ className }: NavbarSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [searchStats, setSearchStats] = useState<{
    total: number
    processingTime: number
  } | null>(null)
  const [showAllResults, setShowAllResults] = useState(false)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chatnary-recent-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Mock search function for development
  const mockSearch = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return []
    
    return mockFiles
      .filter(file => 
        file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.mimetype.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5)
      .map(file => ({
        file: {
          id: file.id,
          originalName: file.originalName,
          size: file.size,
          uploadTime: file.uploadTime,
          mimetype: file.mimetype
        },
        score: Math.random() * 0.3 + 0.7, // Random score between 0.7-1.0
        snippet: `Tìm thấy từ khóa "${searchQuery}" trong tài liệu ${file.originalName}...`
      }))
  }

  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('chatnary-recent-searches', JSON.stringify(updated))
  }

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query
    if (!q.trim()) return

    setLoading(true)
    setIsOpen(true)

    try {
      // Use mock data in development or bypass mode
      if (process.env.NEXT_PUBLIC_BYPASS_AUTH === '1') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const mockResults = mockSearch(q)
        setResults(mockResults)
        setSearchStats({
          total: mockResults.length,
          processingTime: Math.floor(Math.random() * 100) + 50
        })
        saveRecentSearch(q)
      } else {
        // Real API call
        const response = await api.get<SearchResponse>(
          `${API_ENDPOINTS.search.search}?query=${encodeURIComponent(q)}&limit=5`
        )

        if (response.data.success) {
          setResults(response.data.data.results)
          setSearchStats({
            total: response.data.data.hitsCount,
            processingTime: response.data.data.processingTimeMs
          })
          saveRecentSearch(q)
        } else {
          setResults([])
          setSearchStats(null)
          showToast('Lỗi tìm kiếm', 'error')
        }
      }
    } catch (err: unknown) {
      console.error('Search error:', err)
      setResults([])
      setSearchStats(null)
      showToast('Không thể thực hiện tìm kiếm', 'error')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getFileIcon = (mimetype: string) => {
    if (mimetype.includes('pdf')) return '📄'
    if (mimetype.includes('word')) return '📝'
    if (mimetype.includes('text')) return '📃'
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return '📊'
    return '📁'
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setSearchStats(null)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.trim()) {
      // Auto-search after 300ms delay
      const timer = setTimeout(() => {
        handleSearch(value)
      }, 300)
      
      return () => clearTimeout(timer)
    } else {
      setResults([])
      setSearchStats(null)
      setIsOpen(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      handleSearch()
      setShowAllResults(true)
    }
  }

  const viewAllResults = () => {
    setShowAllResults(true)
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-200",
            query 
              ? "text-blue-600" 
              : "text-slate-600 dark:text-muted-foreground"
          )} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (query.trim() || recentSearches.length > 0) {
                setIsOpen(true)
              }
            }}
            placeholder="Tìm kiếm tài liệu..."
            className={cn(
              "w-full pl-10 pr-10 py-2.5 text-sm font-medium",
              "transition-all duration-300 ease-out",
              "rounded-xl", // Thống nhất border-radius
              // Use existing glass classes for consistency
              query || isOpen 
                ? "glass-card border-l-2 border-l-blue-600 text-blue-600" 
                : "glass-card-light",
              // Focus and hover states
              "focus:border-l-2 focus:border-l-blue-600",
              "focus:ring-2 focus:ring-blue-500/30 focus:shadow-blue-500/20",
              "hover:shadow-lg",
              // Text styling
              "text-foreground placeholder:text-muted-foreground"
            )}
            disabled={loading}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              title="Xóa tìm kiếm"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 glass-card border-l-2 border-l-blue-600 z-[60] max-h-96 overflow-y-auto overflow-hidden">
          {loading && (
            <div className="p-4 text-center">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Đang tìm kiếm...
              </div>
            </div>
          )}

          {/* Search Stats */}
          {searchStats && !loading && (
            <div className="px-4 py-3 border-b border-border/30 bg-muted/20 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Tìm thấy {searchStats.total} kết quả</span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {searchStats.processingTime}ms
                </span>
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Tìm kiếm gần đây:
              </p>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search)
                      handleSearch(search)
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-white/80 dark:hover:bg-slate-800/80 hover:text-blue-600 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-600 hover:backdrop-blur-lg"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {results.length > 0 && !loading && (
            <div className="divide-y divide-border/30">
              {results.map((result, index) => (
                <div
                  key={`${result.file.id}-${index}`}
                  className="p-4 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:backdrop-blur-lg transition-all duration-200 cursor-pointer border-l-2 border-transparent hover:border-blue-600 hover:text-blue-600 group"
                  onClick={() => {
                    showToast('Mở tài liệu...', 'info')
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <span className="text-lg">{getFileIcon(result.file.mimetype)}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground mb-1 truncate text-sm">
                        {result.file.originalName}
                      </h4>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                        <span>{formatFileSize(result.file.size)}</span>
                        <span>{formatDate(result.file.uploadTime)}</span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          {Math.round(result.score * 100)}%
                        </span>
                      </div>
                      
                      {result.snippet && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {result.snippet}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* View All Results */}
              <div className="p-3 bg-muted/20 backdrop-blur-sm border-t border-border/30">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs hover:bg-white/80 dark:hover:bg-slate-800/80 hover:text-blue-600 transition-all duration-200 border-l-2 border-transparent hover:border-blue-600 hover:backdrop-blur-lg"
                  onClick={viewAllResults}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Xem tất cả kết quả ({searchStats?.total || 0})
                </Button>
              </div>
            </div>
          )}

          {/* No Results */}
          {query && results.length === 0 && searchStats && !loading && (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">Không tìm thấy kết quả</p>
              <p className="text-xs text-muted-foreground">
                Thử sử dụng từ khóa khác hoặc kiểm tra chính tả
              </p>
            </div>
          )}
        </div>
      )}

      {/* Full Results Modal */}
      {showAllResults && (
        <div className="fixed inset-0 z-[70] overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen px-4 pt-16 pb-20">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setShowAllResults(false)}
            />
            
            <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Kết quả tìm kiếm: "{query}"
                  </h2>
                  {searchStats && (
                    <p className="text-sm text-gray-600 mt-1">
                      Tìm thấy {searchStats.total} kết quả trong {searchStats.processingTime}ms
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowAllResults(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  title="Đóng"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((result) => (
                      <div
                        key={result.file.id}
                        className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                        onClick={() => {
                          // TODO: Navigate to file detail or open file
                          console.log('Open file:', result.file.id)
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl flex-shrink-0 mt-1">
                            {getFileIcon(result.file.mimetype)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {result.file.originalName}
                            </h3>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span>{formatFileSize(result.file.size)}</span>
                              <span>{formatDate(result.file.uploadTime)}</span>
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                {Math.round(result.score * 100)}% phù hợp
                              </span>
                            </div>
                            {result.snippet && (
                              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                                {result.snippet}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không tìm thấy kết quả
                    </h3>
                    <p className="text-gray-600">
                      Thử sử dụng từ khóa khác hoặc kiểm tra chính tả
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}