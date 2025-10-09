'use client';

import DocumentCard from '@/components/document/DocumentCard';
import FileUploadZone from '@/components/document/FileUploadZone';
import MainLayout from '@/components/layout/MainLayout';
import { Button, Input, Loading, Modal } from '@/components/ui';
import { chatsApi, documentsApi } from '@/lib/api';
import { Document } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [searchTerm]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await documentsApi.getDocuments({
        search: searchTerm,
        sortBy: 'uploadedAt',
        sortOrder: 'desc',
      });
      
      if (response.success && response.data) {
        setDocuments(response.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await documentsApi.uploadDocument(file);
      
      if (response.success && response.data) {
        setDocuments(prev => [response.data!, ...prev]);
        setShowUploadModal(false);
        // Show success message
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await documentsApi.deleteDocument(id);
      
      if (response.success) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleChat = async (documentId: string) => {
    try {
      const response = await chatsApi.createChat({
        documentIds: [documentId],
        title: 'Chat mới',
      });
      
      if (response.success && response.data) {
        router.push(`/chat/${response.data.id}`);
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const filteredDocuments = searchTerm
    ? documents.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : documents;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Tài liệu
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Quản lý tài liệu của bạn
            </p>
          </div>
          <Button onClick={() => setShowUploadModal(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload tài liệu
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <Input
            placeholder="Tìm kiếm tài liệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Đang tải tài liệu..." />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm ? 'Không tìm thấy tài liệu' : 'Chưa có tài liệu nào'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm
                ? 'Thử tìm kiếm với từ khóa khác'
                : 'Upload tài liệu đầu tiên để bắt đầu'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowUploadModal(true)}>
                Upload tài liệu
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDelete={handleDelete}
                onChat={handleChat}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => !isUploading && setShowUploadModal(false)}
        title="Upload tài liệu"
        size="lg"
      >
        <FileUploadZone onUpload={handleUpload} isUploading={isUploading} />
      </Modal>
    </MainLayout>
  );
}

