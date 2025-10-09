'use client';

import MainLayout from '@/components/layout/MainLayout';
import { Button, Card, Input, Loading, Modal, ModalFooter } from '@/components/ui';
import { chatsApi } from '@/lib/api';
import { ChatSession } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HistoryPage() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; chatId: string | null }>({
    isOpen: false,
    chatId: null,
  });

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const response = await chatsApi.getChats();
      
      if (response.success && response.data) {
        setChats(response.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.chatId) return;

    try {
      const response = await chatsApi.deleteChat(deleteModal.chatId);
      
      if (response.success) {
        setChats(prev => prev.filter(chat => chat.id !== deleteModal.chatId));
        setDeleteModal({ isOpen: false, chatId: null });
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const filteredChats = searchTerm
    ? chats.filter(chat =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : chats;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading size="lg" text="Đang tải lịch sử..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Lịch sử trò chuyện
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Xem lại các cuộc trò chuyện trước đây
            </p>
          </div>
          <Button onClick={() => router.push('/chat')}>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Chat mới
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <Input
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Chat List */}
        {filteredChats.length === 0 ? (
          <Card variant="bordered" className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có cuộc trò chuyện nào'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Bắt đầu cuộc trò chuyện đầu tiên của bạn'}
            </p>
            {!searchTerm && (
              <Button onClick={() => router.push('/chat')}>
                Tạo chat mới
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredChats.map((chat) => (
              <Card
                key={chat.id}
                variant="bordered"
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => router.push(`/chat/${chat.id}`)}
                        className="font-semibold text-gray-900 dark:text-gray-100 mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {chat.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatDate(chat.updatedAt)}</span>
                        <span>•</span>
                        <span>{chat.messageCount} tin nhắn</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, chatId: chat.id })}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Documents */}
                  {chat.documents && chat.documents.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {chat.documents.map((doc) => (
                        <span
                          key={doc.id}
                          className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                        >
                          📄 {doc.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Last Message Preview */}
                  {chat.lastMessage && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {chat.lastMessage.content}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/chat/${chat.id}`)}
                      className="w-full"
                    >
                      Tiếp tục trò chuyện
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, chatId: null })}
        title="Xác nhận xóa"
        size="sm"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Hành động này không thể hoàn tác.
        </p>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => setDeleteModal({ isOpen: false, chatId: null })}
          >
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </ModalFooter>
      </Modal>
    </MainLayout>
  );
}

