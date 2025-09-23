'use client'

import ModernLayout from '@/components/layout/ModernLayout'
import { Button, Loading } from '@/components/ui'
import { useFileDetail } from '@/hooks/useFileDetail'
import { Download, FileText } from 'lucide-react'

interface FileDetailPageProps {
  params: {
    fileId: string
  }
}

export default function FileDetailPage({ params }: FileDetailPageProps) {
  const { file, loading, error } = useFileDetail(params.fileId)

  if (loading) {
    return (
      <ModernLayout title="Chi tiết tài liệu" showBackButton>
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      </ModernLayout>
    )
  }

  if (error || !file) {
    return (
      <ModernLayout title="Chi tiết tài liệu" showBackButton>
        <div className="text-center py-8">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy tài liệu
          </h3>
          <p className="text-gray-600">{error || 'Tài liệu không tồn tại'}</p>
        </div>
      </ModernLayout>
    )
  }

  return (
    <ModernLayout 
      title={file.filename}
      description={`${file.size} bytes • ${file.uploadTime}`}
      showBackButton
      actions={
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Tải xuống
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* File Info */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Thông tin tài liệu</h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Tên file</dt>
              <dd className="mt-1 text-sm text-gray-900">{file.filename}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Kích thước</dt>
              <dd className="mt-1 text-sm text-gray-900">{file.size} bytes</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Ngày tải lên</dt>
              <dd className="mt-1 text-sm text-gray-900">{file.uploadTime}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Loại file</dt>
              <dd className="mt-1 text-sm text-gray-900">{file.mimetype}</dd>
            </div>
          </dl>
        </div>

        {/* File Content Preview */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Nội dung</h2>
          <div className="text-sm text-gray-600">
            Xem trước nội dung tài liệu sẽ được hiển thị ở đây...
          </div>
        </div>
      </div>
    </ModernLayout>
  )
}


