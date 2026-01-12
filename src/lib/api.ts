// API client for Chatnary backend - Updated to match API_ENDPOINTS.md
import { ChatSession, CreateChatRequest, Document, Message, SendMessageRequest, UpdateChatRequest } from '@/lib/types';

// Use environment variable with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ==================== TYPE DEFINITIONS ====================

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  // Computed on frontend if needed
  documentsCount?: number;
  chatsCount?: number;
}

interface CreateProjectRequest {
  name: string;
  description?: string;
  color?: string;
  isArchived?: boolean;
}

interface UpdateProjectRequest {
  name?: string;
  description?: string;
  color?: string;
  isArchived?: boolean;
}

interface DocumentUploadMetadata {
  projectId?: string;
  title?: string;
  description?: string;
  authors?: string[];
  tags?: string[];
  subjects?: string[];
  publishedYear?: number;
  accessLevel?: 'PRIVATE' | 'PUBLIC' | 'RESTRICTED';
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface BackendApiResponse<T> {
  statusCode: number;
  success: boolean;
  data?: T;
  message?: string;
}

// Backend document response structure
interface BackendDocument {
  id: string;
  title: string;
  description: string;
  authors: string[];
  subjects: string[];
  tags: string[];
  documentType: string;
  publishedYear: number | null;
  accessLevel: string;
  originalName: string;
  filePath: string;
  mimeType: string;
  size: number;
  pageCount: number;
  status: string;
  metadata: any;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  indexedAt: string | null;
  userId: string;
  // From project documents response
  addedAt?: string;
  isSelected?: boolean;
  linkId?: string;
  linkedProjects?: any[];
}

// Backend chat response structure
interface BackendChat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  projectId: string | null;
  userId?: string;
  messages?: BackendMessage[];
}

interface BackendMessage {
  role: 'user' | 'assistant';
  content: string;
  citation?: any[];
}

interface ChatMessageResponse {
  answer: string;
  citations: any[];
  chatId: string;
}

