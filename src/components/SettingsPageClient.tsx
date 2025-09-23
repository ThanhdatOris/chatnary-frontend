'use client'

import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import { Button, Card, TextInput, ThemeToggle } from '@/components/ui'
import { useTheme } from '@/contexts/ThemeContext'
import { useToast } from '@/contexts/ToastContext'
// Auth removed
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

  // Initialize default user data
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      fullName: 'Demo User',
      email: 'demo@chatnary.com'
    }))
  }, [])

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
      // Demo mode - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      showToast('Thông tin đã được cập nhật thành công', 'success')
    } catch (error: unknown) {
      showToast('Không thể cập nhật thông tin', 'error')
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
      // Demo mode - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      showToast('Mật khẩu đã được thay đổi thành công', 'success')
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error: unknown) {
      showToast('Không thể thay đổi mật khẩu', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header 
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
                            <h1 className="text-2xl font-bold text-foreground mb-2">
                Cài đặt
              </h1>
              <p className="text-muted-foreground">
                Quản lý tài khoản và tùy chọn của bạn
              </p>
            </div>

            <div className="space-y-6">
              {/* Profile Settings */}
              <Card glass float>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <User className="w-5 h-5 text-blue-600 mr-3" />
                    <h2 className="text-lg font-semibold text-foreground">
                      Thông tin cá nhân
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                        Tên hiển thị
                      </label>
                      <TextInput
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
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
                    <h2 className="text-lg font-semibold text-foreground">
                      Thay đổi mật khẩu
                    </h2>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
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
                      <label className="block text-sm font-medium text-foreground mb-2">
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
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
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
                    <h2 className="text-lg font-semibold text-foreground">
                      Tùy chọn
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-500 mr-3" /> : <Sun className="w-5 h-5 text-yellow-500 mr-3" />}
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Chế độ tối
                          </p>
                          <p className="text-sm text-muted-foreground">
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
                          <p className="text-sm font-medium text-foreground">
                            Thông báo
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Nhận thông báo về các hoạt động mới
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifications(!notifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors glass-card border-0 ${
                          notifications ? 'bg-blue-600' : 'bg-muted'
                        }`}
                        title={notifications ? 'Tắt thông báo' : 'Bật thông báo'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
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
