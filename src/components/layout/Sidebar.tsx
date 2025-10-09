'use client';

import { useChats } from '@/contexts/ChatContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { chatsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Modal, ModalFooter } from '../ui';
import ThemeToggle from '../ui/ThemeToggle';

interface NavItem {
  name: string;
  href: string;
  icon: JSX.Element;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: '',
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
      {
        name: 'Tài liệu',
        href: '/documents',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
    ],
  },
];

// Helper function to group chats
function groupChatsByTime(chats: any[]) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recent: any[] = [];
  const older: any[] = [];

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

export default function Sidebar() {
  const pathname = usePathname();
  const { chats, loading, removeChat } = useChats();
  const { sidebarWidth, setSidebarWidth, isCollapsed, setIsCollapsed } = useSidebar();
  const [displayLimit, setDisplayLimit] = useState(20);
  const [isResizing, setIsResizing] = useState(false);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; chatId: string | null }>({
    isOpen: false,
    chatId: null,
  });

  useEffect(() => {
    if (isResizing) {
      // Disable text selection globally while resizing
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      
      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 400) {
          setSidebarWidth(newWidth);
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        // Re-enable text selection
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        // Cleanup in case component unmounts during resize
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isResizing, setSidebarWidth]);

  const handleDeleteChat = async () => {
    if (!deleteModal.chatId) return;

    try {
      const response = await chatsApi.deleteChat(deleteModal.chatId);
      if (response.success) {
        removeChat(deleteModal.chatId);
        setDeleteModal({ isOpen: false, chatId: null });
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  // Filter chats by search term
  const filteredChats = searchTerm
    ? chats.filter(chat =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : chats;

  const { recent, older } = groupChatsByTime(filteredChats.slice(0, displayLimit));
  const hasMore = filteredChats.length > displayLimit;
  
  return (
    <>
      <aside 
        className={cn(
          "flex flex-col fixed inset-y-0 left-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
          !isResizing && "transition-[width] duration-200"
        )}
        style={{ width: isCollapsed ? '64px' : `${sidebarWidth}px` }}
      >
        {/* Logo & Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed ? (
            <>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Chatnary
                </span>
              </Link>
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Thu gọn sidebar"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-full flex justify-center p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Mở rộng sidebar"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation Sections - Custom Scrollbar */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
          {!isCollapsed ? (
            <>
              {/* Main Navigation */}
              {navSections.map((section) => (
                <div key={section.title || 'main'}>
                  {section.title && (
                    <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          )}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {/* Collapsed Navigation - Icons Only */}
              <div className="space-y-2">
                {navSections.flatMap(section => section.items).map((item) => {
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center justify-center p-2.5 rounded-lg transition-colors',
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                      title={item.name}
                    >
                      {item.icon}
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* New Chat Button */}
          {!isCollapsed && (
            <div className="mt-6">
              <Link href="/chat">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium shadow-sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Chat mới</span>
                </button>
              </Link>
            </div>
          )}

          {/* Chat History Section */}
          {!isCollapsed && (
            <div className="mt-6">
              <button
                onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span>Lịch sử chat</span>
              <svg
                className={cn(
                  'w-4 h-4 transition-transform',
                  isHistoryCollapsed && '-rotate-90'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {!isHistoryCollapsed && (
              <>
                {/* Search Input */}
                <div className="px-3 py-2">
                  <div className="relative">
                    <svg className="absolute left-3 top-2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {loading ? (
                  <div className="px-6 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Đang tải...
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="px-6 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'Không tìm thấy' : 'Chưa có chat nào'}
                  </div>
                ) : (
                  <div className="space-y-4 mt-2">
                    {/* Recent Chats */}
                    {recent.length > 0 && (
                      <div className="pl-3">
                        <h4 className="px-3 mb-1 text-xs font-medium text-gray-400 dark:text-gray-500">
                          Gần đây
                        </h4>
                        <div className="space-y-0.5">
                          {recent.map((chat) => {
                            const isActive = pathname === `/chat/${chat.id}`;
                            
                            return (
                              <Link
                                key={chat.id}
                                href={`/chat/${chat.id}`}
                                className={cn(
                                  'group flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm',
                                  isActive
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                )}
                              >
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="truncate flex-1">{chat.title}</span>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setDeleteModal({ isOpen: true, chatId: chat.id });
                                    }}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                                >
                                  <svg className="w-3.5 h-3.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Older Chats */}
                    {older.length > 0 && (
                      <div className="pl-3">
                        <h4 className="px-3 mb-1 text-xs font-medium text-gray-400 dark:text-gray-500">
                          Trước đây
                        </h4>
                        <div className="space-y-0.5">
                          {older.map((chat) => {
                            const isActive = pathname === `/chat/${chat.id}`;
                            
                            return (
                              <Link
                                key={chat.id}
                                href={`/chat/${chat.id}`}
                                className={cn(
                                  'group flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm',
                                  isActive
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                )}
                              >
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="truncate flex-1">{chat.title}</span>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setDeleteModal({ isOpen: true, chatId: chat.id });
                                    }}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                                >
                                  <svg className="w-3.5 h-3.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Load More Button */}
                    {hasMore && (
                      <div className="pl-3">
                        <button
                          onClick={() => setDisplayLimit(prev => prev + 20)}
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
          )}
        </nav>
        
        {!isCollapsed ? (
          <>
            {/* Storage Info */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Dung lượng
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    12%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-1.5 rounded-full transition-all"
                    style={{ width: '12%' }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  12 MB / 1 GB
                </p>
              </div>
            </div>

            {/* User Info & Settings */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">N</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      Người dùng Demo
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      demo@chatnary.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <ThemeToggle />
                  <Link href="/settings">
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Collapsed Footer - Icons Only */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center gap-3">
              <ThemeToggle />
              <Link href="/settings">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Cài đặt">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </Link>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center" title="Người dùng Demo">
                <span className="text-white text-sm font-medium">N</span>
              </div>
            </div>
          </>
        )}

        {/* Resize Handle - Hidden when collapsed */}
        {!isCollapsed && (
          <div
          className={cn(
            'absolute right-0 top-0 bottom-0 cursor-col-resize transition-all select-none',
            isResizing 
              ? 'w-1.5 bg-blue-500' 
              : 'w-1 hover:bg-blue-500 hover:w-1.5'
          )}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
          style={{ userSelect: 'none' }}
          />
        )}
      </aside>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
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
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(75 85 99 / 0.5);
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
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
          Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Hành động này không thể hoàn tác.
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
    </>
  );
}
