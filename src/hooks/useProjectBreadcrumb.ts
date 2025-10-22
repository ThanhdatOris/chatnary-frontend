'use client';

import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { useEffect } from 'react';

// Hook để set project name mặc định cho demo
export function useProjectBreadcrumb() {
  const { setProjectName } = useBreadcrumb();

  useEffect(() => {
    // Set default project name nếu chưa có
    setProjectName('BSH Project');
  }, [setProjectName]);
}

export default useProjectBreadcrumb;