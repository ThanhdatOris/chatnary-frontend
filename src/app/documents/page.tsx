'use client';

import DocumentList from '@/components/document/DocumentList';
import DocumentViewer from '@/components/document/DocumentViewer';
import FileUploadZone from '@/components/document/FileUploadZone';
import MainLayout from '@/components/layout/MainLayout';
import { Button, Input, Loading, Modal } from '@/components/ui';
import useDocuments from '@/hooks/useDocuments';
import { useProject } from '@/hooks/useProject';
import apiClient, { Document } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DocumentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');
  const { project, isLoading: projectLoading } = useProject();
  const { 
    documents, 
    loading, 
    error, 
    uploading, 
    uploadDocument, 
    deleteDocument, 
    refreshDocuments 
  } = useDocuments({ projectId: projectId || undefined });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Auto-select first project if no project is specified
  useEffect(() => {
    const loadProjects = async () => {
      if (!projectId) {
        try {
          setLoadingProjects(true);
          const response = await apiClient.getProjects();
          
          if (response.success && response.data && response.data.length > 0) {
            setAvailableProjects(response.data);
            // Auto-redirect to first project
            const firstProject = response.data[0];
            router.push(`/documents?project=${firstProject.id}`);
          } else {
            // No projects available, redirect to home
            router.push('/');
          }
        } catch (err) {
          console.error('Failed to load projects:', err);
          router.push('/');
        } finally {
          setLoadingProjects(false);
        }
      }
    };

    loadProjects();
  }, [projectId, router]);

  const handleUpload = async (file: File) => {
    console.log('DocumentsPage: handleUpload called with file:', file.name);
    try {
      setUploadError(null); // Clear previous errors
      console.log('DocumentsPage: Calling uploadDocument...');
      await uploadDocument(file);
      console.log('DocumentsPage: Upload successful, closing modal');
      setShowUploadModal(false);
    } catch (err) {
      console.error('DocumentsPage: Upload failed:', err);
      setUploadError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi upload file');
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id);
      // Clear selection if deleted document was selected
      if (selectedDocument?.id === id) {
        setSelectedDocument(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleChatWithDocument = async (documentId: string) => {
    if (!projectId) return;
    
    // Create a new chat session for this document
    router.push(`/chat?project=${projectId}&document=${documentId}`);
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc =>
    (doc.originalFilename || doc.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!projectId || loadingProjects) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loading size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (projectLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loading size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Project không tìm thấy
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Project bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => router.push('/')}>
              Quay về trang chủ
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="min-h-16 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Tài liệu
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Quản lý tài liệu trong project "{project.name}"
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => setShowUploadModal(true)} disabled={uploading}>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {uploading ? 'Đang upload...' : 'Upload tài liệu'}
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 max-w-md">
            <Input
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            <p className="font-medium">Lỗi: {error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshDocuments}
              className="mt-2"
            >
              Thử lại
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex min-h-0">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loading size="lg" text="Đang tải tài liệu..." />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {searchTerm ? 'Không tìm thấy tài liệu' : 'Chưa có tài liệu'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm 
                    ? `Không có tài liệu nào khớp với "${searchTerm}"`
                    : 'Hãy upload tài liệu đầu tiên của bạn'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowUploadModal(true)}>
                    Upload tài liệu
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Document List */}
              <DocumentList
                documents={filteredDocuments}
                selectedDocument={selectedDocument}
                onSelectDocument={setSelectedDocument}
                onDeleteDocument={handleDeleteDocument}
                searchTerm={searchTerm}
                totalDocuments={documents.length}
                isPanelCollapsed={isPanelCollapsed}
                onPanelToggle={setIsPanelCollapsed}
              />
              
              {/* Document Viewer */}
              {selectedDocument && !isPanelCollapsed && (
                <DocumentViewer
                  document={selectedDocument}
                  onClose={() => setSelectedDocument(null)}
                  onChat={() => handleChatWithDocument(selectedDocument.id)}
                />
              )}
              
              {/* Preview khi chưa chọn tài liệu */}
              {!selectedDocument && !isPanelCollapsed && (
                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-center max-w-lg px-6">
                    {/* Project Info */}
                    <div className="mb-8">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: project?.color || '#6366f1' }}
                        />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {project?.name || 'Đang tải...'}
                        </h2>
                      </div>
                      {project?.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          {project.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Document Stats */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {documents.length}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Tài liệu trong project
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Chọn tài liệu để xem trước
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      Click vào một tài liệu bên trái để xem nội dung chi tiết và có thể bắt đầu trò chuyện với AI về tài liệu đó.
                    </p>
                    <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Xem trước nội dung tài liệu</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Bắt đầu trò chuyện với AI</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download tài liệu gốc</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Upload Modal */}
        <Modal
          isOpen={showUploadModal}
          title="Upload tài liệu"
          onClose={() => {
            if (!uploading) {
              setShowUploadModal(false);
              setUploadError(null); // Clear error when closing
            }
          }}
        >
          <div className="p-6">
            <FileUploadZone onUpload={handleUpload} isUploading={uploading} />
            
            {/* Display upload error */}
            {uploadError && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
              </div>
            )}
            
            {/* Display general documents error */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}