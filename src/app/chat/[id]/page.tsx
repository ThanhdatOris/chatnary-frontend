'use client';

import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatNotFound from '@/components/chat/ChatNotFound';
import SuggestionChips from '@/components/chat/SuggestionChips';
import MainLayout from '@/components/layout/MainLayout';
import { Button, EmptyState, Loading, LoadingState } from '@/components/ui';
import { useChat } from '@/hooks/useChat';
import { suggestionsApi } from '@/lib/api';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = params.id as string;
  const projectId = searchParams.get('project');
  
  const {
    chat,
    messages,
    loading,
    sending,
    error: chatError,
    sendMessage,
    refreshChat,
    refreshMessages,
  } = useChat({ chatId, projectId: projectId || undefined });
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await suggestionsApi.getSuggestions(chatId);
      if (response.success && response.data) {
        setSuggestions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      fetchSuggestions();
    }
  }, [chatId, fetchSuggestions]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    try {
      console.log('Chat page sending message:', content);
      await sendMessage(content);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message in chat page:', error);
      // Show error message to user
      alert('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.');
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (loading && !chat) {
    return (
      <MainLayout>
        <LoadingState 
          title="Đang tải cuộc trò chuyện"
          message="Đang lấy thông tin chat và tin nhắn..."
        />
      </MainLayout>
    );
  }

  if (chatError) {
    // Kiểm tra nếu là lỗi 404 (Chat not found)
    if (chatError.includes('Chat not found') || chatError.includes('404')) {
      return (
        <MainLayout>
          <ChatNotFound />
        </MainLayout>
      );
    }

    // Lỗi khác
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto w-16 h-16 mb-6">
              <div className="w-full h-full rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Có lỗi xảy ra
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {chatError}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()}
                variant="primary"
                className="w-full"
              >
                🔄 Thử lại
              </Button>
              <Button 
                onClick={() => router.push(`/chat?project=${projectId}`)}
                variant="secondary"
                className="w-full"
              >
                Tạo cuộc trò chuyện mới
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!chat) {
    return (
      <MainLayout>
        <ChatNotFound />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4 px-6 flex-shrink-0">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {chat?.title || 'Đang tải...'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/chat?project=${projectId}`)}
              >
                Quay lại
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto h-full">
            {messages.length === 0 ? (
              <EmptyState
                title="Bắt đầu cuộc trò chuyện"
                description="Đặt câu hỏi về tài liệu trong dự án này. AI sẽ phân tích và trả lời dựa trên nội dung tài liệu."
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionSelect}
              />
            ) : (
              <div className="px-4 py-6 space-y-6">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <ChatInput
              onSend={handleSendMessage}
              disabled={sending}
              placeholder="Hỏi gì về tài liệu này..."
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

