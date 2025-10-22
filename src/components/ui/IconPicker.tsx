'use client';

import { cn } from '@/lib/utils';
import {
    BarChart3,
    Book,
    Briefcase,
    Building,
    Camera,
    Code,
    Coffee,
    Cpu,
    Database,
    FileText,
    Folder,
    Globe,
    Heart,
    Home,
    Layers,
    LucideIcon,
    Mail,
    Monitor,
    Music,
    Palette,
    PenTool,
    Rocket,
    Settings,
    Shield,
    Star,
    Target,
    Users,
    Zap
} from 'lucide-react';

interface IconOption {
  icon: LucideIcon;
  name: string;
  label: string;
}

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  icons?: IconOption[];
  size?: 'sm' | 'md' | 'lg';
}

const DEFAULT_ICONS: IconOption[] = [
  { icon: Folder, name: 'folder', label: 'Thư mục' },
  { icon: FileText, name: 'file-text', label: 'Tài liệu' },
  { icon: Code, name: 'code', label: 'Lập trình' },
  { icon: Database, name: 'database', label: 'Cơ sở dữ liệu' },
  { icon: Globe, name: 'globe', label: 'Web' },
  { icon: Rocket, name: 'rocket', label: 'Khởi nghiệp' },
  { icon: Briefcase, name: 'briefcase', label: 'Công việc' },
  { icon: Building, name: 'building', label: 'Công ty' },
  { icon: Users, name: 'users', label: 'Nhóm' },
  { icon: BarChart3, name: 'bar-chart-3', label: 'Phân tích' },
  { icon: Target, name: 'target', label: 'Mục tiêu' },
  { icon: Star, name: 'star', label: 'Yêu thích' },
  { icon: Heart, name: 'heart', label: 'Sở thích' },
  { icon: Camera, name: 'camera', label: 'Ảnh' },
  { icon: Music, name: 'music', label: 'Âm nhạc' },
  { icon: Book, name: 'book', label: 'Học tập' },
  { icon: Coffee, name: 'coffee', label: 'Cà phê' },
  { icon: Home, name: 'home', label: 'Nhà' },
  { icon: Mail, name: 'mail', label: 'Email' },
  { icon: Monitor, name: 'monitor', label: 'Màn hình' },
  { icon: Cpu, name: 'cpu', label: 'Xử lý' },
  { icon: Layers, name: 'layers', label: 'Lớp' },
  { icon: Palette, name: 'palette', label: 'Thiết kế' },
  { icon: PenTool, name: 'pen-tool', label: 'Vẽ' },
  { icon: Settings, name: 'settings', label: 'Cài đặt' },
  { icon: Shield, name: 'shield', label: 'Bảo mật' },
  { icon: Zap, name: 'zap', label: 'Năng lượng' },
];

const ICON_SIZES = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const BUTTON_SIZES = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export default function IconPicker({
  value,
  onChange,
  label,
  disabled = false,
  className,
  icons = DEFAULT_ICONS,
  size = 'md',
}: IconPickerProps) {
  const selectedIcon = icons.find(icon => icon.name === value);

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      {/* Selected Icon Display */}
      {selectedIcon && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <selectedIcon.icon className={cn(ICON_SIZES[size], 'text-gray-600 dark:text-gray-400')} />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {selectedIcon.label}
          </span>
        </div>
      )}

      {/* Icon Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
        {icons.map((iconOption) => {
          const isSelected = value === iconOption.name;
          
          return (
            <button
              key={iconOption.name}
              type="button"
              onClick={() => onChange(iconOption.name)}
              disabled={disabled}
              className={cn(
                BUTTON_SIZES[size],
                'flex items-center justify-center rounded-lg border-2 transition-all duration-200',
                'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
              title={iconOption.label}
            >
              <iconOption.icon className={ICON_SIZES[size]} />
            </button>
          );
        })}
      </div>
      
      {!selectedIcon && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Chọn một biểu tượng cho project của bạn
        </p>
      )}
    </div>
  );
}

export { DEFAULT_ICONS, type IconOption };
