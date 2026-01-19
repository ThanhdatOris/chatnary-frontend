'use client';

import HeaderButton from '@/components/layout/HeaderButton';
import MainLayout from '@/components/layout/MainLayout';
import ColorPicker from '@/components/ui/ColorPicker';
import IconPicker from '@/components/ui/IconPicker';
import apiClient from '@/lib/api';
import { USE_MOCK_DATA, createMockProject, deleteMockProject, getMockProjects, simulateDelay, updateMockProject } from '@/lib/mockData';
import { CreateProjectRequest } from '@/lib/types';
import { BookOpen, Clock, Edit, FileText, MessageSquare, Plus, Trash2, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CreateProjectModalProps {
  onClose: () => void;
  onSubmit: (project: any) => void;
}

interface EditProjectModalProps {
  project: any;
  onClose: () => void;
  onSubmit: (project: any) => void;
}

function CreateProjectModal({ onClose, onSubmit }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [selectedIcon, setSelectedIcon] = useState('folder');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isLoading) return;

    setIsLoading(true);
    
    try {
      const projectData: CreateProjectRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        color: selectedColor,
        icon: selectedIcon,
      };

      if (USE_MOCK_DATA) {
        await simulateDelay(500);
        const newProject = createMockProject(projectData);
        onSubmit(newProject);
      } else {
        const response = await apiClient.createProject(projectData);
        
        if (response.error) {
          alert('Lỗi khi tạo dự án: ' + response.error);
          return;
        }

        if (response.data) {
          const newProject = {
            ...response.data,
            updatedAt: response.data.createdAt,
          };
          onSubmit(newProject);
        }
      }
    } catch (error) {
      alert('Lỗi khi tạo dự án: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Tạo Dự án Mới
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tên Dự án
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Nhập tên dự án"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mô tả (Tùy chọn)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Nhập mô tả dự án"
                    rows={4}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Màu sắc project
                  </label>
                  <ColorPicker
                    value={selectedColor}
                    onChange={setSelectedColor}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Biểu tượng project
                  </label>
                  <IconPicker
                    value={selectedIcon}
                    onChange={setSelectedIcon}
                    disabled={isLoading}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Đang tạo...' : 'Tạo Dự án'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function EditProjectModal({ project, onClose, onSubmit }: EditProjectModalProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [selectedColor, setSelectedColor] = useState(project.color);
  const [selectedIcon, setSelectedIcon] = useState(project.icon || 'folder');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isLoading) return;

    setIsLoading(true);
    
    try {
      const projectData: any = {
        name: name.trim(),
        description: description.trim() || undefined,
        color: selectedColor,
        icon: selectedIcon,
      };

      if (USE_MOCK_DATA) {
        await simulateDelay(400);
        const updatedProject = updateMockProject(project.id, projectData);
        if (updatedProject) {
          onSubmit(updatedProject);
        }
      } else {
        const response = await apiClient.updateProject(project.id, projectData);
        
        if (response.error) {
          alert('Lỗi khi cập nhật dự án: ' + response.error);
          return;
        }

        if (response.data) {
          const updatedProject = {
            ...response.data,
            updatedAt: response.data.updatedAt,
          };
          onSubmit(updatedProject);
        }
      }
    } catch (error) {
      alert('Lỗi khi cập nhật dự án: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Chỉnh sửa Dự án
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tên Dự án
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Nhập tên dự án"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mô tả (Tùy chọn)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Nhập mô tả dự án"
                    rows={4}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Màu sắc project
                  </label>
                  <ColorPicker
                    value={selectedColor}
                    onChange={setSelectedColor}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Biểu tượng project
                  </label>
                  <IconPicker
                    value={selectedIcon}
                    onChange={setSelectedIcon}
                    disabled={isLoading}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật Dự án'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function NotebookPage() {
  const router = useRouter();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const currentProjectId = searchParams.get('project');
  const [projects, setProjects] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này không?')) return;
    
    setIsLoading(true);
    try {
      if (USE_MOCK_DATA) {
        await simulateDelay(300);
        deleteMockProject(id);
        setProjects(projects.filter(p => p.id !== id));
      } else {
        const response = await apiClient.deleteProject(id);
        if (response.error) {
          alert('Lỗi khi xóa dự án: ' + response.error);
          return;
        }
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (error) {
      alert('Lỗi khi xóa dự án');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const handleUpdateProject = (updatedProject: any) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setShowEditModal(false);
    setEditingProject(null);
  };

  // Load projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      setConnectionError(false);
      try {
        if (USE_MOCK_DATA) {
          await simulateDelay(400);
          const mockProjects = getMockProjects();
          setProjects(mockProjects);
          console.log('Mock projects loaded:', mockProjects.length);
        } else {
          const response = await apiClient.getProjects();
          if (response.data) {
            const apiProjects = response.data.map((project: any) => ({
              ...project,
              updatedAt: project.updatedAt,
            }));
            setProjects(apiProjects);
          } else if (response.error) {
            setConnectionError(true);
            console.error('Lỗi API:', response.error);
          }
        }
      } catch (error) {
        setConnectionError(true);
        console.error('Lỗi kết nối:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <MainLayout
      headerTitle="Sổ tay Dự án"
      headerSubtitle="Tổ chức tài liệu theo dự án và trò chuyện với AI về chúng"
      headerActions={
        <div className="flex items-center gap-2">
          {/* Connection Status */}
          {connectionError ? (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
              <WifiOff className="w-4 h-4" />
              <span>Ngoại tuyến</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm">
              <Wifi className="w-4 h-4" />
              <span>Đã kết nối</span>
            </div>
          )}

          <HeaderButton
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreateModal(true)}
            disabled={isLoading || connectionError}
            tooltip={connectionError ? "Không thể tạo dự án khi ngoại tuyến" : "Tạo dự án mới"}
          >
            Dự án Mới
          </HeaderButton>
        </div>
      }
    >
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {isLoading && projects.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                Đang tải dự án...
              </div>
            </div>
          ) : connectionError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md text-center">
                <WifiOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  Lỗi Kết nối
                </h3>
                <p className="text-red-600 dark:text-red-300 mb-4">
                  Không thể kết nối tới cơ sở dữ liệu. Vui lòng kiểm tra kết nối internet và thử lại.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 max-w-md text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Chưa có Dự án nào
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Tạo dự án đầu tiên để bắt đầu tổ chức tài liệu và trò chuyện với AI.
                </p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Tạo Dự án Đầu tiên
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const isActive = currentProjectId === project.id;
                
                return (
                  <div 
                    key={project.id} 
                    className={`group rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border overflow-hidden relative ${
                      isActive 
                        ? 'border-2 shadow-xl ring-2 ring-offset-2' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                    style={isActive ? {
                      borderColor: project.color,
                      background: `linear-gradient(135deg, ${project.color}15 0%, ${project.color}08 50%, transparent 100%)`
                    } : {}}
                  >
                    {/* Enlarged Icon Watermark for Active Project */}
                    {isActive && (
                      <div 
                        className="absolute -right-8 -bottom-8 opacity-10 dark:opacity-5 pointer-events-none"
                        style={{ color: project.color }}
                      >
                        <BookOpen className="w-48 h-48" />
                      </div>
                    )}
                    
                    {/* Top Color Bar */}
                    <div className={isActive ? "h-2" : "h-1"} style={{ backgroundColor: project.color }} />
                    
                    <div className="p-6 relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          {isActive && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mb-2" 
                              style={{ 
                                backgroundColor: `${project.color}20`,
                                color: project.color 
                              }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: project.color }} />
                              Đang hoạt động
                            </div>
                          )}
                          <Link href={`/notebook?project=${project.id}`}>
                            <h3 className={`text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer hover:underline ${
                              isActive ? 'text-gray-900 dark:text-gray-100 text-xl' : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {project.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {project.description || 'Không có mô tả'}
                          </p>
                        </div>
                        
                        <div className={`flex items-center gap-1 transition-opacity ${
                          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleEditProject(project);
                            }}
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                            disabled={isLoading}
                            title="Chỉnh sửa dự án"
                          >
                            <Edit className="w-4 h-4 text-blue-500" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteProject(project.id);
                            }}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            disabled={isLoading}
                            title="Xóa dự án"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <FileText className="w-4 h-4" />
                          <span>{project.documentsCount} tài liệu</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <MessageSquare className="w-4 h-4" />
                          <span>{project.chatsCount} cuộc trò chuyện</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(project.updatedAt)}</span>
                        </div>
                        
                        <Link href={`/dashboard?project=${project.id}`}>
                          <button 
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              isActive 
                                ? 'text-white' 
                                : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                            }`}
                            style={isActive ? { backgroundColor: project.color } : {}}
                          >
                            {isActive ? 'Đang mở' : 'Mở'}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div 
                onClick={() => setShowCreateModal(true)}
                className="group border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex flex-col items-center justify-center min-h-[200px]"
              >
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tạo Dự án Mới
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
                  Bắt đầu tổ chức tài liệu và trò chuyện với AI
                </p>
              </div>
            </div>
          )}

          {showCreateModal && !connectionError && (
            <CreateProjectModal 
              onClose={() => setShowCreateModal(false)}
              onSubmit={(newProject) => {
                setProjects([newProject, ...projects]);
                setShowCreateModal(false);
              }}
            />
          )}

          {showEditModal && editingProject && !connectionError && (
            <EditProjectModal 
              project={editingProject}
              onClose={() => {
                setShowEditModal(false);
                setEditingProject(null);
              }}
              onSubmit={handleUpdateProject}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
