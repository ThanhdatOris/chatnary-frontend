'use client';

import { chatsApi } from '@/lib/api';
import { ChatSession } from '@/lib/types';
import { createContext, ReactNode, useContext, useState } from 'react';

interface ChatContextType {
  chats: ChatSession[];
  loading: boolean;
  addChat: (chat: ChatSession) => void;
  updateChat: (updatedChat: ChatSession) => void;
  removeChat: (chatId: string) => void;
  refreshChats: (projectId?: string) => Promise<void>;
  getChatsByProject: (projectId: string) => Promise<ChatSession[]>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);

  // Removed global fetchChats on mount as it depends on project context which is not available here
  // and the API requires projectId.

  const refreshChats = async (projectId?: string) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const response = await chatsApi.getProjectChats(projectId);
      if (response.success && response.data) {
        setChats(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChatsByProject = async (projectId: string): Promise<ChatSession[]> => {
    try {
      const response = await chatsApi.getProjectChats(projectId);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to get chats by project:', error);
      return [];
    }
  };

  const addChat = (chat: ChatSession) => {
    setChats(prev => [chat, ...prev]);
  };

  const updateChat = (updatedChat: ChatSession) => {
    setChats(prev => prev.map(chat => 
      chat.id === updatedChat.id ? updatedChat : chat
    ));
  };

  const removeChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
  };

  return (
    <ChatContext.Provider value={{ 
      chats, 
      loading, 
      addChat, 
      updateChat,
      removeChat, 
      refreshChats, 
      getChatsByProject 
    }}>
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

