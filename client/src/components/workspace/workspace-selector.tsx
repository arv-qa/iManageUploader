import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FolderOpen, Search, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type Workspace } from "@shared/schema";

interface WorkspaceSelectorProps {
  selectedWorkspace: Workspace | null;
  onWorkspaceSelect: (workspace: Workspace) => void;
  disabled?: boolean;
}

export default function WorkspaceSelector({
  selectedWorkspace,
  onWorkspaceSelect,
  disabled = false,
}: WorkspaceSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: workspaces, isLoading } = useQuery<Workspace[]>({
    queryKey: ['/api/workspaces'],
    enabled: !disabled,
  });

  const filteredWorkspaces = workspaces?.filter(workspace =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workspace.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (disabled) {
    return (
      <Card className="h-fit opacity-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FolderOpen className="text-primary mr-2" size={20} />
            Select Workspace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please authenticate first to view workspaces.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <FolderOpen className="text-primary mr-2" size={20} />
          Select Workspace
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            type="text"
            placeholder="Search workspaces..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 border rounded-md space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          ) : filteredWorkspaces.length === 0 ? (
            <div className="p-3 text-center text-muted-foreground">
              {searchTerm ? "No workspaces found matching your search." : "No workspaces available."}
            </div>
          ) : (
            filteredWorkspaces.map((workspace) => (
              <div
                key={workspace.id}
                className={cn(
                  "p-3 border rounded-md cursor-pointer transition-colors",
                  "hover:border-primary hover:bg-primary/5",
                  selectedWorkspace?.id === workspace.id && "border-primary bg-primary/5"
                )}
                onClick={() => onWorkspaceSelect(workspace)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{workspace.name}</h4>
                    {workspace.description && (
                      <p className="text-sm text-muted-foreground">{workspace.description}</p>
                    )}
                  </div>
                  {selectedWorkspace?.id === workspace.id && (
                    <Check className="text-primary" size={16} />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
