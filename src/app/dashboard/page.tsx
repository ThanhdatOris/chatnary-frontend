'use client';

import HeaderButton from '@/components/layout/HeaderButton';
import MainLayout from '@/components/layout/MainLayout';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { useProject } from '@/hooks/useProject';
import { Clock, FileText, FolderOpen, MessageSquare, Upload } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { project, isLoading, error } = useProject();
  const { setProjectName } = useBreadcrumb();

  // Set project name for breadcrumb when project loads
  useEffect(() => {
    if (project?.name) {
      setProjectName(project.name);
    }
  }, [project, setProjectName]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            Đang tải dự án...
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Lỗi Dự án
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-4">
              {error || 'Không thể tải dữ liệu dự án'}
            </p>
            <Link href="/">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                Quay về Trang chính
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const headerActions = (
    <>
      <Link href={`/documents?project=${project.id}`}>
        <HeaderButton
          variant="primary"
          icon={<Upload className="w-4 h-4" />}
        >
          Upload tài liệu
        </HeaderButton>
      </Link>
      <Link href={`/chat?project=${project.id}`}>
        <HeaderButton
          variant="primary"
          icon={<MessageSquare className="w-4 h-4" />}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Tạo Chat mới
        </HeaderButton>
      </Link>
    </>
  );

  return (
    <MainLayout
      headerTitle="Dashboard"
      headerSubtitle={`Project "${project.name}" • ${project.documentsCount} tài liệu • ${project.chatsCount} trò chuyện`}
      headerActions={headerActions}
    >
      {/* Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Chào mừng đến với {project.name}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Bắt đầu bằng cách upload tài liệu hoặc tạo cuộc trò chuyện đầu tiên.
            </p>
          </div>

            {/* Quick Actions Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Link href={`/documents?project=${project.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Upload Tài liệu
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    Thêm PDF, Word, hoặc text files để AI phân tích.
                  </p>
                  <div className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-block">
                    Chọn Tài liệu
                  </div>
                </div>
              </Link>

              <Link href={`/chat?project=${project.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Bắt đầu Chat
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    Tạo cuộc trò chuyện với AI về tài liệu.
                  </p>
                  <div className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-block">
                    Tạo Chat Mới
                  </div>
                </div>
              </Link>
            </div>

            {/* Features Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
                Tính năng nổi bật
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1 text-sm">Tài liệu thông minh</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">AI phân tích nội dung</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1 text-sm">Chat có ngữ cảnh</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Trả lời dựa trên tài liệu</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1 text-sm">Lịch sử đầy đủ</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Theo dõi hoạt động</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </MainLayout>
  );
}
