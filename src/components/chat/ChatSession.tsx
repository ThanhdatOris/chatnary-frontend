'use client'

import { Button, Card, Modal } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Brain, Copy, Download, FileText, Share2, Zap } from 'lucide-react'
import { useState } from 'react'

type ChatChunk = {
  content?: string
  text?: string
} & Record<string, unknown>

interface ChatSource {
  file_id: string
  file_name: string
  chunks: ChatChunk[]
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

interface ChatSessionProps {
  chat: ChatHistoryItem | null
  isOpen: boolean
  onClose: () => void
}

export default function ChatSession({ chat, isOpen, onClose }: ChatSessionProps) {
  const [copying, setCopying] = useState(false)
  const { showToast } = useToast()

  if (!chat) return null

  const getModelIcon = (model: string) => {
    switch (model.toLowerCase()) {
      case 'gemini':
        return <Brain className="w-5 h-5 text-purple-500" />
      case 'openai':
        return <Zap className="w-5 h-5 text-green-500" />
      default:
        return <Brain className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getModelName = (model: string) => {
    switch (model.toLowerCase()) {
      case 'gemini':
        return '🧠 Gemini AI'
      case 'openai':
        return '⚡ OpenAI GPT'
      default:
        return model
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return {
      date: formatDate(date.toISOString()),
      time: date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
  }

  const handleCopyConversation = async () => {
    setCopying(true)
    try {
      const conversationText = `
Câu hỏi: ${chat.query}

Trả lời: ${chat.answer}

Nguồn tham khảo:
${chat.sources.map(source => `- ${source.file_name} (${source.chunk_count} đoạn)`).join('\n')}

Thời gian: ${formatTimestamp(chat.timestamp).date} ${formatTimestamp(chat.timestamp).time}
AI Model: ${getModelName(chat.model_used)}
      `.trim()

      await navigator.clipboard.writeText(conversationText)
      showToast('Đã sao chép cuộc hội thoại', 'success')
    } catch {
      showToast('Không thể sao chép', 'error')
    } finally {
      setCopying(false)
    }
  }

  const handleDownloadConversation = () => {
    const conversationText = `
Cuộc hội thoại với ${getModelName(chat.model_used)}
Thời gian: ${formatTimestamp(chat.timestamp).date} ${formatTimestamp(chat.timestamp).time}

=====================================

Câu hỏi:
${chat.query}

=====================================

Trả lời:
${chat.answer}

=====================================

Nguồn tham khảo:
${chat.sources.map((source, index) => `
${index + 1}. File: ${source.file_name}
   Số đoạn tham khảo: ${source.chunk_count}
   ${source.chunks.map(chunk => `   - ${chunk.content || chunk.text || 'N/A'}`).join('\n')}
`).join('')}

=====================================
Xuất bởi Chatnary - ${new Date().toLocaleString('vi-VN')}
    `.trim()

    const blob = new Blob([conversationText], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `chat-${chat.id}-${formatTimestamp(chat.timestamp).date.replace(/\//g, '-')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    showToast('Đã tải xuống cuộc hội thoại', 'success')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cuộc hội thoại với AI',
          text: `${chat.query}\n\n${chat.answer.substring(0, 200)}...`,
        })
      } catch {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      handleCopyConversation()
    }
  }

  const { date, time } = formatTimestamp(chat.timestamp)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-3">
              {getModelIcon(chat.model_used)}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  Chi tiết cuộc hội thoại
                </h2>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-foreground">{getModelName(chat.model_used)}</span>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Nguồn:</span>
                      <span className="font-medium text-foreground">{chat.sources.length} tài liệu</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-foreground">{date} lúc {time}</span>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-foreground">{chat.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCopyConversation}
              variant="outline"
              size="sm"
              disabled={copying}
              className="flex items-center gap-2"
            >
              {copying ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              Sao chép
            </Button>
            
            <Button
              onClick={handleDownloadConversation}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Tải về
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Chia sẻ
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-session-modal">
          {/* Question */}
          <Card className="chat-session-card user-message">
            <div className="flex items-start gap-4 p-6">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">Q</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-2">Câu hỏi</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {chat.query}
                </p>
              </div>
            </div>
          </Card>

          {/* Answer */}
          <Card className="chat-session-card ai-message">
            <div className="flex items-start gap-4 p-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-foreground">Trả lời</h3>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                    {getModelIcon(chat.model_used)}
                    {getModelName(chat.model_used)}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {chat.answer}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Sources */}
          {chat.sources.length > 0 && (
            <Card className="chat-session-card">
              <div className="flex items-start gap-4 p-6">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-4">
                    Nguồn tham khảo ({chat.sources.length})
                  </h3>
                  <div className="space-y-4">
                    {chat.sources.map((source, index) => (
                      <div
                        key={index}
                        className="source-reference"
                      >
                        <div className="flex items-start gap-3 p-4">
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground mb-2">
                              {source.file_name}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {source.chunk_count} đoạn văn được tham khảo
                            </p>
                            
                            {/* Chunks Preview */}
                            {source.chunks.length > 0 && (
                              <div className="space-y-2">
                                {source.chunks.slice(0, 2).map((chunk, chunkIndex) => (
                                  <div key={chunkIndex} className="bg-background rounded border p-3">
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      &quot;{(chunk.content || chunk.text || 'Nội dung không khả dụng').substring(0, 200)}...&quot;
                                    </p>
                                  </div>
                                ))}
                                {source.chunks.length > 2 && (
                                  <p className="text-xs text-muted-foreground italic">
                                    +{source.chunks.length - 2} đoạn khác
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Modal>
  )
}
