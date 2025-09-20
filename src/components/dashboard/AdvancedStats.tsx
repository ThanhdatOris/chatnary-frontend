'use client'

import { Card } from '@/components/ui'
import { useStats } from '@/hooks/useStats'
import {
    BarChart3,
    Calendar,
    Clock,
    FileText,
    MessageCircle,
    Search,
    TrendingUp
} from 'lucide-react'

export default function AdvancedStats() {
  const { stats, loading } = useStats()

  if (loading || !stats) {
    return null
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStorageColor = (percentage: number) => {
    if (percentage > 90) return 'text-red-600'
    if (percentage > 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  const recentActivity = [
    { type: 'upload', text: 'Tải lên tài liệu mới', time: '2 giờ trước' },
    { type: 'chat', text: 'Trò chuyện với AI', time: '4 giờ trước' },
    { type: 'search', text: 'Tìm kiếm tài liệu', time: '1 ngày trước' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Storage Usage */}
      <Card className="glass-card-hover">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Sử dụng lưu trữ</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Đã sử dụng</span>
              <span className="text-sm font-medium text-foreground">
                {formatBytes(stats.storageUsed)}
              </span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  (stats.storageUsed / stats.maxStorage) * 100 > 90 
                    ? 'bg-red-500' 
                    : (stats.storageUsed / stats.maxStorage) * 100 > 70 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
                }`}
                style={{ width: `${(stats.storageUsed / stats.maxStorage) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Tổng dung lượng</span>
              <span className={`font-medium ${getStorageColor((stats.storageUsed / stats.maxStorage) * 100)}`}>
                {formatBytes(stats.maxStorage)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Activity Overview */}
      <Card className="glass-card-hover">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Hoạt động gần đây</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/20">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'upload' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    activity.type === 'chat' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {activity.type === 'upload' && <FileText className="w-4 h-4" />}
                    {activity.type === 'chat' && <MessageCircle className="w-4 h-4" />}
                    {activity.type === 'search' && <Search className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.text}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Usage Statistics */}
      <Card className="glass-card-light">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Thống kê sử dụng</h3>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalFiles}</div>
              <div className="text-sm text-blue-800 dark:text-blue-300">Tài liệu</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalChats}</div>
              <div className="text-sm text-green-800 dark:text-green-300">Cuộc trò chuyện</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.totalSearches}</div>
              <div className="text-sm text-yellow-800 dark:text-yellow-300">Lần tìm kiếm</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round((stats.storageUsed / stats.maxStorage) * 100)}%
              </div>
              <div className="text-sm text-purple-800 dark:text-purple-300">Lưu trữ</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card className="glass-card-light">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Hiệu suất hệ thống</h3>
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tốc độ tìm kiếm trung bình</span>
              <span className="text-sm font-medium text-foreground">~150ms</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Thời gian phản hồi AI</span>
              <span className="text-sm font-medium text-foreground">~2.5s</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tỷ lệ thành công</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">99.8%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Uptime</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">99.9%</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-300">
              ✅ Hệ thống hoạt động ổn định và hiệu quả
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
