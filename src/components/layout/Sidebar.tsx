"use client";

import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { BarChart3, Bookmark, BookOpen, BrainCircuit, MessageSquare, NotebookPen } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  isDivider?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// Function to generate navigation items with project context
const getNavSections = (projectId?: string): NavSection[] => [
  {
    title: "",
    items: [
      {
        name: 'Dashboard',
        href: projectId ? `/dashboard?project=${projectId}` : '/dashboard',
        icon: <BarChart3 className="w-5 h-5" />,
      },
      {
        name: 'Chat với AI',
        href: projectId ? `/chat?project=${projectId}` : '/chat',
        icon: <MessageSquare className="w-5 h-5" />,
      },
      {
        name: '[Thư viện]',
        href: '#',
        icon: null,
        isDivider: true,
      },
      {
        name: 'Tài liệu',
        href: projectId ? `/documents?project=${projectId}` : '/documents',
        icon: <BookOpen className="w-5 h-5" />,
      },
      {
        name: 'Sổ tay',
        href: projectId ? `/notebook?project=${projectId}` : '/notebook',
        icon: <NotebookPen className="w-5 h-5" />,
      },
      {
        name: 'Bookmark',
        href: projectId ? `/bookmark?project=${projectId}` : '/bookmark',
        icon: <Bookmark className="w-5 h-5" />,
      },
      {
        name: 'Quiz',
        href: projectId ? `/quiz?project=${projectId}` : '/quiz',
        icon: <BrainCircuit className="w-5 h-5" />,
      },
    ],
  },
];

// Loading skeleton for Sidebar when Suspense is triggered
function SidebarSkeleton() {
  return (
    <aside className="flex flex-col fixed inset-y-0 left-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 w-64">
      {/* Logo skeleton */}
      <div className="h-12 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="ml-2 w-24 h-6 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
      {/* Nav skeleton */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <div className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="w-20 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}

// Wrapper component with Suspense boundary for useSearchParams
export default function Sidebar() {
  return (
    <Suspense fallback={<SidebarSkeleton />}>
      <SidebarContent />
    </Suspense>
  );
}

function SidebarContent() {
  const pathname = usePathname();
  const { sidebarWidth, setSidebarWidth, isCollapsed } =
    useSidebar();
  const [isResizing, setIsResizing] = useState(false);
  const searchParams = useSearchParams();
  const currentProjectId = searchParams.get("project");
  
  // Get project for color sync


  // Get navigation sections with current project context
  const navSections = getNavSections(currentProjectId || undefined);

  useEffect(() => {
    if (isResizing) {
      // Disable text selection globally while resizing
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";

      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 400) {
          setSidebarWidth(newWidth);
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        // Re-enable text selection
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        // Cleanup in case component unmounts during resize
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      };
    }
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <aside
        className={cn(
          "flex flex-col fixed top-12 bottom-0 left-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
          !isResizing && "transition-[width] duration-200"
        )}
        style={{ width: isCollapsed ? "64px" : `${sidebarWidth}px` }}
      >
        {/* Navigation Sections - Custom Scrollbar */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
          {!isCollapsed ? (
            <>
              {/* Main Navigation */}
              {navSections.map((section) => (
                <div key={section.title || "main"}>
                  {section.title && (
                    <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item, index) => {
                      // Handle divider
                      if (item.isDivider) {
                        return (
                          <div
                            key={`divider-${index}`}
                            className="px-3 py-2 my-2"
                          >
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {item.name}
                            </div>
                          </div>
                        );
                      }

                      // Extract path from href (remove query string)
                      const itemPath = item.href.split('?')[0];
                      // Check if current pathname matches the item path
                      const isActive = pathname === itemPath || pathname?.startsWith(itemPath + '/');
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm relative",
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          )}
                        >
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r" />
                          )}
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {/* Collapsed Navigation - Icons Only */}
              <div className="space-y-2">
                {navSections.flatMap(section => section.items).map((item, index) => {
                  // Skip dividers in collapsed mode
                  if (item.isDivider) {
                    return (
                      <div
                        key={`divider-${index}`}
                        className="my-1 border-t border-gray-200 dark:border-gray-700"
                      />
                    );
                  }

                  // Extract path from href (remove query string)
                  const itemPath = item.href.split('?')[0];
                  // Check if current pathname matches the item path
                  const isActive = pathname === itemPath || pathname?.startsWith(itemPath + '/');
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center justify-center p-2.5 rounded-lg transition-colors relative',
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      )}
                      title={item.name}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r" />
                      )}
                      {item.icon}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </nav>

        {/* Resize Handle - Hidden when collapsed */}
        {!isCollapsed && (
          <div
            className={cn(
              "absolute right-0 top-0 bottom-0 cursor-col-resize transition-all select-none",
              isResizing
                ? "w-1.5 bg-blue-500"
                : "w-1 hover:bg-blue-500 hover:w-1.5"
            )}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
            }}
            style={{ userSelect: "none" }}
          />
        )}
      </aside>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(209 213 219 / 0.5);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(156 163 175 / 0.7);
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(75 85 99 / 0.5);
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(107 114 128 / 0.7);
        }
      `}</style>
    </>
  );
}
