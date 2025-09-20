'use client'

import { Button, Card } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { api, API_ENDPOINTS } from '@/lib/api'
import { Clock, FileText, Search, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

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

export default function SearchInterface() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchStats, setSearchStats] = useState<{
    total: number
    processingTime: number
  } | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
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

  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('chatnary-recent-searches', JSON.stringify(updated))
  }

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query
    if (!q.trim()) {
      showToast('Vui lòng nhập từ khóa tìm kiếm', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await api.get<SearchResponse>(
        `${API_ENDPOINTS.search.search}?query=${encodeURIComponent(q)}&limit=20`
      )

      if (response.data.success) {
        setResults(response.data.data.results)
        setSearchStats({
          total: response.data.data.hitsCount,
          processingTime: response.data.data.processingTimeMs
        })
        saveRecentSearch(q)
        
        if (response.data.data.results.length === 0) {
          showToast('Không tìm thấy kết quả nào', 'info')
        }
      } else {
        showToast('Lỗi tìm kiếm', 'error')
        setResults([])
        setSearchStats(null)
      }
    } catch (err: unknown) {
      console.error('Search error:', err)
      showToast('Không thể thực hiện tìm kiếm', 'error')
      setResults([])
      setSearchStats(null)
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
    return '📁'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Header */}
      <Card className="p-6">
        <div className="text-center mb-6">
          <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Tìm kiếm tài liệu</h1>
          <p className="text-muted-foreground">Tìm kiếm nội dung trong tất cả tài liệu của bạn</p>
        </div>

        {/* Search Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm..."
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-foreground placeholder:text-muted-foreground"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6"
            >
              {loading ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Tìm kiếm'
              )}
            </Button>
          </div>
        </form>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Tìm kiếm gần đây:
            </p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search)
                    handleSearch(search)
                  }}
                  className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-full text-muted-foreground transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Search Stats */}
      {searchStats && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
          <span>
            Tìm thấy {searchStats.total} kết quả
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            {searchStats.processingTime}ms
          </span>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <Card key={`${result.file.id}-${index}`} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{getFileIcon(result.file.mimetype)}</span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1 truncate">
                    {result.file.originalName}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span>{formatFileSize(result.file.size)}</span>
                    <span>{formatDate(result.file.uploadTime)}</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Relevance: {Math.round(result.score * 100)}%
                    </span>
                  </div>
                  
                  {result.snippet && (
                    <p className="text-sm text-muted-foreground bg-yellow-50 p-2 rounded border-l-2 border-yellow-400">
                      {result.snippet}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Navigate to file detail or open chat with this file
                      showToast('Mở tài liệu...', 'info')
                    }}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Xem
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && searchStats && (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">Không tìm thấy kết quả</h3>
            <p className="text-muted-foreground mb-4">
              Không có tài liệu nào chứa từ khóa &ldquo;{query}&rdquo;
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Gợi ý:</p>
              <ul className="text-left inline-block mt-2">
                <li>• Kiểm tra chính tả từ khóa</li>
                <li>• Thử sử dụng từ khóa khác</li>
                <li>• Sử dụng từ khóa ngắn gọn hơn</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
