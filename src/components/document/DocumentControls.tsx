import { FilterState } from '@/hooks/useDocumentFilters';
import { cn } from '@/lib/utils';
import { Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface DocumentControlsProps {
  // Filters
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalDocuments: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export default function DocumentControls({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  currentPage,
  totalPages,
  totalDocuments,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: DocumentControlsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close popup logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current && !settingsRef.current.contains(event.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {/* Pagination Simple Controls (Prev/Next) */}
      <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
         <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
         </button>
         <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
            {currentPage} / {Math.max(1, totalPages)}
         </span>
         <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
         </button>
      </div>

      {/* Filter Settings Button with Popover */}
      <div className="relative">
        <button
          ref={triggerRef}
          onClick={() => setShowSettings(!showSettings)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            showSettings || hasActiveFilters
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          )}
        >
          <Settings className="w-4 h-4" />
          <span>Bộ lọc</span>
          {hasActiveFilters && (
            <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
          )}
        </button>

        {showSettings && (
          <div 
            ref={settingsRef}
            className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          >
             <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Cài đặt hiển thị</h3>
                  {hasActiveFilters && (
                    <button onClick={onClearFilters} className="text-xs text-red-500 hover:text-red-600">
                      Xóa bộ lọc
                    </button>
                  )}
                </div>

                {/* Items per page */}
                <div className="space-y-2">
                   <label className="text-xs font-medium text-gray-500 uppercase">Số dòng / trang</label>
                   <div className="grid grid-cols-4 gap-2">
                      {[5, 10, 20, 50].map(n => (
                        <button
                          key={n}
                          onClick={() => onItemsPerPageChange(n)}
                          className={cn(
                            "px-2 py-1 text-xs rounded border transition-colors",
                            itemsPerPage === n 
                              ? "bg-blue-500 text-white border-blue-500" 
                              : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                          )}
                        >
                          {n}
                        </button>
                      ))}
                   </div>
                </div>

                {/* File Type */}
                <div className="space-y-2">
                   <label className="text-xs font-medium text-gray-500 uppercase">Loại file</label>
                   <select 
                      value={filters.fileType}
                      onChange={(e) => onFilterChange('fileType', e.target.value)}
                      className="w-full text-sm p-2 rounded border border-gray-200 dark:border-gray-600 bg-transparent"
                    >
                      <option value="">Tất cả</option>
                      <option value="pdf">PDF</option>
                      <option value="docx">Word</option>
                      <option value="xlsx">Excel</option>
                      <option value="txt">Text</option>
                      <option value="image">Image</option>
                   </select>
                </div>
                 
                 {/* Sort */}
                 <div className="space-y-2">
                   <label className="text-xs font-medium text-gray-500 uppercase">Sắp xếp</label>
                   <div className="flex gap-2">
                      <select 
                        value={filters.sortBy}
                        onChange={(e) => onFilterChange('sortBy', e.target.value)}
                        className="flex-1 text-sm p-2 rounded border border-gray-200 dark:border-gray-600 bg-transparent"
                      >
                        <option value="uploadedAt">Ngày upload</option>
                        <option value="name">Tên</option>
                        <option value="size">Kích thước</option>
                      </select>
                      <button 
                        onClick={() => onFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-2 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50"
                      >
                        {filters.sortOrder === 'asc' ? '↑' : '↓'}
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
