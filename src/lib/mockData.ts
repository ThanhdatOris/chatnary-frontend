/**
 * Mock data for development and bypass mode
 */

export interface MockChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: Array<{
    filename: string
    snippet: string
  }>
}

export interface MockChatHistoryItem {
  id: string
  query: string
  answer: string
  sources: Array<{
    file_id: string
    file_name: string
    chunks: Array<{
      content?: string
      text?: string
    }>
    chunk_count: number
  }>
  model_used: string
  timestamp: number
  created_at: string
}

export interface MockFile {
  id: string
  originalName: string
  filename: string
  size: number
  mimetype: string
  uploadTime: string
  indexed: boolean
  userId: string
}

export interface MockSearchResult {
  file: {
    id: string
    originalName: string
    size: number
    uploadTime: string
    mimetype: string
  }
  score: number
  snippet?: string
}

export interface MockSearchResponse {
  success: boolean
  data: {
    results: MockSearchResult[]
    hitsCount: number
    processingTimeMs: number
    query: string
  }
}

// Mock chat history data
export const mockChatHistory: MockChatHistoryItem[] = [
  {
    id: 'chat-1',
    query: 'Tài liệu này nói về gì?',
    answer: 'Tài liệu này là một báo cáo nghiên cứu về trí tuệ nhân tạo trong giáo dục. Nó bao gồm các phương pháp ứng dụng AI để cá nhân hóa học tập, phân tích dữ liệu học sinh, và tự động hóa các quy trình đánh giá. Báo cáo cũng thảo luận về những thách thức đạo đức và kỹ thuật khi triển khai AI trong môi trường giáo dục.',
    sources: [
      {
        file_id: 'file-1',
        file_name: 'AI_in_Education_Report.pdf',
        chunks: [
          { content: 'Trí tuệ nhân tạo đang thay đổi cách chúng ta tiếp cận giáo dục...' },
          { content: 'Các hệ thống học tập thích ứng sử dụng AI để cá nhân hóa...' }
        ],
        chunk_count: 5
      }
    ],
    model_used: 'gemini',
    timestamp: Date.now() - 3600000, // 1 hour ago
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'chat-2',
    query: 'Làm thế nào để triển khai AI trong trường học?',
    answer: 'Để triển khai AI trong trường học, cần thực hiện theo các bước sau:\n\n1. **Đánh giá nhu cầu**: Xác định các lĩnh vực cần cải thiện như cá nhân hóa học tập, quản lý lớp học, hoặc đánh giá học sinh.\n\n2. **Đào tạo giáo viên**: Trang bị kiến thức và kỹ năng sử dụng công nghệ AI cho đội ngũ giáo viên.\n\n3. **Chọn công nghệ phù hợp**: Lựa chọn các nền tảng và công cụ AI phù hợp với ngân sách và mục tiêu của trường.\n\n4. **Triển khai từng bước**: Bắt đầu với các dự án pilot nhỏ trước khi mở rộng ra toàn trường.',
    sources: [
      {
        file_id: 'file-1',
        file_name: 'AI_in_Education_Report.pdf',
        chunks: [
          { content: 'Quy trình triển khai AI trong giáo dục cần được thực hiện cẩn thận...' },
          { content: 'Đào tạo giáo viên là yếu tố quan trọng nhất trong thành công...' }
        ],
        chunk_count: 3
      },
      {
        file_id: 'file-2',
        file_name: 'Implementation_Guide.docx',
        chunks: [
          { content: 'Các bước cụ thể để triển khai công nghệ trong trường học...' }
        ],
        chunk_count: 2
      }
    ],
    model_used: 'openai',
    timestamp: Date.now() - 7200000, // 2 hours ago
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'chat-3',
    query: 'Chi phí triển khai AI trong giáo dục là bao nhiêu?',
    answer: 'Chi phí triển khai AI trong giáo dục phụ thuộc vào nhiều yếu tố:\n\n**Chi phí ban đầu:**\n- Phần mềm và license: $5,000 - $50,000/năm\n- Đào tạo nhân sự: $10,000 - $30,000\n- Hạ tầng kỹ thuật: $15,000 - $100,000\n\n**Chi phí vận hành:**\n- Bảo trì hệ thống: $2,000 - $10,000/năm\n- Hỗ trợ kỹ thuật: $3,000 - $15,000/năm\n- Nâng cấp và cập nhật: $1,000 - $5,000/năm\n\nTổng chi phí trung bình cho một trường học cỡ trung bình dao động từ $25,000 - $150,000 trong năm đầu.',
    sources: [
      {
        file_id: 'file-3',
        file_name: 'Budget_Analysis_2024.xlsx',
        chunks: [
          { content: 'Phân tích chi phí triển khai AI cho 50 trường học...' },
          { content: 'ROI trung bình đạt được sau 18 tháng triển khai...' }
        ],
        chunk_count: 4
      }
    ],
    model_used: 'gemini',
    timestamp: Date.now() - 86400000, // 1 day ago
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'chat-4',
    query: 'Những rủi ro khi sử dụng AI trong giáo dục?',
    answer: 'Việc sử dụng AI trong giáo dục có một số rủi ro cần lưu ý:\n\n**Rủi ro về dữ liệu:**\n- Bảo mật thông tin học sinh\n- Quyền riêng tư và GDPR compliance\n- Lưu trữ và xử lý dữ liệu nhạy cảm\n\n**Rủi ro về công nghệ:**\n- Độ chính xác của thuật toán\n- Bias trong mô hình AI\n- Phụ thuộc quá nhiều vào công nghệ\n\n**Rủi ro về con người:**\n- Giảm tương tác trực tiếp giữa giáo viên và học sinh\n- Mất kỹ năng tư duy phản biện\n- Kháng cự thay đổi từ giáo viên',
    sources: [
      {
        file_id: 'file-4',
        file_name: 'Risk_Assessment_AI_Education.pdf',
        chunks: [
          { content: 'Đánh giá rủi ro toàn diện về việc sử dụng AI trong giáo dục...' },
          { content: 'Các biện pháp giảm thiểu rủi ro được đề xuất...' }
        ],
        chunk_count: 6
      }
    ],
    model_used: 'openai',
    timestamp: Date.now() - 172800000, // 2 days ago
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'chat-5',
    query: 'Tương lai của AI trong giáo dục như thế nào?',
    answer: 'Tương lai của AI trong giáo dục rất hứa hẹn với nhiều xu hướng đáng chú ý:\n\n**Xu hướng ngắn hạn (2024-2026):**\n- Chatbot hỗ trợ học tập 24/7\n- Hệ thống chấm điểm tự động\n- Phân tích học tập cá nhân hóa\n\n**Xu hướng trung hạn (2026-2030):**\n- Thực tế ảo (VR) kết hợp AI cho trải nghiệm học tập\n- Gia sư AI thông minh\n- Dự đoán và can thiệp sớm khó khăn học tập\n\n**Tầm nhìn dài hạn (2030+):**\n- Giáo dục hoàn toàn cá nhân hóa\n- AI tạo nội dung học tập động\n- Hệ sinh thái giáo dục thích ứng thông minh',
    sources: [
      {
        file_id: 'file-5',
        file_name: 'Future_Trends_AI_2024.pdf',
        chunks: [
          { content: 'Dự báo xu hướng công nghệ giáo dục trong 10 năm tới...' },
          { content: 'Nghiên cứu từ 100 chuyên gia hàng đầu về AI và giáo dục...' }
        ],
        chunk_count: 8
      }
    ],
    model_used: 'gemini',
    timestamp: Date.now() - 259200000, // 3 days ago
    created_at: new Date(Date.now() - 259200000).toISOString()
  }
]

