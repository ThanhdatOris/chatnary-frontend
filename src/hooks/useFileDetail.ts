import axios from 'axios'
import { useEffect, useState } from 'react'

export interface FileDetail {
  id: string
  originalName: string
  filename: string
  size: number
  mimetype: string
  uploadTime: string
  userId: string
  userEmail: string
  indexed: boolean
  downloadUrl?: string
  previewUrl?: string
  aiStatus?: string
  history?: string[]
  permissions?: string[]
}

export function useFileDetail(fileId?: string) {
  const [file, setFile] = useState<FileDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!fileId) return
    setLoading(true)
    setError(null)
    axios.get(`/api/files/${fileId}`)
      .then(res => {
        setFile(res.data.data)
      })
      .catch(err => {
        setError(err?.response?.data?.message || err.message)
      })
      .finally(() => setLoading(false))
  }, [fileId])

  return { file, loading, error }
}
