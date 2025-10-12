/**
 * Utility functions
 */

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) return 'Vừa xong';
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  if (diffInDays < 7) return `${diffInDays} ngày trước`;
  
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format full date with time
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Get file icon URL for colorful CDN icons
export function getFileIcon(fileType: string): string {
  const getIconUrl = (iconName: string) => 
    `https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons@master/icons/file_type_${iconName}.svg`;
  
  let iconName = 'default';
  
  // Normalize fileType to lowercase for better matching
  const type = fileType.toLowerCase();
  
  // Documents
  if (type.includes('pdf')) iconName = 'pdf2';
  else if (type.includes('word') || type.includes('document') || type.includes('docx')) iconName = 'word';
  else if (type.includes('text') || type.includes('txt')) iconName = 'text';
  else if (type.includes('markdown') || type.includes('md')) iconName = 'markdown';
  
  // Spreadsheets
  else if (type.includes('excel') || type.includes('xlsx') || type.includes('xls')) iconName = 'excel';
  else if (type.includes('csv')) iconName = 'csv';
  
  // Presentations
  else if (type.includes('powerpoint') || type.includes('pptx') || type.includes('ppt')) iconName = 'powerpoint';
  
  // Images
  else if (type.includes('png')) iconName = 'png';
  else if (type.includes('jpg') || type.includes('jpeg')) iconName = 'jpg';
  else if (type.includes('gif')) iconName = 'gif';
  else if (type.includes('svg')) iconName = 'svg';
  else if (type.includes('image')) iconName = 'image';
  
  // Web files
  else if (type.includes('html') || type.includes('htm')) iconName = 'html';
  else if (type.includes('css')) iconName = 'css';
  else if (type.includes('javascript') || type.includes('js')) iconName = 'js';
  else if (type.includes('typescript') || type.includes('ts')) iconName = 'typescript';
  
  // Programming languages
  else if (type.includes('python') || type.includes('py')) iconName = 'python';
  else if (type.includes('java')) iconName = 'java';
  else if (type.includes('cpp') || type.includes('c++')) iconName = 'cpp';
  else if (type.includes('php')) iconName = 'php';
  else if (type.includes('ruby') || type.includes('rb')) iconName = 'ruby';
  else if (type.includes('go')) iconName = 'go';
  else if (type.includes('rust') || type.includes('rs')) iconName = 'rust';
  else if (type.includes('swift')) iconName = 'swift';
  else if (type.includes('kotlin') || type.includes('kt')) iconName = 'kotlin';
  
  // Data files
  else if (type.includes('json')) iconName = 'json';
  else if (type.includes('xml')) iconName = 'xml';
  else if (type.includes('yaml') || type.includes('yml')) iconName = 'yaml';
  else if (type.includes('toml')) iconName = 'toml';
  
  // Archives
  else if (type.includes('zip')) iconName = 'zip';
  else if (type.includes('rar')) iconName = 'rar';
  else if (type.includes('7z')) iconName = '7zip';
  else if (type.includes('tar')) iconName = 'tar';
  
  // Media
  else if (type.includes('video') || type.includes('mp4') || type.includes('avi') || type.includes('mov')) iconName = 'video';
  else if (type.includes('audio') || type.includes('mp3') || type.includes('wav') || type.includes('flac')) iconName = 'audio';
  
  // Design files
  else if (type.includes('sketch')) iconName = 'sketch';
  else if (type.includes('figma') || type.includes('fig')) iconName = 'figma';
  else if (type.includes('psd')) iconName = 'photoshop';
  else if (type.includes('ai')) iconName = 'illustrator';
  
  return getIconUrl(iconName);
}

// Helper function to get file icon component props
export function getFileIconProps(fileType: string) {
  return {
    src: getFileIcon(fileType),
    alt: `${fileType} file`,
    className: "w-8 h-8",
    style: { minWidth: '32px', minHeight: '32px' }
  };
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Calculate storage percentage
export function getStoragePercentage(used: number, limit: number): number {
  return Math.round((used / limit) * 100);
}

// Class name helper (similar to clsx)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Generate random ID
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Validate file type
export function isValidFileType(fileType: string): boolean {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
  ];
  return allowedTypes.includes(fileType);
}

// Validate file size (max 50MB)
export function isValidFileSize(fileSize: number, maxSize: number = 50 * 1024 * 1024): boolean {
  return fileSize <= maxSize;
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Download text as file
export function downloadAsFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Mock data for diverse file types with icons
export const mockFileTypes = [
  // Documents
  { type: 'pdf', name: 'Báo cáo phân tích dữ liệu Q3.pdf', size: 2450000, pageCount: 35 },
  { type: 'docx', name: 'Hợp đồng thuê văn phòng.docx', size: 1890000, pageCount: 12 },
  { type: 'txt', name: 'Ghi chú cuộc họp.txt', size: 45000, pageCount: 3 },
  { type: 'md', name: 'README - Hướng dẫn sử dụng.md', size: 28000, pageCount: 8 },
  
  // Spreadsheets
  { type: 'xlsx', name: 'Bảng tính doanh số.xlsx', size: 890000, pageCount: 25 },
  { type: 'csv', name: 'Danh sách khách hàng.csv', size: 156000, pageCount: 1 },
  
  // Presentations
  { type: 'pptx', name: 'Thuyết trình sản phẩm mới.pptx', size: 5600000, pageCount: 28 },
  
  // Images
  { type: 'png', name: 'Logo công ty.png', size: 234000, pageCount: 1 },
  { type: 'jpg', name: 'Ảnh sự kiện ra mắt.jpg', size: 1200000, pageCount: 1 },
  { type: 'svg', name: 'Biểu đồ tổ chức.svg', size: 89000, pageCount: 1 },
  
  // Web files
  { type: 'html', name: 'Trang chủ website.html', size: 67000, pageCount: 1 },
  { type: 'css', name: 'Stylesheet chính.css', size: 45000, pageCount: 1 },
  { type: 'js', name: 'Script xử lý form.js', size: 78000, pageCount: 1 },
  { type: 'ts', name: 'API utilities.ts', size: 92000, pageCount: 1 },
  
  // Programming
  { type: 'py', name: 'Machine learning model.py', size: 156000, pageCount: 1 },
  { type: 'java', name: 'Main application.java', size: 134000, pageCount: 1 },
  { type: 'cpp', name: 'Performance optimizer.cpp', size: 189000, pageCount: 1 },
  
  // Data files
  { type: 'json', name: 'Cấu hình hệ thống.json', size: 23000, pageCount: 1 },
  { type: 'xml', name: 'Metadata sản phẩm.xml', size: 67000, pageCount: 1 },
  
  // Archives
  { type: 'zip', name: 'Backup dữ liệu.zip', size: 45000000, pageCount: null },
  { type: 'rar', name: 'Tài liệu kỹ thuật.rar', size: 23000000, pageCount: null },
  
  // Media
  { type: 'mp4', name: 'Video hướng dẫn.mp4', size: 89000000, pageCount: null },
  { type: 'mp3', name: 'Podcast phỏng vấn.mp3', size: 12000000, pageCount: null },
  
  // Other
  { type: 'sketch', name: 'UI Design mockup.sketch', size: 4500000, pageCount: 15 },
  { type: 'figma', name: 'Prototype ứng dụng.fig', size: 2300000, pageCount: 8 },
];

// Pagination helper
export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function paginateArray<T>(
  array: T[], 
  options: PaginationOptions
): PaginationResult<T> {
  const { page, limit, total } = options;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = array.slice(startIndex, endIndex);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

