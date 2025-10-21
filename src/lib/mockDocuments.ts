// Temporary mock data for testing upload functionality
export const mockDocument = {
  id: 'doc-' + Date.now(),
  projectId: 'test-project',
  fileName: 'test-document.pdf',
  originalName: 'Test Document.pdf',
  filePath: '/uploads/test-document.pdf',
  fileSize: 1024 * 1024, // 1MB
  mimeType: 'application/pdf',
  status: 'processing' as const,
  uploadedBy: 'test-user',
  uploadedAt: new Date().toISOString(),
  metadata: {
    pageCount: 10,
    wordCount: 2500
  }
};

// Mock upload function for testing
export async function mockUploadDocument(projectId: string, file: File) {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate potential errors
  if (file.size > 50 * 1024 * 1024) {
    throw new Error('File too large');
  }
  
  if (!['application/pdf', 'text/plain', 'application/msword'].includes(file.type)) {
    throw new Error('Unsupported file type');
  }
  
  // Return mock document
  return {
    ...mockDocument,
    fileName: file.name,
    originalName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    uploadedAt: new Date().toISOString()
  };
}

// Mock project data
export const mockProject = {
  id: 'test-project-123',
  name: 'Test Project',
  description: 'Project for testing document upload',
  color: '#3B82F6',
  documentsCount: 0,
  chatsCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const mockDocuments = [
  {
    ...mockDocument,
    id: 'doc-1',
    fileName: 'introduction.pdf',
    originalName: 'Introduction to AI.pdf',
    status: 'processed' as const,
    uploadedAt: '2024-10-20T10:00:00Z',
    metadata: {
      pageCount: 15,
      wordCount: 3200
    }
  },
  {
    ...mockDocument,
    id: 'doc-2',
    fileName: 'research.docx',
    originalName: 'Research Paper.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    status: 'processed' as const,
    uploadedAt: '2024-10-20T09:30:00Z',
    metadata: {
      pageCount: 25,
      wordCount: 5800
    }
  },
  {
    ...mockDocument,
    id: 'doc-3',
    fileName: 'notes.txt',
    originalName: 'Meeting Notes.txt',
    mimeType: 'text/plain',
    status: 'processing' as const,
    uploadedAt: '2024-10-21T08:15:00Z',
    fileSize: 2048,
    metadata: {
      wordCount: 450
    }
  }
];