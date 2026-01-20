"use client";

import DocumentControls from "@/components/document/DocumentControls";
import DocumentList from "@/components/document/DocumentList";
import DocumentViewer from "@/components/document/DocumentViewer";
import FileUploadZone from "@/components/document/FileUploadZone";
import MainLayout from "@/components/layout/MainLayout";
import { Button, FileIcon, Loading, Modal } from "@/components/ui";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useDocumentFilters } from "@/hooks/useDocumentFilters";
import useDocuments from "@/hooks/useDocuments";
import { useProject } from "@/hooks/useProject";
import apiClient from "@/lib/api";
import { type Document } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PanelRightClose, PanelRightOpen, Search, Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Wrapper component with Suspense boundary for useSearchParams
export default function DocumentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <Loading size="lg" />
        </div>
      }
    >
      <DocumentsPageContent />
    </Suspense>
  );
}

function DocumentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");
  const { project, isLoading: projectLoading } = useProject();
  const { setProjectName, setProjectColor } = useBreadcrumb();
  
  // View Scope State
  const [viewScope, setViewScope] = useState<'project' | 'all'>('project');
  
  const { 
    documents, 
    loading, 
    error, 
    uploading, 
    uploadDocument, 
    deleteDocument, 
    refreshDocuments 
  } = useDocuments({ projectId: projectId || undefined });

  // Use the new hook for filtering/sorting/pagination
  const [searchTerm, setSearchTerm] = useState('');
  const {
    paginatedResult,
    filters,
    currentPage,
    itemsPerPage, 
    handlePageChange,
    handleFilterChange,
    clearFilters,
    hasActiveFilters,
    setItemsPerPage
  } = useDocumentFilters(documents, searchTerm);

  // Set project name and color for breadcrumb when project loads
  useEffect(() => {
    if (project?.name) {
      setProjectName(project.name);
    }
    if (project?.color) {
      setProjectColor(project.color);
    }
  }, [project, setProjectName, setProjectColor]);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Auto-select first project if no project is specified
  useEffect(() => {
    const loadProjects = async () => {
      if (!projectId) {
        try {
          setLoadingProjects(true);
          const response = await apiClient.getProjects();

          if (response.success && response.data && response.data.length > 0) {
            // Auto-redirect to first project
            const firstProject = response.data[0];
            router.push(`/documents?project=${firstProject.id}`);
          } else {
            // No projects available, redirect to home
            router.push("/");
          }
        } catch (err) {
          console.error("Failed to load projects:", err);
          router.push("/");
        } finally {
          setLoadingProjects(false);
        }
      }
    };

    loadProjects();
  }, [projectId, router]);

  const handleUpload = async (file: File) => {
    try {
      setUploadError(null);
      await uploadDocument(file);
      setShowUploadModal(false);
    } catch (err) {
      console.error("DocumentsPage: Upload failed:", err);
      setUploadError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi upload file"
      );
    }
  };

  const handleMultipleUpload = async (files: File[]) => {
    try {
      setUploadError(null);
      const results = await Promise.allSettled(
        files.map((file) => uploadDocument(file))
      );

      const failed = results.filter((result) => result.status === "rejected");
      if (failed.length > 0) {
        setUploadError(`${failed.length}/${files.length} file upload thất bại`);
      } else {
        setShowUploadModal(false);
      }
    } catch (err) {
      console.error("DocumentsPage: Multiple upload failed:", err);
      setUploadError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi upload file"
      );
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id);
      if (selectedDocument?.id === id) {
        setSelectedDocument(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (!projectId || loadingProjects || projectLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loading size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Project không tìm thấy
            </h2>
            <Button onClick={() => router.push("/")}>Quay về trang chủ</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Custom Unified Header
  const customHeader = (
    <div className="px-6 py-4 flex flex-col gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
       <div className="flex items-center justify-between gap-4">
          {/* Left: Title & Count & Scope Toggle */}
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                  Tài liệu
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                  {paginatedResult.pagination.total}
                </span>
             </div>
             
             {/* Scope Toggle */}
             <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg h-9">
                <button 
                  onClick={() => setViewScope('all')} 
                  className={cn(
                    "px-3 text-xs font-medium rounded-md transition-all", 
                    viewScope === 'all' 
                      ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" 
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                >
                  Tất cả
                </button>
                <div className="w-px bg-gray-200 dark:bg-gray-700 my-1 mx-0.5"></div>
                <button 
                  onClick={() => setViewScope('project')} 
                  className={cn(
                    "px-3 text-xs font-medium rounded-md transition-all", 
                    viewScope === 'project' 
                      ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" 
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                >
                  Dự án
                </button>
             </div>
          </div>

          {/* Right: Actions Toolbar */}
          <div className="flex items-center gap-3">
             {/* Search */}
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                   type="text"
                   placeholder="Tìm kiếm..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-64 pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 border focus:border-blue-500 rounded-lg transition-all outline-none"
                />
             </div>
             
             {/* Divider */}
             <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

             {/* Controls (Pagination, Filter) */}
             <DocumentControls 
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                currentPage={currentPage}
                totalPages={paginatedResult.pagination.totalPages}
                totalDocuments={paginatedResult.pagination.total}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={setItemsPerPage}
             />

             {/* Upload Button */}
             <Button 
                onClick={() => setShowUploadModal(true)}
                disabled={uploading}
                className="ml-2 gap-2 shadow-sm"
             >
                <Upload className="w-4 h-4" />
                {uploading ? "Đang upload..." : "Upload"}
             </Button>

             {/* View Toggle (Expand/Collapse Panel) */}
             <div className="border-l border-gray-200 dark:border-gray-700 pl-2 ml-1">
               <button
                  onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isPanelCollapsed 
                      ? "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                      : "text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30" 
                  )}
                  title={isPanelCollapsed ? "Hiển thị chi tiết" : "Ẩn chi tiết"}
                >
                  {isPanelCollapsed ? (
                    <PanelRightOpen className="w-5 h-5" />
                  ) : (
                    <PanelRightClose className="w-5 h-5" />
                  )}
               </button>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <MainLayout
      showHeaderBorder={false} // Disable default border
      headerExtras={customHeader} // Inject custom header
    >
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          <p className="font-medium">Lỗi: {error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshDocuments}
            className="mt-2"
          >
            Thử lại
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex min-h-0 h-full">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loading size="lg" text="Đang tải tài liệu..." />
          </div>
        ) : (
          <>
            {viewScope === 'all' ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50/50 dark:bg-gray-900/50"> 
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Xem tất cả tài liệu</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md text-center mt-2">
                        Tính năng xem tổng hợp tất cả tài liệu từ mọi dự án đang được phát triển. <br/>
                        Vui lòng chọn chế độ <b>&quot;Dự án&quot;</b> để quản lý tài liệu của dự án hiện tại.
                    </p>
                    <Button onClick={() => setViewScope('project')} variant="outline" className="mt-6">
                        Quay lại chế độ Dự án
                    </Button>
                 </div>
            ) : (
             <>
                {/* Document List */}
                <DocumentList
                  documents={paginatedResult.data}
                  selectedDocument={selectedDocument}
                  onSelectDocument={setSelectedDocument}
                  onDeleteDocument={handleDeleteDocument}
                  isPanelCollapsed={isPanelCollapsed}
                />
    
                {/* Document Viewer */}
                {selectedDocument && !isPanelCollapsed && (
                  <DocumentViewer
                    document={selectedDocument}
                    onClose={() => setSelectedDocument(null)}
                  />
                )}
    
                {/* Preview Placeholder */}
                {!selectedDocument && !isPanelCollapsed && (
                  <div className="w-1/2 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex items-center justify-center h-full min-h-full">
                    <div className="text-center max-w-lg px-6 py-8 flex-shrink-0">
                      <div className="w-20 h-20 mx-auto mb-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm">
                        <FileIcon fileType="txt" size="xl" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Chọn tài liệu để xem trước
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        Click vào một tài liệu bên trái để xem nội dung chi tiết.
                      </p>
                    </div>
                  </div>
                )}
             </>
            )}
          </>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        title="Upload tài liệu"
        onClose={() => {
          if (!uploading) {
            setShowUploadModal(false);
            setUploadError(null);
          }
        }}
      >
        <div className="p-6">
          <FileUploadZone
            onUpload={handleUpload}
            onMultipleUpload={handleMultipleUpload}
            isUploading={uploading}
            allowMultiple={true}
          />
          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
            </div>
          )}
        </div>
      </Modal>
    </MainLayout>
  );
}