// Mock files data
export const mockFiles: MockFile[] = [
  {
    id: 'file-1',
    originalName: 'AI_in_Education_Report.pdf',
    filename: 'ai-education-report-2024.pdf',
    size: 2547328,
    mimetype: 'application/pdf',
    uploadTime: new Date(Date.now() - 86400000).toISOString(),
    indexed: true,
    userId: 'dev-user-id'
  },
  {
    id: 'file-2',
    originalName: 'Implementation_Guide.docx',
    filename: 'implementation-guide.docx',
    size: 1234567,
    mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadTime: new Date(Date.now() - 172800000).toISOString(),
    indexed: true,
    userId: 'dev-user-id'
  },
  {
    id: 'file-3',
    originalName: 'Budget_Analysis_2024.xlsx',
    filename: 'budget-analysis-2024.xlsx',
    size: 987654,
    mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadTime: new Date(Date.now() - 259200000).toISOString(),
    indexed: true,
    userId: 'dev-user-id'
  },
  {
    id: 'file-4',
    originalName: 'Risk_Assessment_AI_Education.pdf',
    filename: 'risk-assessment-ai-education.pdf',
    size: 1876543,
    mimetype: 'application/pdf',
    uploadTime: new Date(Date.now() - 345600000).toISOString(),
    indexed: true,
    userId: 'dev-user-id'
  },
  {
    id: 'file-5',
    originalName: 'Future_Trends_AI_2024.pdf',
    filename: 'future-trends-ai-2024.pdf',
    size: 3456789,
    mimetype: 'application/pdf',
    uploadTime: new Date(Date.now() - 432000000).toISOString(),
    indexed: true,
    userId: 'dev-user-id'
  }
]

