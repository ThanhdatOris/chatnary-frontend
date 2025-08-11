import axios from 'axios'
import Cookies from 'js-cookie'

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API Endpoints (adapted to match current backend)
export const API_ENDPOINTS = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    profile: '/api/auth/profile',
    verify: '/api/auth/verify',
  },
  files: {
    upload: '/api/upload',
    list: '/api/files',
    detail: (fileId: string) => `/api/files/${fileId}`,
    download: (fileId: string) => `/api/download/${fileId}`,
    delete: (fileId: string) => `/api/files/${fileId}`,
  },
  search: {
    search: '/api/search',
    suggestions: '/api/suggestions',
    stats: '/api/stats',
  },
  chat: {
    send: '/api/chat',
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
