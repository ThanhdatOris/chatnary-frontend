'use client'

import { mockFiles } from '@/lib/mockData'
import { FileText, Lightbulb, MousePointerClick } from 'lucide-react'
import Link from 'next/link'

export default function OverviewExtras() {
  const recentFiles = [...mockFiles]
    .sort((a, b) => (a.uploadTime < b.uploadTime ? 1 : -1))
    .slice(0, 5)

  const tips = [
    'Kéo thả nhiều file để tải nhanh hơn.',
    'Dùng thanh tìm kiếm trên navbar để tìm ngay.',
    'Bạn có thể chat với AI mà không cần đăng nhập (mock mode).'
  ]

  const shortcuts = [
    { key: 'U', label: 'Tải lên tài liệu' },
    { key: 'S', label: 'Mở tìm kiếm' },
    { key: 'C', label: 'Mở trang chat' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Files */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Tài liệu gần đây</h3>
        </div>
        {recentFiles.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có tài liệu nào</p>
        ) : (
          <ul className="divide-y divide-gray-200/60">
            {recentFiles.map((f) => (
              <li key={f.id} className="py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{f.originalName}</p>
                  <p className="text-xs text-gray-500">{new Date(f.uploadTime).toLocaleString('vi-VN')}</p>
                </div>
                <Link href={`/files/${f.id}`} className="text-blue-600 text-sm hover:underline">
                  Xem
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tips */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900">Mẹo sử dụng</h3>
        </div>
        <ul className="list-disc pl-5 space-y-2">
          {tips.map((t, i) => (
            <li key={i} className="text-sm text-gray-700">{t}</li>
          ))}
        </ul>
      </div>

      {/* Shortcuts */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <MousePointerClick className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Phím tắt nhanh</h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center justify-between bg-white/70 border border-gray-200/60 rounded-xl px-3 py-2">
              <span className="text-sm text-gray-700">{s.label}</span>
              <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded">{s.key}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


