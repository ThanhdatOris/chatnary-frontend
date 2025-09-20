/**
 * Chat service layer - switches between mock and real data based on bypass mode
 */

import { api, API_ENDPOINTS } from './api'
import {
    createMockResponse,
    isBypassMode,
    mockChatHistory,
    MockChatHistoryItem,
    MockChatMessage,
    mockChatMessages,
    mockFiles
} from './mockData'

export interface ChatResponse {
  success: boolean
  answer: string
  sources?: Array<{
    filename: string
    snippet: string
  }>
  model_used?: string
  processing_time?: number
}

export interface ChatHistoryResponse {
  success: boolean
  data: MockChatHistoryItem[]
  pagination: {
    limit: number
    offset: number
    total: number
  }
}

export interface ChatRequest {
  query: string
  file_ids?: string[]
  model?: 'openai' | 'gemini'
  top_k?: number
}

export class ChatService {
  // Get chat history
  static async getChatHistory(params: {
    limit?: number
    offset?: number
    search?: string
  } = {}): Promise<{ data: ChatHistoryResponse }> {
    if (isBypassMode()) {
      // Mock implementation
      const { limit = 20, offset = 0, search = '' } = params
      let filteredHistory = mockChatHistory

      // Apply search filter if provided
      if (search) {
        filteredHistory = mockChatHistory.filter(chat => 
          chat.query.toLowerCase().includes(search.toLowerCase()) ||
          chat.answer.toLowerCase().includes(search.toLowerCase())
        )
      }

      // Apply pagination
      const paginatedData = filteredHistory.slice(offset, offset + limit)

      return createMockResponse({
        success: true,
        data: paginatedData,
        pagination: {
          limit,
          offset,
          total: filteredHistory.length
        }
      })
    } else {
      // Real API call
      return api.get<ChatHistoryResponse>(API_ENDPOINTS.chat.history, { params })
    }
  }

  // Send chat message
  static async sendMessage(request: ChatRequest): Promise<{ data: ChatResponse }> {
    if (isBypassMode()) {
      // Mock implementation - simulate AI response
      const mockResponses = [
        {
          answer: `Dựa trên câu hỏi "${request.query}", tôi tìm thấy thông tin liên quan trong các tài liệu đã tải lên. Đây là phản hồi mô phỏng từ ${request.model === 'openai' ? 'OpenAI GPT' : 'Gemini AI'}.`,
          sources: [
            {
              filename: mockFiles[0].originalName,
              snippet: 'Đây là đoạn trích mô phỏng từ tài liệu liên quan đến câu hỏi của bạn...'
            }
          ],
          model_used: request.model || 'gemini',
          processing_time: Math.floor(Math.random() * 2000) + 500
        },
        {
          answer: `Theo như tài liệu tôi đã phân tích, câu hỏi "${request.query}" có thể được trả lời như sau: Đây là một phản hồi chi tiết từ hệ thống AI mô phỏng. Thông tin này được tổng hợp từ nhiều nguồn tài liệu khác nhau.`,
          sources: [
            {
              filename: mockFiles[1].originalName,
              snippet: 'Thông tin chi tiết về chủ đề này có thể được tìm thấy trong phần...'
            },
            {
              filename: mockFiles[2].originalName,
              snippet: 'Dữ liệu thống kê cho thấy xu hướng tích cực trong lĩnh vực này...'
            }
          ],
          model_used: request.model || 'gemini',
          processing_time: Math.floor(Math.random() * 3000) + 800
        }
      ]

      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
      
      return createMockResponse({
        success: true,
        ...randomResponse
      })
    } else {
      // Real API call
      return api.post<ChatResponse>(API_ENDPOINTS.chat.send, request)
    }
  }

  // Get initial chat messages
  static async getInitialMessages(): Promise<MockChatMessage[]> {
    if (isBypassMode()) {
      return [...mockChatMessages]
    } else {
      // In real mode, return empty array or fetch from API
      return [{
        id: 'welcome',
        type: 'assistant',
        content: 'Xin chào! Tôi là AI assistant của Chatnary. Tôi có thể giúp bạn tìm hiểu nội dung trong các tài liệu đã tải lên. Hãy hỏi tôi bất cứ điều gì!',
        timestamp: new Date()
      }]
    }
  }

  // Delete chat from history
  static async deleteChat(chatId: string): Promise<{ data: { success: boolean; message: string } }> {
    if (isBypassMode()) {
      // Mock implementation
      const index = mockChatHistory.findIndex(chat => chat.id === chatId)
      if (index > -1) {
        mockChatHistory.splice(index, 1)
        return createMockResponse({ success: true, message: 'Đã xóa cuộc hội thoại' })
      } else {
        return createMockResponse({ success: false, message: 'Không tìm thấy cuộc hội thoại' })
      }
    } else {
      // Real API call (when backend implements this endpoint)
      return api.delete(`/api/chat/history/${chatId}`)
    }
  }

  // Get available models
  static async getAvailableModels(): Promise<{ data: { success: boolean; models: string[] } }> {
    if (isBypassMode()) {
      return createMockResponse({
        success: true,
        models: ['gemini', 'openai']
      })
    } else {
      return api.get(API_ENDPOINTS.chat.models)
    }
  }
}

export default ChatService
