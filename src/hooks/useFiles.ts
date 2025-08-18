'use client'

import { api, API_ENDPOINTS } from '@/lib/api'
import { FileMetadata } from '@/lib/types'
import { useCallback, useEffect, useState } from 'react'

interface FileListResponse {
  success: boolean
  data: {
    files: FileMetadata[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  message?: string
}

interface UseFilesOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface UseFilesReturn {
  files: FileMetadata[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null
  refetch: () => Promise<void>
  deleteFile: (fileId: string) => Promise<boolean>
}

export function useFiles(options: UseFilesOptions = {}): UseFilesReturn {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<{
    page: number
    limit: number
    total: number
    totalPages: number
  } | null>(null)

  const {
    page = 1,
    limit = 20,
    sortBy = 'uploadTime',
    sortOrder = 'desc'
  } = options

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      })

      const response = await api.get<FileListResponse>(`${API_ENDPOINTS.files.list}?${params}`)
      
      if (response.data.success) {
        setFiles(response.data.data.files)
        setPagination(response.data.data.pagination)
      } else {
        setError(response.data.message || 'Failed to fetch files')
      }
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch files'
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response
        if (response?.data?.message) {
          errorMessage = response.data.message
        }
      }
      setError(errorMessage)
      setFiles([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [page, limit, sortBy, sortOrder])

  const deleteFile = async (fileId: string): Promise<boolean> => {
    try {
      const response = await api.delete(API_ENDPOINTS.files.delete(fileId))
      
      if (response.data.success) {
        // Remove file from local state
        setFiles(prev => prev.filter(file => file.id !== fileId))
        return true
      } else {
        setError(response.data.message || 'Failed to delete file')
        return false
      }
    } catch (err: unknown) {
      let errorMessage = 'Failed to delete file'
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response
        if (response?.data?.message) {
          errorMessage = response.data.message
        }
      }
      setError(errorMessage)
      return false
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  return {
    files,
    loading,
    error,
    pagination,
    refetch: fetchFiles,
    deleteFile
  }
}

export default useFiles
