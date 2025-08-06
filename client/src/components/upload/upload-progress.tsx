import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Play, Trash2, CheckCircle, AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { type Workspace, type DocumentMetadata, type UploadProgress } from "@shared/schema";

interface UploadProgressProps {
  selectedFiles: File[];
  selectedWorkspace: Workspace | null;
  metadata: DocumentMetadata;
  sessionId: string | null;
  onUploadStart: (sessionId: string) => void;
  onClearAll: () => void;
}

export default function UploadProgress({
  selectedFiles,
  selectedWorkspace,
  metadata,
  sessionId,
  onUploadStart,
  onClearAll,
}: UploadProgressProps) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<string[]>([]);

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/upload/session", {
        workspaceId: selectedWorkspace?.id,
        totalFiles: selectedFiles.length,
        metadata,
      });
      return response.json();
    },
    onSuccess: (data) => {
      onUploadStart(data.id);
      uploadFilesMutation.mutate(data.id);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create upload session",
        description: error.message,
      });
    },
  });

  const uploadFilesMutation = useMutation({
    mutationFn: async (uploadSessionId: string) => {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch(`/api/upload/${uploadSessionId}/files`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      return response.json();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    },
  });

  const retryMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) throw new Error("No session ID");
      const response = await apiRequest("POST", `/api/upload/${sessionId}/retry`);
      return response.json();
    },
    onSuccess: () => {
      setErrors([]);
      toast({
        title: "Retry started",
        description: "Attempting to upload failed files again.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Retry failed",
        description: error.message,
      });
    },
  });

  // Poll for upload progress
  const { data: progress } = useQuery<UploadProgress>({
    queryKey: ['/api/upload', sessionId, 'progress'],
    enabled: !!sessionId,
    refetchInterval: sessionId && !['completed', 'failed'].includes(progress?.status || '') ? 1000 : false,
  });

  // Update errors when progress changes
  useEffect(() => {
    if (progress?.files) {
      const failedFiles = progress.files.filter(f => f.status === 'failed');
      const errorMessages = failedFiles.map(f => `${f.fileName}: ${f.errorMessage || 'Unknown error'}`);
      setErrors(errorMessages);
    }
  }, [progress]);

  const handleStartUpload = () => {
    if (!selectedWorkspace) {
      toast({
        variant: "destructive",
        title: "No workspace selected",
        description: "Please select a workspace before uploading.",
      });
      return;
    }

    if (selectedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please select files to upload.",
      });
      return;
    }

    createSessionMutation.mutate();
  };

  const isUploading = createSessionMutation.isPending || uploadFilesMutation.isPending;
  const canStartUpload = selectedFiles.length > 0 && selectedWorkspace && !sessionId;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Play className="text-primary mr-2" size={20} />
            Upload Controls
          </CardTitle>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleStartUpload}
              disabled={!canStartUpload || isUploading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Play className="mr-2" size={16} />
              Start Upload
            </Button>
            
            <Button
              variant="outline"
              onClick={onClearAll}
              disabled={isUploading}
            >
              <Trash2 className="mr-2" size={16} />
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {(sessionId || isUploading) && (
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Upload Progress</span>
            <span className="font-medium">
              {progress ? `${progress.completedFiles} of ${progress.totalFiles} files completed` : 'Initializing...'}
            </span>
          </div>
          
          <Progress value={progress?.progress || 0} className="w-full" />
          
          {progress?.files && (
            <div className="space-y-2">
              {progress.files.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md border",
                    file.status === 'completed' && "bg-green-50 border-green-200",
                    file.status === 'failed' && "bg-red-50 border-red-200",
                    file.status === 'uploading' && "bg-blue-50 border-blue-200"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {file.status === 'completed' && <CheckCircle className="text-green-600" size={16} />}
                    {file.status === 'failed' && <AlertCircle className="text-red-600" size={16} />}
                    {file.status === 'uploading' && <Loader2 className="text-blue-600 animate-spin" size={16} />}
                    <span className="text-sm font-medium">{file.fileName}</span>
                  </div>
                  <span
                    className={cn(
                      "text-sm",
                      file.status === 'completed' && "text-green-600",
                      file.status === 'failed' && "text-red-600",
                      file.status === 'uploading' && "text-blue-600"
                    )}
                  >
                    {file.status === 'completed' && 'Completed'}
                    {file.status === 'failed' && 'Failed'}
                    {file.status === 'uploading' && 'Uploading...'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}

      {errors.length > 0 && (
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <h4 className="font-semibold">Upload Errors Detected</h4>
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <div key={index} className="text-sm">{error}</div>
                  ))}
                </div>
                <div className="flex space-x-3 mt-4">
                  <Button
                    size="sm"
                    onClick={() => retryMutation.mutate()}
                    disabled={retryMutation.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {retryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <RotateCcw className="mr-2" size={16} />
                    Retry Failed Uploads
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setErrors([])}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}
