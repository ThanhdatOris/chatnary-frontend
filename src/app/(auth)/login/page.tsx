'use client'

import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Đăng nhập vào tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Hoặc{' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              tạo tài khoản mới
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
