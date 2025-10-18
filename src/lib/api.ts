// API client for Phase 1 backend
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

interface ApiResponse<T> {
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

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        return { error: `HTTP ${response.status}: ${errorText}` };
      }

      const backendResponse: BackendApiResponse<T> = await response.json();
      
      if (!backendResponse.success) {
        return { error: backendResponse.error || 'Unknown error' };
      }

      return { data: backendResponse.data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getProjects(): Promise<ApiResponse<Project[]>> {
    const response = await this.request<ListProjectsResponse>('/api/projects');
    if (response.error) {
      return { error: response.error };
    }
    return { data: response.data?.projects || [] };
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
}

const apiClient = new ApiClient();

export default apiClient;
export type { ApiResponse, CreateProjectRequest, Project };

