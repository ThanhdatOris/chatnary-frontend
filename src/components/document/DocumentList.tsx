'use client';

import { FileIcon } from '@/components/ui';
import { Document } from '@/lib/types';
import { cn, formatDate, formatFileSize, paginateArray } from '@/lib/utils';
import { useMemo, useState, useEffect, useRef } from 'react';

interface DocumentListProps {
  documents: Document[];
  selectedDocument: Document | null;
  onSelectDocument: (document: Document) => void;
  onDeleteDocument?: (id: string) => void;
  totalDocuments: number; // Fixed count for display
}

export default function DocumentList({ 
  documents, 
  selectedDocument, 
  onSelectDocument,
  onDeleteDocument,
  totalDocuments 
}: DocumentListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showPaginationSettings, setShowPaginationSettings] = useState(false);
  const [pageInput, setPageInput] = useState('');
  const [filters, setFilters] = useState({
    fileType: '',
    dateRange: '',
    status: '',
    sortBy: 'uploadedAt',
    sortOrder: 'desc' as 'asc' | 'desc'
  });
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowPaginationSettings(false);
      }
    };

    if (showPaginationSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPaginationSettings]);

  // Paginate documents
  const paginatedResult = useMemo(() => {
    return paginateArray(documents, {
      page: currentPage,
      limit: itemsPerPage,
      total: totalDocuments
    });
  }, [documents, currentPage, itemsPerPage, totalDocuments]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handlePageInputChange = (value: string) => {
    const pageNum = parseInt(value);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= paginatedResult.pagination.totalPages) {
      setCurrentPage(pageNum);
      setPageInput('');
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <div className="w-1/2 bg-white dark:bg-gray-800 flex flex-col document-list-scroll">
      {/* Header with Pagination */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Tài liệu ({totalDocuments.toLocaleString()})
          </h2>
          
          {/* Pagination in header */}
          {totalDocuments > 0 && (
            <div className="flex items-center gap-3">
              {/* Settings button */}
              <button
                onClick={() => setShowPaginationSettings(!showPaginationSettings)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
                title="Cài đặt phân trang"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                </svg>
                
                {/* Settings popup */}
                {showPaginationSettings && (
                  <div 
                    ref={settingsRef}
                    className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Cài đặt & Bộ lọc
                        </h3>
                        <button
                          onClick={() => setShowPaginationSettings(false)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Đóng"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Pagination Settings */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Số tài liệu mỗi trang
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {[5, 10, 20, 50].map(option => (
                              <button
                                key={option}
                                onClick={() => {
                                  handleItemsPerPageChange(option);
                                }}
                                className={cn(
                                  'px-3 py-2 text-sm rounded-md border transition-colors',
                                  itemsPerPage === option
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                                )}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* File Type Filter */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Loại file
                          </label>
                          <select
                            value={filters.fileType}
                            onChange={(e) => handleFilterChange('fileType', e.target.value)}
                            aria-label="Chọn loại file"
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Tất cả loại file</option>
                            <option value="pdf">PDF</option>
                            <option value="docx">Word Document</option>
                            <option value="xlsx">Excel</option>
                            <option value="pptx">PowerPoint</option>
                            <option value="txt">Text</option>
                            <option value="image">Hình ảnh</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                          </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Trạng thái
                          </label>
                          <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            aria-label="Chọn trạng thái"
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Tất cả trạng thái</option>
                            <option value="completed">Đã xử lý</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="failed">Lỗi</option>
                          </select>
                        </div>

                        {/* Date Range Filter */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Thời gian upload
                          </label>
                          <select
                            value={filters.dateRange}
                            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                            aria-label="Chọn thời gian"
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Tất cả thời gian</option>
                            <option value="today">Hôm nay</option>
                            <option value="week">7 ngày qua</option>
                            <option value="month">30 ngày qua</option>
                            <option value="quarter">3 tháng qua</option>
                            <option value="year">Năm nay</option>
                          </select>
                        </div>

                        {/* Sort Options */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Sắp xếp theo
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={filters.sortBy}
                              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                              aria-label="Sắp xếp theo"
                              className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                              <option value="uploadedAt">Ngày upload</option>
                              <option value="name">Tên file</option>
                              <option value="size">Kích thước</option>
                              <option value="pageCount">Số trang</option>
                            </select>
                            <select
                              value={filters.sortOrder}
                              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                              aria-label="Thứ tự sắp xếp"
                              className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                              <option value="desc">Giảm dần</option>
                              <option value="asc">Tăng dần</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                            <div>Hiển thị: {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalDocuments)} của {totalDocuments.toLocaleString()}</div>
                            <div>Tổng trang: {paginatedResult.pagination.totalPages}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </button>

              {/* Navigation buttons */}
              {paginatedResult.pagination.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  {/* Previous button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      currentPage === 1
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                    title="Trang trước"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Page input and display */}
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      max={paginatedResult.pagination.totalPages}
                      value={pageInput || currentPage}
                      onChange={(e) => setPageInput(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value) {
                          handlePageInputChange(e.target.value);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          handlePageInputChange(e.currentTarget.value);
                        }
                      }}
                      className="w-12 px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      title="Nhập số trang"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      / {paginatedResult.pagination.totalPages}
                    </span>
                  </div>

                  {/* Next button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === paginatedResult.pagination.totalPages}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      currentPage === paginatedResult.pagination.totalPages
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                    title="Trang sau"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {paginatedResult.data.map((document) => (
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
      {paginatedResult.data.length === 0 && (
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
    </div>
  );
}