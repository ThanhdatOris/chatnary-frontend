'use client';

import { Button } from '@/components/ui';
import apiClient, { Document } from '@/lib/api';
import { formatDate, formatFileSize } from '@/lib/utils';
import { useState } from 'react';

interface DocumentViewerProps {
  document: Document | null;
  onClose: () => void;
}

export default function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Handle download
  const handleDownload = () => {
    if (document) {
      const downloadUrl = apiClient.getDocumentDownloadUrl(document.id);
      const link = window.document.createElement('a');
      link.href = downloadUrl;
      link.download = document.originalFilename || document.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

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

  const fileType = document.mimeType?.toLowerCase() || '';
  const displayName = document.originalFilename || document.name;

  const canPreview = fileType.includes('pdf') || fileType.includes('image');

  return (
    <div className="w-1/2 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {displayName}
          </h2>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-auto">
        {canPreview ? (
          <div className="p-4">
            {fileType.includes('pdf') && (
              <iframe
                src={apiClient.getDocumentPreviewUrl(document.id)}
                title={`Preview of ${displayName}`}
                className="w-full h-96 border border-gray-200 dark:border-gray-700 rounded"
                onLoad={() => setIsLoading(false)}
              />
            )}
            {fileType.includes('image') && (
              <img
                src={apiClient.getDocumentPreviewUrl(document.id)}
                alt={displayName}
                className="max-w-full h-auto rounded border border-gray-200 dark:border-gray-700"
                onLoad={() => setIsLoading(false)}
              />
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Không thể xem trước
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Định dạng tài liệu này không hỗ trợ xem trước trực tiếp
            </p>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Tải xuống
            </Button>
          </div>
        )}
      </div>

      {/* Document Info */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
          Thông tin tài liệu
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tên file:</span>
            <span className="text-gray-900 dark:text-gray-100 truncate max-w-48" title={displayName}>
              {displayName}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Kích thước:</span>
            <span className="text-gray-900 dark:text-gray-100">
              {formatFileSize(document.fileSize || 0)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Trạng thái:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              document.status === 'processed'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : document.status === 'processing'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : document.status === 'uploading'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {document.status === 'processed' ? 'Đã xử lý' :
               document.status === 'processing' ? 'Đang xử lý' :
               document.status === 'uploading' ? 'Đang upload' : 'Lỗi'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tải lên:</span>
            <span className="text-gray-900 dark:text-gray-100">
              {formatDate(document.createdAt || document.updatedAt || '')}
            </span>
          </div>

          {/* Metadata removed - not available in current Document interface */}
        </div>

        {/* Action Buttons section removed - no more chat button */}
      </div>
    </div>
  );
}