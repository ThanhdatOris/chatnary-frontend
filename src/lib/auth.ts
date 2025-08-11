import Cookies from 'js-cookie'
import { User } from './types'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export class AuthUtils {
  static setToken(token: string): void {
    Cookies.set(TOKEN_KEY, token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
  }

  static getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY)
  }

  static removeToken(): void {
    Cookies.remove(TOKEN_KEY)
  }

  static setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  static getUser(): User | null {
    try {
      const userStr = localStorage.getItem(USER_KEY)
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  }

  static removeUser(): void {
    localStorage.removeItem(USER_KEY)
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }

  static logout(): void {
    this.removeToken()
    this.removeUser()
    window.location.href = '/login'
  }

  static login(token: string, user: User): void {
    this.setToken(token)
    this.setUser(user)
  }
}

// JWT Token utilities
export function parseJWT(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = parseJWT(token)
    if (!decoded || typeof decoded.exp !== 'number') return true
    
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch {
    return true
  }
}

export function getTokenExpiry(token: string): Date | null {
  try {
    const decoded = parseJWT(token)
    if (!decoded || typeof decoded.exp !== 'number') return null
    
    return new Date(decoded.exp * 1000)
  } catch {
    return null
  }
}
