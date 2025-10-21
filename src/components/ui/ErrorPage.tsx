'use client';

import { useRouter } from 'next/navigation';
import Button from './Button';

interface ErrorPageProps {
  title?: string;
  message?: string;
  statusCode?: number;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  actionButton?: {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  };
}

export default function ErrorPage({
  title = "Có lỗi xảy ra",
  message = "Không thể tìm thấy nội dung bạn đang tìm kiếm.",
  statusCode,
  showBackButton = true,
  showHomeButton = true,
  actionButton
}: ErrorPageProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mx-auto w-24 h-24 mb-8">
          <div className="w-full h-full rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-red-500 dark:text-red-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
              />
            </svg>
          </div>
        </div>

        {/* Error Code */}
        {statusCode && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-full">
              HTTP {statusCode}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h1>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {actionButton && (
            <Button
              onClick={actionButton.onClick}
              variant={actionButton.variant || 'primary'}
              className="w-full"
            >
              {actionButton.text}
            </Button>
          )}
          
          <div className="flex gap-3">
            {showBackButton && (
              <Button
                onClick={handleBack}
                variant="secondary"
                className="flex-1"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại
              </Button>
            )}
            
            {showHomeButton && (
              <Button
                onClick={handleHome}
                variant="primary"
                className="flex-1"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Về trang chủ
              </Button>
            )}
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Cần trợ giúp?
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <button 
              onClick={() => router.push('/docs')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              📚 Tài liệu
            </button>
            <button 
              onClick={() => router.push('/support')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              💬 Hỗ trợ
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              🔄 Tải lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}