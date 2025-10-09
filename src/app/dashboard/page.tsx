'use client';

import MainLayout from '@/components/layout/MainLayout';
import { Button, Card, CardContent, CardHeader, CardTitle, Loading } from '@/components/ui';
import { chatsApi, documentsApi, statsApi } from '@/lib/api';
import { ChatSession, Document, OverviewStats } from '@/lib/types';
import { formatDate, formatFileSize, getFileIcon } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const [recentChats, setRecentChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [statsRes, docsRes, chatsRes] = await Promise.all([
          statsApi.getOverviewStats(),
          documentsApi.getDocuments({ limit: 3, sortBy: 'uploadedAt', sortOrder: 'desc' }),
          chatsApi.getChats({ limit: 3 }),
        ]);

        if (statsRes.success && statsRes.data) setStats(statsRes.data);
        if (docsRes.success && docsRes.data) setRecentDocs(docsRes.data.items);
        if (chatsRes.success && chatsRes.data) setRecentChats(chatsRes.data.items);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading size="lg" text="Đang tải..." />
        </div>
      </MainLayout>
    );
  }

  const storagePercent = stats
    ? Math.round((stats.storageUsed / stats.storageLimit) * 100)
    : 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Tổng quan hoạt động của bạn
            </p>
          </div>
          <Link href="/documents">
            <Button>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload tài liệu
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="bordered">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tài liệu
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {stats?.totalDocuments || 0}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    +{stats?.documentsThisMonth || 0} tháng này
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cuộc trò chuyện
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {stats?.totalChats || 0}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    +{stats?.chatsThisMonth || 0} tháng này
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tin nhắn
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {stats?.totalMessages || 0}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    +{stats?.messagesThisMonth || 0} tháng này
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="p-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Dung lượng
                </p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatFileSize(stats?.storageUsed || 0)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    / {formatFileSize(stats?.storageLimit || 0)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${storagePercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {storagePercent}% đã sử dụng
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Documents & Chats */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Documents */}
          <Card variant="bordered">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle>Tài liệu gần đây</CardTitle>
                <Link href="/documents">
                  <Button variant="ghost" size="sm">
                    Xem tất cả
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentDocs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Chưa có tài liệu nào
                  </div>
                ) : (
                  recentDocs.map((doc) => (
                    <Link key={doc.id} href={`/documents`}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="text-3xl">{getFileIcon(doc.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {doc.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatFileSize(doc.size)} • {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          doc.status === 'completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {doc.status === 'completed' ? 'Hoàn tất' : 'Đang xử lý'}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Chats */}
          <Card variant="bordered">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle>Trò chuyện gần đây</CardTitle>
                <Link href="/history">
                  <Button variant="ghost" size="sm">
                    Xem tất cả
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentChats.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Chưa có cuộc trò chuyện nào
                  </div>
                ) : (
                  recentChats.map((chat) => (
                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                      <div className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {chat.title}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(chat.updatedAt)}
                          </span>
                        </div>
                        {chat.lastMessage && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {chat.lastMessage.content}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {chat.messageCount} tin nhắn
                          </span>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {chat.documents?.length || 0} tài liệu
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card variant="bordered">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <CardTitle>Hành động nhanh</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/documents">
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload tài liệu mới
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Bắt đầu chat mới
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Xem lịch sử chat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

