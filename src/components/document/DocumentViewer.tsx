'use client';

import { Button } from '@/components/ui';
import { Document } from '@/lib/types';
import { formatDate, formatFileSize } from '@/lib/utils';
import { useState } from 'react';

interface DocumentViewerProps {
  document: Document | null;
  onClose: () => void;
}

export default function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!document) {
    return (
      <div className="w-1/2 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium">Chọn tài liệu để xem</p>
          <p className="text-sm mt-1">Click vào một tài liệu bên trái để xem nội dung</p>
        </div>
      </div>
    );
  }

  const getDocumentPreviewUrl = (doc: Document) => {
    // This would typically be an API endpoint that serves the document content
    return `/api/documents/${doc.id}/preview`;
  };

  const renderDocumentContent = () => {
    const fileType = document.type.toLowerCase();

    if (fileType.includes('pdf')) {
      return (
        <iframe
          src={getDocumentPreviewUrl(document)}
          className="w-full h-full border-0"
          title={`Preview of ${document.name}`}
        />
      );
    }

    if (fileType.includes('image')) {
      return (
        <div className="flex items-center justify-center h-full">
          <img
            src={getDocumentPreviewUrl(document)}
            alt={document.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    if (fileType.includes('text') || fileType.includes('markdown')) {
      return (
        <div className="p-6 h-full overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
            {/* This would be fetched from API */}
            Đang tải nội dung tài liệu...
          </pre>
        </div>
      );
    }

    // For other file types, show a download/info view
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-2-2m2 2l2-2m-2 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Không thể xem trước
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Loại tài liệu này không hỗ trợ xem trước
          </p>
          <Button variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-2-2m2 2l2-2m-2 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tải xuống
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-1/2 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
            {document.name}
          </h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <span>{formatFileSize(document.size)}</span>
            <span>•</span>
            <span>{formatDate(document.uploadedAt)}</span>
            <span>•</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              document.status === 'completed'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : document.status === 'processing'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {document.status === 'completed' ? 'Đã xử lý' : 
               document.status === 'processing' ? 'Đang xử lý' : 'Lỗi'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden document-viewer-content">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
            </div>
          </div>
        ) : (
          renderDocumentContent()
        )}
      </div>
    </div>
  );
}