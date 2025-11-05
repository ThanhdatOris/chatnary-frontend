'use client';

import { useChats } from '@/contexts/ChatContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { chatsApi } from '@/lib/api';
import { ChatSession } from '@/lib/types';
import { cn } from '@/lib/utils';
import { BarChart3, FileText, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatListItem from '../chat/ChatListItem';
import { Button, Modal, ModalFooter, Toast } from '../ui';
import ThemeToggle from '../ui/ThemeToggle';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// Function to generate navigation items with project context
const getNavSections = (projectId?: string): NavSection[] => [
  {
    title: '',
    items: [
      {
        name: 'Dashboard',
        href: projectId ? `/dashboard?project=${projectId}` : '/dashboard',
        icon: <BarChart3 className="w-5 h-5" />,
      },
      {
        name: 'Tài liệu',
        href: projectId ? `/documents?project=${projectId}` : '/documents',
        icon: <FileText className="w-5 h-5" />,
      },
      {
        name: 'Cài đặt',
        href: projectId ? `/settings?project=${projectId}` : '/settings',
        icon: <Settings className="w-5 h-5" />,
      },
    ],
  },
];

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

export default function Sidebar() {
  const pathname = usePathname();
  const { chats, loading, updateChat, removeChat } = useChats();
  const { sidebarWidth, setSidebarWidth, isCollapsed, setIsCollapsed } = useSidebar();
  const [displayLimit, setDisplayLimit] = useState(20);
  const [isResizing, setIsResizing] = useState(false);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; chatId: string | null }>({
    isOpen: false,
    chatId: null,
  });
  
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
    visible: false,
    message: '',
    type: 'success'
  });
  const searchParams = useSearchParams();
  const currentProjectId = searchParams.get('project');
  
  // Get navigation sections with current project context
  const navSections = getNavSections(currentProjectId || undefined);

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
        
        // Show success toast
        setToast({
          visible: true,
          message: 'Đã xóa cuộc trò chuyện thành công',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      
      // Show error toast
      setToast({
        visible: true,
        message: 'Không thể xóa cuộc trò chuyện. Vui lòng thử lại.',
        type: 'error'
      });
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
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                  <img 
                    src="/logo-192.png" 
                    alt="Chatnary Logo" 
                    className="w-8 h-8 object-contain"
                  />
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
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M11.28 9.53L8.81 12l2.47 2.47a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 111.06 1.06z"/>
                  <path fillRule="evenodd" d="M3.75 2A1.75 1.75 0 002 3.75v16.5c0 .966.784 1.75 1.75 1.75h16.5A1.75 1.75 0 0022 20.25V3.75A1.75 1.75 0 0020.25 2H3.75zM3.5 3.75a.25.25 0 01.25-.25H15v17H3.75a.25.25 0 01-.25-.25V3.75zm13 16.75v-17h3.75a.25.25 0 01.25.25v16.5a.25.25 0 01-.25.25H16.5z"/>
                </svg>
              </button>
            </>
          ) : (
            <div className="w-full flex justify-center group">
              <button
                onClick={() => setIsCollapsed(false)}
                className="relative w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
                title="Mở rộng sidebar"
              >
                {/* Logo luôn hiển thị */}
                <div className="w-6 h-6 rounded overflow-hidden flex items-center justify-center">
                  <img 
                    src="/logo-192.png" 
                    alt="Chatnary Logo" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                
                {/* Icon expand chỉ hiện khi hover */}
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.22 14.47L9.69 12 7.22 9.53a.75.75 0 111.06-1.06l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 01-1.06-1.06z"/>
                    <path fillRule="evenodd" d="M3.75 2A1.75 1.75 0 002 3.75v16.5c0 .966.784 1.75 1.75 1.75h16.5A1.75 1.75 0 0022 20.25V3.75A1.75 1.75 0 0020.25 2H3.75zM3.5 3.75a.25.25 0 01.25-.25H15v17H3.75a.25.25 0 01-.25-.25V3.75zm13 16.75v-17h3.75a.25.25 0 01.25.25v16.5a.25.25 0 01-.25.25H16.5z"/>
                  </svg>
                </div>
              </button>
            </div>
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
                      // Extract path from href (remove query string)
                      const itemPath = item.href.split('?')[0];
                      // Check if current pathname matches the item path
                      const isActive = pathname === itemPath || pathname?.startsWith(itemPath + '/');
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                            isActive
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
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
                  // Extract path from href (remove query string)
                  const itemPath = item.href.split('?')[0];
                  // Check if current pathname matches the item path
                  const isActive = pathname === itemPath || pathname?.startsWith(itemPath + '/');
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center justify-center p-2.5 rounded-lg transition-colors',
                        isActive
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      )}
                      title={item.name}
                    >
                      {item.icon}
                    </Link>
                  );
                })}
                
                {/* New Chat Button - Consistent collapsed mode */}
                <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Link href={currentProjectId ? `/chat?project=${currentProjectId}` : '/chat'}>
                    <button 
                      className="group relative w-full flex items-center justify-center p-2.5 rounded-lg bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 text-white hover:from-violet-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-violet-500/20 transform hover:scale-105 border border-white/10 overflow-hidden"
                      title="Tạo Chat mới"
                    >
                      {/* Background pulse effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-400/15 via-purple-400/15 to-indigo-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Icon consistent size */}
                      <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      
                      {/* Subtle sparkle effects */}
                      <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping delay-0"></div>
                      <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-yellow-200/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse delay-200"></div>
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* New Chat Button - Consistent with nav items */}
          {!isCollapsed && (
            <div className="mt-6 px-3">
              <Link href={currentProjectId ? `/chat?project=${currentProjectId}` : '/chat'}>
                <button className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 text-white hover:from-violet-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:shadow-violet-500/20 transform hover:scale-[1.02] border border-white/10 backdrop-blur-sm relative overflow-hidden">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400/15 via-purple-400/15 to-indigo-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Icon consistent with nav items */}
                  <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:rotate-90 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
                        aria-label="Xóa tìm kiếm"
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
                              <ChatListItem
                                key={chat.id}
                                chat={chat}
                                isActive={isActive}
                                onUpdate={updateChat}
                                onDelete={(chatId) => setDeleteModal({ isOpen: true, chatId })}
                              />
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
                              <ChatListItem
                                key={chat.id}
                                chat={chat}
                                isActive={isActive}
                                onUpdate={updateChat}
                                onDelete={(chatId) => setDeleteModal({ isOpen: true, chatId })}
                              />
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
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Collapsed Footer - Icons Only */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center gap-3">
              <ThemeToggle />
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
