'use client'

import { Button } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { api, API_ENDPOINTS } from '@/lib/api'
import { AlertCircle, CheckCircle, File, Upload, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onUploadSuccess?: (file: unknown) => void
  onUploadError?: (error: string) => void
  maxSize?: number
  multiple?: boolean
}

interface UploadFile {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  id: string
}

export default function FileUpload({
  onUploadSuccess,
  onUploadError,
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true
}: FileUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { showToast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending',
      id: Math.random().toString(36).substr(2, 9)
    }))

    setUploadFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize,
    multiple
  })

  const uploadFile = async (uploadFile: UploadFile) => {
    try {
      setUploadFiles(prev => 
        prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'uploading', progress: 0 }
            : f
        )
      )

      const formData = new FormData()
      formData.append('file', uploadFile.file)

      const response = await api.post(API_ENDPOINTS.files.upload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total 
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0
          
          setUploadFiles(prev => 
            prev.map(f => 
              f.id === uploadFile.id 
                ? { ...f, progress }
                : f
            )
          )
        }
      })

      setUploadFiles(prev => 
        prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'success', progress: 100 }
            : f
        )
      )

      if (onUploadSuccess) {
        onUploadSuccess(response.data)
      }

      // Show AI processing notification if mentioned in response
      if (response.data.message && response.data.message.includes('Xử lý AI')) {
        if (response.data.message.includes('success')) {
          showToast('Tài liệu đã được xử lý AI thành công!', 'success')
        } else if (response.data.message.includes('failed')) {
          showToast('Tài liệu đã upload nhưng xử lý AI thất bại. Bạn có thể thử lại sau.', 'info')
        }
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Upload failed'
        : 'Upload failed'
      
      setUploadFiles(prev => 
        prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'error', error: errorMessage }
            : f
        )
      )

      if (onUploadError) {
        onUploadError(errorMessage)
      }
    }
  }

  const uploadAllFiles = async () => {
    setIsUploading(true)
    const pendingFiles = uploadFiles.filter(f => f.status === 'pending')
    
    try {
      await Promise.all(pendingFiles.map(uploadFile))
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id))
  }

  const clearCompleted = () => {
    setUploadFiles(prev => prev.filter(f => f.status !== 'success'))
  }

  const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="w-full bg-muted rounded-full h-2">
      <div
        className={`bg-blue-600 h-2 rounded-full transition-all`}
        style={{ width: `${progress}%` }}
      />
    </div>
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-border hover:border-blue-400'
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-blue-600 font-medium">Drop files here...</p>
        ) : (
          <div>
            <p className="text-muted-foreground font-medium mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, DOCX, TXT files up to {formatFileSize(maxSize)}
            </p>
          </div>
        )}
      </div>

      {/* File List */}
      {uploadFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">
              Files ({uploadFiles.length})
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={clearCompleted}
                variant="outline"
                size="sm"
                disabled={!uploadFiles.some(f => f.status === 'success')}
              >
                Clear Completed
              </Button>
              <Button
                onClick={uploadAllFiles}
                disabled={isUploading || !uploadFiles.some(f => f.status === 'pending')}
                size="sm"
              >
                {isUploading ? 'Uploading...' : 'Upload All'}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {uploadFiles.map((uploadFile) => (
              <div
                key={uploadFile.id}
                className="flex items-center gap-4 p-4 border rounded-lg bg-background"
              >
                <File className="w-8 h-8 text-blue-500 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {uploadFile.file.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(uploadFile.file.size)}
                  </p>
                  
                  {uploadFile.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-600">Uploading...</span>
                        <span className="text-blue-600">{uploadFile.progress}%</span>
                      </div>
                      <ProgressBar progress={uploadFile.progress} />
                    </div>
                  )}
                  
                  {uploadFile.status === 'error' && (
                    <p className="text-sm text-red-600 mt-1">
                      {uploadFile.error}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {uploadFile.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {uploadFile.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  
                  <button
                    onClick={() => removeFile(uploadFile.id)}
                    className="p-1 hover:bg-muted rounded"
                    title="Remove file"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
