'use client';

import { chatsApi, messagesApi } from '@/lib/api';
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

export function useChat({ chatId, projectId, autoFetch = true }: UseChatOptions = {}): UseChatReturn {
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChat = useCallback(async () => {
    if (!chatId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching chat data for:', chatId);
      const response = await chatsApi.getChat(chatId);
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      setChat(response.data || null);
      console.log('Chat data loaded:', response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải chat');
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    
    try {
      setError(null);
      
      console.log('Fetching messages for chat:', chatId);
      const response = await messagesApi.getMessages(chatId);
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      setMessages(response.data || []);
      console.log('Messages loaded:', response.data?.length || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải tin nhắn');
    }
  }, [chatId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!chatId || !content.trim()) {
      throw new Error('Missing chatId or content');
    }

    try {
      setSending(true);
      setError(null);
      
      console.log('Sending message to chat:', chatId, 'Content:', content);
      const response = await messagesApi.sendMessage(chatId, { content });
      
      console.log('Send message response:', response);
      
      if (response.error) {
        setError(response.error);
        throw new Error(response.error);
      }
      
      if (!response.success) {
        throw new Error('Gửi tin nhắn thất bại');
      }
      
      console.log('Message sent successfully');
      // Refresh messages after sending
      await fetchMessages();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi tin nhắn';
      console.error('Send message error:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setSending(false);
    }
  }, [chatId, fetchMessages]);  const refreshChat = useCallback(() => fetchChat(), [fetchChat]);
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

  useEffect(() => {
    if (autoFetch && chatId) {
      fetchChat();
      fetchMessages();
    }
  }, [autoFetch, chatId, fetchChat, fetchMessages]);

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