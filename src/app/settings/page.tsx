'use client';

import MainLayout from '@/components/layout/MainLayout';
import { Button, Card, CardContent, CardHeader, CardTitle, ColorPicker, IconPicker, Input, Loading, Modal, ModalFooter } from '@/components/ui';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useProject } from '@/hooks/useProject';
import apiClient from '@/lib/api';
import { Cloud, CreditCard, HardDrive, Moon, Settings, Sun, User, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface EditedProject {
  name: string;
  description: string;
  color: string;
  icon: string;
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <Loading size="lg" text="Đang tải..." />
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
}

function SettingsPageContent() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  
  // Project Context
  const { project, isLoading: projectLoading, refetch } = useProject();
  const { setProjectName, setProjectColor } = useBreadcrumb();
  
  // Tab State: 'account' | 'project'
  const [activeTab, setActiveTab] = useState<'account' | 'project'>('account');

  // --- Project Logic ---
  const [editedProject, setEditedProject] = useState<EditedProject>({
    name: '', description: '', color: '#3b82f6', icon: 'folder'
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        setProjectName(editedProject.name);
        setProjectColor(editedProject.color);
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

  // --- Mock Data for Account ---
  const user = { name: 'Người dùng', email: 'user@example.com', plan: 'Pro Plan', avatar: null };
  const quota = {
    storage: { used: 2.5, total: 10, percent: 25 },
    aiTokens: { used: 150000, total: 1000000, percent: 15 },
    projects: { used: 5, total: 20, percent: 25 }
  };

  return (
    <MainLayout
      headerTitle="Cài đặt"
      headerSubtitle="Quản lý tài khoản và dự án"
      showProjectStats={false}
    >
      <div className="h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('account')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'account'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <User className="w-4 h-4" />
              Tài khoản & Ứng dụng
            </button>
            {project && (
              <button
                onClick={() => setActiveTab('project')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'project'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                Cài đặt Project: {project.name}
              </button>
            )}
          </div>

          {/* TAB CONTENT: ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Account Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Thông tin cá nhân
                </h2>
                <Card variant="bordered">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                          {user.name.charAt(0)}
                        </div>
                        <Button variant="secondary" size="sm">Đổi ảnh đại diện</Button>
                      </div>
                      <div className="flex-1 space-y-4 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Họ và tên</label>
                            <Input value={user.name} readOnly />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <Input value={user.email} readOnly />
                          </div>
                        </div>
                        <div className="mt-1 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <span className="font-semibold text-blue-900 dark:text-blue-100">{user.plan}</span>
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Nâng cấp</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quota */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-purple-500" />
                  Dung lượng & Giới hạn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Reuse Quota Cards from previous turn */}
                  <Card variant="bordered">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"><HardDrive className="w-6 h-6 text-gray-600 dark:text-gray-400" /></div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Lưu trữ</span>
                      </div>
                      <div className="mb-2 flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{quota.storage.used}GB</span>
                        <span className="text-sm text-gray-500">/ {quota.storage.total}GB</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${quota.storage.percent}%` }}></div>
                      </div>
                    </CardContent>
                  </Card>
                   <Card variant="bordered">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg"><Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" /></div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Tokens</span>
                      </div>
                      <div className="mb-2 flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">150K</span>
                        <span className="text-sm text-gray-500">/ 1M</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${quota.aiTokens.percent}%` }}></div>
                      </div>
                    </CardContent>
                  </Card>
                   <Card variant="bordered">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg"><Settings className="w-6 h-6 text-green-600 dark:text-green-400" /></div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Dự án</span>
                      </div>
                      <div className="mb-2 flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{quota.projects.used}</span>
                        <span className="text-sm text-gray-500">/ {quota.projects.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                         <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${quota.projects.percent}%` }}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* App Settings */}
               <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  Cài đặt ứng dụng
                </h2>
                <Card variant="bordered">
                  <CardContent className="p-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Giao diện (Theme)
                      </label>
                      <div className="grid grid-cols-3 gap-4 max-w-xl">
                        {(['light', 'dark', 'system'] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                              theme === t
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                          >
                           {t === 'light' ? <Sun className="w-6 h-6 text-amber-500" /> : t === 'dark' ? <Moon className="w-6 h-6 text-indigo-500" /> : <Settings className="w-6 h-6 text-gray-500" />}
                            <span className="text-sm font-medium capitalize">{t === 'light' ? 'Sáng' : t === 'dark' ? 'Tối' : 'Hệ thống'}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB CONTENT: PROJECT */}
          {activeTab === 'project' && project && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle>Thông tin Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {errorMessage && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-red-800 dark:text-red-200 text-sm">{errorMessage}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Màu sắc project</label>
                        <ColorPicker
                          value={editedProject.color}
                          onChange={(color) => setEditedProject(prev => ({ ...prev, color }))}
                          disabled={isUpdating}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Biểu tượng project</label>
                        <IconPicker
                          value={editedProject.icon}
                          onChange={(icon) => setEditedProject(prev => ({ ...prev, icon }))}
                          disabled={isUpdating}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button onClick={handleUpdateProject} disabled={isUpdating || !editedProject.name.trim()}>
                      {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card variant="bordered" className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">Vùng nguy hiểm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Xóa project</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Xóa vĩnh viễn project và tất cả dữ liệu liên quan</p>
                    </div>
                    <Button variant="danger" onClick={() => setShowDeleteModal(true)} disabled={isDeleting}>
                      {isDeleting ? 'Đang xóa...' : 'Xóa project'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
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
               <div className="text-red-600 dark:text-red-400 mt-1">⚠️</div>
               <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200">Hành động này không thể hoàn tác</h3>
                  <p className="text-red-700 dark:text-red-300 text-sm mt-1">Việc xóa project sẽ xóa vĩnh viễn tất cả dữ liệu.</p>
               </div>
             </div>
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300">Nhập tên project <span className="font-semibold">{project?.name}</span> để xác nhận:</p>
            <input
              type="text"
              placeholder={project?.name}
              className="w-full mt-2 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
              onChange={(e) => {
                 const confirmButton = document.getElementById('confirm-delete') as HTMLButtonElement;
                 if (confirmButton) confirmButton.disabled = e.target.value !== project?.name;
              }}
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
          <Button id="confirm-delete" variant="danger" onClick={handleDeleteProject} disabled={true}>
             {isDeleting ? 'Đang xóa...' : 'Xóa project'}
          </Button>
        </ModalFooter>
      </Modal>

    </MainLayout>
  );
}
