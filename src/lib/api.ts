// API client for Phase 1 backend
import { ChatSession, CreateChatRequest, Document, Message, SendMessageRequest, UpdateChatRequest } from '@/lib/types';

const API_BASE_URL = 'http://localhost:8000';

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  documentsCount: number;
  chatsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateProjectRequest {
  name: string;
  description?: string;
  color?: string;
}

interface UploadDocumentRequest {
  projectId: string;
  file: File;
}

interface ListDocumentsResponse {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
}

interface ListChatsResponse {
  chats: ChatSession[];
  total: number;
  page: number;
  limit: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface BackendApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ListProjectsResponse {
  projects: Project[];
  total: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Helper methods to create standardized responses
  private createSuccessResponse<T>(data: T): ApiResponse<T> {
    return { success: true, data };
  }

  private createErrorResponse<T>(error: string): ApiResponse<T> {
    return { success: false, error };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      console.log('API Request:', { url, config });
      
      const response = await fetch(url, config);
      
      console.log('API Response Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        return this.createErrorResponse(`HTTP ${response.status}: ${errorText}`);
      }

      const backendResponse: BackendApiResponse<T> = await response.json();
      
      console.log('API Response Data:', backendResponse);
      
      if (!backendResponse.success) {
        return this.createErrorResponse(backendResponse.error || 'Unknown error');
      }

      return this.createSuccessResponse(backendResponse.data!);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async getProjects(): Promise<ApiResponse<Project[]>> {
    const response = await this.request<ListProjectsResponse>('/api/projects');
    if (response.error) {
      return this.createErrorResponse(response.error);
    }
    return this.createSuccessResponse(response.data?.projects || []);
  }

  async createProject(project: CreateProjectRequest): Promise<ApiResponse<Project>> {
    return this.request<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, project: Partial<CreateProjectRequest>): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/health');
  }

  // Documents API methods
  async uploadDocument(projectId: string, file: File): Promise<ApiResponse<Document>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('project_id', projectId);

      const url = `${this.baseUrl}/api/documents/upload`;
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return this.createErrorResponse(`HTTP ${response.status}: ${errorText}`);
      }

      const backendResponse: BackendApiResponse<Document> = await response.json();
      
      if (!backendResponse.success) {
        return this.createErrorResponse(backendResponse.error || 'Unknown error');
      }

