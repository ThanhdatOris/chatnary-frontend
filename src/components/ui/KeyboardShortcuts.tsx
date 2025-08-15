'use client'

import { Modal } from '@/components/ui'
import { Home, MessageSquare, Search, Settings, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Shortcut {
  key: string
  description: string
  icon: React.ReactNode
}

const shortcuts: Shortcut[] = [
  {
    key: '⌘ + K',
    description: 'Tìm kiếm nhanh',
    icon: <Search className="w-4 h-4" />
  },
  {
    key: '⌘ + C',
    description: 'Mở chat',
    icon: <MessageSquare className="w-4 h-4" />
  },
  {
    key: '⌘ + U',
    description: 'Upload file',
    icon: <Upload className="w-4 h-4" />
  },
  {
    key: '⌘ + H',
    description: 'Về trang chủ',
    icon: <Home className="w-4 h-4" />
  },
  {
    key: '⌘ + ,',
    description: 'Mở cài đặt',
    icon: <Settings className="w-4 h-4" />
  }
]

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
  }, [])

  const formatKey = (key: string) => {
    if (isMac) {
      return key.replace('⌘', '⌘')
    } else {
      return key.replace('⌘', 'Ctrl')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts">
      <div className="space-y-4">
        <p className="text-sm text-gray-600 mb-6">
          Sử dụng các phím tắt để điều hướng nhanh hơn trong ứng dụng.
        </p>
        
        <div className="grid gap-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-gray-600">
                  {shortcut.icon}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {shortcut.description}
                </span>
              </div>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">
                {formatKey(shortcut.key)}
              </kbd>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Bạn có thể sử dụng phím tắt này ở bất kỳ đâu trong ứng dụng để truy cập nhanh các tính năng.
          </p>
        </div>
      </div>
    </Modal>
  )
}
