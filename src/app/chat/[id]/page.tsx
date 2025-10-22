'use client';

import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatNotFound from '@/components/chat/ChatNotFound';
import ChatRenameModal from '@/components/chat/ChatRenameModal';
import HeaderButton from '@/components/layout/HeaderButton';
import MainLayout from '@/components/layout/MainLayout';
import { Button, EmptyState, LoadingState } from '@/components/ui';
import { useChats } from '@/contexts/ChatContext';
import { useChat } from '@/hooks/useChat';
import useProjectBreadcrumb from '@/hooks/useProjectBreadcrumb';
import { suggestionsApi } from '@/lib/api';
import { Edit2, Share, Trash2 } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = params.id as string;
  const projectId = searchParams.get('project');
  
  // Set project name for breadcrumb
  useProjectBreadcrumb();
  
  const {
    chat,
    messages,
    loading,
    sending,
    error: chatError,
    sendMessage,
    updateChatLocal,
  } = useChat({ chatId, projectId: projectId || undefined });
  
  const { updateChat, chats } = useChats();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync chat title từ context khi có thay đổi từ sidebar
  useEffect(() => {
    if (chatId && chats.length > 0) {
      const updatedChatFromContext = chats.find(c => c.id === chatId);
      if (updatedChatFromContext && chat && updatedChatFromContext.title !== chat.title) {
        updateChatLocal(updatedChatFromContext);
      }
    }
  }, [chats, chatId, chat, updateChatLocal]);

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

  const handleChatUpdate = (updatedChat: typeof chat) => {
    if (updatedChat) {
      updateChatLocal(updatedChat);
      updateChat(updatedChat);
    }
  };

  if (loading) {
    return (
      <MainLayout
        headerTitle="Đang tải..."
        headerSubtitle="Đang lấy thông tin cuộc trò chuyện"
      >
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
        <MainLayout
          headerTitle="Chat không tìm thấy"
          headerSubtitle="Cuộc trò chuyện này có thể đã bị xóa"
        >
          <ChatNotFound />
        </MainLayout>
      );
    }

    // Lỗi khác
    return (
      <MainLayout
        headerTitle="Có lỗi xảy ra"
        headerSubtitle="Không thể tải cuộc trò chuyện"
        headerActions={
          <HeaderButton
            onClick={() => window.location.reload()}
            variant="primary"
          >
            🔄 Thử lại
          </HeaderButton>
        }
      >
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
      <MainLayout
        headerTitle="Chat không tìm thấy"
        headerSubtitle="Cuộc trò chuyện này có thể đã bị xóa hoặc bạn không có quyền truy cập"
      >
        <ChatNotFound />
      </MainLayout>
    );
  }

  // Prepare header actions
  const headerActions = (
    <>
      <HeaderButton
        icon={<Edit2 className="w-4 h-4" />}
        onClick={() => setIsRenameModalOpen(true)}
        tooltip="Đổi tên cuộc trò chuyện"
      >
        Đổi tên
      </HeaderButton>
      <HeaderButton
        icon={<Share className="w-4 h-4" />}
        onClick={() => {
          // TODO: Implement share functionality
          console.log('Share chat');
        }}
        variant="secondary"
        tooltip="Chia sẻ cuộc trò chuyện"
      >
        Chia sẻ
      </HeaderButton>
      <HeaderButton
        icon={<Trash2 className="w-4 h-4" />}
        onClick={() => {
          // TODO: Implement delete functionality
          if (confirm('Bạn có chắc muốn xóa cuộc trò chuyện này?')) {
            console.log('Delete chat');
          }
        }}
        variant="danger"
        tooltip="Xóa cuộc trò chuyện"
      >
        Xóa
      </HeaderButton>
    </>
  );

  return (
    <MainLayout
      headerTitle={chat?.title || 'Đang tải...'}
      headerSubtitle={`Chat AI • ${messages.length} tin nhắn • ID: ${chatId.substring(0, 8)}`}
      headerActions={headerActions}
    >
      <div className="h-full flex flex-col">
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
        <div className="flex-shrink-0 relative bg-white dark:bg-gray-900 shadow-[0_-15px_30px_2px_rgba(255,255,255,1),0_-30px_60px_0px_rgba(255,255,255,0.8),0_-45px_90px_-10px_rgba(255,255,255,0.6)] dark:shadow-[0_-15px_30px_2px_rgba(17,24,39,1),0_-30px_60px_0px_rgba(17,24,39,0.8),0_-45px_90px_-10px_rgba(17,24,39,0.6)]">
          <ChatInput
            onSend={handleSendMessage}
            disabled={sending}
            placeholder="Hỏi gì về tài liệu này..."
          />
        </div>
      </div>
      
      {/* Chat Rename Modal */}
      <ChatRenameModal
        isOpen={isRenameModalOpen}
        chat={chat}
        onClose={() => setIsRenameModalOpen(false)}
        onUpdate={handleChatUpdate}
      />
    </MainLayout>
  );
}

