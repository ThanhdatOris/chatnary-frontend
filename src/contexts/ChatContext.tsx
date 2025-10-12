'use client';

import { chatsApi } from '@/lib/api';
import { ChatSession } from '@/lib/types';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ChatContextType {
  chats: ChatSession[];
  loading: boolean;
  addChat: (chat: ChatSession) => void;
  removeChat: (chatId: string) => void;
  refreshChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchChats = async () => {
    if (hasFetched && !loading) return; // Không fetch lại nếu đã có data
    
    setLoading(true);
    try {
      const response = await chatsApi.getChats();
      if (response.success && response.data) {
        setChats(response.data.items);
        setHasFetched(true);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshChats = async () => {
    setLoading(true);
    try {
      const response = await chatsApi.getChats();
      if (response.success && response.data) {
        setChats(response.data.items);
      }
    } catch (error) {
      console.error('Failed to refresh chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const addChat = (chat: ChatSession) => {
    // Optimistic update - UI update ngay lập tức
    setChats(prev => [chat, ...prev]);
    
    // Auto refresh sau 1.5s để đảm bảo sync với DB
    setTimeout(() => {
      refreshChats();
    }, 1500);
  };

  const removeChat = (chatId: string) => {
    // Optimistic update - UI update ngay lập tức
    setChats(prev => prev.filter(c => c.id !== chatId));
    
    // Auto refresh sau 1.5s để đảm bảo sync với DB
    setTimeout(() => {
      refreshChats();
    }, 1500);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <ChatContext.Provider value={{ chats, loading, addChat, removeChat, refreshChats }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChats() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChats must be used within ChatProvider');
  }
  return context;
}

