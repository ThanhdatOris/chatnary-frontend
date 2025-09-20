'use client'

import { Button, Card } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { api, API_ENDPOINTS } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { Brain, Calendar, Clock, MessageCircle, Search, Trash2, Zap } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface ChatSource {
  file_id: string
  file_name: string
  chunks: Array<Record<string, unknown>>
  chunk_count: number
}

interface ChatHistoryItem {
  id: string
  query: string
  answer: string
  sources: ChatSource[]
  model_used: string
  timestamp: number
  created_at: string
}

interface ChatHistoryResponse {
  success: boolean
  data: ChatHistoryItem[]
  pagination: {
    limit: number
    offset: number
    total: number
  }
}

interface ChatHistoryProps {
  onSelectChat?: (chat: ChatHistoryItem) => void
}

export default function ChatHistory({ onSelectChat }: ChatHistoryProps) {
  const [chats, setChats] = useState<ChatHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const { showToast } = useToast()

  const limit = 20

  const fetchChatHistory = useCallback(async (reset = false) => {
    try {
      setLoading(true)
      if (reset) {
        setPage(0)
        setChats([])
      }

      const currentPage = reset ? 0 : page
      const response = await api.get<ChatHistoryResponse>(API_ENDPOINTS.chat.history, {
        params: {
          limit,
          offset: currentPage * limit,
          search: searchQuery || undefined
        }
      })

      if (response.data.success) {
        const newChats = response.data.data
        if (reset) {
          setChats(newChats)
        } else {
          setChats(prev => [...prev, ...newChats])
        }
        
        setHasMore(newChats.length === limit)
        if (!reset) {
          setPage(prev => prev + 1)
        }
      } else {
        throw new Error('Failed to fetch chat history')
      }
    } catch (err: unknown) {
      let errorMessage = 'Không thể tải lịch sử chat'
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
  }, [page, searchQuery, showToast])

  useEffect(() => {
    fetchChatHistory(true)
  }, [searchQuery, fetchChatHistory])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm('Bạn có chắc muốn xóa cuộc hội thoại này?')) return

    setDeletingIds(prev => new Set(prev).add(chatId))
    
    try {
      // Note: Backend chưa có API delete chat, sẽ cần thêm sau
      // await api.delete(`/api/chat/history/${chatId}`)
      
      // Tạm thời remove từ state
      setChats(prev => prev.filter(chat => chat.id !== chatId))
      showToast('Đã xóa cuộc hội thoại', 'success')
    } catch {
      showToast('Không thể xóa cuộc hội thoại', 'error')
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(chatId)
        return newSet
      })
    }
  }

  const getModelIcon = (model: string) => {
    switch (model.toLowerCase()) {
      case 'gemini':
        return <Brain className="w-4 h-4 text-purple-500" />
      case 'openai':
        return <Zap className="w-4 h-4 text-green-500" />
      default:
        return <MessageCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) {
      return 'Vừa xong'
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`
    } else {
      return formatDate(date.toISOString())
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-500" />
              Lịch sử Chat
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý và xem lại các cuộc hội thoại với AI
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm trong lịch sử chat..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="space-y-4">
        {loading && chats.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải lịch sử chat...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không thể tải lịch sử
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchChatHistory(true)} variant="outline">
              Thử lại
            </Button>
          </Card>
        ) : chats.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có cuộc hội thoại nào
            </h3>
            <p className="text-gray-500">
              Bắt đầu chat với tài liệu để xem lịch sử tại đây
            </p>
          </Card>
        ) : (
          <>
            {chats.map((chat) => (
              <Card
                key={chat.id}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectChat?.(chat)}
              >
                <div className="flex items-start gap-4">
                  {/* Model Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getModelIcon(chat.model_used)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Question */}
                    <div className="mb-3">
                      <p className="font-medium text-gray-900 mb-1">
                        {truncateText(chat.query, 150)}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {truncateText(chat.answer, 200)}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(chat.timestamp)}
                      </span>
                      
                      <span className="flex items-center gap-1">
                        {getModelIcon(chat.model_used)}
                        {chat.model_used === 'gemini' ? 'Gemini AI' : 'OpenAI GPT'}
                      </span>

                      {chat.sources.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {chat.sources.length} nguồn
                        </span>
                      )}
                    </div>

                    {/* Sources */}
                    {chat.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          {chat.sources.slice(0, 3).map((source, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
                            >
                              {source.file_name}
                            </span>
                          ))}
                          {chat.sources.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                              +{chat.sources.length - 3} khác
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteChat(chat.id)
                      }}
                      variant="ghost"
                      size="sm"
                      disabled={deletingIds.has(chat.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingIds.has(chat.id) ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="text-center py-6">
                <Button
                  onClick={() => fetchChatHistory(false)}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent mr-2" />
                      Đang tải...
                    </>
                  ) : (
                    'Tải thêm'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
