'use client'

import { api, API_ENDPOINTS } from '@/lib/api'
import { isBypassMode, mockChatHistory, mockFiles } from '@/lib/mockData'
import { useEffect, useState } from 'react'

interface Stats {
  totalFiles: number
  totalChats: number
  totalSearches: number
  storageUsed: number
  maxStorage: number
}

interface UseStatsReturn {
  stats: Stats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      if (isBypassMode()) {
        // Simple mock stats
        const totalSize = mockFiles.reduce((sum, f) => sum + f.size, 0)
        setStats({
          totalFiles: mockFiles.length,
          totalChats: mockChatHistory.length,
          totalSearches: 24,
          storageUsed: totalSize,
          maxStorage: 1073741824,
        })
      } else {
        const response = await api.get(API_ENDPOINTS.search.stats)
        if (response.data.success) {
          const backendStats = response.data.stats
          setStats({
            totalFiles: backendStats.totalFiles || 0,
            totalChats: backendStats.totalChats || 0,
            totalSearches: backendStats.totalSearches || 0,
            storageUsed: backendStats.storageUsed || 0,
            maxStorage: backendStats.maxStorage || 1073741824, // 1GB default
          })
        } else {
          setError(response.data.message || 'Failed to fetch stats')
        }
      }
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch stats'
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response
        if (response?.data?.message) {
          errorMessage = response.data.message
        }
      }
      setError(errorMessage)
      // Set default stats on error
      setStats({
        totalFiles: 0,
        totalChats: 0,
        totalSearches: 0,
        storageUsed: 0,
        maxStorage: 1073741824,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

export default useStats
