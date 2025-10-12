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
  
  if (type.includes('pdf')) iconName = 'pdf2';
  else if (type.includes('word') || type.includes('document') || type.includes('docx')) iconName = 'word2';
  else if (type.includes('text') || type.includes('txt')) iconName = 'text';
  else if (type.includes('markdown') || type.includes('md')) iconName = 'markdown';
  else if (type.includes('excel') || type.includes('xlsx') || type.includes('xls')) iconName = 'excel2';
  else if (type.includes('powerpoint') || type.includes('pptx') || type.includes('ppt')) iconName = 'powerpoint2';
  else if (type.includes('image') || type.includes('png') || type.includes('jpg') || type.includes('jpeg') || type.includes('gif') || type.includes('svg')) iconName = 'image';
  else if (type.includes('json')) iconName = 'json';
  else if (type.includes('xml')) iconName = 'xml';
  else if (type.includes('csv')) iconName = 'csv';
  else if (type.includes('zip') || type.includes('rar') || type.includes('7z')) iconName = 'zip';
  else if (type.includes('video') || type.includes('mp4') || type.includes('avi') || type.includes('mov')) iconName = 'video';
  else if (type.includes('audio') || type.includes('mp3') || type.includes('wav') || type.includes('flac')) iconName = 'audio';
  else if (type.includes('html') || type.includes('htm')) iconName = 'html';
  else if (type.includes('css')) iconName = 'css';
  else if (type.includes('javascript') || type.includes('js')) iconName = 'js';
  else if (type.includes('typescript') || type.includes('ts')) iconName = 'typescript';
  else if (type.includes('python') || type.includes('py')) iconName = 'python';
  
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

