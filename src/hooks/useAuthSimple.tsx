'use client'

import { useRouter } from 'next/navigation'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state on mount
  useEffect(() => {
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement actual login
      console.log('Login attempt:', email, password)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: 'Login failed' 
      }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      // TODO: Implement actual register
      console.log('Register attempt:', name, email, password)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: 'Registration failed' 
      }
    }
  }

  const logout = () => {
    setUser(null)
    router.push('/')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
