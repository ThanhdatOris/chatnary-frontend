'use client';

import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';
import SuggestionChips from '@/components/chat/SuggestionChips';
import MainLayout from '@/components/layout/MainLayout';
import { Button, Loading } from '@/components/ui';
import { chatsApi, messagesApi, suggestionsApi } from '@/lib/api';
import { ChatSession, Message } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;
  
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      fetchChatData();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatData = async () => {
    setLoading(true);
    try {
      const [chatRes, messagesRes, suggestionsRes] = await Promise.all([
        chatsApi.getChat(chatId),
        messagesApi.getMessages(chatId),
        suggestionsApi.getSuggestions(chatId),
      ]);

      if (chatRes.success && chatRes.data) setChat(chatRes.data);
      if (messagesRes.success && messagesRes.data) setMessages(messagesRes.data.items);
      if (suggestionsRes.success && suggestionsRes.data) setSuggestions(suggestionsRes.data.suggestions);
    } catch (error) {
      console.error('Failed to fetch chat data:', error);
    } finally {
      setLoading(false);
    }
  };

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
          setMessages(messagesRes.data.items);
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
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {chat.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {chat.documents?.map((doc) => (
                  <span
                    key={doc.id}
                    className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                  >
                    📄 {doc.name}
                  </span>
                ))}
              </div>
            </div>
            <Button variant="ghost" onClick={() => router.push('/history')}>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lịch sử
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
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

        {/* Input Area */}
        <ChatInput
          onSend={handleSend}
          disabled={sending}
          placeholder="Hỏi gì về tài liệu này..."
        />
      </div>
    </MainLayout>
  );
}

