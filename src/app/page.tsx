'use client';

import ColorPicker from '@/components/ui/ColorPicker';
import IconPicker from '@/components/ui/IconPicker';
import apiClient, { authApi } from '@/lib/api';
import { CreateProjectRequest } from '@/lib/types';
import { ArrowRight, Clock, Edit, FileText, Layout, MessageSquare, Plus, Shield, Trash2, Wifi, WifiOff, Zap } from 'lucide-react';
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
      const projectData: Partial<UpdateProjectRequest> = {
        name: name.trim(),
        description: description.trim() || undefined,
        color: selectedColor,
        icon: selectedIcon,
      };

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

export default function Home() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = () => {
        const isAuth = authApi.isAuthenticated(); // This will now re-read cookie if needed
        console.log('Home: checkAuth result:', isAuth);
        setIsAuthenticated(isAuth);
        setAuthChecking(false);
    };

    // Small delay to ensure cookies are ready if this is a fresh navigation
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const logout = async () => {
      await authApi.logout();
      window.location.reload();
  };

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
      const response = await apiClient.deleteProject(id);
      if (response.error) {
        alert('Lỗi khi xóa dự án: ' + response.error);
        return;
      }
      setProjects(projects.filter(p => p.id !== id));
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

  // Load projects if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const loadProjects = async () => {
        setIsLoading(true);
        setConnectionError(false);
        try {
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
        } catch (error) {
          setConnectionError(true);
          console.error('Lỗi kết nối:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadProjects();
    }
  }, [isAuthenticated]);

  // View: Loading State (Checking Auth)
  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  // View: Landing Page (Not Authenticated)
  if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
             <header className="container mx-auto px-4 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                         <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">Chatnary</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/auth/login">
                        <button className="px-5 py-2 text-gray-600 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors">
                            Đăng nhập
                        </button>
                    </Link>
                    <Link href="/auth/register">
                        <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20">
                            Đăng ký
                        </button>
                    </Link>
                </div>
             </header>

             <main className="container mx-auto px-4 py-20">
                 <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 pb-2">
                        Quản lý tài liệu thông minh &<br/>Trò chuyện cùng AI
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Tổ chức tài liệu của bạn theo dự án và khai thác sức mạnh của AI để tìm kiếm, tóm tắt và hỏi đáp trực tiếp.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/auth/register">
                            <button className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-xl">
                                Bắt đầu ngay <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                        <Link href="/auth/login">
                           <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
                                Đã có tài khoản?
                           </button>
                        </Link>
                    </div>
                 </div>

                 {/* Features Grid */}
                 <div className="grid md:grid-cols-3 gap-8 mt-24">
                     <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
                         <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                             <Layout className="w-6 h-6" />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Tổ chức Dự án</h3>
                         <p className="text-gray-600 dark:text-gray-400">
                             Tạo không gian làm việc riêng biệt cho từng dự án, giúp quản lý tài liệu khoa học và dễ dàng.
                         </p>
                     </div>
                     <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
                         <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                             <Zap className="w-6 h-6" />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">AI Mạnh mẽ</h3>
                         <p className="text-gray-600 dark:text-gray-400">
                             Sử dụng các mô hình AI tiên tiến nhất để phân tích nội dung và trả lời câu hỏi của bạn ngay lập tức.
                         </p>
                     </div>
                     <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
                         <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                             <Shield className="w-6 h-6" />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Bảo mật</h3>
                         <p className="text-gray-600 dark:text-gray-400">
                             Dữ liệu của bạn được mã hóa và bảo vệ an toàn. Nội dung tài liệu chỉ được sử dụng cho mục đích của bạn.
                         </p>
                     </div>
                 </div>
             </main>
        </div>
      );
  }

  // View: Authenticated (Existing Projects Dashboard)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Chatnary
          </span>
        </div>
        
        <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
            {connectionError ? (
                <div className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-sm">
                <WifiOff className="w-4 h-4" />
                <span>Ngoại tuyến</span>
                </div>
            ) : (
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm">
                <Wifi className="w-4 h-4" />
                <span>Đã kết nối</span>
                </div>
            )}
            </div>

            {/* Logout Button */}
            <button 
                onClick={logout}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
                Đăng xuất
            </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Dự án của bạn
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tổ chức tài liệu theo dự án và trò chuyện với AI về chúng
            </p>
          </div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || connectionError}
            title={connectionError ? "Không thể tạo dự án khi ngoại tuyến" : "Tạo dự án mới"}
          >
            <Plus className="w-5 h-5" />
            Dự án Mới
          </button>
        </div>

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
            {projects.map((project) => (
              <div key={project.id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="h-1" style={{ backgroundColor: project.color }} />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link href={`/dashboard?project=${project.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer hover:underline">
                          {project.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {project.description || 'Không có mô tả'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                      <button className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                        Mở
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
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
      </main>
    </div>
  );
}
