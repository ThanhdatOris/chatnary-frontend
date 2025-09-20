'use client'

import { api, API_ENDPOINTS, handleApiError } from '@/lib/api'
import { AuthUtils } from '@/lib/auth'
import { LoginCredentials, RegisterData, User } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = AuthUtils.getToken()
      const BYPASS = process.env.NEXT_PUBLIC_BYPASS_AUTH === '1'

      // Dev bypass: nếu chưa có token và bật cờ thì dev-login để nhận token
      if (!token && BYPASS) {
        try {
          const resp = await api.post(API_ENDPOINTS.auth.devLogin)
          const { success, token: devToken, user: devUser } = resp.data || {}
          if (success && devToken && devUser) {
            AuthUtils.login(devToken, devUser)
            setUser(devUser)
            setLoading(false)
            return
          }
        } catch {
          // ignore, fallback to normal flow
        }
      }

      if (!token) {
        setLoading(false)
        return
      }

      // Verify token with backend using profile endpoint
      const response = await api.get(API_ENDPOINTS.auth.profile)
      const userData = response.data.user || response.data

      if (userData) {
        setUser(userData)
        AuthUtils.setUser(userData)
      } else {
        AuthUtils.logout()
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      AuthUtils.logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.auth.login, credentials)
      const { success, token, user: userData, message } = response.data

      if (success && token && userData) {
        AuthUtils.login(token, userData)
        setUser(userData)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: message || 'Đăng nhập thất bại' 
        }
      }
    } catch (error: unknown) {
      return { 
        success: false, 
        error: handleApiError(error) 
      }
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await api.post(API_ENDPOINTS.auth.register, data)
      const { success, token, user: userData, message } = response.data

      if (success && token && userData) {
        AuthUtils.login(token, userData)
        setUser(userData)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: message || 'Đăng ký thất bại' 
        }
      }
    } catch (error: unknown) {
      return { 
        success: false, 
        error: handleApiError(error) 
      }
    }
  }

  const logout = () => {
    AuthUtils.logout()
    setUser(null)
    router.push('/')
  }

  const refreshUser = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.auth.profile)
      const userData = response.data.user || response.data
      
      setUser(userData)
      AuthUtils.setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      logout()
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser
  }

  return AuthContext.Provider({ value, children })
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
