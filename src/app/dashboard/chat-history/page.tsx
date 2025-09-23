'use client'

import ChatHistoryManager from '@/components/chat/ChatHistoryManager'
import ModernLayout from '@/components/layout/ModernLayout'

export default function ChatHistoryPage() {
  return (
    <ModernLayout 
      title="Lịch sử trò chuyện" 
      description="Xem lại các cuộc trò chuyện trước đây với AI"
    >
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
        <ChatHistoryManager />
      </div>
    </ModernLayout>
  )
}
