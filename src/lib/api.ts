/**
 * API Service Layer
 * Sử dụng mock data - sẽ thay thế bằng real API calls sau
 */

import {
    allMockDocuments,
    mockChatSessions,
    mockMessages,
    mockOverviewStats,
    mockSuggestions,
    mockUser,
} from './mockData';
import {
    ApiResponse,
    ChatSession,
    CreateChatRequest,
    Document,
    Message,
    OverviewStats,
    PaginatedResponse,
    PaginationParams,
    SendMessageRequest,
    Suggestions,
    User,
} from './types';

// Simula delay để giống real API
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== AUTH ====================
export const authApi = {
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay();
    return {
      success: true,
      data: {
        user: mockUser,
        token: 'mock_token_123456',
      },
    };
  },

  async register(name: string, email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay();
    return {
      success: true,
      data: {
        user: { ...mockUser, name, email },
        token: 'mock_token_123456',
      },
    };
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(200);
    return {
      success: true,
      data: mockUser,
    };
  },
};

// ==================== DOCUMENTS ====================
export const documentsApi = {
  async getDocuments(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Document>>> {
    await delay();
    
    let filteredDocs = [...allMockDocuments];
    
    // Search filter
    if (params?.search) {
      filteredDocs = filteredDocs.filter(doc =>
        doc.name.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    // Sorting
    if (params?.sortBy) {
      filteredDocs.sort((a, b) => {
        const aVal = a[params.sortBy as keyof Document];
        const bVal = b[params.sortBy as keyof Document];
        const order = params.sortOrder === 'asc' ? 1 : -1;
        
        // Handle null/undefined values
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return order;
        if (bVal == null) return -order;
        
        return aVal > bVal ? order : -order;
      });
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedDocs = filteredDocs.slice(start, end);
    
    return {
      success: true,
      data: {
        items: paginatedDocs,
        pagination: {
          page,
          limit,
          total: filteredDocs.length,
          totalPages: Math.ceil(filteredDocs.length / limit),
        },
      },
    };
  },

  async getDocument(id: string): Promise<ApiResponse<Document>> {
    await delay(300);
    const doc = allMockDocuments.find((d: Document) => d.id === id);
    
    if (!doc) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      };
    }
    
    return {
      success: true,
      data: doc,
    };
  },

  async uploadDocument(file: File): Promise<ApiResponse<Document>> {
    await delay(2000); // Simulate upload time
    
    const newDoc: Document = {
      id: `doc_${Date.now()}`,
      name: file.name,
      originalName: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      status: 'processing',
      uploadedAt: new Date().toISOString(),
      processedAt: null,
      pageCount: null,
      wordCount: null,
      chatCount: 0,
    };
    
    // Simulate processing
    setTimeout(() => {
      newDoc.status = 'completed';
      newDoc.processedAt = new Date().toISOString();
      newDoc.pageCount = Math.floor(Math.random() * 50) + 1;
      newDoc.wordCount = Math.floor(Math.random() * 10000) + 1000;
    }, 3000);
    
    return {
      success: true,
      data: newDoc,
    };
  },

  async deleteDocument(id: string): Promise<ApiResponse<void>> {
    await delay(500);
    const index = allMockDocuments.findIndex((d: Document) => d.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      };
    }
    
    allMockDocuments.splice(index, 1);
    
    return {
      success: true,
    };
  },
};

// ==================== CHATS ====================
export const chatsApi = {
  async getChats(params?: PaginationParams & { documentId?: string }): Promise<ApiResponse<PaginatedResponse<ChatSession>>> {
    await delay();
    
    let filteredChats = [...mockChatSessions];
    
    // Filter by document
    if (params?.documentId) {
      filteredChats = filteredChats.filter(chat =>
        chat.documentIds.includes(params.documentId!)
      );
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedChats = filteredChats.slice(start, end);
    
    return {
      success: true,
      data: {
        items: paginatedChats,
        pagination: {
          page,
          limit,
          total: filteredChats.length,
          totalPages: Math.ceil(filteredChats.length / limit),
        },
      },
    };
  },

  async getChat(id: string): Promise<ApiResponse<ChatSession>> {
    await delay(300);
    const chat = mockChatSessions.find(c => c.id === id);
    
    if (!chat) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Chat not found',
        },
      };
    }
    
    return {
      success: true,
      data: chat,
    };
  },

  async createChat(request: CreateChatRequest): Promise<ApiResponse<ChatSession>> {
    await delay(500);
    
    const newChat: ChatSession = {
      id: `chat_${Date.now()}`,
      title: request.title || 'Chat mới',
      documentIds: request.documentIds,
      documents: request.documentIds.map(docId => {
        const doc = allMockDocuments.find((d: Document) => d.id === docId);
        return {
          id: docId,
          name: doc?.name || 'Unknown',
          type: doc?.type,
        };
      }),
      messageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockChatSessions.unshift(newChat);
    
    return {
      success: true,
      data: newChat,
    };
  },

  async deleteChat(id: string): Promise<ApiResponse<void>> {
    await delay(500);
    const index = mockChatSessions.findIndex(c => c.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Chat not found',
        },
      };
    }
    
    mockChatSessions.splice(index, 1);
    
    return {
      success: true,
    };
  },

  async updateChatTitle(id: string, title: string): Promise<ApiResponse<ChatSession>> {
    await delay(300);
    const chat = mockChatSessions.find(c => c.id === id);
    
    if (!chat) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Chat not found',
        },
      };
    }
    
    chat.title = title;
    chat.updatedAt = new Date().toISOString();
    
    return {
      success: true,
      data: chat,
    };
  },
};

