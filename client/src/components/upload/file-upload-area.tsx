import { useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FileUploadAreaProps {
  selectedFiles: File[];
  onFilesSelect: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  disabled?: boolean;
}

export default function FileUploadArea({
  selectedFiles,
  onFilesSelect,
  onFileRemove,
  disabled = false,
}: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const acceptedTypes = [
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.txt',
    '.csv'
  ];

  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File size exceeds 50MB limit`);
        return;
      }

      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedTypes.includes(extension)) {
        errors.push(`${file.name}: File type not supported`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      toast({
        variant: "destructive",
        title: "File validation errors",
        description: errors.join(', '),
      });
    }

    return validFiles;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      onFilesSelect([...selectedFiles, ...validFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return <FileText className="text-blue-500" size={16} />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Upload className="text-primary mr-2" size={20} />
          Upload Files
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            disabled
              ? "border-muted bg-muted/20 cursor-not-allowed"
              : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
          )}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="space-y-4">
            <div className={cn(
              "mx-auto w-16 h-16 rounded-full flex items-center justify-center",
              disabled ? "bg-muted" : "bg-primary/10"
            )}>
              <Upload className={cn(
                "text-2xl",
                disabled ? "text-muted-foreground" : "text-primary"
              )} size={32} />
            </div>
            <div>
              <p className={cn(
                "text-lg font-medium",
                disabled ? "text-muted-foreground" : "text-foreground"
              )}>
                {disabled ? "Select a workspace first" : "Drop files here or click to browse"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Support for PDF, DOC, XLS, TXT files up to 50MB each
              </p>
            </div>
            {!disabled && (
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Choose Files
              </Button>
            )}
          </div>
        </div>
        
        {selectedFiles.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-3">
              Selected Files ({selectedFiles.length})
            </h4>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.name)}
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-600">Ready</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFileRemove(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
