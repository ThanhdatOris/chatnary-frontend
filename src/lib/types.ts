// User & Authentication Types
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  token: string
  user: User
  message?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// File & Document Types
export interface FileMetadata {
  id: string
  originalName: string
  filename: string
  size: number
  mimetype: string
  uploadTime: string
  indexed: boolean
  userId?: string
  searchableContent?: string
}

export interface UploadResponse {
  success: boolean
  message: string
  file: FileMetadata
}

export interface UploadProgress {
  fileId: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}

// Search Types
export interface SearchQuery {
  query: string
  limit?: number
  offset?: number
  fileTypes?: string[]
}

export interface SearchResult {
  file: FileMetadata
  score: number
  highlights: string[]
  snippet?: string
}

export interface SearchResponse {
  success: boolean
  results: SearchResult[]
  total: number
  processingTime: number
  query: string
}

export interface SearchSuggestion {
  text: string
  count: number
}

// Chat Types
export interface ChatMessage {
  id: string
  documentId: string
  userId: string
  message: string
  response: string
  citations?: ChatCitation[]
  timestamp: string
}

export interface ChatCitation {
  fileId: string
  filename: string
  snippet: string
  score: number
  page?: number
}

export interface ChatRequest {
  documentId: string
  message: string
}

export interface ChatResponse {
  success: boolean
  response: string
  citations: ChatCitation[]
  messageId: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// UI Component Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Form Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'file'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'

// File Upload Types
export interface FileWithPreview extends File {
  preview?: string
  id?: string
}

export interface DropzoneState {
  isDragActive: boolean
  isDragReject: boolean
  isDragAccept: boolean
}
