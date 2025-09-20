import { Button } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { api, API_ENDPOINTS } from '@/lib/api'
import { formatDate, formatFileSize } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface FileItem {
  id?: string
  _id?: string
  filename: string
  originalName: string
  size: number
  mimetype?: string
  mimeType?: string
  uploadTime?: string
  uploadDate?: string
  indexed?: boolean
  processed?: boolean
  textContent?: string
  metadata?: {
    pages?: number
    wordCount?: number
  }
}

export default function FileTable() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const { showToast } = useToast()

  useEffect(() => {
    fetchFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, pageSize])

  const fetchFiles = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get(API_ENDPOINTS.files.list, {
        params: { search, page, limit: pageSize }
      })
      let filesData = []
      if (response.data.success && response.data.data && response.data.data.files) {
        filesData = response.data.data.files
        setTotal(response.data.data.pagination?.total || filesData.length)
      } else if (response.data.files) {
        filesData = response.data.files
        setTotal(filesData.length)
      } else if (Array.isArray(response.data)) {
        filesData = response.data
        setTotal(filesData.length)
      }
      setFiles(Array.isArray(filesData) ? filesData : [])
    } catch {
      setError('Failed to load files')
      showToast('Không thể tải danh sách file', 'error')
      setFiles([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm tài liệu..."
          className="border px-3 py-2 rounded w-64"
        />
        <span className="text-muted-foreground">Tổng số: {total}</span>
      </div>
      <table className="min-w-full border rounded-lg bg-background">
        <thead>
          <tr className="bg-muted">
            <th className="px-4 py-2 text-left">Tên file</th>
            <th className="px-4 py-2 text-left">Kích thước</th>
            <th className="px-4 py-2 text-left">Ngày upload</th>
            <th className="px-4 py-2 text-left">Trạng thái AI</th>
            <th className="px-4 py-2 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center py-8">Đang tải...</td></tr>
          ) : error ? (
            <tr><td colSpan={5} className="text-center text-red-600 py-8">{error}</td></tr>
          ) : files.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8">Không có tài liệu nào</td></tr>
          ) : (
            files.map(file => (
              <tr key={file._id || file.id} className="border-b">
                <td className="px-4 py-2">
                  {file.originalName || file.filename}
                </td>
                <td className="px-4 py-2">{formatFileSize(file.size || 0)}</td>
                <td className="px-4 py-2">{file.uploadTime ? formatDate(file.uploadTime) : ''}</td>
                <td className="px-4 py-2">
                  {file.indexed || file.processed ? 'Đã xử lý' : 'Đang xử lý'}
                </td>
                <td className="px-4 py-2">
                  <Button size="sm" variant="outline">Chi tiết</Button>
                  <Button size="sm" variant="outline">Tải về</Button>
                  <Button size="sm" variant="outline">Xóa</Button>
                  <Button size="sm" variant="outline">Chia sẻ</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <div>
          <Button size="sm" variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>Trước</Button>
          <span className="mx-2">Trang {page}</span>
          <Button size="sm" variant="outline" onClick={() => setPage(page + 1)} disabled={page * pageSize >= total}>Sau</Button>
        </div>
  <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="border px-2 py-1 rounded" title="Chọn số lượng hiển thị">
          {[10, 20, 50].map(size => (
            <option key={size} value={size}>{size} / trang</option>
          ))}
        </select>
      </div>
    </div>
  )
}
