'use client';

import { FileIcon } from '@/components/ui';
import { Document } from '@/lib/types';
import { cn, formatDate, formatFileSize } from '@/lib/utils';

interface DocumentListProps {
  documents: Document[];
  selectedDocument: Document | null;
  onSelectDocument: (document: Document) => void;
  onDeleteDocument?: (id: string) => void;
}

export default function DocumentList({ 
  documents, 
  selectedDocument, 
  onSelectDocument,
  onDeleteDocument 
}: DocumentListProps) {
  return (
    <div className="w-1/2 bg-white dark:bg-gray-800 overflow-y-auto document-list-scroll">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Tài liệu ({documents.length})
        </h2>
      </div>

      {/* Document List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {documents.map((document) => (
          <div
            key={document.id}
            className={cn(
              'document-list-item p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700',
              selectedDocument?.id === document.id && 'document-list-item selected bg-blue-50 dark:bg-blue-900/20'
            )}
            onClick={() => onSelectDocument(document)}
          >
            <div className="flex items-start gap-3">
              {/* File Icon */}
              <div className="flex-shrink-0 mt-1">
                <FileIcon fileType={document.type} size="md" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {document.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatFileSize(document.size)}</span>
                      <span>•</span>
                      <span>{formatDate(document.uploadedAt)}</span>
                    </div>
                    
                    {/* Status and Page count in same row */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        document.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : document.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      )}>
                        <div className={cn(
                          'w-1.5 h-1.5 rounded-full mr-1',
                          document.status === 'completed' ? 'bg-green-500' :
                          document.status === 'processing' ? 'bg-yellow-500' : 'bg-red-500'
                        )} />
                        {document.status === 'completed' ? 'Đã xử lý' : 
                         document.status === 'processing' ? 'Đang xử lý' : 'Lỗi'}
                      </span>
                      
                      {/* Page count if available */}
                      {document.pageCount && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {document.pageCount} trang
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-start gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle chat action
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Bắt đầu chat"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle download action  
                      }}
                      className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      title="Tải xuống"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-2-2m2 2l2-2m-2 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>

                    {onDeleteDocument && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDocument(document.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Xóa"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {documents.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium">Chưa có tài liệu nào</p>
            <p className="text-sm mt-1">Upload tài liệu để bắt đầu</p>
          </div>
        </div>
      )}
    </div>
  );
}