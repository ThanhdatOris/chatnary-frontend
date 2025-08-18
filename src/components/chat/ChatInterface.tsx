'use client'

import { Button, Card, TextArea } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { api, API_ENDPOINTS } from '@/lib/api'
import { Bot, FileText, MessageCircle, Send, Sparkles, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ChatExport from './ChatExport'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: Array<{
    filename: string
    snippet: string
  }>
}

interface ChatRequest {
  query: string
  file_ids?: string[]
  model?: 'openai' | 'gemini'
  top_k?: number
}

interface ChatResponse {
  success: boolean
  answer: string
  sources?: Array<{
    filename: string
    snippet: string
  }>
  model_used?: string
  processing_time?: number
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<'openai' | 'gemini'>('gemini')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { showToast } = useToast()

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Add welcome message on component mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        type: 'assistant',
        content: 'Xin chào! Tôi là AI assistant của Chatnary. Tôi có thể giúp bạn tìm hiểu nội dung trong các tài liệu đã tải lên. Hãy hỏi tôi bất cứ điều gì!',
        timestamp: new Date()
      }])
    }
  }, [messages.length])

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const chatRequest: ChatRequest = {
        query: userMessage.content,
        model: selectedModel,
        top_k: 5
      }

      const response = await api.post<ChatResponse>(API_ENDPOINTS.chat.send, chatRequest)

      if (response.data.success) {
        const assistantMessage: ChatMessage = {
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
      
      const errorMessage: ChatMessage = {
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

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      type: 'assistant',
      content: 'Cuộc trò chuyện đã được xóa. Tôi sẵn sàng trả lời câu hỏi mới của bạn!',
      timestamp: new Date()
    }])
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
            {/* Model Selection */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as 'openai' | 'gemini')}
              className="text-sm border rounded px-2 py-1"
              disabled={loading}
              title="Chọn AI model"
            >
              <option value="gemini">Gemini AI</option>
              <option value="openai">OpenAI GPT</option>
            </select>
            
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
                  
                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Nguồn tham khảo:
                      </p>
                      <div className="space-y-2">
                        {message.sources.map((source, index) => (
                          <div key={index} className="text-xs bg-white rounded p-2 border">
                            <p className="font-medium text-gray-700">{source.filename}</p>
                            <p className="text-gray-600 mt-1">{source.snippet}</p>
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
            <MessageCircle className="w-3 h-3" />
            AI Model: {selectedModel === 'gemini' ? 'Gemini' : 'OpenAI GPT'}
          </span>
          <span>Press Enter để gửi, Shift+Enter để xuống dòng</span>
        </div>
      </Card>
    </div>
  )
}
