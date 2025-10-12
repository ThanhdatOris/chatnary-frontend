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
  searchTerm?: string; // Add search term prop
}

export default function DocumentList({ 
  documents, 
  selectedDocument, 
  onSelectDocument,
  onDeleteDocument,
  totalDocuments,
  searchTerm = ''
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
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Don't close if clicking on the filter button itself or inside the popup
      if (
        (settingsRef.current && settingsRef.current.contains(target)) ||
        (filterButtonRef.current && filterButtonRef.current.contains(target))
      ) {
        return;
      }
      
      setShowPaginationSettings(false);
    };

    if (showPaginationSettings) {
      // Add small delay to prevent immediate closing when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPaginationSettings]);

  // Prevent popup from closing when clicking inside
  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle filter button click outside popup
  const handleFilterButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPaginationSettings(!showPaginationSettings);
  };

  // Paginate documents
  const paginatedResult = useMemo(() => {
    // Start with all documents
    let filteredDocuments = [...documents];
    
    // Apply search filter first
    if (searchTerm.trim()) {
      filteredDocuments = filteredDocuments.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by file type
    if (filters.fileType) {
      filteredDocuments = filteredDocuments.filter(doc => 
        doc.type.toLowerCase().includes(filters.fileType.toLowerCase())
      );
    }
    
    // Filter by status
    if (filters.status) {
      filteredDocuments = filteredDocuments.filter(doc => 
        doc.status === filters.status
      );
    }
    
    // Filter by date range
    if (filters.dateRange) {
      const now = new Date();
      const uploadDate = (doc: Document) => new Date(doc.uploadedAt);
      
      filteredDocuments = filteredDocuments.filter(doc => {
        const docDate = uploadDate(doc);
        const diffTime = now.getTime() - docDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (filters.dateRange) {
          case 'today':
            return diffDays <= 1;
          case 'week':
            return diffDays <= 7;
          case 'month':
            return diffDays <= 30;
          case 'year':
            return docDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filteredDocuments.sort((a, b) => {
        let aVal = a[filters.sortBy as keyof Document];
        let bVal = b[filters.sortBy as keyof Document];
        
        // Handle null/undefined values
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return filters.sortOrder === 'asc' ? -1 : 1;
        if (bVal == null) return filters.sortOrder === 'asc' ? 1 : -1;
        
        // Convert to comparable values
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return filters.sortOrder === 'asc' ? comparison : -comparison;
      });
    }
    
    return paginateArray(filteredDocuments, {
      page: currentPage,
      limit: itemsPerPage,
      total: filteredDocuments.length
    });
  }, [documents, currentPage, itemsPerPage, filters, searchTerm]);

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

  const clearFilters = () => {
    setFilters({
      fileType: '',
      dateRange: '',
      status: '',
      sortBy: 'uploadedAt',
      sortOrder: 'desc'
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.fileType || filters.dateRange || filters.status || filters.sortBy !== 'uploadedAt' || filters.sortOrder !== 'desc';

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
              {/* Filter button */}
              <button
                ref={filterButtonRef}
                onClick={handleFilterButtonClick}
                className={cn(
                  'p-2 rounded-lg transition-colors relative',
                  showPaginationSettings
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
                title="Bộ lọc và cài đặt"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                </svg>
                {hasActiveFilters && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
                
                {/* Filter popup */}
                {showPaginationSettings && (
                  <div 
                    ref={settingsRef}
                    onClick={handlePopupClick}
                    className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-md">
                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Cài đặt & Bộ lọc
                          </h3>
                        </div>
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition-colors"
                            title="Xóa bộ lọc"
                          >
                            Xóa bộ lọc
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {/* Pagination Settings Card */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100">
                              Số tài liệu mỗi trang
                            </h4>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {[5, 10, 20, 50].map(option => (
                              <button
                                key={option}
                                onClick={() => handleItemsPerPageChange(option)}
                                className={cn(
                                  'px-3 py-2 text-xs font-medium rounded-md border transition-colors',
                                  itemsPerPage === option
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50'
                                )}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Filters */}
                        <div className="space-y-3">
                          {/* File Type Filter */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <label className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                Loại file
                              </label>
                            </div>
                            <select
                              value={filters.fileType}
                              onChange={(e) => handleFilterChange('fileType', e.target.value)}
                              aria-label="Chọn loại file"
                              className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Tất cả loại file</option>
                              <option value="pdf">PDF</option>
                              <option value="docx">Word</option>
                              <option value="xlsx">Excel</option>
                              <option value="pptx">PowerPoint</option>
                              <option value="txt">Text</option>
                              <option value="image">Hình ảnh</option>
                            </select>
                          </div>

                          {/* Status and Date in same row */}
                          <div className="grid grid-cols-2 gap-3">
                            {/* Status Filter */}
                            <div>
                              <div className="flex items-center gap-1 mb-2">
                                <svg className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <label className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                  Trạng thái
                                </label>
                              </div>
                              <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                aria-label="Chọn trạng thái"
                                className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="">Tất cả</option>
                                <option value="completed">Đã xử lý</option>
                                <option value="processing">Đang xử lý</option>
                                <option value="failed">Lỗi</option>
                              </select>
                            </div>

                            {/* Date Range Filter */}
                            <div>
                              <div className="flex items-center gap-1 mb-2">
                                <svg className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <label className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                  Thời gian
                                </label>
                              </div>
                              <select
                                value={filters.dateRange}
                                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                                aria-label="Chọn thời gian"
                                className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="">Tất cả</option>
                                <option value="today">Hôm nay</option>
                                <option value="week">7 ngày qua</option>
                                <option value="month">30 ngày qua</option>
                                <option value="year">Năm nay</option>
                              </select>
                            </div>
                          </div>

                          {/* Sort Options */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                              </svg>
                              <label className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                Sắp xếp theo
                              </label>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                aria-label="Sắp xếp theo"
                                className="col-span-2 px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                className="px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="desc">Giảm dần</option>
                                <option value="asc">Tăng dần</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        {/* Summary */}
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                            <div>Hiển thị {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, paginatedResult.pagination.total)} của {paginatedResult.pagination.total.toLocaleString()} tài liệu</div>
                            <div>Tổng {paginatedResult.pagination.totalPages} trang</div>
                            {paginatedResult.pagination.total !== totalDocuments && (
                              <div className="text-blue-600 dark:text-blue-400">Đã lọc từ {totalDocuments.toLocaleString()} tài liệu</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </button>

              {/* Navigation buttons - hiển thị khi có tài liệu */}
              {paginatedResult.pagination.total > 0 && (
                <div className="flex items-center gap-2">
                  {/* Previous button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || paginatedResult.pagination.totalPages <= 1}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      (currentPage === 1 || paginatedResult.pagination.totalPages <= 1)
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
                      max={Math.max(1, paginatedResult.pagination.totalPages)}
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
                      disabled={paginatedResult.pagination.totalPages <= 1}
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      / {Math.max(1, paginatedResult.pagination.totalPages)}
                    </span>
                  </div>

                  {/* Next button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === paginatedResult.pagination.totalPages || paginatedResult.pagination.totalPages <= 1}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      (currentPage === paginatedResult.pagination.totalPages || paginatedResult.pagination.totalPages <= 1)
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