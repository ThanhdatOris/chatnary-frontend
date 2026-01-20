'use client';

import { FileIcon } from '@/components/ui';
import { type Document } from '@/lib/types';
import { cn, formatDate, formatFileSize } from '@/lib/utils';

interface DocumentListProps {
  documents: Document[]; // Current page documents
  selectedDocument?: Document | null;
  onSelectDocument: (document: Document) => void;
  onDeleteDocument?: (documentId: string) => void;
  isPanelCollapsed?: boolean;
}

export default function DocumentList({ 
  documents, 
  selectedDocument, 
  onSelectDocument,
  onDeleteDocument,
  isPanelCollapsed = false,
}: DocumentListProps) {
  
  // Handle document selection
  const handleSelectDocument = (document: Document) => {
    onSelectDocument(document);
  };

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 flex flex-col document-list-scroll transition-all duration-300 h-full",
      isPanelCollapsed ? "w-full" : "w-1/2"
    )}>
      {/* Document Content */}
      <div className="flex-1 overflow-y-auto">
        {!isPanelCollapsed ? (
          // List View (Panel Open)
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {documents.map((document) => (
              <div
                key={document.id}
                className={cn(
                  'document-list-item p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700',
                  selectedDocument?.id === document.id && 'document-list-item selected bg-blue-50 dark:bg-blue-900/20'
                )}
                onClick={() => handleSelectDocument(document)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <FileIcon fileType={document.mimeType || 'unknown'} size="md" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {document.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatFileSize(document.fileSize || 0)}</span>
                          <span>•</span>
                          <span>{formatDate(document.createdAt)}</span>
                          <span>•</span>
                          <span className={cn(
                            'px-2 py-1 rounded-full',
                            document.status === 'processed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : document.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          )}>
                            {document.status === 'processed' ? 'Đã xử lý' : 
                             document.status === 'processing' ? 'Đang xử lý' : 'Lỗi'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-start gap-1 ml-2">
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
            ))}
          </div>
        ) : (
          // Grid View (Panel Collapsed)
          <div className="p-4">
            <div className={cn(
              "grid gap-4",
              "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
            )}>
              {documents.map((document) => (
                <div
                  key={document.id}
                  className={cn(
                    'cursor-pointer border rounded-lg p-4 transition-all duration-200 hover:shadow-md group',
                    selectedDocument?.id === document.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                  onClick={() => handleSelectDocument(document)}
                >
                  <div className="flex justify-center mb-3">
                    <FileIcon fileType={document.mimeType || 'unknown'} size="lg" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                      {document.name}
                    </h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <div>{formatFileSize(document.fileSize || 0)}</div>
                      <div>{formatDate(document.createdAt)}</div>
                    </div>
                    <span className={cn(
                        'inline-block px-2 py-1 text-xs rounded-full',
                        document.status === 'processed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : document.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      )}>
                      {document.status === 'processed' ? 'Đã xử lý' :
                       document.status === 'processing' ? 'Đang xử lý' : 'Lỗi'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {documents.length === 0 && (
          <div className="flex items-center justify-center h-64">
             <div className="text-center text-gray-500 dark:text-gray-400">
              <p>Không có tài liệu nào trong trang này</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}