import apiClient from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  isArchived?: boolean;
  documentsCount?: number;
  chatsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export function useProject() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setError('Không tìm thấy ID dự án');
      setIsLoading(false);
      return;
    }

    const fetchProject = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.getProjects();
        if (response.data) {
          const foundProject = response.data.find((p: Project) => p.id === projectId);
          if (foundProject) {
            setProject(foundProject);
          } else {
            setError('Không tìm thấy dự án');
          }
        } else {
          setError('Lỗi khi tải dữ liệu dự án');
        }
      } catch (err) {
        setError('Lỗi kết nối đến server');
        console.error('Error fetching project:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return {
    projectId,
    project,
    isLoading,
    error,
    refetch: () => {
      if (projectId) {
        // Re-trigger fetch
        setIsLoading(true);
        setError(null);
      }
    }
  };
}