// ==================== MESSAGES ====================
export const messagesApi = {
  async getMessages(chatId: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Message>>> {
    await delay();
    
    const messages = mockMessages[chatId] || [];
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedMessages = messages.slice(start, end);
    
    return {
      success: true,
      data: {
        items: paginatedMessages,
        pagination: {
          page,
          limit,
          total: messages.length,
          totalPages: Math.ceil(messages.length / limit),
        },
      },
    };
  },

  async sendMessage(chatId: string, request: SendMessageRequest): Promise<ApiResponse<Message>> {
    await delay(1500); // Simulate AI thinking time
    
    // Create user message
    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      chatId,
      role: 'user',
      content: request.content,
      createdAt: new Date().toISOString(),
    };
    
    // Create AI response
    const aiMessage: Message = {
      id: `msg_${Date.now()}_ai`,
      chatId,
      role: 'assistant',
      content: `Đây là câu trả lời mô phỏng cho câu hỏi: "${request.content}". Trong một ứng dụng thực tế, câu trả lời này sẽ được tạo ra từ AI model dựa trên nội dung tài liệu.`,
      sources: [
        {
          documentId: 'doc_001',
          documentName: 'Machine Learning Basics.pdf',
          pageNumber: Math.floor(Math.random() * 10) + 1,
          chunkId: `chunk_${Date.now()}`,
          content: 'Mock source citation content from the document...',
          score: 0.85 + Math.random() * 0.15,
        },
      ],
      model: 'gpt-4',
      tokensUsed: {
        prompt: 500,
        completion: 150,
        total: 650,
      },
      createdAt: new Date().toISOString(),
    };
    
    // Add to mock messages
    if (!mockMessages[chatId]) {
      mockMessages[chatId] = [];
    }
    mockMessages[chatId].push(userMessage);
    mockMessages[chatId].push(aiMessage);
    
    // Update chat session
    const chat = mockChatSessions.find(c => c.id === chatId);
    if (chat) {
      chat.messageCount = mockMessages[chatId].length;
      chat.lastMessage = {
        content: aiMessage.content,
        createdAt: aiMessage.createdAt,
      };
      chat.updatedAt = new Date().toISOString();
    }
    
    return {
      success: true,
      data: aiMessage,
    };
  },
};

// ==================== STATS ====================
export const statsApi = {
  async getOverviewStats(): Promise<ApiResponse<OverviewStats>> {
    await delay(400);
    return {
      success: true,
      data: mockOverviewStats,
    };
  },
};

// ==================== SUGGESTIONS ====================
export const suggestionsApi = {
  async getSuggestions(chatId?: string): Promise<ApiResponse<Suggestions>> {
    await delay(300);
    return {
      success: true,
      data: {
        suggestions: mockSuggestions,
      },
    };
  },
};

