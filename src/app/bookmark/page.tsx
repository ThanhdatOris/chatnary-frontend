"use client";

import MainLayout from "@/components/layout/MainLayout";
import { Button, Loading } from "@/components/ui";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function BookmarksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <Loading size="lg" text="Đang tải..." />
        </div>
      }
    >
      <BookmarksPageContent />
    </Suspense>
  );
}

function BookmarksPageContent() {
  const router = useRouter();

  return (
    <MainLayout
      headerTitle="Đã lưu"
      headerSubtitle="Các mục quan trọng bạn đã đánh dấu"
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
         <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Bookmark className="w-10 h-10 text-gray-400" />
         </div>
         <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Chưa có mục nào được lưu
         </h2>
         <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
            Tính năng đang được phát triển. Bạn sẽ sớm có thể lưu lại các đoạn chat, tài liệu quan trọng hoặc kết quả trắc nghiệm tại đây.
         </p>
         
         <div className="flex gap-4">
            <Button variant="secondary" onClick={() => router.push('/documents')}>
               Khám phá tài liệu
            </Button>
            <Button onClick={() => router.push('/chat')}>
               Tạo cuộc trò chuyện
            </Button>
         </div>
      </div>
    </MainLayout>
  );
}
