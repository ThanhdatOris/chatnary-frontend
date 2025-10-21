'use client';

import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';
import SuggestionChips from '@/components/chat/SuggestionChips';
import MainLayout from '@/components/layout/MainLayout';
import { Button, Loading } from '@/components/ui';
import { chatsApi, messagesApi, suggestionsApi } from '@/lib/api';
import { ChatSession, Message } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;
  
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedModel, setSelectedModel] = useState('GPT-4');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChatData = useCallback(async () => {
    setLoading(true);
    try {
      const [chatRes, messagesRes, suggestionsRes] = await Promise.all([
        chatsApi.getChat(chatId),
        messagesApi.getMessages(chatId),
        suggestionsApi.getSuggestions(chatId),
      ]);

      if (chatRes.success && chatRes.data) setChat(chatRes.data);
      if (messagesRes.success && messagesRes.data) setMessages(messagesRes.data);
      if (suggestionsRes.success && suggestionsRes.data) setSuggestions(suggestionsRes.data);
    } catch (error) {
      console.error('Failed to fetch chat data:', error);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      fetchChatData();
    }
  }, [chatId, fetchChatData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.model-menu-container')) {
        setShowModelMenu(false);
      }
      if (!target.closest('.chat-menu-container')) {
        setShowChatMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (content: string) => {
    setSending(true);
    try {
      const response = await messagesApi.sendMessage(chatId, { content });
      
      if (response.success && response.data) {
        // Refresh messages
        const messagesRes = await messagesApi.getMessages(chatId);
        if (messagesRes.success && messagesRes.data) {
          setMessages(messagesRes.data);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    handleSend(suggestion);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading size="lg" text="Đang tải cuộc trò chuyện..." />
        </div>
      </MainLayout>
    );
  }

  if (!chat) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Không tìm thấy cuộc trò chuyện
          </h2>
          <Button onClick={() => router.push('/chat')}>
            Tạo cuộc trò chuyện mới
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="fixed inset-0 flex flex-col" style={{ marginLeft: 'inherit', top: 0, bottom: 0 }}>
        {/* Header - ChatGPT Style */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 h-14">
            {/* Model Selector */}
            <div className="relative model-menu-container">
              <button
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                <span>{selectedModel}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Model Dropdown */}
              {showModelMenu && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {['GPT-4', 'GPT-3.5', 'Claude', 'Gemini'].map((model) => (
                    <button
                      key={model}
                      onClick={() => {
                        setSelectedModel(model);
                        setShowModelMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      {model}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Menu */}
            <div className="relative chat-menu-container">
              <button
                onClick={() => setShowChatMenu(!showChatMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Menu chat"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>

              {/* Menu Dropdown */}
              {showChatMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <button 
                    onClick={() => setShowChatMenu(false)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    Đổi tên
                  </button>
                  <button 
                    onClick={() => setShowChatMenu(false)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    Chia sẻ
                  </button>
                  <button 
                    onClick={() => setShowChatMenu(false)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                  >
                    Xóa chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 pt-0">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Bắt đầu cuộc trò chuyện
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Đặt câu hỏi về tài liệu của bạn
                </p>
                {suggestions.length > 0 && (
                  <div className="max-w-2xl mx-auto">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Gợi ý câu hỏi:
                    </p>
                    <SuggestionChips
                      suggestions={suggestions}
                      onSelect={handleSuggestionSelect}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0">
          <ChatInput
            onSend={handleSend}
            disabled={sending}
            placeholder="Hỏi gì về tài liệu này..."
          />
        </div>
      </div>
    </MainLayout>
  );
}

