import axios from 'axios'

// API Base URL - Updated to match Python backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for basic error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

// API Endpoints - Updated to match Python FastAPI backend
export const API_ENDPOINTS = {
  files: {
    upload: '/api/upload',
    list: '/api/files',
    detail: (fileId: string) => `/api/files/${fileId}`,
    content: (fileId: string) => `/api/files/${fileId}/content`,
    download: (fileId: string) => `/api/download/${fileId}`,
    delete: (fileId: string) => `/api/files/${fileId}`,
    process: (fileId: string) => `/api/process-document/${fileId}`,
  },
  search: {
    search: '/api/search',
    suggestions: '/api/suggestions',
    stats: '/api/stats',
  },
  chat: {
    send: '/api/chat',
    models: '/api/chat/models',
    history: '/api/chat/history',
  },
}

// Helper function to create form data for file uploads
export function createFormData(file: File, additionalData?: Record<string, unknown>) {
  const formData = new FormData()
  formData.append('file', file)
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
  }
  
  return formData
}

// Helper function to handle API errors
export function handleApiError(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message
    }
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message
  }
  return 'Đã xảy ra lỗi không xác định'
}

export default api
