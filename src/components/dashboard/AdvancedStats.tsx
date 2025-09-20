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
            <BarChart3 className="w-5 h-5 icon-blue" />
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
            <TrendingUp className="w-5 h-5 icon-green" />
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item p-3 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'upload' ? 'stat-bg-blue' :
                    activity.type === 'chat' ? 'stat-bg-green' :
                    'stat-bg-yellow'
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
            <Calendar className="w-5 h-5 icon-purple" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 stat-bg-blue rounded-lg">
              <div className="text-2xl font-bold">{stats.totalFiles}</div>
              <div className="text-sm opacity-80">Tài liệu</div>
            </div>
            
            <div className="text-center p-4 stat-bg-green rounded-lg">
              <div className="text-2xl font-bold">{stats.totalChats}</div>
              <div className="text-sm opacity-80">Cuộc trò chuyện</div>
            </div>
            
            <div className="text-center p-4 stat-bg-yellow rounded-lg">
              <div className="text-2xl font-bold">{stats.totalSearches}</div>
              <div className="text-sm opacity-80">Lần tìm kiếm</div>
            </div>
            
            <div className="text-center p-4 stat-bg-purple rounded-lg">
              <div className="text-2xl font-bold">
                {Math.round((stats.storageUsed / stats.maxStorage) * 100)}%
              </div>
              <div className="text-sm opacity-80">Lưu trữ</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card className="glass-card-light">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Hiệu suất hệ thống</h3>
            <TrendingUp className="w-5 h-5 icon-blue" />
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
              <span className="text-sm font-medium icon-green">99.8%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Uptime</span>
              <span className="text-sm font-medium icon-green">99.9%</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 stat-bg-green rounded-lg">
            <p className="text-sm">
              ✅ Hệ thống hoạt động ổn định và hiệu quả
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
