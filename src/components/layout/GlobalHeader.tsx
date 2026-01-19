'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { useProject } from '@/hooks/useProject';
import { Menu, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProfileMenu from './ProfileMenu';
import ThemeToggle from './ThemeToggle';

export default function GlobalHeader() {
  const { project } = useProject();
  const router = useRouter();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <header 
      className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-4 sticky top-0 z-40"
    >
      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title={isCollapsed ? "Mở sidebar" : "Thu gọn sidebar"}
      >
        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
      {/* Left: Logo & Brand */}
      <div className="flex items-center gap-2">
        <Link href="/notebook" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src="/logo-192.png"
              alt="Chatnary Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Chatnary
          </span>
        </Link>
      </div>

      {/* Center: Project Name */}
      <div className="flex-1 flex items-center justify-center">
        {project && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: project.color }}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {project.name}
            </span>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Settings */}
        <button
          onClick={() => router.push('/settings')}
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Cài đặt"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Profile Menu */}
        <ProfileMenu />
      </div>
    </header>
  );
}
