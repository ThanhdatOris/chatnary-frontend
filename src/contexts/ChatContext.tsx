"use client";

import { chatsApi } from "@/lib/api";
import { ChatSession } from "@/lib/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

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
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchChats = async () => {
    if (hasFetched && !loading) return; // Không fetch lại nếu đã có data

    setLoading(true);
    try {
      const response = await chatsApi.getGlobalChats();
      if (response.success && response.data) {
        setChats(response.data);
        setHasFetched(true);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshChats = async (projectId?: string) => {
    setLoading(true);
    try {
      const response = projectId
        ? await chatsApi.getProjectChats(projectId)
        : await chatsApi.getGlobalChats();
      if (response.success && response.data) {
        setChats(response.data);
      }
    } catch (error) {
      console.error("Failed to refresh chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getChatsByProject = async (
    projectId: string
  ): Promise<ChatSession[]> => {
    try {
      const response = await chatsApi.getProjectChats(projectId);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Failed to get chats by project:", error);
      return [];
    }
  };

  const addChat = (chat: ChatSession) => {
    // Optimistic update - UI update ngay lập tức
    setChats((prev) => [chat, ...prev]);

    // Auto refresh sau 1.5s để đảm bảo sync với DB
    setTimeout(() => {
      refreshChats();
    }, 1500);
  };

  const updateChat = (updatedChat: ChatSession) => {
    // Optimistic update - UI update ngay lập tức
    setChats((prev) =>
      prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
    );
  };

  const removeChat = (chatId: string) => {
    // Optimistic update - UI update ngay lập tức
    setChats((prev) => prev.filter((c) => c.id !== chatId));

    // Auto refresh sau 1.5s để đảm bảo sync với DB
    setTimeout(() => {
      refreshChats();
    }, 1500);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        loading,
        addChat,
        updateChat,
        removeChat,
        refreshChats,
        getChatsByProject,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChats() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChats must be used within ChatProvider");
  }
  return context;
}
