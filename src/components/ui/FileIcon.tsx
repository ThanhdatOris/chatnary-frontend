import { cn, getFileIcon } from '@/lib/utils';

interface FileIconProps {
  fileType: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
}

export default function FileIcon({ 
  fileType, 
  size = 'md', 
  className,
  alt 
}: FileIconProps) {
  return (
    <img 
      src={getFileIcon(fileType)}
      alt={alt || `${fileType} file`}
      className={cn(
        'file-icon',
        `file-icon-${size}`,
        className
      )}
    />
  );
}