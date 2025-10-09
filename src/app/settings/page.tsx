'use client';

import MainLayout from '@/components/layout/MainLayout';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    name: 'Người dùng Demo',
    email: 'demo@chatnary.com',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In real app, save to backend
    console.log('Saving settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Cài đặt
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý tài khoản và tùy chỉnh ứng dụng
          </p>
        </div>

        {/* Profile Settings */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Tên"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </CardContent>
        </Card>

        {/* Appearance */}
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

        {/* AI Settings */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Cài đặt AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Model
              </label>
              <select
                id="model-select"
                value={settings.model}
                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gpt-4">GPT-4 (Chất lượng cao)</option>
                <option value="gpt-4-turbo">GPT-4 Turbo (Nhanh hơn)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Tiết kiệm)</option>
              </select>
            </div>

            <div>
              <label htmlFor="temperature-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Temperature: {settings.temperature}
              </label>
              <input
                id="temperature-range"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Chính xác</span>
                <span>Sáng tạo</span>
              </div>
            </div>

            <div>
              <label htmlFor="max-tokens-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Tokens: {settings.maxTokens}
              </label>
              <input
                id="max-tokens-range"
                type="range"
                min="500"
                max="4000"
                step="100"
                value={settings.maxTokens}
                onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Độ dài tối đa của câu trả lời
              </p>
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
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Xóa tất cả dữ liệu
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Xóa tất cả tài liệu và lịch sử chat
                </p>
              </div>
              <Button variant="danger">Xóa tất cả</Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="ghost">Hủy</Button>
          <Button onClick={handleSave}>
            {saved ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Đã lưu
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

