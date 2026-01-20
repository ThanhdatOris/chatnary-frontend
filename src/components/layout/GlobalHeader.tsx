import { useSidebar } from '@/contexts/SidebarContext';
import { useProject } from '@/hooks/useProject';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu, Settings } from 'lucide-react';
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
      className={cn(
        "h-12 border-b flex items-center px-4 gap-4 sticky top-0 z-40 transition-all duration-300 relative",
        project?.color 
          ? "border-transparent text-white" 
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
      )}
      style={project?.color ? {
         backgroundColor: project.color,
      } : {}}
    >
      {/* Dynamic Background Pattern (Watermark) */}
      {project?.color && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
           {/* Icon Watermark - Positioned to the right or scattered */}
           <div className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12">
              {/* Replace with Dynamic Icon if available, using generic BookOpen for now to match NotebookPage */}
              <Settings className="w-64 h-64" /> 
           </div>
           {/* Secondary decorative circle */}
           <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      )}

      {/* Content Layer (z-10) */}
      <div className="relative z-10 flex items-center w-full gap-4">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            project?.color ? "hover:bg-white/20 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
          title={isCollapsed ? "Mở sidebar" : "Thu gọn sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Text */}
        <Link href="/notebook" className="hover:opacity-80 transition-opacity">
           <span className={cn("text-xl font-bold tracking-tight", project?.color ? "text-white" : "text-gray-900 dark:text-gray-100")}>
             Chatnary
           </span>
        </Link>



        {/* Center: Project Name with Pill Style */}
        <div className="flex-1 flex items-center justify-center">
          {project && (
            <Link href={`/notebook?project=${project.id}`}>
              <button className={cn(
                  "flex items-center gap-2 px-6 py-1.5 rounded-full transition-all group backdrop-blur-sm shadow-sm",
                  project.color 
                    ? "bg-white/20 hover:bg-white/30 text-white border border-white/10" 
                    : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100"
                )}>
                {/* Removed Color Dot */}
                <span className="text-sm font-semibold tracking-wide">
                  {project.name}
                </span>
                <ChevronDown className={cn(
                    "w-4 h-4 transition-colors",
                    project.color ? "text-white/70 group-hover:text-white" : "text-gray-500"
                  )} 
                />
              </button>
            </Link>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
        {/* ThemeToggle */}
        <div className={project?.color ? "[&_button]:!text-white [&_button]:hover:!bg-white/20 [&_svg]:!text-white" : ""}>
           <ThemeToggle />
        </div>

          {/* Settings */}
          <button
            onClick={() => {
              if (project) {
                router.push(`/settings?project=${project.id}`);
              } else {
                router.push('/settings');
              }
            }}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
              project?.color ? "hover:bg-white/20 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            )}
            title="Cài đặt"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Profile Menu - Likely needs style adjustment or wrapper */}
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
