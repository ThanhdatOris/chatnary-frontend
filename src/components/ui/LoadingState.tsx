'use client';

interface LoadingStateProps {
  title?: string;
  message?: string;
  showSpinner?: boolean;
}

export default function LoadingState({
  title = "Đang tải...",
  message = "Vui lòng đợi trong giây lát",
  showSpinner = true
}: LoadingStateProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Loading Animation */}
        {showSpinner && (
          <div className="mx-auto w-16 h-16 mb-6">
            <div className="relative">
              {/* Outer ring */}
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-gray-700"></div>
              {/* Spinning ring */}
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
            </div>
          </div>
        )}

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>

        {/* Loading dots animation */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        </div>
      </div>
    </div>
  );
}