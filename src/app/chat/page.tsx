'use client';

import MainLayout from '@/components/layout/MainLayout';
import { Button, Card, Loading } from '@/components/ui';
import { useChats } from '@/contexts/ChatContext';
import { chatsApi, documentsApi } from '@/lib/api';
import { Document } from '@/lib/types';
import { getFileIcon } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatPage() {
  const router = useRouter();
  const { addChat } = useChats();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await documentsApi.getDocuments({
        sortBy: 'uploadedAt',
        sortOrder: 'desc',
      });
      
      if (response.success && response.data) {
        const completedDocs = response.data.items.filter(doc => doc.status === 'completed');
        setDocuments(completedDocs);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDoc = (docId: string) => {
    setSelectedDocs(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleCreateChat = async () => {
    if (selectedDocs.length === 0) return;

    setCreating(true);
    try {
      const response = await chatsApi.createChat({
        documentIds: selectedDocs,
        title: 'Chat mới',
      });
      
      if (response.success && response.data) {
        addChat(response.data); // Add to global state
        router.push(`/chat/${response.data.id}`);
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading size="lg" text="Đang tải tài liệu..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Tạo cuộc trò chuyện mới
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Chọn tài liệu bạn muốn trò chuyện
          </p>
        </div>

        {documents.length === 0 ? (
          <Card variant="bordered" className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Chưa có tài liệu nào
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload tài liệu để bắt đầu trò chuyện
            </p>
            <Button onClick={() => router.push('/documents')}>
              Upload tài liệu
            </Button>
          </Card>
        ) : (
          <>
            {/* Document Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  variant="bordered"
                  className={`cursor-pointer transition-all ${
                    selectedDocs.includes(doc.id)
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleToggleDoc(doc.id)}
                >
                  <div className="flex items-start gap-3 p-4">
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => handleToggleDoc(doc.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="text-3xl">{getFileIcon(doc.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {doc.pageCount} trang
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleCreateChat}
                disabled={selectedDocs.length === 0 || creating}
                isLoading={creating}
              >
                {selectedDocs.length === 0
                  ? 'Chọn tài liệu'
                  : `Bắt đầu chat với ${selectedDocs.length} tài liệu`}
              </Button>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

