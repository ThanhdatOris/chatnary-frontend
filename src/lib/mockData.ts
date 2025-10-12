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
  // Additional documents for pagination testing
  {
    id: 'doc_006',
    name: 'JavaScript Fundamentals.pdf',
    originalName: 'JavaScript Fundamentals.pdf',
    size: 1800000,
    type: 'application/pdf',
    url: 'https://example.com/js-fundamentals.pdf',
    status: 'completed',
    uploadedAt: '2024-01-21T08:15:00Z',
    processedAt: '2024-01-21T08:16:00Z',
    pageCount: 32,
    wordCount: 9500,
    chatCount: 4,
    metadata: {
      title: 'JavaScript Fundamentals',
      author: 'Jane Smith',
      createdDate: '2024-01-01',
    },
  },
  {
    id: 'doc_007',
    name: 'React Development Guide.docx',
    originalName: 'React Development Guide.docx',
    size: 2200000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    url: 'https://example.com/react-guide.docx',
    status: 'completed',
    uploadedAt: '2024-01-22T10:20:00Z',
    processedAt: '2024-01-22T10:21:00Z',
    pageCount: 28,
    wordCount: 7800,
    chatCount: 6,
  },
  {
    id: 'doc_008',
    name: 'Database Design.pdf',
    originalName: 'Database Design.pdf',
    size: 3100000,
    type: 'application/pdf',
    url: 'https://example.com/db-design.pdf',
    status: 'completed',
    uploadedAt: '2024-01-23T14:30:00Z',
    processedAt: '2024-01-23T14:32:00Z',
    pageCount: 40,
    wordCount: 12000,
    chatCount: 2,
  },
  {
    id: 'doc_009',
    name: 'Node.js Backend.txt',
    originalName: 'Node.js Backend.txt',
    size: 768000,
    type: 'text/plain',
    url: 'https://example.com/nodejs.txt',
    status: 'processing',
    uploadedAt: '2024-01-24T09:45:00Z',
    processedAt: null,
    pageCount: null,
    wordCount: null,
    chatCount: 0,
  },
  {
    id: 'doc_010',
    name: 'CSS Styling Guide.pdf',
    originalName: 'CSS Styling Guide.pdf',
    size: 1400000,
    type: 'application/pdf',
    url: 'https://example.com/css-guide.pdf',
    status: 'completed',
    uploadedAt: '2024-01-25T16:10:00Z',
    processedAt: '2024-01-25T16:11:00Z',
    pageCount: 22,
    wordCount: 6500,
    chatCount: 3,
  },
  {
    id: 'doc_011',
    name: 'TypeScript Handbook.pdf',
    originalName: 'TypeScript Handbook.pdf',
    size: 2800000,
    type: 'application/pdf',
    url: 'https://example.com/ts-handbook.pdf',
    status: 'completed',
    uploadedAt: '2024-01-26T11:25:00Z',
    processedAt: '2024-01-26T11:27:00Z',
    pageCount: 38,
    wordCount: 11200,
    chatCount: 5,
  },
  {
    id: 'doc_012',
    name: 'Vue.js Documentation.docx',
    originalName: 'Vue.js Documentation.docx',
    size: 1900000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    url: 'https://example.com/vue-docs.docx',
    status: 'failed',
    uploadedAt: '2024-01-27T13:15:00Z',
    processedAt: null,
    pageCount: null,
    wordCount: null,
    chatCount: 0,
  },
  {
    id: 'doc_013',
    name: 'Angular Components.pdf',
    originalName: 'Angular Components.pdf',
    size: 2400000,
    type: 'application/pdf',
    url: 'https://example.com/angular-components.pdf',
    status: 'completed',
    uploadedAt: '2024-01-28T08:40:00Z',
    processedAt: '2024-01-28T08:42:00Z',
    pageCount: 33,
    wordCount: 9800,
    chatCount: 4,
  },
  {
    id: 'doc_014',
    name: 'API Development.txt',
    originalName: 'API Development.txt',
    size: 620000,
    type: 'text/plain',
    url: 'https://example.com/api-dev.txt',
    status: 'completed',
    uploadedAt: '2024-01-29T15:50:00Z',
    processedAt: '2024-01-29T15:51:00Z',
    pageCount: 1,
    wordCount: 3500,
    chatCount: 2,
  },
  {
    id: 'doc_015',
    name: 'MongoDB Tutorial.pdf',
    originalName: 'MongoDB Tutorial.pdf',
    size: 2600000,
    type: 'application/pdf',
    url: 'https://example.com/mongodb-tutorial.pdf',
    status: 'completed',
    uploadedAt: '2024-01-30T12:20:00Z',
    processedAt: '2024-01-30T12:22:00Z',
    pageCount: 35,
    wordCount: 10500,
    chatCount: 3,
  },
  {
    id: 'doc_016',
    name: 'GraphQL Guide.docx',
    originalName: 'GraphQL Guide.docx',
    size: 1600000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    url: 'https://example.com/graphql-guide.docx',
    status: 'processing',
    uploadedAt: '2024-01-31T10:35:00Z',
    processedAt: null,
    pageCount: null,
    wordCount: null,
    chatCount: 0,
  },
  {
    id: 'doc_017',
    name: 'Docker Containers.pdf',
    originalName: 'Docker Containers.pdf',
    size: 3200000,
    type: 'application/pdf',
    url: 'https://example.com/docker.pdf',
    status: 'completed',
    uploadedAt: '2024-02-01T09:10:00Z',
    processedAt: '2024-02-01T09:12:00Z',
    pageCount: 42,
    wordCount: 13500,
    chatCount: 6,
  },
  {
    id: 'doc_018',
    name: 'Kubernetes Basics.txt',
    originalName: 'Kubernetes Basics.txt',
    size: 890000,
    type: 'text/plain',
    url: 'https://example.com/k8s.txt',
    status: 'completed',
    uploadedAt: '2024-02-02T14:45:00Z',
    processedAt: '2024-02-02T14:46:00Z',
    pageCount: 1,
    wordCount: 4200,
    chatCount: 1,
  },
  {
    id: 'doc_019',
    name: 'AWS Cloud Services.pdf',
    originalName: 'AWS Cloud Services.pdf',
    size: 4100000,
    type: 'application/pdf',
    url: 'https://example.com/aws.pdf',
    status: 'completed',
    uploadedAt: '2024-02-03T11:15:00Z',
    processedAt: '2024-02-03T11:18:00Z',
    pageCount: 55,
    wordCount: 16800,
    chatCount: 8,
  },
  {
    id: 'doc_020',
    name: 'Azure DevOps.docx',
    originalName: 'Azure DevOps.docx',
    size: 2100000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    url: 'https://example.com/azure-devops.docx',
    status: 'failed',
    uploadedAt: '2024-02-04T16:30:00Z',
    processedAt: null,
    pageCount: null,
    wordCount: null,
    chatCount: 0,
  },
  {
    id: 'doc_021',
    name: 'Git Version Control.pdf',
    originalName: 'Git Version Control.pdf',
    size: 1700000,
    type: 'application/pdf',
    url: 'https://example.com/git.pdf',
    status: 'completed',
    uploadedAt: '2024-02-05T08:20:00Z',
    processedAt: '2024-02-05T08:21:00Z',
    pageCount: 29,
    wordCount: 8200,
    chatCount: 4,
  },
  {
    id: 'doc_022',
    name: 'Linux Commands.txt',
    originalName: 'Linux Commands.txt',
    size: 450000,
    type: 'text/plain',
    url: 'https://example.com/linux.txt',
    status: 'completed',
    uploadedAt: '2024-02-06T13:55:00Z',
    processedAt: '2024-02-06T13:56:00Z',
    pageCount: 1,
    wordCount: 2800,
    chatCount: 2,
  },
  {
    id: 'doc_023',
    name: 'Cybersecurity Fundamentals.pdf',
    originalName: 'Cybersecurity Fundamentals.pdf',
    size: 3600000,
    type: 'application/pdf',
    url: 'https://example.com/cybersecurity.pdf',
    status: 'processing',
    uploadedAt: '2024-02-07T10:40:00Z',
    processedAt: null,
    pageCount: null,
    wordCount: null,
    chatCount: 0,
  },
  {
    id: 'doc_024',
    name: 'Blockchain Technology.docx',
    originalName: 'Blockchain Technology.docx',
    size: 2900000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    url: 'https://example.com/blockchain.docx',
    status: 'completed',
    uploadedAt: '2024-02-08T15:25:00Z',
    processedAt: '2024-02-08T15:27:00Z',
    pageCount: 41,
    wordCount: 12800,
    chatCount: 5,
  },
  {
    id: 'doc_025',
    name: 'AI Ethics Guidelines.pdf',
    originalName: 'AI Ethics Guidelines.pdf',
    size: 1300000,
    type: 'application/pdf',
    url: 'https://example.com/ai-ethics.pdf',
    status: 'completed',
    uploadedAt: '2024-02-09T09:30:00Z',
    processedAt: '2024-02-09T09:31:00Z',
    pageCount: 18,
    wordCount: 5400,
    chatCount: 3,
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

// ==================== ADDITIONAL MOCK DOCUMENTS WITH DIVERSE FILE TYPES ====================
import { mockFileTypes } from './utils';

// Generate additional documents based on mockFileTypes
export const generateAdditionalMockDocuments = (): Document[] => {
  const statuses: Document['status'][] = ['completed', 'processing', 'failed'];
  const baseDates = [
    '2024-01-', '2024-02-', '2024-03-', '2024-04-', '2024-05-', '2024-06-'
  ];
  
  return mockFileTypes.map((fileType, index) => {
    const docId = `doc_${String(26 + index).padStart(3, '0')}`;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomDate = baseDates[Math.floor(Math.random() * baseDates.length)] + 
                      String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const randomTime = `T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`;
    
    return {
      id: docId,
      name: fileType.name,
      originalName: fileType.name,
      size: fileType.size,
      type: fileType.type,
      url: `https://example.com/${docId}`,
      status: randomStatus,
      uploadedAt: randomDate + randomTime,
      processedAt: randomStatus === 'completed' ? randomDate + randomTime : null,
      pageCount: fileType.pageCount,
      wordCount: fileType.pageCount ? fileType.pageCount * Math.floor(Math.random() * 300) + 200 : null,
      chatCount: Math.floor(Math.random() * 10),
      metadata: {
        title: fileType.name.replace(/\.[^/.]+$/, ""), // Remove extension
        author: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Minh C', 'Phạm Thị D'][Math.floor(Math.random() * 4)],
        createdDate: randomDate.replace('T', ''),
      },
    };
  });
};

// Combine all mock documents
export const allMockDocuments = [...mockDocuments, ...generateAdditionalMockDocuments()];

