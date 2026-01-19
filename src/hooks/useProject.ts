import apiClient from '@/lib/api';
import { USE_MOCK_DATA, getMockProject, simulateDelay } from '@/lib/mockData';
import { Project } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useProject() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset state immediately when projectId changes
  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      setProject(null);
      setError(null);
    }
  }, [projectId]);

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
        // ========================================
        // 🔄 MOCK MODE - Sử dụng mock data
        // ========================================
        if (USE_MOCK_DATA) {
          await simulateDelay(300); // Simulate network delay
          const foundProject = getMockProject(projectId);
          if (foundProject) {
            setProject(foundProject);
          } else {
            setError('Không tìm thấy dự án');
          }
        } else {
          // Original API call
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