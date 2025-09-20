'use client'

import { useStats } from '@/hooks/useStats'
import { FileText, Heart, MessageCircle, RefreshCw, Search } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
  isLoading?: boolean
}

function StatCard({ title, value, icon, color, isLoading }: StatCardProps) {
  return (
    <div className="glass-card-hover p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shadow-glass`}>
            {icon}
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold text-foreground">
            {isLoading ? (
              <div className="animate-pulse bg-muted h-8 w-12 rounded"></div>
            ) : (
              value
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function DashboardStats() {
  const { stats, loading, error, refetch } = useStats()

  if (error) {
    return (
      <div className="glass-card border border-red-200/30 p-4 mb-8 bg-red-50/20 dark:bg-red-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-800 text-sm font-medium">
              Không thể tải thống kê: {error}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="text-red-600 hover:text-red-800 p-1"
            title="Thử lại"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  const storagePercentage = stats 
    ? Math.round((stats.storageUsed / stats.maxStorage) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Tài liệu"
        value={stats?.totalFiles || 0}
        icon={<FileText className="w-5 h-5 text-white" />}
        color="bg-blue-500"
        isLoading={loading}
      />
      
      <StatCard
        title="Trò chuyện" 
        value={stats?.totalChats || 0}
        icon={<MessageCircle className="w-5 h-5 text-white" />}
        color="bg-green-500"
        isLoading={loading}
      />
      
      <StatCard
        title="Tìm kiếm"
        value={stats?.totalSearches || 0}
        icon={<Search className="w-5 h-5 text-white" />}
        color="bg-yellow-500"
        isLoading={loading}
      />
      
      <StatCard
        title="Lưu trữ"
        value={stats ? `${storagePercentage}%` : '0%'}
        icon={<Heart className="w-5 h-5 text-white" />}
        color="bg-purple-500"
        isLoading={loading}
      />
      
      {/* Storage Details */}
      {stats && (
        <div className="col-span-full mt-4">
          <div className="glass-card-light p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">
                Chi tiết lưu trữ
              </span>
              <span className="text-sm text-muted-foreground">
                {formatBytes(stats.storageUsed)} / {formatBytes(stats.maxStorage)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  storagePercentage > 90 
                    ? 'bg-red-500' 
                    : storagePercentage > 70 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
                }`}
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
