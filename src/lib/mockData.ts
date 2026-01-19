// Mock data for testing without backend
import { Project, Document, ChatSession, Message } from './types';

// ==================== FLAG TO ENABLE/DISABLE MOCK MODE ====================
export const USE_MOCK_DATA = true; // Set to false to use real API

// ==================== MOCK PROJECTS ====================
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Dự án AI & Machine Learning',
    description: 'Nghiên cứu và phát triển các mô hình AI',
    color: '#3b82f6',
    icon: 'rocket',
    documentsCount: 15,
    chatsCount: 8,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: 'project-2',
    name: 'Tài liệu Marketing',
    description: 'Chiến lược và kế hoạch marketing Q1 2024',
    color: '#ec4899',
    icon: 'target',
    documentsCount: 23,
    chatsCount: 12,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-22T11:20:00Z',
  },
  {
    id: 'project-3',
    name: 'Phát triển Web',
    description: 'Dự án xây dựng website và ứng dụng web',
    color: '#10b981',
    icon: 'code',
    documentsCount: 31,
    chatsCount: 19,
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-23T09:45:00Z',
  },
  {
    id: 'project-4',
    name: 'Thư Viện Số',
    description: 'Project số hóa tài liệu PDF',
    color: '#f59e0b',
    icon: 'book',
    documentsCount: 47,
    chatsCount: 25,
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-24T16:10:00Z',
  },
  {
    id: 'project-5',
    name: 'Nghiên cứu Khoa học',
    description: 'Tài liệu và bài báo khoa học',
    color: '#8b5cf6',
    icon: 'database',
    documentsCount: 62,
    chatsCount: 34,
    createdAt: '2023-12-20T10:30:00Z',
    updatedAt: '2024-01-25T13:25:00Z',
  },
];

// ==================== MOCK DOCUMENTS ====================
export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Báo cáo phân tích dữ liệu Q3.pdf',
    originalFilename: 'Báo cáo phân tích dữ liệu Q3.pdf',
    projectId: 'project-1',
    projectName: 'Dự án AI & Machine Learning',
    fileSize: 2450000,
    mimeType: 'application/pdf',
    status: 'processed',
    uploadedBy: 'test-user-id',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:35:00Z',
    hasContent: true,
  },
  {
    id: 'doc-2',
    name: 'Machine Learning Model Documentation.pdf',
    originalFilename: 'ML_Model_Docs.pdf',
    projectId: 'project-1',
    projectName: 'Dự án AI & Machine Learning',
    fileSize: 3200000,
    mimeType: 'application/pdf',
    status: 'processed',
    uploadedBy: 'test-user-id',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:25:00Z',
    hasContent: true,
  },
  {
    id: 'doc-3',
    name: 'Chiến lược Marketing 2024.docx',
    originalFilename: 'Marketing_Strategy_2024.docx',
    projectId: 'project-2',
    projectName: 'Tài liệu Marketing',
    fileSize: 1890000,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    status: 'processing',
    uploadedBy: 'test-user-id',
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:01:00Z',
    hasContent: false,
  },
  {
    id: 'doc-4',
    name: 'Web Development Guide.pdf',
    originalFilename: 'Web_Dev_Guide.pdf',
    projectId: 'project-3',
    projectName: 'Phát triển Web',
    fileSize: 4500000,
    mimeType: 'application/pdf',
    status: 'processed',
    uploadedBy: 'test-user-id',
    createdAt: '2024-01-18T11:15:00Z',
    updatedAt: '2024-01-18T11:20:00Z',
    hasContent: true,
  },
  {
    id: 'doc-5',
    name: 'React Best Practices.pdf',
    originalFilename: 'React_Best_Practices.pdf',
    projectId: 'project-3',
    projectName: 'Phát triển Web',
    fileSize: 2100000,
    mimeType: 'application/pdf',
    status: 'processed',
    uploadedBy: 'test-user-id',
    createdAt: '2024-01-19T08:30:00Z',
    updatedAt: '2024-01-19T08:35:00Z',
    hasContent: true,
  },
  {
    id: 'doc-6',
    name: 'Nghiên cứu về LLM và ChatGPT.pdf',
    originalFilename: 'LLM_Research.pdf',
    projectId: 'project-4',
    projectName: 'Thư Viện Số',
    fileSize: 5600000,
    mimeType: 'application/pdf',
    status: 'processed',
    uploadedBy: 'test-user-id',
    createdAt: '2024-01-20T13:45:00Z',
    updatedAt: '2024-01-20T13:50:00Z',
    hasContent: true,
  },
  {
    id: 'doc-7',
    name: 'Luận văn tốt nghiệp.pdf',
    originalFilename: 'Thesis_2024.pdf',
    projectId: 'project-5',
    projectName: 'Nghiên cứu Khoa học',
    fileSize: 8900000,
    mimeType: 'application/pdf',
    status: 'processed',
    uploadedBy: 'test-user-id',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:10:00Z',
    hasContent: true,
  },
  {
    id: 'doc-8',
    name: 'Bài báo khoa học AI.pdf',
    originalFilename: 'AI_Paper.pdf',
    projectId: 'project-5',
    projectName: 'Nghiên cứu Khoa học',
    fileSize: 3400000,
    mimeType: 'application/pdf',
    status: 'error',
    uploadedBy: 'test-user-id',
    createdAt: '2024-01-22T15:20:00Z',
    updatedAt: '2024-01-22T15:21:00Z',
    hasContent: false,
    processingError: 'Không thể xử lý file - định dạng không hợp lệ',
  },
];

