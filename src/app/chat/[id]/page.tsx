"use client";

import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatNotFound from '@/components/chat/ChatNotFound';
import ChatRenameModal from '@/components/chat/ChatRenameModal';
import ChatSidebar from '@/components/layout/ChatSidebar';
import MainLayout from '@/components/layout/MainLayout';
import { Button, EmptyState, LoadingState } from '@/components/ui';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { useChats } from '@/contexts/ChatContext';
import { useChat } from '@/hooks/useChat';
import { useProject } from '@/hooks/useProject';
import { suggestionsApi } from '@/lib/api';
import { Edit2, Share, Trash2 } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

// Wrapper component with Suspense boundary for useSearchParams
export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <LoadingState
            title="Đang tải cuộc trò chuyện"
            message="Đang lấy thông tin chat và tin nhắn..."
          />
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}

function ChatPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = params.id as string;
  const projectId = searchParams.get('project');
  
  // Get project data and set breadcrumb context
  const { project } = useProject();
  const { setProjectName, setProjectColor } = useBreadcrumb();
  
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

  // Set project name and color for breadcrumb when project loads
  useEffect(() => {
    if (project?.name) {
      setProjectName(project.name);
    }
    if (project?.color) {
      setProjectColor(project.color);
    }
  }, [project, setProjectName, setProjectColor]);

  // Sync chat title từ context khi có thay đổi từ sidebar
  useEffect(() => {
    if (chatId && chats.length > 0) {
      const updatedChatFromContext = chats.find((c) => c.id === chatId);
      if (
        updatedChatFromContext &&
        chat &&
        updatedChatFromContext.title !== chat.title
      ) {
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
      console.error("Failed to fetch suggestions:", error);
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string) => {
    try {
      console.log("Chat page sending message:", content);
      await sendMessage(content);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message in chat page:", error);
      // Show error message to user
      alert("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.");
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
      <MainLayout showHeaderBorder={false}>
        <LoadingState
          title="Đang tải cuộc trò chuyện"
          message="Đang lấy thông tin chat và tin nhắn..."
        />
      </MainLayout>
    );
  }

  if (chatError) {
    // Kiểm tra nếu là lỗi 404 (Chat not found)
    if (chatError.includes("Chat not found") || chatError.includes("404")) {
      return (
        <MainLayout showHeaderBorder={false}>
          <ChatNotFound />
        </MainLayout>
      );
    }

    // Lỗi khác
    return (
      <MainLayout showHeaderBorder={false}>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto w-16 h-16 mb-6">
              <div className="w-full h-full rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Có lỗi xảy ra
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{chatError}</p>
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
      <MainLayout showHeaderBorder={false}>
        <ChatNotFound />
      </MainLayout>
    );
  }



  return (
    <MainLayout showHeaderBorder={false}>
      <div className="flex h-full">
        {/* Chat Sidebar - Full Height */}
        <ChatSidebar />
        
        {/* Chat Content */}
        <div className="flex-1 h-full flex flex-col bg-white dark:bg-gray-900">
          {/* Custom Chat Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
             <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {chat?.title || "Đang tải..."}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {messages.length} tin nhắn • ID: {chatId.substring(0, 8)}
                </p>
             </div>
             
             <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRenameModalOpen(true)}
                  title="Đổi tên"
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => console.log("Share chat")}
                  title="Chia sẻ"
                  className="h-8 w-8 p-0"
                >
                  <Share className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm("Bạn có chắc muốn xóa cuộc trò chuyện này?")) {
                       console.log("Delete chat");
                    }
                  }}
                  title="Xóa"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
             </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
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
          <div className="flex-shrink-0 relative bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4">
             <div className="max-w-4xl mx-auto">
                <ChatInput
                  onSend={handleSendMessage}
                  disabled={sending}
                  placeholder="Hỏi gì về tài liệu này..."
                />
             </div>
          </div>
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
