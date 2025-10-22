'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  isActive?: boolean;
}

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[] | ((prev: BreadcrumbItem[]) => BreadcrumbItem[])) => void;
  addBreadcrumb: (item: BreadcrumbItem) => void;
  updateBreadcrumb: (index: number, item: Partial<BreadcrumbItem>) => void;
  clearBreadcrumbs: () => void;
  projectName?: string;
  projectColor?: string;
  setProjectName: (name: string) => void;
  setProjectColor: (color: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export function BreadcrumbProvider({ children }: BreadcrumbProviderProps) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [projectName, setProjectName] = useState<string>();
  const [projectColor, setProjectColor] = useState<string>('#3b82f6'); // default blue

  const addBreadcrumb = (item: BreadcrumbItem) => {
    setBreadcrumbs(prev => [...prev, item]);
  };

  const updateBreadcrumb = (index: number, item: Partial<BreadcrumbItem>) => {
    setBreadcrumbs(prev => prev.map((breadcrumb, i) => 
      i === index ? { ...breadcrumb, ...item } : breadcrumb
    ));
  };

  const clearBreadcrumbs = () => {
    setBreadcrumbs([]);
  };

  return (
    <BreadcrumbContext.Provider value={{
      breadcrumbs,
      setBreadcrumbs,
      addBreadcrumb,
      updateBreadcrumb,
      clearBreadcrumbs,
      projectName,
      projectColor,
      setProjectName,
      setProjectColor,
    }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
}