// Mock current chat messages
export const mockChatMessages: MockChatMessage[] = [
  {
    id: 'welcome',
    type: 'assistant',
    content: 'Xin chào! Tôi là AI assistant của Chatnary. Tôi có thể giúp bạn tìm hiểu nội dung trong các tài liệu đã tải lên. Hãy hỏi tôi bất cứ điều gì!\n\n*Hiện tại bạn đang ở chế độ bypass với dữ liệu mẫu. Các tài liệu mẫu bao gồm báo cáo về AI trong giáo dục, hướng dẫn triển khai, phân tích ngân sách, và đánh giá rủi ro.*',
    timestamp: new Date()
  }
]

// Helper function to check if bypass mode is enabled
export const isBypassMode = (): boolean => {
  return process.env.NEXT_PUBLIC_BYPASS_AUTH === '1'
}

// Helper function to get random delay for mock API calls
export const getMockDelay = (min = 500, max = 1500): number => {
  return Math.random() * (max - min) + min
}

// Mock API response wrapper
export const createMockResponse = <T>(data: T): Promise<{ data: T }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data
      })
    }, getMockDelay())
  })
}

// Mock search function
export const createMockSearchResponse = (query: string, files = mockFiles): MockSearchResponse => {
  if (!query.trim()) {
    return {
      success: true,
      data: {
        results: [],
        hitsCount: 0,
        processingTimeMs: 0,
        query
      }
    }
  }

  const results = files
    .filter(file => 
      file.originalName.toLowerCase().includes(query.toLowerCase()) ||
      file.mimetype.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 20)
    .map(file => ({
      file: {
        id: file.id,
        originalName: file.originalName,
        size: file.size,
        uploadTime: file.uploadTime,
        mimetype: file.mimetype
      },
      score: Math.random() * 0.3 + 0.7, // Random score between 0.7-1.0
      snippet: `Tìm thấy từ khóa "${query}" trong tài liệu ${file.originalName}. Nội dung liên quan bao gồm các thông tin quan trọng về chủ đề được tìm kiếm...`
    }))

  return {
    success: true,
    data: {
      results,
      hitsCount: results.length,
      processingTimeMs: Math.floor(Math.random() * 100) + 50,
      query
    }
  }
}
