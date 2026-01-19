'use client';

import apiClient from '@/lib/api';
import { USE_MOCK_DATA, getMockDocument, getMockDocumentsByProject, simulateDelay } from '@/lib/mockData';
import { Document } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

interface UseDocumentsOptions {
  projectId?: string;
  autoFetch?: boolean;
}

interface UseDocumentsReturn {
  documents: Document[];
  loading: boolean;
  error: string | null;
  uploading: boolean;
  uploadDocument: (file: File) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;
  getDocument: (documentId: string) => Promise<Document | null>;
  searchDocuments: (query: string) => Document[];
}

export function useDocuments({ projectId, autoFetch = true }: UseDocumentsOptions = {}): UseDocumentsReturn {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);

      // ========================================
      // 🔄 MOCK MODE - Sử dụng mock data
      // ========================================
      if (USE_MOCK_DATA) {
        await simulateDelay(300); // Simulate network delay
        const mockDocs = getMockDocumentsByProject(projectId);
        setDocuments(mockDocs);
      } else {
        // Original API call
        const response = await apiClient.getProjectDocuments(projectId);

        if (response.error) {
          setError(response.error);
          return;
        }

        setDocuments(response.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải documents');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const uploadDocument = useCallback(async (file: File) => {
    console.log('Upload started:', { file: file.name, projectId });

    if (!projectId) {
      const errorMsg = 'Project ID is required for upload';
      console.error('Upload failed:', errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      setUploading(true);
      setError(null);

      // ========================================
      // 🔄 MOCK MODE - Simulate upload
      // ========================================
      if (USE_MOCK_DATA) {
        await simulateDelay(800); // Simulate upload time
        const newDocument: Document = {
          id: `doc-${Date.now()}`,
          name: file.name,
          originalFilename: file.name,
          projectId: projectId,
          fileSize: file.size,
          mimeType: file.type,
          status: 'processing',
          uploadedBy: 'test-user-id',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          hasContent: false,
        };
        console.log('Mock upload successful:', newDocument);
        setDocuments(prev => [newDocument, ...prev]);
        
        // Simulate processing completion after 2 seconds
        setTimeout(() => {
          setDocuments(prev => 
            prev.map(doc => 
              doc.id === newDocument.id 
                ? { ...doc, status: 'processed' as const, hasContent: true }
                : doc
            )
          );
        }, 2000);
      } else {
        // Original API call
        console.log('Calling API uploadDocument...');
        const response = await apiClient.uploadDocument(projectId, file);
        console.log('API response:', response);

        if (response.error) {
          console.error('API error:', response.error);
          setError(response.error);
          throw new Error(response.error);
        }

        // Add new document to list
        if (response.data) {
          console.log('Upload successful, updating documents list');
          setDocuments(prev => [response.data!, ...prev]);
        }

        // Refresh to get updated list
        console.log('Refreshing documents list...');
        await fetchDocuments();
        console.log('Upload process completed successfully');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi upload document';
      console.error('Upload error:', err);
      setError(errorMessage);
      throw err; // Re-throw để handleUpload có thể catch
    } finally {
      setUploading(false);
    }
  }, [projectId, fetchDocuments]);

  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      setError(null);

      // ========================================
      // 🔄 MOCK MODE - Simulate delete
      // ========================================
      if (USE_MOCK_DATA) {
        await simulateDelay(200);
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      } else {
        // Original API call
        const response = await apiClient.deleteDocument(documentId);

        if (response.error) {
          setError(response.error);
          return;
        }

        // Remove document from list
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa document');
    }
  }, []);

  const getDocument = useCallback(async (documentId: string): Promise<Document | null> => {
    try {
      setError(null);

      // ========================================
      // 🔄 MOCK MODE - Get mock document
      // ========================================
      if (USE_MOCK_DATA) {
        await simulateDelay(200);
        return getMockDocument(documentId) || null;
      } else {
        // Original API call
        const response = await apiClient.getDocument(documentId);

        if (response.error) {
          setError(response.error);
          return null;
        }

        return response.data || null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải document');
      return null;
    }
  }, []);

  // Search locally within loaded documents
  const searchDocuments = useCallback((query: string): Document[] => {
    if (!query.trim()) return documents;

    const lowerQuery = query.toLowerCase();
    return documents.filter(doc =>
      doc.name.toLowerCase().includes(lowerQuery) ||
      doc.originalFilename?.toLowerCase().includes(lowerQuery)
    );
  }, [documents]);

  const refreshDocuments = useCallback(async () => {
    await fetchDocuments();
  }, [fetchDocuments]);

  // Reset state immediately when projectId changes
  useEffect(() => {
    if (projectId) {
      setLoading(true);
      setDocuments([]);
      setError(null);
    }
  }, [projectId]);

  // Auto-fetch documents when projectId changes
  useEffect(() => {
    if (autoFetch && projectId) {
      fetchDocuments();
    }
  }, [projectId, autoFetch, fetchDocuments]);

  return {
    documents,
    loading,
    error,
    uploading,
    uploadDocument,
    deleteDocument,
    refreshDocuments,
    getDocument,
    searchDocuments,
  };
}

export default useDocuments;