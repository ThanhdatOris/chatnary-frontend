'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  colors?: string[];
  showCustomInput?: boolean;
}

const DEFAULT_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#a855f7', // Purple
];

export default function ColorPicker({
  value,
  onChange,
  label,
  disabled = false,
  className,
  colors = DEFAULT_COLORS,
  showCustomInput = true,
}: ColorPickerProps) {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="space-y-3">
        {/* Preset Colors */}
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              disabled={disabled}
              className={cn(
                'relative w-8 h-8 rounded-full border-2 transition-all duration-200',
                'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                value === color
                  ? 'border-gray-900 dark:border-gray-100 shadow-lg'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              )}
              style={{ backgroundColor: color }}
              title={`Chọn màu ${color}`}
            >
              {value === color && (
                <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-sm" />
              )}
            </button>
          ))}
        </div>

        {/* Custom Color Input */}
        {showCustomInput && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowCustom(!showCustom)}
              disabled={disabled}
              className={cn(
                'text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {showCustom ? 'Ẩn màu tùy chỉnh' : 'Chọn màu tùy chỉnh'}
            </button>
            
            {showCustom && (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={disabled}
                  className={cn(
                    'w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600',
                    'bg-white dark:bg-gray-800 cursor-pointer',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                  aria-label="Chọn màu tùy chỉnh"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    placeholder="#000000"
                    className={cn(
                      'w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg',
                      'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-700'
                    )}
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
