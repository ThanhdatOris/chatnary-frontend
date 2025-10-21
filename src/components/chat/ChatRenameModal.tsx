'use client';

import { chatsApi } from '@/lib/api';
import { ChatSession } from '@/lib/types';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, ModalFooter } from '../ui';

interface ChatRenameModalProps {
  isOpen: boolean;
  chat: ChatSession | null;
  onClose: () => void;
  onUpdate: (updatedChat: ChatSession) => void;
}

export default function ChatRenameModal({ isOpen, chat, onClose, onUpdate }: ChatRenameModalProps) {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && chat) {
      setTitle(chat.title);
      setError('');
      // Focus input after modal opens
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 100);
    }
  }, [isOpen, chat]);

  const handleSave = async () => {
    if (!chat || !title.trim()) {
      setError('Tên chat không được để trống');
      return;
    }

    if (title.trim() === chat.title) {
      onClose();
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await chatsApi.updateChat(chat.id, { title: title.trim() });
      if (response.success && response.data) {
        onUpdate(response.data);
        onClose();
      } else {
        setError(response.error || 'Có lỗi xảy ra khi cập nhật tên chat');
      }
    } catch (error) {
      console.error('Error updating chat title:', error);
      setError('Có lỗi xảy ra khi cập nhật tên chat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  if (!chat) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đổi tên cuộc trò chuyện">
      <div className="space-y-4">
        <div>
          <label htmlFor="chat-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tên cuộc trò chuyện
          </label>
          <input
            ref={inputRef}
            id="chat-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50"
            placeholder="Nhập tên cuộc trò chuyện..."
            maxLength={100}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      </div>
      
      <ModalFooter>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}