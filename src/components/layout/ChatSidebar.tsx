"use client";

import { useChats } from '@/contexts/ChatContext';
import { chatsApi } from '@/lib/api';
import { ChatSession } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ChatListItem from '../chat/ChatListItem';
import { Button, Modal, ModalFooter, Toast } from '../ui';

// Helper function to group chats
function groupChatsByTime(chats: ChatSession[]) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recent: ChatSession[] = [];
  const older: ChatSession[] = [];

  chats.forEach((chat) => {
    const chatDate = new Date(chat.updatedAt);
    if (chatDate >= sevenDaysAgo) {
      recent.push(chat);
    } else {
      older.push(chat);
    }
  });

  return { recent, older };
}

export default function ChatSidebar() {
  const pathname = usePathname();
  const { chats, loading, updateChat, removeChat } = useChats();
  const [displayLimit, setDisplayLimit] = useState(20);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    chatId: string | null;
  }>({
    isOpen: false,
    chatId: null,
  });

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({
    visible: false,
    message: "",
    type: "success",
  });
  
  const searchParams = useSearchParams();
  const currentProjectId = searchParams.get("project");

  const handleDeleteChat = async () => {
    if (!deleteModal.chatId) return;

    try {
      const response = await chatsApi.deleteChat(deleteModal.chatId);
      if (response.success) {
        removeChat(deleteModal.chatId);
        setDeleteModal({ isOpen: false, chatId: null });

        // Show success toast
        setToast({
          visible: true,
          message: "Đã xóa cuộc trò chuyện thành công",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);

      // Show error toast
      setToast({
        visible: true,
        message: "Không thể xóa cuộc trò chuyện. Vui lòng thử lại.",
        type: "error",
      });
    }
  };

  // Filter chats by search term
  const filteredChats = searchTerm
    ? chats.filter((chat) =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : chats;

  const { recent, older } = groupChatsByTime(
    filteredChats.slice(0, displayLimit)
  );
  const hasMore = filteredChats.length > displayLimit;

  return (
    <>
      <div className="w-64 h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Chat với AI
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Quản lý cuộc trò chuyện
          </p>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Link
            href={
              currentProjectId
                ? `/chat?project=${currentProjectId}`
                : "/chat"
            }
          >
            <button className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 text-white hover:from-violet-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:shadow-violet-500/20 transform hover:scale-[1.02] border border-white/10 backdrop-blur-sm relative overflow-hidden">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400/15 via-purple-400/15 to-indigo-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Icon consistent with nav items */}
              <svg
                className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:rotate-90 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>

              {/* Text consistent with nav items */}
              <span className="relative z-10 font-medium">
                Tạo Chat mới
              </span>

              {/* Subtle sparkle effects */}
              <div className="absolute top-1.5 right-2 w-0.5 h-0.5 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping delay-0"></div>
              <div className="absolute bottom-1.5 right-3 w-1 h-1 bg-yellow-200/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse delay-200"></div>
            </button>
          </Link>
        </div>

        {/* Chat History Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-3">
            <button
              onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <span>Lịch sử chat</span>
              <svg
                className={cn(
                  "w-4 h-4 transition-transform",
                  isHistoryCollapsed && "-rotate-90"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {!isHistoryCollapsed && (
              <>
                {/* Search Input */}
                <div className="py-2">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-2 w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label="Xóa tìm kiếm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {loading ? (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Đang tải...
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm ? "Không tìm thấy" : "Chưa có chat nào"}
                  </div>
                ) : (
                  <div className="space-y-4 mt-2">
                    {/* Recent Chats */}
                    {recent.length > 0 && (
                      <div>
                        <h4 className="px-3 mb-1 text-xs font-medium text-gray-400 dark:text-gray-500">
                          Gần đây
                        </h4>
                        <div className="space-y-0.5">
                          {recent.map((chat) => {
                            const isActive = pathname === `/chat/${chat.id}`;

                            return (
                              <ChatListItem
                                key={chat.id}
                                chat={chat}
                                isActive={isActive}
                                onUpdate={updateChat}
                                onDelete={(chatId) =>
                                  setDeleteModal({ isOpen: true, chatId })
                                }
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Older Chats */}
                    {older.length > 0 && (
                      <div>
                        <h4 className="px-3 mb-1 text-xs font-medium text-gray-400 dark:text-gray-500">
                          Trước đây
                        </h4>
                        <div className="space-y-0.5">
                          {older.map((chat) => {
                            const isActive = pathname === `/chat/${chat.id}`;

                            return (
                              <ChatListItem
                                key={chat.id}
                                chat={chat}
                                isActive={isActive}
                                onUpdate={updateChat}
                                onDelete={(chatId) =>
                                  setDeleteModal({ isOpen: true, chatId })
                                }
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Load More Button */}
                    {hasMore && (
                      <div>
                        <button
                          onClick={() => setDisplayLimit((prev) => prev + 20)}
                          className="w-full px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          Tải thêm...
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(209 213 219 / 0.5);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(156 163 175 / 0.7);
        }

        :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(75 85 99 / 0.5);
        }

        :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(107 114 128 / 0.7);
        }
      `}</style>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, chatId: null })}
        title="Xác nhận xóa"
        size="sm"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Hành động này không thể
          hoàn tác.
        </p>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => setDeleteModal({ isOpen: false, chatId: null })}
          >
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteChat}>
            Xóa
          </Button>
        </ModalFooter>
      </Modal>

      {/* Toast Notification */}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={toast.visible}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
    </>
  );
}
