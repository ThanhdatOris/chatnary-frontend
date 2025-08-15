'use client'

import { Card } from '@/components/ui'
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react'
import { useState } from 'react'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  dismissible?: boolean
}

interface SystemNotificationProps {
  notifications?: Notification[]
  onDismiss?: (id: string) => void
}

const defaultNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'Cập nhật hệ thống',
    message: 'Phiên bản mới đã được cập nhật với các tính năng cải tiến.',
    timestamp: new Date(),
    dismissible: true
  },
  {
    id: '2',
    type: 'success',
    title: 'Tài liệu đã được xử lý',
    message: 'Tất cả tài liệu đã được index thành công và sẵn sàng tìm kiếm.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    dismissible: false
  }
]

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'info':
      return <Info className="w-5 h-5 text-blue-600" />
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-600" />
    case 'warning':
      return <AlertCircle className="w-5 h-5 text-yellow-600" />
    case 'error':
      return <XCircle className="w-5 h-5 text-red-600" />
  }
}

const getBgColor = (type: Notification['type']) => {
  switch (type) {
    case 'info':
      return 'bg-blue-50 border-blue-200'
    case 'success':
      return 'bg-green-50 border-green-200'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200'
    case 'error':
      return 'bg-red-50 border-red-200'
  }
}

const getTextColor = (type: Notification['type']) => {
  switch (type) {
    case 'info':
      return 'text-blue-800'
    case 'success':
      return 'text-green-800'
    case 'warning':
      return 'text-yellow-800'
    case 'error':
      return 'text-red-800'
  }
}

export default function SystemNotification({ 
  notifications = defaultNotifications,
  onDismiss 
}: SystemNotificationProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([])

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id])
    onDismiss?.(id)
  }

  const visibleNotifications = notifications.filter(
    notification => !dismissedIds.includes(notification.id)
  )

  if (visibleNotifications.length === 0) {
    return null
  }

  return (
    <div className="space-y-3 mb-6">
      {visibleNotifications.map((notification) => (
        <Card key={notification.id} className={`border ${getBgColor(notification.type)}`}>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-medium ${getTextColor(notification.type)}`}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-700 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {notification.timestamp.toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              
              {notification.dismissible && (
                <button
                  onClick={() => handleDismiss(notification.id)}
                  className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600"
                  title="Đóng thông báo"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
