import {
    ChatSession,
    Document,
    Message,
    OverviewStats,
    User
} from './types';

// ==================== MOCK USER ====================
export const mockUser: User = {
  id: 'user_001',
  email: 'demo@chatnary.com',
  name: 'Người dùng Demo',
  createdAt: '2024-01-01T00:00:00Z',
};

// ==================== MOCK DOCUMENTS ====================
export const mockDocuments: Document[] = [
  {
    id: 'doc_001',
    name: 'Machine Learning Basics.pdf',
    originalName: 'Machine Learning Basics.pdf',
    size: 2048000,
    type: 'application/pdf',
    url: 'https://example.com/ml-basics.pdf',
    status: 'completed',
    uploadedAt: '2024-01-15T10:30:00Z',
    processedAt: '2024-01-15T10:31:00Z',
    pageCount: 25,
    wordCount: 8500,
    chatCount: 3,
    metadata: {
      title: 'Machine Learning Basics',
      author: 'John Doe',
      createdDate: '2023-12-01',
    },
  },
  {
    id: 'doc_002',
    name: 'Deep Learning Guide.pdf',
    originalName: 'Deep Learning Guide.pdf',
    size: 3500000,
    type: 'application/pdf',
    url: 'https://example.com/dl-guide.pdf',
    status: 'completed',
    uploadedAt: '2024-01-16T14:20:00Z',
    processedAt: '2024-01-16T14:22:00Z',
    pageCount: 45,
    wordCount: 15000,
    chatCount: 5,
  },
  {
    id: 'doc_003',
    name: 'Neural Networks.docx',
    originalName: 'Neural Networks.docx',
    size: 1024000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    url: 'https://example.com/neural-networks.docx',
    status: 'completed',
    uploadedAt: '2024-01-18T09:15:00Z',
    processedAt: '2024-01-18T09:16:00Z',
    pageCount: 12,
    wordCount: 4200,
    chatCount: 1,
  },
  {
    id: 'doc_004',
    name: 'Data Science Handbook.pdf',
    originalName: 'Data Science Handbook.pdf',
    size: 5120000,
    type: 'application/pdf',
    url: 'https://example.com/ds-handbook.pdf',
    status: 'processing',
    uploadedAt: '2024-01-20T16:45:00Z',
    processedAt: null,
    pageCount: null,
    wordCount: null,
    chatCount: 0,
  },
  {
    id: 'doc_005',
    name: 'Python Programming.txt',
    originalName: 'Python Programming.txt',
    size: 512000,
    type: 'text/plain',
    url: 'https://example.com/python.txt',
    status: 'completed',
    uploadedAt: '2024-01-19T11:30:00Z',
    processedAt: '2024-01-19T11:30:30Z',
    pageCount: 1,
    wordCount: 3000,
    chatCount: 2,
  },
];

// ==================== MOCK CHAT SESSIONS ====================
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

