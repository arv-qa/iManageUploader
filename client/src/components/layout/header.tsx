import { CloudUpload, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  user?: { id: string; username: string; serverUrl: string } | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CloudUpload className="text-primary text-2xl" size={32} />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-foreground">iManage Bulk Upload</h1>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{user.username}</span>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {getInitials(user.username)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
