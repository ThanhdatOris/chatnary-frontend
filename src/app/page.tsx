'use client';

import { ArrowRight, Layout, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">Chatnary</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <button className="px-5 py-2 text-gray-600 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors">
              Đăng nhập
            </button>
          </Link>
          <Link href="/auth/register">
            <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20">
              Đăng ký
            </button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 pb-2">
            Quản lý tài liệu thông minh &<br/>Trò chuyện cùng AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Tổ chức tài liệu của bạn theo dự án và khai thác sức mạnh của AI để tìm kiếm, tóm tắt và hỏi đáp trực tiếp.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/register">
              <button className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-xl">
                Bắt đầu ngay <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
                Đã có tài khoản?
              </button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
              <Layout className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Tổ chức Dự án</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tạo không gian làm việc riêng biệt cho từng dự án, giúp quản lý tài liệu khoa học và dễ dàng.
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">AI Mạnh mẽ</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Sử dụng các mô hình AI tiên tiến nhất để phân tích nội dung và trả lời câu hỏi của bạn ngay lập tức.
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Bảo mật</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Dữ liệu của bạn được mã hóa và bảo vệ an toàn. Nội dung tài liệu chỉ được sử dụng cho mục đích của bạn.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
