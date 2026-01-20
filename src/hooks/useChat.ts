'use client';

import { chatsApi, messagesApi } from '@/lib/api';
import { USE_MOCK_DATA, getMockChat, getMockMessagesByChat, simulateDelay } from '@/lib/mockData';
import { ChatSession, Message } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

interface UseChatOptions {
  chatId?: string;
  projectId?: string;
  autoFetch?: boolean;
}

interface UseChatReturn {
  chat: ChatSession | null;
  messages: Message[];
  loading: boolean;
  sending: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  updateChatLocal: (updatedChat: ChatSession) => void;
  refreshChat: () => Promise<void>;
  refreshMessages: () => Promise<void>;
}

export function useChat({ chatId, projectId: initialProjectId, autoFetch = true }: UseChatOptions = {}): UseChatReturn {
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived ProjectId: either passed explicitly or found in loaded chat
  const projectId = initialProjectId || chat?.projectId;

  const fetchChat = useCallback(async () => {
    if (!chatId) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching chat data for:', chatId);
      
      // ========================================
      // 🔄 MOCK MODE - Get mock chat
      // ========================================
      if (USE_MOCK_DATA) {
        await simulateDelay(300);
        const mockChat = getMockChat(chatId);
        setChat(mockChat || null);
        console.log('Mock chat data loaded:', mockChat);
      } else {
        // Original API call
        const response = await chatsApi.getChat(chatId);

        if (response.error) {
          setError(response.error);
          return;
        }

        setChat(response.data || null);
        console.log('Chat data loaded:', response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải chat');
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  const fetchMessages = useCallback(async () => {
    if (!chatId || !projectId) return;
    
    try {
      setError(null);
      
      console.log('Fetching messages for chat:', chatId, 'Project:', projectId);
      
      // ========================================
      // 🔄 MOCK MODE - Get mock messages
      // ========================================
      if (USE_MOCK_DATA) {
        await simulateDelay(300);
        const mockMsgs = getMockMessagesByChat(chatId);
        setMessages(mockMsgs);
        console.log('Mock messages loaded:', mockMsgs.length);
      } else {
        // Original API call
        const response = await messagesApi.getMessages(projectId, chatId);
        
        if (response.error) {
          setError(response.error);
          return;
        }

        setMessages(response.data || []);
        console.log('Messages loaded:', response.data?.length || 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải tin nhắn');
    }
  }, [chatId, projectId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!chatId || !content.trim()) {
      throw new Error('Missing chatId or content');
    }
    
    if (!projectId) {
       throw new Error('Missing projectId');
    }

    if (!projectId) {
      throw new Error('Missing projectId for sending messages');
    }

    try {
      setSending(true);
      setError(null);
      
      console.log('Sending message to chat:', chatId, 'Project:', projectId, 'Content:', content);
      
      // ========================================
      // 🔄 MOCK MODE - Simulate send message
      // ========================================
      if (USE_MOCK_DATA) {
        await simulateDelay(800);
        
        // Add user message
        const userMessage: Message = {
          id: `msg-${Date.now()}-user`,
          chatId: chatId,
          role: 'user',
          content: content,
          createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, userMessage]);
        
        // Simulate AI response after 1.5 seconds
        setTimeout(() => {
          const assistantMessage: Message = {
            id: `msg-${Date.now()}-assistant`,
            chatId: chatId,
            role: 'assistant',
            content: 'Đây là phản hồi mẫu từ mock data. Trong môi trường thật, đây sẽ là câu trả lời từ AI dựa trên tài liệu của bạn.',
            sources: [],
            createdAt: new Date().toISOString(),
          };
          setMessages(prev => [...prev, assistantMessage]);
        }, 1500);
        
        console.log('Mock message sent successfully');
      } else {
        // Original API call
        const response = await messagesApi.sendMessage(projectId, { content, chatId });
        
        console.log('Send message response:', response);
        
        if (response.error) {
          setError(response.error);
          throw new Error(response.error);
        }

        if (!response.success) {
          throw new Error('Gửi tin nhắn thất bại');
        }

        // Refresh messages after sending
        await fetchMessages();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi tin nhắn';
      setError(errorMessage);
      throw err;
    } finally {
      setSending(false);
    }
  }, [chatId, projectId, fetchMessages]);

  const refreshChat = useCallback(() => fetchChat(), [fetchChat]);
  const refreshMessages = useCallback(() => fetchMessages(), [fetchMessages]);

  const updateChatLocal = useCallback((updatedChat: ChatSession) => {
    setChat(updatedChat);
  }, []);

  // Reset state when chatId changes
  useEffect(() => {
    if (chatId) {
      setLoading(true);
      setChat(null);
      setMessages([]);
      setError(null);
    }
  }, [chatId]);

  // Initial Fetch logic
  useEffect(() => {
    if (autoFetch && chatId) {
      // Always fetch chat to ensure we have metadata (like projectId if missing)
      fetchChat();
    }
  }, [autoFetch, chatId, fetchChat]);

  // Fetch messages once we have projectId (either from prop or fetched chat)
  useEffect(() => {
    if (autoFetch && chatId && projectId) {
      fetchMessages();
    }
  }, [autoFetch, chatId, projectId, fetchMessages]);

  return {
    chat,
    messages,
    loading,
    sending,
    error,
    sendMessage,
    updateChatLocal,
    refreshChat,
    refreshMessages,
  };
}