// ==================== API CLIENT ====================

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    // Remove trailing slash if present
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private createSuccessResponse<T>(data: T): ApiResponse<T> {
    return { success: true, data };
  }

  private createErrorResponse<T>(error: string): ApiResponse<T> {
    return { success: false, error };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      // Get access token for authorization (import dynamically to avoid circular deps)
      const { getAccessToken, getValidAccessToken } = await import('@/lib/auth');
      let accessToken = getAccessToken();

      // If no access token in memory, try to get a valid one (may refresh)
      if (!accessToken) {
        accessToken = await getValidAccessToken();
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Add Authorization header if we have a token
      if (accessToken) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
      }

      const config: RequestInit = {
        ...options,
        headers,
      };

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        return this.createErrorResponse(`HTTP ${response.status}: ${errorText}`);
      }

      const backendResponse: BackendApiResponse<T> = await response.json();

      if (!backendResponse.success) {
        return this.createErrorResponse(backendResponse.message || 'Unknown error');
      }

      return this.createSuccessResponse(backendResponse.data as T);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // ==================== PROJECT ENDPOINTS ====================
  // GET /project - List all projects for user
  async getProjects(): Promise<ApiResponse<Project[]>> {
    return this.request<Project[]>('/project');
  }

  // POST /project - Create new project
  async createProject(project: CreateProjectRequest): Promise<ApiResponse<Project>> {
    return this.request<Project>('/project', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  // PATCH /project/:projectId - Update project
  async updateProject(id: string, project: UpdateProjectRequest): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/project/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(project),
    });
  }

  // DELETE /project/:projectId - Delete project
  async deleteProject(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/project/${id}`, {
      method: 'DELETE',
    });
  }

  // GET /project/:projectId/documents - List documents in project
  async getProjectDocuments(projectId: string): Promise<ApiResponse<Document[]>> {
    const response = await this.request<BackendDocument[]>(`/project/${projectId}/documents`);
    if (response.error) {
      return this.createErrorResponse(response.error);
    }
    // Transform backend documents to frontend format
    const documents = (response.data || []).map(this.transformDocument);
    return this.createSuccessResponse(documents);
  }

  // GET /project/:projectId/chats - List chats in project
  async getProjectChats(projectId: string): Promise<ApiResponse<ChatSession[]>> {
    const response = await this.request<BackendChat[]>(`/project/${projectId}/chats`);
    if (response.error) {
      return this.createErrorResponse(response.error);
    }
    const chats = (response.data || []).map(this.transformChat);
    return this.createSuccessResponse(chats);
  }

  // POST /project/:projectId/documents - Add documents to project
  async addDocumentsToProject(projectId: string, documentIds: string[]): Promise<ApiResponse<{ count: number }>> {
    return this.request<{ count: number }>(`/project/${projectId}/documents`, {
      method: 'POST',
      body: JSON.stringify({ documentIds }),
    });
  }

  // DELETE /project/:projectId/documents/unlink - Remove documents from project
  async removeDocumentsFromProject(projectId: string, documentIds: string[]): Promise<ApiResponse<{ count: number }>> {
    return this.request<{ count: number }>(`/project/${projectId}/documents/unlink`, {
      method: 'DELETE',
      body: JSON.stringify({ documentIds }),
    });
  }

  // ==================== DOCUMENT ENDPOINTS ====================
  // POST /document/upload/files - Upload document(s)
  async uploadDocument(projectId: string, file: File, metadata?: Partial<DocumentUploadMetadata>): Promise<ApiResponse<Document>> {
    try {
      // Get access token for authorization
      const { getAccessToken, getValidAccessToken } = await import('@/lib/auth');
      let accessToken = getAccessToken();

      if (!accessToken) {
        accessToken = await getValidAccessToken();
      }

      if (!accessToken) {
        return this.createErrorResponse('Unauthorized - please login again');
      }

      const formData = new FormData();
      formData.append('files', file);

      // Prepare metadata with projectId
      const uploadMetadata: DocumentUploadMetadata = {
        projectId,
        ...metadata,
      };
      formData.append('data', JSON.stringify(uploadMetadata));

      const url = `${this.baseUrl}/document/upload/files`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          // Don't set Content-Type - browser sets it with boundary for multipart
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return this.createErrorResponse(`HTTP ${response.status}: ${errorText}`);
      }

      const backendResponse: BackendApiResponse<{ url: string }[]> = await response.json();

      if (!backendResponse.success) {
        return this.createErrorResponse(backendResponse.message || 'Upload failed');
      }

      // Backend returns [{url: "..."}], we return a placeholder document
      // The actual document will be fetched when listing documents
      return this.createSuccessResponse({
        id: 'pending',
        name: file.name,
        originalFilename: file.name,
        projectId,
        mimeType: file.type,
        fileSize: file.size,
        status: 'processing',
        uploadedBy: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Document);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Upload failed');
    }
  }

  // GET /document - Get all documents for user
  async getAllDocuments(): Promise<ApiResponse<Document[]>> {
    const response = await this.request<BackendDocument[]>('/document');
    if (response.error) {
      return this.createErrorResponse(response.error);
    }
    const documents = (response.data || []).map(this.transformDocument);
    return this.createSuccessResponse(documents);
  }

  // GET /document/:documentId - Get document detail
  async getDocument(documentId: string): Promise<ApiResponse<Document>> {
    const response = await this.request<BackendDocument>(`/document/${documentId}`);
    if (response.error) {
      return this.createErrorResponse(response.error);
    }
    return this.createSuccessResponse(this.transformDocument(response.data!));
  }

  // DELETE /document/:documentId - Delete document
  async deleteDocument(documentId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/document/${documentId}`, {
      method: 'DELETE',
    });
  }

  // Helper: Get static file URL from filePath
  getDocumentFileUrl(filePath: string): string {
    // Backend returns paths like "uploads\\documents\\filename.pdf"
    // We need to construct full URL
    const baseHost = this.baseUrl.replace('/api/v1', '');
    const normalizedPath = filePath.replace(/\\/g, '/');
    return `${baseHost}/${normalizedPath}`;
  }

  // Helper: Get document download URL by ID
  // Note: This returns a URL that will trigger download when fetched
  getDocumentDownloadUrl(documentId: string): string {
    // The backend serves static files directly, so we construct the URL
    // using the /document/:id endpoint which returns the file
    const baseHost = this.baseUrl.replace('/api/v1', '');
    return `${baseHost}/api/v1/document/${documentId}/download`;
  }

  // Helper: Get document preview URL by ID
  // Note: This returns a URL suitable for embedding (iframe, img src)
  getDocumentPreviewUrl(documentId: string): string {
    // Same as download, but for preview purposes (PDFs, images)
    const baseHost = this.baseUrl.replace('/api/v1', '');
    return `${baseHost}/api/v1/document/${documentId}/preview`;
  }

  // Helper: Transform backend document to frontend format
  private transformDocument = (doc: BackendDocument): Document => ({
    id: doc.id,
    name: doc.title || doc.originalName,
    originalFilename: doc.originalName,
    projectId: '', // Will be set from context
    mimeType: doc.mimeType,
    fileSize: doc.size,
    status: doc.status.toLowerCase() === 'done' ? 'processed' :
      doc.status.toLowerCase() === 'processing' ? 'processing' :
        doc.status.toLowerCase() === 'error' ? 'error' : 'uploading',
    uploadedBy: doc.userId,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    hasContent: doc.status.toLowerCase() === 'done',
  });

  // ==================== CHAT ENDPOINTS ====================
  // POST /project/:projectId/chats/messages - Send message (creates chat if chatId not provided)
  async sendMessage(projectId: string, message: string, chatId?: string): Promise<ApiResponse<{ answer: string; citations: any[]; chatId: string }>> {
    const endpoint = chatId
      ? `/project/${projectId}/chats/messages?chatId=${chatId}`
      : `/project/${projectId}/chats/messages`;

    const response = await this.request<ChatMessageResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });

    return response;
  }

  // POST /chat/global - Global chat (no project)
  async sendGlobalMessage(message: string, chatId?: string): Promise<ApiResponse<{ answer: string; citations: any[]; chatId: string }>> {
    const endpoint = chatId ? `/chat/global?chatId=${chatId}` : '/chat/global';

    return this.request<ChatMessageResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // GET /chat/:chatId/messages - Get chat with messages
  async getChatMessages(chatId: string): Promise<ApiResponse<{ chat: ChatSession; messages: Message[] }>> {
    const response = await this.request<BackendChat>(`/chat/${chatId}/messages`);
    if (response.error) {
      return this.createErrorResponse(response.error);
    }

    const backendChat = response.data!;
    const chat = this.transformChat(backendChat);
    const messages = (backendChat.messages || []).map((msg, index) => ({
      id: `${chatId}-${index}`,
      chatId,
      role: msg.role,
      content: msg.content,
      sources: msg.citation,
      createdAt: backendChat.createdAt,
    })) as Message[];

    return this.createSuccessResponse({ chat, messages });
  }

  // GET /chat/user/global - Get all global chats
  async getGlobalChats(): Promise<ApiResponse<ChatSession[]>> {
    const response = await this.request<BackendChat[]>('/chat/user/global');
    if (response.error) {
      return this.createErrorResponse(response.error);
    }
    const chats = (response.data || []).map(this.transformChat);
    return this.createSuccessResponse(chats);
  }

  // PATCH /chat/user/:chatId - Update chat (title, projectId)
  async updateChat(chatId: string, data: { title?: string; projectId?: string }): Promise<ApiResponse<ChatSession>> {
    const response = await this.request<BackendChat>(`/chat/user/${chatId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (response.error) {
      return this.createErrorResponse(response.error);
    }
    return this.createSuccessResponse(this.transformChat(response.data!));
  }

  // DELETE /chat/user/:chatId - Delete chat
  async deleteChat(chatId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/chat/user/${chatId}`, {
      method: 'DELETE',
    });
  }

  // Helper: Transform backend chat to frontend format
  private transformChat = (chat: BackendChat): ChatSession => ({
    id: chat.id,
    title: chat.title,
    projectId: chat.projectId || '',
    createdBy: chat.userId || '',
    messagesCount: chat.messages?.length || 0,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
  });

  // ==================== LEGACY COMPATIBILITY ====================
  // These methods maintain compatibility with existing code

  async createChat(request: CreateChatRequest): Promise<ApiResponse<ChatSession>> {
    // Create chat by sending initial empty request
    // The backend creates a chat when first message is sent
    // For now, we'll return a placeholder
    const projectId = request.project_id;

    // Send a system message to create the chat
    const response = await this.sendMessage(projectId, 'Xin chào');
    if (response.error) {
      return this.createErrorResponse(response.error);
    }

    // Return the created chat info
    return this.createSuccessResponse({
      id: response.data!.chatId,
      title: request.title || 'Chat mới',
      projectId,
      createdBy: '',
      messagesCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async getChat(chatId: string): Promise<ApiResponse<ChatSession>> {
    const response = await this.getChatMessages(chatId);
    if (response.error) {
      return this.createErrorResponse(response.error);
    }
    return this.createSuccessResponse(response.data!.chat);
  }

  async getMessages(chatId: string): Promise<ApiResponse<Message[]>> {
    const response = await this.getChatMessages(chatId);
    if (response.error) {
      return this.createErrorResponse(response.error);
    }
    return this.createSuccessResponse(response.data!.messages);
  }

  // Legacy method - redirects to new signature
  async sendMessageLegacy(chatId: string, request: SendMessageRequest, projectId: string): Promise<ApiResponse<Message>> {
    const response = await this.sendMessage(projectId, request.content, chatId);
    if (response.error) {
      return this.createErrorResponse(response.error);
    }

    // Return the AI response as a message
    return this.createSuccessResponse({
      id: `${chatId}-${Date.now()}`,
      chatId,
      role: 'assistant',
      content: response.data!.answer,
      sources: response.data!.citations,
      createdAt: new Date().toISOString(),
    } as Message);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/health');
  }
}

const apiClient = new ApiClient();

// ==================== EXPORTED API OBJECTS ====================

export const chatsApi = {
  createChat: (request: CreateChatRequest) => apiClient.createChat(request),
  getChat: (chatId: string) => apiClient.getChat(chatId),
  updateChat: (chatId: string, request: UpdateChatRequest) => apiClient.updateChat(chatId, { title: request.title }),
  deleteChat: (chatId: string) => apiClient.deleteChat(chatId),
  getProjectChats: (projectId: string) => apiClient.getProjectChats(projectId),
  getGlobalChats: () => apiClient.getGlobalChats(),
};

export const messagesApi = {
  getMessages: (chatId: string) => apiClient.getMessages(chatId),
  sendMessage: (chatId: string, request: SendMessageRequest, projectId: string) =>
    apiClient.sendMessageLegacy(chatId, request, projectId),
  sendProjectMessage: (projectId: string, message: string, chatId?: string) =>
    apiClient.sendMessage(projectId, message, chatId),
  sendGlobalMessage: (message: string, chatId?: string) =>
    apiClient.sendGlobalMessage(message, chatId),
};

export const documentsApi = {
  uploadDocument: (projectId: string, file: File, metadata?: Partial<DocumentUploadMetadata>) =>
    apiClient.uploadDocument(projectId, file, metadata),
  getProjectDocuments: (projectId: string) => apiClient.getProjectDocuments(projectId),
  getAllDocuments: () => apiClient.getAllDocuments(),
  getDocument: (documentId: string) => apiClient.getDocument(documentId),
  deleteDocument: (documentId: string) => apiClient.deleteDocument(documentId),
  getDocumentFileUrl: (filePath: string) => apiClient.getDocumentFileUrl(filePath),
};

export const projectsApi = {
  getProjects: () => apiClient.getProjects(),
  createProject: (project: CreateProjectRequest) => apiClient.createProject(project),
  updateProject: (id: string, project: UpdateProjectRequest) => apiClient.updateProject(id, project),
  deleteProject: (id: string) => apiClient.deleteProject(id),
  getProjectDocuments: (projectId: string) => apiClient.getProjectDocuments(projectId),
  getProjectChats: (projectId: string) => apiClient.getProjectChats(projectId),
  addDocumentsToProject: (projectId: string, documentIds: string[]) =>
    apiClient.addDocumentsToProject(projectId, documentIds),
  removeDocumentsFromProject: (projectId: string, documentIds: string[]) =>
    apiClient.removeDocumentsFromProject(projectId, documentIds),
};

// Suggestions placeholder
export const suggestionsApi = {
  getSuggestions: async (_chatId: string) => {
    return { success: true, data: [] as string[] };
  },
};

export default apiClient;
export type {
  ApiResponse,
  BackendDocument,
  ChatSession,
  CreateChatRequest,
  CreateProjectRequest,
  Document,
  DocumentUploadMetadata,
  Message,
  Project,
  SendMessageRequest,
  UpdateChatRequest,
  UpdateProjectRequest,
};
