'use client'

import ModernLayout from '@/components/layout/ModernLayout'
import OverviewExtras from '@/components/OverviewExtras'
import { Button } from '@/components/ui'
import { FileText, MessageSquare, Upload } from 'lucide-react'
import Link from 'next/link'

export default function OverviewPage() {
  return (
    <ModernLayout
      title="Tổng quan hệ thống"
      description="Truy cập nhanh các tính năng và xem tài liệu gần đây"
    >
      <div className="h-[calc(85vh)]">
        {/* Quick CTA */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 ">
          <Link href="/files" className="block">
            <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tải lên tài liệu</h3>
              <p className="text-gray-600 text-sm">Thêm tài liệu mới và quản lý thư viện của bạn</p>
            </div>
          </Link>

          <Link href="/chat" className="block">
            <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bắt đầu trò chuyện</h3>
              <p className="text-gray-600 text-sm">Đặt câu hỏi và nhận câu trả lời từ tài liệu</p>
            </div>
          </Link>

          <Link href="/files" className="block">
            <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý tài liệu</h3>
              <p className="text-gray-600 text-sm">Xem, tải về, xóa và xem nội dung tài liệu</p>
            </div>
          </Link>
        </div>

        {/* Extras: recent files, tips, shortcuts */}
        <OverviewExtras />

        {/* Bottom CTA */}
        <div className="mt-8 flex items-center justify-end">
          <Link href="/files">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Đi tới Files</Button>
          </Link>
        </div>
      </div>
    </ModernLayout>
  )
}


