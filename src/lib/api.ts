// API client for Chatnary Backend matching https://chatnary.up.railway.app/api/v1/docs
import {
  AuthResponse,
  ChatSession,
  CreateChatRequest,
  CreateProjectRequest,
  Document,
  LoginRequest,
  Message,
  Project,
  RegisterRequest,
  UpdateChatRequest,
  UpdateProjectRequest,
} from "@/lib/types";
import Cookies from "js-cookie";

const API_BASE_URL = "https://chatnary.up.railway.app";
const COOKIE_NAME = "chatnary_token";

// Generic API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Internal Backend Response wrapper
interface BackendErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Extended Request types if needed
export interface SendMessageDto {
  content: string;
  chatId?: string;
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
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Try to load token from cookie on initialization
    this.token = Cookies.get(COOKIE_NAME) || null;
    console.log('ApiClient: Initialized. Token from cookie:', this.token ? 'Found' : 'Missing');
  }

  // Auth Management
  setToken(token: string) {
    this.token = token;
    // Important: Set path to '/' so cookie is accessible everywhere
    Cookies.set(COOKIE_NAME, token, { expires: 7, path: '/' }); 
    console.log('ApiClient: Token set manually');
  }

  clearToken() {
    this.token = null;
    Cookies.remove(COOKIE_NAME, { path: '/' });
    console.log('ApiClient: Token cleared');
  }

  getToken(): string | null {
    if (!this.token) {
        this.token = Cookies.get(COOKIE_NAME) || null;
    }
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private createSuccessResponse<T>(data: T): ApiResponse<T> {
    return { success: true, data };
  }

  private createErrorResponse<T>(error: string): ApiResponse<T> {
    return { success: false, error };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (this.token) {
        (headers as any)["Authorization"] = `Bearer ${this.token}`;
      }

      const config: RequestInit = {
        ...options,
        headers,
      };

      console.log(`API Request: ${options.method || "GET"} ${url}`);

      const response = await fetch(url, config);

      console.log(`API Response Status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText) as BackendErrorResponse;
          errorMessage = Array.isArray(errorJson.message)
            ? errorJson.message.join(", ")
            : errorJson.message || errorJson.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        console.error("API Error:", errorMessage);
        return this.createErrorResponse(errorMessage);
      }

      if (response.status === 204) {
        return this.createSuccessResponse({} as T);
      }

      const responseData = await response.json();
      return this.createSuccessResponse(responseData);
    } catch (error) {
      console.error("Network Error:", error);
      return this.createErrorResponse(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  // ==================== AUTH ====================

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<any>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      const token = response.data.accessToken || response.data.token;
      if (token) {
        this.setToken(token);
        return this.createSuccessResponse({
          token,
          user: response.data.user || {
            id: "me",
            email: credentials.email,
            name: "User",
          },
        });
      }
    }
    return response;
  }

  async register(data: RegisterRequest): Promise<ApiResponse<void>> {
    return this.request<void>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: data.email, password: data.password }),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    const res = await this.request<void>("/api/v1/auth/logout", {
      method: "POST",
    });
    this.clearToken();
    return res;
  }

  // ==================== PROJECTS ====================

  async getProjects(): Promise<ApiResponse<Project[]>> {
    return this.request<Project[]>("/api/v1/project");
  }

  async createProject(
    project: CreateProjectRequest
  ): Promise<ApiResponse<Project>> {
    return this.request<Project>("/api/v1/project", {
      method: "POST",
      body: JSON.stringify(project),
    });
  }

  async updateProject(
    id: string,
    project: Partial<UpdateProjectRequest>
  ): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/api/v1/project/${id}`, {
      method: "PATCH",
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/v1/project/${id}`, {
      method: "DELETE",
    });
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/api/v1/project/${id}`);
  }

  // ==================== DOCUMENTS ====================

  async uploadDocument(
    projectId: string,
    file: File
  ): Promise<ApiResponse<Document>> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Ensure projectId is handled if strictly required by backend, though path suggests separating details
      // But usually uploads need linkage. We will send it.
      formData.append("projectId", projectId);

      const url = `${this.baseUrl}/api/v1/document/upload/files`;
      const response = await fetch(url, {
        method: "POST",
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return this.createErrorResponse(
          `HTTP ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      return this.createSuccessResponse(data);
    } catch (error) {
      return this.createErrorResponse(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  async getProjectDocuments(
    projectId: string
  ): Promise<ApiResponse<Document[]>> {
    return this.request<Document[]>(`/api/v1/project/${projectId}/documents`);
  }

  // GET /document/:documentId - Get document detail
  async getDocument(documentId: string): Promise<ApiResponse<Document>> {
    return this.request<Document>(`/api/v1/document/${documentId}`);
  }

  // DELETE /document/:documentId - Delete document
  async deleteDocument(documentId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/v1/document/${documentId}`, {
      method: "DELETE",
    });
  }

  async searchDocuments(
    query: string,
    projectId?: string
  ): Promise<ApiResponse<Document[]>> {
    const params = new URLSearchParams();
    params.append("query", query);
    if (projectId) params.append("projectId", projectId);

    // Fallback search, verify if backend handles it
    return this.request<Document[]>(
      `/api/v1/document/search?${params.toString()}`
    );
  }

  // ==================== CHATS ====================

  async createChat(
    request: CreateChatRequest
  ): Promise<ApiResponse<ChatSession>> {
    return this.request<ChatSession>("/api/v1/chat", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getProjectChats(
    projectId: string
  ): Promise<ApiResponse<ChatSession[]>> {
    return this.request<ChatSession[]>(`/api/v1/project/${projectId}/chats`);
  }

  async getChat(chatId: string): Promise<ApiResponse<ChatSession>> {
    return this.request<ChatSession>(`/api/v1/chat/${chatId}`);
  }

  async updateChat(
    chatId: string,
    request: UpdateChatRequest
  ): Promise<ApiResponse<ChatSession>> {
    return this.request<ChatSession>(`/api/v1/chat/user/${chatId}`, {
      method: "PATCH",
      body: JSON.stringify(request),
    });
  }

  async deleteChat(chatId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/v1/chat/user/${chatId}`, {
      method: "DELETE",
    });
  }

  // ==================== MESSAGES ====================

  async getMessages(
    projectId: string,
    chatId: string
  ): Promise<ApiResponse<Message[]>> {
    return this.request<Message[]>(
      `/api/v1/project/${projectId}/chats/${chatId}/messages`
    );
  }

  async sendMessage(
    projectId: string,
    request: SendMessageDto
  ): Promise<ApiResponse<Message>> {
    return this.request<Message>(
      `/api/v1/project/${projectId}/chats/messages`,
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  }
}

const apiClient = new ApiClient();

export const authApi = {
  login: (data: LoginRequest) => apiClient.login(data),
  register: (data: RegisterRequest) => apiClient.register(data),
  logout: () => apiClient.logout(),
  getToken: () => apiClient.getToken(),
  isAuthenticated: () => apiClient.isAuthenticated(),
  setToken: (token: string) => apiClient.setToken(token),
};

export const projectsApi = {
  getProjects: () => apiClient.getProjects(),
  createProject: (data: CreateProjectRequest) => apiClient.createProject(data),
  updateProject: (id: string, data: Partial<UpdateProjectRequest>) =>
    apiClient.updateProject(id, data),
  deleteProject: (id: string) => apiClient.deleteProject(id),
  getProject: (id: string) => apiClient.getProject(id),
};

export const documentsApi = {
  uploadDocument: (projectId: string, file: File) =>
    apiClient.uploadDocument(projectId, file),
  getProjectDocuments: (projectId: string) =>
    apiClient.getProjectDocuments(projectId),
  getDocument: (id: string) => apiClient.getDocument(id),
  deleteDocument: (id: string) => apiClient.deleteDocument(id),
  searchDocuments: (query: string, projectId?: string) =>
    apiClient.searchDocuments(query, projectId),
};

export const chatsApi = {
  createChat: (request: CreateChatRequest) => apiClient.createChat(request),
  getProjectChats: (projectId: string) => apiClient.getProjectChats(projectId),
  getChat: (id: string) => apiClient.getChat(id),
  updateChat: (id: string, request: UpdateChatRequest) =>
    apiClient.updateChat(id, request),
  deleteChat: (id: string) => apiClient.deleteChat(id),
};

export const messagesApi = {
  getMessages: (projectId: string, chatId: string) =>
    apiClient.getMessages(projectId, chatId),
  sendMessage: (projectId: string, request: SendMessageDto) =>
    apiClient.sendMessage(projectId, request),
};

export const suggestionsApi = {
  getSuggestions: async (chatId: string) => {
    // Placeholder implementation as per original file
    return { success: true, data: [] as string[] };
  },
};

export default apiClient;
