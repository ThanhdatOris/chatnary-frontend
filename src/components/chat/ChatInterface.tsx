'use client'

import { Button, Card, TextArea } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import ChatService from '@/lib/chatService'
import { MockChatMessage } from '@/lib/mockData'
import { Bot, Brain, ChevronDown, FileText, Send, Sparkles, User, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ChatExport from './ChatExport'

interface ChatInterfaceProps {
  onNewMessage?: () => void
}

export default function ChatInterface({ onNewMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<MockChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<'openai' | 'gemini'>('gemini')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { showToast } = useToast()

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load initial messages on component mount
  useEffect(() => {
    const loadInitialMessages = async () => {
      const initialMessages = await ChatService.getInitialMessages()
      setMessages(initialMessages)
    }
    
    if (messages.length === 0) {
      loadInitialMessages()
    }
  }, [messages.length])

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: MockChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const chatRequest = {
        query: userMessage.content,
        model: selectedModel,
        top_k: 5
      }

      const response = await ChatService.sendMessage(chatRequest)

      if (response.data.success) {
        const assistantMessage: MockChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response.data.answer,
          timestamp: new Date(),
          sources: response.data.sources
        }

        setMessages(prev => [...prev, assistantMessage])
        
        if (response.data.processing_time) {
          showToast(`Phản hồi trong ${response.data.processing_time}ms`, 'success')
        }

        // Trigger refresh of chat history
        onNewMessage?.()
      } else {
        throw new Error('Chat request failed')
      }
    } catch (err: unknown) {
      console.error('Chat error:', err)
      
      let errorText = 'Có lỗi xảy ra khi gửi tin nhắn'
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { detail?: string } } }).response
        if (response?.data?.detail) {
          errorText = response.data.detail
        }
      }
      
      const errorMessage: MockChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: errorText,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
      showToast('Không thể gửi tin nhắn', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = async () => {
    const initialMessages = await ChatService.getInitialMessages()
    setMessages([
      ...initialMessages,
      {
        id: 'cleared',
        type: 'assistant',
        content: 'Cuộc trò chuyện đã được xóa. Tôi sẵn sàng trả lời câu hỏi mới của bạn!',
        timestamp: new Date()
      }
    ])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col">
      {/* Chat Header */}
      <Card className="p-4 border-b rounded-b-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Chatnary AI</h2>
              <p className="text-sm text-gray-500">Chat với tài liệu của bạn</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Model Selection - Improved Design */}
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as 'openai' | 'gemini')}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed min-w-[140px]"
                disabled={loading}
                title="Chọn AI model"
              >
                <option value="gemini">🧠 Gemini AI</option>
                <option value="openai">⚡ OpenAI GPT</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <Button
              onClick={clearChat}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              Xóa chat
            </Button>

            {/* Export Chat */}
            <ChatExport 
              messages={messages}
              isExporting={loading}
            />
          </div>
        </div>
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 rounded-t-none rounded-b-none border-t-0 border-b-0 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-3 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Sources - Tối ưu hiển thị trích dẫn */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-300/50">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Nguồn tham khảo ({message.sources.length})
                        </span>
                      </div>
                      <div className="space-y-3">
                        {message.sources.map((source, index) => (
                          <div 
                            key={index} 
                            className="bg-blue-50/80 border border-blue-200/60 rounded-lg p-3 hover:bg-blue-50 transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 text-sm truncate" title={source.filename}>
                                  {source.filename}
                                </p>
                                <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                                  &quot;{source.snippet}&quot;
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs mt-2 opacity-70">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                    <span className="text-sm">AI đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Input Area */}
      <Card className="p-4 rounded-t-none">
        <div className="flex gap-3">
          <div className="flex-1">
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Hỏi tôi về nội dung tài liệu..."
              rows={1}
              disabled={loading}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="px-4 h-[40px]"
          >
            {loading ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            {selectedModel === 'gemini' ? (
              <>
                <Brain className="w-3 h-3 text-purple-500" />
                AI Model: 🧠 Gemini AI
              </>
            ) : (
              <>
                <Zap className="w-3 h-3 text-green-500" />
                AI Model: ⚡ OpenAI GPT
              </>
            )}
          </span>
          <span>Press Enter để gửi, Shift+Enter để xuống dòng</span>
        </div>
      </Card>
    </div>
  )
}
