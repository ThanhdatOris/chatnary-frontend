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
    <div className="min-h-screen gradient-bg">
      <Header 
        user={user}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Chào mừng trở lại, {user?.fullName || user?.email}!
              </h1>
              <p className="text-foreground">
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
