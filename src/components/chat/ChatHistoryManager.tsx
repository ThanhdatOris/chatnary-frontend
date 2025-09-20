'use client'

import { useState } from 'react'
import ChatHistory from './ChatHistory'
import ChatSession from './ChatSession'

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

export default function ChatHistoryManager() {
  const [selectedChat, setSelectedChat] = useState<ChatHistoryItem | null>(null)
  const [isSessionOpen, setIsSessionOpen] = useState(false)

  const handleSelectChat = (chat: ChatHistoryItem) => {
    setSelectedChat(chat)
    setIsSessionOpen(true)
  }

  const handleCloseSession = () => {
    setIsSessionOpen(false)
    setSelectedChat(null)
  }

  return (
    <>
      <ChatHistory onSelectChat={handleSelectChat} />
      
      <ChatSession
        chat={selectedChat}
        isOpen={isSessionOpen}
        onClose={handleCloseSession}
      />
    </>
  )
}