// ==================== MOCK CHAT SESSIONS ====================
export const mockChatSessions: ChatSession[] = [
  {
    id: 'chat-1',
    title: 'Hỏi về Machine Learning',
    projectId: 'project-1',
    projectName: 'Dự án AI & Machine Learning',
    createdBy: 'test-user-id',
    messagesCount: 12,
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T12:30:00Z',
  },
  {
    id: 'chat-2',
    title: 'Phân tích dữ liệu marketing',
    projectId: 'project-2',
    projectName: 'Tài liệu Marketing',
    createdBy: 'test-user-id',
    messagesCount: 8,
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T10:45:00Z',
  },
  {
    id: 'chat-3',
    title: 'React và Next.js best practices',
    projectId: 'project-3',
    projectName: 'Phát triển Web',
    createdBy: 'test-user-id',
    messagesCount: 15,
    createdAt: '2024-01-17T14:20:00Z',
    updatedAt: '2024-01-17T16:00:00Z',
  },
  {
    id: 'chat-4',
    title: 'Tìm hiểu về LLM',
    projectId: 'project-4',
    projectName: 'Thư Viện Số',
    createdBy: 'test-user-id',
    messagesCount: 20,
    createdAt: '2024-01-18T10:30:00Z',
    updatedAt: '2024-01-18T13:15:00Z',
  },
  {
    id: 'chat-5',
    title: 'Chat mới',
    projectId: 'project-1',
    projectName: 'Dự án AI & Machine Learning',
    createdBy: 'test-user-id',
    messagesCount: 0,
    createdAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
  },
];

// ==================== MOCK MESSAGES ====================
export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    chatId: 'chat-1',
    role: 'user',
    content: 'Machine Learning là gì?',
    createdAt: '2024-01-15T11:01:00Z',
  },
  {
    id: 'msg-2',
    chatId: 'chat-1',
    role: 'assistant',
    content: 'Machine Learning (Học máy) là một nhánh của trí tuệ nhân tạo (AI) tập trung vào việc xây dựng các hệ thống có khả năng học hỏi và cải thiện từ kinh nghiệm mà không cần được lập trình một cách tường minh. Các thuật toán Machine Learning sử dụng dữ liệu để tìm ra các mẫu và đưa ra dự đoán hoặc quyết định.',
    sources: [
      {
        documentId: 'doc-1',
        documentName: 'Báo cáo phân tích dữ liệu Q3.pdf',
        pageNumber: 5,
        chunkId: 'chunk-1',
        content: 'Machine Learning là một phương pháp phân tích dữ liệu tự động hóa...',
        score: 0.95,
      },
    ],
    createdAt: '2024-01-15T11:01:15Z',
  },
  {
    id: 'msg-3',
    chatId: 'chat-1',
    role: 'user',
    content: 'Có những loại Machine Learning nào?',
    createdAt: '2024-01-15T11:02:00Z',
  },
  {
    id: 'msg-4',
    chatId: 'chat-1',
    role: 'assistant',
    content: 'Có 3 loại Machine Learning chính:\n\n1. **Supervised Learning (Học có giám sát)**: Thuật toán học từ dữ liệu được gán nhãn, ví dụ: phân loại email spam.\n\n2. **Unsupervised Learning (Học không giám sát)**: Thuật toán tìm kiếm các mẫu trong dữ liệu không được gán nhãn, ví dụ: phân nhóm khách hàng.\n\n3. **Reinforcement Learning (Học tăng cường)**: Thuật toán học thông qua phần thưởng và hình phạt, ví dụ: chơi game, robot tự động.',
    sources: [
      {
        documentId: 'doc-2',
        documentName: 'Machine Learning Model Documentation.pdf',
        pageNumber: 12,
        chunkId: 'chunk-2',
        content: 'Ba loại Machine Learning cơ bản: Supervised, Unsupervised, và Reinforcement Learning...',
        score: 0.92,
      },
    ],
    createdAt: '2024-01-15T11:02:20Z',
  },
];

