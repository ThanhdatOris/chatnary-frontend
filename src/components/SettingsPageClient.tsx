'use client'

import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import { Button, Card, TextInput, ThemeToggle } from '@/components/ui'
import Loading from '@/components/ui/Loading'
import { useTheme } from '@/contexts/ThemeContext'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/hooks/useAuth'
import { api, API_ENDPOINTS } from '@/lib/api'
import {
    Bell,
    Eye,
    EyeOff,
    Globe,
    Lock,
    Moon,
    Save,
    Sun,
    User
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SettingsPageClient() {
  const { user, loading } = useAuth()
  const { showToast } = useToast()
  const { theme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Load user data when user is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || ''
      }))
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="lg" />
        </div>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    if (!formData.fullName.trim()) {
      showToast('Họ và tên không được để trống', 'error')
      return
    }

    setIsSaving(true)
    try {
      await api.put(API_ENDPOINTS.auth.profile, {
        fullName: formData.fullName.trim()
      })
      showToast('Thông tin đã được cập nhật thành công', 'success')
    } catch (error: unknown) {
      let errorMessage = 'Không thể cập nhật thông tin'
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { detail?: string } } }).response
        if (response?.data?.detail) {
          errorMessage = response.data.detail
        }
      }
      showToast(errorMessage, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!formData.currentPassword.trim()) {
      showToast('Vui lòng nhập mật khẩu hiện tại', 'error')
      return
    }

    if (!formData.newPassword.trim()) {
      showToast('Vui lòng nhập mật khẩu mới', 'error')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast('Mật khẩu mới không khớp', 'error')
      return
    }

    if (formData.newPassword.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự', 'error')
      return
    }

    setIsSaving(true)
    try {
      await api.put(API_ENDPOINTS.auth.changePassword, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })
      showToast('Mật khẩu đã được thay đổi thành công', 'success')
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error: unknown) {
      let errorMessage = 'Không thể thay đổi mật khẩu'
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { detail?: string } } }).response
        if (response?.data?.detail) {
          errorMessage = response.data.detail
        }
      }
      showToast(errorMessage, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header 
        user={user}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Cài đặt
              </h1>
              <p className="text-gray-800 dark:text-gray-300">
                Quản lý thông tin cá nhân và tùy chọn hệ thống
              </p>
            </div>

            <div className="space-y-6">
              {/* Profile Settings */}
              <Card glass float>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <User className="w-5 h-5 text-blue-600 mr-3" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Thông tin cá nhân
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                        Họ và tên
                      </label>
                      <TextInput
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <TextInput
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Nhập email"
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
                  </Button>
                </div>
              </Card>

              {/* Password Settings */}
              <Card glass float>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <Lock className="w-5 h-5 text-green-600 mr-3" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Thay đổi mật khẩu
                    </h2>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                        Mật khẩu hiện tại
                      </label>
                      <TextInput
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                        Mật khẩu mới
                      </label>
                      <div className="relative">
                        <TextInput
                          type={showPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          placeholder="Nhập mật khẩu mới"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                        Xác nhận mật khẩu mới
                      </label>
                      <TextInput
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleChangePassword}
                    disabled={isSaving}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    {isSaving ? 'Đang thay đổi...' : 'Thay đổi mật khẩu'}
                  </Button>
                </div>
              </Card>

              {/* Preferences */}
              <Card glass float>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <Globe className="w-5 h-5 text-purple-600 mr-3" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Tùy chọn
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-500 mr-3" /> : <Sun className="w-5 h-5 text-yellow-500 mr-3" />}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Chế độ tối
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-400">
                            Chuyển đổi giao diện sang chế độ tối
                          </p>
                        </div>
                      </div>
                      <ThemeToggle variant="switch" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bell className="w-5 h-5 text-purple-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Thông báo
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-400">
                            Nhận thông báo về các hoạt động mới
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifications(!notifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors glass-card border-0 ${
                          notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        title={notifications ? 'Tắt thông báo' : 'Bật thông báo'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