export const mockChatSessions: ChatSession[] = [
  // Hôm nay
  {
    id: 'chat_001',
    title: 'Tìm hiểu về Machine Learning',
    documentIds: ['doc_001'],
    documents: [
      {
        id: 'doc_001',
        name: 'Machine Learning Basics.pdf',
        type: 'application/pdf',
      },
    ],
    lastMessage: {
      content: 'Machine Learning là một nhánh của AI tập trung vào việc máy tính học từ dữ liệu...',
      createdAt: new Date(today.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    },
    messageCount: 8,
    createdAt: new Date(today.getTime() + 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(today.getTime() + 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'chat_002',
    title: 'Phân tích dữ liệu với Python',
    documentIds: ['doc_005'],
    documents: [
      {
        id: 'doc_005',
        name: 'Python Programming.txt',
      },
    ],
    lastMessage: {
      content: 'Python có nhiều thư viện mạnh mẽ cho data analysis...',
      createdAt: new Date(today.getTime() + 4 * 60 * 60 * 1000).toISOString(),
    },
    messageCount: 6,
    createdAt: new Date(today.getTime() + 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(today.getTime() + 4 * 60 * 60 * 1000).toISOString(),
  },
  // Hôm qua
  {
    id: 'chat_003',
    title: 'Deep Learning vs Machine Learning',
    documentIds: ['doc_001', 'doc_002'],
    documents: [
      {
        id: 'doc_001',
        name: 'Machine Learning Basics.pdf',
      },
      {
        id: 'doc_002',
        name: 'Deep Learning Guide.pdf',
      },
    ],
    lastMessage: {
      content: 'Deep Learning là một tập con của Machine Learning...',
      createdAt: new Date(yesterday.getTime() + 15 * 60 * 60 * 1000).toISOString(),
    },
    messageCount: 12,
    createdAt: new Date(yesterday.getTime() + 14 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(yesterday.getTime() + 15 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'chat_004',
    title: 'Ứng dụng AI trong thực tế',
    documentIds: ['doc_002'],
    documents: [
      {
        id: 'doc_002',
        name: 'Deep Learning Guide.pdf',
      },
    ],
    lastMessage: {
      content: 'AI được ứng dụng rộng rãi trong nhiều lĩnh vực...',
      createdAt: new Date(yesterday.getTime() + 10 * 60 * 60 * 1000).toISOString(),
    },
    messageCount: 7,
    createdAt: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(yesterday.getTime() + 10 * 60 * 60 * 1000).toISOString(),
  },
  // 7 ngày trước
  {
    id: 'chat_005',
    title: 'Neural Networks Architecture',
    documentIds: ['doc_003'],
    documents: [
      {
        id: 'doc_003',
        name: 'Neural Networks.docx',
      },
    ],
    lastMessage: {
      content: 'Có nhiều loại kiến trúc neural network như CNN, RNN, LSTM...',
      createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messageCount: 5,
    createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'chat_006',
    title: 'Tối ưu hóa model ML',
    documentIds: ['doc_001'],
    documents: [
      {
        id: 'doc_001',
        name: 'Machine Learning Basics.pdf',
      },
    ],
    lastMessage: {
      content: 'Hyperparameter tuning là bước quan trọng...',
      createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messageCount: 9,
    createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // 30 ngày trước
  {
    id: 'chat_007',
    title: 'Giới thiệu Data Science',
    documentIds: ['doc_004'],
    documents: [
      {
        id: 'doc_004',
        name: 'Data Science Handbook.pdf',
      },
    ],
    lastMessage: {
      content: 'Data Science kết hợp nhiều lĩnh vực khác nhau...',
      createdAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messageCount: 4,
    createdAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'chat_008',
    title: 'Xử lý ngôn ngữ tự nhiên',
    documentIds: ['doc_002'],
    documents: [
      {
        id: 'doc_002',
        name: 'Deep Learning Guide.pdf',
      },
    ],
    lastMessage: {
      content: 'NLP là một nhánh quan trọng của AI...',
      createdAt: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messageCount: 11,
    createdAt: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ==================== MOCK MESSAGES ====================
export const mockMessages: Record<string, Message[]> = {
  chat_001: [
    {
      id: 'msg_001',
      chatId: 'chat_001',
      role: 'user',
      content: 'Machine Learning là gì?',
      createdAt: '2024-01-15T10:35:00Z',
    },
    {
      id: 'msg_002',
      chatId: 'chat_001',
      role: 'assistant',
      content: 'Machine Learning (Học máy) là một nhánh của trí tuệ nhân tạo (AI) tập trung vào việc xây dựng các hệ thống có khả năng học và cải thiện từ kinh nghiệm mà không cần được lập trình cụ thể. Theo tài liệu, Machine Learning cho phép máy tính nhận diện các mẫu trong dữ liệu và đưa ra dự đoán hoặc quyết định dựa trên dữ liệu đó.',
      sources: [
        {
          documentId: 'doc_001',
          documentName: 'Machine Learning Basics.pdf',
          pageNumber: 1,
          chunkId: 'chunk_001',
          content: 'Machine Learning is a subset of artificial intelligence that focuses on building systems that can learn from and make decisions based on data.',
          score: 0.95,
          startIndex: 0,
          endIndex: 150,
        },
      ],
      model: 'gpt-4',
      tokensUsed: {
        prompt: 850,
        completion: 120,
        total: 970,
      },
      createdAt: '2024-01-15T10:35:05Z',
    },
    {
      id: 'msg_003',
      chatId: 'chat_001',
      role: 'user',
      content: 'Có những loại Machine Learning nào?',
      createdAt: '2024-01-15T10:40:00Z',
    },
    {
      id: 'msg_004',
      chatId: 'chat_001',
      role: 'assistant',
      content: 'Theo tài liệu, có 3 loại Machine Learning chính:\n\n1. **Supervised Learning (Học có giám sát)**: Máy học từ dữ liệu đã được gán nhãn, ví dụ như phân loại email spam/not spam.\n\n2. **Unsupervised Learning (Học không giám sát)**: Máy tự tìm ra các mẫu trong dữ liệu không có nhãn, như phân nhóm khách hàng.\n\n3. **Reinforcement Learning (Học tăng cường)**: Máy học thông qua việc thử và sai, nhận phản hồi từ môi trường.',
      sources: [
        {
          documentId: 'doc_001',
          documentName: 'Machine Learning Basics.pdf',
          pageNumber: 3,
          chunkId: 'chunk_005',
          content: 'There are three main types of machine learning: Supervised Learning, Unsupervised Learning, and Reinforcement Learning...',
          score: 0.92,
        },
      ],
      createdAt: '2024-01-15T10:40:08Z',
    },
  ],
  chat_002: [
    {
      id: 'msg_005',
      chatId: 'chat_002',
      role: 'user',
      content: 'So sánh Machine Learning và Deep Learning',
      createdAt: '2024-01-16T14:30:00Z',
    },
    {
      id: 'msg_006',
      chatId: 'chat_002',
      role: 'assistant',
      content: 'Dựa trên hai tài liệu, đây là sự khác biệt chính:\n\n**Machine Learning:**\n- Sử dụng các thuật toán đơn giản hơn\n- Cần feature engineering thủ công\n- Hoạt động tốt với dữ liệu nhỏ và trung bình\n- Ví dụ: Decision Trees, SVM, Random Forest\n\n**Deep Learning:**\n- Sử dụng neural networks với nhiều layers\n- Tự động học features từ dữ liệu\n- Cần dữ liệu lớn và sức mạnh tính toán cao\n- Ví dụ: CNN, RNN, Transformers\n\nDeep Learning là một tập con của Machine Learning, đặc biệt hiệu quả với dữ liệu phi cấu trúc như hình ảnh, âm thanh, văn bản.',
      sources: [
        {
          documentId: 'doc_001',
          documentName: 'Machine Learning Basics.pdf',
          pageNumber: 5,
          chunkId: 'chunk_010',
          content: 'Traditional machine learning requires manual feature engineering...',
          score: 0.88,
        },
        {
          documentId: 'doc_002',
          documentName: 'Deep Learning Guide.pdf',
          pageNumber: 2,
          chunkId: 'chunk_003',
          content: 'Deep Learning uses neural networks with multiple layers to automatically learn representations from data...',
          score: 0.91,
        },
      ],
      createdAt: '2024-01-16T14:30:12Z',
    },
  ],
};

// ==================== MOCK STATS ====================
export const mockOverviewStats: OverviewStats = {
  totalDocuments: 5,
  totalChats: 3,
  totalMessages: 25,
  storageUsed: 12288000, // ~12MB
  storageLimit: 1073741824, // 1GB
  documentsThisMonth: 5,
  chatsThisMonth: 3,
  messagesThisMonth: 25,
  recentActivity: [
    {
      type: 'document_upload',
      documentId: 'doc_004',
      documentName: 'Data Science Handbook.pdf',
      timestamp: '2024-01-20T16:45:00Z',
    },
    {
      type: 'chat_created',
      chatId: 'chat_003',
      chatTitle: 'Neural Networks Architecture',
      timestamp: '2024-01-18T09:20:00Z',
    },
    {
      type: 'document_upload',
      documentId: 'doc_005',
      documentName: 'Python Programming.txt',
      timestamp: '2024-01-19T11:30:00Z',
    },
  ],
};

// ==================== MOCK SUGGESTIONS ====================
export const mockSuggestions: string[] = [
  'Tài liệu này nói về chủ đề gì?',
  'Tóm tắt những điểm chính trong tài liệu',
  'Giải thích khái niệm quan trọng nhất',
  'So sánh các phương pháp được đề cập',
];

