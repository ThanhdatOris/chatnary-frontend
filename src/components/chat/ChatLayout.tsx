'use client'

import { Button } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import ChatService from '@/lib/chatService'
import { MockChatHistoryItem } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import {
    Brain,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    History,
    MessageSquare,
    Search,
    Trash2,
    Zap
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import ChatInterface from './ChatInterface'
import ChatSession from './ChatSession'

interface ChatLayoutProps {
  className?: string
}

export default function ChatLayout({ className }: ChatLayoutProps) {
  const [chats, setChats] = useState<MockChatHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChat, setSelectedChat] = useState<MockChatHistoryItem | null>(null)
  const [isSessionOpen, setIsSessionOpen] = useState(false)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false)
  const { showToast } = useToast()

  const fetchChatHistory = useCallback(async (reset = false) => {
    try {
      setLoading(true)
      if (reset) {
        setChats([])
      }

      const response = await ChatService.getChatHistory({
        limit: 50, // Load more for sidebar
        offset: 0,
        search: searchQuery || undefined
      })

      if (response.data.success) {
        setChats(response.data.data || [])
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
  }, [searchQuery, showToast])

  useEffect(() => {
    fetchChatHistory(true)
  }, [searchQuery, fetchChatHistory])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSelectChat = (chat: MockChatHistoryItem) => {
    setSelectedChat(chat)
    setIsSessionOpen(true)
  }

  const handleCloseSession = () => {
    setIsSessionOpen(false)
    setSelectedChat(null)
  }

  const handleDeleteChat = async (chatId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    
    if (!confirm('Bạn có chắc muốn xóa cuộc hội thoại này?')) return

    setDeletingIds(prev => new Set(prev).add(chatId))
    
    try {
      const response = await ChatService.deleteChat(chatId)
      if (response.data.success) {
        setChats(prev => prev.filter(chat => chat.id !== chatId))
        showToast('Đã xóa cuộc hội thoại', 'success')
      } else {
        throw new Error('Failed to delete chat')
      }
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
        return <Brain className="w-3 h-3 text-purple-500" />
      case 'openai':
        return <Zap className="w-3 h-3 text-green-500" />
      default:
        return <MessageSquare className="w-3 h-3 text-muted-foreground" />
    }
  }

  const truncateText = (text: string, maxLength: number = 60) => {
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
      return `${diffHours}h`
    } else if (diffDays < 7) {
      return `${diffDays}d`
    } else {
      return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className={cn('chat-layout flex gradient-bg overflow-hidden', className)}>
      {/* Chat History Sidebar */}
      <div className={cn(
        'glass-sidebar border-r border-glass-border flex flex-col transition-all duration-300 flex-shrink-0',
        isHistoryCollapsed ? 'w-12' : 'w-80'
      )}>
        {/* Sidebar Header */}
        <div className="p-4 border-glass-border">
          <div className={cn(
            "flex items-center",
            isHistoryCollapsed ? "justify-center" : "justify-between"
          )}>
            {!isHistoryCollapsed && (
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-500" />
                <h2 className="font-semibold text-foreground">Lịch sử Chat</h2>
              </div>
            )}
            <Button
              onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
              variant="ghost"
              size="sm"
              className="p-2"
              title={isHistoryCollapsed ? 'Mở rộng' : 'Thu gọn'}
            >
              {isHistoryCollapsed ? 
                <ChevronRight className="w-4 h-4" /> : 
                <ChevronLeft className="w-4 h-4" />
              }
            </Button>
          </div>

          {/* Search */}
          {!isHistoryCollapsed && (
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {!isHistoryCollapsed && (
            <>
              {loading && chats.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Đang tải...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="p-4 text-center">
                  <MessageSquare className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-red-600 mb-2">{error}</p>
                  <Button 
                    onClick={() => fetchChatHistory(true)} 
                    variant="outline" 
                    size="sm"
                  >
                    Thử lại
                  </Button>
                </div>
              ) : chats.length === 0 ? (
                <div className="p-4 text-center">
                  <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Chưa có lịch sử chat</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleSelectChat(chat)}
                      className="chat-history-item group p-3 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-1">
                          {getModelIcon(chat.model_used)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                            {truncateText(chat.query, 80)}
                          </p>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {truncateText(chat.answer, 100)}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(chat.timestamp)}
                            </div>
                            
                            <Button
                              onClick={(e) => handleDeleteChat(chat.id, e)}
                              variant="ghost"
                              size="sm"
                              disabled={deletingIds.has(chat.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                            >
                              {deletingIds.has(chat.id) ? (
                                <div className="w-3 h-3 animate-spin rounded-full border border-red-600 border-t-transparent" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </Button>
                          </div>

                          {chat.sources.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {chat.sources.length} nguồn
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Collapsed state - show only icons */}
          {isHistoryCollapsed && (
            <div className="p-2 space-y-2">
              {chats.slice(0, 10).map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors flex items-center justify-center"
                  title={truncateText(chat.query, 50)}
                >
                  {getModelIcon(chat.model_used)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatInterface onNewMessage={fetchChatHistory} />
      </div>

      {/* Chat Session Modal */}
      <ChatSession
        chat={selectedChat}
        isOpen={isSessionOpen}
        onClose={handleCloseSession}
      />
    </div>
  )
}