// ==================== HELPER FUNCTIONS ====================

// Get projects
export function getMockProjects(): Project[] {
  return [...mockProjects];
}

// Get project by ID
export function getMockProject(id: string): Project | undefined {
  return mockProjects.find(p => p.id === id);
}

// Get documents by project ID
export function getMockDocumentsByProject(projectId: string): Document[] {
  return mockDocuments.filter(d => d.projectId === projectId);
}

// Get document by ID
export function getMockDocument(id: string): Document | undefined {
  return mockDocuments.find(d => d.id === id);
}

// Get chat sessions by project ID
export function getMockChatsByProject(projectId: string): ChatSession[] {
  return mockChatSessions.filter(c => c.projectId === projectId);
}

// Get chat session by ID
export function getMockChat(id: string): ChatSession | undefined {
  return mockChatSessions.find(c => c.id === id);
}

// Get messages by chat ID
export function getMockMessagesByChat(chatId: string): Message[] {
  return mockMessages.filter(m => m.chatId === chatId);
}

// Create new chat session
export function createMockChat(data: {
  projectId: string;
  title?: string;
}): ChatSession {
  const project = getMockProject(data.projectId);
  const newChat: ChatSession = {
    id: `chat-${Date.now()}`,
    title: data.title || 'Chat mới',
    projectId: data.projectId,
    projectName: project?.name,
    createdBy: 'test-user-id',
    messagesCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockChatSessions.push(newChat);
  
  // Update project chat count
  if (project) {
    project.chatsCount++;
  }
  
  return newChat;
}

// Update chat session
export function updateMockChat(chatId: string, updates: { title: string }): ChatSession | undefined {
  const chat = mockChatSessions.find(c => c.id === chatId);
  if (chat) {
    chat.title = updates.title;
    chat.updatedAt = new Date().toISOString();
    return chat;
  }
  return undefined;
}

// Delete chat session
export function deleteMockChat(chatId: string): boolean {
  const index = mockChatSessions.findIndex(c => c.id === chatId);
  if (index !== -1) {
    const chat = mockChatSessions[index];
    
    // Update project chat count
    const project = getMockProject(chat.projectId);
    if (project && project.chatsCount > 0) {
      project.chatsCount--;
    }
    
    // Remove chat and its messages
    mockChatSessions.splice(index, 1);
    const messageIndices = mockMessages
      .map((m, idx) => m.chatId === chatId ? idx : -1)
      .filter(idx => idx !== -1)
      .reverse();
    messageIndices.forEach(idx => mockMessages.splice(idx, 1));
    
    return true;
  }
  return false;
}

// Create new project
export function createMockProject(data: {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}): Project {
  const newProject: Project = {
    id: `project-${Date.now()}`,
    name: data.name,
    description: data.description,
    color: data.color || '#3b82f6',
    icon: data.icon || 'folder',
    documentsCount: 0,
    chatsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockProjects.push(newProject);
  return newProject;
}

// Delete project
export function deleteMockProject(id: string): boolean {
  const index = mockProjects.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProjects.splice(index, 1);
    return true;
  }
  return false;
}

// Update project
export function updateMockProject(id: string, updates: Partial<Project>): Project | undefined {
  const project = mockProjects.find(p => p.id === id);
  if (project) {
    Object.assign(project, updates, { updatedAt: new Date().toISOString() });
    return project;
  }
  return undefined;
}

// Simulate delay for async operations
export function simulateDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
