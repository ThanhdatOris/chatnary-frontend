'use client'

import AdvancedStats from '@/components/dashboard/AdvancedStats';
import DashboardStats from '@/components/dashboard/DashboardStats';
import QuickActions from '@/components/dashboard/QuickActions';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { SystemNotification } from '@/components/ui';
import Loading from '@/components/ui/Loading';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <div className="flex min-h-screen">
        <Sidebar 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 lg:ml-64 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Chào mừng trở lại, {user?.fullName || user?.email}!
              </h1>
              <p className="text-gray-600">
                Quản lý tài liệu và trò chuyện với AI một cách dễ dàng.
              </p>
            </div>

            {/* System Notifications */}
            <SystemNotification />

            {/* Dashboard Stats */}
            <DashboardStats />

            {/* Advanced Stats */}
            <AdvancedStats />

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </main>
      </div>
    </div>
  );
}
