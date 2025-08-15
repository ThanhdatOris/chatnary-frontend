'use client'

import { Button } from '@/components/ui'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Download, FileText } from 'lucide-react'

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

interface ChatExportProps {
  messages: ChatMessage[]
  onExport: () => void
  isExporting?: boolean
}

export default function ChatExport({ messages, onExport, isExporting = false }: ChatExportProps) {
  const exportToText = () => {
    const chatContent = messages.map(message => {
      const timestamp = format(message.timestamp, 'dd/MM/yyyy HH:mm:ss', { locale: vi })
      const role = message.type === 'user' ? 'Bạn' : 'AI Assistant'
      
      let content = `[${timestamp}] ${role}:\n${message.content}\n`
      
      if (message.sources && message.sources.length > 0) {
        content += '\nNguồn tham khảo:\n'
        message.sources.forEach((source, index) => {
          content += `${index + 1}. ${source.filename}\n   ${source.snippet}\n`
        })
      }
      
      return content
    }).join('\n---\n\n')
    
    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chatnary-chat-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToMarkdown = () => {
    const chatContent = `# Chatnary - Lịch sử trò chuyện
*Xuất ngày: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: vi })}*

${messages.map(message => {
  const timestamp = format(message.timestamp, 'dd/MM/yyyy HH:mm:ss', { locale: vi })
  const role = message.type === 'user' ? '**Bạn**' : '**AI Assistant**'
  
  let content = `## ${timestamp} - ${role}\n\n${message.content}\n`
  
  if (message.sources && message.sources.length > 0) {
    content += '\n### Nguồn tham khảo:\n\n'
    message.sources.forEach((source, index) => {
      content += `${index + 1}. **${source.filename}**\n   \`\`\`\n   ${source.snippet}\n   \`\`\`\n\n`
    })
  }
  
  return content
}).join('\n---\n\n')}`
    
    const blob = new Blob([chatContent], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chatnary-chat-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportToText}
        disabled={isExporting || messages.length === 0}
        className="flex items-center gap-2"
        title="Xuất ra file text"
      >
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">TXT</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={exportToMarkdown}
        disabled={isExporting || messages.length === 0}
        className="flex items-center gap-2"
        title="Xuất ra file Markdown"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">MD</span>
      </Button>
    </div>
  )
}
