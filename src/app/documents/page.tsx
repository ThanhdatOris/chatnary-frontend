'use client';

import DocumentList from '@/components/document/DocumentList';
import DocumentViewer from '@/components/document/DocumentViewer';
import FileUploadZone from '@/components/document/FileUploadZone';
import HeaderButton from '@/components/layout/HeaderButton';
import MainLayout from '@/components/layout/MainLayout';
import { Button, FileIcon, Loading, Modal } from '@/components/ui';
import useDocuments from '@/hooks/useDocuments';
import { useProject } from '@/hooks/useProject';
import apiClient, { Document } from '@/lib/api';
import { Search, Upload } from 'lucide-react';
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

  const handleMultipleUpload = async (files: File[]) => {
    try {
      setUploadError(null);
      console.log('DocumentsPage: Calling uploadDocument for multiple files...', files.length);
      
      const results = await Promise.allSettled(
        files.map(file => uploadDocument(file))
      );
      
      const failed = results.filter(result => result.status === 'rejected');
      if (failed.length > 0) {
        setUploadError(`${failed.length}/${files.length} file upload thất bại`);
      } else {
        console.log('DocumentsPage: All uploads successful, closing modal');
        setShowUploadModal(false);
      }
    } catch (err) {
      console.error('DocumentsPage: Multiple upload failed:', err);
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

  const headerActions = (
    <div className="flex items-center gap-2">
      <HeaderButton 
        variant="search"
        isSearchButton={true}
        icon={<Search className="w-4 h-4" />}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm tài liệu..."
        onClick={() => {}}
      >
        Tìm kiếm
      </HeaderButton>
      
      <HeaderButton 
        variant="primary" 
        icon={<Upload className="w-4 h-4" />}
        onClick={() => setShowUploadModal(true)} 
        disabled={uploading}
      >
        {uploading ? 'Đang upload...' : 'Upload tài liệu'}
      </HeaderButton>
    </div>
  );

  return (
    <MainLayout
      headerTitle="Tài liệu"
      headerSubtitle={`Quản lý tài liệu trong project "${project.name}"`}
      headerActions={headerActions}
    >
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
      <div className="flex-1 flex min-h-0 h-full">{/* Added h-full for proper height */}
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
                />
              )}
              
              {/* Preview khi chưa chọn tài liệu */}
              {!selectedDocument && !isPanelCollapsed && (
                <div className="w-1/2 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex items-center justify-center h-full min-h-full">
                  <div className="text-center max-w-lg px-6 py-8 flex-shrink-0">
                    {/* Instructions */}
                    <div className="w-20 h-20 mx-auto mb-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm">
                      <FileIcon fileType="txt" size="xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Chọn tài liệu để xem trước
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      Click vào một tài liệu bên trái để xem nội dung chi tiết.
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
            <FileUploadZone 
              onUpload={handleUpload} 
              onMultipleUpload={handleMultipleUpload}
              isUploading={uploading} 
              allowMultiple={true}
            />
            
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
      </MainLayout>
    );
}