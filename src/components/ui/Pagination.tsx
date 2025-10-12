'use client';

import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  totalItems: number;
  className?: string;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  className
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn(
      'flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700',
      className
    )}>
      {/* Count info */}
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span>Hiển thị {startItem}-{endItem} của {totalItems.toLocaleString()} tài liệu</span>
        
        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <span>Hiển thị</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            aria-label="Số tài liệu mỗi trang"
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {ITEMS_PER_PAGE_OPTIONS.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span>mỗi trang</span>
        </div>
      </div>

      {/* Simple pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              'px-2 py-1 text-sm rounded transition-colors',
              currentPage === 1
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            ←
          </button>

          {/* Current page info */}
          <div className="flex items-center gap-1 px-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Trang</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {currentPage}
            </span>
            <span>của</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {totalPages}
            </span>
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              'px-2 py-1 text-sm rounded transition-colors',
              currentPage === totalPages
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}