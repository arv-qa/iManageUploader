import { useQuery } from "@tanstack/react-query";
import { Tags } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { type Workspace, type DocumentMetadata, type MetadataField } from "@shared/schema";

interface MetadataFormProps {
  workspace: Workspace;
  metadata: DocumentMetadata;
  onMetadataChange: (metadata: DocumentMetadata) => void;
}

export default function MetadataForm({
  workspace,
  metadata,
  onMetadataChange,
}: MetadataFormProps) {
  const { data: metadataFields, isLoading } = useQuery<MetadataField[]>({
    queryKey: ['/api/workspaces', workspace.id, 'metadata'],
  });

  const handleFieldChange = (fieldName: string, value: string) => {
    onMetadataChange({
      ...metadata,
      [fieldName]: value,
    });
  };

  const renderField = (field: MetadataField) => {
    const value = (metadata as any)[field.name] || '';

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(newValue) => handleFieldChange(field.name, newValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="md:col-span-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              rows={3}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
            />
          </div>
        );

      default:
        return (
          <div key={field.name}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type="text"
              placeholder={`Enter ${field.label.toLowerCase()}`}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Tags className="text-primary mr-2" size={20} />
          Document Metadata
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {metadataFields?.map(renderField)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
