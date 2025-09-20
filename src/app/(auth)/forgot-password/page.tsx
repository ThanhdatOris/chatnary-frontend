'use client'

import { Button, Card, TextInput } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { api, API_ENDPOINTS } from '@/lib/api'
import { ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      showToast('Vui lòng nhập email', 'error')
      return
    }

    setLoading(true)
    try {
      await api.post(API_ENDPOINTS.auth.forgotPassword, { email: email.trim() })
      setSent(true)
      showToast('Email đã được gửi thành công', 'success')
    } catch {
      showToast('Không thể gửi email. Vui lòng thử lại.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Quên mật khẩu
            </h1>
            <p className="text-muted-foreground">
              Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <TextInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading || !email.trim()}
              >
                {loading ? 'Đang gửi...' : 'Gửi email'}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Email đã được gửi!
              </h2>
              <p className="text-muted-foreground">
                Vui lòng kiểm tra hộp thư email của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
              </p>
              <Button
                onClick={() => setSent(false)}
                variant="outline"
                className="w-full"
              >
                Gửi lại email
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại đăng nhập
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
