'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import ErrorPage from '../ui/ErrorPage';

export default function ChatNotFound() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const handleCreateNewChat = () => {
    const url = projectId ? `/chat?project=${projectId}` : '/chat';
    router.push(url);
  };

  return (
    <ErrorPage
      title="Cuộc trò chuyện không tồn tại"
      message="Cuộc trò chuyện này có thể đã bị xóa hoặc bạn không có quyền truy cập. Bạn có thể tạo cuộc trò chuyện mới hoặc quay lại danh sách chat."
      statusCode={404}
      actionButton={{
        text: "🚀 Tạo cuộc trò chuyện mới",
        onClick: handleCreateNewChat,
        variant: 'primary'
      }}
      showBackButton={true}
      showHomeButton={true}
    />
  );
}