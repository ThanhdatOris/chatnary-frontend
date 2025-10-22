import { BreadcrumbItem, useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { BarChart3, FileText, Home, LucideIcon, MessageSquare, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Mapping của routes tới breadcrumb labels và icons
const routeConfig: Record<string, { label: string; icon?: LucideIcon }> = {
  '/': { label: 'Trang chủ', icon: Home },
  '/dashboard': { label: 'Dashboard', icon: BarChart3 },
  '/documents': { label: 'Tài liệu', icon: FileText },
  '/chat': { label: 'Trò chuyện', icon: MessageSquare },
  '/settings': { label: 'Cài đặt', icon: Settings },
};

// Dynamic route patterns
const dynamicRoutes = [
  {
    pattern: /^\/chat\/(.+)$/,
    getLabel: (matches: RegExpMatchArray) => `Chat #${matches[1].substring(0, 8)}`,
    icon: MessageSquare
  },
  {
    pattern: /^\/documents\/(.+)$/,
    getLabel: (matches: RegExpMatchArray) => `Tài liệu #${matches[1].substring(0, 8)}`,
    icon: FileText
  }
];

export function useBreadcrumbNavigation() {
  const pathname = usePathname();
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    const generateBreadcrumbs = (): BreadcrumbItem[] => {
      const breadcrumbs: BreadcrumbItem[] = [];

      // Luôn bắt đầu với Home nếu không phải trang chủ
      if (pathname !== '/') {
        const HomeIcon = routeConfig['/'].icon;
        breadcrumbs.push({
          label: routeConfig['/'].label,
          href: '/',
          icon: HomeIcon ? <HomeIcon className="w-4 h-4" /> : undefined,
        });
      }

      // Split pathname thành segments
      const segments = pathname.split('/').filter(Boolean);
      let currentPath = '';

      segments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const isLast = index === segments.length - 1;

        // Kiểm tra exact match trước
        if (routeConfig[currentPath]) {
          const config = routeConfig[currentPath];
          const Icon = config.icon;
          
          breadcrumbs.push({
            label: config.label,
            href: isLast ? undefined : currentPath,
            icon: Icon ? <Icon className="w-4 h-4" /> : undefined,
            isActive: isLast,
          });
          return;
        }

        // Kiểm tra dynamic routes
        for (const dynamicRoute of dynamicRoutes) {
          const matches = currentPath.match(dynamicRoute.pattern);
          if (matches) {
            const Icon = dynamicRoute.icon;
            
            breadcrumbs.push({
              label: dynamicRoute.getLabel(matches),
              href: isLast ? undefined : currentPath,
              icon: Icon ? <Icon className="w-4 h-4" /> : undefined,
              isActive: isLast,
            });
            return;
          }
        }

        // Fallback: capitalize segment
        const fallbackLabel = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        breadcrumbs.push({
          label: fallbackLabel,
          href: isLast ? undefined : currentPath,
          isActive: isLast,
        });
      });

      return breadcrumbs;
    };

    const newBreadcrumbs = generateBreadcrumbs();
    setBreadcrumbs(newBreadcrumbs);
  }, [pathname, setBreadcrumbs]);

  // Helper function để manually set breadcrumbs
  const setCustomBreadcrumbs = (breadcrumbs: BreadcrumbItem[]) => {
    setBreadcrumbs(breadcrumbs);
  };

  // Helper function để add project context
  const addProjectContext = (projectName: string) => {
    setBreadcrumbs((prev: BreadcrumbItem[]) => {
      // Insert project context after Home but before other items
      const newBreadcrumbs = [...prev];
      if (newBreadcrumbs.length > 0 && newBreadcrumbs[0].href === '/') {
        newBreadcrumbs.splice(1, 0, {
          label: projectName,
          icon: <FileText className="w-4 h-4" />,
        });
      }
      return newBreadcrumbs;
    });
  };

  return {
    setCustomBreadcrumbs,
    addProjectContext,
  };
}

export default useBreadcrumbNavigation;