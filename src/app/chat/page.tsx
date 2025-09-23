'use client'

import ChatLayout from '@/components/chat/ChatLayout'
import ModernLayout from '@/components/layout/ModernLayout'

export default function ChatPage() {
  return (
    <ModernLayout 
      title="Trò chuyện với AI" 
      description="Đặt câu hỏi và nhận câu trả lời thông minh từ tài liệu của bạn"
    >
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden h-[calc(85vh)] sticky top-16 z-20">
        <ChatLayout className="h-full" />
      </div>
    </ModernLayout>
  )
}


