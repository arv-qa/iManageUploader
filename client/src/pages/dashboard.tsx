import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoginModal from "@/components/auth/login-modal";
import WorkflowStepper from "@/components/common/workflow-stepper";
import WorkspaceSelector from "@/components/workspace/workspace-selector";
import FileUploadArea from "@/components/upload/file-upload-area";
import MetadataForm from "@/components/upload/metadata-form";
import UploadProgress from "@/components/upload/upload-progress";
import { type Workspace, type DocumentMetadata } from "@shared/schema";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<DocumentMetadata>({});
  const [uploadSessionId, setUploadSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Check if user is authenticated
  const { data: user } = useQuery<{ id: string; username: string; serverUrl: string } | null>({
    queryKey: ['/api/auth/me'],
    enabled: isAuthenticated,
    retry: false,
  });

  const handleLogin = useCallback((success: boolean) => {
    setIsAuthenticated(success);
    if (success) {
      setCurrentStep(2);
    }
  }, []);

  const handleWorkspaceSelect = useCallback((workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setCurrentStep(3);
  }, []);

  const handleFilesSelect = useCallback((files: File[]) => {
    setSelectedFiles(files);
  }, []);

  const handleMetadataChange = useCallback((newMetadata: DocumentMetadata) => {
    setMetadata(newMetadata);
  }, []);

  const handleUploadStart = useCallback((sessionId: string) => {
    setUploadSessionId(sessionId);
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedFiles([]);
    setMetadata({});
    setUploadSessionId(null);
    setCurrentStep(selectedWorkspace ? 3 : 2);
  }, [selectedWorkspace]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} onLogout={() => setIsAuthenticated(false)} />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WorkflowStepper currentStep={currentStep} />
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <WorkspaceSelector 
              selectedWorkspace={selectedWorkspace}
              onWorkspaceSelect={handleWorkspaceSelect}
              disabled={!isAuthenticated}
            />
          </div>
          
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <FileUploadArea 
                selectedFiles={selectedFiles}
                onFilesSelect={handleFilesSelect}
                onFileRemove={(index) => {
                  setSelectedFiles(files => files.filter((_, i) => i !== index));
                }}
                disabled={!selectedWorkspace}
              />
              
              {selectedWorkspace && (
                <MetadataForm 
                  workspace={selectedWorkspace}
                  metadata={metadata}
                  onMetadataChange={handleMetadataChange}
                />
              )}
              
              <UploadProgress
                selectedFiles={selectedFiles}
                selectedWorkspace={selectedWorkspace}
                metadata={metadata}
                sessionId={uploadSessionId}
                onUploadStart={handleUploadStart}
                onClearAll={handleClearAll}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <LoginModal 
        isOpen={!isAuthenticated}
        onClose={() => setIsAuthenticated(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