      return this.createSuccessResponse(backendResponse.data!);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async getDocuments(projectId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<ListDocumentsResponse>> {
    return this.request<ListDocumentsResponse>(`/api/documents?project_id=${projectId}&page=${page}&limit=${limit}`);
  }

  async getProjectDocuments(projectId: string): Promise<ApiResponse<Document[]>> {
    const response = await this.request<ListDocumentsResponse>(`/api/documents/project/${projectId}`);
    if (response.error) {
      return this.createErrorResponse(response.error);
    }
    return this.createSuccessResponse(response.data?.documents || []);
  }

  async getDocument(documentId: string): Promise<ApiResponse<Document>> {
    return this.request<Document>(`/api/documents/${documentId}`);
  }

  async deleteDocument(documentId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  // Helper method to get document preview URL (inline display)
  getDocumentPreviewUrl(documentId: string): string {
    return `${this.baseUrl}/api/documents/${documentId}/download?inline=true`;
  }

  // Helper method to get document download URL (force download)
  getDocumentDownloadUrl(documentId: string): string {
    return `${this.baseUrl}/api/documents/${documentId}/download`;
  }

  async searchDocuments(query: string, projectId?: string): Promise<ApiResponse<Document[]>> {
    const params = new URLSearchParams();
    params.append('query', query);
    if (projectId) {
      params.append('project_id', projectId);
    }
    
    const response = await this.request<{ documents: Document[] }>(`/api/documents/search?${params.toString()}`);
    if (response.error) {
      return this.createErrorResponse(response.error);
    }
    return this.createSuccessResponse(response.data?.documents || []);
  }

  // Chat API methods
  async createChat(request: CreateChatRequest): Promise<ApiResponse<ChatSession>> {
    return this.request<ChatSession>('/api/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  }

  async updateChat(chatId: string, request: UpdateChatRequest): Promise<ApiResponse<ChatSession>> {
    return this.request<ChatSession>(`/api/chats/${chatId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  }

  async getChats(projectId?: string, page: number = 1, limit: number = 20): Promise<ApiResponse<ListChatsResponse>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (projectId) {
      params.append('project_id', projectId);
    }
    
    const response = await this.request<ListChatsResponse>(`/api/chats?${params.toString()}`);
    if (response.error) {
      return this.createErrorResponse(response.error);
    }
    return this.createSuccessResponse({
      chats: response.data?.chats || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      limit: response.data?.limit || 20
    });
  }

  async getChat(chatId: string): Promise<ApiResponse<ChatSession>> {
    return this.request<ChatSession>(`/api/chats/${chatId}`);
  }

  async deleteChat(chatId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/chats/${chatId}`, {
      method: 'DELETE',
    });
  }

  async getProjectChats(projectId: string): Promise<ApiResponse<ChatSession[]>> {
    const response = await this.request<ListChatsResponse>(`/api/chats/project/${projectId}`);
    if (response.error) {
      return this.createErrorResponse(response.error);
    }
    return this.createSuccessResponse(response.data?.chats || []);
  }

  // Message API methods
  async getMessages(chatId: string): Promise<ApiResponse<Message[]>> {
    console.log('Getting messages for chat:', chatId);
    const response = await this.request<{ messages: Message[], chatId: string, total: number }>(`/api/chats/${chatId}/messages`);
    console.log('Get messages response:', response);
    
    if (response.error) {
      return this.createErrorResponse(response.error);
    }
    return this.createSuccessResponse(response.data?.messages || []);
  }

  async sendMessage(chatId: string, request: SendMessageRequest): Promise<ApiResponse<Message>> {
    console.log('Sending message API call:', { chatId, request });
    const response = await this.request<any>(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    console.log('Send message API response:', response);
    
    // Backend returns { userMessage, aiMessage, chatId } but we need to return the user message
    if (response.success && response.data) {
      const userMessage = response.data.userMessage;
      if (userMessage) {
        return this.createSuccessResponse({
          id: userMessage.id,
          content: userMessage.content,
          role: 'user',
          chatId: chatId,
          createdAt: userMessage.createdAt,
          updatedAt: userMessage.createdAt
        });
      }
    }
    
    return response;
  }
}

const apiClient = new ApiClient();

// Create individual API objects for easier imports
export const chatsApi = {
  createChat: (request: CreateChatRequest) => apiClient.createChat(request),
  getChats: (projectId?: string, page?: number, limit?: number) => apiClient.getChats(projectId, page, limit),
  getChat: (chatId: string) => apiClient.getChat(chatId),
  updateChat: (chatId: string, request: UpdateChatRequest) => apiClient.updateChat(chatId, request),
  deleteChat: (chatId: string) => apiClient.deleteChat(chatId),
  getProjectChats: (projectId: string) => apiClient.getProjectChats(projectId),
};

export const messagesApi = {
  getMessages: (chatId: string) => apiClient.getMessages(chatId),
  sendMessage: (chatId: string, request: SendMessageRequest) => apiClient.sendMessage(chatId, request),
};

export const documentsApi = {
  uploadDocument: (projectId: string, file: File) => apiClient.uploadDocument(projectId, file),
  getDocuments: (projectId: string, page?: number, limit?: number) => apiClient.getDocuments(projectId, page, limit),
  getProjectDocuments: (projectId: string) => apiClient.getProjectDocuments(projectId),
  getDocument: (documentId: string) => apiClient.getDocument(documentId),
  deleteDocument: (documentId: string) => apiClient.deleteDocument(documentId),
  searchDocuments: (query: string, projectId?: string) => apiClient.searchDocuments(query, projectId),
};

// For now, create a placeholder suggestionsApi (can be implemented later)
export const suggestionsApi = {
  getSuggestions: async (chatId: string) => {
    // Placeholder implementation
    return { success: true, data: [] };
  },
};

export default apiClient;
export type {
  ApiResponse, ChatSession, CreateChatRequest, CreateProjectRequest, Document, ListChatsResponse, ListDocumentsResponse, Message, Project, SendMessageRequest, UpdateChatRequest, UploadDocumentRequest
};

