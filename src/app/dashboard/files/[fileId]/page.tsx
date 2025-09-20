'use client'

import { Button, Card } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { useFileDetail } from '@/hooks/useFileDetail'
import { api, API_ENDPOINTS } from '@/lib/api'
import { useParams, useRouter } from 'next/navigation'

export default function FileDetailPage() {
  const router = useRouter()
  const params = useParams()
  const fileId = params.fileId as string
  const { file, loading, error } = useFileDetail(fileId as string)
  const { showToast } = useToast()

  const handleDownload = async () => {
    if (!file) return
    try {
      const response = await api.get(API_ENDPOINTS.files.download(file.id), { responseType: 'blob' })
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.originalName || file.filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      showToast('Tải file thành công', 'success')
    } catch {
      showToast('Không thể tải file', 'error')
    }
  }

  const handleDelete = async () => {
    if (!file) return
    if (!confirm('Bạn có chắc muốn xóa file này?')) return
    try {
      await api.delete(API_ENDPOINTS.files.delete(file.id))
      showToast('Xóa file thành công', 'success')
      router.push('/dashboard/files')
    } catch {
      showToast('Không thể xóa file', 'error')
    }
  }

  const handleShare = async () => {
    showToast('Tính năng chia sẻ sẽ sớm có!', 'info')
  }

  if (loading) return <Card className="p-8">Đang tải thông tin tài liệu...</Card>
  if (error) return <Card className="p-8 text-red-600">Lỗi: {error}</Card>
  if (!file) return <Card className="p-8">Không tìm thấy tài liệu</Card>

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">{file.originalName || file.filename}</h2>
        <div className="mb-2 text-gray-600">Loại: {file.mimetype}</div>
        <div className="mb-2 text-gray-600">Kích thước: {file.size} bytes</div>
        <div className="mb-2 text-gray-600">Trạng thái AI: {file.aiStatus}</div>
        <div className="mb-2 text-gray-600">Lịch sử xử lý:</div>
        <ul className="list-disc ml-6 mb-4">
          {(file.history || []).map((h: string, idx: number) => (
            <li key={idx}>{h}</li>
          ))}
        </ul>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={handleDownload}>Tải về</Button>
          <Button variant="outline" onClick={handleShare}>Chia sẻ</Button>
          <Button variant="destructive" onClick={handleDelete}>Xóa</Button>
        </div>
      </Card>
    </div>
  )
}
