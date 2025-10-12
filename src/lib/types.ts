// ==================== USER & AUTH ====================
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// ==================== DOCUMENT ====================
export type DocumentStatus = 'processing' | 'completed' | 'failed';

export interface DocumentMetadata {
  title?: string;
  author?: string;
  createdDate?: string;
}

export interface Document {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  status: DocumentStatus;
  uploadedAt: string;
  processedAt: string | null;
  pageCount: number | null;
  wordCount: number | null;
  chatCount?: number;
  metadata?: DocumentMetadata;
}

export interface DocumentContent {
  documentId: string;
  content: string;
  pages: Array<{
    pageNumber: number;
    content: string;
  }>;
}

// ==================== CHAT ====================
export type MessageRole = 'user' | 'assistant';

export interface SourceCitation {
  documentId: string;
  documentName: string;
  pageNumber: number;
  chunkId: string;
  content: string;
  score: number;
  startIndex?: number;
  endIndex?: number;
}

export interface Message {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  sources?: SourceCitation[];
  model?: string;
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  documentIds: string[];
  documents?: Array<{
    id: string;
    name: string;
    type?: string;
  }>;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  content: string;
  stream?: boolean;
}

export interface CreateChatRequest {
  documentIds: string[];
  title?: string;
}

// ==================== STATS ====================
export interface ActivityItem {
  type: 'document_upload' | 'chat_created' | 'message_sent';
  documentId?: string;
  documentName?: string;
  chatId?: string;
  chatTitle?: string;
  timestamp: string;
}

export interface OverviewStats {
  totalDocuments: number;
  totalChats: number;
  totalMessages: number;
  storageUsed: number;
  storageLimit: number;
  documentsThisMonth: number;
  chatsThisMonth: number;
  messagesThisMonth: number;
  recentActivity: ActivityItem[];
}

export interface UsageDataPoint {
  date: string;
  documents: number;
  chats: number;
  messages: number;
}

export interface UsageStats {
  period: 'day' | 'week' | 'month';
  dataPoints: UsageDataPoint[];
}

// ==================== SEARCH ====================
export interface SearchHighlight {
  text: string;
  startIndex: number;
  endIndex: number;
}

export interface SearchResult {
  documentId: string;
  documentName: string;
  pageNumber: number;
  chunkId: string;
  content: string;
  score: number;
  highlights?: SearchHighlight[];
}

export interface SearchRequest {
  query: string;
  documentIds?: string[];
  limit?: number;
  threshold?: number;
}

// ==================== SETTINGS ====================
export interface UserSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  language: string;
  theme: 'light' | 'dark' | 'system';
}

// ==================== API RESPONSES ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== EXPORT ====================
export type ExportFormat = 'json' | 'pdf' | 'markdown';

// ==================== SUGGESTIONS ====================
export interface Suggestions {
  suggestions: string[];
}

