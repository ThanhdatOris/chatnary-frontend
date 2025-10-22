'use client';

import HeaderButton from '@/components/layout/HeaderButton';
import MainLayout from '@/components/layout/MainLayout';
import { Button, Card, FileIcon, Loading } from '@/components/ui';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { useChats } from '@/contexts/ChatContext';
import { useProject } from '@/hooks/useProject';
import apiClient, { chatsApi, Document, documentsApi } from '@/lib/api';
import { MessageSquare } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');
  const { addChat } = useChats();
  
  // Get project data and set breadcrumb context  
  const { project } = useProject();
  const { setProjectName, setProjectColor } = useBreadcrumb();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Set project name and color for breadcrumb when project loads
  useEffect(() => {
    if (project?.name) {
      setProjectName(project.name);
    }
    if (project?.color) {
      setProjectColor(project.color);
    }
  }, [project, setProjectName, setProjectColor]);

  // Auto-select first project if no project is specified
  useEffect(() => {
    const loadProjects = async () => {
      if (!projectId) {
        try {
          setLoadingProjects(true);
          const response = await apiClient.getProjects();
          
          if (response.success && response.data && response.data.length > 0) {
            setAvailableProjects(response.data);
            // Auto-redirect to first project
            const firstProject = response.data[0];
            router.push(`/chat?project=${firstProject.id}`);
          } else {
            // No projects available, redirect to home
            router.push('/');
          }
        } catch (err) {
          console.error('Failed to load projects:', err);
          router.push('/');
        } finally {
          setLoadingProjects(false);
        }
      }
    };

    loadProjects();
  }, [projectId, router]);

  useEffect(() => {
    if (projectId) {
      fetchDocuments();
    }
  }, [projectId]);

  const fetchDocuments = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      console.log('Fetching documents for project:', projectId);
      const response = await documentsApi.getProjectDocuments(projectId);
      
      if (response.success && response.data) {
        const completedDocs = response.data.filter(doc => doc.status === 'processed');
        setDocuments(completedDocs);
        console.log('Loaded documents:', completedDocs.length);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDoc = (docId: string) => {
    setSelectedDocs(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleCreateChat = async () => {
    if (selectedDocs.length === 0 || !projectId) {
      console.error('Cannot create chat: missing selectedDocs or projectId', {
        selectedDocs: selectedDocs.length,
        projectId
      });
      return;
    }

    setCreating(true);
    try {
      console.log('Creating chat for project:', projectId);
      console.log('Request payload:', {
        project_id: projectId,
        title: 'Chat mới',
      });
      
      const response = await chatsApi.createChat({
        project_id: projectId,
        title: 'Chat mới',
      });
      
      console.log('Create chat response:', response);
      
      if (response.success && response.data) {
        addChat(response.data); // Add to global state
        console.log('Chat created successfully:', response.data.id);
        router.push(`/chat/${response.data.id}?project=${projectId}`);
      } else {
        console.error('Create chat failed:', response.error);
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
    } finally {
      setCreating(false);
    }
  };

  if (!projectId || loadingProjects) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading size="lg" text="Đang tải..." />
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout
        headerTitle="Tạo cuộc trò chuyện mới"
        headerSubtitle="Chọn tài liệu bạn muốn trò chuyện"
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading size="lg" text="Đang tải tài liệu..." />
        </div>
      </MainLayout>
    );
  }

  const actionButton = (
    <HeaderButton
      variant="primary"
      icon={<MessageSquare className="w-4 h-4" />}
      onClick={handleCreateChat}
      disabled={selectedDocs.length === 0 || creating}
      isLoading={creating}
    >
      {selectedDocs.length === 0
        ? 'Chọn tài liệu'
        : `Bắt đầu chat với ${selectedDocs.length} tài liệu`}
    </HeaderButton>
  );

  return (
    <MainLayout
      headerTitle="Tạo cuộc trò chuyện mới"
      headerSubtitle="Chọn tài liệu bạn muốn trò chuyện"
      headerActions={selectedDocs.length > 0 ? actionButton : undefined}
    >
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">

        {documents.length === 0 ? (
          <Card variant="bordered" className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Chưa có tài liệu nào
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload tài liệu để bắt đầu trò chuyện
            </p>
            <Button onClick={() => router.push(`/documents?project=${projectId}`)}>
              Upload tài liệu
            </Button>
          </Card>
        ) : (
          <>
            {/* Document Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  variant="bordered"
                  className={`cursor-pointer transition-all ${
                    selectedDocs.includes(doc.id)
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:shadow-md'
                  }`}
                >
                  <label 
                    className="flex items-start gap-3 p-4 cursor-pointer w-full"
                    htmlFor={`doc-${doc.id}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <input
                        id={`doc-${doc.id}`}
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => handleToggleDoc(doc.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                        aria-label={`Chọn tài liệu ${doc.name}`}
                      />
                    </div>
                    <FileIcon 
                      fileType={doc.mimeType || 'unknown'}
                      size="md"
                      className="flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tài liệu
                      </p>
                    </div>
                  </label>
                </Card>
              ))}
            </div>
          </>
        )}
        </div>
      </div>
    </MainLayout>
  );
}

