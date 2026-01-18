'use client';

import MainLayout from '@/components/layout/MainLayout';
import { Button, Card, CardContent, CardHeader, CardTitle, ColorPicker, IconPicker, Input, Modal, ModalFooter } from '@/components/ui';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useProject } from '@/hooks/useProject';
import apiClient from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface EditedProject {
  name: string;
  description: string;
  color: string;
  icon: string;
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  
  // Get project data and set breadcrumb context
  const { project, isLoading: projectLoading, refetch } = useProject();
  const { setProjectName, setProjectColor } = useBreadcrumb();
  
  // Project edit state
  const [editedProject, setEditedProject] = useState<EditedProject>({
    name: '',
    description: '',
    color: '#3b82f6',
    icon: 'folder'
  });
  
  // UI State
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load project data into edit form
  useEffect(() => {
    if (project) {
      setEditedProject({
        name: project.name || '',
        description: project.description || '',
        color: project.color || '#3b82f6',
        icon: project.icon || 'folder'
      });
      setProjectName(project.name);
      setProjectColor(project.color);
    }
  }, [project, setProjectName, setProjectColor]);

  const handleUpdateProject = async () => {
    if (!project) return;
    
    setIsUpdating(true);
    setErrorMessage('');
    
    try {
      const response = await apiClient.updateProject(project.id, editedProject);
      
      if (response.success) {
        // Update breadcrumb
        setProjectName(editedProject.name);
        setProjectColor(editedProject.color);
        
        // Refetch project data
        refetch();
      } else {
        setErrorMessage(response.error || 'Lỗi khi cập nhật project');
      }
    } catch {
      setErrorMessage('Lỗi kết nối đến server');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    
    setIsDeleting(true);
    setErrorMessage('');
    
    try {
      const response = await apiClient.deleteProject(project.id);
      
      if (response.success) {
        // Redirect to dashboard or projects page
        router.push('/dashboard');
      } else {
        setErrorMessage(response.error || 'Lỗi khi xóa project');
      }
    } catch {
      setErrorMessage('Lỗi kết nối đến server');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleColorChange = (color: string) => {
    setEditedProject(prev => ({ ...prev, color }));
  };

  return (
    <MainLayout
      headerTitle="Cài đặt"
      headerSubtitle="Quản lý project và tùy chỉnh ứng dụng"
      showProjectStats={true}
    >
      <div className="h-full overflow-y-auto">
        {/* Content - Căn giữa với responsive grid layout */}
        <div className="max-w-6xl mx-auto p-6">
          <div className="space-y-6">
            {/* Row 1 - Project Information (Horizontal Layout) */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Thông tin Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {projectLoading ? (
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    {errorMessage && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <p className="text-red-800 dark:text-red-200 text-sm">{errorMessage}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column - Basic Info */}
                      <div className="space-y-4">
                        <Input
                          label="Tên project"
                          value={editedProject.name}
                          onChange={(e) => setEditedProject(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nhập tên project"
                          disabled={isUpdating}
                        />
                        <Input
                          label="Mô tả project"
                          value={editedProject.description}
                          onChange={(e) => setEditedProject(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Mô tả ngắn gọn về project"
                          disabled={isUpdating}
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Màu sắc project
                          </label>
                          <ColorPicker
                            value={editedProject.color}
                            onChange={handleColorChange}
                            disabled={isUpdating}
                          />
                        </div>
                      </div>

                      {/* Right Column - Icon */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Biểu tượng project
                          </label>
                          <IconPicker
                            value={editedProject.icon}
                            onChange={(icon) => setEditedProject(prev => ({ ...prev, icon }))}
                            disabled={isUpdating}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-start pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={handleUpdateProject}
                        disabled={isUpdating || !editedProject.name.trim()}
                      >
                        {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Row 2 - Theme & Danger Zone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Theme Card */}
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle>Giao diện</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['light', 'dark', 'system'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            theme === t
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            {t === 'light' && (
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            )}
                            {t === 'dark' && (
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                              </svg>
                            )}
                            {t === 'system' && (
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            )}
                            <span className="text-sm font-medium capitalize">
                              {t === 'light' ? 'Sáng' : t === 'dark' ? 'Tối' : 'Hệ thống'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone Card */}
              <Card variant="bordered" className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">Vùng nguy hiểm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Xóa project
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Xóa vĩnh viễn project và tất cả dữ liệu liên quan
                      </p>
                    </div>
                    <Button 
                      variant="danger"
                      onClick={() => setShowDeleteModal(true)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Đang xóa...' : 'Xóa project'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa project"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">
                  Hành động này không thể hoàn tác
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                  Việc xóa project sẽ xóa vĩnh viễn tất cả dữ liệu bao gồm:
                </p>
                <ul className="text-red-700 dark:text-red-300 text-sm mt-2 ml-4 list-disc">
                  <li>Tất cả tài liệu đã upload</li>
                  <li>Lịch sử chat và cuộc hội thoại</li>
                  <li>Cài đặt và cấu hình project</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-gray-700 dark:text-gray-300">
              Để xác nhận xóa, vui lòng nhập tên project:{' '}
              <span className="font-semibold">{project?.name}</span>
            </p>
            <input
              type="text"
              placeholder={`Nhập "${project?.name}" để xác nhận`}
              className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => {
                const confirmButton = document.getElementById('confirm-delete') as HTMLButtonElement;
                if (confirmButton) {
                  confirmButton.disabled = e.target.value !== project?.name;
                }
              }}
            />
          </div>
        </div>
        
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            id="confirm-delete"
            variant="danger"
            onClick={handleDeleteProject}
            disabled={true} // Initially disabled
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa project'}
          </Button>
        </ModalFooter>
      </Modal>
    </MainLayout>
  );
}

