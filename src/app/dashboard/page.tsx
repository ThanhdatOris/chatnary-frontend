"use client";

import MainLayout from "@/components/layout/MainLayout";
import { Loading } from "@/components/ui";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useProject } from "@/hooks/useProject";
import { USE_MOCK_DATA, getMockProjects } from "@/lib/mockData";
import { Project } from "@/lib/types";
import {
    BookMarked,
    BrainCircuit,
    Calendar,
    Clock,
    FileText,
    Lightbulb,
    MessageSquare,
    NotebookPen,
    Upload,
    Zap
} from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

// Wrapper component with Suspense boundary
export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <Loading size="lg" text="Đang tải..." />
        </div>
      }
    >
      <DashboardPageContent />
    </Suspense>
  );
}

function DashboardPageContent() {
  const { project, projectId } = useProject();
  const { setProjectName, setProjectColor } = useBreadcrumb();
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  // Set breadcrumb for project-specific view
  useEffect(() => {
    if (project?.name) {
      setProjectName(project.name);
    }
    if (project?.color) {
      setProjectColor(project.color);
    }
  }, [project, setProjectName, setProjectColor]);

  // Load all projects for global view
  useEffect(() => {
    if (USE_MOCK_DATA) {
      setAllProjects(getMockProjects());
    }
  }, []);

  // Always show Global Dashboard (with optional project highlight)
  return (
    <MainLayout showProjectStats={false}>
      <div className="h-full overflow-y-auto p-6 space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Xin chào, Người dùng! 👋</h1>
              <p className="text-blue-100 mb-4">
                Bạn đã tham gia từ <span className="font-semibold">15 Tháng 1, 2024</span>
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Hôm nay là {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Project Spotlight - Show when project is selected */}
        {projectId && project && (
          <div 
            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border-2 shadow-md"
            style={{ borderColor: project.color }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${project.color}20` }}
                >
                  <NotebookPen className="w-6 h-6" style={{ color: project.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                      {project.name}
                    </h3>
                    <div 
                      className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                      style={{ 
                        backgroundColor: `${project.color}20`,
                        color: project.color 
                      }}
                    >
                      Đang xem
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{project.documentsCount} tài liệu</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{project.chatsCount} chats</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/documents?project=${project.id}`}>
                  <button className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-xs font-medium">
                    <Upload className="w-3 h-3 inline mr-1" />
                    Tài liệu
                  </button>
                </Link>
                <Link href={`/chat?project=${project.id}`}>
                  <button 
                    className="px-3 py-1.5 text-white rounded-lg hover:opacity-90 transition-opacity text-xs font-medium"
                    style={{ backgroundColor: project.color }}
                  >
                    <MessageSquare className="w-3 h-3 inline mr-1" />
                    Chat
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

          {/* Row 1: Stats Overview - Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <NotebookPen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {allProjects.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Dự án</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {allProjects.reduce((sum, p) => sum + (p.documentsCount || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Tài liệu</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {allProjects.reduce((sum, p) => sum + (p.chatsCount || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Cuộc trò chuyện</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    24h
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Hoạt động gần đây</div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Recent Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Documents */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Tài liệu gần đây
                  </h3>
                  <Link href="/documents">
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Xem tất cả
                    </button>
                  </Link>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        Document {i}.pdf
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Cập nhật {i} giờ trước
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notebooks */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Sổ tay gần đây
                  </h3>
                  <Link href="/notebook">
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Xem tất cả
                    </button>
                  </Link>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {allProjects.slice(0, 3).map((project) => (
                  <Link key={project.id} href={`/notebook?project=${project.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${project.color}20` }}
                      >
                        <NotebookPen
                          className="w-5 h-5"
                          style={{ color: project.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {project.documentsCount} tài liệu
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Quick Actions - Only show when project is selected */}
          {projectId && project && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href={`/quiz?project=${project.id}`}>
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 text-white hover:shadow-lg transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">Quiz</h3>
                  <p className="text-sm text-white/80">Kiểm tra kiến thức</p>
                </div>
              </Link>

              <Link href={`/quiz?project=${project.id}`}>
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white hover:shadow-lg transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">Quick Exam</h3>
                  <p className="text-sm text-white/80">Thi nhanh</p>
                </div>
              </Link>

              <Link href={`/chat?project=${project.id}`}>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white hover:shadow-lg transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">Chat với AI</h3>
                  <p className="text-sm text-white/80">Trò chuyện thông minh</p>
                </div>
              </Link>

              <Link href={`/bookmark?project=${project.id}`}>
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-lg transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookMarked className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">Bookmark</h3>
                  <p className="text-sm text-white/80">Lưu trữ quan trọng</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </MainLayout>
    );
}
