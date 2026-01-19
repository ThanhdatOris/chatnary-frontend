import { Document } from '@/lib/types';
import { paginateArray } from '@/lib/utils';
import { useMemo, useState } from 'react';

export interface FilterState {
  fileType: string;
  dateRange: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function useDocumentFilters(documents: Document[], initialSearchTerm: string = '') {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<FilterState>({
    fileType: '',
    dateRange: '',
    status: '',
    sortBy: 'uploadedAt',
    sortOrder: 'desc'
  });

  // Calculate paginated result
  const paginatedResult = useMemo(() => {
    // Start with all documents
    let filteredDocuments = [...documents];
    
    // Apply search filter (passed from outside)
    if (initialSearchTerm.trim()) {
      filteredDocuments = filteredDocuments.filter(doc => 
        (doc.name || '').toLowerCase().includes(initialSearchTerm.toLowerCase())
      );
    }
    
    // Filter by file type
    if (filters.fileType) {
      filteredDocuments = filteredDocuments.filter(doc => 
        (doc.mimeType?.toLowerCase() || '').includes(filters.fileType.toLowerCase())
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
      const uploadDate = (doc: Document) => new Date(doc.createdAt);
      
      filteredDocuments = filteredDocuments.filter(doc => {
        const docDate = uploadDate(doc);
        const diffTime = now.getTime() - docDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (filters.dateRange) {
          case 'today': return diffDays <= 1;
          case 'week': return diffDays <= 7;
          case 'month': return diffDays <= 30;
          case 'year': return docDate.getFullYear() === now.getFullYear();
          default: return true;
        }
      });
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filteredDocuments.sort((a, b) => {
        let aVal = a[filters.sortBy as keyof Document];
        let bVal = b[filters.sortBy as keyof Document];
        
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return filters.sortOrder === 'asc' ? -1 : 1;
        if (bVal == null) return filters.sortOrder === 'asc' ? 1 : -1;
        
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
  }, [documents, currentPage, itemsPerPage, filters, initialSearchTerm]);

  // Actions
  const handlePageChange = (page: number) => setCurrentPage(page);
  
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to page 1 when filter changes
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

  const hasActiveFilters = 
    Boolean(filters.fileType || filters.dateRange || filters.status || filters.sortBy !== 'uploadedAt' || filters.sortOrder !== 'desc');

  return {
    setCurrentPage,
    setItemsPerPage,
    paginatedResult,
    filters,
    handlePageChange,
    handleFilterChange,
    clearFilters,
    hasActiveFilters,
    itemsPerPage, 
    currentPage
  };
}
