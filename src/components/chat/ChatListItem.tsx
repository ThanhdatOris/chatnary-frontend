'use client';

import { ChatSession } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { useState } from 'react';
import ChatRenameModal from './ChatRenameModal';

interface ChatListItemProps {
  chat: ChatSession;
  isActive: boolean;
  onUpdate: (updatedChat: ChatSession) => void;
  onDelete: (chatId: string) => void;
}

export default function ChatListItem({ chat, isActive, onUpdate, onDelete }: ChatListItemProps) {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsRenameModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onDelete(chat.id);
  };

  const handleUpdate = (updatedChat: ChatSession) => {
    onUpdate(updatedChat);
  };

  const content = (
    <>
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      
      <span className="truncate flex-1">{chat.title}</span>
      
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
        <button
          onClick={handleEditClick}
          className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all"
          aria-label="Sửa tên chat"
        >
          <svg className="w-3.5 h-3.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
          aria-label="Xóa chat"
        >
          <svg className="w-3.5 h-3.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </>
  );

  const className = cn(
    'group flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm',
    isActive
      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
  );

  return (
    <>
      <Link href={`/chat/${chat.id}`} className={className}>
        {content}
      </Link>
      
      <ChatRenameModal
        isOpen={isRenameModalOpen}
        chat={chat}
        onClose={() => setIsRenameModalOpen(false)}
        onUpdate={handleUpdate}
      />
    </>
  );
}